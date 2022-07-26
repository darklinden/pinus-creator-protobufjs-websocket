import * as fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folder = path.join(__dirname, '..', 'dist', 'cjs');

fs.readdir(folder, (err, files) => {
    files.forEach(file => {
        // console.log(file);
        const file_path = path.join(folder, file);
        let des_path = '';
        if (file_path.endsWith('.js')) {
            des_path = file_path.substring(0, file_path.length - 3) + '.cjs';
        }
        else if (file_path.endsWith('.js.map')) {
            des_path = file_path.substring(0, file_path.length - 7) + '.cjs.map';
        }

        if (des_path.length) {
            fs.rename(file_path, des_path, function (err) {
                if (err) console.log('ERROR: ' + err);

                let original = fs.readFileSync(des_path, { encoding: 'utf8' });

                let lines = original.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i];
                    line = line.replace(/require\(\"\.\/(.*)\"\)/g, 'require("./' + '$1' + '.cjs")');
                    lines[i] = line;
                }

                original = lines.join('\n');
                fs.writeFileSync(des_path, original);
            });
        }
    });
});

