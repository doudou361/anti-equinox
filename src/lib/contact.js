/**
 * Club contact points and social accounts.
 * Footer and ContactModal both read from here.
 */

export const MAPS_URL =
  'https://maps.google.com/?q=P982+X7C+EQUINOX+sport+club,+Ouled+Hedadj';

export const MAPS_EMBED_URL =
  'https://maps.google.com/maps?q=P982%2BX7C%20EQUINOX%20sport%20club,%20Ouled%20Hedadj&t=&z=15&ie=UTF8&iwloc=&output=embed';

export const PHONE_HREF = 'tel:0562838455';
export const EMAIL_HREF = 'mailto:sportsclubequinox@gmail.com';

export const INSTAGRAM_MAIN_URL = 'https://www.instagram.com/equinoxsports_club/';
export const INSTAGRAM_WOMEN_URL = 'https://www.instagram.com/equinoxsports__club/?hl=en';
export const INSTAGRAM_NUTRITION_URL = 'https://www.instagram.com/equinox.nutrition_/';
export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61554660353364';

const INSTAGRAM_GRADIENT =
  'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';

/** Social buttons rendered in ContactModal, in display order. */
export const SOCIAL_LINKS = [
  {
    id: 'instagram-main',
    href: INSTAGRAM_MAIN_URL,
    label: 'Instagram Officiel',
    network: 'instagram',
    background: INSTAGRAM_GRADIENT,
    shadow: '0 4px 15px rgba(220, 39, 67, 0.3)',
  },
  {
    id: 'instagram-women',
    href: INSTAGRAM_WOMEN_URL,
    label: 'Instagram Femmes',
    network: 'instagram',
    background: INSTAGRAM_GRADIENT,
    shadow: '0 4px 15px rgba(220, 39, 67, 0.3)',
  },
  {
    id: 'instagram-nutrition',
    href: INSTAGRAM_NUTRITION_URL,
    label: 'Instagram Nutrition',
    network: 'instagram',
    background: INSTAGRAM_GRADIENT,
    shadow: '0 4px 15px rgba(220, 39, 67, 0.3)',
  },
  {
    id: 'facebook',
    href: FACEBOOK_URL,
    label: 'Facebook Equinox Sports Club',
    network: 'facebook',
    background: '#1877F2',
    shadow: '0 4px 15px rgba(24, 119, 242, 0.3)',
  },
];
