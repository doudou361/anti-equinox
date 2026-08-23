/**
 * Pricing data for Équinox Sports Club.
 *
 * monthlyRate is always a plain number (DA).
 * The Pricing component uses lib/pricing.js to compute all multi-month totals
 * from these numbers — never hardcoded.
 *
 * Pack Promo static card removed (Phase 2).
 * Those discounts now live inside BookingModal as live calculation.
 */
export const pricingCategories = [
  {
    id: 'musculation_cross_training',
    name: 'Musculation / Cross Training',
    description:
      'Accès à la salle avec machines et zones de musculation/cross training.',
    plans: [
      { id: 'mct_1',        frequency: '1x Semaine', sessions: '4 séances / mois',  monthlyRate: 1800 },
      { id: 'mct_2',        frequency: '2x Semaine', sessions: '8 séances / mois',  monthlyRate: 2500 },
      { id: 'mct_3',        frequency: '3x Semaine', sessions: '12 séances / mois', monthlyRate: 3500, recommended: true },
      { id: 'mct_4',        frequency: '4x Semaine', sessions: '16 séances / mois', monthlyRate: 4500 },
      { id: 'mct_unlimited',frequency: 'Illimité',   sessions: 'Accès total',        monthlyRate: 6000 },
    ],
  },
  {
    id: 'musculation_avec_crossfit',
    name: 'Musculation avec CrossFit',
    description:
      'Le pack complet incluant la musculation classique et les séances encadrées de CrossFit.',
    plans: [
      { id: 'mcf_2',    frequency: '2x Semaine', sessions: '8 séances / mois',  monthlyRate: 3000 },
      { id: 'mcf_3',    frequency: '3x Semaine', sessions: '12 séances / mois', monthlyRate: 4000, recommended: true },
      { id: 'mcf_4',    frequency: '4x Semaine', sessions: '16 séances / mois', monthlyRate: 5000 },
      { id: 'mcf_libre',frequency: 'Mois Libre', sessions: 'Accès flexible',    monthlyRate: 7000 },
    ],
  },
  {
    id: 'pack_vip',
    name: 'Pack VIP',
    description: "L'expérience premium absolue de l'Équinox Sports Club.",
    plans: [
      {
        id: 'vip_1',
        frequency: 'Mensuel',
        sessions: 'Accès illimité toute la journée',
        monthlyRate: 10000,
        benefits: [
          "Bouteille d'eau gratuite",
          'Serviette offerte',
          'Accès prioritaire',
          'Coaching personnalisé',
        ],
      },
    ],
  },
  // Hiding Séance Libre for now based on user request
  // {
  //   id: 'seance_libre',
  //   name: 'Séance Libre',
  //   description:
  //     'Venez vous entraîner pour une seule séance, sans engagement.',
  //   plans: [
  //     { id: 'seance_1', frequency: '1 Séance', sessions: 'Accès unitaire', monthlyRate: 500 },
  //   ],
  // },
];
