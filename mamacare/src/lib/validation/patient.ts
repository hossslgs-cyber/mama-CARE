import { z } from 'zod';

export interface PatientFormValues {
  full_name: string;
  age: string;
  phone: string;
  village: string;
  address: string;
  edd: string;
  gravida: string;
  para: string;
  risk_factors: string[];
  emergency_contact?: string;
}

export const ALLOWED_RISK_FACTORS = ['Pre-eclampsia', 'Diabetes', 'Previous C-section', 'Anaemia'] as const;

export const patientSchema = z.object({
  full_name: z.string().min(2, 'Full name is required.').max(200, 'Name is too long.'),
  age: z
    .string()
    .min(1, 'Age is required.')
    .regex(/^\d{1,3}$/, 'Age must be a number.')
    .refine((v) => { const n = Number(v); return n >= 10 && n <= 60; }, 'Age must be between 10 and 60.'),
  phone: z
    .string()
    .min(7, 'Phone number is required.')
    .max(20, 'Phone number is too long.')
    .regex(/^[+\d\s()-]+$/, 'Phone must contain only digits, spaces, +, (, ), or -.'),
  village: z.string().min(2, 'Village is required.').max(200, 'Village name is too long.'),
  address: z.string().min(2, 'Address is required.').max(500, 'Address is too long.'),
  edd: z.string().min(1, 'EDD is required.').regex(/^\d{4}-\d{2}-\d{2}$/, 'EDD must be a valid date (YYYY-MM-DD).'),
  gravida: z
    .string()
    .min(1, 'Gravida is required.')
    .regex(/^\d{1,2}$/, 'Gravida must be a number.')
    .refine((v) => Number(v) >= 1 && Number(v) <= 20, 'Gravida must be between 1 and 20.'),
  para: z
    .string()
    .min(1, 'Para is required.')
    .regex(/^\d{1,2}$/, 'Para must be a number.')
    .refine((v) => Number(v) >= 0 && Number(v) <= 20, 'Para must be between 0 and 20.'),
  risk_factors: z.array(
    z.string().refine(
      (v): v is typeof ALLOWED_RISK_FACTORS[number] => (ALLOWED_RISK_FACTORS as readonly string[]).includes(v),
      'Invalid risk factor.'
    )
  ),
  emergency_contact: z
    .string()
    .max(20, 'Emergency contact is too long.')
    .regex(/^[+\d\s()-]*$/, 'Emergency contact must be a valid phone number.')
    .optional()
    .or(z.literal('')),
}) satisfies z.ZodType<PatientFormValues>;
