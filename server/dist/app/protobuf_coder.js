"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
const pinus_protocol_1 = require("pinus-protocol");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
const struct_routes_1 = require("struct-routes");
let logger = (0, pinus_logger_1.getLogger)('pinus', path.basename(__filename));
let packProto = function (data, protoStruct) {
    let buffer = null;
    if (data && protoStruct) {
        let message = null;
        if (protoStruct) {
            message = protoStruct.create(data);
            buffer = protoStruct.encode(message).finish();
        }
    }
    return buffer;
};
let parseProto = function (buffer, protoStruct) {
    let decoded = null;
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
};
let encode = function (reqId, route, msg) {
    if (!!reqId) {
        return composeResponse(this, reqId, route, msg);
    }
    else {
        return composePush(this, route, msg);
    }
};
exports.encode = encode;
let decode = function (msg) {
    msg = pinus_protocol_1.Message.decode(msg.body);
    let route = msg.route;
    const connector = this.connector;
    // decode use dictionary
    if (!!msg.compressRoute) {
        if (!!connector.useDict) {
            let abbrs = connector.dictionary.getAbbrs();
            if (!abbrs[route]) {
                logger.error('dictionary error! no abbrs for route : %s', route);
                return null;
            }
            route = msg.route = abbrs[route];
        }
        else {
            logger.error('fail to uncompress route code for msg: %j, server not enable dictionary.', msg);
            return null;
        }
    }
    // decode use protobuf
    const cmd = struct_routes_1.Structs.getCmd(route);
    if (cmd) {
        msg.body = parseProto(msg.body, cmd.client);
    }
    else {
        try {
            msg.body = JSON.parse(msg.body.toString('utf8'));
        }
        catch (ex) {
            msg.body = {};
        }
    }
    return msg;
};
exports.decode = decode;
let composeResponse = function (server, msgId, route, msgBody) {
    if (!msgId || !route || !msgBody) {
        return null;
    }
    msgBody = encodeBody(server, route, msgBody);
    return pinus_protocol_1.Message.encode(msgId, pinus_protocol_1.Message.TYPE_RESPONSE, false, null, msgBody);
};
let composePush = function (server, route, msgBody) {
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
    return pinus_protocol_1.Message.encode(0, pinus_protocol_1.Message.TYPE_PUSH, compressRoute, route, msgBody);
};
let encodeBody = function (server, route, msgBody) {
    // encode use protobuf
    const cmd = struct_routes_1.Structs.getCmd(route);
    if (cmd) {
        msgBody = packProto(msgBody, cmd.server);
    }
    else {
        msgBody = Buffer.from(JSON.stringify(msgBody), 'utf8');
    }
    return msgBody;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9idWZfY29kZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9hcHAvcHJvdG9idWZfY29kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbURBQXlDO0FBQ3pDLCtDQUF5QztBQUN6Qyw2QkFBNkI7QUFFN0IsaURBQXdDO0FBS3hDLElBQUksTUFBTSxHQUFHLElBQUEsd0JBQVMsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBRTNELElBQUksU0FBUyxHQUFHLFVBQVUsSUFBUyxFQUFFLFdBQWdCO0lBQ2pELElBQUksTUFBTSxHQUFlLElBQUksQ0FBQztJQUM5QixJQUFJLElBQUksSUFBSSxXQUFXLEVBQUU7UUFDckIsSUFBSSxPQUFPLEdBQVEsSUFBSSxDQUFDO1FBQ3hCLElBQUksV0FBVyxFQUFFO1lBQ2IsT0FBTyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDakQ7S0FDSjtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQTtBQUVELElBQUksVUFBVSxHQUFHLFVBQVUsTUFBa0IsRUFBRSxXQUFnQjtJQUMzRCxJQUFJLE9BQU8sR0FBUSxJQUFJLENBQUM7SUFDeEIsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxXQUFXLEVBQUU7UUFDeEMsSUFBSTtZQUNBLE9BQU8sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsT0FBTyxDQUFDLEVBQUU7WUFDTixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDbEI7S0FDSjtJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ25CLENBQUMs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