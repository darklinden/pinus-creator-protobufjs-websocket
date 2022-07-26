"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteBase = void 0;
const Cmd_1 = require("./Cmd.cjs");
class RouteBase {
    getMap() {
        const map = new Map();
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                const element = this[key];
                if (element instanceof Cmd_1.Cmd)
                    element.reg(map);
            }
        }
        return map;
    }
}
exports.RouteBase = RouteBase;
//# sourceMappingURL=RouteBase.js.map