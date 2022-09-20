using System.IO;
using System;
using Google.Protobuf;

namespace Pinus
{
    public static class ProtoCoder
    {
        public static int PackProto(string route, IMessage data, ref byte[] bytes)
        {
            var output = new MemoryStream(bytes);
            output.Seek(0, SeekOrigin.Begin);
            Google.Protobuf.MessageExtensions.WriteTo(data, output);
            return (int)output.Position;
        }

        public static IMessage ParseProto(string route, byte[] bytes, int offset, int length)
        {
            Structs.Instance.Routes.TryGetValue(route, out Cmd cmd);
            if (cmd == null) return null;
            var obj = Activator.CreateInstance(cmd.server);
            Google.Protobuf.MessageExtensions.MergeFrom(((Google.Protobuf.IMessage)obj), bytes, offset, length);
            return obj as IMessage;
        }
    }
}