import assert from "node:assert/strict";
import test from "node:test";
import { activeGroup, matchesPath } from "./navigation.ts";

const nav = [
  { id: "operations", label: "Operations", paths: ["/orders"], items: [
    { href: "/", label: "Dashboard" },
    { href: "/orders/new", label: "New order" },
    { href: "/availability", label: "Availability" },
  ] },
  { id: "people", label: "People", items: [
    { href: "/clients", label: "Clients" },
    { href: "/drivers", label: "Drivers" },
  ] },
  { id: "billing", label: "Billing", items: [{ href: "/invoices", label: "Invoices" }] },
];

test("groups follow feature routes and their detail pages", () => {
  for (const [pathname, expected] of [
    ["/", "operations"], ["/orders/new", "operations"], ["/orders/42", "operations"],
    ["/availability", "operations"], ["/clients", "people"], ["/clients/42", "people"],
    ["/drivers", "people"], ["/invoices/42", "billing"],
  ]) {
    assert.equal(activeGroup(nav, pathname), expected, pathname);
  }
  assert.equal(activeGroup(nav, "/unknown"), undefined);
});

test("current links respect path boundaries and do not mark the dashboard on other pages", () => {
  assert.equal(matchesPath("/", "/"), true);
  assert.equal(matchesPath("/orders/42", "/"), false);
  assert.equal(matchesPath("/clients/42", "/clients"), true);
  assert.equal(matchesPath("/clients-extra", "/clients"), false);
  assert.equal(matchesPath("/orders/42", "/orders/new"), false);
});
