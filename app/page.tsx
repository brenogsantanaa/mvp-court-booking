import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">MVP - Court Booking</h1>
        <div className="grid gap-4">
          <Link
            href="/map"
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            🔍 Buscar Quadras
          </Link>
          <Link
            href="/owner"
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            👤 Área do Proprietário
          </Link>
        </div>
      </div>
    </main>
  );
}

