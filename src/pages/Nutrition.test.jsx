import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NutritionPage from './Nutrition';
import { products, CATEGORIES } from '../data/products';

const renderPage = (onHomeClick = vi.fn()) => {
  render(<NutritionPage onHomeClick={onHomeClick} />);
  return onHomeClick;
};

const cardCount = () => document.querySelectorAll('.nutrition-grid img').length;

describe('NutritionPage', () => {
  it('lists the whole catalogue under the "Tous" filter', () => {
    renderPage();
    expect(cardCount()).toBe(products.length);
  });

  it('renders a filter pill per category', () => {
    renderPage();
    for (const category of CATEGORIES) {
      expect(screen.getByRole('button', { name: category }), category).toBeInTheDocument();
    }
  });

  it('narrows the grid to the selected category', async () => {
    const user = userEvent.setup();
    renderPage();
    const category = 'Créatine';
    const expected = products.filter((p) => p.category === category);

    await user.click(screen.getByRole('button', { name: category }));
    // exiting cards linger until their AnimatePresence exit finishes
    await waitFor(() => expect(cardCount()).toBe(expected.length));
    expect(screen.getByText(expected[0].name)).toBeInTheDocument();
  });

  it('restores the full catalogue when going back to "Tous"', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Créatine' }));
    await user.click(screen.getByRole('button', { name: 'Tous' }));
    await waitFor(() => expect(cardCount()).toBe(products.length));
  });

  it('opens and closes the product modal from a card', async () => {
    const user = userEvent.setup();
    renderPage();
    const product = products[0];

    await user.click(screen.getAllByAltText(product.name)[0]);
    expect(await screen.findByText(product.description)).toBeInTheDocument();

    const closeButton = screen.getAllByRole('button', { name: '' })[0];
    await user.click(closeButton);
    expect(screen.queryByText(product.description)).not.toBeInTheDocument();
  });

  it('navigates home from the back button', async () => {
    const user = userEvent.setup();
    const onHomeClick = renderPage();
    await user.click(screen.getByRole('button', { name: /Accueil/ }));
    expect(onHomeClick).toHaveBeenCalledTimes(1);
  });
});
