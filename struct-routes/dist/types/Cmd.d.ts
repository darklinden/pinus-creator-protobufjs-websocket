export declare class Cmd {
    route: string;
    client: any;
    server: any;
    static create(route: string, client: any, server: any): Cmd;
    reg(recv: Map<string, Cmd>): void;
}
