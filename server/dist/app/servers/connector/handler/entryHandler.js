"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const pinus_1 = require("pinus");
const proto_structs_1 = require("proto-structs");
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
__decorate([
    (0, struct_routes_1.MarkRoute)('BarRoute', proto_structs_1.proto.Bar, proto_structs_1.proto.Foo),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pinus_1.FrontendSession]),
    __metadata("design:returntype", Promise)
], Handler.prototype, "onBar", null);
__decorate([
    (0, struct_routes_1.MarkRoute)('FooRoute', proto_structs_1.proto.Foo, proto_structs_1.proto.Bar),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pinus_1.FrontendSession]),
    __metadata("design:returntype", Promise)
], Handler.prototype, "onFoo", null);
__decorate([
    (0, struct_routes_1.MarkRoute)('NumRoute', proto_structs_1.proto.LargeNumber, proto_structs_1.proto.LargeNumber),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pinus_1.FrontendSession]),
    __metadata("design:returntype", Promise)
], Handler.prototype, "onLargeNumber", null);
__decorate([
    (0, struct_routes_1.MarkRoute)('NumRoute', proto_structs_1.proto.LargeNumber, proto_structs_1.proto.LargeNumber),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pinus_1.FrontendSession]),
    __metadata("design:returntype", Promise)
], Handler.prototype, "onNotifyLargeNumber", null);
exports.Handler = Handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vYXBwL3NlcnZlcnMvY29ubmVjdG9yL2hhbmRsZXIvZW50cnlIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLGlDQUFxRDtBQUVyRCxpREFBc0M7QUFDdEMsaURBQW1EO0FBRW5ELG1CQUF5QixHQUFnQjtJQUNyQyxPQUFPLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFGRCw0QkFFQztBQUVELE1BQWEsT0FBTztJQUNoQixZQUFvQixHQUFnQjtRQUFoQixRQUFHLEdBQUgsR0FBRyxDQUFhO0lBRXBDLENBQUM7SUFHRDs7Ozs7T0FLRztJQUVILEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBUSxFQUFFLE9BQXdCO1FBRTFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxZQUFZLHVCQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU3RixNQUFNLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQWdCLENBQUM7UUFFeEMsZ0dBQWdHO1FBRWhHLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7OztPQUtHO0lBRUgsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFRLEVBQUUsT0FBd0I7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLFlBQVksdUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTdGLE1BQU0sR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBZ0IsQ0FBQztRQUV4QyxnR0FBZ0c7UUFFaEcsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFFSCxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQVEsRUFBRSxPQUF3QjtR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