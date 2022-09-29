import { proto } from "proto-structs";
import { Structs } from "struct-routes";
import pinus from "./pinus/Pinus";

import * as JSBI from "jsbi/dist/jsbi-cjs";

class NetworkTest {
    test(): void {
        pinus.on(pinus.EVENT_HANDSHAKEOVER, this.onConnected, this);
        pinus.on(Structs.foo.NotifyLargeNumber.route, this.onNotifyLargeNumber, this);

        const once = setTimeout(() => {
            pinus.connect('ws://127.0.0.1:3010', false);
            clearTimeout(once);
        }, 10);
    }

    onNotifyLargeNumber(msg: any) {
        console.log('onNotifyLargeNumber', msg);
    }

    onConnected() {
        const big = JSBI.BigInt("75643564363473453456342378564387956906736546456235345");
        const msg: proto.ILargeNumber = { IntNumber: big.toString(10), LongNumber: 123456789 };

        // const msg: proto.IFoo = { foo: 2048 };
        // pinus.request(Structs.login.Guest.route, msg as any, data => {
        //     console.log(data);
        // });

        pinus.notify(Structs.foo.NotifyLargeNumber.route, msg as any);

        const once = setTimeout(() => {
            pinus.request(Structs.foo.LargeNumber.route, msg as any, data => {
                console.log('response', data);
                pinus.notify(Structs.foo.NotifyLargeNumber.route, msg as any);
            });
            clearTimeout(once);
        }, 10);
    }

    onError(e: any) {
        console.error(e);
    }
}

const test = new NetworkTest();
test.test();