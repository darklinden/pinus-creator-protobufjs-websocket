"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
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
        const ret = {
            IntNumber: "123456",
            LongNumber: "123456789123456789",
            StringNumber: "123456789123456789"
        };
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
            const ret = {
                IntNumber: "123456",
                LongNumber: "123456789123456789",
                StringNumber: "123456789123456789"
            };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vYXBwL3NlcnZlcnMvY29ubmVjdG9yL2hhbmRsZXIvZW50cnlIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLGlEQUF3QztBQUV4QyxtQkFBeUIsR0FBZ0I7SUFDckMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRkQsNEJBRUM7QUFFRCxNQUFhLE9BQU87SUFDaEIsWUFBb0IsR0FBZ0I7UUFBaEIsUUFBRyxHQUFILEdBQUcsQ0FBYTtJQUVwQyxDQUFDO0lBR0Q7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQVEsRUFBRSxPQUF3QjtRQUUxQyxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsWUFBWSx1QkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0YsTUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFnQixDQUFDO1FBRXhDLGdHQUFnRztRQUVoRyxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBUSxFQUFFLE9BQXdCO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxZQUFZLHVCQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU3RixNQUFNLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQWdCLENBQUM7UUFFeEMsZ0dBQWdHO1FBRWhHLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFRLEVBQUUsT0FBd0I7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQixNQUFNLEdBQUcsR0FBRztZQUNSLFNBQVMsRUFBRSxRQUFRO1lBQ25CLFVBQVUsRUFBRSxvQkFBb0I7WUFDaEMsWUFBWSxFQUFFLG9CQUFvQjtTQUNyQyxDQUFDO1FBRUYsZ0dBQWdHO1FBRWhHLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEdBQVEsRUFBRSxPQUF3QjtRQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDdkIsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUV4QixNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBRTlCLE1BQU0sR0FBRyxHQUFHO2dCQUNSLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixVQUFVLEVBQUUsb0JBQW9CO2dCQUNoQyxZQUFZLEVBQUUsb0JBQW9CO2FBQ3JDLENBQUM7WUFDRixJQUFJLElBQUksR0FBb0I7Z0JBQ3hCLElBQUksRUFBRSxXQUFXO2dCQUNqQixXQUFXLEVBQUU7b0JBQ1QsTUFBTSxFQUFFLEtBQUs7b0JBQ2IsV0FBVyxFQUFFLElBQUk7aUJBQ3BCO2FBQ0osQ0FBQztZQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLHVCQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFL0csMkVBQTJFO1lBQzNFLHdDQUF3QztZQUV4Qyx1REFBdUQ7WUFDdkQsZ0JBQWdCO1lBQ2hCLHFCQUFxQjtZQUNyQixLQUFLO1lBQ0wscUNBQXFDO1lBQ3JDLHVDQUF1QztZQUN2QyxlQUFlO1FBQ25CLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNiLENBQUM7SUFHRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBUSxFQUFFLE9BQXdCO1FBQzFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxvQkFBb0IsRUFBRSxDQUFDO0lBQ3BELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBUSxFQUFFLE9BQXdCO1FBQzVDLElBQUksTUFBTSxHQUFHO1lBQ1QsS0FBSyxFQUFFLFNBQVM7WUFDaEIsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSx3QkFBd0IsRUFBRSxDQUFDO1NBQ3hFLENBQUM7UUFDRixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQVEsRUFBRSxPQUF3QjtRQUM5QyxJQUFJLE1BQU0sR0FBRztZQUNULEtBQUssRUFBRSxXQUFXO1lBQ2xCLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQztTQUMxRSxDQUFDO1FBQ0YsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztDQUVKO0FBM0lELDBCQTJJQyJ9