# 🤖 TAE Quest

A visual, gamified study app for the **ISTQB® Certified Tester Advanced Level – Test Automation Engineering (CTAL-TAE) v2.0** exam.
Built with React + TypeScript + Vite. No backend: progress is saved in your browser.

## Run it

```bash
npm install
npm run dev        # opens http://localhost:5173
```

Other scripts: `npm run build` (type-check + production build), `npm run preview`, `npm run typecheck`.

## What's inside

| Area | What it does |
|---|---|
| 🏠 **Home** | Metro-line journey through the 8 chapters, predicted exam score, weak spots, due flashcards |
| 📖 **Learn** | 38 interactive "scenes" (diagrams, simulators, flip-cards), each with a story, a memory hook, an exam trap and a recall check. **Recall mode** blurs the details so you must remember them first |
| 🧠 **Mind Map** | The whole syllabus on one screen; bubble size = exam weight. Zoom into any chapter |
| 🎯 **Practice** | 134 questions: the 40 official sample questions (with official rationales) + 94 original exam-style questions covering every learning objective. Daily 10, weak spots, per-LO drills, combos & XP |
| 🎓 **Mock Exam** | 40 questions, 90 min (+25% non-native option), scored by points, pass at 65%, per-chapter breakdown and full review |
| 🃏 **Flashcards** | 81 cards (acronyms, keywords, lists) with Leitner spaced repetition |
| 🕹️ **Arcade** | 12 drag-and-drop sorting games + 9 sequencing games |
| 🏆 **Trophies** | 12 levels (Manual Clicker → Automation Legend), 22 badges, streaks, daily goal, export/import progress |

### Why it's built this way (learning science)
- **Retrieval practice** and **spaced repetition** have the strongest evidence → recall checks, recall mode, flashcards, weak-spot re-drills.
- **Visuals help most when paired with active recall** (not passive viewing) → every diagram is interactive and followed by a check.
- **Interleaving** → Daily 10 and mock exams mix chapters like the real exam.
- **Gamification**: streaks drive habit more than badges; XP is earned for *correct* answers, not time spent.

## Keyboard shortcuts
- Practice: `A`–`E` / `1`–`5` select, `Enter` submit / next
- Lessons: `←` `→` change scene
- Flashcards: `Space` flip, `1`–`4` grade

## Content sources
Syllabus content and the 40 sample questions come from the ISTQB® CTAL-TAE v2.0 syllabus and Sample Exam A v2.4 (in `docs/`), © ISTQB®, used for personal, non-commercial study. The practice questions, mnemonics and diagrams are original.

## Publish on GitHub Pages

Deployment is automated by [.github/workflows/deploy.yml](.github/workflows/deploy.yml): every push to `main` type-checks, builds, and publishes `dist/` to GitHub Pages.

One-time setup:
1. Push this repo to GitHub (branch `main`).
2. In the repo on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push (or run the workflow manually from the **Actions** tab). The site appears at `https://<your-user>.github.io/tae-study/`.

Notes:
- `vite.config.ts` uses `base: './'`, so the build works under any repo name; the app uses hash routes (`#/learn/...`), so deep links work on Pages without extra config.
- Run `npm install` once while online and commit `package-lock.json` — the workflow then uses `npm ci` for reproducible builds.
- Progress is stored in each visitor's browser (localStorage); nothing is sent to a server.
