import { Cmd } from './Cmd';
import { RouteBase } from './RouteBase';

import root from "proto-structs";

export default class FooRoute extends RouteBase {
    public Foo: Cmd = Cmd.create('connector.entryHandler.onFoo', root.proto.Foo, root.proto.Bar);
}