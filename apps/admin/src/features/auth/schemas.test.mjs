import assert from "node:assert/strict";
import test from "node:test";
import { en } from "../../content/app/en.ts";
import { de } from "../../content/app/de.ts";
import {
  createForgotPasswordSchema,
  createLoginSchema,
  createRegisterClientSchema,
  createRegisterDriverSchema,
  createResetPasswordSchema,
  isStrongPassword,
} from "./schemas.ts";

test("new passwords enforce each requirement and exact BCrypt byte boundaries", () => {
  for (const password of [
    "Short1!", "lowercase123!", "UPPERCASE123!", "NoDigitsHere!", "NoSymbols1234",
    "Has Spaces123!", "Has\tTabs123!", "UnicodeSymbol123€",
    `Aa1!${"x".repeat(69)}`, `Aa1!${"ä".repeat(35)}`,
    "Has\u0085Space123!", "Has\uFEFFSpace123!",
  ]) {
    assert.equal(isStrongPassword(password), false, password);
  }
  assert.equal(isStrongPassword(`Aa1!${"x".repeat(7)}`), false);
  for (const password of [
    `Aa1!${"x".repeat(8)}`, `Aa1!${"x".repeat(68)}`, `Aa1!${"ä".repeat(34)}`,
  ]) {
    assert.equal(isStrongPassword(password), true, password);
  }
});

test("all new-password forms use the localized policy, but legacy login remains unchanged", () => {
  for (const content of [en, de]) {
    for (const schema of [
      createRegisterClientSchema(content.validation).shape.password,
      createRegisterDriverSchema(content.validation).shape.password,
      createResetPasswordSchema(content.validation).shape.password,
    ]) {
      const result = schema.safeParse("Secret123!");
      assert.equal(result.success, false);
      assert.equal(result.error.issues[0].message, content.validation.passwordPolicy);
      assert.equal(schema.safeParse("StrongPassword123!").success, true);
    }
    assert.equal(createLoginSchema(content.validation).safeParse({
      email: "account@example.com", password: "Secret123!",
    }).success, true);
  }
});

test("password confirmation is localized and forgot-password normalizes and bounds email", () => {
  for (const content of [en, de]) {
    const reset = createResetPasswordSchema(content.validation);
    const mismatch = reset.safeParse({ password: "StrongPassword123!", confirmPassword: "DifferentPassword123!" });
    assert.equal(mismatch.success, false);
    assert.equal(mismatch.error.issues[0].message, content.validation.passwordConfirmation);
    assert.equal(reset.safeParse({ password: "StrongPassword123!", confirmPassword: "StrongPassword123!" }).success, true);
    const forgot = createForgotPasswordSchema(content.validation);
    assert.deepEqual(forgot.parse({ email: " account@example.com " }), { email: "account@example.com" });
    assert.equal(forgot.safeParse({ email: "invalid" }).success, false);
    assert.equal(forgot.safeParse({ email: `${"a".repeat(250)}@example.com` }).success, false);
  }
});
