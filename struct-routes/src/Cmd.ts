export class Cmd {
    public route: string = null;
    public client: any = null;
    public server: any = null;

    public static create(route: string, client: any, server: any): Cmd {
        const ret: Cmd = new Cmd();
        ret.route = route;
        ret.client = client;
        ret.server = server;
        return ret;
    }

    public reg(recv: Map<string, Cmd>) {
        recv.set(this.route, this);
    }
}