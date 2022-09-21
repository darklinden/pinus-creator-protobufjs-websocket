using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;

namespace PinusUnity
{
    public class Network : INetworkHandler
    {
        const int RES_OK = 200;
        const int RES_FAIL = 500;
        const int RES_OLD_CLIENT = 501;

        // --- instances begin ---

        protected static Dictionary<string, Network> _instances = new Dictionary<string, Network>();

        public static void Clear(string key)
        {
            Network old = null;
            if (_instances.TryGetValue(key, out old))
            {
                old.Disconnect();
                _instances.Remove(key);
            }
        }

        public static Network Get(string key)
        {
            Network instance = null;
            if (_instances.TryGetValue(key, out instance))
            {
                return instance;
            }

            instance = new Network(key);
            _instances[key] = instance;
            return instance;
        }

        public static Network Default { get { return Get("Default"); } }
        // --- instances end ---


        protected Client Client { get; set; }
        public string Url
        {
            get { return Client.Url; }
            set { if (Client != null) Client.Url = value; }
        }

        protected bool m_AutoReconnect = true;
        public bool AutoReconnect { get => m_AutoReconnect; set => m_AutoReconnect = value; }

        protected bool Reconnecting { get; set; }
        protected int ReconnectAttempt { get; set; }

        protected int m_MaxReconnectAttempts = 3;
        public int MaxReconnectAttempts { get => m_MaxReconnectAttempts; set => m_MaxReconnectAttempts = value; }

        protected float HeartbeatPassed { get; set; }
        protected float HeartbeatInterval { get; set; }
        protected float HeartbeatTimeout { get; set; }
        protected bool ShouldHeartbeat { get; set; }

        protected int m_RequestId = 1;
        public int GenerateUniqueRequestId()
        {
            m_RequestId++;
            if (m_RequestId >= 40000) m_RequestId = 1;
            return m_RequestId;
        }

        // Map from request id to route
        protected Dictionary<int, string> m_RequestRouteMap = new Dictionary<int, string>();

        // callback from request id
        protected Dictionary<int, Action<Google.Protobuf.IMessage>> m_RequestCallbackMap = new Dictionary<int, Action<Google.Protobuf.IMessage>>();

        protected Dictionary<string, int> m_RouteMap = null;
        protected Dictionary<int, string> m_RouteMapBack = null;

        protected Network(string key)
        {
            Client = new Client(this);
            EventBus.Instance.OnFrameUpdated -= HeartbeatCheck;
            EventBus.Instance.OnFrameUpdated += HeartbeatCheck;
        }

        // --- Socket begin ---
        private byte[] m_HandshakeBuff = null;
        private byte[] HandshakeBuff
        {
            get
            {
                if (m_HandshakeBuff == null)
                {
                    HandshakeSendPackage handshake = new HandshakeSendPackage
                    {
                        sys = new HandshakeSendPackageSys
                        {
                            type = "unity",
                            version = "1.0.0",
                            rsa = null
                        },
                        user = null
                    };

                    var str = JsonConvert.SerializeObject(handshake);
                    var obj = Protocol.StrEncode(str);
                    m_HandshakeBuff = Package.Encode(PackageType.Handshake, obj, obj.Length);
                }
                return m_HandshakeBuff;
            }
        }

        public void OnOpen()
        {
            if (Reconnecting)
            {
                EventBus.Instance.Reconnected(Url);
            }

            EventBus.Instance.Connected(Url);

            ResetReconnect();

            Client.SendBuffer(HandshakeBuff);
        }

        public void OnRecv(byte[] data)
        {
            ProcessPackage(data);

            // new package arrived, update the heartbeat timeout
            RenewHeartbeatTimeout();
        }

        public void OnError(Exception err)
        {
            EventBus.Instance.Error(Url, err);
        }

        public void OnClose()
        {
            EventBus.Instance.Closed(Url);

            if (AutoReconnect && ReconnectAttempt < MaxReconnectAttempts)
            {
                Reconnecting = true;
                ReconnectAttempt++;
                Connect();
            }
        }

        public void ConnectTimeout()
        {
            EventBus.Instance.Error(Url, new Exception("Connect Timeout"));
            if (ReconnectAttempt < MaxReconnectAttempts)
            {
                Reconnecting = true;
                ReconnectAttempt++;
                Connect();
            }
        }

        // --- Socket end ---

        protected void ResetReconnect()
        {
            Reconnecting = false;
            ReconnectAttempt = 0;
        }

        protected void RenewHeartbeatTimeout()
        {
            HeartbeatPassed = 0;
        }

        void OnHandshake(byte[] data, int offset, int length)
        {
            var str = Protocol.StrDecode(data, offset, length);
            var d = JsonConvert.DeserializeObject<HandshakeRecvPackage>(str);
            if (d.code == RES_OLD_CLIENT)
            {
                EventBus.Instance.HandshakeError(Url, new Exception("client version not fullfill"));
                return;
            }

            if (d.code != RES_OK)
            {
                EventBus.Instance.HandshakeError(Url, new Exception("handshake fail"));
                return;
            }

            if (d.sys.heartbeat != 0)
            {
                HeartbeatInterval = d.sys.heartbeat;        // heartbeat interval
                HeartbeatTimeout = HeartbeatInterval * 2;   // max heartbeat timeout
            }
            else
            {
                HeartbeatInterval = 0;
                HeartbeatTimeout = 0;
            }

            if (d.sys.dict != null)
            {
                var dict = d.sys.dict;
                m_RouteMap = new Dictionary<string, int>();
                m_RouteMapBack = new Dictionary<int, string>();
                foreach (var pair in dict)
                {
                    m_RouteMap[pair.Key] = pair.Value;
                    m_RouteMapBack[pair.Value] = pair.Key;
                }
            }

            Client.SendBuffer(Package.Encode(PackageType.HandshakeAck));
            EventBus.Instance.HandshakeOver(Url);
        }

        void Heartbeat()
        {
            if (HeartbeatInterval == 0)
            {
                // no heartbeat
                return;
            }

            ShouldHeartbeat = true;
        }

        void HeartbeatCheck()
        {
            if (HeartbeatInterval == 0) return;

            if (!Client.IsConnected)
            {
                HeartbeatPassed = 0;
                return;
            }

            var dt = Time.unscaledDeltaTime;

            HeartbeatPassed += dt;

            if (ShouldHeartbeat)
            {
                if (HeartbeatPassed > HeartbeatInterval)
                {
                    Client.SendBuffer(Package.Encode(PackageType.Heartbeat));
                    RenewHeartbeatTimeout();
                }
                return;
            }

            if (HeartbeatPassed > HeartbeatTimeout)
            {
                Utils.L("Pinus Server Heartbeat Timeout");
                if (ReconnectAttempt < MaxReconnectAttempts)
                {
                    Reconnecting = true;
                    ReconnectAttempt++;
                    Connect();
                }
            }
        }

        void OnData(byte[] bytes, int offset, int length)
        {
            int id = 0;
            MessageType type;
            int routeCode = 0;
            string routeStr = null;
            int bodyOffset = 0;
            int bodyLength = 0;
            Message.Decode(bytes, offset, length, out id, out type, out routeCode, out routeStr, out bodyOffset, out bodyLength);

            if (id > 0)
            {
                if (m_RequestRouteMap.ContainsKey(id))
                {
                    routeStr = m_RequestRouteMap[id];
                    m_RequestRouteMap.Remove(id);
                }
                else
                {
                    Log.E("Pinus Server Response Error: Unknown Request Id: " + id);
                    return;
                }
            }

            // Decompose route from dict
            if (routeStr == null)
            {
                m_RouteMapBack.TryGetValue(routeCode, out routeStr);

                if (routeStr == null)
                {
                    Log.E("Pinus Server Response Error: Unknown Route Code: " + routeCode);
                    return;
                }
            }

            var msg = ProtoCoder.ParseProto(routeStr, bytes, bodyOffset, bodyLength);

            if (msg == null)
            {
                Log.E("Pinus Network OnData Decode Failed");
                return;
            }
            else
            {
                Utils.L("Pinus Network OnData", msg);
            }

            if (id != 0)
            {
                // if have a id then find the callback function with the request
                Action<Google.Protobuf.IMessage> cb = null;
                if (m_RequestCallbackMap.TryGetValue(id, out cb))
                {
                    m_RequestCallbackMap.Remove(id);
                    cb(msg);
                }
                return;
            }

            EventDispatcher.Dispatch(routeStr, msg);
        }

        void OnKick(byte[] data, int offset, int length)
        {
            var d = Protocol.StrDecode(data, offset, length);
            Log.D("Pinus Network OnKick", d);

            EventBus.Instance.BeenKicked(Url);
            Client.Close();
        }

        internal void ProcessPackage(byte[] bytes)
        {
            int offset = 0;
            int length = 0;

            var type = Package.Decode(bytes, ref offset, out length);
            while (type != PackageType.Unknown)
            {
                ProcessMessage(type, bytes, offset, length);
                offset += length;
                type = Package.Decode(bytes, ref offset, out length);
            }
        }

        internal void ProcessMessage(PackageType type, byte[] bytes, int offset, int length)
        {
            switch (type)
            {
                case PackageType.Handshake:
                    OnHandshake(bytes, offset, length);
                    break;
                case PackageType.Heartbeat:
                    Heartbeat();
                    break;
                case PackageType.Data:
                    OnData(bytes, offset, length);
                    break;
                case PackageType.Kick:
                    OnKick(bytes, offset, length);
                    break;
                default:
                    break;
            }
        }

        public void Connect(string url, bool autoReconnect = true)
        {
            Url = url;
            AutoReconnect = autoReconnect;
            Connect();
        }

        protected void Connect()
        {
            DoDisconnect();

            Client.Connect();
        }

        public void Disconnect()
        {
            AutoReconnect = false;
            DoDisconnect();
        }

        protected void DoDisconnect()
        {
            Reconnecting = false;
            Client.Close();
        }

        private byte[] m_DataBuffer = new byte[2 * 1024];
        private byte[] m_SendBuffer = new byte[4 * 1024];
        public void SendMessage<T>(int requestId, string route, T msg) where T : Google.Protobuf.IMessage
        {
            if (String.IsNullOrEmpty(route))
            {
                Log.E("Pinus Network Notify Error: Empty Route");
                return;
            }

            Utils.L("Pinus Network SendMessage", requestId, route, msg);

            var type = requestId > 0 ? MessageType.REQUEST : MessageType.NOTIFY;

            var routeCode = 0;
            if (!m_RouteMap.TryGetValue(route, out routeCode)) routeCode = 0;

            var dataLen = ProtoCoder.PackProto(route, msg, ref m_DataBuffer);
            var offset = 0;

            if (routeCode == 0)
            {
                Message.Encode(requestId, type, route, m_DataBuffer, dataLen, ref m_SendBuffer, ref offset);
            }
            else
            {
                Message.Encode(requestId, type, routeCode, m_DataBuffer, dataLen, ref m_SendBuffer, ref offset);
            }

            Client.SendBuffer(Package.Encode(PackageType.Data, m_SendBuffer, offset));
        }

        public void Request<T>(string route, T msg, Action<T> cb = null) where T : Google.Protobuf.IMessage
        {
            if (String.IsNullOrEmpty(route))
            {
                Log.E("Pinus Network Request Error: Empty Route");
                return;
            }

            var requestId = GenerateUniqueRequestId();
            SendMessage(requestId, route, msg);
            if (cb != null) m_RequestCallbackMap.Add(requestId, (e) => cb((T)e));
            m_RequestRouteMap.Add(requestId, route);
        }

        public void Notify<T>(string route, T data) where T : Google.Protobuf.IMessage
        {
            if (String.IsNullOrEmpty(route))
            {
                Log.E("Pinus Network Notify Error: Empty Route");
                return;
            }

            SendMessage(0, route, data);
        }
    }
}