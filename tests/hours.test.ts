import { isStoreOpen, getStoreStatusMessage, parseHoursRange } from '../src/lib/hours';
import { describe, test, expect } from 'vitest';

describe('Hours calculation', () => {
  test('parseHoursRange parses closed', () => {
    const result = parseHoursRange('closed');
    expect(result.isClosed).toBe(true);
  });

  test('parseHoursRange parses a time range', () => {
    const result = parseHoursRange('08:00-19:00');
    expect(result.isClosed).toBe(false);
    expect(result.start.hour).toBe(8);
    expect(result.end.minute).toBe(0);
  });

  test('isStoreOpen returns boolean', () => {
    const result = isStoreOpen({} as any);
    expect(typeof result).toBe('boolean');
  });

  test('getStoreStatusMessage returns correct message', () => {
    const result = getStoreStatusMessage({} as any);
    expect(result.message).toBeDefined();
  });
});