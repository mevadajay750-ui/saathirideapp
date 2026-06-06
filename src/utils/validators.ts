import { z } from 'zod';
import { INDIA_PHONE_REGEX, OTP_LENGTH } from '@/config/constants';

export const phoneSchema = z
  .string()
  .regex(INDIA_PHONE_REGEX, 'Enter a valid 10-digit Indian mobile number');

export const otpSchema = z
  .string()
  .length(OTP_LENGTH, `OTP must be ${OTP_LENGTH} digits`)
  .regex(/^\d+$/, 'OTP must contain only numbers');

export const rideSchema = z.object({
  originCity: z.string().min(2, 'Select a city'),
  originLandmark: z.string().optional(),
  destinationCity: z.string().min(2, 'Select a city'),
  destinationLandmark: z.string().optional(),
  departureDate: z.string().min(1, 'Select a date'),
  departureTime: z.string().min(1, 'Select a time'),
  totalSeats: z.number().min(1).max(4),
  pricePerSeat: z.number().min(50, 'Minimum ₹50').max(5000, 'Maximum ₹5000'),
  notes: z.string().max(200).optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  photoUrl: z.string().url().optional(),
});
