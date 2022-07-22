import { Cmd } from './Cmd';
import { RouteBase } from './RouteBase';

import { proto } from "proto-structs";

export default class BarRoute extends RouteBase {
    public Bar: Cmd = Cmd.create('connector.entryHandler.onBar', proto.Bar, proto.Foo);

}