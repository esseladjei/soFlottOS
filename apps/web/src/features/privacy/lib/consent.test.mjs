import assert from "node:assert/strict";
import test from "node:test";
import {
  ACCEPT_ALL,
  CONSENT_MAX_AGE_SECONDS,
  CONSENT_VERSION,
  NO_CONSENT,
  actionFor,
  createConsentState,
  isAllowed,
  parseConsent,
  peekConsentId,
  serializeConsent,
} from "./consent-model.ts";
import { DENIED_BY_DEFAULT, toGoogleConsent } from "./google-consent.ts";
import { consentEvidenceSchema, privacyRequestSchema } from "./schemas.ts";

const ID = "3f2b8c1e-5d4a-4e6f-9a7b-1c2d3e4f5a6b";
const NOW = new Date("2026-11-08T12:00:00.000Z");

test("no stored value means no consent", () => {
  assert.equal(parseConsent(undefined), null);
  assert.equal(parseConsent(null), null);
  assert.equal(parseConsent(""), null);
  assert.equal(isAllowed(null, "analytics"), false);
  assert.equal(isAllowed(undefined, "marketing"), false);
});

test("a saved decision round-trips through the cookie value", () => {
  const state = createConsentState({ analytics: true, marketing: false, preferences: true }, ID, NOW);
  const parsed = parseConsent(serializeConsent(state), NOW.getTime());
  assert.deepEqual(parsed, state);
  assert.equal(isAllowed(parsed, "analytics"), true);
  assert.equal(isAllowed(parsed, "marketing"), false);
  assert.equal(isAllowed(parsed, "preferences"), true);
});

test("tampered, malformed or incomplete cookie values are rejected", () => {
  const good = createConsentState(ACCEPT_ALL, ID, NOW);
  const encode = (value) => encodeURIComponent(JSON.stringify(value));
  const reject = (value) => assert.equal(parseConsent(typeof value === "string" ? value : encode(value), NOW.getTime()), null);

  reject("{not json");
  reject("null");
  reject("[]");
  reject({ ...good, id: "not-a-guid" });
  reject({ ...good, necessary: false });
  reject({ ...good, analytics: "yes" });
  reject({ ...good, marketing: undefined });
  reject({ ...good, updatedAt: "yesterday" });
});

test("a decision made under another notice version is ignored", () => {
  const state = createConsentState(ACCEPT_ALL, ID, NOW);
  assert.equal(parseConsent(encodeURIComponent(JSON.stringify({ ...state, version: "0.9" })), NOW.getTime()), null);
  assert.equal(state.version, CONSENT_VERSION);
});

test("a decision expires after 180 days and cannot come from the future", () => {
  const state = createConsentState(ACCEPT_ALL, ID, NOW);
  const raw = serializeConsent(state);
  const almostExpired = NOW.getTime() + (CONSENT_MAX_AGE_SECONDS - 60) * 1000;
  const expired = NOW.getTime() + (CONSENT_MAX_AGE_SECONDS + 60) * 1000;
  assert.notEqual(parseConsent(raw, almostExpired), null);
  assert.equal(parseConsent(raw, expired), null);
  assert.equal(parseConsent(raw, NOW.getTime() - 60 * 60 * 1000), null);
});

test("the old decision id stays readable so evidence can be chained", () => {
  const stale = encodeURIComponent(JSON.stringify({ ...createConsentState(ACCEPT_ALL, ID, NOW), version: "0.9" }));
  assert.equal(parseConsent(stale, NOW.getTime()), null);
  assert.equal(peekConsentId(stale), ID);
  assert.equal(peekConsentId("garbage"), null);
  assert.equal(peekConsentId(undefined), null);
});

test("the recorded action reflects the choices", () => {
  assert.equal(actionFor(ACCEPT_ALL), "AcceptAll");
  assert.equal(actionFor(NO_CONSENT), "RejectOptional");
  assert.equal(actionFor({ analytics: true, marketing: false, preferences: false }), "Custom");
  assert.equal(actionFor({ analytics: false, marketing: true, preferences: true }), "Custom");
});

test("Google Consent Mode v2 is denied by default and follows the categories", () => {
  for (const [signal, value] of Object.entries(DENIED_BY_DEFAULT)) {
    assert.equal(value, signal === "security_storage" ? "granted" : "denied", signal);
  }

  const analyticsOnly = toGoogleConsent({ analytics: true, marketing: false, preferences: false });
  assert.equal(analyticsOnly.analytics_storage, "granted");
  assert.equal(analyticsOnly.ad_storage, "denied");
  assert.equal(analyticsOnly.ad_user_data, "denied");
  assert.equal(analyticsOnly.ad_personalization, "denied");

  const marketingOnly = toGoogleConsent({ analytics: false, marketing: true, preferences: false });
  assert.equal(marketingOnly.ad_storage, "granted");
  assert.equal(marketingOnly.ad_user_data, "granted");
  assert.equal(marketingOnly.ad_personalization, "granted");
  assert.equal(marketingOnly.analytics_storage, "denied");

  const preferencesOnly = toGoogleConsent({ analytics: false, marketing: false, preferences: true });
  assert.equal(preferencesOnly.functionality_storage, "granted");
  assert.equal(preferencesOnly.personalization_storage, "granted");
});

test("consent evidence accepts exactly what the API expects", () => {
  const valid = { id: ID, previousId: null, version: "1.0", action: "AcceptAll", analytics: true, marketing: true, preferences: true };
  assert.equal(consentEvidenceSchema.safeParse(valid).success, true);
  assert.equal(consentEvidenceSchema.safeParse({ ...valid, previousId: undefined }).success, true);
  assert.equal(consentEvidenceSchema.safeParse({ ...valid, previousId: ID }).success, true);
  assert.equal(consentEvidenceSchema.safeParse({ ...valid, action: "Maybe" }).success, false);
  assert.equal(consentEvidenceSchema.safeParse({ ...valid, id: "123" }).success, false);
  assert.equal(consentEvidenceSchema.safeParse({ ...valid, version: "x".repeat(21) }).success, false);
  assert.equal(consentEvidenceSchema.safeParse({ ...valid, analytics: "true" }).success, false);
});

test("consent evidence drops fields it does not know", () => {
  const parsed = consentEvidenceSchema.parse({
    id: ID,
    version: "1.0",
    action: "Custom",
    analytics: true,
    marketing: false,
    preferences: false,
    ipAddress: "203.0.113.7",
  });
  assert.equal("ipAddress" in parsed, false);
});

test("privacy requests validate type, email and optional text", () => {
  const ok = privacyRequestSchema.parse({ type: "Access", email: "  person@example.com ", fullName: "  ", message: "" });
  assert.equal(ok.email, "person@example.com");
  assert.equal(ok.fullName, undefined);
  assert.equal(ok.message, undefined);
  assert.equal(ok.locale, "de");

  assert.equal(privacyRequestSchema.safeParse({ type: "Delete", email: "person@example.com" }).success, false);
  assert.equal(privacyRequestSchema.safeParse({ type: "Access", email: "nope" }).success, false);
  assert.equal(privacyRequestSchema.safeParse({ type: "Access", email: "person@example.com", message: "x".repeat(2001) }).success, false);
  assert.equal(privacyRequestSchema.safeParse({ type: "Access", email: "person@example.com", locale: "fr" }).success, false);

  for (const type of ["Access", "Deletion", "Correction", "Export", "Restriction", "Objection"]) {
    assert.equal(privacyRequestSchema.safeParse({ type, email: "person@example.com" }).success, true, type);
  }
});
