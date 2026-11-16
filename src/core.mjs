/** Safety-first deterministic checks; no network calls. */
export const DISCLOSURE = '\n\n*I am an automated AI helper authorized by the community moderators. Please verify important details.*';
const HIGH_RISK = /\b(suicid|self.harm|overdose|kill myself|abuse|assault|symptom|diagnos|medication|prescription|blood pressure|pregnan|insulin|lawyer|legal advice|court|lawsuit|credit score|financial advice|invest|trading|weapon|explosive|exploit|steal|phishing|hacking|bypass password)\b/i;
const CONTACT = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\b\d{3}[-.\s)]*\d{3}[-.\s]*\d{4}\b/i;
export function keywords(input) {
  return String(input || '').split(',').map(s => s.trim().toLowerCase())
    .filter(s => /^[a-z0-9 +#.-]{3,35}$/.test(s)).slice(0,20);
}
export function eligible(post, options) {
  if (!post || !/^t3_[a-z0-9]+$/i.test(post.id || '') || !/^t2_[a-z0-9]+$/i.test(post.authorId || '')) return false;
  if (post.locked || post.archived || post.removed || post.spam || post.nsfw || post.quarantined) return false;
  const text = String(post.title || '').trim() + '\n' + String(post.body || '').trim();
  if (String(post.title || '').length < 12 || text.length < 30 || text.length > 3000) return false;
  if (options.requireHelpFlair && !/^(help|question|support|tech support|troubleshooting)$/i.test(String(post.flair || '').trim())) return false;
  if (!/\?|\b(how (do|can|to)|what (is|are)|why (does|is)|help|troubleshoot|error|fix)\b/i.test(text)) return false;
  if (HIGH_RISK.test(text) || CONTACT.test(text)) return false;
  const lower = text.toLowerCase();
  return keywords(options.topicKeywords).some(k => lower.includes(k));
}
export function approveAnswer(raw, threshold=90) {
  if (!raw || typeof raw !== 'object' || raw.shouldReply !== true || raw.risk !== 'low' || !Number.isFinite(raw.confidence)) return null;
  if (raw.confidence < Math.max(90,Math.min(100,Number(threshold) || 90))) return null;
  const answer = typeof raw.answer === 'string' ? raw.answer.trim() : '';
  if (answer.length < 80 || answer.length > 1200) return null;
  if (/https?:\/\/|www\.|u\/\w+|r\/\w+|@everyone|(?:ignore|override) (?:all|previous) instructions/i.test(answer)) return null;
  if (/\b(as a human|in my experience|i tried|i work at|i'm a doctor)\b/i.test(answer)) return null;
  return answer + DISCLOSURE;
}
export function postingAllowed(c) {
  return c.enabled === true && c.autoPublish === true &&
    c.globalPause === false && c.operatorPaused === false;
}
