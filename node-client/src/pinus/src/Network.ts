import { EventEmitter } from 'events'
import { Structs } from 'struct-routes';
import { INetworkHandler } from './INetworkHandler';
import { Message, MessageType, Package, Protocol, Client, ERR_CONNECT_TIMEOUT, EVENT_BEENKICKED, EVENT_CLOSED, EVENT_CONNECTED, EVENT_ERROR, EVENT_HANDSHAKEERROR, EVENT_HANDSHAKEOVER, EVENT_RECONNECTED, timestr } from './internal'

const NETWORK_LOG = true;

const JS_WS_CLIENT_TYPE = 'js-websocket';
const JS_WS_CLIENT_VERSION = '0.0.1';
const RES_OK = 200;
const RES_FAIL = 500;
const RES_OLD_CLIENT = 501;
const MAX_RECONNECT_ATTEMPTS = 5;

export interface IHandshakeBuffer {
    sys: {
        type: string,
        version: string,
        rsa: any
    };
    user: any;
}

export class Network extends EventEmitter implements INetworkHandler {

    // --- instances begin ---
    protected static _instances: Map<string, Network> = new Map<string, Network>();
    public static clear(key: string): void {
        const old = Network._instances.get(key);
        if (old) old.disconnect();
        Network._instances.delete(key);
    }

    public static get(key: string): Network {
        let instance = Network._instances.get(key);
        if (instance) return instance;

        instance = new Network(key);
        Network._instances.set(key, instance);
        return instance;
    }
    // --- instances end ---

    // --- EventTarget begin ---
    protected event(name: string, data: any = null) {
        if (this.listenerCount(name)) {
            this.emit(name, data);
        }
        else {
            NETWORK_LOG && console.warn(timestr(), 'pinus event [' + name + '] no listener')
        }
    }
    // --- EventTarget end ---

    // --- ISchedulable begin ---
    public id?: string;
    public uuid?: string;
    // --- ISchedulable end ---

    protected _client: Client = null;
    public get client(): Client { return this._client; }

    public get Url(): string { return this._client?.Url; };
    public set Url(v: string) { if (this._client) this._client.Url = v; }

    public AutoReconnect: boolean = true;

    protected _reconnecting: boolean = false;
    protected _reconnectAttempts: number = 0;

    protected _heartbeatPassed: number = 0;
    protected _heartbeatInterval: number = 0;
    protected _heartbeatTimeout: number;
    protected _shouldHeartbeat: boolean = false;

    protected _requestId: number = 1;
    public get uniqueRequestId(): number {
        this._requestId++;
        if (this._requestId >= 40000) this._requestId = 1;
        return this._requestId;
    }

    // Map from request id to route
    protected _requestRouteMap: Map<number, number | string> = new Map();
    // callback from request id
    protected _requestCallbackMap: Map<number, (data: any) => void> = new Map();

    protected _handshakeBuffer: IHandshakeBuffer = {
        sys: {
            type: JS_WS_CLIENT_TYPE,
            version: JS_WS_CLIENT_VERSION,
            rsa: {}
        },
        user: {}
    };

    protected _routeMap: Map<string, number> = null;
    protected _routeMapBack: Map<number, string> = null;

    protected constructor(key: string = null) {
        super();
        this.id = key;
        this.uuid = key;
        this._client = new Client(this);
        setTimeout(() => {
            this.heartbeatCheck(0.1);
        }, 10);
    }

    // --- Socket begin ---
    public onOpen() {
        if (this._reconnecting) {
            this.event(EVENT_RECONNECTED);
        }
        this.event(EVENT_CONNECTED);
        this.resetReconnect();
        var obj = Package.encode(Package.TYPE_HANDSHAKE, Protocol.strencode(JSON.stringify(this._handshakeBuffer)));
        this.client.sendBuffer(obj);
    }

    public onRecv(data: any) {
        this.processPackage(Package.decode(data));

        // new package arrived, update the heartbeat timeout
        this.renewHeartbeatTimeout();
    }

    public onErr(err: any) {
        this.event(EVENT_ERROR, err);
    }

    public onClose() {
        this.event(EVENT_CLOSED);
        if (this.AutoReconnect && this._reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            this._reconnecting = true;
            this._reconnectAttempts++;
            this._connect();
        }
    }

    public connectTimeout() {
        this.event(EVENT_ERROR, ERR_CONNECT_TIMEOUT);
        if (this._reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            this._reconnecting = true;
            this._reconnectAttempts++;
            this._connect();
        }
    }
    // --- Socket end ---

    protected resetReconnect() {
        this._reconnecting = false;
        this._reconnectAttempts = 0;
    }

    protected renewHeartbeatTimeout() {
        this._heartbeatPassed = 0;
    }

    protected handshake(data: ArrayBuffer) {
        const d: { code: number, sys: { heartbeat: number, dict: any } } = JSON.parse(Protocol.strdecode(data));
        if (d && d.code === RES_OLD_CLIENT) {
            this.event(EVENT_HANDSHAKEERROR);
            return;
        }

        if (d && d.code !== RES_OK) {
            this.event(EVENT_HANDSHAKEERROR);
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
        this.event(EVENT_HANDSHAKEOVER);
    }

    protected heartbeat(data: ArrayBuffer) {
        if (!this._heartbeatInterval) {
            // no heartbeat
            return;
        }

        this._shouldHeartbeat = true;
    }

    protected heartbeatCheck(dt: number) {
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
            console.error('pinus server heartbeat timeout');
            if (this._reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                this._reconnecting = true;
                this._reconnectAttempts++;
                this._connect();
            }
        }
    }

    protected onData(data: ArrayBuffer) {
        const msg = this.decode(data);

        if (!msg) {
            console.error('pinus onData decode failed');
            return;
        }
        else {
            NETWORK_LOG && console.log(timestr(), 'recv', msg);
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
        this.event(EVENT_BEENKICKED, data);
    }

    protected _messageHandlers: Map<number, (data: ArrayBuffer) => void> = null;
    protected get messageHandlers(): Map<number, (data: ArrayBuffer) => void> {
        if (!this._messageHandlers) {
            this._messageHandlers = new Map();
            this._messageHandlers.set(Package.TYPE_HANDSHAKE, this.handshake.bind(this));
            this._messageHandlers.set(Package.TYPE_HEARTBEAT, this.heartbeat.bind(this));
            this._messageHandlers.set(Package.TYPE_DATA, this.onData.bind(this));
            this._messageHandlers.set(Package.TYPE_KICK, this.onKick.bind(this));
        }
        return this._messageHandlers;
    }

    protected processPackage(msgs: { type: number, body?: Uint8Array } | { type: number, body?: Uint8Array }[]) {
        if (Array.isArray(msgs)) {
            for (var i = 0; i < msgs.length; i++) {
                var msg = msgs[i];
                this.messageHandlers.get(msg.type)(msg.body);
            }
        } else {
            this.messageHandlers.get(msgs.type)(msgs.body);
        }
    }

    public connect(url: string, autoReconnect: boolean = true): void {
        this.Url = url;
        this.AutoReconnect = autoReconnect;
        this._connect();
    }

    protected _connect(): void {
        this._disconnect();

        const once = setTimeout(() => {
            this.client.connect();
            clearTimeout(once);
        }, 10);
    }

    public disconnect(): void {
        this.AutoReconnect = false;
        this._disconnect();
    }

    protected _disconnect(): void {
        this._reconnecting = false;
        this.client.close();
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
                console.error('pinus proto decode error', e);
                decoded = null;
            }
        }
        return decoded;
    }

    protected decode(data: string | ArrayBuffer): {
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

    protected encode(reqId: number, route: number | string, msg: any): Uint8Array {
        var type = reqId ? MessageType.REQUEST : MessageType.NOTIFY;

        const cmd = Structs.getCmd(route as string);
        msg = this.packProto(msg, cmd.server);

        var compressRoute = 0;
        if (this._routeMap.has(route as string)) {
            route = this._routeMap.get(route as string);
            compressRoute = 1;
        }

        return Message.encode(reqId, type, compressRoute, route, msg);
    }

    protected _sendMessage(reqId: number, route: number | string, msg: any): void {
        NETWORK_LOG && console.log(timestr(), 'sendMessage', reqId, route, msg);
        const message = this.encode(reqId, route, msg);
        this.client.sendBuffer(Package.encode(Package.TYPE_DATA, message));
    }

    public request(route: string, msg: any, cb: (data: any) => void) {

        route = route || msg.route;
        if (!route) {
            return;
        }

        const reqId = this.uniqueRequestId;

        this._sendMessage(reqId, route, msg);

        this._requestCallbackMap.set(reqId, cb);
        this._requestRouteMap.set(reqId, route);
    }

    public notify(route: number | string, msg: any): void {
        this._sendMessage(0, route, msg);
    }
}

export const network = Network.get('pinus.network.default');
export const on = network.on.bind(network);
export const off = network.off.bind(network);
export const connect = network.connect.bind(network);
export const disconnect = network.disconnect.bind(network);
export const request = network.request.bind(network);
export const notify = network.notify.bind(network);
