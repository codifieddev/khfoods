const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source ${src} does not exist`);
    return;
  }
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
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

const base = process.cwd();
const ref = path.join(base, 'reference');

console.log('Base:', base);
console.log('Ref:', ref);

try {
  copyRecursiveSync(path.join(ref, 'src'), path.join(base, 'src'));
  copyRecursiveSync(path.join(ref, 'app', '_components'), path.join(base, 'app', '_components'));
  copyRecursiveSync(path.join(ref, 'public'), path.join(base, 'public'));
  copyRecursiveSync(path.join(ref, 'redux'), path.join(base, 'redux'));
  
  if (fs.existsSync(path.join(ref, 'data', 'products.ts'))) {
      fs.copyFileSync(path.join(ref, 'data', 'products.ts'), path.join(base, 'data', 'products.ts'));
  }
  console.log('Copy complete successfully!');
} catch (err) {
  console.error('Error during copy:', err);
}
