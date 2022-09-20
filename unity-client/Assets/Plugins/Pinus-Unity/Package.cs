
namespace Pinus
{

    internal static class Package
    {
        internal const int PKG_HEAD_BYTES = 4;

        internal static byte[] Encode(PackageType type)
        {
            var length = 0;
            var buffer = new byte[PKG_HEAD_BYTES];
            var index = 0;
            buffer[index++] = (byte)((int)type & 0xff);
            buffer[index++] = (byte)((length >> 16) & 0xff);
            buffer[index++] = (byte)((length >> 8) & 0xff);
            buffer[index++] = (byte)(length & 0xff);
            return buffer;
        }


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
        internal static byte[] Encode(
            PackageType type,
            byte[] body,
            int length)
        {
            var buffer = new byte[PKG_HEAD_BYTES + length];
            var index = 0;
            buffer[index++] = (byte)((int)type & 0xff);
            buffer[index++] = (byte)((length >> 16) & 0xff);
            buffer[index++] = (byte)((length >> 8) & 0xff);
            buffer[index++] = (byte)(length & 0xff);
            Utils.CopyArray(buffer, index, body, 0, length);
            return buffer;
        }

        /**
         * Package protocol decode.
         * See encode for package format.
         *
         * @param  {Uint8Array} buffer byte array containing package content
         * @return {Object}           {type: package type, buffer: body byte array}
         */
        internal static PackageType Decode(byte[] bytes, ref int offset, out int dataLength)
        {
            if (offset < bytes.Length)
            {
                var type = (PackageType)bytes[offset++];
                dataLength = (bytes[offset++]) << 16 | (bytes[offset++]) << 8 | bytes[offset++];
                return type;
            }
            dataLength = 0;
            return PackageType.Unknown;
        }
    }
}