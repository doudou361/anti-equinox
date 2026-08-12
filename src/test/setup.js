import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom has no IntersectionObserver; framer-motion's whileInView needs one.
class IntersectionObserverStub {
  constructor(callback) {
    this.callback = callback;
  }

  observe(target) {
    this.callback([{ target, isIntersecting: true, intersectionRatio: 1 }], this);
  }

  unobserve() {}

  disconnect() {}

  takeRecords() {
    return [];
  }
}

globalThis.IntersectionObserver = IntersectionObserverStub;

afterEach(() => {
  cleanup();
});
