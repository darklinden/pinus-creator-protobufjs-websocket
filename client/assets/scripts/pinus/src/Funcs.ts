import { MessageType, MSG_COMPRESS_GZIP_ENCODE_MASK, MSG_FLAG_BYTES, MSG_ROUTE_CODE_MAX } from './internal'

export function copyArray(dest: Uint8Array, doffset: number, src: Uint8Array | string, soffset: number, length: number): void {
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
}

export function msgHasId(type: number): boolean {
    return type === MessageType.REQUEST || type === MessageType.RESPONSE;
}

export function msgHasRoute(type: number): boolean {
    return type === MessageType.REQUEST || type === MessageType.NOTIFY ||
        type === MessageType.PUSH;
}

export function caculateMsgIdBytes(id: number): number {
    var len = 0;
    do {
        len += 1;
        id >>= 7;
    } while (id > 0);
    return len;
}

export function encodeMsgFlag(type: number, compressRoute: number, buffer: Uint8Array, offset: number, compressGzip: number): number {
    if (type !== MessageType.REQUEST && type !== MessageType.NOTIFY &&
        type !== MessageType.RESPONSE && type !== MessageType.PUSH) {
        throw new Error('unkonw message type: ' + type);
    }

    buffer[offset] = (type << 1) | (compressRoute ? 1 : 0);

    if (compressGzip) {
        buffer[offset] = buffer[offset] | MSG_COMPRESS_GZIP_ENCODE_MASK;
    }

    return offset + MSG_FLAG_BYTES;
}

export function encodeMsgId(id: number, buffer: Uint8Array, offset: number): number {
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
}

export function encodeMsgRoute(compressRoute: number, route: number | string, buffer: Uint8Array, offset: number): number {
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
}

export function encodeMsgBody(msg: Uint8Array, buffer: Uint8Array, offset: number): number {
    copyArray(buffer, offset, msg, 0, msg.length);
    return offset + msg.length;
}