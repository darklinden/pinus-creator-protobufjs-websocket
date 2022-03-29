"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Structs = void 0;
const BarRoute_1 = require("./BarRoute");
const FooRoute_1 = require("./FooRoute");
const RouteBase_1 = require("./RouteBase");
class Structs {
    // --- instance end ---
    constructor() {
        // --- group routes begin ---
        this._foo = null;
        this._bar = null;
        this._routs = null;
        this._foo = new FooRoute_1.default();
        this._bar = new BarRoute_1.default();
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
// --- group routes end ---
// --- instance begin ---
Structs._instance = null;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RydWN0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9zdHJ1Y3RzL1N0cnVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQWtDO0FBQ2xDLHlDQUFrQztBQUVsQywyQ0FBd0M7QUFFeEMsTUFBYSxPQUFPO0lBa0JoQix1QkFBdUI7SUFFdkI7UUFsQkEsNkJBQTZCO1FBRXJCLFNBQUksR0FBYSxJQUFJLENBQUM7UUFHdEIsU0FBSSxHQUFhLElBQUksQ0FBQztRQWtCdEIsV0FBTSxHQUFxQixJQUFJLENBQUM7UUFKcEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLGtCQUFRLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksa0JBQVEsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFsQk0sTUFBTSxLQUFLLEdBQUcsS0FBZSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUd6RCxNQUFNLEtBQUssR0FBRyxLQUFlLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBTXpELE1BQU0sS0FBSyxRQUFRO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztZQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUNwRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQVNELElBQVcsS0FBSztRQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO2dCQUNwQixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBQ2pELE1BQU0sT0FBTyxHQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDL0IsSUFBSSxPQUFPLFlBQVkscUJBQVMsRUFBRTt3QkFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRTs0QkFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO3lCQUMvQjtxQkFDSjtpQkFDSjthQUNKO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBYTtRQUM5QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQyxDQUFDOztBQTdDTCwwQkE4Q0M7QUFwQ0csMkJBQTJCO0FBRTNCLHlCQUF5QjtBQUNWLGlCQUFTLEdBQVksSUFBSSxDQUFDIn0=