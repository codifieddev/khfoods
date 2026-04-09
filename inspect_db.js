const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function main() {
    const uri = process.env.MONGODB_URI || process.env.DATABASE_URI;
    if (!uri) {
        console.log("NO_URI");
        return;
    }
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(); // uses default from URI
        const dbName = db.databaseName;
        console.log("DB_NAME:" + dbName);
        const collections = await db.listCollections().toArray();
        console.log("COLLECTIONS:" + collections.map(c => c.name).join(","));
    } catch (e) {
        console.log("ERROR:" + e.message);
    } finally {
        await client.close();
    }
}
main();
