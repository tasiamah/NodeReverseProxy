const yaml = require('js-yaml');
const fs   = require('fs');

// Get document, or throw exception on error
let doc;
try {
    doc = yaml.load(fs.readFileSync('proxy.yml', 'utf8'));
    console.log(doc);
} catch (e) {
    console.log(e);
}
exports.config = doc;
