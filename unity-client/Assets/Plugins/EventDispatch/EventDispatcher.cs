using System.Linq;
using System;
using System.Collections.Generic;
using UnityEngine;

public class EventDispatcher
{
    public delegate void EventDelegate<T>(T e);

    private delegate void EventDelegateCache(System.Object e);

    private class Container
    {
        public Delegate Delegate;
        public EventDelegateCache DelegateCache;
        public WeakReference<System.Object> WeakTarget;
    }

    private Dictionary<string, List<Container>> delegateCache = new Dictionary<string, List<Container>>();

    private static EventDispatcher _instance;

    public static EventDispatcher Instance
    {
        get
        {
            if (_instance == null)
            {
                _instance = new EventDispatcher();
            }

            return _instance;
        }
    }

    public EventDispatcher()
    {
        Log.D("EventDispatcher.Constructor");
    }

    public static string EventName(System.Type eventType)
    {
        return eventType.Name;
    }

    private void _AddDelegate<T>(string eventName, EventDelegate<T> del, System.Object target)
    {
        // get gameObject for auto unsubscribe

        GameObject go = null;
        if (target != null)
        {
            var comp = target as MonoBehaviour;
            if (comp != null)
            {
                go = comp.gameObject;
            }

            if (go == null)
            {
                go = target as GameObject;
            }
        }

        if (go == null)
        {
            var comp = (del.Target as MonoBehaviour);
            if (comp != null)
            {
                go = comp.gameObject;
            }
        }

        if (go != null) EventSubscriber.Bind(go);

        WeakReference<object> weakTarget = null;
        if (target != null)
        {
            weakTarget = new WeakReference<object>(target);
        }
        else if (go != null)
        {
            weakTarget = new WeakReference<object>(go);
        }

        // cache delegate
        EventDelegateCache delegateCache = (e) => del((T)e);

        List<Container> delegateList;
        if (!this.delegateCache.TryGetValue(eventName, out delegateList))
        {
            delegateList = new List<Container>();
        }

        var alreadyHas = false;
        foreach (var d in delegateList)
        {
            if (d.Delegate.Equals(del))
            {
                alreadyHas = true;
                break;
            }
        }

        if (!alreadyHas)
        {
            delegateList.Add(new Container
            {
                Delegate = del,
                DelegateCache = delegateCache,
                WeakTarget = weakTarget
            });
        }

        this.delegateCache[eventName] = delegateList;
    }

    public static void AddListener<T>(string eventName, EventDelegate<T> del, System.Object target = null)
    {
        Instance._AddDelegate(eventName, del, target);
    }

    public static void AddListener<T>(EventDelegate<T> del, System.Object target = null)
    {
        Instance._AddDelegate(EventName(typeof(T)), del, target);
    }

    private void _RemoveListener<T>(string eventName, EventDelegate<T> del)
    {
        List<Container> delegateList = null;
        if (delegateCache.TryGetValue(eventName, out delegateList))
        {
            if (delegateList != null)
            {
                for (int i = delegateList.Count - 1; i >= 0; i--)
                {
                    var d = delegateList[i];

                    if (d.Delegate.Equals(del))
                    {
                        delegateList.Remove(d);
                    }
                }
            }
        }
        delegateCache[eventName] = delegateList;
    }

    private void _RemoveAllListeners(System.Object target)
    {
        if (target == null || (target is GameObject && (GameObject)target == null)) return;

        MonoBehaviour comp = target as MonoBehaviour;
        GameObject go = null;
        if (comp != null)
        {
            go = comp.gameObject;
        }

        var keys = delegateCache.Keys.ToList();
        for (int k = keys.Count - 1; k >= 0; k--)
        {
            var key = keys[k];
            var delegateList = delegateCache[key];

            if (delegateList != null)
            {
                for (int i = delegateList.Count - 1; i >= 0; i--)
                {
                    var dc = delegateList[i];

                    var shouldRemove = false;
                    if (dc.WeakTarget != null)
                    {
                        System.Object tar = null;
                        if (dc.WeakTarget.TryGetTarget(out tar))
                        {
                            if (tar == null || (tar is GameObject && (GameObject)tar == null))
                            {
                                // weak null remove
                                shouldRemove = true;
                            }
                            else if (tar.Equals(target) || tar.Equals(comp) || tar.Equals(go))
                            {
                                // target match remove 
                                shouldRemove = true;
                            }
                        }
                        else
                        {
                            // weak null remove 
                            shouldRemove = true;
                        }
                    }

                    if (shouldRemove) delegateList.Remove(dc);
                }

                delegateCache[key] = delegateList;
            }
        }
    }

    public static void RemoveListener<T>(string eventName, EventDelegate<T> del)
    {
        Instance._RemoveListener(eventName, del);
    }

    public static void RemoveListener<T>(EventDelegate<T> del)
    {
        Instance._RemoveListener(EventName(typeof(T)), del);
    }

    public static void RemoveAllListeners(System.Object target)
    {
        Instance._RemoveAllListeners(target);
    }

    public void RemoveAll()
    {
        delegateCache.Clear();
    }

    private void _Dispatch<T>(string eventName, T e)
    {
        var invoked = false;

        List<Container> delegateList;
        if (delegateCache.TryGetValue(eventName, out delegateList))
        {
            for (int i = delegateList.Count - 1; i >= 0; i--)
            {
                var dc = delegateList[i];

                var canInvoke = true;

                if (dc.WeakTarget != null)
                {
                    System.Object target = null;
                    if (dc.WeakTarget.TryGetTarget(out target))
                    {
                        if (target == null || (target is GameObject && (GameObject)target == null))
                        {
                            canInvoke = false;
                        }
                    }
                    else
                    {
                        canInvoke = false;
                    }
                }

                if (dc.DelegateCache == null) canInvoke = false;

                if (canInvoke)
                {
                    invoked = true;
                    dc.DelegateCache.Invoke(e);
                }
                else
                {
                    delegateList.Remove(dc);
                }
            }

            delegateCache[eventName] = delegateList;
        }

        if (!invoked)
        {
            Log.W("EventDispatcher.Dispatch Event has no listener:", eventName, typeof(T));
        }
    }

    public static void Dispatch<T>(string eventName, T e)
    {
        Instance._Dispatch(eventName, e);
    }

    public static void Dispatch<T>(T e)
    {
        Instance._Dispatch(EventName(typeof(T)), e);
    }
}