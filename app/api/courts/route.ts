import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const courtSchema = z.object({
  venueId: z.string(),
  sportId: z.string(),
  indoor: z.boolean(),
  surface: z.string().optional(),
  lights: z.boolean(),
  priceHour: z.number().int().positive(), // in cents
  openTime: z.number().int().min(0).max(1439), // minutes from midnight
  closeTime: z.number().int().min(0).max(1439),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = courtSchema.parse(body);

    if (validated.openTime >= validated.closeTime) {
      return NextResponse.json(
        { error: 'Close time must be after open time' },
        { status: 400 }
      );
    }

    // Verify venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: validated.venueId },
    });

    if (!venue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      );
    }

    // Verify sport exists
    const sport = await prisma.sport.findUnique({
      where: { id: validated.sportId },
    });

    if (!sport) {
      return NextResponse.json(
        { error: 'Sport not found' },
        { status: 404 }
      );
    }

    const court = await prisma.court.create({
      data: validated,
      include: {
        sport: true,
        venue: true,
      },
    });

    return NextResponse.json(court);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid court data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating court:', error);
    return NextResponse.json(
      { error: 'Failed to create court' },
      { status: 500 }
    );
  }
}

