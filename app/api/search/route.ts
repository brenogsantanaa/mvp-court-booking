import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const searchSchema = z.object({
  city: z.string().min(1),
  sport: z.string().optional(),
  date: z.string().optional(),
  bbox: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = {
      city: searchParams.get('city') || '',
      sport: searchParams.get('sport') || undefined,
      date: searchParams.get('date') || undefined,
      bbox: searchParams.get('bbox') || undefined,
    };

    const validated = searchSchema.parse(params);

    const where: any = {
      venue: {
        city: {
          equals: validated.city,
          mode: 'insensitive',
        },
      },
    };

    if (validated.sport) {
      where.sport = {
        slug: validated.sport,
      };
    }

    const courts = await prisma.court.findMany({
      where,
      include: {
        sport: {
          select: {
            slug: true,
            name: true,
          },
        },
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            neighborhood: true,
            lat: true,
            lng: true,
          },
        },
      },
      take: 100,
    });

    const result = courts.map((court) => ({
      id: court.id,
      sport: court.sport,
      venue: court.venue,
      indoor: court.indoor,
      surface: court.surface,
      lights: court.lights,
      priceHour: court.priceHour,
    }));

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error searching courts:', error);
    return NextResponse.json(
      { error: 'Failed to search courts' },
      { status: 500 }
    );
  }
}

