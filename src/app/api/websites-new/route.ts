import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getMongoDb } from '@/data/mongo/client';

async function getAllowedOrigins() {
  const db = await getMongoDb();
  const websites = await db
    .collection('websites')
    .find(
      {},
      {
        projection: {
          domains: 1
        }
      }
    )
    .toArray();
  // Flatten all domains from all websites
  const allowed = websites.flatMap(site =>
    Array.isArray(site.domains)
      ? site.domains.map(d => d.domain)
      : []
  );

  return allowed;
}

function getOriginFromRequest(req: NextRequest) {
  return req.headers.get('origin') || req.headers.get('referer') || '';
}

async function getCorsOrigin(req: NextRequest) {
  const origin = getOriginFromRequest(req);
  
  
  
  const allowedOrigins = await getAllowedOrigins();
  // Normalize origin for localhost (strip protocol)
  let normalizedOrigin = origin.replace(/^https?:\/\//, '');
  // Check for exact match or protocol-less match
  if (allowedOrigins.some(domain => domain === normalizedOrigin || origin.includes(domain))) {
    return origin;
  }
  return '';
}

export async function POST(req: NextRequest) {
  const corsOrigin = await getCorsOrigin(req);
  const db = await getMongoDb();

  try {
    const data = await req.json();
    const insertResult = await db.collection('websites').insertOne(data);
    const created = await db.collection('websites').findOne({
      _id: insertResult.insertedId
    });

    const res = new NextResponse(JSON.stringify(created), {
      status: 201
    });
    res.headers.set('Access-Control-Allow-Origin', corsOrigin);
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    return res;
  } catch (error) {
    console.log('websites-new POST error', error);
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const corsOrigin = await getCorsOrigin(req);
   const res = new NextResponse(JSON.stringify({
    message: 'Websites API works!',
    corsOrigin
  }), {
    status: 200
  });
  console.log("res",res)
  res.headers.set('Access-Control-Allow-Origin', corsOrigin);
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  return res;
}

export async function OPTIONS(req: NextRequest) {
  const corsOrigin = await getCorsOrigin(req);
  const res = new NextResponse(null, {
    status: 204
  });
  res.headers.set('Access-Control-Allow-Origin', corsOrigin);
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  return res;
}
