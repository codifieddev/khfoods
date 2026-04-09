
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Mock dependencies
const defaultLocale = 'en';

async function main() {
  const uri = process.env.DATABASE_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error('No URI');
    return;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('khfoods_admin'); // as in client.ts
    const query = { _status: 'published', slug: 'about' };
    console.log('Query:', query);
    
    const rawPages = await db.collection('pages').find(query).toArray();
    console.log('Raw Pages found:', rawPages.length);
    
    // If we want to test normalization, we'd need to import much more.
    // But let's just see if this part works.

  } catch (e) {
    console.error('API Logic Error:', e);
  } finally {
    await client.close();
  }
}

main();
