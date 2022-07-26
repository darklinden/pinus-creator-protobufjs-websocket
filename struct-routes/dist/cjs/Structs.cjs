"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Structs = void 0;
const BarRoute_1 = require("./BarRoute.cjs");
const FooRoute_1 = require("./FooRoute.cjs");
const RouteBase_1 = require("./RouteBase.cjs");
class Structs {
    constructor() {
        this._foo = null;
        this._bar = null;
        this._routs = null;
        this._foo = new FooRoute_1.FooRoute();
        this._bar = new BarRoute_1.BarRoute();
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
                    if (element instanceof RouteBase_1.RouteBase) {
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
exports.Structs = Structs;
Structs._instance = null;
//# sourceMappingURL=Structs.js.map