'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface Slot {
  start: string;
  end: string;
  available: boolean;
}

interface AvailabilityData {
  courtId: string;
  slots: Slot[];
}

export function AvailabilityGrid({ courtId }: { courtId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch(`/api/courts/${courtId}/availability?date=${dateStr}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch availability');
        }
        return res.json();
      })
      .then((data) => {
        setAvailability(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [courtId, dateStr]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', e.target.value);
    router.push(`?${params.toString()}`);
  };

  const handleSlotClick = (slot: Slot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    setIsBooking(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courtId,
          startTs: selectedSlot.start,
          endTs: selectedSlot.end,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create booking');
      }

      const booking = await response.json();
      router.push(`/checkout/${booking.id}`);
    } catch (err: any) {
      alert(err.message || 'Erro ao criar reserva');
      setIsBooking(false);
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Carregando horários...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Erro: {error}</div>;
  }

  if (!availability || availability.slots.length === 0) {
    return <div className="text-center py-8 text-gray-500">Nenhum horário disponível</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data
        </label>
        <input
          type="date"
          value={dateStr}
          onChange={handleDateChange}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {availability.slots.map((slot, index) => (
          <button
            key={index}
            onClick={() => handleSlotClick(slot)}
            disabled={!slot.available}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              slot.available
                ? selectedSlot === slot
                  ? 'bg-blue-600 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {formatTime(slot.start)}
          </button>
        ))}
      </div>

      {selectedSlot && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="mb-2">
            <div className="text-sm text-gray-600">Horário selecionado:</div>
            <div className="font-semibold">
              {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}
            </div>
          </div>
          <button
            onClick={handleBooking}
            disabled={isBooking}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {isBooking ? 'Reservando...' : 'Reservar'}
          </button>
        </div>
      )}
    </div>
  );
}

