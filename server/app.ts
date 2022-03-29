import { pinus } from 'pinus';
import { preload } from './preload';
import * as coder from './app/structs/protobuf_coder';

/**
 *  替换全局Promise
 *  自动解析sourcemap
 *  捕获全局错误
 */
preload();

/**
 * Init app for client.
 */
let app = pinus.createApp();
app.set('name', 'test_server');

// app configuration
app.configure('production|development', 'connector', function () {
    app.set('connectorConfig',
        {
            connector: pinus.connectors.hybridconnector,
            encode: coder.encode,
            decode: coder.decode,
            heartbeat: 3,
            useDict: true,
            useProtobuf: false
        });
});

// start app
app.start();

