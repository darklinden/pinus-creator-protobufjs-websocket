const fs = require('fs');
const ps = require('path');
const file = ps.join(__dirname, '..', 'proto-structs', 'index.d.ts');
const original = fs.readFileSync(file, { encoding: 'utf8' });
fs.writeFileSync(file, 
`import * as $protobuf from "protobufjs";

declare namespace root {
    ${original}
}
export default root;
`);