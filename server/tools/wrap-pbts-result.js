const fs = require('fs');
const ps = require('path');

{
    const file = ps.join(__dirname, '..', 'proto-structs', 'index.js');
    let original = fs.readFileSync(file, { encoding: 'utf8' });

    let lines = original.split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        if (line.toLowerCase().indexOf('module.exports') != -1 && line.toLowerCase().indexOf('$root') != -1) {
            lines.splice(i, 1);
            break;
        }
    }
    original = lines.join('\n');

    fs.writeFileSync(file,
        `${original}
exports.root = $root;
`);
}

{
    const file = ps.join(__dirname, '..', 'proto-structs', 'index.d.ts');
    const original = fs.readFileSync(file, { encoding: 'utf8' });
    fs.writeFileSync(file,
        `import * as $protobuf from "protobufjs";
    
export declare namespace root {
${original}
}`);
}