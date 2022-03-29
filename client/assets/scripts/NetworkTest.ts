import { _decorator, Component, EditBox } from "cc";
const { ccclass, property } = _decorator;

import { Pomelo } from "./Pomelo";
const Network = Pomelo.Network;
const Events = Pomelo.Events;

import root from "proto-structs";
import { Structs } from "../scripts/structs/Structs";

@ccclass
export class NetworkTest extends Component {

    onEnable(): void {
        Network.instance.on(Events.HANDSHAKEOVER, this.onConnected, this);
        Network.connect('ws://127.0.0.1:3010');
    }

    onConnected() {
        const msg: root.proto.IFoo = { foo: 1024 };
        console.log('request foo expect bar')
        Network.request(Structs.foo.Foo.route, msg as any, data => {
            console.log(data);

            const msg: root.proto.IBar = { bar: 1024 };
            console.log('request bar expect foo')
            Network.request(Structs.bar.Bar.route, msg as any, data => {
                console.log(data);
            });
        });
    }

    onError() {

    }
}
