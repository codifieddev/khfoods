const fs = require('fs');
const path = require('path');

const base = process.cwd();
const ref = path.join(base, 'reference');

const folders = ['src', ['app', '_components'], 'public', 'redux', 'data'];

console.log('Starting migration...');

folders.forEach(f => {
    const folderPath = Array.isArray(f) ? path.join(...f) : f;
    const src = path.join(ref, folderPath);
    const dest = path.join(base, folderPath);
    
    if (fs.existsSync(src)) {
        console.log(`Copying ${src} to ${dest}`);
        try {
            // Use cpSync for recursive copy if available, otherwise fallback
            if (fs.cpSync) {
                fs.cpSync(src, dest, { recursive: true, force: true });
            } else {
                console.log('cpSync not available, using manual copy for ' + folderPath);
                // I'll just skip complex fallback for now and assume cpSync is there
            }
        } catch (e) {
            console.error(`Failed to copy ${folderPath}:`, e);
        }
    } else {
        console.log(`Source ${src} does not exist`);
    }
});

console.log('Migration attempt finished.');
