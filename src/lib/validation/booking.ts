import { z } from 'zod';

export const bookingSchema = z.object({
  location: z.enum(['juodkrante', 'nida', 'klaipeda']),
  date: z.string().datetime(),
  theme: z.enum(['undiniu', 'feju', 'laumiu', 'disco']),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  guestCount: z.number().min(1).max(20),
  basePrice: z.number().min(0),
  additionalServices: z.array(z.string()).optional(),
  additionalPrice: z.number().min(0).optional(),
  totalPrice: z.number().min(0),
  contactInfo: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().min(8).max(20),
  }),
});

export type BookingInput = z.infer<typeof bookingSchema>;
