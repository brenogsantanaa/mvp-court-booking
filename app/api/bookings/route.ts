import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bookingSchema = z.object({
  courtId: z.string(),
  startTs: z.string().datetime(),
  endTs: z.string().datetime(),
});

// Placeholder user ID for now
const PLACEHOLDER_USER_ID = 'user-placeholder';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = bookingSchema.parse(body);

    const startTs = new Date(validated.startTs);
    const endTs = new Date(validated.endTs);

    if (startTs >= endTs) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      );
    }

    // Check for conflicts with existing bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        courtId: validated.courtId,
        OR: [
          {
            // Existing booking starts before our end and ends after our start
            startTs: { lt: endTs },
            endTs: { gt: startTs },
          },
        ],
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Slot not available' },
        { status: 409 }
      );
    }

    // Get court to calculate price
    const court = await prisma.court.findUnique({
      where: { id: validated.courtId },
    });

    if (!court) {
      return NextResponse.json(
        { error: 'Court not found' },
        { status: 404 }
      );
    }

    // Calculate price (assume 60 min for now)
    const durationHours = (endTs.getTime() - startTs.getTime()) / (1000 * 60 * 60);
    const price = Math.round(court.priceHour * durationHours);

    // Create or get placeholder user
    let user = await prisma.user.findUnique({
      where: { id: PLACEHOLDER_USER_ID },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: PLACEHOLDER_USER_ID,
          email: 'placeholder@demo.com',
          name: 'Placeholder User',
        },
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        courtId: validated.courtId,
        startTs,
        endTs,
        status: 'PENDING',
        price,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

