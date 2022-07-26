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
        console.log(msg.num);
        const ret = { num: '99999999999999999999' };
        // console.log('ret instanceof Structs.foo.Foo.server:', ret instanceof Structs.foo.Foo.server);
        return ret;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vYXBwL3NlcnZlcnMvY29ubmVjdG9yL2hhbmRsZXIvZW50cnlIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLGlEQUF3QztBQUV4QyxtQkFBeUIsR0FBZ0I7SUFDckMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRkQsNEJBRUM7QUFFRCxNQUFhLE9BQU87SUFDaEIsWUFBb0IsR0FBZ0I7UUFBaEIsUUFBRyxHQUFILEdBQUcsQ0FBYTtJQUVwQyxDQUFDO0lBR0Q7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQVEsRUFBRSxPQUF3QjtRQUUxQyxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsWUFBWSx1QkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0YsTUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFnQixDQUFDO1FBRXhDLGdHQUFnRztRQUVoRyxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBUSxFQUFFLE9BQXdCO1FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxZQUFZLHVCQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU3RixNQUFNLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQWdCLENBQUM7UUFFeEMsZ0dBQWdHO1FBRWhHLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFRLEVBQUUsT0FBd0I7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFckIsTUFBTSxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsc0JBQXNCLEVBQXdCLENBQUM7UUFFbEUsZ0dBQWdHO1FBRWhHLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUdEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFRLEVBQUUsT0FBd0I7UUFDMUMsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLG9CQUFvQixFQUFFLENBQUM7SUFDcEQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFRLEVBQUUsT0FBd0I7UUFDNUMsSUFBSSxNQUFNLEdBQUc7WUFDVCxLQUFLLEVBQUUsU0FBUztZQUNoQixPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLHdCQUF3QixFQUFFLENBQUM7U0FDeEUsQ0FBQztRQUNGLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBUSxFQUFFLE9BQXdCO1FBQzlDLElBQUksTUFBTSxHQUFHO1lBQ1QsS0FBSyxFQUFFLFdBQVc7WUFDbEIsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSwwQkFBMEIsRUFBRSxDQUFDO1NBQzFFLENBQUM7UUFDRixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0NBRUo7QUE5RkQsMEJBOEZDIn0=