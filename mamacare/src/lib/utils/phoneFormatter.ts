export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  let normalized = digits;
  if (normalized.startsWith('0')) {
    normalized = '254' + normalized.slice(1);
  } else if (normalized.startsWith('7') && normalized.length <= 9) {
    normalized = '254' + normalized;
  }
  if (normalized.length > 3 && normalized.length <= 6) {
    return '+' + normalized.slice(0, 3) + ' ' + normalized.slice(3);
  }
  if (normalized.length > 6) {
    let result = '+' + normalized.slice(0, 3) + ' ' + normalized.slice(3, 6) + ' ' + normalized.slice(6, 9);
    if (normalized.length > 9) {
      result += ' ' + normalized.slice(9, 12);
    }
    return result;
  }
  return normalized.length > 0 ? '+' + normalized : normalized;
}

export function stripPhoneNumber(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidPhoneNumber(value: string): boolean {
  const digits = stripPhoneNumber(value);
  if (digits.startsWith('254')) {
    return digits.length >= 12 && digits.length <= 13;
  }
  return digits.length >= 10 && digits.length <= 13;
}

export function normalizePhoneNumber(value: string): string {
  const digits = stripPhoneNumber(value);
  if (digits.startsWith('0')) {
    return '254' + digits.slice(1);
  }
  if (digits.startsWith('7') || digits.startsWith('1')) {
    return '254' + digits;
  }
  return digits;
}
