// /api/image-upload.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

 
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

if ( !IMAGEKIT_PRIVATE_KEY) {
  throw new Error('Missing ImageKit private key');
}

 

export async function GET(req:Request) {
  const { searchParams } = new URL(req.url);
  try {
    const token = searchParams.get('token') || crypto.randomUUID();
  const expire = searchParams.get('expire') || (Math.floor(Date.now() / 1000) + 2400).toString();
  const privateAPIKey = IMAGEKIT_PRIVATE_KEY;
  const signature = crypto.createHmac('sha1', privateAPIKey!).update(token + expire).digest('hex');

 
  return NextResponse.json({
    token,
    expire,
    signature
  });
  } catch (error) {
    console.error('Error generating authentication parameters:', error);
    return NextResponse.json({
      error: 'Failed to generate authentication parameters',
    }, { status: 500 });
  }
}