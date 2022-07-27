"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FooRoute = void 0;
const Cmd_1 = require("./Cmd.cjs");
const RouteBase_1 = require("./RouteBase.cjs");
const proto_structs_1 = require("proto-structs");
class FooRoute extends RouteBase_1.RouteBase {
    constructor() {
        super(...arguments);
        this.Foo = Cmd_1.Cmd.create('connector.entryHandler.onFoo', proto_structs_1.proto.Foo, proto_structs_1.proto.Bar);
        this.LargeNumber = Cmd_1.Cmd.create('connector.entryHandler.onLargeNumber', proto_structs_1.proto.LargeNumber, proto_structs_1.proto.LargeNumber);
        this.NotifyLargeNumber = Cmd_1.Cmd.create('connector.entryHandler.onNotifyLargeNumber', proto_structs_1.proto.LargeNumber, proto_structs_1.proto.LargeNumber);
    }
}
exports.FooRoute = FooRoute;
//# sourceMappingURL=FooRoute.js.map