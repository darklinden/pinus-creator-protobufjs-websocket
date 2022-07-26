import { Cmd } from "./Cmd.mjs";
export class RouteBase {
    getMap() {
        const map = new Map();
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                const element = this[key];
                if (element instanceof Cmd)
                    element.reg(map);
            }
        }
        return map;
    }
}
//# sourceMappingURL=RouteBase.js.map