namespace PinusUnity
{
    internal enum PackageType
    {
        Unknown = 0,
        Handshake = 1,
        HandshakeAck = 2,
        Heartbeat = 3,
        Data = 4,
        Kick = 5
    }
}