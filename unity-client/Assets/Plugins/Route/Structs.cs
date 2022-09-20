using System.Collections.Generic;
using System.Reflection;

public class Structs
{
    // --- group routes begin ---
    private FooRoute m_FooRoute = null;
    public static FooRoute FooRoute { get => Instance.m_FooRoute; }

    private BarRoute m_BarRoute = null;
    public static BarRoute BarRoute { get => Instance.m_BarRoute; }

    // --- group routes end ---

    // --- instance begin ---
    private static Structs _instance = null;
    public static Structs Instance
    {
        get
        {
            if (_instance == null) _instance = new Structs();
            return _instance;
        }
    }
    // --- instance end ---

    Structs()
    {
        m_FooRoute = new FooRoute();
        m_BarRoute = new BarRoute();
    }

    private Dictionary<string, Cmd> m_Route = null;
    public Dictionary<string, Cmd> Routes
    {
        get
        {
            if (m_Route == null)
            {
                m_Route = new Dictionary<string, Cmd>();
                foreach (var p in GetType().GetFields(BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public))
                {
                    if (p.FieldType.IsSubclassOf(typeof(RouteBase)))
                    {
                        var route = p.GetValue(this) as RouteBase;
                        foreach (var cmd in route.GetDict())
                        {
                            m_Route.Add(cmd.Key, cmd.Value);
                        }
                    }
                }
            }
            return m_Route;
        }
    }

    public static Cmd getCmd(string route)
    {
        Cmd cmd = null;
        if (!Instance.Routes.TryGetValue(route, out cmd)) cmd = null;
        return cmd;
    }
}