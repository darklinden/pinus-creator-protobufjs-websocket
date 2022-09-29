import * as fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname, '..', 'commonjs', 'index.cjs');
let original = fs.readFileSync(file, { encoding: 'utf8' });

let lines = original.split('\n');
// remove first comment and strict and last module.exports =
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.trim() == 'var $protobuf = require("protobufjs/minimal.js");') {
        lines.splice(i, 1, 'var $protobuf = require("protobufjs-nolong/minimal.js");');
        break;
    }
}
original = lines.join('\n');

fs.writeFileSync(file, original);
