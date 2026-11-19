# Security and privacy

Application HQ is designed so your personal information never leaves your device unless you choose to share it.

## What the app does to protect you

- **No servers, accounts or tracking.** Everything is stored in your browser's local storage on your device.
- **No internet requests at all.** The app loads no outside scripts, fonts or images. The one library it uses (JSZip, for Word and Excel downloads) is bundled inside `index.html`.
- **A strict Content Security Policy** blocks the page from loading anything from the internet or sending data anywhere, even if someone tampered with an imported file.
- **Imported files are treated as untrusted.** Everything you import is cleaned: text is always shown as text, never as code. Only real `https://` links become clickable, so `javascript:` tricks are blocked. Unknown fields are dropped, and files over 20 MB are refused.
- **Safe downloads.** Excel exports contain plain text and numbers only, never formulas, so a malicious entry can't run anything in your spreadsheet app. Word and calendar files are escaped the same way.
- **Your rota photo never leaves your device.** It's only shown as a preview so you can check the AI's reading.
- **Built-in AI safety rules.** The scout prompt tells your AI assistant to treat web pages as information, not instructions. It also tells it not to use other tools or accounts, never to ask for passwords, ID or bank details, and to use only official https links.

## What you should do

1. **Back up, and treat backups as private.** Your backup `.json` file contains your story, essays and plans. Store it somewhere safe and don't post it publicly.
2. **Use your own device.** Anyone who can use your browser profile can open the tracker. On a shared computer, use your own browser profile and click **Erase all data** when you're done.
3. **Opening the file directly:** some browsers let every local HTML file share the same storage. Don't open HTML files from people you don't trust in the same browser you use for Application HQ, or host your own copy (option 2).
4. **Hosting on GitHub Pages:** all project sites under `yourname.github.io` share one browser origin, so any other page you publish there could read the tracker's storage. Host Application HQ on an account or custom domain that runs nothing else, or use the local file.
5. **Only use a copy you trust.** Download from the official repository or your own fork. A modified copy could behave differently.
6. **Check what the AI gives you.** Always open the official link and confirm deadlines and requirements before you apply. Never pay to apply for "fully funded" programmes, and never give an AI assistant your passwords or ID numbers.
7. **Review scheduled tasks.** If your AI assistant runs the scout as a scheduled task, give it only the tools it needs (web search and browsing), not your email, website or file accounts.

## Reporting a problem

If you find a security issue, please open a private security advisory on the GitHub repository (**Security → Report a vulnerability**), or contact the maintainer, rather than posting it publicly.
