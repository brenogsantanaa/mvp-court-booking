import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sports = await prisma.sport.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(sports);
  } catch (error: any) {
    console.error('Error fetching sports:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch sports',
        message: error?.message || 'Database connection error. Make sure migrations have been run.',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

