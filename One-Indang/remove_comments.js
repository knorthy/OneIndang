const fs = require('fs');

let content = fs.readFileSync('constants/recommendations.js', 'utf8');

// Remove all comment lines
content = content.split('\n').filter(line => !/^\s*\/\/.*/.test(line)).join('\n');

fs.writeFileSync('constants/recommendations.js', content);

console.log('All comments removed');