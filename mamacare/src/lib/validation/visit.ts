import { z } from 'zod';

export interface VisitFormValues {
  visit_date: string;
  visit_type: 'home' | 'clinic';
  blood_pressure?: string;
  weight?: string;
  fundal_height?: string;
  fetal_heart_rate?: string;
  urine?: string;
  symptoms: string[];
  notes?: string;
}

export const visitSchema = z.object({
  visit_date: z.string().min(1, 'Visit date is required.'),
  visit_type: z.enum(['home', 'clinic']),
  blood_pressure: z.string().regex(/^\d{2,3}\/\d{2,3}$/, 'Use format like 120/80').optional().or(z.literal('')),
  weight: z.string().optional().or(z.literal('')),
  fundal_height: z.string().optional().or(z.literal('')),
  fetal_heart_rate: z.string().optional().or(z.literal('')),
  urine: z.string().optional().or(z.literal('')),
  symptoms: z.array(z.string()),
  notes: z.string().optional().or(z.literal('')),
}) satisfies z.ZodType<VisitFormValues>;
