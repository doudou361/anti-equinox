import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactModal from './ContactModal';
import { LanguageProvider } from '../context/LanguageContext';
import { translations } from '../data/translations';

const fr = translations.fr.contactModal;

const renderModal = ({ isOpen = true, onClose = vi.fn() } = {}) => {
  const { container } = render(
    <LanguageProvider>
      <ContactModal isOpen={isOpen} onClose={onClose} />
    </LanguageProvider>,
  );
  return { onClose, backdrop: container.firstChild };
};

afterEach(() => {
  vi.useRealTimers();
});

describe('ContactModal', () => {
  it('renders nothing while closed', () => {
    const { container } = render(
      <LanguageProvider>
        <ContactModal isOpen={false} onClose={vi.fn()} />
      </LanguageProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the contact form and the map when open', () => {
    renderModal();
    expect(screen.getByText(fr.formTitle)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(fr.namePlaceholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(fr.phonePlaceholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(fr.messagePlaceholder)).toBeInTheDocument();
    expect(screen.getByTitle('Equinox Sports Club Location')).toBeInTheDocument();
  });



  it('closes when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { onClose, backdrop } = renderModal();
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps the modal open when the panel itself is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();
    await user.click(screen.getByText(fr.formTitle));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows the blocked notice if the window fails to open', () => {
    const { onClose } = renderModal();
    vi.useFakeTimers();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    fireEvent.change(screen.getByPlaceholderText(fr.namePlaceholder), { target: { value: 'Amine' } });
    fireEvent.change(screen.getByPlaceholderText(fr.phonePlaceholder), { target: { value: '0561234567' } });
    fireEvent.change(screen.getByPlaceholderText(fr.messagePlaceholder), { target: { value: 'Bonjour' } });
    fireEvent.click(screen.getByRole('button', { name: fr.sendBtn }));

    expect(screen.getByText(/Ouvrir WhatsApp manuellement/i)).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();

    openSpy.mockRestore();
  });
});
