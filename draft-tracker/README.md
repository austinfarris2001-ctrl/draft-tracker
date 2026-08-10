# Draft Tracker

A live fantasy football snake-draft board: type in your own rankings, tag
players with tiers/ADP/projected points, then track picks in real time
during your draft. Everything runs client-side (localStorage) — no backend,
free to host on GitHub Pages.

## Features

- **Rankings editor** — manually enter players with your rank, tier, ADP,
  bye week, projected points, and notes.
- **Live draft board** — mark each player "Mine" or "Taken" as the draft
  happens. Drafted players gray out; your board auto-highlights the best
  remaining player.
- **Tiers** — color-coded rail per player so you can see drop-offs.
- **Position filters + search.**
- **ADP tracked separately from your personal rank**, so you can spot
  reaches and values (rank #24, ADP 40 = a guy you can wait on).
- **Value-Based Drafting (VBD)** — enter projected points per player, and
  the app auto-computes VBD against a replacement-level baseline you
  configure per position in League Settings.
- **Bye week conflict warnings** — flags when a remaining player shares a
  bye week with someone already on your roster.
- **Undo** — reverse the last pick.
- **Mock draft mode** — simulate a full draft (opponents pick by ADP with
  realistic randomness) to stress-test your rankings before the real thing.
- **My Team panel** — roster breakdown by position with needs highlighted.
- **Export/Import JSON** — back up your rankings or move them to another
  computer.

## Local development

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

1. Create a new GitHub repo (e.g. `draft-tracker`) and push this project
   to the `main` branch.
2. In the repo, go to **Settings → Pages → Build and deployment → Source**
   and select **GitHub Actions**. The included workflow
   (`.github/workflows/deploy.yml`) will build and publish on every push
   to `main`.
3. **Important:** open `vite.config.js` and set `base` to match your repo
   name, e.g. `base: '/draft-tracker/'`. If you're deploying to a
   user/org page (`yourname.github.io`), set it to `base: '/'` instead.
4. Push to `main` — the Actions tab will show the deploy running, and your
   app will be live at `https://<username>.github.io/draft-tracker/`.

## Data & privacy

All your rankings and draft state live in your browser's localStorage —
nothing is sent anywhere. Use **Export JSON** before clearing browser data
or switching computers, and **Import JSON** to restore.

## Season-to-season reuse

Your rankings carry over year to year, but pick history doesn't reset
itself — use **Reset Draft** at the top of the Draft Board tab before your
next draft to clear picks while keeping your player list, or start fresh
by editing the Rankings tab directly.
