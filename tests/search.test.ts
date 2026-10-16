import { normalizeSearchText, matchesSearch } from '../src/lib/search';
import { describe, test, expect } from 'vitest';

describe('Search normalization', () => {
  test('normalizeSearchText removes accents', () => {
    const result = normalizeSearchText('Martillo');
    expect(result).toBe('martillo');
  });

  test('normalizeSearchText removes special chars', () => {
    const result = normalizeSearchText('Martillo #1');
    expect(result).toContain('martillo');
  });

  test('matchesSearch finds product by name', () => {
    const result = matchesSearch('Martillo carpintero', 'Martillo');
    expect(result).toBe(true);
  });

  test('matchesSearch case insensitive', () => {
    const result = matchesSearch('MARTillo', 'martillo');
    expect(result).toBe(true);
  });

  test('matchesSearch no match', () => {
    const result = matchesSearch('Cuchillo', 'Martillo');
    expect(result).toBe(false);
  });
});