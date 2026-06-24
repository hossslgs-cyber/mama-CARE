interface ValidationResult {
  valid: boolean;
  message: string;
}

export function validatePin(pin: string): ValidationResult {
  const cleaned = pin.trim();
  if (!cleaned) {
    return { valid: false, message: 'Please enter a 4-digit PIN' };
  }
  if (!/^\d{4}$/.test(cleaned)) {
    return { valid: false, message: 'PIN must be exactly 4 digits' };
  }
  return { valid: true, message: '' };
}

export function validateEmail(email: string): ValidationResult {
  const cleaned = email.trim().toLowerCase();
  if (!cleaned) {
    return { valid: false, message: 'Please enter an email address' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true, message: '' };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, message: 'Please enter a password' };
  }
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
}

export function validatePhone(phone: string): ValidationResult {
  const digits = phone.replace(/\D/g, '');
  if (!digits) {
    return { valid: false, message: 'Please enter a phone number' };
  }
  if (digits.length < 10) {
    return { valid: false, message: 'Please enter a valid phone number' };
  }
  return { valid: true, message: '' };
}
