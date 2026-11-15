import { z } from "zod";

export const publicRegistrationSchema = z.object({
  role: z.literal("Client"),
  payload: z.object({
    companyName: z.string(),
    contactPerson: z.string(),
    email: z.string(),
    password: z.string(),
    phone: z.string(),
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
    taxIdNumber: z.string().nullable().optional(),
  }),
});
