import { Cmd } from "./Cmd";
import { RouteBase } from "./RouteBase";

import { BarRoute } from "./BarRoute";
import { FooRoute } from "./FooRoute";
import { NumRoute } from "./NumRoute";

export class Structs {

    // --- group routes begin ---
private m_BarRoute: BarRoute = null;
public static get BarRoute(): BarRoute { return this.instance.m_BarRoute; }
private m_FooRoute: FooRoute = null;
public static get FooRoute(): FooRoute { return this.instance.m_FooRoute; }
private m_NumRoute: NumRoute = null;
public static get NumRoute(): NumRoute { return this.instance.m_NumRoute; }
    // --- group routes end ---

    // --- instance begin ---
    private static _instance: Structs = null;
    public static get instance(): Structs {
        if (!this._instance) this._instance = new Structs();
        return this._instance;
    }
    // --- instance end ---

    constructor() {
this.m_BarRoute = new BarRoute();
this.m_FooRoute = new FooRoute();
this.m_NumRoute = new NumRoute();
    }

    private _routs: Map<string, Cmd> = null;
    public get routs(): Map<string, Cmd> {
        if (!this._routs) {
            this._routs = new Map();
            for (const key in this) {
                if (Object.prototype.hasOwnProperty.call(this, key)) {
                    const element: any = this[key];
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

    public static getCmd(route: string): Cmd {
        return this.instance.routs.get(route);
    }
}