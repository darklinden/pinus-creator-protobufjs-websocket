import { Message } from 'pinus-protocol';
import * as  Constants from 'pinus/lib/util/constants';
import { getLogger } from 'pinus-logger';
import * as path from 'path';
import { IConnector } from 'pinus/lib/interfaces/IConnector';
import { Structs } from './Structs'
import { ConnectorComponent } from 'pinus/lib/components/connector';
import { HybridConnector } from 'pinus';


let logger = getLogger('pinus', path.basename(__filename));

let packProto = function (data: any, protoStruct: any): Uint8Array {
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

let parseProto = function (buffer: Uint8Array, protoStruct: any): any {
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


let encode = function (this: IConnector, reqId: number, route: string, msg: any) {
    if (!!reqId) {
        return composeResponse(this, reqId, route, msg);
    } else {
        return composePush(this, route, msg);
    }
};

let decode = function (this: ConnectorComponent, msg: any) {
    msg = Message.decode(msg.body);
    let route = msg.route;

    const connector = this.connector as HybridConnector;

    // decode use dictionary
    if (!!msg.compressRoute) {
        if (!!connector.useDict) {
            let abbrs = connector.dictionary.getAbbrs();
            if (!abbrs[route]) {
                logger.error('dictionary error! no abbrs for route : %s', route);
                return null;
            }
            route = msg.route = abbrs[route];
        } else {
            logger.error('fail to uncompress route code for msg: %j, server not enable dictionary.', msg);
            return null;
        }
    }

    // decode use protobuf
    const cmd = Structs.getCmd(route as string);
    if (cmd) {
        msg.body = parseProto(msg.body, cmd.client);
    } else {
        try {
            msg.body = JSON.parse(msg.body.toString('utf8'));
        } catch (ex) {
            msg.body = {};
        }
    }

    return msg;
};

let composeResponse = function (server: any, msgId: number, route: string, msgBody: any) {
    if (!msgId || !route || !msgBody) {
        return null;
    }
    msgBody = encodeBody(server, route, msgBody);
    return Message.encode(msgId, Message.TYPE_RESPONSE, false, null, msgBody);
};

let composePush = function (server: any, route: string, msgBody: any) {
    if (!route || !msgBody) {
        return null;
    }
    msgBody = encodeBody(server, route, msgBody);
    // encode use dictionary
    let compressRoute = false;
    if (!!server.dictionary) {
        let dict = server.dictionary.getDict();
        if (!!server.connector.useDict && !!dict[route]) {
            route = dict[route];
            compressRoute = true;
        }
    }
    return Message.encode(0, Message.TYPE_PUSH, compressRoute, route, msgBody);
};

let encodeBody = function (server: any, route: string, msgBody: any) {
    // encode use protobuf
    const cmd = Structs.getCmd(route as string);
    if (cmd) {
        msgBody = packProto(msgBody, cmd.server);
    } else {
        msgBody = Buffer.from(JSON.stringify(msgBody), 'utf8');
    }
    return msgBody;
};

export {
    encode,
    decode
};