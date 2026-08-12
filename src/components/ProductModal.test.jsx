import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductModal from './ProductModal';
import { LanguageProvider } from '../context/LanguageContext';

const FREE_PRODUCT = {
  id: 'iso-xp',
  name: 'ISO-XP Whey Protein Isolate',
  brand: 'Applied Nutrition',
  price: 0,
  description: 'Isolat de protéines 100% pur.',
  image: '/products/iso-xp.jpg',
  category: 'Protéines',
};

const PRICED_PRODUCT = { ...FREE_PRODUCT, id: 'priced', price: 4500 };

const nameInput = () => document.querySelector('input[type="text"]');
const phoneInput = () => document.querySelector('input[type="tel"]');
const orderButton = () => screen.getByRole('button', { name: /Commander/ });

const sentMessage = (openSpy) =>
  decodeURIComponent(openSpy.mock.calls[0][0].split('?text=')[1]);

let openSpy;

beforeEach(() => {
  openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
});

afterEach(() => {
  openSpy.mockRestore();
});

describe('ProductModal', () => {
  const renderWithLang = (ui) => render(<LanguageProvider>{ui}</LanguageProvider>);

  it('renders nothing without a product', () => {
    const { container } = renderWithLang(<ProductModal product={null} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the product details and a price-on-request label when free', () => {
    renderWithLang(<ProductModal product={FREE_PRODUCT} onClose={vi.fn()} />);
    expect(screen.getByText(FREE_PRODUCT.name)).toBeInTheDocument();
    expect(screen.getByText(FREE_PRODUCT.brand)).toBeInTheDocument();
    expect(screen.getByText('Prix sur demande')).toBeInTheDocument();
  });

  it('formats a real price and puts it on the order button', () => {
    renderWithLang(<ProductModal product={PRICED_PRODUCT} onClose={vi.fn()} />);
    const expected = new Intl.NumberFormat('fr-DZ').format(4500) + ' DA';
    expect(screen.getAllByText((_, el) => el?.textContent === expected).length).toBeGreaterThan(0);
    expect(orderButton().textContent).toContain('Commander');
  });

  it('requires a name and a phone number', async () => {
    const user = userEvent.setup();
    renderWithLang(<ProductModal product={FREE_PRODUCT} onClose={vi.fn()} />);
    await user.click(orderButton());

    expect(screen.getByText('Le nom complet est requis.')).toBeInTheDocument();
    expect(screen.getByText('Le numéro de téléphone est requis.')).toBeInTheDocument();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('rejects a phone number shorter than nine digits', async () => {
    const user = userEvent.setup();
    renderWithLang(<ProductModal product={FREE_PRODUCT} onClose={vi.fn()} />);
    await user.type(nameInput(), 'Mohamed Amine');
    await user.type(phoneInput(), '05 61');
    await user.click(orderButton());

    expect(screen.getByText(/Numéro invalide/)).toBeInTheDocument();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('clears an error once the field is edited', async () => {
    const user = userEvent.setup();
    renderWithLang(<ProductModal product={FREE_PRODUCT} onClose={vi.fn()} />);
    await user.click(orderButton());
    await user.type(nameInput(), 'M');

    expect(screen.queryByText('Le nom complet est requis.')).not.toBeInTheDocument();
    expect(screen.getByText('Le numéro de téléphone est requis.')).toBeInTheDocument();
  });

  it('sends a WhatsApp order without a price for on-request products', async () => {
    const user = userEvent.setup();
    renderWithLang(<ProductModal product={FREE_PRODUCT} onClose={vi.fn()} />);
    await user.type(nameInput(), 'Mohamed Amine');
    await user.type(phoneInput(), '0561234567');
    await user.click(orderButton());

    expect(openSpy).toHaveBeenCalledTimes(1);
    const message = sentMessage(openSpy);
    expect(message).toContain('Mohamed Amine');
    expect(message).toContain(FREE_PRODUCT.name);
    expect(message).toContain('Mon numéro: 0561234567');
    expect(message).not.toContain('DA');
    // It doesn't show "Votre demande a été envoyée sur WhatsApp" because window.open mock returns null
    // But error-handling branch triggers the blocked notice instead!
    expect(screen.getByText(/Ouvrir WhatsApp/i)).toBeInTheDocument();
  });

  it('includes the price in the WhatsApp order when the product has one', async () => {
    const user = userEvent.setup();
    renderWithLang(<ProductModal product={PRICED_PRODUCT} onClose={vi.fn()} />);
    await user.type(nameInput(), 'Mohamed Amine');
    await user.type(phoneInput(), '0561234567');
    await user.click(orderButton());

    expect(sentMessage(openSpy)).toContain('à 4500 DA');
  });

  it('closes from the close button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithLang(<ProductModal product={FREE_PRODUCT} onClose={onClose} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
