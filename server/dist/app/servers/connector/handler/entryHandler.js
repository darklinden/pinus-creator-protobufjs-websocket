"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const Long = require("long");
const struct_routes_1 = require("struct-routes");
function default_1(app) {
    return new Handler(app);
}
exports.default = default_1;
class Handler {
    constructor(app) {
        this.app = app;
    }
    /**
     * New client entry.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
    async onBar(msg, session) {
        console.log('msg instanceof Structs.bar.Bar.client:', msg instanceof struct_routes_1.Structs.bar.Bar.client);
        const ret = { foo: 2048 };
        // console.log('ret instanceof Structs.bar.Bar.server:', ret instanceof Structs.bar.Bar.server);
        return ret;
    }
    /**
     * New client entry.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
    async onFoo(msg, session) {
        console.log('msg instanceof Structs.foo.Foo.client:', msg instanceof struct_routes_1.Structs.foo.Foo.client);
        const ret = { bar: 2048 };
        // console.log('ret instanceof Structs.foo.Foo.server:', ret instanceof Structs.foo.Foo.server);
        return ret;
    }
    /**
     * New client entry.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
    async onLargeNumber(msg, session) {
        console.log(msg);
        const ret = { strNum: '99999999999999999999', longNum: Long.fromString('9999999999999') };
        // console.log('ret instanceof Structs.foo.Foo.server:', ret instanceof Structs.foo.Foo.server);
        return ret;
    }
    /**
     * New client entry.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
    async onNotifyLargeNumber(msg, session) {
        console.log(msg);
        const sid = session.id;
        const uid = session.uid;
        const pingTimer = setTimeout(() => {
            const ret = { strNum: '99999999999999999999', longNum: Long.fromString('9999999999999') };
            let opts = {
                type: 'broadcast',
                userOptions: {
                    binded: false,
                    filterParam: null
                }
            };
            this.app.components.__connector__.send(null, struct_routes_1.Structs.foo.NotifyLargeNumber.route, ret, [sid], opts, () => { });
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
    async entry(msg, session) {
        return { code: 200, msg: 'game server is ok.' };
    }
    /**
     * Publish route for mqtt connector.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
    async publish(msg, session) {
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
    async subscribe(msg, session) {
        let result = {
            topic: 'subscribe',
            payload: JSON.stringify({ code: 200, msg: 'subscribe message is ok.' })
        };
        return result;
    }
}
exports.Handler = Handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vYXBwL3NlcnZlcnMvY29ubmVjdG9yL2hhbmRsZXIvZW50cnlIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLDZCQUE4QjtBQUU5QixpREFBd0M7QUFFeEMsbUJBQXlCLEdBQWdCO0lBQ3JDLE9BQU8sSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUZELDRCQUVDO0FBRUQsTUFBYSxPQUFPO0lBQ2hCLFlBQW9CLEdBQWdCO1FBQWhCLFFBQUcsR0FBSCxHQUFHLENBQWE7SUFFcEMsQ0FBQztJQUdEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFRLEVBQUUsT0FBd0I7UUFFMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLFlBQVksdUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTdGLE1BQU0sR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBZ0IsQ0FBQztRQUV4QyxnR0FBZ0c7UUFFaEcsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQVEsRUFBRSxPQUF3QjtRQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsWUFBWSx1QkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0YsTUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFnQixDQUFDO1FBRXhDLGdHQUFnRztRQUVoRyxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBUSxFQUFFLE9BQXdCO1FBQ2xELE9BQU8sQ0FBQyxHQUFHLENB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