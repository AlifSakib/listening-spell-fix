# IELTS Spelling Practice

A mobile-first, offline-capable web app for IELTS students to practice spelling words they commonly misspell in the Listening module.

**Hear a word → Type it → Get instant feedback.**

## Features

- 🔊 **Speech synthesis** with UK, US, and AU accents
- 📝 **1200+ words** from real IELTS Listening categories
- ✅ **Instant feedback** with letter-by-letter diff for wrong answers
- 🔄 **Mistakes review** — practice only the words you got wrong
- ⏭️ **Skip** — skip any word you don't want to practice right now
- 📱 **PWA** — install on your phone, works fully offline
- 🌙 **Dark mode** — automatic, based on system preference
- 💾 **Progress saved** locally in your browser

## Run Locally

Any static file server will work. For example:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (npx)
npx serve .

# Using PHP
php -S localhost:8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

> **Note:** The Web Speech API and Service Workers require a secure context. They work on `localhost` for development, but you'll need HTTPS in production.

## Deploy

This is a fully static site — just upload all files to any static host:

### Netlify
1. Drag and drop the project folder into [Netlify Drop](https://app.netlify.com/drop)
2. Done!

### Vercel
```bash
npx vercel --prod
```

### GitHub Pages
1. Push to a GitHub repository
2. Go to Settings → Pages → Source → Deploy from branch
3. Select `main` branch and `/ (root)` folder

## File Structure

```
├── index.html          # App shell
├── styles.css          # Styles (mobile-first, dark mode)
├── app.js              # Application logic
├── words.json          # 1200+ words with categories
├── manifest.json       # PWA manifest
├── sw.js               # Service worker for offline support
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── icon-512-maskable.png
└── README.md
```

## Tech Stack

- Plain HTML, CSS, and vanilla JavaScript
- Web Speech API for text-to-speech
- localStorage for progress persistence
- Service Worker for offline caching

No frameworks, no backend, no build step.

## License

MIT
