import { formatPrice, formatOfferPrice, formatStock } from '../src/lib/format';
import { describe, test, expect } from 'vitest';

describe('Currency formatting', () => {
  test('formatPrice formats a number as ARS', () => {
    const result = formatPrice(12500);
    expect(result).toMatch(/\$ ?12\.500,00/);
  });

  test('formatPrice with 2 decimals', () => {
    const result = formatPrice(12500.5);
    expect(result).toMatch(/\$ ?12\.500,50/);
  });

  test('formatOfferPrice shows offer when exists', () => {
    const result = formatOfferPrice(5000, 4500);
    expect(result).toContain('oferta');
  });

  test('formatOfferPrice shows regular price when no offer', () => {
    const result = formatOfferPrice(5000, null);
    expect(result).toMatch(/\$ ?5\.000,00/);
  });

  test('formatStock returns correct format', () => {
    expect(formatStock(5)).toBe('5 unidades');
    expect(formatStock(1)).toBe('Única unidad');
    expect(formatStock(0)).toBe('Agotado');
    expect(formatStock(null)).toBe('Sin control');
  });
});