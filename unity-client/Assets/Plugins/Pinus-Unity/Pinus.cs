using System;
using PinusUnity;

public static class Pinus
{
    public static Network Network { get; set; }
    public static EventBus EventBus { get => EventBus.Instance; }

    public static void Connect(string url, bool autoReconnect = true)
    {
        if (Network == null) Network = Network.Default;
        Network.Connect(url, autoReconnect);
    }

    public static void Disconnect()
    {
        if (Network != null) Network.Disconnect();
    }

    public static void SendMessage<T>(int requestId, string route, T msg) where T : Google.Protobuf.IMessage
    {
        if (Network != null) Network.SendMessage(requestId, route, msg);
    }

    public static void Request<T>(string route, T msg, Action<T> cb = null) where T : Google.Protobuf.IMessage
    {
        if (Network != null) Network.Request(route, msg, cb);
    }

    public static void Notify<T>(string route, T data) where T : Google.Protobuf.IMessage
    {
        if (Network != null) Network.Notify(route, data);
    }

}