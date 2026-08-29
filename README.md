# Hayder Hasan — Portfolio

Live at **https://hayderahasan.com**

A no build static site (plain HTML, CSS, JS). No framework, no dependencies, no
build step. This is the thing you send someone when they ask to see your work.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
cd ~/portfolio
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploying

The repo is connected to Vercel. **Pushing to `main` deploys it.** The apex
domain `hayderahasan.com` is the primary; `www` redirects to it. DNS is on
Cloudflare (A `@` to 76.76.21.21, CNAME `www` to cname.vercel-dns.com, both
DNS only / grey cloud).

## How it is put together

| File | What is in it |
|---|---|
| `index.html` | The whole page. Featured work, about, contact. Both languages live here as `data-ro` and `data-en` attributes. |
| `css/styles.css` | All styling. Design tokens live in `:root` at the top. |
| `js/main.js` | The language switch, scroll reveal, and the copy email button. |
| `assets/` | Project screenshots plus `og.jpg`, the social share card. |
| `work/` | Bundled pages not hosted anywhere else. `psychiatry/` is linked from the page. `off-hours/` is kept but no longer linked, along with `assets/off-hours.jpg`. |

## The design

The page is a **drawing sheet**, the same system as the MC Bauplanung mock in
`~/clients/mc-bauplanung`. Tokens, fonts and grid are deliberately identical, so
a change to one is worth mirroring in the other.

- **Ground:** paper `#E7E5DE` with a blueprint grid drawn in CSS gradients, minor
  9px and major 54px, in faint blue. A fixed double `.frame` border sits over it
  with rotated zone labels in the margins.
- **Colour has meaning.** Black ink is fact, **red is the author speaking**, blue
  is for links and drawing lines. That is why every honesty label on a project
  (`.note`) is red: it reads as markup pencilled onto the sheet, which is exactly
  what it is. Do not restyle those to look like ordinary body copy.
- **Type:** Archivo variable for display, set wide and uppercase
  (`font-variation-settings:"wdth" 122` on `h1`), IBM Plex Mono for every label,
  caption, nav item and annotation.
- **Components:** `.plate` is a project, drawn as a bordered figure with a mono
  caption strip underneath, like a numbered drawing plate. `.shead` is a section
  head with a lettered circle. `.titleblock` is the cartouche at the foot of the
  sheet.
- Per project accent colours are gone. The palette is ink, red and blue only.

What is **not** carried over from the MC Bauplanung sheet, on purpose: the red
demo ribbon, the `noindex` tags and the revision clouds around empty slots. All
three exist to mark that mock as an unofficial proposal with content withheld.
This site is neither.

There is no contact form. The site has no mail backend, and a form that posts
nowhere fails silently, so the email address plus a copy button is the contact.

## Updating the screenshots

Shots are captured headless at 1600x1040 and resized to 1400 wide:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --virtual-time-budget=10000 --window-size=1600,1040 \
  --screenshot=out.png https://example.com
sips -s format jpeg -s formatOptions 72 -Z 1400 out.png --out assets/name.jpg
```

Note that headless Chrome clamps the window width to about 500px, so true
sub-500 mobile shots are unreliable. Check mobile at 500px or wider.

## Languages

**Romanian is the default.** It is what ships in the HTML itself, so a Romanian
visitor never sees a flash of English, and crawlers read Romanian. English is
opt in.

- Every translatable element carries `data-ro` and `data-en`. The visible text in
  the file is the Romanian one. `applyLang()` in `js/main.js` swaps `innerHTML`
  from the matching attribute.
- Accessible names use the same idea with `data-aria-ro` / `data-aria-en`.
- The swap uses `innerHTML`, so an attribute may hold markup. Keep it that way
  only where it is needed: in each project link the arrow SVG is a **sibling** of
  the translated `<span>`, not part of it, which keeps the attributes plain text.
  All of it is authored here, none of it is user input.
- Language is picked in this order: `?lang=` in the URL, then the saved choice in
  `localStorage`, then Romanian.
- `hayderahasan.com` is the Romanian URL, `hayderahasan.com/?lang=en` the English
  one. Both are declared with `hreflang`, and the switch rewrites the URL with
  `replaceState` so the current view is always shareable.

**To add a string:** put the Romanian in the element, and add both attributes.
Miss the `data-en` and that element simply stays Romanian when someone switches,
which is easy to overlook, so check both languages after editing copy.

The meta description and the copy confirmation message are not in the HTML, they
live in the `META` and `COPIED` objects at the top of `main.js`. Keep them in sync.

The social card `assets/og.jpg` is Romanian and drawn in the same sheet style,
with its own title block. It is generated by hand from a
throwaway HTML file, so if the headline changes, regenerate it.

## A note on the copy

Two rules the copy follows on purpose:

1. **No dashes.** No em dashes, en dashes or hyphens as punctuation anywhere in
   visible copy. Use periods and commas instead.
2. **Every project is labelled for what it actually is.** Client build, demo, or
   concept, stated on the card itself. re.born is pre launch, Concourse runs on
   invented data, UMF Cluj Research is student built and not endorsed by the
   university. Do not let this drift.
