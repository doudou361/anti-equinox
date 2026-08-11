export const CATEGORIES = [
  'Tous',
  'Protéines',
  'Créatine',
  'Acides Aminés',
  'Pré-Entraînement',
  'Vitamines & Compléments',
  'Femme',
];

export const products = [
  // ── Protéines ────────────────────────────────────────────────────────────
  {
    id: 'iso-xp',
    name: 'ISO-XP Whey Protein Isolate',
    brand: 'Applied Nutrition',
    price: 0,
    description:
      'Isolat de protéines 100% pur. 22.5g de protéines par dose, 0g de sucre, 0g de graisses. Saveur Choco Coco.',
    image: '/products/iso-xp.jpg.jpg',
    category: 'Protéines',
  },
  {
    id: 'gold-sauvage',
    name: 'Gold Sauvage Mass Gainer',
    brand: 'GoldenBody',
    price: 0,
    description:
      'Mass gainer extrême 7kg. 71.8g de protéines, 846 kcal par portion. Formule WPC+WPI+Caséine+Créatine.',
    image: '/products/gold-sauvage.jpg.jpg',
    category: 'Protéines',
  },

  // ── Créatine ─────────────────────────────────────────────────────────────
  {
    id: 'evolite-creatine',
    name: 'Creatine Monohydrate',
    brand: 'Evolite Nutrition',
    price: 0,
    description:
      'Créatine monohydrate pure. 100 portions de 5g. Saveur Blueberry.',
    image: '/products/evolite-creatine.jpg.jpg',
    category: 'Créatine',
  },
  {
    id: 'trec-creatine',
    name: 'Creatine',
    brand: 'Trec Nutrition',
    price: 0,
    description: 'Créatine monohydrate 100% pure. 350g, 70 portions.',
    image: '/products/trec-creatine.jpg.jpg',
    category: 'Créatine',
  },
  {
    id: 'on-creatine',
    name: 'Micronised Creatine Powder',
    brand: 'Optimum Nutrition',
    price: 0,
    description:
      'Créatine micronisée 100% pure. 3g par portion, 93 portions. Sans arôme.',
    image: '/products/on-creatine.png.png',
    category: 'Créatine',
  },
  {
    id: 'fh-creatine',
    name: 'Creatine Monohydrate 100%',
    brand: 'F&H Fitness & Health',
    price: 0,
    description:
      'Créatine monohydrate pure. 60 doses de 5g. Sans arômes, sans sucre.',
    image: '/products/fh-creatine.jpg.jpeg',
    category: 'Créatine',
  },

  // ── Acides Aminés ────────────────────────────────────────────────────────
  {
    id: 'eaa',
    name: 'EAA Essential Amino Acids',
    brand: 'Evolite Nutrition',
    price: 0,
    description:
      'Acides aminés essentiels complets. 10g par portion, 50 portions. Saveur pomme verte.',
    image: '/products/eaa.jpg.jpg',
    category: 'Acides Aminés',
  },
  {
    id: 'bcaa',
    name: 'BCAA + Electrolyte',
    brand: 'F&H Fitness & Health',
    price: 0,
    description:
      'BCAA 7g + électrolytes par portion. 25 doses. Amélioration des performances et récupération.',
    image: '/products/bcaa.jpg.jpeg',
    category: 'Acides Aminés',
  },

  // ── Pré-Entraînement ─────────────────────────────────────────────────────
  {
    id: 'boost-power',
    name: 'Boost Power',
    brand: 'Auravée',
    price: 0,
    description:
      'Formule pré-workout 100% naturelle. Énergie, concentration, testostérone. 300g, saveur chocolat.',
    image: '/products/boost-power.webp.webp',
    category: 'Pré-Entraînement',
  },
  {
    id: 'energie-plus',
    name: 'Énergie Plus',
    brand: 'Auravée Lab',
    price: 0,
    description:
      "Booster d'énergie et de concentration. 300g. Formule naturelle pour l'endurance et le focus.",
    image: '/products/energie-plus.webp.webp',
    category: 'Pré-Entraînement',
  },
  {
    id: 'pre-workout',
    name: 'Pre-Workout',
    brand: 'F&H Fitness & Health',
    price: 0,
    description:
      'Concentration, puissance, endurance. 240mg caféine, 2.5g créatine, 2g B-alanine. 21 doses.',
    image: '/products/per-workout.png.png',
    category: 'Pré-Entraînement',
  },

  // ── Vitamines & Compléments ───────────────────────────────────────────────
  {
    id: 'one-a-day',
    name: 'One-A-Day Multivitamin',
    brand: 'BioTechUSA',
    price: 0,
    description:
      'Multivitamines complètes. 100 comprimés, 3 mois de supply. Formule quotidienne essentielle.',
    image: '/products/one-a-day.webp.webp',
    category: 'Vitamines & Compléments',
  },
  {
    id: 'multivitamin-men',
    name: 'Multivitamin for Men',
    brand: 'BioTechUSA',
    price: 0,
    description:
      '12 vitamines + 7 antioxydants spécialement formulés pour les hommes. 60 comprimés.',
    image: '/products/multivitamin-men.jpg.jpg',
    category: 'Vitamines & Compléments',
  },
  {
    id: 'omega3',
    name: 'Mega Omega 3',
    brand: 'BioTechUSA',
    price: 0,
    description:
      'Oméga-3 haute concentration. Huile de poisson + Vitamine E. Santé cardiovasculaire et articulaire.',
    image: '/products/omega3.jpg.jpeg',
    category: 'Vitamines & Compléments',
  },
  {
    id: 'l-carnitine',
    name: 'L-Carnitine',
    brand: 'BioTechUSA',
    price: 0,
    description:
      "L-Carnitine en poudre. Favorise la combustion des graisses et l'endurance.",
    image: '/products/l-carnitine.jpg.jpeg',
    category: 'Vitamines & Compléments',
  },

  // ── Femme ─────────────────────────────────────────────────────────────────
  {
    id: 'beperfect',
    name: 'BePerfect',
    brand: 'Auravée Lab',
    price: 0,
    description:
      'Formule prise de poids féminine. 100% naturel. Conçu spécifiquement pour les femmes.',
    image: '/products/beperfect.webp.webp',
    category: 'Femme',
  },
];
