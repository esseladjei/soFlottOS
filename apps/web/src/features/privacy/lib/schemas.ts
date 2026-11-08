// Validation of what the browser sends to the privacy route handlers.
// Strict on purpose: unknown fields are dropped, so nothing unexpected reaches the API.

import { z } from "zod";

const guid = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

export const consentEvidenceSchema = z.object({
  id: guid,
  previousId: guid.nullish(),
  version: z.string().trim().min(1).max(20),
  action: z.enum(["AcceptAll", "RejectOptional", "Custom"]),
  analytics: z.boolean(),
  marketing: z.boolean(),
  preferences: z.boolean(),
});

export const privacyRequestTypes = ["Access", "Deletion", "Correction", "Export", "Restriction", "Objection"] as const;

export const privacyRequestSchema = z.object({
  type: z.enum(privacyRequestTypes),
  email: z.string().trim().max(254).email(),
  fullName: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((value) => value || undefined),
  message: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((value) => value || undefined),
  locale: z.enum(["de", "en"]).default("de"),
});

export const privacyReferenceSchema = guid;

export type PrivacyRequestInput = z.input<typeof privacyRequestSchema>;
