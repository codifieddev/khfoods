const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, 'app', 'admin', '(dashboard)');

function renameDir(oldName, newName) {
    const oldPath = path.join(dashboardPath, oldName);
    const newPath = path.join(dashboardPath, newName);
    if (fs.existsSync(oldPath)) {
        try {
            fs.renameSync(oldPath, newPath);
            console.log(`Successfully renamed ${oldName} to ${newName}`);
        } catch (err) {
            console.error(`Error renaming ${oldName}:`, err);
        }
    } else {
        console.log(`${oldName} does not exist at ${oldPath}`);
    }
}

renameDir('categories', 'collections');
renameDir('customers', 'clients');
