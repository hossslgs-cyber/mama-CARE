import { addDays, format, differenceInDays, isValid, parseISO } from 'date-fns';

function toValidDate(value: string | Date, label: string): Date {
  const date = typeof value === 'string' ? parseISO(value) : value;
  if (!isValid(date)) {
    throw new Error(`Invalid date for ${label}: ${String(value)}`);
  }
  return date;
}

export function formatDisplayDate(value: string | Date, pattern = 'PPP') {
  return format(toValidDate(value, 'formatDisplayDate'), pattern);
}

export function addDaysFromDate(value: string | Date, amount: number) {
  return addDays(toValidDate(value, 'addDaysFromDate'), amount);
}

export function daysBetween(start: string | Date, end: string | Date) {
  return differenceInDays(
    toValidDate(end, 'daysBetween(end)'),
    toValidDate(start, 'daysBetween(start)')
  );
}
