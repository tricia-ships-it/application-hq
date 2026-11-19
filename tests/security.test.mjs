import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { openApp, importJson, download } from "./helpers.mjs";

const require = createRequire(import.meta.url);

const HOSTILE = {
  apps: [
    {
      id: "hostile",
      name: '<img src=x onerror=alert("name")>',
      org: "<script>alert('org')</script>",
      link: "javascript:alert('link')",
      status: "Not started",
      deadline: "2099-12-20",
      notes: '=HYPERLINK("https://example.com","click")',
      howToApply: "<b onmouseover=alert('howto')>hover</b>",
      documents: ["<i onclick=alert('doc')>doc</i>"],
      essays: [
        {
          title: "<svg onload=alert('essay')>",
          guide: "<img src=x onerror=alert('guide')>",
          text: "t",
        },
      ],
    },
  ],
  feed: [
    {
      title: "<img src=x onerror=alert('feed')>",
      link: "javascript:alert('feed-link')",
      type: "new",
    },
  ],
};

test("hostile imports are rendered as inert text", async () => {
  const { browser, page, log } = await openApp();
  try {
    await importJson(page, HOSTILE);
    await page.locator("#rows tr .nm").first().click();
    await page.keyboard.press("Escape");
    await page.click("#tab-feed");

    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll("a[href]")].map((a) => a.href)
    );
    assert.equal(log.dialogs.length, 0, `a script ran: ${log.dialogs}`);
    assert.ok(
      hrefs.every((href) => !href.startsWith("javascript:")),
      "javascript: link rendered"
    );
    assert.equal(
      await page.locator("img[src='x']").count(),
      0,
      "injected markup was parsed as HTML"
    );
    assert.deepEqual(log.errors, []);
  } finally {
    await browser.close();
  }
});

test("prototype pollution through imported keys has no effect", async () => {
  const { browser, page } = await openApp();
  try {
    await importJson(page, { apps: [{ id: "base", name: "Base" }] });
    const raw =
      '{"apps":[{"id":"base","name":"Base","__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted":"yes"}}}]}';
    await importJson(page, raw);
    assert.equal(await page.evaluate(() => ({}).polluted), undefined);
  } finally {
    await browser.close();
  }
});

test("the page makes no network requests and the CSP blocks injected scripts", async () => {
  const { browser, page, log } = await openApp();
  try {
    await page.click("#loadSample");
    const injectedRan = await page.evaluate(() => {
      window.__injected = false;
      const script = document.createElement("script");
      script.textContent = "window.__injected = true";
      document.body.append(script);
      return window.__injected;
    });
    assert.equal(injectedRan, false, "an injected inline script executed");
    assert.deepEqual(log.externalRequests, []);
  } finally {
    await browser.close();
  }
});

test("exports never contain spreadsheet formulas or calendar injection", async () => {
  const { browser, page } = await openApp();
  try {
    const hostile = structuredClone(HOSTILE);
    hostile.apps[0].link = "https://example.org/a\r\nATTENDEE:mailto:attacker@example.com";
    await importJson(page, hostile);

    const xlsxPath = await download(page, () => page.click("#exportXlsx"));
    const JSZip = require("jszip");
    const zip = await JSZip.loadAsync(await readFile(xlsxPath));
    const sheet = await zip.file("xl/worksheets/sheet1.xml").async("string");
    assert.ok(!/<f>/.test(sheet), "xlsx contains a formula cell");

    await page.click("#tab-profile");
    const icsPath = await download(page, () => page.click("#icsBtn"));
    const ics = await readFile(icsPath, "utf8");
    assert.ok(!/^ATTENDEE/m.test(ics), "calendar file accepted an injected property");
  } finally {
    await browser.close();
  }
});

test("oversized and malformed imports are rejected", async () => {
  const { browser, page, log } = await openApp();
  try {
    await importJson(page, "{not json");
    assert.match(await page.textContent("#toast"), /isn't valid/);
    assert.deepEqual(log.errors, []);
  } finally {
    await browser.close();
  }
});
