import { z } from 'zod';

export const referralSchema = z.object({
  patient_id: z.string().min(1),
  referral_date: z.string().min(1, 'Date is required.'),
  facility_name: z.string().min(2, 'Health facility name is required.'),
  reason: z.string().min(5, 'Please provide a detailed reason for referral.'),
  urgency: z.enum(['routine', 'urgent', 'emergency']),
  transport_arranged: z.boolean(),
  notes: z.string().optional().or(z.literal('')),
});

export type ReferralFormValues = z.infer<typeof referralSchema>;
