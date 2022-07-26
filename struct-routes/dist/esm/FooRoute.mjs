import { Cmd } from "./Cmd.mjs";
import { RouteBase } from "./RouteBase.mjs";
import { proto } from "proto-structs";
export class FooRoute extends RouteBase {
    constructor() {
        super(...arguments);
        this.Foo = Cmd.create('connector.entryHandler.onFoo', proto.Foo, proto.Bar);
        this.LargeNumber = Cmd.create('connector.entryHandler.onLargeNumber', proto.LargeNumber, proto.LargeNumber);
    }
}
//# sourceMappingURL=FooRoute.js.map