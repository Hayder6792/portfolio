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
| `index.html` | The whole page. Featured work, the smaller builds index, about, contact. |
| `css/styles.css` | All styling. Design tokens live in `:root` at the top. |
| `js/main.js` | Scroll reveal, the nav that settles on scroll, and the copy email button. |
| `assets/` | Project screenshots plus `og.jpg`, the social share card. |
| `work/` | Two bundled pages that are not hosted anywhere else: the Northlight Psychiatry concept and OFF HOURS. |

Type is Instrument Serif for display and Inter for everything else, both from
Google Fonts. The palette is warm near black with a bone foreground. Each
featured project sets its own accent colour via `data-accent`, which `main.js`
copies into a CSS custom property.

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

## A note on the copy

Two rules the copy follows on purpose:

1. **No dashes.** No em dashes, en dashes or hyphens as punctuation anywhere in
   visible copy. Use periods and commas instead.
2. **Every project is labelled for what it actually is.** Client build, demo,
   concept, or speculative. The smaller builds were not commissioned and the
   page says so. Do not let this drift.
