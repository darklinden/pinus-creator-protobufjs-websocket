import { director, EventTarget, ISchedulable, warn, log, error, macro, random, Scheduler, sys } from "cc";
import { Structs } from "./structs/Structs";

export namespace Pomelo {

    export class Events {
        public static CONNECTED: string = 'pomelo.network.connected';
        public static RECONNECTED: string = 'pomelo.network.reconnected';
        public static CLOSED: string = 'pomelo.network.closed';
        public static ERROR: string = 'pomelo.network.error';
        public static HANDSHAKEERROR: string = 'pomelo.network.handshakeerror';
        public static HANDSHAKEOVER: string = 'pomelo.network.handshakeover';
        public static BEENKICKED: string = 'pomelo.network.beenkicked';
    }

    var PKG_HEAD_BYTES = 4;
    var MSG_FLAG_BYTES = 1;
    var MSG_ROUTE_CODE_BYTES = 2;
    var MSG_ID_MAX_BYTES = 5;
    var MSG_ROUTE_LEN_BYTES = 1;

    var MSG_ROUTE_CODE_MAX = 0xffff;

    var MSG_COMPRESS_ROUTE_MASK = 0x1;
    var MSG_COMPRESS_GZIP_MASK = 0x1;
    var MSG_COMPRESS_GZIP_ENCODE_MASK = 1 << 4;
    var MSG_TYPE_MASK = 0x7;

    export class Protocol {

        /**
         * pomele client encode
         * id message id;
         * route message route
         * msg message body
         * socketio current support string
         */
        static strencode(str: string): Uint8Array {
            var byteArray = new Uint8Array(str.length * 3);
            var offset = 0;
            for (var i = 0; i < str.length; i++) {
                var charCode = str.charCodeAt(i);
                var codes = null;
                if (charCode <= 0x7f) {
                    codes = [charCode];
                } else if (charCode <= 0x7ff) {
                    codes = [0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f)];
                } else {
                    codes = [0xe0 | (charCode >> 12), 0x80 | ((charCode & 0xfc0) >> 6), 0x80 | (charCode & 0x3f)];
                }
                for (var j = 0; j < codes.length; j++) {
                    byteArray[offset] = codes[j];
                    ++offset;
                }
            }
            var _buffer = new Uint8Array(offset);
            copyArray(_buffer, 0, byteArray, 0, offset);
            return _buffer;
        }

        /**
         * client decode
         * msg String data
         * return Message Object
         */
        static strdecode(buffer: ArrayBuffer): string {
            var bytes = new Uint8Array(buffer);
            var array = [];
            var offset = 0;
            var charCode = 0;
            var end = bytes.length;
            while (offset < end) {
                if (bytes[offset] < 128) {
                    charCode = bytes[offset];
                    offset += 1;
                } else if (bytes[offset] < 224) {
                    charCode = ((bytes[offset] & 0x1f) << 6) + (bytes[offset + 1] & 0x3f);
                    offset += 2;
                } else {
                    charCode = ((bytes[offset] & 0x0f) << 12) + ((bytes[offset + 1] & 0x3f) << 6) + (bytes[offset + 2] & 0x3f);
                    offset += 3;
                }
                array.push(charCode);
            }
            return String.fromCharCode.apply(null, array);
        }
    }

    export class Package {
        static TYPE_HANDSHAKE = 1;
        static TYPE_HANDSHAKE_ACK = 2;
        static TYPE_HEARTBEAT = 3;
        static TYPE_DATA = 4;
        static TYPE_KICK = 5;

        /**
         * Package protocol encode.
         *
         * Pomelo package format:
         * +------+-------------+------------------+
         * | type | body length |       body       |
         * +------+-------------+------------------+
         *
         * Head: 4bytes
         *   0: package type,
         *      1 - handshake,
         *      2 - handshake ack,
         *      3 - heartbeat,
         *      4 - data
         *      5 - kick
         *   1 - 3: big-endian body length
         * Body: body length bytes
         *
         * @param  {Number}    type   package type
         * @param  {Uint8Array} body   body content in bytes
         * @return {Uint8Array}        new byte array that contains encode result
         */
        static encode(type: number, body?: Uint8Array): Uint8Array {
            var length = body ? body.length : 0;
            var buffer = new Uint8Array(PKG_HEAD_BYTES + length);
            var index = 0;
            buffer[index++] = type & 0xff;
            buffer[index++] = (length >> 16) & 0xff;
            buffer[index++] = (length >> 8) & 0xff;
            buffer[index++] = length & 0xff;
            if (body) {
                copyArray(buffer, index, body, 0, length);
            }
            return buffer;
        }

        /**
         * Package protocol decode.
         * See encode for package format.
         *
         * @param  {Uint8Array} buffer byte array containing package content
         * @return {Object}           {type: package type, buffer: body byte array}
         */
        static decode(buffer: ArrayBuffer): { type: number, body?: Uint8Array } | { type: number, body?: Uint8Array }[] {
            var offset = 0;
            var bytes = new Uint8Array(buffer);
            var length = 0;
            var rs = [];
            while (offset < bytes.length) {
                var type = bytes[offset++];
                length = ((bytes[offset++]) << 16 | (bytes[offset++]) << 8 | bytes[offset++]) >>> 0;
                var body = length ? new Uint8Array(length) : null;
                if (body) {
                    copyArray(body, 0, bytes, offset, length);
                }
                offset += length;
                rs.push({ 'type': type, 'body': body });
            }
            return rs.length === 1 ? rs[0] : rs;
        }
    }

    export class Message {
        static TYPE_REQUEST = 0;
        static TYPE_NOTIFY = 1;
        static TYPE_RESPONSE = 2;
        static TYPE_PUSH = 3;

        /**
         * Message protocol encode.
         *
         * @param  {Number} id            message id
         * @param  {Number} type          message type
         * @param  {Number} compressRoute whether compress route
         * @param  {Number|String} route  route code or route string
         * @param  {Buffer} msg           message body bytes
         * @return {Buffer}               encode result
         */
        static encode(id: number, type: number, compressRoute: number, route: number | string, msg: Uint8Array, compressGzip: number = 0): Uint8Array {
            // caculate message max length
            var idBytes = msgHasId(type) ? caculateMsgIdBytes(id) : 0;
            var msgLen = MSG_FLAG_BYTES + idBytes;

            if (msgHasRoute(type)) {
                if (compressRoute) {
                    if (typeof route !== 'number') {
                        throw new Error('error flag for number route!');
                    }
                    msgLen += MSG_ROUTE_CODE_BYTES;
                } else {
                    msgLen += MSG_ROUTE_LEN_BYTES;
                    if (route) {
                        let routebuf = Protocol.strencode(route as string);
                        if (routebuf.length > 255) {
                            throw new Error('route maxlength is overflow');
                        }
                        msgLen += routebuf.length;
                    }
                }
            }

            if (msg) {
                msgLen += msg.length;
            }

            var buffer = new Uint8Array(msgLen);
            var offset = 0;

            // add flag
            offset = encodeMsgFlag(type, compressRoute, buffer, offset, compressGzip);

            // add message id
            if (msgHasId(type)) {
                offset = encodeMsgId(id, buffer, offset);
            }

            // add route
            if (msgHasRoute(type)) {
                offset = encodeMsgRoute(compressRoute, route, buffer, offset);
            }

            // add body
            if (msg) {
                offset = encodeMsgBody(msg, buffer, offset);
            }

            return buffer;
        }

        /**
         * Message protocol decode.
         *
         * @param  {Buffer|Uint8Array} buffer message bytes
         * @return {Object}            message object
         */
        static decode(buffer: string | ArrayBuffer): {
            id: number,
            type: number,
            compressRoute: number,
            route: number | string,
            body: Uint8Array,
            compressGzip: number
        } {
            var bytes = typeof buffer == 'string' ? new TextEncoder().encode(buffer) : new Uint8Array(buffer);
            var bytesLen = bytes.length || bytes.byteLength;
            var offset = 0;
            var id = 0;
            var route = null;

            // parse flag
            var flag = bytes[offset++];
            var compressRoute = flag & MSG_COMPRESS_ROUTE_MASK;
            var type = (flag >> 1) & MSG_TYPE_MASK;
            var compressGzip = (flag >> 4) & MSG_COMPRESS_GZIP_MASK;

            // parse id
            if (msgHasId(type)) {
                var m = 0;
                var i = 0;
                do {
                    m = parseInt(bytes[offset] + '');
                    id += (m & 0x7f) << (7 * i);
                    offset++;
                    i++;
                } while (m >= 128);
            }

            // parse route
            if (msgHasRoute(type)) {
                if (compressRoute) {
                    route = (bytes[offset++]) << 8 | bytes[offset++];
                } else {
                    var routeLen = bytes[offset++];
                    if (routeLen) {
                        route = new Uint8Array(routeLen);
                        copyArray(route, 0, bytes, offset, routeLen);
                        route = Protocol.strdecode(route);
                    } else {
                        route = '';
                    }
                    offset += routeLen;
                }
            }

            // parse body
            var bodyLen = bytesLen - offset;
            var body = new Uint8Array(bodyLen);

            copyArray(body, 0, bytes, offset, bodyLen);

            return {
                id: id,
                type: type,
                compressRoute: compressRoute,
                route: route,
                body: body,
                compressGzip: compressGzip
            }
        }
    }

    function copyArray(dest: Uint8Array, doffset: number, src: Uint8Array | string, soffset: number, length: number): void {
        // Uint8Array
        if (typeof src == 'string') {
            for (var index = 0; index < length; index++) {
                dest[doffset++] = parseInt(src[soffset++]);
            }
        }
        else {
            for (var index = 0; index < length; index++) {
                dest[doffset++] = src[soffset++];
            }
        }
    };

    function msgHasId(type: number): boolean {
        return type === Message.TYPE_REQUEST || type === Message.TYPE_RESPONSE;
    };

    function msgHasRoute(type: number): boolean {
        return type === Message.TYPE_REQUEST || type === Message.TYPE_NOTIFY ||
            type === Message.TYPE_PUSH;
    };

    function caculateMsgIdBytes(id: number): number {
        var len = 0;
        do {
            len += 1;
            id >>= 7;
        } while (id > 0);
        return len;
    };

    function encodeMsgFlag(type: number, compressRoute: number, buffer: Uint8Array, offset: number, compressGzip: number): number {
        if (type !== Message.TYPE_REQUEST && type !== Message.TYPE_NOTIFY &&
            type !== Message.TYPE_RESPONSE && type !== Message.TYPE_PUSH) {
            throw new Error('unkonw message type: ' + type);
        }

        buffer[offset] = (type << 1) | (compressRoute ? 1 : 0);

        if (compressGzip) {
            buffer[offset] = buffer[offset] | MSG_COMPRESS_GZIP_ENCODE_MASK;
        }

        return offset + MSG_FLAG_BYTES;
    };

    function encodeMsgId(id: number, buffer: Uint8Array, offset: number): number {
        do {
            var tmp = id % 128;
            var next = Math.floor(id / 128);

            if (next !== 0) {
                tmp = tmp + 128;
            }
            buffer[offset++] = tmp;

            id = next;
        } while (id !== 0);

        return offset;
    };

    function encodeMsgRoute(compressRoute: number, route: number | string, buffer: Uint8Array, offset: number): number {
        if (compressRoute) {

            if (route > MSG_ROUTE_CODE_MAX) {
                throw new Error('route number is overflow');
            }

            buffer[offset++] = (route as number >> 8) & 0xff;
            buffer[offset++] = route as number & 0xff;
        } else {
            if (route) {
                buffer[offset++] = (route as string).length & 0xff;
                copyArray(buffer, offset, route as string, 0, (route as string).length);
                offset += (route as string).length;
            } else {
                buffer[offset++] = 0;
            }
        }

        return offset;
    };

    function encodeMsgBody(msg: Uint8Array, buffer: Uint8Array, offset: number): number {
        copyArray(buffer, offset, msg, 0, msg.length);
        return offset + msg.length;
    };

    const CONNECT_TIMEOUT = 3;

    export class SocketClient implements ISchedulable {

        // ISchedulable
        private _id: string = null;
        public get uuid(): string {
            if (!this._id) this._id = 'SocketClient-' + new Date().getTime() + '-' + (random() * 100);
            return this._id;
        }

        private _manuallyClose: boolean;
        private _connectPassed: number;

        private _ws: WebSocket;
        public isConnected: boolean;
        public url: string;

        private _networkHandle: Network = null;

        constructor(networkHandle: Network) {
            this._networkHandle = networkHandle;
            this._manuallyClose = false;
            this._connectPassed = 0;
        }

        public connect(url: string) {
            log(String.timestr(), 'SocketClient.connect ' + url);

            this._ws = null;
            this._manuallyClose = false;
            this.isConnected = false;
            this.url = url;

            this.initSocket();
        }

        private connectTimeoutChecker(dt: number) {
            this._connectPassed += dt;
            if (this._connectPassed > CONNECT_TIMEOUT) {
                error(String.timestr(), 'SocketClient connect Timeout: ' + this.url);
                director.getScheduler().unschedule(this.connectTimeoutChecker, this);

                this.close();
                this._networkHandle.connectTimeout(this);
            }
        }

        private onOpen(evt: any) {
            this._connectPassed = 0;
            director.getScheduler().unschedule(this.connectTimeoutChecker, this);

            this.isConnected = true;

            log(String.timestr(), 'SocketClient.onOpen ' + this.url);
            this._networkHandle.onOpen(this);
        }

        private onClose(evt: any) {
            log(String.timestr(), 'SocketClient.onClose ' + this.url);
            if (!this._manuallyClose) {
                this._networkHandle.onClose(this);
            }
            this.close();
        }

        private onErr(evt: any) {
            log(String.timestr(), 'SocketClient.onErr ' + this.url);
            error(JSON.stringify(evt));
            if (!this._manuallyClose) {
                this._networkHandle.onErr(this);
            }
            this.close();
        }

        private onRecv(evt: any) {
            this._networkHandle.onRecv(this, evt.data);
        }

        private initSocket() {

            this._manuallyClose = false;
            this._connectPassed = 0;
            director.getScheduler().schedule(this.connectTimeoutChecker, this, 0.1, macro.REPEAT_FOREVER);
            log(String.timestr(), 'SocketClient.initSocket ' + this.url);

            try {
                this._ws = new WebSocket(this.url);
                this._ws.binaryType = 'arraybuffer';
                this._ws.onopen = this.onOpen.bind(this);
                this._ws.onclose = this.onClose.bind(this);
                this._ws.onerror = this.onErr.bind(this);
                this._ws.onmessage = this.onRecv.bind(this);
            }
            catch (e) {
                log(String.timestr(), 'SocketClient.initSocket error ' + this.url);
                error(JSON.stringify(e));
                this.close();

                this._networkHandle.onErr(this);
            }
        }

        public sendBuffer(buffer: Uint8Array) {
            if (this._ws) {
                try {
                    this._ws.send(buffer ? buffer.buffer : null);
                }
                catch (e) {
                    log(String.timestr(), 'SocketClient.sendMsg error ' + this.url);
                    error(JSON.stringify(e));

                    this.close();
                    this._networkHandle.onErr(this);
                }
            }
            else {
                if (!this._manuallyClose) {
                    this._networkHandle.onErr(this);
                }
                this.close();
            }
        }

        public close() {
            this._manuallyClose = true;
            this.isConnected = false;

            if (this._ws) {
                const isNative = sys.platform == sys.Platform.ANDROID || sys.platform == sys.Platform.IOS;

                if (!isNative) {
                    this._ws.onopen = null;
                    this._ws.onclose = null;
                    this._ws.onerror = null;
                    this._ws.onmessage = null;
                }

                this._ws.close();

                if (isNative) {
                    this._ws.onopen = null;
                    this._ws.onclose = null;
                    this._ws.onerror = null;
                    this._ws.onmessage = null;
                }

                this._ws = null;
            }
        }
    }

    const JS_WS_CLIENT_TYPE = 'js-websocket';
    const JS_WS_CLIENT_VERSION = '0.0.1';
    const RES_OK = 200;
    const RES_FAIL = 500;
    const RES_OLD_CLIENT = 501;
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_TIMEOUT = 5;

    export interface IHandshakeBuffer {
        sys: {
            type: string,
            version: string,
            rsa: any
        };
        user: any;
    }

    export class Network extends EventTarget implements ISchedulable {

        // --- EventTarget begin ---

        event(name: string, data: any = null) {
            if (this.hasEventListener(name)) {
                this.emit(name, data);
            }
            else {
                warn('Network.passPack [' + name + '] no listener')
            }
        }
        // --- EventTarget end ---

        // --- instance begin ---
        private static _instance: Network = null;
        public static get instance(): Network {
            if (!this._instance) this._instance = new Network();
            return this._instance;
        }
        // --- instance end ---

        // --- ISchedulable begin ---
        private _id: string = null;
        public get uuid(): string {
            if (!this._id) this._id = 'Network-' + new Date().getTime();
            return this._id;
        }
        // --- ISchedulable end ---

        private _client: SocketClient = null;
        public get client(): SocketClient { return this._client; }

        private _reconnectEnable: boolean = false;
        private _reconnecting: boolean = false;
        private _reconnectAttempts: number = 0;

        private _heartbeatPassed: number = 0;
        private _heartbeatInterval: number = 0;
        private _heartbeatTimeout: number;
        private _shouldHeartbeat: boolean = false;

        private _requestId: number = 1;
        public get uniqueRequestId(): number {
            this._requestId++;
            if (this._requestId >= 40000) this._requestId = 1;
            return this._requestId;
        }

        // Map from request id to route
        _requestRouteMap: Map<number, number | string> = new Map();
        // callback from request id
        _requestCallbackMap: Map<number, (data: any) => void> = new Map();

        _handshakeBuffer: IHandshakeBuffer = {
            sys: {
                type: JS_WS_CLIENT_TYPE,
                version: JS_WS_CLIENT_VERSION,
                rsa: {}
            },
            user: {}
        };

        _routeMap: Map<string, number> = null;
        _routeMapBack: Map<number, string> = null;

        constructor() {
            super();
            this._client = new SocketClient(this);
            Scheduler.enableForTarget(this);
            director.getScheduler().schedule(this.heartbeatCheck, this, 0.1, macro.REPEAT_FOREVER, 0, false);
        }

        // --- Socket begin ---
        onOpen(socket: SocketClient) {
            if (this._reconnecting) {
                this.event(Events.RECONNECTED);
            }
            this.event(Events.CONNECTED);
            this.resetReconnect();
            var obj = Package.encode(Package.TYPE_HANDSHAKE, Protocol.strencode(JSON.stringify(this._handshakeBuffer)));
            this.client.sendBuffer(obj);
        }

        onRecv(socket: SocketClient, data: ArrayBuffer) {
            this.processPackage(Package.decode(data));

            // new package arrived, update the heartbeat timeout
            this.renewHeartbeatTimeout();
        }

        onErr(socket: SocketClient) {
            this.event(Events.ERROR);
        }

        onClose(socket: SocketClient) {
            this.event(Events.CLOSED);
            if (this._reconnectEnable && this._reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                this._reconnecting = true;
                this._reconnectAttempts++;
                this._connect();
            }
        }

        connectTimeout(socket: SocketClient) {
            this.event(Events.ERROR);
            if (this._reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                this._reconnecting = true;
                this._reconnectAttempts++;
                this._connect();
            }
        }
        // --- Socket end ---

        private resetReconnect() {
            this._reconnecting = false;
            this._reconnectAttempts = 0;
        }

        private renewHeartbeatTimeout() {
            this._heartbeatPassed = 0;
        }

        private handshake(data: ArrayBuffer) {
            const d: { code: number, sys: { heartbeat: number, dict: any } } = JSON.parse(Protocol.strdecode(data));
            if (d && d.code === RES_OLD_CLIENT) {
                this.event(Events.HANDSHAKEERROR);
                return;
            }

            if (d && d.code !== RES_OK) {
                this.event(Events.HANDSHAKEERROR);
                return;
            }

            if (d && d.sys && d.sys.heartbeat) {
                this._heartbeatInterval = d.sys.heartbeat;              // heartbeat interval
                this._heartbeatTimeout = this._heartbeatInterval * 2;   // max heartbeat timeout
            } else {
                this._heartbeatInterval = 0;
                this._heartbeatTimeout = 0;
            }

            if (d && d.sys) {
                const dict = d.sys.dict;

                // Init compress dict
                if (dict) {
                    this._routeMap = new Map();
                    this._routeMapBack = new Map();
                    for (const key in dict) {
                        if (Object.prototype.hasOwnProperty.call(dict, key)) {
                            const value: number = dict[key];
                            this._routeMap.set(key, value);
                            this._routeMapBack.set(value, key);
                        }
                    }
                }
            }

            this.client.sendBuffer(Package.encode(Package.TYPE_HANDSHAKE_ACK));
            this.event(Events.HANDSHAKEOVER);
        }

        private heartbeat(data: ArrayBuffer) {
            if (!this._heartbeatInterval) {
                // no heartbeat
                return;
            }

            this._shouldHeartbeat = true;
        }

        private heartbeatCheck(dt: number) {
            if (!this._heartbeatInterval) return;

            if (!this._client.isConnected) {
                this._heartbeatPassed = 0;
                return;
            }

            this._heartbeatPassed += dt;

            if (this._shouldHeartbeat) {
                if (this._heartbeatPassed > this._heartbeatInterval) {
                    this.client.sendBuffer(Package.encode(Package.TYPE_HEARTBEAT));
                    this.renewHeartbeatTimeout();
                }
                return;
            }

            if (this._heartbeatPassed > this._heartbeatTimeout) {
                console.error('server heartbeat timeout');
                if (this._reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                    this._reconnecting = true;
                    this._reconnectAttempts++;
                    this._connect();
                }
            }
        }

        private onData(data: ArrayBuffer) {
            const msg = this.decode(data);

            if (!msg) {
                console.error('onData decode failed');
                return;
            }

            if (msg.id) {
                // if have a id then find the callback function with the request
                var cb = this._requestCallbackMap.get(msg.id);
                this._requestCallbackMap.delete(msg.id);
                cb && cb(msg.body);
                return;
            }

            // server push message
            this.event(msg.route as string, msg.body);
        }

        onKick(data: ArrayBuffer) {
            data = JSON.parse(Protocol.strdecode(data));
            this.event(Events.BEENKICKED, data);
        }

        private _messageHandlers: Map<number, (data: ArrayBuffer) => void> = null;
        get messageHandlers(): Map<number, (data: ArrayBuffer) => void> {
            if (!this._messageHandlers) {
                this._messageHandlers = new Map();
                this._messageHandlers.set(Package.TYPE_HANDSHAKE, this.handshake.bind(this));
                this._messageHandlers.set(Package.TYPE_HEARTBEAT, this.heartbeat.bind(this));
                this._messageHandlers.set(Package.TYPE_DATA, this.onData.bind(this));
                this._messageHandlers.set(Package.TYPE_KICK, this.onKick.bind(this));
            }
            return this._messageHandlers;
        }

        private processPackage(msgs: { type: number, body?: Uint8Array } | { type: number, body?: Uint8Array }[]) {
            if (Array.isArray(msgs)) {
                for (var i = 0; i < msgs.length; i++) {
                    var msg = msgs[i];
                    this.messageHandlers.get(msg.type)(msg.body);
                }
            } else {
                this.messageHandlers.get(msgs.type)(msgs.body);
            }
        }

        private _url: string = null;
        private _connect(url: string = null): void {
            this._closeConnet();

            this._url = url || this._url;
            this.client.connect(this._url);
        }

        public static connect(url: string): void {
            this.instance._connect(url);
        }

        private _closeConnet(): void {
            this._reconnecting = false;
            this.client.close();
        }

        public static closeConnet(): void {
            this.instance._closeConnet();
        }

        public packProto(data: any, protoStruct: any): Uint8Array {
            let buffer: Uint8Array = null;
            if (data && protoStruct) {
                let message: any = null;
                if (protoStruct) {
                    message = protoStruct.create(data);
                    buffer = protoStruct.encode(message).finish();
                }
            }
            return buffer;
        }

        public parseProto(buffer: Uint8Array, protoStruct: any): any {
            let decoded: any = null;
            if (buffer && buffer.length && protoStruct) {
                try {
                    decoded = protoStruct.decode(buffer);
                }
                catch (e) {
                    console.error(e);
                    decoded = null;
                }
            }
            return decoded;
        }

        private decode(data: string | ArrayBuffer): {
            id: number,
            route: number | string,
            body: any,
        } {
            // probuff decode
            const msg = Message.decode(data);

            if (msg.id > 0) {
                msg.route = this._requestRouteMap.get(msg.id);
                this._requestRouteMap.delete(msg.id);
                if (!msg.route) {
                    return null;
                }
            }

            let route = msg.route;

            // Decompose route from dict
            if (msg.compressRoute) {
                route = this._routeMapBack.get(route as number);
                if (!route) return null;

                msg.route = route;
            }

            const cmd = Structs.getCmd(route as string);
            msg.body = this.parseProto(msg.body, cmd.server);
            return msg;
        }

        private encode(reqId: number, route: number | string, msg: any): Uint8Array {
            var type = reqId ? Message.TYPE_REQUEST : Message.TYPE_NOTIFY;

            const cmd = Structs.getCmd(route as string);
            msg = this.packProto(msg, cmd.client);

            var compressRoute = 0;
            if (this._routeMap.has(route as string)) {
                route = this._routeMap.get(route as string);
                compressRoute = 1;
            }

            return Message.encode(reqId, type, compressRoute, route, msg);
        }

        public _request(route: string, msg: any, cb: (data: any) => void) {

            route = route || msg.route;
            if (!route) {
                return;
            }

            const reqId = this.uniqueRequestId;

            this._sendMessage(reqId, route, msg);

            this._requestCallbackMap.set(reqId, cb);
            this._requestRouteMap.set(reqId, route);
        }

        public static request(route: string, msg: any, cb?: (data: any) => void) {
            this.instance._request(route, msg, cb);
        }

        private _sendMessage(reqId: number, route: number | string, msg: any): void {
            const message = this.encode(reqId, route, msg);
            this.client.sendBuffer(Package.encode(Package.TYPE_DATA, message));
        }

        public static notify(route: number | string, msg: any): void {
            this.instance._sendMessage(0, route, msg);
        }
    }
}