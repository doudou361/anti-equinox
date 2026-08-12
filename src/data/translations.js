export const translations = {
  fr: {
    // Shared strings
    common: {
      waBlocked: "Votre navigateur a bloqué l'ouverture de WhatsApp. Votre message n'a pas été envoyé.",
      waBlockedLink: "Ouvrir WhatsApp manuellement"
    },
    // Navbar
    nav: {
      schedule: "Horaires",
      pricing: "Tarifs",
      team: "Nos Coachs",
      crossfitSchedule: "Horaires CrossFit",
      products: "Produits",
      contact: "Contact",
      bookNow: "Réservez votre séance",
    },
    // Hero
    hero: {
      tagline: "DISCIPLINE • PUISSANCE • RÉSULTATS",
      title1: "REJOIGNEZ",
      title2: "L'ÉLITE",
      cta: "RÉSERVEZ VOTRE SÉANCE",
    },
    // Schedule
    schedule: {
      title: "HORAIRES DU CLUB",
      subtitle: "Trouvez le moment parfait pour exprimer votre potentiel. Nous proposons des créneaux dédiés aux hommes et aux femmes.",
      tabMen: "HORAIRES HOMMES",
      tabWomen: "HORAIRES FEMMES",
      days: {
        saturday: "Samedi",
        sunday: "Dimanche",
        monday: "Lundi",
        tuesday: "Mardi",
        wednesday: "Mercredi",
        thursday: "Jeudi",
        friday: "Vendredi"
      },
      closed: "Fermé",
      allDay: "Toute la journée"
    },
    // Pricing
    pricing: {
      title: "OFFRES D'ABONNEMENT",
      subtitle: "Des formules flexibles adaptées à vos objectifs sportifs.",
      perMonth: "/ Mois",
      selectPlan: "Sélectionner",
      popular: "POPULAIRE",
      planNames: {
        muscCT: "Musculation / Cross Training",
        muscCF: "Musculation avec CrossFit",
        vip: "Pack VIP",
        libre: "Séance Libre"
      },
      desc: {
        muscCT: "Accès à la salle avec machines et zones de musculation/cross training.",
        muscCF: "Le pack complet incluant la musculation classique et les séances encadrées de CrossFit.",
        vip: "L'expérience premium absolue de l'Équinox Sports Club.",
        libre: "Venez vous entraîner pour une seule séance, sans engagement."
      },
      freq: {
        "1x Semaine": "1x Semaine",
        "2x Semaine": "2x Semaine",
        "3x Semaine": "3x Semaine",
        "4x Semaine": "4x Semaine",
        "Illimité": "Illimité",
        "Mois Libre": "Mois Libre",
        "Mensuel": "Mensuel",
        "1 Séance": "1 Séance"
      },
      sessions: {
        "4 séances / mois": "4 séances / mois",
        "8 séances / mois": "8 séances / mois",
        "12 séances / mois": "12 séances / mois",
        "16 séances / mois": "16 séances / mois",
        "Accès total": "Accès total",
        "Accès flexible": "Accès flexible",
        "Accès illimité toute la journée": "Accès illimité toute la journée",
        "Accès unitaire": "Accès unitaire",
        "Accès unitaire — sans engagement": "Accès unitaire — sans engagement"
      },
      benefits: {
        water: "Bouteille d'eau gratuite",
        towel: "Serviette offerte",
        priority: "Accès prioritaire",
        coaching: "Coaching personnalisé"
      },
      bookBtn: "Réserver",
      bookVip: "Réserver VIP",
      bookSession: "Réserver une séance",
      seeSchedule: "Voir Horaires",
      pricePerMonth: " / mois",
      pricePerSession: " / séance",
    },
    // Products
    products: {
      title: "NOS PRODUITS & ÉQUIPEMENTS",
      subtitle: "Compléments alimentaires et équipements officiels Equinox Sports Club.",
      orderBtn: "Commander / S'informer",
      items: [
        {
          id: 1,
          name: "Equinox Whey Isolate (2kg)",
          category: "Nutrition",
          price: "12,500 DA",
          desc: "Protéine ultra-pure pour une récupération musculaire maximale.",
          tag: "Nouveau"
        },
        {
          id: 2,
          name: "Equinox Pre-Workout Energy",
          category: "Nutrition",
          price: "6,800 DA",
          desc: "Formule explosive pour une énergie et une concentration intenses.",
          tag: "Best-seller"
        },
        {
          id: 3,
          name: "Shaker Inox Élite 750ml",
          category: "Équipement",
          price: "3,200 DA",
          desc: "Shaker isotherme en acier inoxydable haute durabilité.",
          tag: "Équipement"
        },
        {
          id: 4,
          name: "Hoodie Officiel Equinox",
          category: "Vêtements",
          price: "7,500 DA",
          desc: "Sweat à capuche premium ultra-confortable brodé à l'or.",
          tag: "Édition Limitée"
        }
      ]
    },
    // Contact Modal
    contactModal: {
      title: "CONTACTEZ EQUINOX SPORTS CLUB",
      subtitle: "Passez nous voir au club ou envoyez-nous un message.",
      addressLabel: "Adresse du Club",
      addressText: "Hai daria djilali, Ouled Haddadj, Boumerdes, Algérie 3528",
      phoneLabel: "Téléphone",
      phoneText: "0562 83 84 55",
      emailLabel: "E-mail",
      emailText: "sportsclubequinox@gmail.com",
      formTitle: "Envoyez-nous un message",
      namePlaceholder: "Votre Nom Complet",
      phonePlaceholder: "Votre Numéro de Téléphone",
      messagePlaceholder: "Comment pouvons-nous vous aider ?",
      sendBtn: "ENVOYER LE MESSAGE",
      errors: {
        name: "Le nom complet est requis.",
        phoneReq: "Le numéro est requis.",
        phoneInv: "Numéro invalide (9 chiffres minimum).",
        messageReq: "Le message est requis."
      },
      sentSuccess: "Message envoyé avec succès ! Nous vous recontacterons très vite.",
      followUs: "Suivez-nous sur les réseaux"
    },
    // Booking Modal
    bookingModal: {
      stepCount: "Étape",
      back: "Retour",
      close: "Fermer",
      step1Title: "Bienvenue",
      step1Subtitle: "Choisissez votre espace pour commencer.",
      step1Small: "SÉLECTIONNEZ VOTRE ESPACE",
      menCard: "Espace Homme",
      menDesc: "Accès aux installations pour hommes",
      womenCard: "Espace Femme",
      womenDesc: "Accès aux installations pour femmes",
      step2Title: "Choisir votre formule",
      step2Subtitle: "Sélectionnez un abonnement pour continuer.",
      step3Title: "VOS COORDONNÉES",
      step3Subtitle: "Veuillez renseigner vos informations pour valider votre demande",
      fullNameLabel: "Nom complet",
      phoneLabel: "Numéro de téléphone",
      emailLabel: "Adresse E-mail (Optionnel)",
      notesLabel: "Remarques ou questions particulières",
      bloodGroup: "Groupe sanguin",
      birthdate: "Date de naissance",
      duration: "Durée d'abonnement",
      month: "Mois",
      months: "Mois",
      forMonths: "pour",
      save: "Économisez",
      oneMonthFree: "1 mois offert",
      twoMonthsFree: "2 mois offerts",
      confirmBtn: "Confirmer via WhatsApp",
      step4Title: "INSCRIPTION CONFIRMÉE !",
      step4Subtitle: "Merci pour votre confiance. Voici le récapitulatif de votre facture.",
      billTitle: "FACTURE D'ABONNEMENT",
      spaceLabel: "Espace",
      categoryLabel: "Catégorie",
      planLabel: "Plan Choisi",
      clientLabel: "Membre",
      phoneBillLabel: "Téléphone",
      totalPrice: "Total à régler au club",
      finishBtn: "TERMINER & FERMER",
      headerTag: "INSCRIPTION",
      chooseBtn: "Choisir",
      waBtn: "WhatsApp",
      cinNotice: "Merci d'apporter une copie de votre",
      cinBold: "pièce d'identité (CIN)",
      cinEnd: "le jour de votre première séance.",
      errors: {
        name: "Le nom complet est requis.",
        phoneReq: "Le numéro est requis.",
        phoneInv: "Numéro invalide (9 chiffres minimum).",
        bloodGroup: "Veuillez sélectionner votre groupe sanguin.",
        birthdate: "La date de naissance est requise.",
        birthdateInv: "Date de naissance invalide.",
        submitFailed: "L'envoi de la réservation a échoué. Veuillez réessayer."
      },
      successText: "Message envoyé sur WhatsApp.",
      successSub: "Nous vous contacterons très bientôt.",
      perks: "🎁 T-shirt et Shaker offerts"
    },
    // Footer
    footer: {
      tagline: "DISCIPLINE • PUISSANCE • RÉSULTATS\nRejoignez l'élite sportive.",
      quickLinks: "Liens Rapides",
      rights: "Tous droits réservés."
    }
  },
  en: {
    // Shared strings
    common: {
      waBlocked: "Your browser blocked WhatsApp from opening. Your message was not sent.",
      waBlockedLink: "Open WhatsApp manually"
    },
    // Navbar
    nav: {
      schedule: "Schedule",
      pricing: "Pricing",
      team: "Our Coaches",
      crossfitSchedule: "CrossFit Schedule",
      products: "Products",
      contact: "Contact",
      bookNow: "Book your session",
    },
    // Hero
    hero: {
      tagline: "DISCIPLINE • POWER • RESULTS",
      title1: "JOIN",
      title2: "THE ELITE",
      cta: "BOOK YOUR SESSION",
    },
    // Schedule
    schedule: {
      title: "CLUB SCHEDULE",
      subtitle: "Find the perfect time to unleash your potential. We offer dedicated hours for men and women.",
      tabMen: "MEN'S HOURS",
      tabWomen: "WOMEN'S HOURS",
      days: {
        saturday: "Saturday",
        sunday: "Sunday",
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday"
      },
      closed: "Closed",
      allDay: "All Day"
    },
    // Pricing
    pricing: {
      title: "MEMBERSHIP OFFERS",
      subtitle: "Flexible plans tailored to your fitness goals.",
      perMonth: "/ Month",
      selectPlan: "Select Plan",
      popular: "POPULAR",
      planNames: {
        muscCT: "Musculation / Cross Training",
        muscCF: "Musculation with CrossFit",
        vip: "VIP Pack",
        libre: "Single Session"
      },
      desc: {
        muscCT: "Full access to the gym with machines and free weights.",
        muscCF: "The complete package including classic gym and guided CrossFit sessions.",
        vip: "The ultimate premium experience at Équinox Sports Club.",
        libre: "Drop-in and train for a single session, no commitment."
      },
      freq: {
        "1x Semaine": "1x Weekly",
        "2x Semaine": "2x Weekly",
        "3x Semaine": "3x Weekly",
        "4x Semaine": "4x Weekly",
        "Illimité": "Unlimited",
        "Mois Libre": "Flexible Month",
        "Mensuel": "Monthly",
        "1 Séance": "1 Session"
      },
      sessions: {
        "4 séances / mois": "4 sessions / month",
        "8 séances / mois": "8 sessions / month",
        "12 séances / mois": "12 sessions / month",
        "16 séances / mois": "16 sessions / month",
        "Accès total": "Total access",
        "Accès flexible": "Flexible access",
        "Accès illimité toute la journée": "Unlimited access all day",
        "Accès unitaire": "Single access",
        "Accès unitaire — sans engagement": "Single access — no commitment"
      },
      benefits: {
        water: "Free water bottle",
        towel: "Free towel service",
        priority: "Priority access",
        coaching: "Personalized coaching"
      },
      bookBtn: "Book",
      bookVip: "Book VIP",
      bookSession: "Book a session",
      seeSchedule: "View Schedule",
      pricePerMonth: " / month",
      pricePerSession: " / session",
    },
    // Products
    products: {
      title: "OUR PRODUCTS & GEAR",
      subtitle: "Official Equinox Sports Club supplements and equipment.",
      orderBtn: "Order / Inquire",
      items: [
        {
          id: 1,
          name: "Equinox Whey Isolate (2kg)",
          category: "Nutrition",
          price: "12,500 DA",
          desc: "Ultra-pure protein for maximum muscle recovery.",
          tag: "New"
        },
        {
          id: 2,
          name: "Equinox Pre-Workout Energy",
          category: "Nutrition",
          price: "6,800 DA",
          desc: "Explosive formula for intense energy and focus.",
          tag: "Best-seller"
        },
        {
          id: 3,
          name: "Elite Stainless Shaker 750ml",
          category: "Gear",
          price: "3,200 DA",
          desc: "High-durability insulated stainless steel shaker.",
          tag: "Gear"
        },
        {
          id: 4,
          name: "Official Equinox Hoodie",
          category: "Apparel",
          price: "7,500 DA",
          desc: "Ultra-comfortable premium gold-embroidered hoodie.",
          tag: "Limited Edition"
        }
      ]
    },
    // Contact Modal
    contactModal: {
      title: "CONTACT EQUINOX SPORTS CLUB",
      subtitle: "Visit us at the club or send us a message.",
      addressLabel: "Club Address",
      addressText: "Hai daria djilali, Ouled Haddadj, Boumerdes, Algeria 3528",
      phoneLabel: "Phone",
      phoneText: "0562 83 84 55",
      emailLabel: "Email",
      emailText: "sportsclubequinox@gmail.com",
      formTitle: "Send us a message",
      namePlaceholder: "Your Full Name",
      phonePlaceholder: "Your Phone Number",
      messagePlaceholder: "How can we help you?",
      sendBtn: "SEND MESSAGE",
      errors: {
        name: "Full name is required.",
        phoneReq: "Phone number is required.",
        phoneInv: "Invalid number (min 9 digits).",
        messageReq: "A message is required."
      },
      sentSuccess: "Message sent successfully! We will get back to you shortly.",
      followUs: "Follow us on social media"
    },
    // Booking Modal
    bookingModal: {
      stepCount: "Step",
      back: "Back",
      close: "Close",
      step1Title: "Welcome",
      step1Subtitle: "Choose your space to begin.",
      step1Small: "SELECT YOUR SPACE",
      menCard: "Men's Area",
      menDesc: "Access to men's facilities",
      womenCard: "Women's Area",
      womenDesc: "Access to women's facilities",
      step2Title: "Choose your plan",
      step2Subtitle: "Select a membership to continue.",
      step3Title: "YOUR DETAILS",
      step3Subtitle: "Please fill in your information to validate your registration",
      fullNameLabel: "Full Name",
      phoneLabel: "Phone Number",
      emailLabel: "Email Address (Optional)",
      notesLabel: "Special notes or questions",
      bloodGroup: "Blood Group",
      birthdate: "Date of Birth",
      duration: "Subscription Duration",
      month: "Month",
      months: "Months",
      forMonths: "for",
      save: "Save",
      oneMonthFree: "1 month free",
      twoMonthsFree: "2 months free",
      confirmBtn: "Confirm via WhatsApp",
      step4Title: "REGISTRATION CONFIRMED!",
      step4Subtitle: "Thank you for your trust. Here is your invoice summary.",
      billTitle: "MEMBERSHIP INVOICE",
      spaceLabel: "Space",
      categoryLabel: "Category",
      planLabel: "Selected Plan",
      clientLabel: "Member",
      phoneBillLabel: "Phone",
      totalPrice: "Total Due at Club",
      finishBtn: "FINISH & CLOSE",
      headerTag: "REGISTRATION",
      chooseBtn: "Choose",
      waBtn: "WhatsApp",
      cinNotice: "Please bring a copy of your",
      cinBold: "ID card (CIN)",
      cinEnd: "on the day of your first session.",
      errors: {
        name: "Full name is required.",
        phoneReq: "Phone number is required.",
        phoneInv: "Invalid number (min 9 digits).",
        bloodGroup: "Please select your blood group.",
        birthdate: "Date of birth is required.",
        birthdateInv: "Invalid date of birth.",
        submitFailed: "Sending your booking failed. Please try again."
      },
      successText: "Message sent on WhatsApp.",
      successSub: "We will contact you very soon.",
      perks: "🎁 Free T-shirt and Shaker"
    },
    // Footer
    footer: {
      tagline: "DISCIPLINE • POWER • RESULTS\nJoin the fitness elite.",
      quickLinks: "Quick Links",
      rights: "All rights reserved."
    }
  }
};
