import { BarRoute } from "./BarRoute.mjs";
import { FooRoute } from "./FooRoute.mjs";
import { RouteBase } from "./RouteBase.mjs";
export class Structs {
    constructor() {
        this._foo = null;
        this._bar = null;
        this._routs = null;
        this._foo = new FooRoute();
        this._bar = new BarRoute();
    }
    static get foo() { return this.instance._foo; }
    static get bar() { return this.instance._bar; }
    static get instance() {
        if (!this._instance)
            this._instance = new Structs();
        return this._instance;
    }
    get routs() {
        if (!this._routs) {
            this._routs = new Map();
            for (const key in this) {
                if (Object.prototype.hasOwnProperty.call(this, key)) {
                    const element = this[key];
                    if (element instanceof RouteBase) {
                        for (let [key, value] of element.getMap()) {
                            this._routs.set(key, value);
                        }
                    }
                }
            }
        }
        return this._routs;
    }
    static getCmd(route) {
        return this.instance.routs.get(route);
    }
}
Structs._instance = null;
//# sourceMappingURL=Structs.js.map