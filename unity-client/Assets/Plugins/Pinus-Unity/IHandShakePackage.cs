using System.Collections.Generic;
namespace Pinus
{
    public struct HandshakeSendPackageSys
    {
        public string type { get; set; }
        public string version { get; set; }
        public object rsa { get; set; }
    }

    public struct HandshakeSendPackage
    {
        public HandshakeSendPackageSys sys { get; set; }
        public object user { get; set; }
    }

    internal struct HandshakeRecvPackageSys
    {
        public int heartbeat { get; set; }
        public Dictionary<string, int> dict { get; set; }
    }

    internal struct HandshakeRecvPackage
    {
        public int code { get; set; }
        public HandshakeRecvPackageSys sys { get; set; }
    }
}
