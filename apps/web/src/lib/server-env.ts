import "server-only";
import { z } from "zod";

const envSchema = z.object({
  SOFLOTT_API_BASE_URL: z.string().url().default("http://localhost:5235"),
});

export const serverEnv = envSchema.parse({
  SOFLOTT_API_BASE_URL: process.env.SOFLOTT_API_BASE_URL,
});
