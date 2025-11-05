import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courtId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Parse date
    const date = new Date(dateStr + 'T00:00:00');
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Get court with venue timezone info (for now, use server local time)
    const court = await prisma.court.findUnique({
      where: { id: courtId },
      include: { venue: true },
    });

    if (!court) {
      return NextResponse.json(
        { error: 'Court not found' },
        { status: 404 }
      );
    }

    // Get all bookings for this court on this date
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        courtId,
        startTs: {
          gte: dayStart,
          lt: dayEnd,
        },
      },
    });

    // Get all blocks for this court on this date
    const blocks = await prisma.courtBlock.findMany({
      where: {
        courtId,
        startTs: {
          gte: dayStart,
          lt: dayEnd,
        },
      },
    });

    // Generate hourly slots (60 minutes)
    const slots: { start: string; end: string; available: boolean }[] = [];
    const openMinutes = court.openTime;
    const closeMinutes = court.closeTime;

    // Convert minutes from midnight to actual times for the date
    const openHour = Math.floor(openMinutes / 60);
    const openMin = openMinutes % 60;
    const closeHour = Math.floor(closeMinutes / 60);
    const closeMin = closeMinutes % 60;

    const slotStart = new Date(date);
    slotStart.setHours(openHour, openMin, 0, 0);

    const slotEnd = new Date(date);
    slotEnd.setHours(closeHour, closeMin, 0, 0);

    let currentSlot = new Date(slotStart);

    while (currentSlot < slotEnd) {
      const slotStartTime = new Date(currentSlot);
      const slotEndTime = new Date(currentSlot);
      slotEndTime.setHours(slotEndTime.getHours() + 1);

      // Check if slot overlaps with any booking
      const hasBookingConflict = bookings.some((booking) => {
        return (
          slotStartTime < new Date(booking.endTs) &&
          slotEndTime > new Date(booking.startTs)
        );
      });

      // Check if slot overlaps with any block
      const hasBlockConflict = blocks.some((block) => {
        return (
          slotStartTime < new Date(block.endTs) &&
          slotEndTime > new Date(block.startTs)
        );
      });

      const available = !hasBookingConflict && !hasBlockConflict;

      slots.push({
        start: slotStartTime.toISOString(),
        end: slotEndTime.toISOString(),
        available,
      });

      // Move to next hour
      currentSlot.setHours(currentSlot.getHours() + 1);
    }

    return NextResponse.json({
      courtId,
      slots,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}

