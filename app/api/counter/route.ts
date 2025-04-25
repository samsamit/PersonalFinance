import { NextResponse } from 'next/server';

let counter = 0;

export async function POST() {
  counter += 1;
  return NextResponse.json({ count: counter });
} 