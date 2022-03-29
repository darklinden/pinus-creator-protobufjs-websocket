"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
const pinus_protocol_1 = require("pinus-protocol");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
const Structs_1 = require("./Structs");
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
    const cmd = Structs_1.Structs.getCmd(route);
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
    const cmd = Structs_1.Structs.getCmd(route);
    if (cmd) {
        msgBody = packProto(msgBody, cmd.server);
    }
    else {
        msgBody = Buffer.from(JSON.stringify(msgBody), 'utf8');
    }
    return msgBody;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9idWZfY29kZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hcHAvc3RydWN0cy9wcm90b2J1Zl9jb2Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtREFBeUM7QUFFekMsK0NBQXlDO0FBQ3pDLDZCQUE2QjtBQUU3Qix1Q0FBbUM7QUFLbkMsSUFBSSxNQUFNLEdBQUcsSUFBQSx3QkFBUyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFFM0QsSUFBSSxTQUFTLEdBQUcsVUFBVSxJQUFTLEVBQUUsV0FBZ0I7SUFDakQsSUFBSSxNQUFNLEdBQWUsSUFBSSxDQUFDO0lBQzlCLElBQUksSUFBSSxJQUFJLFdBQVcsRUFBRTtRQUNyQixJQUFJLE9BQU8sR0FBUSxJQUFJLENBQUM7UUFDeEIsSUFBSSxXQUFXLEVBQUU7WUFDYixPQUFPLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQyxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNqRDtLQUNKO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQyxDQUFBO0FBRUQsSUFBSSxVQUFVLEdBQUcsVUFBVSxNQUFrQixFQUFFLFdBQWdCO0lBQzNELElBQUksT0FBTyxHQUFRLElBQUksQ0FBQztJQUN4QixJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLFdBQVcsRUFBRTtRQUN4QyxJQUFJO1lBQ0EsT0FBTyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDeEM7UUFDRCxPQUFPLENBQUMsRUFBRTtZQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakIsT0FBTyxHQUFHLElBQUksQ0FBQztTQUNsQjtLQUNKO0lBQ0QsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQyxDQUFBO0FBR0QsSUFBSSxNQUFNLEdBQUcsVUFBNEIsS0FBYSxFQUFFLEtBQWEsRUFBRSxHQUFRO0lBQzNFLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRTtRQUNULE9BQU8sZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ25EO1NBQU07UUFDSCxPQUFPLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3hDO0FBQ0wsQ0FBQyxDQUFDO0FBMkVFLHdCQUFNO0FBekVWLElBQUksTUFBTSxHQUFHLFVBQW9DLEdBQVE7SUFDckQsR0FBRyxHQUFHLHdCQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBRXRCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUE0QixDQUFDO0lBRXBELHdCQUF3QjtJQUN4QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFO1FBQ3JCLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFDckIsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkNBQTJDLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2pFLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7WUFDRCxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEM7YUFBTTtZQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsMEVBQTBFLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDOUYsT0FBTyxJQUFJLENBQUM7U0FDZjtLQUNKO0lBRUQsc0JBQXNCO0lBQ3RCLE1BQU0sR0FBRyxHQUFHLGlCQUFPLENBQUMsTUFBTSxDQUFDLEtBQWUsQ0FBQyxDQUFDO0lBQzVDLElBQUksR0FBRyxFQUFFO1FBQ0wsR0FBRyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDL0M7U0FBTTtRQUNILElBQUk7WUFDQSxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUNwRDtRQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ1QsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7U0FDakI7S0FDSjtJQUVELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBd0NFLHdCQUFNO0FBdENWLElBQUksZUFBZSxHQUFHLFVBQVUsTUFBVyxFQUFFLEtBQWEsRUFBRSxLQUFhLEVBQUUsT0FBWTtJQUNuRixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxPQUFPLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDN0MsT0FBTyx3QkFBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsd0JBQU8sQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM5RSxDQUFDLENBQUM7QUFFRixJQUFJLFdBQVcsR0FBRyxVQUFVLE1BQVcsRUFBRSxLQUFhLEVBQUUsT0FBWTtJQUNoRSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ3BCLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxPQUFPLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDN0Msd0JBQXdCO0lBQ3hCLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztJQUMxQixJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO1FBQ3JCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM3QyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLGFBQWEsR0FBRyxJQUFJLENBQUM7U0FDeEI7S0FDSjtJQUNELE9BQU8sd0JBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLHdCQUFPLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDL0UsQ0FBQyxDQUFDO0FBRUYsSUFBSSxVQUFVLEdBQUcsVUFBVSxNQUFXLEVBQUUsS0FBYSxFQUFFLE9BQVk7SUFDL0Qsc0JBQXNCO0lBQ3RCLE1BQU0sR0FBRyxHQUFHLGlCQUFPLENBQUMsTUFBTSxDQUFDLEtBQWUsQ0FBQyxDQUFDO0lBQzVDLElBQUksR0FBRyxFQUFFO1FBQ0wsT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzVDO1NBQU07UUFDSCxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQzFEO0lBQ0QsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQyxDQUFDIn0=