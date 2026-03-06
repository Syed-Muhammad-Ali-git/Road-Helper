Theme & i18n Audit — Road Helper (client)

Date: 2026-03-07

This file contains a thorough scan and list of issues (theme + languages/i18n) found in the repository, with concrete recommendations and minimal code snippets to fix critical problems. Each issue is listed separately so nothing is missed.

Files scanned

- lib/themeInit.ts
- components/ThemeProvider.tsx
- store/themeStore.ts
- app/layout.tsx
- lib/i18n.ts
- lib/firebase/hooks/useTranslation.ts
- store/langStore.ts
- dictionaries/en.json
- dictionaries/rm.json
- dictionaries/roman.json
- dictionaries/ur.json
- types/firebase.ts
- lib/sweetalert.ts

---

SUMMARY

- There are multiple concrete problems affecting theme persistence, startup anti-FOUC behavior, language-code consistency, duplicate/unused dictionary files, missing interpolation/pluralization, and bundle-size / maintainability problems caused by static dictionary imports.
- The most urgent errors (will affect user-visible behavior):
  1. localStorage key mismatches for theme & lang (so persisted user prefs are ignored)
  2. Conflicting/duplicated theme initialization code (inline scripts + lib/themeInit + ThemeProvider)
  3. Language code/type mismatch (`rm` vs `roman`) and duplicate dictionary files (`rm.json` and `roman.json`)

Below: an itemized list of every issue found and recommended fixes (one-by-one). Each item is independent and actionable.

---

DETAILS & ISSUES (one-by-one)

THEME (detailed issues)

1. Persist key mismatch (critical)
   - Location: [lib/themeInit.ts](lib/themeInit.ts), [store/themeStore.ts](store/themeStore.ts), [app/layout.tsx](app/layout.tsx)
   - Problem: `lib/themeInit.ts` reads from `localStorage` keys `rh_theme` and `rh_lang` (underscore). The rest of the app persists state under `rh-theme` and `rh-lang` (dash). `app/layout.tsx` inline anti-FOUC script also reads `rh-theme`/`rh-lang` (dash).
   - Effect: `lib/themeInit.ts` will not pick up persisted values and falls back to defaults; user preferences are ignored if `lib/themeInit.ts` is executed. This causes either wrong initial theme/lang or duplicated/conflicting initialization sequences.
   - Fix: standardize keys. Prefer dashes to match zustand persist names. Update `lib/themeInit.ts` or remove it. Minimal fix (change reads):

```ts
// lib/themeInit.ts — fix keys
const savedTheme = localStorage.getItem("rh-theme") || "dark";
const savedLang = localStorage.getItem("rh-lang") || "en";
```

- Recommendation: remove `lib/themeInit.ts` (it's redundant) OR change it to read the same keys and use `document.documentElement` (see next item). Keep only one source of truth: the inline anti-FOUC script in `app/layout.tsx` is a good synchronous choice.

2. Duplicate/conflicting initialization (high)
   - Location: [lib/themeInit.ts](lib/themeInit.ts), [app/layout.tsx](app/layout.tsx), [components/ThemeProvider.tsx](components/ThemeProvider.tsx)
   - Problem: The app has three places that may set theme/dir before/after render:
     - `app/layout.tsx` inline anti-FOUC scripts (synchronous and correct approach)
     - `lib/themeInit.ts` (self-executes at module top-level if loaded)
     - `ThemeProvider` which applies theme in an effect
   - Effect: redundant logic and race conditions; also some parts manipulate `body` while others manipulate `html`.
   - Fix: pick one synchronous initializer for pre-hydration (keep the inline scripts in `app/layout.tsx`), delete or convert `lib/themeInit.ts` into a helper (non-self-executing) that is explicitly imported where needed. Ensure `ThemeProvider` only reacts to state changes (no direct localStorage reads).

3. Inconsistent DOM target for classes (medium)
   - Location: theme files (themeInit, themeStore, ThemeProvider) and CSS (`globals.css`) target both `html` and `body`.
   - Problem: `lib/themeInit.ts` manipulates `body.classList`, while `themeStore` and `ThemeProvider` apply to `document.documentElement` (html). CSS in `globals.css` uses `html.dark` and `html.light` in places and `.dark .btn-...` in others.
   - Effect: Some styles may not apply consistently across elements and components. Hard to reason about which element is authoritative.
   - Fix: standardize to `document.documentElement` (html). Update `lib/themeInit.ts` (or remove) to set classes on `document.documentElement` consistently. Update any CSS that targets `body`-scoped selectors to use `html`.

4. Anti-FOUC inline scripts use different stored shape (ok but fragile)
   - Location: [app/layout.tsx](app/layout.tsx)
   - Note: the inline script reads `localStorage.getItem('rh-theme')` and parses JSON produced by zustand `persist` (it expects persisted object shape). This is fine; but any change to persist key or shape will break it. Keep stable names.

5. Theme constants & CSS tokens (note)
   - Location: [app/globals.css](app/globals.css)
   - Observation: many theme CSS variables exist and there are compatibility shims mapping dark token names to light tokens. This is acceptable but complex. Keep tokens documented and avoid duplicated names.

LANGUAGES / I18N (detailed issues)

1. Language code mismatch & duplicate dictionary files (critical)
   - Location: [lib/i18n.ts](lib/i18n.ts) defines `type Lang = "en" | "ur" | "rm"` and `LANGUAGES` uses `code: "rm"`.
   - Problem: elsewhere the codebase expects `roman` (see [types/firebase.ts](types/firebase.ts) where `preferredLanguage?: "en" | "ur" | "roman"`). There are two dictionary files `rm.json` and `roman.json` present in `/dictionaries`.
   - Effect: Type contradictions, potential runtime mismatches, and duplicate/unused files. `useTranslation` imports `rm.json` — so `roman.json` appears unused.
   - Fix: pick one canonical code/filename (recommendation: use `roman` for readability OR use `rm` consistently). Then:
     - Rename files or update imports so only one file exists.
     - Update `lib/i18n.ts` `Lang` type to match (e.g., `"roman"`) and update `LANGUAGES` codes.
     - Update `types/firebase.ts` to match the chosen code.

2. Static dictionary imports increase bundle size (medium)
   - Location: [lib/firebase/hooks/useTranslation.ts](lib/firebase/hooks/useTranslation.ts)
   - Problem: `useTranslation` currently imports all dictionaries at top-level (en, ur, rm) so every page becomes larger.
   - Fix: lazy-load dictionaries based on `lang` (dynamic import) or load them on server and provide translations via next.js server components. Minimal improvement: change `useTranslation()` to dynamic import when lang changes.

3. Missing interpolation & pluralization (medium)
   - Location: dictionaries contain placeholders like `{days}` (see `expires_in_days`), but `useTranslation` only returns the raw string and there is no parameter replacement API.
   - Effect: placeholders will appear verbatim unless code manually replaces them. No plural rules or ICU support.
   - Fix: enhance `useTranslation` to accept params, e.g. `t(key, params)` and perform simple replacement, or integrate an i18n library (i18next, formatjs). Example minimal change:

```ts
// minimal param support (inside useTranslation)
const t = (key, params?: Record<string, string>) => {
  const keys = key.split(".");
  let str: any = (dictionaries as any)[lang];
  for (const k of keys) {
    if (str === undefined) return key;
    str = str[k];
  }
  if (!str) return key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    });
  }
  return str;
};
```

4. Missing key detection and fallback logging (low->medium)
   - Location: `useTranslation` currently returns the `key` string when missing (silent). This makes missing keys visually obvious but noisy in production.
   - Recommendation: keep the fallback but also `console.warn` missing keys during development, and provide an optional fallback language lookup (e.g., fall back to English value if translation missing).

5. Types conformance (medium)
   - Location: `types/firebase.ts` expects `preferredLanguage?: "en" | "ur" | "roman"` while `lib/i18n.ts` defines `Lang` differently (`rm`). Align all TypeScript types / union values to the single chosen code.

6. Placeholders and formatting (note)
   - Observation: dictionaries include date/currency/number related strings. For locale-specific formatting, use `Intl.NumberFormat` / `Intl.DateTimeFormat` rather than string concatenation.

7. No automated key-coverage tests (recommendation)
   - Add a small node script in `scripts/check-i18n.js` that compares keys across dictionaries and emits missing keys. Run this in CI.

EXAMPLES (quick fixes)

1. Fix `lib/themeInit.ts` keys (if you prefer to keep the file):

```ts
// lib/themeInit.ts — change to dash keys and html-class usage
export const initializeTheme = () => {
  if (typeof window === "undefined") return;
  const rawTheme = localStorage.getItem("rh-theme");
  const parsedTheme = rawTheme ? JSON.parse(rawTheme) : null;
  const savedTheme = parsedTheme?.state?.theme || "dark";
  const rawLang = localStorage.getItem("rh-lang");
  const parsedLang = rawLang ? JSON.parse(rawLang) : null;
  const savedLang = parsedLang?.state?.lang || "en";
  const html = document.documentElement;
  html.classList.remove("light", "dark");
  html.classList.add(savedTheme);
  html.setAttribute("lang", savedLang);
  html.setAttribute("dir", savedLang === "ur" ? "rtl" : "ltr");
};

// Prefer: do not auto-run; call explicitly or rely on app/layout.tsx anti-FOUC script.
```

2. Minimal `useTranslation` improvements (params + dynamic import sketch)

```ts
// lib/firebase/hooks/useTranslation.ts (sketch)
import { useLangStore } from "@/store/langStore";
export function useTranslation() {
  const { lang } = useLangStore();
  const t = (key: string, params?: Record<string, string>) => {
    const dict = require(`@/dictionaries/${lang}.json`);
    let val: any = key
      .split(".")
      .reduce((o, k) => (o ? o[k] : undefined), dict);
    if (!val) {
      console.warn("Missing translation", lang, key);
      return key;
    }
    if (params)
      Object.entries(params).forEach(([k, v]) => {
        val = val.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    return val;
  };
  return t;
}
```

MAINTENANCE RECOMMENDATIONS (priority order)

- P0 (urgent): Fix localStorage key mismatch (`rh_theme` vs `rh-theme`, `rh_lang` vs `rh-lang`), and remove or standardize `lib/themeInit.ts` so only one initializer is used for pre-hydration.
- P0: Choose one language code (`rm` or `roman`) and unify across `lib/i18n.ts`, `types/*`, filenames, and any persisted values.
- P1: Remove unused dictionary file (`roman.json` or `rm.json`) after consolidation.
- P1: Add a small script to verify every dictionary has the same set of keys (CI check).
- P1: Add simple placeholder interpolation in `useTranslation` or adopt `i18next` / `formatjs` for full features.
- P2: Lazy-load dictionaries or server-render translations to reduce client bundle size.
- P2: Add console warnings for missing translations in dev; optionally log missing keys to an analytics endpoint for localization coverage.

CHECKLIST (practical fixes you can apply now)

1. Decide canonical language code: `rm` or `roman`.
2. Update `lib/i18n.ts` `Lang` union and `LANGUAGES` codes to match chosen code.
3. Update `types/firebase.ts` union type for `preferredLanguage` to same code.
4. Remove the unused dictionary file (the one not referenced after step 2).
5. Fix `lib/themeInit.ts` keys OR remove it and rely on `app/layout.tsx` inline script + `ThemeProvider` (recommended: delete `lib/themeInit.ts`).
6. Add simple `t(key, params)` support.
7. Add `scripts/check-i18n.js` and run it; add to CI.

ADDITIONAL NOTES

- Accessibility: `applyLangToDocument` sets `lang` and `dir` — ensure CSS/layout handles RTL (mirroring paddings/margins) where needed (some components use `ml-` / `mr-` hard-coded classes).
- I scanned the common places where translations and theme are referenced (components, stores, libs). If you want I can run the key-coverage script and produce a missing-key report listing exactly which translation keys are missing per language and open PR to fix them.

---

Next steps (choose one):

- I can apply the small, low-risk changes now (fix the underscore/dash localStorage keys or remove `lib/themeInit.ts`).
- I can create `scripts/check-i18n.js` and run it to produce a per-key missing report.
- I can make a PR that standardizes language codes across the codebase (rename files + update imports + types).

Tell me which follow-up step you want and I'll implement it.

---

FULL-REPO AUDIT (additional findings)

I ran a broad textual scan for common problems (secrets, insecure storage, leftover console logs, TODO/FIXME markers, risky DOM operations, config issues). Below are the issues found across the repository that are unrelated to theme/i18n but important for security, correctness, and maintainability.

1. Plaintext passwords stored in Firestore (critical)
   - Files: [lib/auth.ts](lib/auth.ts), [lib/firestore.ts](lib/firestore.ts), [store/authStore.ts](store/authStore.ts), [store/slices/authSlice.ts](store/slices/authSlice.ts)
   - Evidence: `lib/auth.ts` includes `await userOps.create(user.uid, { email, name, phone, role, password }); // Store plain password as requested` and `lib/firestore.ts` type annotations include `password?: string; // Stored unhashed as requested`.
   - Risk: Storing raw passwords is a major security vulnerability. If the DB is compromised, user credentials will be fully exposed. It also violates security best practices and likely regulations.
   - Immediate fix: Stop storing passwords in Firestore. Remove the `password` field from user records. Rely solely on Firebase Authentication for credential storage. If you absolutely must store a password-like secret, store a salted hash on a secure server (not in client code) and never transmit raw passwords to Firestore.

2. Sensitive environment usage and exposure (high)
   - Files: [lib/firebase.ts](lib/firebase.ts), [lib/firebase/config.ts], [lib/services/cloudinaryService.ts]
   - Observation: Client-side configs use `NEXT_PUBLIC_*` env vars (which is correct for non-secrets). Ensure no secret env variables are prefixed with `NEXT_PUBLIC_`. I found no obvious private keys in the repo, but confirm that any service-account or private keys are stored server-side and not checked in.

3. `dangerouslySetInnerHTML` usage (medium)
   - File: [app/layout.tsx](app/layout.tsx)
   - Usage: inline anti-FOUC scripts are injected using `dangerouslySetInnerHTML`. This is acceptable for small synchronous scripts when content is static, but be careful to avoid interpolating untrusted values. Keep these scripts minimal and static (they are currently fine).

4. Leftover console.log and dev scripts (low-medium)
   - Files: [scripts/fix-lint.js](scripts/fix-lint.js) contains many `console.log` statements used for reporting; these are fine for tooling. I found other console logs in scripts only. Remove or gate runtime console logs in production code.

5. Many lint/type issues referenced by helper script (medium)
   - File: [scripts/fix-lint.js](scripts/fix-lint.js) prints a summary claiming many TypeScript `any` uses, unused variables, and errors. The repository likely has type-safety and lint problems that should be fixed incrementally. Run `pnpm/npm/yarn` lint and TypeScript checks.

6. Inconsistent naming and duplication (medium)
   - Dictionaries: `rm.json` vs `roman.json` (duplicate/overlap). Consolidate and remove unused files.
   - Theme/localStorage: `rh_theme` vs `rh-theme` mismatch (already covered).

7. Potential accessibility issues (note)
   - RTL support: `applyLangToDocument` sets `dir` correctly, but many components use one-sided spacing classes like `ml-`/`mr-`. Ensure UI is verified in RTL to avoid layout/UX regressions.

8. Use of client-side fetch for uploads (cloudinary) (note)
   - File: [lib/services/cloudinaryService.ts](lib/services/cloudinaryService.ts)
   - Observation: image uploads from client to Cloudinary are common; ensure unsigned uploads are intentionally used and limits are enforced. Consider uploading to your server to keep presets private if needed.

9. Dependency & config surface (recommendation)
   - Files to review: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `eslint.config.mjs`
   - Action: ensure dependencies are up-to-date, remove unused packages, and avoid shipping dev-only packages to production. Add `engines`/`browserslist` as appropriate.

10. Missing automated checks (recommendation)

- Add CI steps: `pnpm install`, `pnpm build`, `pnpm lint`, `pnpm test`, `node scripts/check-i18n.js`, and a secret-scan step (e.g., `trufflehog`/`git-secrets`) before merges.

11. Data leaks in presentation or README (low)

- Quick check: no obvious secrets in `README.md` or `presentation.md`. Continue to avoid pasting credentials in docs.

PRIORITY ACTIONS (what to fix first)

- P0 (critical): Remove plaintext password storage and purge existing plaintext passwords from Firestore (rotate credentials if any users re-used those passwords). Replace with Firebase Auth-only workflow.
- P0: Fix theme/localStorage key mismatches and standardize initialization (already recommended earlier).
- P0: Unify language codes and remove duplicate dictionary files.
- P1: Add i18n key-coverage check and CI steps.
- P1: Run linter & TypeScript checks and fix reported `any` and unused variables incrementally.
- P1: Add secret scanning to CI and review environment variable usage.

If you want, I can now make the highest-impact changes automatically:

- Stop storing `password` in Firestore: update `lib/auth.ts` and `lib/firestore.ts` types and calls, and add a migration note to delete `password` fields from user documents. (This is sensitive — I'll prepare a safe PR and migration script.)
- Fix the `lib/themeInit.ts` key mismatch or remove the file and update references.
- Create `scripts/check-i18n.js` and run it to produce a missing-keys report.

Which of the above should I implement now? Reply with the number(s) (e.g., `1,2`) or say `all` and I'll begin with the most urgent (remove plaintext password storage, then theme key fixes, then i18n script).
