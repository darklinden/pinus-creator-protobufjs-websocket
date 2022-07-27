import { ScheduleOptions, SessionService } from 'pinus';
import { Application, FrontendSession } from 'pinus';

import { proto } from "proto-structs";
import { Structs } from 'struct-routes';

export default function (app: Application) {
    return new Handler(app);
}

export class Handler {
    constructor(private app: Application) {

    }


    /**
     * New client entry.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
    async onBar(msg: any, session: FrontendSession) {

        console.log('msg instanceof Structs.bar.Bar.client:', msg instanceof Structs.bar.Bar.client);

        const ret = { foo: 2048 } as proto.IFoo;

        // console.log('ret instanceof Structs.bar.Bar.server:', ret instanceof Structs.bar.Bar.server);

        return ret;
    }

    /**
     * New client entry.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
    async onFoo(msg: any, session: FrontendSession) {
        console.log('msg instanceof Structs.foo.Foo.client:', msg instanceof Structs.foo.Foo.client);

        const ret = { bar: 2048 } as proto.IBar;

        // console.log('ret instanceof Structs.foo.Foo.server:', ret instanceof Structs.foo.Foo.server);

        return ret;
    }

    /**
     * New client entry.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
    async onLargeNumber(msg: any, session: FrontendSession) {
        console.log(msg.num);

        const ret = { num: '99999999999999999999' } as proto.ILargeNumber;

        // console.log('ret instanceof Structs.foo.Foo.server:', ret instanceof Structs.foo.Foo.server);

        return ret;
    }

    /**
     * New client entry.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
    async onNotifyLargeNumber(msg: any, session: FrontendSession) {
        console.log(msg.num);

        const sid = session.id;
        const uid = session.uid;

        const pingTimer = setTimeout(() => {

            const ret = { num: '99999999999999999999' } as proto.ILargeNumber;
            let opts: ScheduleOptions = {
                type: 'broadcast',
                userOptions: {
                    binded: false,
                    filterParam: null
                }
            };
            this.app.components.__connector__.send(null, Structs.foo.NotifyLargeNumber.route, ret, [sid], opts, () => { });

            // const sessionService = this.app.get('sessionService') as SessionService;
            // sessionService.sendMessage(sid, ret);

            // let channel = channelService.getChannel(name, flag);
            // let param = {
            //     user: username
            // };
            // console.log('send on add', param);
            // channel.pushMessage('onAdd', param);
            // this.app.get
        }, 1000);
    }


    /**
     * New client entry.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
    async entry(msg: any, session: FrontendSession) {
        return { code: 200, msg: 'game server is ok.' };
    }

    /**
     * Publish route for mqtt connector.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
    async publish(msg: any, session: FrontendSession) {
        let result = {
            topic: 'publish',
            payload: JSON.stringify({ code: 200, msg: 'publish message is ok.' })
        };
        return result;
    }

    /**
     * Subscribe route for mqtt connector.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
    async subscribe(msg: any, session: FrontendSession) {
        let result = {
            topic: 'subscribe',
            payload: JSON.stringify({ code: 200, msg: 'subscribe message is ok.' })
        };
        return result;
    }

}