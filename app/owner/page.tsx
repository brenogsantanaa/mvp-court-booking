'use client';

import { useState, useEffect } from 'react';
import { useSports } from '@/lib/hooks/useSports';

interface Venue {
  id: string;
  name: string;
  city: string;
  courts: any[];
}

export default function OwnerPage() {
  const { data: sports } = useSports();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [selectedVenueId, setSelectedVenueId] = useState<string>('');

  // Venue form state
  const [venueForm, setVenueForm] = useState({
    name: '',
    description: '',
    address: '',
    city: 'São Paulo' as 'São Paulo' | 'Rio de Janeiro',
    neighborhood: '',
    lat: '',
    lng: '',
  });

  // Court form state
  const [courtForm, setCourtForm] = useState({
    sportId: '',
    indoor: false,
    surface: '',
    lights: false,
    priceHour: '',
    openTime: '07:00',
    closeTime: '22:00',
  });

  const [isSubmittingVenue, setIsSubmittingVenue] = useState(false);
  const [isSubmittingCourt, setIsSubmittingCourt] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setIsLoadingVenues(true);
    try {
      const res = await fetch('/api/venues');
      const data = await res.json();
      setVenues(data);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setIsLoadingVenues(false);
    }
  };

  const handleVenueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingVenue(true);

    try {
      const res = await fetch('/api/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...venueForm,
          lat: venueForm.lat ? parseFloat(venueForm.lat) : undefined,
          lng: venueForm.lng ? parseFloat(venueForm.lng) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create venue');
      }

      const newVenue = await res.json();
      setVenues([newVenue, ...venues]);
      setSelectedVenueId(newVenue.id);
      setVenueForm({
        name: '',
        description: '',
        address: '',
        city: 'São Paulo',
        neighborhood: '',
        lat: '',
        lng: '',
      });
      alert('Venue criado com sucesso!');
    } catch (error: any) {
      alert(error.message || 'Erro ao criar venue');
    } finally {
      setIsSubmittingVenue(false);
    }
  };

  const handleCourtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVenueId) {
      alert('Selecione um venue primeiro');
      return;
    }

    setIsSubmittingCourt(true);

    try {
      // Convert HH:mm to minutes from midnight
      const [openHour, openMin] = courtForm.openTime.split(':').map(Number);
      const [closeHour, closeMin] = courtForm.closeTime.split(':').map(Number);
      const openTime = openHour * 60 + openMin;
      const closeTime = closeHour * 60 + closeMin;

      // Convert price to cents
      const priceHour = Math.round(parseFloat(courtForm.priceHour) * 100);

      const res = await fetch('/api/courts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId: selectedVenueId,
          sportId: courtForm.sportId,
          indoor: courtForm.indoor,
          surface: courtForm.surface || undefined,
          lights: courtForm.lights,
          priceHour,
          openTime,
          closeTime,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create court');
      }

      const newCourt = await res.json();
      await fetchVenues(); // Refresh venues to show new court
      setCourtForm({
        sportId: '',
        indoor: false,
        surface: '',
        lights: false,
        priceHour: '',
        openTime: '07:00',
        closeTime: '22:00',
      });
      alert('Quadra criada com sucesso!');
    } catch (error: any) {
      alert(error.message || 'Erro ao criar quadra');
    } finally {
      setIsSubmittingCourt(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Área do Proprietário</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Venue Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4">Criar Venue</h2>
            <form onSubmit={handleVenueSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  required
                  value={venueForm.name}
                  onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={venueForm.description}
                  onChange={(e) => setVenueForm({ ...venueForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço *
                </label>
                <input
                  type="text"
                  required
                  value={venueForm.address}
                  onChange={(e) => setVenueForm({ ...venueForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade *
                </label>
                <select
                  required
                  value={venueForm.city}
                  onChange={(e) => setVenueForm({ ...venueForm, city: e.target.value as 'São Paulo' | 'Rio de Janeiro' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="São Paulo">São Paulo</option>
                  <option value="Rio de Janeiro">Rio de Janeiro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  value={venueForm.neighborhood}
                  onChange={(e) => setVenueForm({ ...venueForm, neighborhood: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={venueForm.lat}
                    onChange={(e) => setVenueForm({ ...venueForm, lat: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={venueForm.lng}
                    onChange={(e) => setVenueForm({ ...venueForm, lng: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingVenue}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {isSubmittingVenue ? 'Criando...' : 'Criar Venue'}
              </button>
            </form>
          </div>

          {/* Add Court Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4">Adicionar Quadra</h2>
            <form onSubmit={handleCourtSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue *
                </label>
                <select
                  required
                  value={selectedVenueId}
                  onChange={(e) => setSelectedVenueId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Selecione um venue</option>
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} - {venue.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Esporte *
                </label>
                <select
                  required
                  value={courtForm.sportId}
                  onChange={(e) => setCourtForm({ ...courtForm, sportId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Selecione um esporte</option>
                  {sports?.map((sport: { id: string; name: string }) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário Abertura *
                  </label>
                  <input
                    type="time"
                    required
                    value={courtForm.openTime}
                    onChange={(e) => setCourtForm({ ...courtForm, openTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário Fechamento *
                  </label>
                  <input
                    type="time"
                    required
                    value={courtForm.closeTime}
                    onChange={(e) => setCourtForm({ ...courtForm, closeTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço/hora (R$) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={courtForm.priceHour}
                  onChange={(e) => setCourtForm({ ...courtForm, priceHour: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Piso
                </label>
                <input
                  type="text"
                  value={courtForm.surface}
                  onChange={(e) => setCourtForm({ ...courtForm, surface: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={courtForm.indoor}
                    onChange={(e) => setCourtForm({ ...courtForm, indoor: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Coberto</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={courtForm.lights}
                    onChange={(e) => setCourtForm({ ...courtForm, lights: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Iluminação</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmittingCourt || !selectedVenueId}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {isSubmittingCourt ? 'Criando...' : 'Adicionar Quadra'}
              </button>
            </form>
          </div>
        </div>

        {/* Venues List */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-4">Meus Venues</h2>
          {isLoadingVenues ? (
            <div className="text-center py-8 text-gray-500">Carregando...</div>
          ) : venues.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum venue criado ainda</div>
          ) : (
            <div className="space-y-4">
              {venues.map((venue) => (
                <div key={venue.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{venue.name}</h3>
                      <div className="text-sm text-gray-600">{venue.city}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {venue.courts.length} quadra{venue.courts.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  {venue.courts.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {venue.courts.map((court: any) => (
                        <div key={court.id} className="text-sm text-gray-600">
                          • {court.sport.name} - R$ {(court.priceHour / 100).toFixed(2)}/h
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

