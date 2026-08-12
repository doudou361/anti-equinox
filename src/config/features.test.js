import { describe, it, expect } from 'vitest';
import { NUTRITION_ENABLED } from './features';

describe('feature flags', () => {
  it('exposes NUTRITION_ENABLED as a boolean', () => {
    expect(typeof NUTRITION_ENABLED).toBe('boolean');
  });
});
