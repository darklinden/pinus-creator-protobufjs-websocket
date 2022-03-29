"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cmd_1 = require("./Cmd");
const RouteBase_1 = require("./RouteBase");
const proto_structs_1 = require("proto-structs");
class FooRoute extends RouteBase_1.RouteBase {
    constructor() {
        super(...arguments);
        this.Foo = Cmd_1.Cmd.create('connector.entryHandler.onFoo', proto_structs_1.root.proto.Foo, proto_structs_1.root.proto.Bar);
    }
}
exports.default = FooRoute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9vUm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hcHAvc3RydWN0cy9Gb29Sb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE0QjtBQUM1QiwyQ0FBd0M7QUFFeEMsaURBQXFDO0FBRXJDLE1BQXFCLFFBQVMsU0FBUSxxQkFBUztJQUEvQzs7UUFDVyxRQUFHLEdBQVEsU0FBRyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSxvQkFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsb0JBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakcsQ0FBQztDQUFBO0FBRkQsMkJBRUMifQ==