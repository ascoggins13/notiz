import { z } from 'zod';

export const appearanceSchema = z.object({
  gender: z.string().trim().max(40).optional(),

  topType: z.string().trim().max(40).optional(),
  shirtColor: z.string().trim().max(30).optional(),

  bottomType: z.string().trim().max(40).optional(),
  pantsColor: z.string().trim().max(30).optional(),

  shoeColor: z.string().trim().max(30).optional(),

  jewelry: z
    .array(z.string().trim().min(1).max(50))
    .max(8)
    .default([]),

  identifiers: z
    .array(z.string().trim().min(1).max(60))
    .max(8)
    .default([]),

  venueArea: z.string().trim().max(80).optional(),
  activity: z.string().trim().max(80).optional(),
});

export const checkinSchema = z.object({
  venueId: z.string().trim().min(1).max(120),
  venueName: z.string().trim().min(1).max(120),
});

export const preferenceSchema = z.object({
  preference: z.enum([
    'approach_now',
    'between_sets',
    'after_workout',
    'chat_first',
    'exchange_contact',
    'meet_here',
    'meet_later',
  ]),
});

export const meetingLocationSchema = z.object({
  location: z.string().trim().min(1).max(120),
});
