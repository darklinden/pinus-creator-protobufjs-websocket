using UnityEngine;

namespace PinusUnity
{
    public static class Message
    {
        public const int MSG_FLAG_BYTES = 1;
        public const int MSG_ROUTE_CODE_BYTES = 2;
        public const int MSG_ID_MAX_BYTES = 5;
        public const int MSG_ROUTE_LEN_BYTES = 1;
        public const int MSG_ROUTE_CODE_MAX = 0xffff;
        public const int MSG_COMPRESS_ROUTE_MASK = 0x1;
        public const int MSG_COMPRESS_GZIP_MASK = 0x1;
        public const int MSG_COMPRESS_GZIP_ENCODE_MASK = 1 << 4;
        public const int MSG_TYPE_MASK = 0x7;

        public static bool MessageHasId(MessageType type)
        {
            return type == MessageType.REQUEST
                || type == MessageType.RESPONSE;
        }

        public static bool MessageHasRoute(MessageType type)
        {
            return type == MessageType.REQUEST
                || type == MessageType.NOTIFY
                || type == MessageType.PUSH;
        }

        public static int CaculateMessageIdBytes(int id)
        {
            int len = 0;
            do
            {
                len += 1;
                id >>= 7;
            } while (id > 0);
            return len;
        }

        public static int EncodeMessageFlag(MessageType type, bool compressRoute, byte[] buffer, int offset)
        {
            var typeValue = (int)type;
            buffer[offset] = (byte)((typeValue << 1) | (compressRoute ? 1 : 0));

            return offset + MSG_FLAG_BYTES;
        }

        public static int EncodeMessageId(int id, byte[] buffer, int offset)
        {
            do
            {
                byte tmp = (byte)(id % 128);
                var next = Mathf.FloorToInt(id / 128);

                if (next != 0)
                {
                    tmp += 128;
                }
                buffer[offset++] = tmp;

                id = next;
            } while (id != 0);

            return offset;
        }

        public static int EncodeMessageRoute(int route, byte[] buffer, int offset)
        {
            if (route > MSG_ROUTE_CODE_MAX)
            {
                Log.E("route number is overflow");
            }
            buffer[offset++] = (byte)((route >> 8) & 0xff);
            buffer[offset++] = (byte)(route & 0xff);
            return offset;
        }

        public static int EncodeMessageRoute(string route, byte[] buffer, int offset)
        {
            buffer[offset++] = (byte)(route.Length & 0xff);

            Utils.CopyArray(buffer, offset, route, 0, route.Length);
            offset += route.Length;
            return offset;
        }

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
        public static void Encode(
            int id,
            MessageType type,
            int route,
            byte[] msg,
            int msgLen,
            ref byte[] buffer,
            ref int offset)
        {
            // caculate message max length
            var idBytes = MessageHasId(type) ? CaculateMessageIdBytes(id) : 0;

            // add flag
            offset = EncodeMessageFlag(type, true, buffer, offset);

            // add message id
            if (MessageHasId(type))
            {
                offset = EncodeMessageId(id, buffer, offset);
            }

            // add route
            if (MessageHasRoute(type))
            {
                offset = EncodeMessageRoute(route, buffer, offset);
            }

            // add body
            if (msgLen > 0)
            {
                Utils.CopyArray(buffer, offset, msg, 0, msgLen);
                offset += msgLen;
            }
        }

        public static void Encode(
            int id,
            MessageType type,
            string route,
            byte[] msg,
            int msgLen,
            ref byte[] buffer,
            ref int offset)
        {
            // caculate message max length
            var idBytes = MessageHasId(type) ? CaculateMessageIdBytes(id) : 0;

            // add flag
            offset = EncodeMessageFlag(type, false, buffer, offset);

            // add message id
            if (MessageHasId(type))
            {
                offset = EncodeMessageId(id, buffer, offset);
            }

            // add route
            if (MessageHasRoute(type))
            {
                offset = EncodeMessageRoute(route, buffer, offset);
            }

            // add body
            if (msgLen > 0)
            {
                Utils.CopyArray(buffer, offset, msg, 0, msgLen);
                offset += msgLen;
            }
        }

        /**
         * Message protocol decode.
         *
         * @param  {Buffer|Uint8Array} buffer message bytes
         * @return {Object}            message object
         */
        public static void Decode(
            byte[] bytes,
            int offset,
            int length,
            out int id,
            out MessageType type,
            out int routeCode,
            out string routeStr,
            out int bodyOffset,
            out int bodyLength)
        {
            // save old offset
            bodyLength = offset;
            // parse flag
            var flag = bytes[offset++];
            bool compressRoute = (flag & MSG_COMPRESS_ROUTE_MASK) == MSG_COMPRESS_ROUTE_MASK;
            type = (MessageType)((flag >> 1) & MSG_TYPE_MASK);

            // parse id
            id = 0;
            if (MessageHasId(type))
            {
                var m = 0;
                var i = 0;
                do
                {
                    m = int.Parse(bytes[offset].ToString());
                    id += (m & 0x7f) << (7 * i);
                    offset++;
                    i++;
                } while (m >= 128);
            }

            // parse route
            routeCode = 0;
            routeStr = null;
            if (MessageHasRoute(type))
            {
                if (compressRoute)
                {
                    routeCode = ((bytes[offset++]) << 8 | bytes[offset++]);
                }
                else
                {
                    var routeLen = bytes[offset++];
                    if (routeLen > 0)
                    {
                        routeStr = Protocol.StrDecode(bytes, offset, routeLen);
                    }
                    else
                    {
                        routeStr = "";
                    }
                    offset += routeLen;
                }
            }

            // bodyLength = oldOffset + length - offset;
            bodyOffset = offset;
            bodyLength = bodyLength + length - offset;
        }
    }
}