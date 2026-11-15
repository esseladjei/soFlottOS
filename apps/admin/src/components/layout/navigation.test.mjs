import assert from "node:assert/strict";
import test from "node:test";
import { activeGroup, activeItem, matchesPath } from "./navigation.ts";

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
  { id: "pricing", label: "Cost & pricing", items: [
    { href: "/pricing", label: "Overview" },
    { href: "/pricing/costs", label: "Cost items" },
    { href: "/pricing/simulator", label: "Simulator" },
  ] },
  { id: "help", label: "Help", items: [{ href: "/help", label: "Costing & pricing guide" }] },
];

test("groups follow feature routes and their detail pages", () => {
  for (const [pathname, expected] of [
    ["/", "operations"], ["/orders/new", "operations"], ["/orders/42", "operations"],
    ["/availability", "operations"], ["/clients", "people"], ["/clients/42", "people"],
    ["/drivers", "people"], ["/invoices/42", "billing"],
    ["/pricing", "pricing"], ["/pricing/costs", "pricing"], ["/pricing/simulator", "pricing"],
    ["/help", "help"], ["/help/pricing", "help"],
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
  assert.equal(matchesPath("/pricing/costs", "/pricing"), true);
  assert.equal(matchesPath("/pricing", "/pricing/costs"), false);
  assert.equal(matchesPath("/helpful", "/help"), false);
});

test("the most specific link wins inside a group", () => {
  const items = nav[3].items;
  assert.equal(activeItem(items, "/pricing"), "/pricing");
  assert.equal(activeItem(items, "/pricing/costs"), "/pricing/costs");
  assert.equal(activeItem(items, "/pricing/audit"), "/pricing");
  assert.equal(activeItem(items, "/clients"), undefined);
  assert.equal(activeItem(nav[4].items, "/help"), "/help");
});
