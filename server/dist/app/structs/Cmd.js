"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cmd = void 0;
class Cmd {
    constructor() {
        this.route = null;
        this.client = null;
        this.server = null;
    }
    static create(route, client, server) {
        const ret = new Cmd();
        ret.route = route;
        ret.client = client;
        ret.server = server;
        return ret;
    }
    reg(recv) {
        recv.set(this.route, this);
    }
}
exports.Cmd = Cmd;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ21kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXBwL3N0cnVjdHMvQ21kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQWEsR0FBRztJQUFoQjtRQUNXLFVBQUssR0FBVyxJQUFJLENBQUM7UUFDckIsV0FBTSxHQUFRLElBQUksQ0FBQztRQUNuQixXQUFNLEdBQVEsSUFBSSxDQUFDO0lBYTlCLENBQUM7SUFYVSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQWEsRUFBRSxNQUFXLEVBQUUsTUFBVztRQUN4RCxNQUFNLEdBQUcsR0FBUSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQzNCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3BCLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVNLEdBQUcsQ0FBQyxJQUFzQjtRQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQztDQUNKO0FBaEJELGtCQWdCQyJ9