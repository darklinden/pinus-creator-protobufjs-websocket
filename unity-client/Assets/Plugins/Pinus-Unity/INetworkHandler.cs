using System;

namespace PinusUnity
{
    internal interface INetworkHandler
    {
        public void ConnectTimeout();
        public void OnOpen();
        public void OnRecv(byte[] data);
        public void OnError(Exception err);
        public void OnClose();
    }
}
