import { z } from 'zod';

// Booking validation schemas
export const bookingFormSchema = z.object({
  date: z.string().min(1, 'Data yra privaloma'),
  timeSlot: z.object({
    start: z.string().min(1, 'Laikas yra privalomas'),
    end: z.string().min(1, 'Laikas yra privalomas'),
  }),
  location: z.string().min(1, 'Vieta yra privaloma'),
  guests: z.number().min(2, 'Mažiausiai 2 svečiai').max(8, 'Daugiausiai 8 svečiai'),
  contactInfo: z.object({
    name: z.string().min(2, 'Vardas turi būti bent 2 simboliai'),
    email: z.string().email('Neteisingas el. pašto formatas'),
    phone: z.string().min(8, 'Telefono numeris turi būti bent 8 simboliai'),
  }),
  specialRequests: z.string().optional(),
  selectedTheme: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive(),
  }),
});

export type BookingInput = z.infer<typeof bookingFormSchema>; // Exporting the inferred type

export const adminBookingUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  notes: z.string().optional(),
});

export const themeSchema = z.object({
  name: z.string().min(2, 'Pavadinimas turi būti bent 2 simboliai'),
  description: z.string().min(10, 'Aprašymas turi būti bent 10 simbolių'),
  price: z.number().positive('Kaina turi būti teigiama'),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean(),
});

// User validation schemas
export const userUpdateSchema = z.object({
  displayName: z.string().min(2).optional(),
  isAdmin: z.boolean().optional(),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Vardas turi būti bent 2 simboliai'),
  email: z.string().email('Neteisingas el. pašto formatas'),
  message: z.string().min(10, 'Žinutė turi būti bent 10 simbolių'),
});

// Review validation
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Komentaras turi būti bent 10 simbolių'),
  bookingId: z.string().optional(),
});

// Utility functions
export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.issues.map(err => err.message) 
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Limit length
};

// Rate limiting helper
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (identifier: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(identifier);

    if (!userRequests || now > userRequests.resetTime) {
      requests.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (userRequests.count >= maxRequests) {
      return false;
    }

    userRequests.count++;
    return true;
  };
}; 