import * as fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname, '..', 'types', 'index.d.ts');
const original = fs.readFileSync(file, { encoding: 'utf8' });
fs.writeFileSync(file,
    `import * as $protobuf from "protobufjs";
import * as Long from "long";
${original}`);
