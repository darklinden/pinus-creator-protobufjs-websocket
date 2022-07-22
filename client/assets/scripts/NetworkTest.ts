import { _decorator, Component, EditBox } from "cc";
const { ccclass, property } = _decorator;

import { proto } from "proto-structs";
import { Structs } from "../scripts/structs/Structs";
import pinus from "./pinus/Pinus";

@ccclass
export class NetworkTest extends Component {

    onEnable(): void {
        pinus.on(pinus.EVENT_HANDSHAKEOVER, this.onConnected, this);

        this.scheduleOnce(() => {
            pinus.connect('ws://127.0.0.1:3010');
        })
    }

    onConnected() {
        const msg: proto.IFoo = { foo: 1024 };
        console.log('request foo expect bar')
        pinus.request(Structs.foo.Foo.route, msg as any, data => {
            console.log(data);

            const msg: proto.IBar = { bar: 1024 };
            console.log('request bar expect foo')
            pinus.request(Structs.bar.Bar.route, msg as any, data => {
                console.log(data);
            });
        });
    }

    onError() {

    }
}
