import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const venueSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  address: z.string().min(1),
  city: z.enum(['São Paulo', 'Rio de Janeiro']),
  neighborhood: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Placeholder owner ID for now
const PLACEHOLDER_OWNER_ID = 'owner-placeholder';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = venueSchema.parse(body);

    // Create or get placeholder owner
    let owner = await prisma.user.findUnique({
      where: { id: PLACEHOLDER_OWNER_ID },
    });

    if (!owner) {
      owner = await prisma.user.create({
        data: {
          id: PLACEHOLDER_OWNER_ID,
          email: 'owner@demo.com',
          name: 'Demo Owner',
          role: 'OWNER',
        },
      });
    }

    const venue = await prisma.venue.create({
      data: {
        ...validated,
        ownerId: owner.id,
      },
    });

    return NextResponse.json(venue);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid venue data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating venue:', error);
    return NextResponse.json(
      { error: 'Failed to create venue' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // For now, return all venues (in production, filter by ownerId)
    const venues = await prisma.venue.findMany({
      include: {
        courts: {
          include: {
            sport: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(venues);
  } catch (error) {
    console.error('Error fetching venues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venues' },
      { status: 500 }
    );
  }
}

