export const pricingCategories = [
  {
    id: 'musculation_cross_training',
    name: 'Musculation & Cross Training',
    description: 'Accès classique à la salle avec accès aux machines et zones de musculation/cross training.',
    plans: [
      { id: 'mct_1', frequency: '1x Semaine', sessions: '4 séances / Mois', price: '1800 DA' },
      { id: 'mct_2', frequency: '2x Semaine', sessions: '8 séances / Mois', price: '2500 DA' },
      { id: 'mct_3', frequency: '3x Semaine', sessions: '12 séances / Mois', price: '3500 DA', recommended: true },
      { id: 'mct_4', frequency: '4x Semaine', sessions: '16 séances / Mois', price: '4500 DA' },
      { id: 'mct_unlimited', frequency: 'Illimité', sessions: 'Accès total', price: '6000 DA' },
    ]
  },
  {
    id: 'musculation_avec_crossfit',
    name: 'Musculation avec CrossFit',
    description: 'Le pack complet incluant la musculation classique et les séances encadrées de CrossFit.',
    plans: [
      { id: 'mcf_2', frequency: '2x Semaine', sessions: '8 séances / Mois', price: '3000 DA' },
      { id: 'mcf_3', frequency: '3x Semaine', sessions: '12 séances / Mois', price: '4000 DA', recommended: true },
      { id: 'mcf_4', frequency: '4x Semaine', sessions: '16 séances / Mois', price: '5000 DA' },
      { id: 'mcf_libre', frequency: 'Mois Libre', sessions: 'Accès flexible', price: '7000 DA' },
    ]
  },
  {
    id: 'pack_promo',
    name: 'Pack Promo',
    description: 'Valable sur tous les abonnements. Engagez-vous sur la durée et économisez.',
    plans: [
      { id: 'promo_3', frequency: '3 Mois', sessions: 'Engagement trimestriel', price: 'Remise -12%' },
      { id: 'promo_6', frequency: '6 Mois', sessions: 'Engagement semestriel', price: '1 Mois Gratuit', recommended: true },
      { id: 'promo_12', frequency: '12 Mois', sessions: 'Engagement annuel', price: '2 Mois Gratuits + T-shirt + Shaker' },
    ]
  },
  {
    id: 'pack_vip',
    name: 'Pack VIP',
    description: "L'expérience premium absolue de l'Equinox Sports Club.",
    plans: [
      { 
        id: 'vip_1', 
        frequency: 'Mensuel', 
        sessions: 'Accès illimité toute la journée et le mois', 
        price: '10000 DA / Mois', 
        benefits: ["Bouteille d'eau", "Serviette", "Accès prioritaire"] 
      }
    ]
  },
  {
    id: 'student',
    name: 'Offre Étudiant',
    description: 'Tarif préférentiel sur présentation de la carte étudiante.',
    plans: [
      { id: 'student_placeholder', frequency: 'Mensuel', sessions: 'Accès étudiant', price: 'Tarif Spécial (À venir)' }
    ]
  },
  {
    id: 'seance_libre',
    name: 'Séance Libre',
    description: 'Venez vous entraîner pour une seule séance, sans engagement.',
    plans: [
      { id: 'seance_1', frequency: '1 Séance', sessions: 'Accès unitaire', price: '500 DA' }
    ]
  }
];
