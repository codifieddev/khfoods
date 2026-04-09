const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const base = 'c:\\Users\\Princy Singh\\Downloads\\allied-surplus';
const ref = path.join(base, 'reference');

console.log('Starting copy...');
try {
  copyRecursiveSync(path.join(ref, 'src'), path.join(base, 'src'));
  copyRecursiveSync(path.join(ref, 'app', '_components'), path.join(base, 'app', '_components'));
  copyRecursiveSync(path.join(ref, 'public'), path.join(base, 'public'));
  copyRecursiveSync(path.join(ref, 'redux'), path.join(base, 'redux'));
  fs.copyFileSync(path.join(ref, 'data', 'products.ts'), path.join(base, 'data', 'products.ts'));
  console.log('Copy complete!');
} catch (err) {
  console.error('Error during copy:', err);
}
