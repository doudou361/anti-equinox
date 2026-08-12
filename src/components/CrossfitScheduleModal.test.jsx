import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CrossfitScheduleModal from './CrossfitScheduleModal';
import { LanguageProvider } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { scheduleData } from '../data/schedule';

const fr = translations.fr;

const renderModal = (onClose = vi.fn()) => {
  render(
    <LanguageProvider>
      <CrossfitScheduleModal onClose={onClose} />
    </LanguageProvider>,
  );
  return onClose;
};

describe('CrossfitScheduleModal', () => {
  it('titles the modal with the crossfit schedule label', () => {
    renderModal();
    expect(screen.getByText(fr.nav.crossfitSchedule)).toBeInTheDocument();
  });

  it('renders every crossfit day translated', () => {
    renderModal();
    const expectedDays = [fr.schedule.days.saturday, fr.schedule.days.monday, fr.schedule.days.wednesday];
    for (const day of expectedDays) {
      expect(screen.getByText(day), day).toBeInTheDocument();
    }
  });

  it('renders every class time of every day', () => {
    renderModal();
    for (const { day, times } of scheduleData.crossfit) {
      for (const time of times) {
        expect(screen.getAllByText(time).length, `${day} ${time}`).toBeGreaterThan(0);
      }
    }
  });

  it('closes from the close button', async () => {
    const user = userEvent.setup();
    const onClose = renderModal();
    await user.click(screen.getByTitle(fr.bookingModal.close));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
