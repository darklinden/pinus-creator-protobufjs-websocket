using System;
using System.Text;

namespace PinusUnity
{
    public static class Protocol
    {
        /// <summary>
        /// Encode the message to binary.
        /// </summary>
        /// <param name="inStr"></param>
        /// <returns></returns>
        public static byte[] StrEncode(string inStr)
        {
            return Encoding.UTF8.GetBytes(inStr);
        }

        /// <summary>
        /// Decode the message from binary.
        /// </summary>
        /// <param name="buffer"></param>
        /// <param name="offset"></param>
        /// <param name="length"></param>
        /// <returns></returns>
        public static string StrDecode(byte[] buffer, int offset, int length)
        {
            return Encoding.UTF8.GetString(buffer, offset, length);
        }
    }
}