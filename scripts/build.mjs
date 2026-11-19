// Builds the single-file app (index.html at the repo root) from src/.
//
// Everything is inlined so the app can be opened straight from disk with no
// server, and the Content Security Policy pins each inline script by its
// SHA-256 hash, so the browser refuses to run any script that isn't ours.
//
// Usage: node scripts/build.mjs [--check]
//   --check  exit with an error if index.html is out of date (used in CI)

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = resolve(root, "src");
const outFile = resolve(root, "index.html");

const read = (path) => readFileSync(path, "utf8");

function inlineAll(template) {
  // Replace `<tag>\s*/* @inline path */\s*</tag>` with the file's contents.
  return template.replace(
    /<(script|style)>\s*\/\* @inline (.+?) \*\/\s*<\/\1>/g,
    (_, tag, relPath) => {
      const content = read(resolve(srcDir, relPath)).trim();
      if (tag === "script" && /<\/script/i.test(content)) {
        throw new Error(`${relPath} contains "</script", which would break the page`);
      }
      return `<${tag}>\n${content}\n</${tag}>`;
    }
  );
}

function pinScripts(html) {
  const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
    ([, body]) => `'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`
  );
  if (!html.includes("script-src 'unsafe-inline'")) {
    throw new Error("Expected a script-src 'unsafe-inline' placeholder in the CSP");
  }
  return html.replace("script-src 'unsafe-inline'", `script-src ${hashes.join(" ")}`);
}

const banner =
  "<!-- Application HQ. Built from src/ by scripts/build.mjs: edit the files in src/, then run `npm run build`. -->\n";

const html = pinScripts(inlineAll(read(resolve(srcDir, "index.html")))).replace(
  /^<!doctype html>\n/i,
  (doctype) => doctype + banner
);

if (process.argv.includes("--check")) {
  const current = (() => {
    try {
      return read(outFile);
    } catch {
      return "";
    }
  })();
  if (current !== html) {
    console.error("index.html is out of date. Run `npm run build` and commit the result.");
    process.exit(1);
  }
  console.log("index.html is up to date.");
} else {
  writeFileSync(outFile, html);
  console.log(`Wrote ${outFile} (${(html.length / 1024).toFixed(0)} KB)`);
}
