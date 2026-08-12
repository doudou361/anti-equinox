import { describe, it, expect } from 'vitest';
import { CATEGORIES, products } from './products';

describe('CATEGORIES', () => {
  it('starts with the catch-all filter', () => {
    expect(CATEGORIES[0]).toBe('Tous');
  });

  it('contains no duplicates', () => {
    expect(new Set(CATEGORIES).size).toBe(CATEGORIES.length);
  });
});

describe('products', () => {
  it('is a non-empty catalogue', () => {
    expect(products.length).toBeGreaterThan(0);
  });

  it('uses unique ids', () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every product the fields ProductCard and ProductModal render', () => {
    for (const product of products) {
      for (const field of ['id', 'name', 'brand', 'description', 'image', 'category']) {
        expect(typeof product[field], `${product.id}.${field}`).toBe('string');
        expect(product[field].trim(), `${product.id}.${field}`).not.toBe('');
      }
      expect(typeof product.price, product.id).toBe('number');
      expect(product.price, product.id).toBeGreaterThanOrEqual(0);
    }
  });

  it('only uses categories declared in CATEGORIES', () => {
    for (const product of products) {
      expect(CATEGORIES, product.id).toContain(product.category);
    }
  });

  it('has at least one product per declared category', () => {
    for (const category of CATEGORIES.filter((c) => c !== 'Tous')) {
      expect(
        products.some((p) => p.category === category),
        category,
      ).toBe(true);
    }
  });

  it('points every image at a root-relative path', () => {
    for (const product of products) {
      expect(product.image.startsWith('/'), product.id).toBe(true);
    }
  });
});
