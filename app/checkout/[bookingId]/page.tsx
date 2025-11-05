import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function CheckoutPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.bookingId },
    include: {
      court: {
        include: {
          venue: true,
          sport: true,
        },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  const formatPrice = (cents: number) => {
    return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-3xl font-bold mb-6">Reserva Criada</h1>

          <div className="space-y-4 mb-6">
            <div>
              <div className="text-sm text-gray-600">Quadra</div>
              <div className="font-semibold text-lg">
                {booking.court.venue.name} - {booking.court.sport.name}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Data e Horário</div>
              <div className="font-semibold">
                {formatDateTime(booking.startTs)} - {formatDateTime(booking.endTs)}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Status</div>
              <div className="font-semibold">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                  {booking.status === 'PENDING' ? 'Pendente' : booking.status}
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Preço</div>
              <div className="font-bold text-2xl text-blue-600">
                {formatPrice(booking.price)}
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-gray-600 mb-4">
              Esta é uma reserva pendente. A integração com pagamento (PIX) será
              implementada em breve.
            </p>
            <a
              href="/map"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar para busca
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

