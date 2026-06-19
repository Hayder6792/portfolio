# Hayder Hasan — Portfolio

A no build static site (plain HTML, CSS, JS). No framework, no dependencies, so it
hosts for free anywhere and loads fast. This is the thing you send a client when
they ask to see your work.

## Run it locally

Just open `index.html` in a browser, or for a proper local server:

```bash
cd ~/portfolio
python3 -m http.server 8080
# then open http://localhost:8080
```

## Put it online (free, ~2 minutes)

Pick one. All give you a live URL you can send.

**Netlify (drag and drop, no account terminal needed)**
1. Go to https://app.netlify.com/drop
2. Drag the whole `portfolio` folder onto the page
3. You get a URL like `your-site.netlify.app`. Done.

**Vercel (CLI)**
```bash
cd ~/portfolio
npx vercel        # first run links/creates the project
npx vercel --prod # publish
```

**GitHub Pages**
1. Push this folder to a GitHub repo
2. Repo Settings → Pages → deploy from branch `main`, root
3. Live at `username.github.io/repo`

A custom domain (`hayderhasan.com`, around 10 to 15 a year) can point at any of
these later. Not needed to start.

## Make it yours

Everything is editable in `index.html`. The likely edits:

- **Project links.** Each card opens its landing page in a new tab:
  - MatchSpace → `https://matchspace.vercel.app`, UMF Cluj Research → `https://umfclujresearch.org` (both live).
  - OFF HOURS opens a bundled landing page under `work/off-hours/`. When it's deployed,
    swap that card's `href` to the real live URL.
- **Screenshots.** Each card uses a real screenshot of the actual app, stored in
  `assets/` (`psychiatry.jpg`, `matchspace.jpg`, `off-hours.jpg`, `umfcluj.jpg`). To refresh
  one, run the app, take a new shot at roughly a 1600x1040 ratio, and overwrite the
  file. They are sized to the card ratio so they sit flush with no awkward cropping.
- **Bio and name.** The About section and the hero copy are plain text near the
  top of `index.html`.
- **Social preview.** Add a 1200x630 image at `assets/og.jpg` so the link unfurls
  nicely when shared.

## What is in here

```
portfolio/
├── index.html      all content and structure
├── css/styles.css  the look: dark, editorial, near monochrome
├── js/main.js      preloader, custom cursor, magnetic buttons,
│                   reactive hero grid, scroll reveal, progress bar
├── assets/         project screenshots and og.jpg
└── work/           landing pages opened by the cards
    ├── psychiatry/ Northlight Psychiatry, a Toronto psychiatry concept (featured)
    └── off-hours/  the real static OFF HOURS site
```

The first project, **Northlight Psychiatry**, is a concept site built to show the kind
of calm, reassuring, booking-focused work a healthcare practice wants. Swap or expand
it as you target real clients in that space.

## Notes

- Fully responsive and keyboard friendly.
- Respects `prefers-reduced-motion`: all animation turns off for users who ask.
- The custom cursor and magnetic effects only run on devices with a real pointer,
  so touch devices behave normally.
