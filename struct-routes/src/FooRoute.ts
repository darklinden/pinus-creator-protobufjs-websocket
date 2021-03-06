import { Cmd } from './Cmd';
import { RouteBase } from './RouteBase';

import { proto } from "proto-structs";

export class FooRoute extends RouteBase {
    public Foo: Cmd = Cmd.create('connector.entryHandler.onFoo', proto.Foo, proto.Bar);
    public LargeNumber: Cmd = Cmd.create('connector.entryHandler.onLargeNumber', proto.LargeNumber, proto.LargeNumber);
    public NotifyLargeNumber: Cmd = Cmd.create('connector.entryHandler.onNotifyLargeNumber', proto.LargeNumber, proto.LargeNumber);
}