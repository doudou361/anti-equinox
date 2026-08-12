import { describe, it, expect } from 'vitest';
import { scheduleData } from './schedule';

const SLOT = /^\d{1,2}h(\d{2})?( - \d{1,2}h(\d{2})?)?$/;

describe('scheduleData', () => {
  it('exposes the three schedules the UI tabs read', () => {
    expect(Object.keys(scheduleData).sort()).toEqual(['crossfit', 'femmes', 'hommes']);
  });

  it('gives every entry a day and at least one time slot', () => {
    for (const [group, entries] of Object.entries(scheduleData)) {
      expect(entries.length, group).toBeGreaterThan(0);
      for (const entry of entries) {
        expect(entry.day.trim(), group).not.toBe('');
        expect(entry.times.length, `${group}/${entry.day}`).toBeGreaterThan(0);
      }
    }
  });

  it('never repeats a day within a schedule', () => {
    for (const [group, entries] of Object.entries(scheduleData)) {
      const days = entries.map((e) => e.day);
      expect(new Set(days).size, group).toBe(days.length);
    }
  });

  it('formats every slot as an hour or an hour range', () => {
    for (const [group, entries] of Object.entries(scheduleData)) {
      for (const entry of entries) {
        for (const time of entry.times) {
          expect(time, `${group}/${entry.day}`).toMatch(SLOT);
        }
      }
    }
  });

  it('lists crossfit classes as single start times only', () => {
    for (const entry of scheduleData.crossfit) {
      for (const time of entry.times) {
        expect(time, entry.day).not.toContain('-');
      }
    }
  });

  it('keeps crossfit start times in chronological order', () => {
    const minutes = (t) => {
      const [h, m] = t.split('h');
      return Number(h) * 60 + Number(m || 0);
    };
    for (const entry of scheduleData.crossfit) {
      const times = entry.times.map(minutes);
      expect(times, entry.day).toEqual([...times].sort((a, b) => a - b));
    }
  });
});
