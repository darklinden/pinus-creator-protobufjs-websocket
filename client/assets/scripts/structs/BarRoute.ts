import { Cmd } from './Cmd';
import { RouteBase } from './RouteBase';

import root from "proto-structs";
const proto = root.proto;

export default class BarRoute extends RouteBase {
    public Bar: Cmd = Cmd.create('connector.entryHandler.onBar', root.proto.Bar, root.proto.Foo);

}