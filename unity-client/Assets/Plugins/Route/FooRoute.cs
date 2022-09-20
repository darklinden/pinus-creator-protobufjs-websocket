public class FooRoute : RouteBase {
    public Cmd Foo = new Cmd("connector.entryHandler.onFoo", typeof(Proto.Foo), typeof(Proto.Bar));
    public Cmd LargeNumber = new Cmd("connector.entryHandler.onLargeNumber", typeof(Proto.LargeNumber), typeof(Proto.LargeNumber));
    public Cmd NotifyLargeNumber = new Cmd("connector.entryHandler.onNotifyLargeNumber", typeof(Proto.LargeNumber), typeof(Proto.LargeNumber));
}