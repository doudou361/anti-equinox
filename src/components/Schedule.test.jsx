import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Schedule from './Schedule';
import { LanguageProvider } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { scheduleData } from '../data/schedule';

const fr = translations.fr.schedule;

const renderSchedule = () =>
  render(
    <LanguageProvider>
      <Schedule />
    </LanguageProvider>,
  );

const daysOf = (group) => scheduleData[group].map((e) => e.day);

describe('Schedule', () => {
  it('renders the section heading and both tabs', () => {
    renderSchedule();
    expect(screen.getByText(fr.title)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: fr.tabMen })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: fr.tabWomen })).toBeInTheDocument();
  });

  it("shows the men's schedule by default", () => {
    renderSchedule();
    for (const day of daysOf('hommes')) {
      expect(screen.getByText(day), day).toBeInTheDocument();
    }
    for (const { times } of scheduleData.hommes) {
      for (const time of times) {
        expect(screen.getAllByText(time).length, time).toBeGreaterThan(0);
      }
    }
  });

  it("switches to the women's schedule and back", async () => {
    const user = userEvent.setup();
    renderSchedule();

    await user.click(screen.getByRole('button', { name: fr.tabWomen }));
    for (const day of daysOf('femmes')) {
      expect(await screen.findByText(day), day).toBeInTheDocument();
    }
    expect(screen.queryByText('Jeudi')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: fr.tabMen }));
    expect(await screen.findByText('Jeudi')).toBeInTheDocument();
  });

  it('does not show crossfit class times in either tab', async () => {
    const user = userEvent.setup();
    renderSchedule();
    expect(screen.queryByText('17h30')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: fr.tabWomen }));
    expect(screen.queryByText('17h30')).not.toBeInTheDocument();
  });
});
