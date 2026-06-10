import { describe, it, expect } from 'vitest';
import { patientSchema } from './patient';

const validPatient = {
  full_name: 'Aminata Kamara',
  age: '28',
  phone: '+23276123456',
  village: 'Makeni',
  address: '12 Main Road, Makeni',
  edd: '2025-09-01',
  gravida: '2',
  para: '1',
  risk_factors: ['Anaemia'],
  emergency_contact: '+23276654321',
};

describe('patientSchema', () => {
  it('accepts a fully valid patient', () => {
    const result = patientSchema.safeParse(validPatient);
    expect(result.success).toBe(true);
  });

  it('accepts valid patient without emergency_contact', () => {
    const withoutContact = { ...validPatient };
    delete (withoutContact as Record<string, unknown>).emergency_contact;
    const result = patientSchema.safeParse(withoutContact);
    expect(result.success).toBe(true);
  });

  it('accepts empty string for emergency_contact', () => {
    const result = patientSchema.safeParse({ ...validPatient, emergency_contact: '' });
    expect(result.success).toBe(true);
  });

  it('accepts empty risk_factors array', () => {
    const result = patientSchema.safeParse({ ...validPatient, risk_factors: [] });
    expect(result.success).toBe(true);
  });

  it('rejects when full_name is too short', () => {
    const result = patientSchema.safeParse({ ...validPatient, full_name: 'A' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Full name');
    }
  });

  it('rejects when full_name is empty', () => {
    const result = patientSchema.safeParse({ ...validPatient, full_name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects when age is empty', () => {
    const result = patientSchema.safeParse({ ...validPatient, age: '' });
    expect(result.success).toBe(false);
  });

  it('rejects when phone is too short', () => {
    const result = patientSchema.safeParse({ ...validPatient, phone: '123' });
    expect(result.success).toBe(false);
  });

  it('rejects when village is too short', () => {
    const result = patientSchema.safeParse({ ...validPatient, village: 'X' });
    expect(result.success).toBe(false);
  });

  it('rejects when address is too short', () => {
    const result = patientSchema.safeParse({ ...validPatient, address: 'A' });
    expect(result.success).toBe(false);
  });

  it('rejects when edd is empty', () => {
    const result = patientSchema.safeParse({ ...validPatient, edd: '' });
    expect(result.success).toBe(false);
  });

  it('rejects when gravida is empty', () => {
    const result = patientSchema.safeParse({ ...validPatient, gravida: '' });
    expect(result.success).toBe(false);
  });

  it('rejects when para is empty', () => {
    const result = patientSchema.safeParse({ ...validPatient, para: '' });
    expect(result.success).toBe(false);
  });

  it('rejects when required fields are missing', () => {
    const result = patientSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(8);
    }
  });
});
