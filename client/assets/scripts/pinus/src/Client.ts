import { ISchedulable, random, log, error, director, macro } from 'cc';
import { INetworkHandler } from './INetworkHandler';

const CLIENT_LOG = true;

export class Client implements ISchedulable {

    protected _connect_timeout: number = 3;
    public get ConnectTimeout() { return this._connect_timeout; }
    public set ConnectTimeout(v: number) { this._connect_timeout = v; }

    // ISchedulable
    private _id: string = null;
    public get uuid(): string {
        if (!this._id) this._id = 'Client-' + new Date().getTime() + '-' + (random() * 100);
        return this._id;
    }

    private _manuallyClose: boolean;
    private _connectPassed: number;

    private _ws: WebSocket;
    public isConnected: boolean;

    public Url: string;

    private _networkHandle: INetworkHandler = null;

    constructor(networkHandle: INetworkHandler) {
        this._networkHandle = networkHandle;
        this._manuallyClose = false;
        this._connectPassed = 0;
    }

    public connect() {
        CLIENT_LOG && console.log(String.timestr(), 'pinus start connect', this.Url);

        this._ws = null;
        this._manuallyClose = false;
        this.isConnected = false;

        this.initSocket();
    }

    private connectTimeoutChecker(dt: number) {
        this._connectPassed += dt;
        if (this._connectPassed > this.ConnectTimeout) {
            error(String.timestr(), 'Client connect Timeout: ' + this.Url);
            director.getScheduler().unschedule(this.connectTimeoutChecker, this);

            this.close();
            this._networkHandle.connectTimeout();
        }
    }

    private onOpen(evt: any) {
        this._connectPassed = 0;
        director.getScheduler().unschedule(this.connectTimeoutChecker, this);

        this.isConnected = true;

        CLIENT_LOG && console.log(String.timestr(), 'pinus onOpen ' + this.Url);
        this._networkHandle.onOpen();
    }

    private onClose(evt: any) {
        CLIENT_LOG && console.log(String.timestr(), 'pinus onClose ' + this.Url);
        if (!this._manuallyClose) {
            this._networkHandle.onClose();
        }
        this.close();
    }

    private onErr(evt: any) {
        CLIENT_LOG && console.log(String.timestr(), 'pinus onErr ' + this.Url);
        CLIENT_LOG && console.log('pinus onErr', JSON.stringify(evt));
        if (!this._manuallyClose) {
            this._networkHandle.onErr(evt);
        }
        this.close();
    }

    private onRecv(evt: any) {
        this._networkHandle.onRecv(evt.data);
    }

    private initSocket() {

        this._manuallyClose = false;
        this._connectPassed = 0;
        director.getScheduler().schedule(this.connectTimeoutChecker, this, 0.1, macro.REPEAT_FOREVER);
        CLIENT_LOG && console.log(String.timestr(), 'pinus initSocket ' + this.Url);

        try {
            this._ws = new WebSocket(this.Url);
            this._ws.binaryType = 'arraybuffer';
            this._ws.onopen = this.onOpen.bind(this);
            this._ws.onclose = this.onClose.bind(this);
            this._ws.onerror = this.onErr.bind(this);
            this._ws.onmessage = this.onRecv.bind(this);
        }
        catch (e) {
            CLIENT_LOG && console.log(String.timestr(), 'pinus initSocket error ' + this.Url);
            this._networkHandle.onErr(this);
            this.close();
        }
    }

    public sendBuffer(buffer: Uint8Array) {
        if (this._ws) {
            try {
                this._ws.send(buffer ? buffer.buffer : null);
            }
            catch (e) {
                CLIENT_LOG && console.log(String.timestr(), 'pinus sendMsg error ' + this.Url);
                error(JSON.stringify(e));

                this.close();
                this._networkHandle.onErr(this);
            }
        }
        else {
            if (!this._manuallyClose) {
                this._networkHandle.onErr(this);
            }
            this.close();
        }
    }

    public close() {
        this._manuallyClose = true;
        this.isConnected = false;
        this._connectPassed = 0;
        director.getScheduler().unscheduleAllForTarget(this);

        if (this._ws) {
            this._ws.close();
            this._ws.onopen = null;
            this._ws.onclose = null;
            this._ws.onerror = null;
            this._ws.onmessage = null;
        }
        this._ws = null;
    }
}