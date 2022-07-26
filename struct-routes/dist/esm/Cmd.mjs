export class Cmd {
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
//# sourceMappingURL=Cmd.js.map