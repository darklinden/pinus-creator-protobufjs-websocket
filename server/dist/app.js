"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_1 = require("pinus");
const preload_1 = require("./preload");
const coder = require("./app/protobuf_coder");
/**
 *  替换全局Promise
 *  自动解析sourcemap
 *  捕获全局错误
 */
(0, preload_1.preload)();
/**
 * Init app for client.
 */
let app = pinus_1.pinus.createApp();
app.set('name', 'test_server');
// app configuration
app.configure('production|development', 'connector', function () {
    app.set('connectorConfig', {
        connector: pinus_1.pinus.connectors.hybridconnector,
        encode: coder.encode,
        decode: coder.decode,
        heartbeat: 3,
        useDict: true,
        useProtobuf: false
    });
});
// start app
app.start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQThCO0FBQzlCLHVDQUFvQztBQUNwQyw4Q0FBOEM7QUFFOUM7Ozs7R0FJRztBQUNILElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBRVY7O0dBRUc7QUFDSCxJQUFJLEdBQUcsR0FBRyxhQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDNUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFFL0Isb0JBQW9CO0FBQ3BCLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0JBQXdCLEVBQUUsV0FBVyxFQUFFO0lBQ2pELEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQ3JCO1FBQ0ksU0FBUyxFQUFFLGFBQUssQ0FBQyxVQUFVLENBQUMsZUFBZTtRQUMzQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07UUFDcEIsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1FBQ3BCLFNBQVMsRUFBRSxDQUFDO1FBQ1osT0FBTyxFQUFFLElBQUk7UUFDYixXQUFXLEVBQUUsS0FBSztLQUNyQixDQUFDLENBQUM7QUFDWCxDQUFDLENBQUMsQ0FBQztBQUVILFlBQVk7QUFDWixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMifQ==