using System;
using Pinus;
using UnityEngine;
using Google.Protobuf;

public class NetworkTest : MonoBehaviour
{
    private void OnEnable()
    {
        EventBus.Instance.OnHandshakeOver += OnHandshakeOver;
        EventDispatcher.AddListener<Proto.LargeNumber>(Structs.FooRoute.NotifyLargeNumber.route, OnNotifyLargeNumber, this);

        Pinus.Network.Default.Connect("ws://127.0.0.1:3010");
    }

    private void OnNotifyLargeNumber(Proto.LargeNumber e)
    {
        Log.D(e.Num);
    }

    private void OnHandshakeOver(string url)
    {
        var data = new Proto.LargeNumber { Num = "123456789123456789" };

        Pinus.Network.Default.Request(Structs.FooRoute.LargeNumber.route, data, d =>
        {
            Log.D("Response", d);
            Pinus.Network.Default.Notify(Structs.FooRoute.NotifyLargeNumber.route, d);
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

    // onError() {

    // }
}
