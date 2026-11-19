# Application HQ

A private, single-file tracker for **fellowships, fully funded events, scholarships, master's programmes and grants**, for you and for the organisation you run.

It runs entirely in your browser. There's no account, no server and no tracking: your data stays on your device, and the app makes no internet requests at all. See [SECURITY.md](SECURITY.md).

## Features

- **Guided setup:** tell it about yourself, what you're looking for, and every organisation you apply for (with its registration status)
- **Your own scout:** builds a personal prompt for an AI assistant to find opportunities on *your* schedule, either fixed weekdays or your own dates for shift work and changing rotas
- **Calendar reminders:** one click adds your deadlines to Google Calendar, Outlook or Apple Calendar, with alerts 7, 3 and 1 days before and on the day
- **How to apply & requirements** for each opportunity, plus essay boxes holding the real questions with outlines or sample drafts
- **Tracker table** with status, deadline countdown, funding, fit and document progress
- **"Needs your attention" rail** showing everything due in the next 21 days
- **Deadlines view** grouped by month, plus a list of programmes that haven't opened yet
- **Documents checklist** for each application
- **Essay workspace** with word limits, a "final" lock, Word (.docx) download and copy to clipboard
- **AI prompt buttons** that copy a ready-made drafting or feedback prompt, built from your own story, for any AI assistant (see [AI and honesty](#ai-and-honesty))
- **Apply as yourself or as an organisation**, with filters for each
- **Red-flag field** for fees, paid seats, AI bans or registration requirements
- **Updates feed** for new openings and changes you import
- **Export to Excel**, **Back up** to JSON and **Import** to restore or merge
- Light and dark mode, and works on phones

## Quick start

**Option A: just open it**

1. Download this repository (green **Code** button → **Download ZIP**) and unzip it.
2. Double-click `index.html`. It opens in your browser.
3. Click **Set up my tracker** and fill in the **Setup & scout** tab (about 5 minutes).
4. Optional: click **Load example entries** on the Tracker tab to look around, then delete them.

**Option B: host it free on GitHub Pages**

1. Fork this repository.
2. In your fork, go to **Settings → Pages**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then **Save**.
3. After a minute your tracker is live at `https://<your-username>.github.io/application-hq/`.

The hosted page is public, but your data isn't. Each visitor's data is stored only in their own browser. For safety, host it on an account or domain that publishes nothing else, because sites under the same `username.github.io` address can read each other's browser storage (see [SECURITY.md](SECURITY.md)).

**Make it feel like an app:** in Chrome, open the page and choose **⋮ → Cast, save and share → Create shortcut → Open as window**. In Edge, choose **⋯ → Apps → Install this site as an app**.

## Your data

- Everything is saved automatically in your browser's local storage, on that device only.
- **Back up often.** Clearing browser data, or using a private window, erases it. **Back up** downloads a JSON file with everything.
- **Moving devices:** back up on one device, then **Import** the file on the other.
- **Import** accepts a full backup (you can replace everything or merge it in), or any JSON file of opportunities in the format below.

## Importing opportunities

A file can contain `apps`, `feed` or both. See [`examples/import-example.json`](examples/import-example.json).

| Field | Notes |
|---|---|
| `id` | Short unique id, e.g. `example-fellowship-2027`. Used to match on re-import. |
| `name` | Required. |
| `org`, `location`, `funding`, `fee`, `eligibility`, `notes` | Free text. |
| `applicant` | `"Me"` or the name of your organisation. New names are added automatically. |
| `category` | `Fully funded event`, `Fellowship`, `Master's / school`, `Scholarship`, `Training / certification`, `Grant / award`, `Org grant / CSR` |
| `status` | `Watching`, `Not started`, `In progress`, `Applied`, `Interview`, `Accepted`, `Rejected`, `Missed`, `Not pursuing` |
| `deadline` | `YYYY-MM-DD`, or empty if unconfirmed. |
| `deadlineNote`, `opens`, `eventDates` | Free text, e.g. "Closes 23:59 UTC". |
| `link` | The official page. |
| `fit` | `High`, `Medium` or `Low`. |
| `warning` | Red flags: fees, AI bans, registration requirements. |
| `documents` | List of strings, e.g. `["CV", "Passport"]`. |
| `howToApply` | Steps, portal, required uploads, written questions, eligibility gotchas and AI policy. |
| `essays` | List of `{ "title", "prompt" (the exact question), "limit", "text", "guide" (outline or tips), "sample" (true if `text` is a sample draft) }`. Only used when you have no essays for that opportunity yet. |

When you re-import an opportunity you already track, **your own work is kept**: its status, essays, ticked documents and applied date. Only the details in the file are updated.

## Your scout and reminders (works for any schedule)

Application HQ runs entirely in your browser, so it can't search the web or send notifications by itself. Instead:

**The scout** is any AI assistant that can browse the web, ideally one that can also run scheduled tasks (for example Claude or ChatGPT).

1. In **Setup & scout → 4. Your scout & reminders**, choose when it should run:
   - **The same days every week:** pick days and a time, e.g. Mondays and Thursdays at 08:30.
   - **My own dates:** for shift workers or changing schedules. Use the **shift calendar**:
     1. Pick the month and choose a photo or screenshot of your rota (it stays on your device).
     2. Click **Copy rota prompt**, paste it into your AI assistant and attach the same photo. It replies with one line per day, e.g. `2026-12-01 Day`.
     3. Paste the reply and click **Read reply**. Your month appears as a calendar (☀ day, ☾ night, ⌂ off). Tap any day to correct it, or skip the photo and tap the days in yourself.
     4. Set your times, e.g. scout at 08:30 on day shifts and 20:30 on night shifts, reminders at 08:30 on off days. Then click **Use these dates**.
     Do this again each time you get a new rota.
2. Click **Copy scout prompt**. It's built from your profile, interests, organisations and schedule.
3. Paste it into your assistant and ask it to set it up as a scheduled task. Attach your latest **Back up** file so it knows what you already track.
4. Each run, it replies with a summary and a JSON file. Save the file and click **Import** to add the new opportunities, requirements and essay prep. Your statuses, essays and ticked documents are never overwritten.

**What's automatic and what isn't**

| Automatic | Your part |
|---|---|
| The assistant runs on your schedule, searches, checks official pages, flags red flags, writes how-to-apply notes and essay outlines or sample drafts | Click **Import** with the file it gives you (it can't write into your browser) |
| Your tracker updates its countdowns, alerts and deadlines view as soon as you import | Re-download the calendar file after importing, so your phone reminders include new deadlines |
| Re-imports never overwrite your statuses, essays or ticked documents | Every few weeks, attach a fresh **Back up** to your assistant so it knows what you've already added |
| | When your rota changes, update the shift calendar and give your assistant the new scout prompt |

**Reminders** come from your own calendar app. Click **Add deadlines to my calendar (.ics)** and open the file. Each deadline gets alerts 7 days, 3 days and 1 day before, and on the day. Do it again after each import to pick up new deadlines.

People with a regular job can pick fixed weekdays. Shift workers can use their own dates, and anyone can change the schedule at any time.

### Prefer to write your own scout prompt?

The app's **Copy scout prompt** button is the easiest way. [`docs/ai-scout-prompt.md`](docs/ai-scout-prompt.md) has a generic version you can edit by hand. It's a prompt you can give any AI assistant that can browse the web. It searches for opportunities that fit you, checks each one on its official page, flags fees and other red flags, and replies with a JSON file you can import.

## AI and honesty

Many programmes discourage or ban AI-written essays, and reviewers can often tell. Application HQ is built around that:

- Your scout is told to use **only facts from your own story**, and to write `[ADD: …]` instead of inventing anything.
- When a programme bans, discourages or detects AI writing, the scout gives you **an outline with talking points only**, and you write the sentences.
- Otherwise it can add a **sample draft**, clearly labelled "Sample draft · edit to make it yours". Rewrite it in your own words before you submit.
- The **Copy draft prompt** and **Copy feedback prompt** buttons on each essay work with any assistant. If an opportunity's red-flags field mentions AI, only the feedback prompt is offered.

Use AI to sharpen your own words, not to invent experience.

## Security and internet use

- The app works fully offline and makes **no internet requests**. A Content Security Policy blocks it from contacting any server.
- Word and Excel downloads are built on your device with [JSZip](https://stuk.github.io/jszip/) 3.10.1 (MIT), which is bundled inside `index.html`.
- Imported files are cleaned before use, only real `https://` links are clickable, and Excel exports never contain formulas.
- Read [SECURITY.md](SECURITY.md) for how to keep your data safe, especially on shared computers and when hosting on GitHub Pages.

## Troubleshooting

- **My data disappeared:** your browser's storage was cleared, or you opened the page in a private window or a different browser. Import your latest **Back up** file.
- **Import says the file isn't valid:** ask your assistant to reply with only the JSON, or copy just the part from `{` to the last `}` into a new `.json` file.
- **The scout suggests things I already track:** attach a fresh **Back up** file to your assistant. Duplicates are merged on import anyway.
- **Reminders didn't arrive:** open the downloaded `.ics` file so it's added to your calendar app, and make sure notifications are on for that calendar.
- **Excel or Word download doesn't work:** try another browser, and check that downloads aren't blocked for the page.

## Contributing

Issues and pull requests are welcome, especially translations, accessibility fixes and new import formats.

The app you download is a single `index.html`, built from the source in `src/` by a small script. To work on it:

```sh
npm install
npx playwright install chromium
npm run build   # rebuild index.html from src/
npm test        # browser tests, including the security tests
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the project layout and guidelines.

## Credits

Created by Patricia Serwaa Kodie Agyekum ([@tricia-ships-it](https://github.com/tricia-ships-it)), founder of Obaa Cyber Corps, to help people find and win fully funded opportunities.

## Licence

[MIT](LICENSE)
