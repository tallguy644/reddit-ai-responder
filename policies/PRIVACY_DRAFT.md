# Privacy disclosure (DRAFT, not yet published)

Operator: [developer name and contact method]
Effective date: [date after review]

With moderator authorization, the app checks newly submitted public posts in communities where it is installed. Only eligible, low-risk post titles and short text excerpts are sent to the configured OpenAI API for the purpose of generating possible replies. No model training is requested or authorized.

Temporary duplicate-suppression keys and per-author daily limits are stored in Reddit-hosted Redis and expire after a few days. Aggregate per-day counters expire after eight days. The app does not intentionally retain full post bodies or generated answer texts after answering. It records no direct messages.

The app account may publish a reply visible publicly in its subreddit. Reddit and the AI service independently process content under their terms. Complete this disclosure with the accurate data-processing, deletion, contact, cross-border transfer and retention information required for your app before applying for Reddit review.

Deleted or removed Reddit content must not be used or redistributed. Developer must implement any further handling required by Reddit policies.

**Do not publish this placeholder as a final privacy policy.**
