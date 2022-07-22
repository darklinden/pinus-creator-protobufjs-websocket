import { Application, FrontendSession } from 'pinus';

import { proto } from "proto-structs";
import { Structs } from '../../../structs/Structs';

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