# Browser-only launch checklist

The github.dev Codespaces page is a **development editor**, not the Reddit dashboard. Authentication and playtesting must run before there is an app to open on Reddit.

## If the editor is blank or the terminal is missing

1. Go to https://github.com/tallguy644/reddit-ai-responder
2. Select **Code → Codespaces** and open the existing Codespace, or create a new one from `main`.
3. In an existing Codespace, load the latest repository changes using Source Control or Git pull, and select **Command Palette → Codespaces: Rebuild Container** to install the corrected Node 24 environment.
4. Select **Terminal → New Terminal** in the browser editor, not Windows PowerShell.

## Verify

```sh
node --version
npm install
npm test
npm run build
```

Node should be **v24.18.0 or newer**. The GitHub Actions workflow tests the code; it does not deploy the Reddit app.

## Authenticate Reddit

```sh
npx devvit login --copy-paste
npx devvit whoami
npx devvit playtest
```

Follow the browser sign-in prompt. The playtest tool prints a reddit.com URL, which is where the app is shown.

Never send your OpenAI API key or Reddit login token in chat or a public GitHub issue.
Leave all posting switches disabled until the required approvals are complete.

## Troubleshooting

If a step fails, provide only the red error message (without tokens or keys) and tell us whether it came from editor startup, npm install, tests, Devvit login, or playtest.

Reference: https://developers.reddit.com/docs/guides/faq
