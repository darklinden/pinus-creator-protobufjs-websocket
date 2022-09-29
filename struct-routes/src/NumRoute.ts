import { Cmd } from './Cmd';
import { RouteBase } from './RouteBase';
import { proto } from "proto-structs";

export class NumRoute extends RouteBase {
public onLargeNumber: Cmd = Cmd.create('connector.entryHandler.onLargeNumber', proto.LargeNumber, proto.LargeNumber);
public onNotifyLargeNumber: Cmd = Cmd.create('connector.entryHandler.onNotifyLargeNumber', proto.LargeNumber, proto.LargeNumber);
}