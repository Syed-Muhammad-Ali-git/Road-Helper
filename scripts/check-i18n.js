"use strict";

const fs = require("fs");
const path = require("path");

const DICT_DIR = path.join(__dirname, "..", "dictionaries");
const LOCALES = ["en", "ur", "rm"];

/**
 * Recursively collect all dotted keys from an object (leaf values only).
 * @param {object} obj
 * @param {string} prefix
 * @returns {Set<string>}
 */
function flatKeys(obj, prefix = "") {
  const keys = new Set();
  if (obj === null || typeof obj !== "object") {
    if (prefix) keys.add(prefix);
    return keys;
  }
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      flatKeys(v, key).forEach((kk) => keys.add(kk));
    } else {
      keys.add(key);
    }
  }
  return keys;
}

function loadJson(name) {
  const filePath = path.join(DICT_DIR, `${name}.json`);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    console.error(`Failed to load ${filePath}:`, e.message);
    process.exit(2);
  }
}

function main() {
  const sets = {};
  for (const locale of LOCALES) {
    sets[locale] = flatKeys(loadJson(locale));
  }

  const reference = sets.en;
  let hasMissing = false;

  for (const locale of ["ur", "rm"]) {
    const missing = [...reference].filter((k) => !sets[locale].has(k));
    const extra = [...sets[locale]].filter((k) => !reference.has(k));
    if (missing.length) {
      hasMissing = true;
      console.error(`[${locale}] Missing keys (in en, not in ${locale}):`);
      missing.sort().forEach((k) => console.error(`  - ${k}`));
    }
    if (extra.length) {
      console.warn(`[${locale}] Extra keys (in ${locale}, not in en):`);
      extra.sort().forEach((k) => console.warn(`  + ${k}`));
    }
  }

  if (hasMissing) {
    process.exit(1);
  }
  console.log("i18n check OK: en, ur, rm have the same key set.");
}

main();
