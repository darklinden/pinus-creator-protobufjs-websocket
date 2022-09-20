using System;
using UnityEngine;
using UnityWebSocket;

namespace Pinus
{
    public class Client
    {
        protected float m_ConnectTimeout = 3;
        public float ConnectTimeout { get { return m_ConnectTimeout; } set { m_ConnectTimeout = value; } }

        public bool IsConnected = false;
        public string Url = null;

        protected bool m_ManuallyClosed = false;
        protected float m_ConnectPassed = 0;
        protected WebSocket m_Ws = null;
        internal INetworkHandler m_NetworkHandle = null;
        internal Client(INetworkHandler networkHandle)
        {
            m_NetworkHandle = networkHandle;
            m_ManuallyClosed = false;
            m_ConnectPassed = 0;
        }

        public void Connect()
        {
            Utils.L("Pinus Client Connect", Url);

            m_Ws = null;
            m_ManuallyClosed = false;
            IsConnected = false;

            InitSocket();
        }

        private void InitSocket()
        {
            m_ConnectPassed = 0;
            EventBus.Instance.OnFrameUpdated -= OnFrameUpdated;
            EventBus.Instance.OnFrameUpdated += OnFrameUpdated;

            Utils.L("Pinus Client InitSocket", Url);

            try
            {
                m_Ws = new WebSocket(this.Url);
                m_Ws.OnOpen += OnOpen;
                m_Ws.OnClose += OnClose;
                m_Ws.OnError += OnError;
                m_Ws.OnMessage += OnMessage;
                m_Ws.ConnectAsync();
            }
            catch (Exception e)
            {
                Utils.L("Pinus Client InitSocket Error", Url);
                m_NetworkHandle.OnError(e);
                Close();
            }
        }

        private void OnOpen(object sender, OpenEventArgs e)
        {
            m_ConnectPassed = 0;
            EventBus.Instance.OnFrameUpdated -= OnFrameUpdated;
            IsConnected = true;
            Utils.L("Pinus Client OnOpen", Url);
            m_NetworkHandle.OnOpen();
        }

        private void OnMessage(object sender, MessageEventArgs e)
        {
            m_NetworkHandle.OnRecv(e.RawData);
        }

        private void OnError(object sender, ErrorEventArgs e)
        {
            Utils.L("Pinus Client OnError", Url);
            if (!m_ManuallyClosed)
            {
                m_NetworkHandle.OnError(e.Exception);
            }
            Close();
        }

        private void OnClose(object sender, CloseEventArgs e)
        {
            Utils.L("Pinus Client OnClose", Url);
            if (!m_ManuallyClosed)
            {
                m_NetworkHandle.OnClose();
            }
            Close();
        }

        private void OnFrameUpdated()
        {
            m_ConnectPassed += Time.unscaledDeltaTime;
            if (m_ConnectPassed > ConnectTimeout)
            {
                Log.E(Utils.TimeStr(), "Client connect Timeout", Url);
                EventBus.Instance.OnFrameUpdated -= OnFrameUpdated;

                Close();
                m_NetworkHandle.ConnectTimeout();
            }
        }

        public void SendBuffer(byte[] buffer)
        {
            if (m_Ws != null)
            {
                try
                {
                    m_Ws.SendAsync(buffer);
                }
                catch (Exception e)
                {
                    Utils.L("Pinus Client SendBuffer Error", Url);

                    Close();
                    m_NetworkHandle.OnError(e);
                }
            }
            else
            {
                if (!m_ManuallyClosed)
                {
                    m_NetworkHandle.OnError(null);
                }
                Close();
            }
        }

        public void Close()
        {
            m_ManuallyClosed = true;
            IsConnected = false;
            m_ConnectPassed = 0;
            EventBus.Instance.OnFrameUpdated -= OnFrameUpdated;

            if (m_Ws != null)
            {
                m_Ws.CloseAsync();
                m_Ws.OnOpen -= OnOpen;
                m_Ws.OnClose -= OnClose;
                m_Ws.OnError -= OnError;
                m_Ws.OnMessage -= OnMessage;
                m_Ws = null;
            }
            m_Ws = null;
        }
    }
}