# Reddit AI Auto-Responder

**Cloud-hosted Devvit bot with a browser-based moderator dashboard. Status: source code committed, not deployed.**

The bot responds to newly created **Help/Question** posts only in subreddits that install and authorize it. Replies are attributed to the app account and include an automated-AI disclosure. There is no Reddit-wide scraping, unsolicited DMing, or training on Reddit data.

## Safety defaults

- Global emergency stop: **ON**.
- Community enabled: **OFF**.
- Automatic replies: **OFF**.
- Moderator operator pause: **ON**, until released from the dashboard.
- Require Help/Question/Support flair, matching technical topic, low-risk question and conservative AI screening.
- At most five replies per subreddit per day; default three and at most one per author per day.
- Every response is checked before publishing; this is heuristic screening, not a guarantee of correctness.
- Logs store aggregate outcomes rather than question or answer text.

## What runs where

- **GitHub:** source control, automatic test/build checks and browser Codespaces.
- **Reddit Devvit:** event triggers, app-account comments, Redis and moderator dashboard hosting. No separate always-on computer is needed.
- **OpenAI API:** optional inference after the developer adds an API key; ChatGPT subscription does not cover API usage.
- **Dashboard:** Reddit community menu → AI Responder dashboard, restricted to subreddit moderators.

## Setup without Windows PowerShell

1. In GitHub select **Code → Codespaces → Create codespace on main**. The devcontainer automatically installs the Node.js dependencies.
2. Use the **Codespaces browser terminal**, not a local Windows terminal, to run `npm test` and `npm run build`.
3. Sign into Reddit's developer system using `npx devvit login --copy-paste` and follow its browser sign-in prompt.
4. At https://developers.reddit.com/new register a Devvit app. The `name` in `devvit.json` must be available, 3–20 characters, lowercase letters/numbers/hyphens; change it if needed.
5. Run `npx devvit playtest` in a private testing subreddit where you are a moderator.
6. Create an OpenAI API key at https://platform.openai.com/api-keys, then run `npx devvit settings set openaiApiKey` in the Codespaces terminal. Enter it **only in the protected secret prompt**, never in GitHub files, issues or this chat.
7. Open the test subreddit menu item **AI Responder dashboard**. Leave automatic publishing disabled. When your Reddit app is authorized for testing, disable the global stop in the app's global settings and enable question scanning in the community's installed-app settings. Release the extra operator pause from the dashboard to collect **dry-run counts only**.
8. Complete Reddit's app review and any required API and external fetch/domain permissions; obtain moderator permission for each installation. Update and publicly host real privacy/terms disclosures. Only then consider enabling autoPublish.

Reddit deployment requires the developer account owner to authenticate and approve. No CI workflow automatically publishes an app or comments.

## Expected workflow

1. A new post event arrives in an installed subreddit.
2. Check current post state, flair, topic and basic high-risk/personal-data exclusions.
3. Atomically claim the post ID, then request a JSON answer from OpenAI.
4. Validate the answer and skip if low quality.
5. In dry-run mode, count the candidate without posting.
6. In live mode, recheck all four safety controls, enforce daily quotas and recheck current post state before submitting one disclosed comment as the app.
7. Record aggregate statistics; moderator dashboard exposes counts, active settings and pause/resume.

## Commands (inside GitHub Codespaces)

```sh
npm install
npm test
npm run build
npx devvit login --copy-paste
npx devvit playtest
```

**Publishing is not automatic.** When Reddit's review requirements are satisfied, use the Devvit CLI to upload and publish the app explicitly.

## Project files

| Path | Purpose |
| --- | --- |
| `devvit.json` | App permissions, triggers, settings and API secret declaration |
| `src/server/index.ts` | Devvit trigger, OpenAI call, quota enforcement and dashboard endpoints |
| `src/core.mjs` | Pure safety filters and answer validation |
| `public/` | Moderator dashboard HTML, CSS and JS |
| `tests/` | Offline safety tests |
| `.github/workflows/check.yml` | Automatic GitHub test/build check only |
| `.devcontainer/` | Browser Codespaces development environment |
| `policies/` | Drafts to customize before submission; not published policies |

## Limitations

- This project has **not** yet been tested end-to-end in the Reddit cloud environment. GitHub CI should verify Node compilation; playtest still requires Reddit sign-in.
- Redis and settings are isolated to the installed subreddit where appropriate.
- Posts are not stored in a training dataset. Only a small subset of eligible post text is sent to OpenAI to generate a reply.
- Content filters cannot identify every risky situation. Start with dry-run tests and conservative deployment.
- The README and policy templates are **not** substitutes for Reddit review, consent, moderator approvals or legal privacy notices.

## Official documentation

- https://developers.reddit.com/docs/quickstart
- https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_configuration
- https://developers.reddit.com/docs/capabilities/server/triggers
- https://developers.reddit.com/docs/capabilities/server/settings-and-secrets
- https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy
