"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cmd_1 = require("./Cmd");
const RouteBase_1 = require("./RouteBase");
const proto_structs_1 = require("proto-structs");
const proto = proto_structs_1.root.proto;
class BarRoute extends RouteBase_1.RouteBase {
    constructor() {
        super(...arguments);
        this.Bar = Cmd_1.Cmd.create('connector.entryHandler.onBar', proto_structs_1.root.proto.Bar, proto_structs_1.root.proto.Foo);
    }
}
exports.default = BarRoute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFyUm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hcHAvc3RydWN0cy9CYXJSb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE0QjtBQUM1QiwyQ0FBd0M7QUFFeEMsaURBQXFDO0FBQ3JDLE1BQU0sS0FBSyxHQUFHLG9CQUFJLENBQUMsS0FBSyxDQUFDO0FBRXpCLE1BQXFCLFFBQVMsU0FBUSxxQkFBUztJQUEvQzs7UUFDVyxRQUFHLEdBQVEsU0FBRyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSxvQkFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsb0JBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFakcsQ0FBQztDQUFBO0FBSEQsMkJBR0MifQ==