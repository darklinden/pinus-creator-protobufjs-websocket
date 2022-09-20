using System.Collections.Generic;
using System;

public class Cmd
{
    public string route = null;
    public Type client = null;
    public Type server = null;

    public Cmd(string route, Type client, Type server)
    {
        this.route = route;
        this.client = client;
        this.server = server;
    }

    public void Reg(Dictionary<string, Cmd> dict)
    {
        dict.Add(route, this);
    }
}