import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

export const APP_URL = pathToFileURL(resolve(import.meta.dirname, "..", "index.html")).href;

/**
 * Opens the app in a fresh browser context and records anything suspicious:
 * page errors, alert/confirm dialogs, CSP violations and network requests.
 */
export async function openApp() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  const log = { errors: [], dialogs: [], cspViolations: [], externalRequests: [] };

  page.on("pageerror", (err) => log.errors.push(err.message));
  page.on("dialog", (dialog) => {
    log.dialogs.push(dialog.message());
    dialog.dismiss();
  });
  page.on("console", (msg) => {
    if (/Content Security Policy/i.test(msg.text())) log.cspViolations.push(msg.text());
  });
  page.on("request", (req) => {
    if (!/^(file|blob|data):/.test(req.url())) log.externalRequests.push(req.url());
  });

  await page.goto(APP_URL);
  return { browser, page, log };
}

export async function importJson(page, data, name = "import.json") {
  const buffer = Buffer.from(typeof data === "string" ? data : JSON.stringify(data));
  await page.setInputFiles("#importFile", { name, mimeType: "application/json", buffer });
  await page.waitForTimeout(150);
}

export async function download(page, trigger) {
  const [file] = await Promise.all([page.waitForEvent("download"), trigger()]);
  return file.path();
}

export const storedState = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("application-hq:v1") || "{}"));
