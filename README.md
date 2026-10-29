# IELTS Spelling Practice

A mobile-first web app for IELTS students to practise spelling the words they commonly misspell in the Listening module. The app speaks a word, the student types it, and the app shows the correct spelling with a letter-by-letter diff.

Built with Next.js (App Router, TypeScript), Tailwind CSS and Serwist. There is no backend: all progress is stored in `localStorage`.

## Local setup

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # then edit the values
npm run dev                  # http://localhost:3000
```

Other scripts:

| Command             | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `npm run build`     | Production build (uses webpack, required by Serwist) |
| `npm start`         | Serve the production build                           |
| `npm run lint`      | ESLint                                               |
| `npm run typecheck` | TypeScript check                                     |

The service worker is disabled in development. To test offline mode and the install prompt, run `npm run build && npm start`.

> Speech uses the browser's Web Speech API. Available voices depend on the device and browser. Chrome, Edge and Safari have the best UK, US and Australian voices.

## Environment variables

| Variable               | Required | Description                                                                                      |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | Yes      | Public URL of the site, e.g. `https://ielts-spelling.vercel.app`. Used for `metadataBase`, canonical URLs, the sitemap and Open Graph tags. |
| `NEXT_PUBLIC_GA_ID`    | No       | GA4 measurement ID (`G-XXXXXXX`). When empty, no analytics script or cookie banner is rendered.  |

Both are inlined at build time, so rebuild after changing them.

## Deploying to Vercel

1. Push the project to a GitHub, GitLab or Bitbucket repository.
2. In Vercel, choose **Add New → Project** and import the repository. The Next.js preset is detected automatically, and the build command comes from `package.json`.
3. Under **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` (your production domain) and, optionally, `NEXT_PUBLIC_GA_ID`.
4. Deploy. Each deployment gets a new service worker revision, and returning users see a "new version available" toast.

Or from the command line:

```bash
npx vercel          # preview
npx vercel --prod   # production
```

## Project structure

```
app/
  layout.tsx               Root layout: font, theme, header, analytics, consent
  page.tsx                 Home: one-screen hero + practice card
  practice/[category]/     One statically generated page per category
  topics/                  Index of every category, with descriptions and internal links
  words/                   Searchable word list grouped by topic
  mistakes/                Practise only misspelled words
  about/                   Why spelling matters, spelling traps, tips, FAQ + JSON-LD
  sw.ts                    Serwist service worker (precache + runtime cache)
  manifest.ts, sitemap.ts, robots.ts, opengraph-image.tsx
components/                UI. Only interactive parts are client components.
data/words.ts              Typed word list (word, alt, category, difficulty)
lib/
  storage.ts               Typed localStorage helper + useStored hook
  progress.ts              Daily goal, streak and mistakes logic
  queue.ts                 Shuffled, no-repeat word order per practice set
  spelling.ts              Answer checking, letter diff, hints
  speech.ts, useSpeech.ts  Voice selection and speech synthesis
  sounds.ts                Success and error tones (Web Audio)
  analytics.ts             track() helper for GA4 events
public/icons/              PWA icons (192, 512, 512 maskable, apple-touch)
legacy/                    The previous plain HTML/JS version, kept for reference
```

## Word list

`data/words.ts` contains 975 words. 916 come from *The 1200 Most Commonly Repeated Words in IELTS Listening* (ieltsportal.com), grouped by its topics. The rest are a curated **Commonly Misspelled** set. British spelling is the main answer, and the American variant goes in `alt` (for example `colour`/`color`). The difficulty level is estimated from word length and tricky letter patterns.

To add a word, append it to `WORDS`. To add a category, add it to `CATEGORIES`. Its page, sitemap entry and precache entry are generated automatically.

## Analytics events

When `NEXT_PUBLIC_GA_ID` is set, these events are sent through `track()`: `practice_start`, `word_checked`, `hint_used`, `accent_changed`, `session_completed`, `share_clicked` and `pwa_installed`. Google Consent Mode v2 keeps `analytics_storage` denied until the student accepts the cookie banner. The choice is remembered. Until a visitor accepts, Google only receives cookieless pings, which do not appear in GA4 reports or Realtime — so an empty dashboard usually means the banner was not accepted (clear `ielts:consent` in localStorage to see it again).
# listening-spell-fix
# listening-spell-fix
# listening-spell-fix
# listening-spell-fix
# listening-spell-fix
