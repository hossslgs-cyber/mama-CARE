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

export const patientSchema = z.object({
  full_name: z.string().min(2, 'Full name is required.'),
  age: z.string().min(1, 'Age is required.'),
  phone: z.string().min(7, 'Phone number is required.'),
  village: z.string().min(2, 'Village is required.'),
  address: z.string().min(2, 'Address is required.'),
  edd: z.string().min(1, 'EDD is required.'),
  gravida: z.string().min(1, 'Gravida is required.'),
  para: z.string().min(1, 'Para is required.'),
  risk_factors: z.array(z.string()),
  emergency_contact: z.string().optional().or(z.literal('')),
}) satisfies z.ZodType<PatientFormValues>;
