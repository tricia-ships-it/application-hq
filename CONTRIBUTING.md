# Contributing

Thanks for helping improve Application HQ. Bug reports, translations, accessibility fixes and new import formats are all welcome.

## Project layout

```
src/index.html    page markup (with @inline markers)
src/styles.css    styles
src/app.js        application code
vendor/           third-party code bundled into the page (JSZip)
scripts/build.mjs builds index.html from src/
tests/            browser tests (Playwright + node:test)
index.html        the built app: this is what people download and open
```

`index.html` is generated, so don't edit it directly.

## Getting started

```sh
npm install
npx playwright install chromium
npm run build      # rebuild index.html after changing anything in src/
npm test           # run the browser tests
npm run lint
npm run format
```

CI runs lint, a formatting check, `npm run build:check` (to make sure `index.html` matches `src/`) and the tests on every pull request.

## Guidelines

- Keep the app dependency-free at runtime and fully offline. It must make no network requests.
- Never render imported or user text as HTML. Build elements with the `el()` helper and set text with `text`.
- Only turn `https://` URLs into links.
- Add a test for any fix or feature, especially anything touching import, export or links.
- Report security issues privately: see [SECURITY.md](SECURITY.md).
