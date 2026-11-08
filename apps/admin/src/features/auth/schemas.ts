// Zod schemas shared by auth forms.
//
// The schemas are built from the translated validation messages, so an error
// below a field is shown in the same language as the rest of the page.
import { z } from "zod";
import type { ValidationMessages } from "@/content/app/types";

export function isStrongPassword(password: string) {
  return password.length >= 12 && password.length <= 72 &&
    new TextEncoder().encode(password).length <= 72 &&
    /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) &&
    Array.from(password).some(c => c >= "!" && c <= "~" && !/[A-Za-z0-9]/.test(c)) &&
    !/[\s\u0085]/u.test(password);
}

function strongPassword(t: ValidationMessages) {
  return z.string().refine(isStrongPassword, t.passwordPolicy);
}

export function createLoginSchema(t: ValidationMessages) {
  return z.object({
    email: z.string().email(t.email),
    password: z.string().min(8, t.password),
  });
}

export function createRegisterClientSchema(t: ValidationMessages) {
  return z.object({
    companyName: z.string().min(2, t.companyName),
    contactPerson: z.string().min(2, t.contactPerson),
    email: z.string().email(t.email),
    password: strongPassword(t),
    phone: z.string().min(3, t.phone),
    street: z.string().min(3, t.street),
    city: z.string().min(2, t.city),
    postalCode: z.string().min(3, t.postalCode),
    country: z.string().min(2, t.country),
    taxIdNumber: z.string().optional(),
  });
}

export function createRegisterDriverSchema(t: ValidationMessages) {
  return z.object({
    fullName: z.string().min(2, t.fullName),
    email: z.string().email(t.email),
    password: strongPassword(t),
    phone: z.string().min(3, t.phone),
    vehicleDescription: z.string().optional(),
  });
}

export function createForgotPasswordSchema(t: ValidationMessages) {
  return z.object({ email: z.string().trim().max(255, t.email).email(t.email) });
}

export function createResetPasswordSchema(t: ValidationMessages) {
  return z.object({
    password: strongPassword(t),
    confirmPassword: z.string(),
  }).refine(values => values.password === values.confirmPassword, {
    message: t.passwordConfirmation,
    path: ["confirmPassword"],
  });
}

export type ForgotPasswordValues = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
export type ResetPasswordValues = z.infer<ReturnType<typeof createResetPasswordSchema>>;

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterClientValues = z.infer<ReturnType<typeof createRegisterClientSchema>>;
export type RegisterDriverValues = z.infer<ReturnType<typeof createRegisterDriverSchema>>;
