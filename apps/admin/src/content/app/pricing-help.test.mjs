import assert from "node:assert/strict";
import test from "node:test";
import { pricingHelp } from "./pricing-help.ts";

test("both guide languages expose the same unique anchor targets", () => {
  const ids = pricingHelp.en.sections.map((section) => section.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(pricingHelp.de.sections.map((section) => section.id), ids);
  for (const guide of Object.values(pricingHelp)) {
    for (const section of guide.sections) {
      assert.ok(section.title.length > 0);
      assert.ok(section.paragraphs?.length || section.entries?.length || section.table);
      for (const row of section.table?.rows ?? []) {
        assert.equal(row.length, section.table.headers.length, section.id);
      }
      for (const entry of section.entries ?? []) {
        if (entry.href) assert.match(entry.href, /^\/pricing(?:\/[a-z-]+)?$/);
      }
    }
  }
});
