const fs = require('fs');

const file = fs.readFileSync('./ethkey.opt.wasm', { encoding: 'base64' });

fs.writeFileSync('../src/ethkey.wasm.js', `export default new Buffer('${file}', 'base64');\n`);
