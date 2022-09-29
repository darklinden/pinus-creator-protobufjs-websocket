using System.Diagnostics;
using UnityEngine;

namespace PinusUnity
{
    public static class Utils
    {
        [Conditional("PINUS_UNITY_LOG")]
        public static void L(object message0, object message1 = null, object message2 = null, object message3 = null,
            object message4 = null, object message5 = null, object message6 = null, object message7 = null,
            object message8 = null, object message9 = null, object message10 = null, object message11 = null,
            object message12 = null, object message13 = null, object message14 = null)
        {
            Log.D(message0, message1, message2, message3, message4, message5, message6, message7, message8, message9, message10, message11, message12, message13, message14);
        }

        public static void CopyArray(byte[] dest, int doffset, byte[] src, int soffset, int length)
        {
            if (src == null || dest == null)
            {
                return;
            }

            for (int index = 0; index < length; index++)
            {
                dest[doffset + index] = src[soffset + index];
            }
        }

        public static void CopyArray(byte[] dest, int doffset, string src, int soffset, int length)
        {
            if (src == null || dest == null)
            {
                return;
            }

            for (int index = 0; index < length; index++)
            {
                if (!byte.TryParse(src.Substring(soffset + index, 1), out dest[doffset + index]))
                {
                    Log.E("CopyArray error");
                }
            }
        }

        public static string TimeStr()
        {
            return System.DateTime.Now.ToString("[yyyy-MM-dd HH:mm:ss.fff]");
        }
    }
}
