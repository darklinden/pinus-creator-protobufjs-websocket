import { Cmd } from "./Cmd";

export class RouteBase {

    public getMap(): Map<string, Cmd> {
        const map: Map<string, Cmd> = new Map();
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                const element: any = this[key];
                if (element instanceof Cmd)
                    element.reg(map)
            }
        }
        return map;
    }
}