import { prisma } from '@/lib/prisma';
import { AvailabilityGrid } from '@/components/AvailabilityGrid';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function CourtPage({
  params,
}: {
  params: { id: string };
}) {
  const court = await prisma.court.findUnique({
    where: { id: params.id },
    include: {
      venue: true,
      sport: true,
    },
  });

  if (!court) {
    notFound();
  }

  const formatPrice = (cents: number) => {
    return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/map"
          className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
        >
          ← Voltar
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">{court.venue.name}</h1>
          <div className="text-lg text-gray-600 mb-4">{court.sport.name}</div>

          <div className="space-y-2 mb-6">
            <div>
              <span className="font-medium">Endereço:</span> {court.venue.address}
            </div>
            {court.venue.neighborhood && (
              <div>
                <span className="font-medium">Bairro:</span> {court.venue.neighborhood}
              </div>
            )}
            <div>
              <span className="font-medium">Cidade:</span> {court.venue.city}
            </div>
          </div>

          {court.venue.description && (
            <div className="mb-6 text-gray-700">{court.venue.description}</div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <div className="text-sm text-gray-600">Preço/hora</div>
              <div className="text-xl font-bold text-blue-600">
                {formatPrice(court.priceHour)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Horário</div>
              <div className="font-medium">
                {formatTime(court.openTime)} - {formatTime(court.closeTime)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Tipo</div>
              <div className="font-medium">
                {court.indoor ? 'Coberto' : 'Descoberto'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Iluminação</div>
              <div className="font-medium">
                {court.lights ? 'Sim' : 'Não'}
              </div>
            </div>
          </div>

          {court.surface && (
            <div className="mb-6">
              <span className="font-medium">Piso:</span> {court.surface}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {court.indoor ? (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                Coberto
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                Descoberto
              </span>
            )}
            {court.lights && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                Iluminação
              </span>
            )}
            {court.surface && (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                {court.surface}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-4">Horários Disponíveis</h2>
          <AvailabilityGrid courtId={court.id} />
        </div>
      </div>
    </div>
  );
}

