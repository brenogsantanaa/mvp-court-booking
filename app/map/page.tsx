'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { SportFilter } from '@/components/SportFilter';
import Link from 'next/link';

interface Court {
  id: string;
  sport: {
    slug: string;
    name: string;
  };
  venue: {
    id: string;
    name: string;
    address: string;
    city: string;
    neighborhood: string | null;
    lat: number | null;
    lng: number | null;
  };
  indoor: boolean;
  surface: string | null;
  lights: boolean;
  priceHour: number;
}

function MapPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const city = searchParams.get('city') || 'São Paulo';
  const sport = searchParams.get('sport') || '';

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({ city });
    if (sport) {
      params.set('sport', sport);
    }

    fetch(`/api/search?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || errorData.error || 'Failed to fetch courts');
        }
        return res.json();
      })
      .then((data) => {
        setCourts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [city, sport]);

  const handleCityChange = (newCity: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('city', newCity);
    router.push(`?${params.toString()}`);
  };

  const formatPrice = (cents: number) => {
    return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky filter bar */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="space-y-4">
            {/* City selector */}
            <div className="flex gap-2">
              <button
                onClick={() => handleCityChange('São Paulo')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  city === 'São Paulo'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                São Paulo
              </button>
              <button
                onClick={() => handleCityChange('Rio de Janeiro')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  city === 'Rio de Janeiro'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Rio de Janeiro
              </button>
            </div>

            {/* Sport filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Esporte
              </label>
              <SportFilter />
            </div>

            {/* Date input (placeholder for future) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data
              </label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Court list */}
          <div className="space-y-4">
            {isLoading && (
              <div className="text-center py-8 text-gray-500">
                Carregando quadras...
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <div className="text-red-500 font-semibold mb-2">Erro ao carregar quadras</div>
                <div className="text-sm text-gray-600 mb-4">{error}</div>
                <button
                  onClick={() => {
                    setError(null);
                    setIsLoading(true);
                    const params = new URLSearchParams({ city });
                    if (sport) params.set('sport', sport);
                    fetch(`/api/search?${params.toString()}`)
                      .then(async (res) => {
                        if (!res.ok) {
                          const errorData = await res.json().catch(() => ({}));
                          throw new Error(errorData.message || errorData.error || 'Failed to fetch courts');
                        }
                        return res.json();
                      })
                      .then((data) => {
                        setCourts(data);
                        setIsLoading(false);
                      })
                      .catch((err) => {
                        setError(err.message);
                        setIsLoading(false);
                      });
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!isLoading && !error && courts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma quadra encontrada
              </div>
            )}

            {!isLoading && !error && courts.length > 0 && (
              <div className="space-y-3">
                {courts.map((court) => (
                  <div
                    key={court.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-lg">
                          {court.venue.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {court.sport.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">
                          {formatPrice(court.priceHour)}/h
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 mb-3">
                      {court.venue.address}
                      {court.venue.neighborhood && `, ${court.venue.neighborhood}`}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {court.indoor ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          Coberto
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Descoberto
                        </span>
                      )}
                      {court.lights && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Iluminação
                        </span>
                      )}
                      {court.surface && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          {court.surface}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/court/${court.id}`}
                      className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Ver horários
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map placeholder */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-lg border border-gray-200 shadow-sm h-[600px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <div>Mapa (placeholder)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </div>
    }>
      <MapPageContent />
    </Suspense>
  );
}

