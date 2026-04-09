const { MongoClient } = require('mongodb');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function main() {
    const uri = process.env.MONGODB_URI || process.env.DATABASE_URI;
    let output = "";
    if (!uri) {
        output = "NO_URI\n";
    } else {
        const client = new MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(); 
            const dbName = db.databaseName;
            output += "DB_NAME:" + dbName + "\n";
            const collections = await db.listCollections().toArray();
            output += "COLLECTIONS:" + collections.map(c => c.name).join(",") + "\n";
            
            // Check pages specifically
            const pages = await db.collection('pages').find({}).limit(1).toArray();
            output += "PAGES_COUNT:" + pages.length + "\n";
            if (pages.length > 0) {
                output += "PAGE_SAMPLE:" + JSON.stringify(pages[0].slug) + "\n";
            }
        } catch (e) {
            output += "ERROR:" + e.message + "\n";
        } finally {
            await client.close();
        }
    }
    fs.writeFileSync('db_check_result.txt', output);
    console.log("Done");
}
main();
