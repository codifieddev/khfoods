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
  if (allowedOrigins.some(domain => origin.includes(domain))) {
    return origin;
  }
  return '';
}

export async function GET(req: NextRequest) {
  const corsOrigin = await getCorsOrigin(req);
  const db = await getMongoDb();
  const roles = await db.collection('roles').find({}).toArray();
  const res = new NextResponse(JSON.stringify({ docs: roles }), {
    status: 200
  });
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
