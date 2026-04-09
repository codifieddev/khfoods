
import { getMongoDb } from './src/data/mongo/client';
import { normalizeCollectionDocument } from './src/data/storefront/mongoPayload';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  try {
    const db = await getMongoDb();
    console.log('Connected to DB');
    
    const query = { _status: 'published' };
    const rawPages = await db.collection('pages').find({}).toArray();
    console.log('Total pages in collection:', rawPages.length);
    console.log('Slugs found:', rawPages.map(p => p.slug));
    
    const aboutPage = rawPages.find(p => p.slug === 'about');
    if (!aboutPage) {
      console.log('No "about" page found with slug "about"');
      return;
    }
    
    console.log('Normalizing "about" page...');
    const result = await normalizeCollectionDocument('pages', aboutPage as any, 'en', 2);
    console.log('Normalized Result:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('CRASH:', error);
  } finally {
    process.exit();
  }
}

main();
