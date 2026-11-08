// Zod schema for the admin CRM form, built from translated messages.
import { z } from "zod";
import type { ValidationMessages } from "@/content/app/types";

export function createClientSchema(t: ValidationMessages) {
  return z.object({
    companyName: z.string().min(2, t.companyName),
    contactPerson: z.string().min(2, t.contactPerson),
    email: z.string().email(t.email),
    phone: z.string().min(3, t.phone),
    street: z.string().min(3, t.street),
    city: z.string().min(2, t.city),
    postalCode: z.string().min(3, t.postalCode),
    country: z.string().min(2, t.country),
    taxIdNumber: z.string().optional(),
    specialDeliveryInstructions: z.string().optional(),
    defaultBaseFee: z.coerce.number().optional(),
    defaultRatePerKilometer: z.coerce.number().optional(),
  });
}

export type ClientFormValues = z.infer<ReturnType<typeof createClientSchema>>;
