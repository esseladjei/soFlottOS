import assert from "node:assert/strict";
import test from "node:test";
import { publicRegistrationSchema } from "./public-registration.ts";

const payload = {
  companyName: "Example", contactPerson: "Example", email: "customer@example.com",
  password: "Example1!", phone: "123", street: "Example 1", city: "Berlin",
  postalCode: "10115", country: "Deutschland", taxIdNumber: null,
};

test("public registration accepts only the client role and a client payload", () => {
  assert.equal(publicRegistrationSchema.safeParse({ role: "Client", payload }).success, true);
  for (const role of ["Driver", "Admin", "", null, undefined]) {
    assert.equal(publicRegistrationSchema.safeParse({ role, payload }).success, false);
  }
  assert.equal(publicRegistrationSchema.safeParse({ role: "Client", payload: null }).success, false);
  assert.equal(publicRegistrationSchema.safeParse(null).success, false);
});
