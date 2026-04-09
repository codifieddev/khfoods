
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const uri = process.env.DATABASE_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error('No URI');
    process.exit(1);
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Test the database names
    const adminDb = client.db('khfoods_admin');
    const khfoodDb = client.db('khfoods');
    
    const adminPages = await adminDb.collection('pages').find({}).toArray();
    console.log('Pages in khfoods_admin count:', adminPages.length);
    
    const khfoodPages = await khfoodDb.collection('pages').find({}).toArray();
    console.log('Pages in khfoods count:', khfoodPages.length);
    
    if (khfoodPages.length > 0) {
      console.log('Sample khfoods page:', JSON.stringify(khfoodPages[0], null, 2));
    }

  } catch (e) {
    console.error('DB Error:', e);
  } finally {
    await client.close();
  }
}

main();
