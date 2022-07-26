"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarRoute = void 0;
const Cmd_1 = require("./Cmd.cjs");
const RouteBase_1 = require("./RouteBase.cjs");
const proto_structs_1 = require("proto-structs");
class BarRoute extends RouteBase_1.RouteBase {
    constructor() {
        super(...arguments);
        this.Bar = Cmd_1.Cmd.create('connector.entryHandler.onBar', proto_structs_1.proto.Bar, proto_structs_1.proto.Foo);
    }
}
exports.BarRoute = BarRoute;
//# sourceMappingURL=BarRoute.js.map