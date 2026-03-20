import { z } from "zod";

export const onboardingSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 chars"),
  bio: z.string().min(10, "Bio too short"),
  headline: z.string(),
  specialties: z.array(z.string()).min(1, "Select at least one"),
  city: z.string().min(2, "City is required"),
  availability: z.enum(["available", "at_capacity"]),
  google_cal_status: z.boolean(),
});

export type OnboardingForm = z.infer<typeof onboardingSchema>;