import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingModal from './BookingModal';
import { LanguageProvider } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { calculatePlanTotal, formatDA } from '../lib/pricing';

const fr = translations.fr;
const bm = fr.bookingModal;
const errs = bm.errors;

const PLAN = { catKey: 'muscCT', frequency: '3x Semaine', monthlyRate: 3500 };

const renderModal = ({ onClose = vi.fn(), plan = null } = {}) =>
  render(
    <LanguageProvider>
      <BookingModal onClose={onClose} plan={plan} />
    </LanguageProvider>,
  );

// The form labels are not associated with their inputs, so query by input type.
const nameInput = () => document.querySelector('input[type="text"]');
const phoneInput = () => document.querySelector('input[type="tel"]');
const birthdateInput = () => document.querySelector('input[type="date"]');

const btn = (name) => screen.getByRole('button', { name });

// Intl inserts a narrow no-break space that testing-library does not normalize.
const money = (amount) => {
  const expected = formatDA(amount).replace(/[\u202F\u00A0\s]/g, ' ');
  return (_, element) =>
    element?.textContent.replace(/[\u202F\u00A0\s]/g, ' ') === expected;
};

/** Pick a space (gender) — the first step of every booking. */
const chooseSpace = async (user, card = bm.menCard) => {
  await user.click(btn(new RegExp(card)));
};

const fillValidForm = async (user) => {
  await user.type(nameInput(), 'Yacine B');
  await user.type(phoneInput(), '0561234567');
  await user.click(btn('O+'));
  await user.type(birthdateInput(), '1995-04-09');
};

const sentMessage = (openSpy) =>
  decodeURIComponent(openSpy.mock.calls[0][0].split('?text=')[1]);

let openSpy;

beforeEach(() => {
  openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
});

afterEach(() => {
  openSpy.mockRestore();
});

describe('BookingModal step flow', () => {
  it('starts on the space picker', () => {
    renderModal();
    expect(screen.getByText(bm.step1Title)).toBeInTheDocument();
    expect(screen.getByText(bm.step1Small)).toBeInTheDocument();
  });

  it('goes straight to the form when a plan is preset', async () => {
    const user = userEvent.setup();
    renderModal({ plan: PLAN });
    await chooseSpace(user);
    expect(await screen.findByText(bm.duration)).toBeInTheDocument();
    expect(nameInput()).toBeInTheDocument();
  });

  it('inserts the plan picker when no plan is preset', async () => {
    const user = userEvent.setup();
    renderModal();
    await chooseSpace(user);
    expect(await screen.findByText(bm.step2Title)).toBeInTheDocument();

    await user.click((await screen.findAllByRole('button', { name: bm.chooseBtn }))[0]);
    expect(await screen.findByText(bm.duration)).toBeInTheDocument();
  });

  it('walks back from the form through the plan picker', async () => {
    const user = userEvent.setup();
    renderModal();
    await chooseSpace(user);
    await user.click((await screen.findAllByRole('button', { name: bm.chooseBtn }))[0]);
    await screen.findByText(bm.duration);

    await user.click(screen.getByTitle(bm.back));
    expect(await screen.findByText(bm.step2Title)).toBeInTheDocument();
    await user.click(screen.getByTitle(bm.back));
    expect(await screen.findByText(bm.step1Title)).toBeInTheDocument();
  });

  it('skips the plan picker when walking back with a preset plan', async () => {
    const user = userEvent.setup();
    renderModal({ plan: PLAN });
    await chooseSpace(user);
    await screen.findByText(bm.duration);
    await user.click(screen.getByTitle(bm.back));
    expect(await screen.findByText(bm.step1Title)).toBeInTheDocument();
  });

  it('closes from the header button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderModal({ onClose });
    await user.click(screen.getByTitle(bm.close));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('opens WhatsApp directly for the séance libre row', async () => {
    const user = userEvent.setup();
    renderModal();
    await chooseSpace(user);
    await user.click(await screen.findByRole('button', { name: bm.waBtn }));
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/213562838455?text='),
      '_blank',
    );
  });
});

describe('BookingModal pricing', () => {
  it('shows the single-month rate by default', async () => {
    const user = userEvent.setup();
    renderModal({ plan: PLAN });
    await chooseSpace(user);
    expect(await screen.findAllByText(money(PLAN.monthlyRate))).not.toHaveLength(0);
  });

  it('recomputes the total and savings when the duration changes', async () => {
    const user = userEvent.setup();
    renderModal({ plan: PLAN });
    await chooseSpace(user);
    await user.click(await screen.findByRole('button', { name: `6 ${bm.months}` }));

    expect(
      await screen.findAllByText(money(calculatePlanTotal(PLAN.monthlyRate, 6))),
    ).not.toHaveLength(0);
    expect(screen.getByText(new RegExp(bm.oneMonthFree))).toBeInTheDocument();
  });

  it('advertises the yearly perks only on the 12-month duration', async () => {
    const user = userEvent.setup();
    renderModal({ plan: PLAN });
    await chooseSpace(user);
    await screen.findByText(bm.duration);
    expect(screen.queryByText(bm.perks)).not.toBeInTheDocument();

    await user.click(btn(`12 ${bm.months}`));
    expect(await screen.findByText(bm.perks)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(bm.twoMonthsFree))).toBeInTheDocument();
  });
});

describe('BookingModal form validation', () => {
  it('reports every missing field and does not open WhatsApp', async () => {
    const user = userEvent.setup();
    renderModal({ plan: PLAN });
    await chooseSpace(user);
    await user.click(await screen.findByRole('button', { name: bm.confirmBtn }));

    expect(screen.getByText(errs.name)).toBeInTheDocument();
    expect(screen.getByText(errs.phoneReq)).toBeInTheDocument();
    expect(screen.getByText(errs.bloodGroup)).toBeInTheDocument();
    expect(screen.getByText(errs.birthdate)).toBeInTheDocument();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('rejects a phone number with fewer than nine digits', async () => {
    const user = userEvent.setup();
    renderModal({ plan: PLAN });
    await chooseSpace(user);
    await screen.findByText(bm.duration);
    await user.type(nameInput(), 'Yacine B');
    await user.type(phoneInput(), '05 61 23');
    await user.click(btn(bm.confirmBtn));

    expect(screen.getByText(errs.phoneInv)).toBeInTheDocument();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('rejects a whitespace-only name', async () => {
    const user = userEvent.setup();
    renderModal({ plan: PLAN });
    await chooseSpace(user);
    await screen.findByText(bm.duration);
    await user.type(nameInput(), '   ');
    await user.click(btn(bm.confirmBtn));
    expect(screen.getByText(errs.name)).toBeInTheDocument();
  });

  it('clears a field error as soon as the user edits it', async () => {
    const user = userEvent.setup();
    renderModal({ plan: PLAN });
    await chooseSpace(user);
    await user.click(await screen.findByRole('button', { name: bm.confirmBtn }));
    expect(screen.getByText(errs.name)).toBeInTheDocument();

    await user.type(nameInput(), 'Y');
    expect(screen.queryByText(errs.name)).not.toBeInTheDocument();
    expect(screen.getByText(errs.phoneReq)).toBeInTheDocument();

    await user.click(btn('O+'));
    expect(screen.queryByText(errs.bloodGroup)).not.toBeInTheDocument();
  });
});

describe('BookingModal submission', () => {
  it('sends a French WhatsApp message with the booking details', async () => {
    const user = userEvent.setup();
    renderModal({ plan: PLAN });
    await chooseSpace(user);
    await screen.findByText(bm.duration);
    await fillValidForm(user);
    await user.click(btn(bm.confirmBtn));

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy.mock.calls[0][1]).toBe('_blank');
    const message = sentMessage(openSpy);
    expect(message).toContain('Nom: Yacine B');
    expect(message).toContain('Téléphone: 0561234567');
    expect(message).toContain('Groupe sanguin: O+');
    expect(message).toContain('Date de naissance: 09/04/1995');
    expect(message).toContain('Espace: Homme');
    expect(message).toContain('Durée: 1 mois');
    expect(message).toContain(`Total: ${formatDA(PLAN.monthlyRate)}`);
    expect(message).not.toContain('Bonus');
  });

  it('adds the yearly bonus line and the discounted total', async () => {
    const user = userEvent.setup();
    renderModal({ plan: PLAN });
    await chooseSpace(user);
    await user.click(await screen.findByRole('button', { name: `12 ${bm.months}` }));
    await fillValidForm(user);
    await user.click(btn(bm.confirmBtn));

    const message = sentMessage(openSpy);
    expect(message).toContain('Durée: 12 mois');
    expect(message).toContain(`Total: ${formatDA(calculatePlanTotal(PLAN.monthlyRate, 12))}`);
    expect(message).toContain('Bonus: T-shirt et Shaker offerts 🎁');
  });

  it('records the women space when that option is chosen', async () => {
    const user = userEvent.setup();
    renderModal({ plan: PLAN });
    await chooseSpace(user, bm.womenCard);
    await screen.findByText(bm.duration);
    await fillValidForm(user);
    await user.click(btn(bm.confirmBtn));

    expect(sentMessage(openSpy)).toContain('Espace: Femme');
  });

  it('confirms success instead of the submit button after sending', async () => {
    const user = userEvent.setup();
    renderModal({ plan: PLAN });
    await chooseSpace(user);
    await screen.findByText(bm.duration);
    await fillValidForm(user);
    await user.click(btn(bm.confirmBtn));

    expect(await screen.findByText(new RegExp(bm.successText))).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: bm.confirmBtn })).not.toBeInTheDocument();
  });
});
