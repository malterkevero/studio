import { z } from 'zod';
import { QueenColors } from './types';

export const hiveSchema = z.object({
  name: z.string().min(1, 'Az azonosító megadása kötelező.'),
  queen: z.object({
    year: z.coerce.number()
        .int('Az évszámnak egész számnak kell lennie.')
        .min(2000, 'Az évszámnak 2000-nél nagyobbnak kell lennie.')
        .max(new Date().getFullYear(), 'Jövőbeli évszám nem adható meg.'),
    color: z.enum(QueenColors, { required_error: "A szín kiválasztása kötelező."}),
    type: z.string().optional(),
  }),
  strength: z.number().min(1).max(5),
  health: z.object({
    miteLevel: z.string().optional(),
    diseases: z.string().optional(),
  }),
  food: z.object({
    honey: z.coerce.number().min(0, 'A méz mennyisége nem lehet negatív.').optional(),
    pollen: z.coerce.number().min(0, 'A virágpor mennyisége nem lehet negatív.').optional(),
  }),
  lastIntervention: z.object({
    date: z.date({ required_error: "A dátum megadása kötelező."}),
    type: z.string().optional(),
  }),
  notes: z.string().optional(),
});

export const reminderSchema = z.object({
  text: z.string().min(1, 'Az emlékeztető szövege nem lehet üres.'),
  dueDate: z.date({ required_error: "A határidő megadása kötelező."}),
});
