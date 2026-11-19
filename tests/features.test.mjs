import { test } from "node:test";
import assert from "node:assert/strict";
import { openApp, importJson, storedState } from "./helpers.mjs";

test("first run shows the welcome banner and setup persists", async () => {
  const { browser, page, log } = await openApp();
  try {
    assert.ok(await page.isVisible("#welcome"));
    await page.click("#startSetup");
    await page.fill("#p-name", "Ama Mensah");
    await page.fill("#newApplicant", "Safe Girls Club");
    await page.selectOption("#newOrgReg", "Not registered");
    await page.click("#addApplicant");
    await page.waitForTimeout(700);
    await page.reload();

    const state = await storedState(page);
    assert.equal(state.profile.name, "Ama Mensah");
    assert.equal(state.settings.orgs[0].name, "Safe Girls Club");
    assert.match(await page.inputValue("#scoutPrompt"), /Safe Girls Club.*NOT legally registered/s);
    assert.deepEqual(log.errors, []);
  } finally {
    await browser.close();
  }
});

test("re-importing keeps the user's own status, essays and ticked documents", async () => {
  const { browser, page } = await openApp();
  try {
    await importJson(page, {
      apps: [
        { id: "x", name: "Example", documents: ["CV"], essays: [{ title: "Q1", text: "mine" }] },
      ],
    });
    await page.locator("#rows tr select").first().selectOption("Applied");
    await importJson(page, {
      apps: [
        {
          id: "x",
          name: "Example",
          status: "Not started",
          funding: "Updated",
          essays: [{ title: "Q1", text: "scout" }],
        },
      ],
    });

    const app = (await storedState(page)).apps.find((a) => a.id === "x");
    assert.equal(app.status, "Applied");
    assert.equal(app.funding, "Updated");
    assert.equal(app.essays[0].text, "mine");
  } finally {
    await browser.close();
  }
});

test("a rota reply becomes scout and reminder dates", async () => {
  const { browser, page } = await openApp();
  try {
    await page.click("#tab-profile");
    await page.click("input[name=smode][value=dates]");
    await page.fill("#sh-reply", "2026-12-01 Day\n2026-12-02 Night\n2026-12-03 Off\n2026-12-04 ?");
    await page.click("#sh-read");
    await page.click("#sh-apply");

    assert.equal(await page.inputValue("#s-full"), "1 Dec 2026 08:30, 2 Dec 2026 20:30");
    assert.equal(await page.inputValue("#s-rem"), "3 Dec 2026 08:30");
  } finally {
    await browser.close();
  }
});
