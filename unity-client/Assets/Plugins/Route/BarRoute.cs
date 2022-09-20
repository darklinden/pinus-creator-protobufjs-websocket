public class BarRoute : RouteBase {
    public Cmd Bar = new Cmd("connector.entryHandler.onBar", typeof(Proto.Bar), typeof(Proto.Foo));
}