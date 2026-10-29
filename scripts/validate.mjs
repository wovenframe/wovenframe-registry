#!/usr/bin/env node
// WovenFrame registry — validates templates.json with plain checks (no deps).
// Used by CI on every pull request; also safe to run locally:
//   node scripts/validate.mjs

import fs from "node:fs/promises";

const FILE = process.argv[2] || "templates.json";
const REQUIRED = ["id", "name", "description", "author", "repo", "license", "submittedAt"];
const errors = [];

const raw = await fs.readFile(FILE, "utf8");
let data;
try {
  data = JSON.parse(raw.replace(/^\uFEFF/, ""));
} catch (err) {
  console.error(`✗ cannot parse ${FILE}: ${err.message}`);
  process.exit(1);
}

const fail = (msg) => errors.push(msg);

if (data.schemaVersion !== 1) fail("schemaVersion must be 1");
if (!Array.isArray(data.templates)) fail("templates must be an array");

const seenId = new Set();
const seenRepo = new Set();

for (const [i, t] of (data.templates || []).entries()) {
  const where = `templates[${i}]`;
  if (!t || typeof t !== "object") {
    fail(`${where}: not an object`);
    continue;
  }
  for (const key of REQUIRED) {
    if (t[key] === undefined || t[key] === null || t[key] === "") {
      fail(`${where}: missing "${key}"`);
    }
  }
  if (typeof t.id === "string") {
    if (!/^[a-z0-9][a-z0-9._-]{2,127}$/.test(t.id)) fail(`${where}: bad id "${t.id}"`);
    if (seenId.has(t.id)) fail(`${where}: duplicate id "${t.id}"`);
    seenId.add(t.id);
  }
  if (typeof t.repo === "string") {
    if (!/^[^/]+\/[^/]+$/.test(t.repo)) fail(`${where}: bad repo "${t.repo}"`);
    if (seenRepo.has(t.repo.toLowerCase())) fail(`${where}: duplicate repo "${t.repo}"`);
    seenRepo.add(t.repo.toLowerCase());
  }
  if (t.author && typeof t.author.name !== "string") fail(`${where}: author.name must be a string`);
  if (t.tags && (!Array.isArray(t.tags) || t.tags.length > 8)) fail(`${where}: tags must be array (max 8)`);
  if (t.status && !["active", "deprecated", "blocked"].includes(t.status)) fail(`${where}: bad status "${t.status}"`);
  if (t.stars !== undefined && (!Number.isInteger(t.stars) || t.stars < 0)) fail(`${where}: bad stars`);
  if (t.downloads !== undefined && (!Number.isInteger(t.downloads) || t.downloads < 0)) fail(`${where}: bad downloads`);
  if (t.views !== undefined && (!Number.isInteger(t.views) || t.views < 0)) fail(`${where}: bad views`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s) in ${FILE}:`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✓ ${FILE}: ${(data.templates || []).length} template(s), all checks passed`);
