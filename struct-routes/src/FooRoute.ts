import { Cmd } from './Cmd';
import { RouteBase } from './RouteBase';
import { proto } from "proto-structs";

export class FooRoute extends RouteBase {
public onFoo: Cmd = Cmd.create('connector.entryHandler.onFoo', proto.Foo, proto.Bar);
}