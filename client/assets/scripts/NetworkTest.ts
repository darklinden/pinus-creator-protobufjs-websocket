import { _decorator, Component, EditBox } from "cc";
const { ccclass, property } = _decorator;

import { proto } from "proto-structs";
import { Structs } from "struct-routes";
import pinus from "./pinus/Pinus";

import JSBI from "jsbi";

@ccclass
export class NetworkTest extends Component {

    onEnable(): void {
        pinus.on(pinus.EVENT_HANDSHAKEOVER, this.onConnected, this);

        this.scheduleOnce(() => {
            pinus.connect('ws://127.0.0.1:3010');
        })
    }

    onConnected() {
        const big = JSBI.BigInt("75643564363473453456342378564387956906736546456235345");
        const msg: proto.ILargeNumber = { num: big.toString(10) };
        console.log('request largeNumber expect largeNumber')
        pinus.request(Structs.foo.LargeNumber.route, msg as any, data => {
            console.log(data);
            const ret = data as proto.ILargeNumber;
            const v = JSBI.BigInt(ret.num);
            console.log(v.toString(10));
        });

        // const msg: proto.IFoo = { foo: 1024 };
        // console.log('request foo expect bar')
        // pinus.request(Structs.foo.Foo.route, msg as any, data => {
        //     console.log(data);

        //     const msg: proto.IBar = { bar: 1024 };
        //     console.log('request bar expect foo')
        //     pinus.request(Structs.bar.Bar.route, msg as any, data => {
        //         console.log(data);
        //     });
        // });
    }

    onError() {

    }
}
