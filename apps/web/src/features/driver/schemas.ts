// Form schema for proof of delivery submission.
import { z } from "zod";
import type { ValidationMessages } from "@/content/app/types";

export function createPodSchema(t: ValidationMessages) {
  return z.object({
    recipientName: z.string().min(2, t.recipientName),
  });
}

export type PodFormValues = z.infer<ReturnType<typeof createPodSchema>>;
