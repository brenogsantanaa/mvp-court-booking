'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSports } from '@/lib/hooks/useSports';
import { Suspense } from 'react';

function SportFilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: sports, isLoading } = useSports();
  const currentSport = searchParams.get('sport');

  const handleToggle = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentSport === slug) {
      params.delete('sport');
    } else {
      params.set('sport', slug);
    }
    router.push(`?${params.toString()}`);
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">Carregando esportes...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {sports?.map((sport: { slug: string; name: string }) => (
        <button
          key={sport.slug}
          onClick={() => handleToggle(sport.slug)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentSport === sport.slug
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {sport.name}
        </button>
      ))}
    </div>
  );
}

export function SportFilter() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">Carregando esportes...</div>}>
      <SportFilterContent />
    </Suspense>
  );
}

