using System;
using PinusUnity;
using UnityEngine;
using Google.Protobuf;

public class NetworkTest : MonoBehaviour
{
    private void OnEnable()
    {
        Pinus.EventBus.OnHandshakeOver += OnHandshakeOver;
        EventDispatcher.AddListener<Proto.LargeNumber>(Structs.FooRoute.NotifyLargeNumber.route, OnNotifyLargeNumber, this);

        Pinus.Connect("ws://127.0.0.1:3010");
    }

    private void OnNotifyLargeNumber(Proto.LargeNumber e)
    {
        Log.D("e.IntNumber", e.IntNumber);
        Log.D("e.LongNumber", e.LongNumber);
        Log.D("e.StringNumber", e.StringNumber);
    }

    private void OnHandshakeOver(string url)
    {
        var data = new Proto.LargeNumber
        {
            IntNumber = 123456789,
            LongNumber = 12345678912,
            StringNumber = "123456789123456789"
        };

        Pinus.Request<Proto.LargeNumber, Proto.LargeNumber>(Structs.FooRoute.LargeNumber.route, data, d =>
        {
            Log.D("Response", d);
            Pinus.Notify(Structs.FooRoute.NotifyLargeNumber.route, d);
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
