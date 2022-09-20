using System.Collections.Generic;
using System.Reflection;

public class RouteBase
{
    public Dictionary<string, Cmd> GetDict()
    {
        var dict = new Dictionary<string, Cmd>();
        foreach (var p in GetType().GetFields(BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public))
        {
            if (p.FieldType == typeof(Cmd))
            {
                var cmd = p.GetValue(this) as Cmd;
                cmd.Reg(dict);
            }
        }
        return dict;
    }
}