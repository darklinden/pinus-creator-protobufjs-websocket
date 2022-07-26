import { Cmd } from "./Cmd.mjs";
import { RouteBase } from "./RouteBase.mjs";
import { proto } from "proto-structs";
export class BarRoute extends RouteBase {
    constructor() {
        super(...arguments);
        this.Bar = Cmd.create('connector.entryHandler.onBar', proto.Bar, proto.Foo);
    }
}
//# sourceMappingURL=BarRoute.js.map