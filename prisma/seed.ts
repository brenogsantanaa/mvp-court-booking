import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SPORTS = [
  { slug: 'soccer', name: 'Futebol' },
  { slug: 'futsal', name: 'Futsal' },
  { slug: 'tennis', name: 'Tênis' },
  { slug: 'basketball', name: 'Basquete' },
  { slug: 'volleyball', name: 'Vôlei' },
  { slug: 'beach-tennis', name: 'Beach Tennis' },
  { slug: 'padel', name: 'Padel' },
  { slug: 'paintball', name: 'Paintball' },
  { slug: 'airsoft', name: 'Airsoft' },
];

async function main() {
  console.log('Seeding sports...');
  for (const sport of SPORTS) {
    await prisma.sport.upsert({
      where: { slug: sport.slug },
      update: {},
      create: sport,
    });
  }
  console.log(`✅ Seeded ${SPORTS.length} sports`);

  // Demo venues and courts
  console.log('Seeding demo venues and courts...');

  // Find or create a placeholder user/owner
  const owner = await prisma.user.upsert({
    where: { email: 'owner@demo.com' },
    update: {},
    create: {
      email: 'owner@demo.com',
      name: 'Demo Owner',
      role: 'OWNER',
    },
  });

  const soccer = await prisma.sport.findUnique({ where: { slug: 'soccer' } });
  const tennis = await prisma.sport.findUnique({ where: { slug: 'tennis' } });
  const beachTennis = await prisma.sport.findUnique({ where: { slug: 'beach-tennis' } });
  const basketball = await prisma.sport.findUnique({ where: { slug: 'basketball' } });

  if (!soccer || !tennis || !beachTennis || !basketball) {
    throw new Error('Sports not found');
  }

  // São Paulo venues
  const venue1 = await prisma.venue.upsert({
    where: { id: 'venue-sp-soccer' },
    update: {},
    create: {
      id: 'venue-sp-soccer',
      name: 'Society Campo Verde',
      description: 'Campo society com grama sintética e iluminação',
      address: 'Av. Brigadeiro Faria Lima, 2000',
      city: 'São Paulo',
      neighborhood: 'Pinheiros',
      lat: -23.5675,
      lng: -46.6934,
      ownerId: owner.id,
      courts: {
        create: [
          {
            sportId: soccer.id,
            indoor: false,
            surface: 'Grama sintética',
            lights: true,
            priceHour: 25000, // R$ 250.00
            openTime: 360, // 6:00
            closeTime: 1380, // 23:00
          },
          {
            sportId: soccer.id,
            indoor: false,
            surface: 'Grama sintética',
            lights: true,
            priceHour: 30000, // R$ 300.00
            openTime: 360,
            closeTime: 1380,
          },
        ],
      },
    },
    include: { courts: true },
  });

  const venue2 = await prisma.venue.upsert({
    where: { id: 'venue-sp-tennis' },
    update: {},
    create: {
      id: 'venue-sp-tennis',
      name: 'Clube Tênis Paulista',
      description: 'Quadras de tênis com piso rápido e saibro',
      address: 'Rua dos Três Irmãos, 500',
      city: 'São Paulo',
      neighborhood: 'Vila Madalena',
      lat: -23.5505,
      lng: -46.6933,
      ownerId: owner.id,
      courts: {
        create: [
          {
            sportId: tennis.id,
            indoor: false,
            surface: 'Saibro',
            lights: true,
            priceHour: 15000, // R$ 150.00
            openTime: 420, // 7:00
            closeTime: 1320, // 22:00
          },
        ],
      },
    },
    include: { courts: true },
  });

  // Rio de Janeiro venues
  const venue3 = await prisma.venue.upsert({
    where: { id: 'venue-rj-beach' },
    update: {},
    create: {
      id: 'venue-rj-beach',
      name: 'Beach Tennis Copacabana',
      description: 'Quadras de beach tennis na praia',
      address: 'Av. Atlântica, 1000',
      city: 'Rio de Janeiro',
      neighborhood: 'Copacabana',
      lat: -22.9711,
      lng: -43.1822,
      ownerId: owner.id,
      courts: {
        create: [
          {
            sportId: beachTennis.id,
            indoor: false,
            surface: 'Areia',
            lights: false,
            priceHour: 12000, // R$ 120.00
            openTime: 360, // 6:00
            closeTime: 1260, // 21:00
          },
          {
            sportId: beachTennis.id,
            indoor: false,
            surface: 'Areia',
            lights: false,
            priceHour: 12000,
            openTime: 360,
            closeTime: 1260,
          },
        ],
      },
    },
    include: { courts: true },
  });

  const venue4 = await prisma.venue.upsert({
    where: { id: 'venue-rj-basketball' },
    update: {},
    create: {
      id: 'venue-rj-basketball',
      name: 'Quadra Basquete Ipanema',
      description: 'Quadra coberta de basquete com piso profissional',
      address: 'Rua Prudente de Morais, 800',
      city: 'Rio de Janeiro',
      neighborhood: 'Ipanema',
      lat: -22.9846,
      lng: -43.1936,
      ownerId: owner.id,
      courts: {
        create: [
          {
            sportId: basketball.id,
            indoor: true,
            surface: 'Piso sintético',
            lights: true,
            priceHour: 18000, // R$ 180.00
            openTime: 420, // 7:00
            closeTime: 1380, // 23:00
          },
        ],
      },
    },
    include: { courts: true },
  });

  console.log('✅ Seeded demo venues and courts');
  console.log(`   - ${venue1.name} (${venue1.courts.length} courts)`);
  console.log(`   - ${venue2.name} (${venue2.courts.length} courts)`);
  console.log(`   - ${venue3.name} (${venue3.courts.length} courts)`);
  console.log(`   - ${venue4.name} (${venue4.courts.length} courts)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

