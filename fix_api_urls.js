const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('c:/Users/satwi/ADA/client/src');
let changed = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('http://localhost:5000')) {
        // Find single quote strings 'http://localhost:5000/api/...'
        content = content.replace(/'http:\/\/localhost:5000([^']+)'/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000"}$1`');
        // Find backtick strings `http://localhost:5000/api/...`
        content = content.replace(/`http:\/\/localhost:5000([^`]+)`/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000"}$1`');
        
        fs.writeFileSync(file, content);
        changed++;
    }
});
console.log('Modified ' + changed + ' files.');
