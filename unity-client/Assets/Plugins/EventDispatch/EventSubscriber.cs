using UnityEngine;

[DisallowMultipleComponent]
public class EventSubscriber : MonoBehaviour
{
    private bool m_UnsubscribeOnDisable = false;
    public bool UnsubscribeOnDisable
    {
        get
        {
            return m_UnsubscribeOnDisable;
        }

        set
        {
            m_UnsubscribeOnDisable = value;
            if (value && !gameObject.activeInHierarchy)
            {
                UnsubscribeAll();
            }
        }
    }

    private void OnDisable()
    {
        if (UnsubscribeOnDisable)
        {
            UnsubscribeAll();
        }
    }

    private void OnDestroy()
    {
        UnsubscribeAll();
    }

    public void UnsubscribeAll()
    {
        EventDispatcher.RemoveAllListeners(gameObject);
    }

    public static EventSubscriber Bind(GameObject tar)
    {
        if (tar != null)
        {
            var comp = tar.GetComponent<EventSubscriber>();
            if (comp == null) comp = tar.AddComponent<EventSubscriber>();
            return comp;
        }

        return null;
    }
}
