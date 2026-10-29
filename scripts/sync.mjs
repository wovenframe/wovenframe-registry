#!/usr/bin/env node
// WovenFrame registry — star / download sync.
//
// Reads templates.json, asks the GitHub REST API for each template repo's
// stargazer count + latest release asset download count, and writes the file
// back only when something changed. Runs hourly via GitHub Actions.
//
// Usage:
//   node scripts/sync.mjs             # normal run (writes templates.json)
//   node scripts/sync.mjs --dry       # print what would change, no writes
//   node scripts/sync.mjs --file X    # use another index file (testing)
//
// Auth: GITHUB_TOKEN (Actions) or GH_TOKEN (local, optional but recommended).

import fs from "node:fs/promises";

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const fileArg = args.indexOf("--file");
const FILE = fileArg >= 0 ? args[fileArg + 1] : "templates.json";

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const headers = {
  accept: "application/vnd.github+json",
  "user-agent": "wovenframe-registry-sync",
  ...(token ? { authorization: `Bearer ${token}` } : {}),
};

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (res.status === 404) return null;
  if (!res.ok) {
    console.warn(`  ! HTTP ${res.status} for ${path}`);
    return null;
  }
  return res.json();
}

const raw = await fs.readFile(FILE, "utf8");
let data;
try {
  data = JSON.parse(raw.replace(/^\uFEFF/, ""));
} catch (err) {
  console.error(`${FILE}: invalid JSON — ${err.message}`);
  process.exit(1);
}
if (!Array.isArray(data.templates)) {
  console.error(`${FILE}: "templates" must be an array`);
  process.exit(1);
}

let changed = 0;
let missing = 0;

for (const t of data.templates) {
  if (!t || typeof t.repo !== "string" || !/^[^/]+\/[^/]+$/.test(t.repo)) {
    continue;
  }
  const repo = await api(`/repos/${t.repo}`);
  if (!repo) {
    missing++;
    console.log(`  - ${t.repo}: not found / unreachable`);
    continue;
  }
  const stars = Number.isFinite(repo.stargazers_count) ? repo.stargazers_count : 0;
  const lastPush = repo.pushed_at || null;

  let downloads = Number.isFinite(t.downloads) ? t.downloads : 0;
  const release = await api(`/repos/${t.repo}/releases/latest`);
  if (release && Array.isArray(release.assets)) {
    downloads = release.assets.reduce((sum, a) => sum + (Number(a.download_count) || 0), 0);
  }

  const next = { stars, downloads, lastPush };
  const before = { stars: t.stars ?? 0, downloads: t.downloads ?? 0, lastPush: t.lastPush ?? null };
  const isChanged =
    before.stars !== next.stars ||
    before.downloads !== next.downloads ||
    before.lastPush !== next.lastPush;

  if (isChanged) {
    Object.assign(t, next, { syncedAt: new Date().toISOString() });
    changed++;
    if (dry) {
      console.log(`  ~ ${t.id || t.repo}: stars ${before.stars} -> ${next.stars}, downloads ${before.downloads} -> ${next.downloads}`);
    }
  }
}

if (changed > 0) {
  data.generatedAt = new Date().toISOString();
  if (!dry) {
    await fs.writeFile(FILE, JSON.stringify(data, null, 2) + "\n");
  }
}

console.log(
  `sync: ${data.templates.length} template(s), ${changed} change(s), ${missing} missing${dry ? " (dry run)" : ""}`
);
