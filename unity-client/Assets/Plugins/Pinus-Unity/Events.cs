using System;
namespace Pinus
{
    public static class Event
    {
        public delegate void FrameUpdated();
        public delegate void Connected(string url);
        public delegate void Reconnected(string url);
        public delegate void Closed(string url);
        public delegate void Error(string url, Exception e);
        public delegate void HandshakeError(string url, Exception e);
        public delegate void HandshakeOver(string url);
        public delegate void BeenKicked(string url);
    }
}