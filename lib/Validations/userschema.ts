import { z } from "zod";

export const userschema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
      message:
        "Password must include uppercase, lowercase, number and special character",
    }),

  role: z
    .string()
    .min(1, "Select your role")
    .refine((val) => ["CLIENT", "PLANNER", "VENDOR"].includes(val), {
      message: "Select your role",
    }),

});

export type Userschema = z.infer<typeof userschema>;