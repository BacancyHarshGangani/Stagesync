import { z } from "zod";

export const loginschema = z.object({
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


});

export type Loginschema = z.infer<typeof loginschema>;