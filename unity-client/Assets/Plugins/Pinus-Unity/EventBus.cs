using System;
using System.Collections.Generic;
using UnityEngine;

namespace Pinus
{
    public class EventBus : MonoBehaviour
    {
        private static EventBus _instance = null;
        public static EventBus Instance
        {
            get
            {
                if (!_instance) CreateInstance();
                return _instance;
            }
        }

        private static void CreateInstance()
        {
            GameObject go = GameObject.Find("/[Pinus-Event-Manager]");
            if (go == null) go = new GameObject("[Pinus-Event-Manager]");
            _instance = go.GetComponent<EventBus>();
            if (_instance == null) _instance = go.AddComponent<EventBus>();
        }

        public event Event.FrameUpdated OnFrameUpdated;
        private void Update()
        {
            if (OnFrameUpdated != null) OnFrameUpdated();

            if (m_DelayedActions.Count > 0)
            {
                for (int i = m_DelayedActions.Count - 1; i >= 0; i--)
                {
                    var action = m_DelayedActions[i];
                    action.TimePassed += Time.unscaledDeltaTime;
                    if (action.TimePassed >= action.TimeLimit)
                    {
                        action.Action();
                        m_DelayedActions.RemoveAt(i);
                    }
                }
            }
        }

        public event Event.Connected OnConnected;
        public void Connected(string url)
        {
            if (OnConnected != null) OnConnected(url);
        }

        public event Event.Reconnected OnReconnected;
        public void Reconnected(string url)
        {
            if (OnReconnected != null) OnReconnected(url);
        }

        public event Event.Closed OnClosed;
        public void Closed(string url)
        {
            if (OnClosed != null) OnClosed(url);
        }

        public event Event.Error OnError;
        public void Error(string url, Exception e)
        {
            if (OnError != null) OnError(url, e);
        }

        public event Event.HandshakeError OnHandshakeError;
        public void HandshakeError(string url, Exception e)
        {
            if (OnHandshakeError != null) OnHandshakeError(url, e);
        }

        public event Event.HandshakeOver OnHandshakeOver;
        public void HandshakeOver(string url)
        {
            if (OnHandshakeOver != null) OnHandshakeOver(url);
        }

        public event Event.BeenKicked OnBeenKicked;
        public void BeenKicked(string url)
        {
            if (OnBeenKicked != null) OnBeenKicked(url);
        }

        struct DelayAction
        {
            public float TimePassed;
            public float TimeLimit;
            public Action Action;
        }

        private List<DelayAction> m_DelayedActions = new List<DelayAction>();
        public void DoAfterDelay(float delay, Action action)
        {
            m_DelayedActions.Add(new DelayAction()
            {
                TimePassed = 0,
                TimeLimit = delay,
                Action = action
            });
        }

        public void RemoveDelayCallback(Action action)
        {
            for (int i = m_DelayedActions.Count - 1; i >= 0; i--)
            {
                if (m_DelayedActions[i].Action == action)
                {
                    m_DelayedActions.RemoveAt(i);
                }
            }
        }
    }
}

