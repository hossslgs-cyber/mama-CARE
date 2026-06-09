import { addDays, format, differenceInDays, parseISO } from 'date-fns';

export function formatDisplayDate(value: string | Date, pattern = 'PPP') {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return format(date, pattern);
}

export function addDaysFromDate(value: string | Date, amount: number) {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return addDays(date, amount);
}

export function daysBetween(start: string | Date, end: string | Date) {
  const a = typeof start === 'string' ? parseISO(start) : start;
  const b = typeof end === 'string' ? parseISO(end) : end;
  return differenceInDays(b, a);
}
