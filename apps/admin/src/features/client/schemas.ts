// Zod schema used by the client booking form, built from translated messages.
import { z } from "zod";
import type { ValidationMessages } from "@/content/app/types";
import { cargoCategories, paymentMethods } from "@/types/api";

/**
 * The address parts both halves of the form share. The quote endpoint geocodes the
 * composed address, so these fields are all the routing call needs.
 */
export function createQuoteFormSchema(t: ValidationMessages) {
  return z.object({
    pickupStreet: z.string().trim().min(1, t.street),
    pickupHouseNumber: z.string().trim().min(1, t.houseNumber),
    pickupPostalCode: z.string().trim().min(1, t.postalCode),
    pickupCity: z.string().trim().min(1, t.city),
    pickupState: z.string().optional(),
    dropoffStreet: z.string().trim().min(1, t.street),
    dropoffHouseNumber: z.string().trim().min(1, t.houseNumber),
    dropoffPostalCode: z.string().trim().min(1, t.postalCode),
    dropoffCity: z.string().trim().min(1, t.city),
    dropoffState: z.string().optional(),
  });
}

export type QuoteFormValues = z.infer<ReturnType<typeof createQuoteFormSchema>>;

export function createOrderFormSchema(t: ValidationMessages) {
  return createQuoteFormSchema(t).extend({
    cargoCategory: z.enum(cargoCategories),
    weightKg: z.coerce.number().positive(t.weight),
    pickupContactName: z.string().trim().min(1, t.contactPerson),
    pickupPhone: z.string().trim().min(1, t.phone),
    dropoffContactName: z.string().trim().min(1, t.contactPerson),
    dropoffPhone: z.string().trim().min(1, t.phone),
    specialInstructions: z.string().optional(),
    paymentMethod: z.enum(paymentMethods),
    externalReference: z.string().optional(),
  });
}

/** Builds the single-line address string the API geocodes. */
export function composeAddress(parts: {
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  state?: string;
}) {
  const street = `${parts.street?.trim() ?? ""} ${parts.houseNumber?.trim() ?? ""}`.trim();
  const city = `${parts.postalCode?.trim() ?? ""} ${parts.city?.trim() ?? ""}`.trim();
  return [street, city, parts.state?.trim()].filter((part) => Boolean(part)).join(", ");
}

export type OrderFormValues = z.infer<ReturnType<typeof createOrderFormSchema>>;
