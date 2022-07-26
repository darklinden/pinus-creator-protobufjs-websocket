import * as fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname, '..', 'esm', 'index.js');
let original = fs.readFileSync(file, { encoding: 'utf8' });

let lines = original.split('\n');

// remove first comment and strict and last module.exports =
lines = lines.splice(10, lines.length - 12);
lines.unshift(
    'import $protobuf from "protobufjs/minimal.js";',
    'const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;'
);

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    line = line.replace(/^\$root\.(.*) = \(function\(\) \{/g, 'export const $1 = (function() {');
    lines[i] = line;
}

original = lines.join('\n');

original = original.replace(/\$root\./g, '');

fs.writeFileSync(file, original);
