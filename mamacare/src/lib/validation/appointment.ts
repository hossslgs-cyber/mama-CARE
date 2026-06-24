import { z } from 'zod';

export const appointmentSchema = z.object({
  appointment_date: z.string().min(1, 'Appointment date is required.'),
  location: z.enum(['home', 'clinic']),
  purpose: z.string().min(2, 'Purpose is required.'),
  reminder_enabled: z.boolean(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
