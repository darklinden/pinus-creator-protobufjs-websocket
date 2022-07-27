
export interface INetworkHandler {
    onRecv(data: any): void;
    onErr(err: any): void;
    onClose(): void;
    onOpen(): void;
    connectTimeout(): void;
}
