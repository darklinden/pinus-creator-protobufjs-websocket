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
//# sourceMappingURL=Cmd.js.map