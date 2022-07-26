import { BarRoute } from "./BarRoute";
import { FooRoute } from "./FooRoute";
import { Cmd } from "./Cmd";
export declare class Structs {
    private _foo;
    static get foo(): FooRoute;
    private _bar;
    static get bar(): BarRoute;
    private static _instance;
    static get instance(): Structs;
    constructor();
    private _routs;
    get routs(): Map<string, Cmd>;
    static getCmd(route: string): Cmd;
}
