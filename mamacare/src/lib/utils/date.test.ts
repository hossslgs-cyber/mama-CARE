import { describe, it, expect } from 'vitest';
import { formatDisplayDate, addDaysFromDate, daysBetween } from './date';

describe('formatDisplayDate', () => {
  it('formats an ISO string with the default pattern', () => {
    const result = formatDisplayDate('2025-06-15T00:00:00.000Z');
    expect(result).toContain('Jun');
    expect(result).toContain('15');
    expect(result).toContain('2025');
  });

  it('formats a Date object with a custom pattern', () => {
    const result = formatDisplayDate(new Date(2025, 0, 1), 'yyyy-MM-dd');
    expect(result).toBe('2025-01-01');
  });

  it('formats an ISO string with a custom pattern', () => {
    const result = formatDisplayDate('2024-12-25', 'dd/MM/yyyy');
    expect(result).toBe('25/12/2024');
  });
});

describe('addDaysFromDate', () => {
  it('adds days to an ISO string', () => {
    const result = addDaysFromDate('2025-01-01', 10);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getDate()).toBe(11);
  });

  it('adds days to a Date object', () => {
    const result = addDaysFromDate(new Date(2025, 5, 1), 30);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(6); // July
    expect(result.getDate()).toBe(1);
  });

  it('handles negative day amounts', () => {
    const result = addDaysFromDate('2025-03-10', -5);
    expect(result.getDate()).toBe(5);
    expect(result.getMonth()).toBe(2); // March
  });

  it('handles crossing month boundaries', () => {
    const result = addDaysFromDate('2025-01-28', 5);
    expect(result.getMonth()).toBe(1); // February
    expect(result.getDate()).toBe(2);
  });
});

describe('daysBetween', () => {
  it('returns positive days when end is after start', () => {
    expect(daysBetween('2025-01-01', '2025-01-11')).toBe(10);
  });

  it('returns negative days when end is before start', () => {
    expect(daysBetween('2025-01-11', '2025-01-01')).toBe(-10);
  });

  it('returns 0 for the same date', () => {
    expect(daysBetween('2025-06-15', '2025-06-15')).toBe(0);
  });

  it('works with Date objects', () => {
    expect(daysBetween(new Date(2025, 0, 1), new Date(2025, 0, 31))).toBe(30);
  });

  it('works with mixed string and Date inputs', () => {
    expect(daysBetween('2025-01-01', new Date(2025, 0, 16))).toBe(15);
  });
});
