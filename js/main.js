/* ============================================================
   Hayder Hasan — portfolio interactions
   Vanilla JS, no dependencies. A language switch, a reveal on
   scroll, and a copy button. Everything degrades gracefully.
   ============================================================ */

(() => {
  "use strict";

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- language ----------
     Romanian is the default and is what ships in the HTML, so a Romanian
     visitor never sees a flash of English. English is opt in, via the
     switch, a saved choice, or ?lang=en. */
  const DEFAULT_LANG = "ro";
  const LANGS = ["ro", "en"];
  const STORE_KEY = "hh-lang";

  const META = {
    ro: "Web designer și developer în Cluj. Proiecte recente: re.born, Concourse, MatchSpace, UMF Cluj Research și un concept pentru un cabinet de psihiatrie.",
    en: "Web designer and developer in Cluj. Recent work: re.born, Concourse, MatchSpace, UMF Cluj Research and a Toronto psychiatry concept.",
  };
  const COPIED = {
    ro: "Copiat.",
    en: "Copied.",
  };

  let lang = DEFAULT_LANG;

  function readStored() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function writeStored(v) {
    try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* private mode, ignore */ }
  }

  function pickInitialLang() {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (LANGS.indexOf(fromUrl) !== -1) return fromUrl;
    const stored = readStored();
    if (LANGS.indexOf(stored) !== -1) return stored;
    return DEFAULT_LANG;
  }

  function applyLang(next, persist) {
    if (LANGS.indexOf(next) === -1) next = DEFAULT_LANG;
    lang = next;
    document.documentElement.lang = next;

    document.querySelectorAll("[data-" + next + "]").forEach((el) => {
      const val = el.getAttribute("data-" + next);
      if (val !== null) el.innerHTML = val;
    });

    document.querySelectorAll("[data-aria-" + next + "]").forEach((el) => {
      const val = el.getAttribute("data-aria-" + next);
      if (val !== null) el.setAttribute("aria-label", val);
    });

    const desc = document.getElementById("metaDesc");
    if (desc && META[next]) desc.setAttribute("content", META[next]);

    document.querySelectorAll(".lang__btn").forEach((b) => {
      const on = b.dataset.lang === next;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    // keep the URL shareable without reloading. Romanian is the bare URL.
    const url = new URL(window.location.href);
    if (next === DEFAULT_LANG) url.searchParams.delete("lang");
    else url.searchParams.set("lang", next);
    window.history.replaceState(null, "", url);

    if (persist) writeStored(next);

    stampYear();
  }

  /* ---------- year ----------
     Re-stamped after a language swap, because the title block cell that
     holds it is itself translated and gets its innerHTML replaced. */
  function stampYear() {
    const y = String(new Date().getFullYear());
    const a = document.getElementById("year");
    const b = document.getElementById("tbYear");
    if (a) a.textContent = y;
    if (b) b.textContent = y;
  }

  applyLang(pickInitialLang(), false);

  document.querySelectorAll(".lang__btn").forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.dataset.lang, true));
  });

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- contact ---------- */
  // No form. The site has no mail backend, and a form that posts nowhere fails
  // silently for anyone on webmail or a phone. The address is the contact.
  const copyBtn = document.getElementById("copyMail");
  if (copyBtn) {
    const status = document.getElementById("contactStatus");
    const ADDR = "hayderahasan@icloud.com";
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(ADDR);
        status.textContent = COPIED[lang] || COPIED.ro;
      } catch (err) {
        status.textContent = ADDR;
      }
    });
  }

  /* ---------- anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const behavior = reduce ? "auto" : "smooth";
      if (id === "#") { e.preventDefault(); window.scrollTo({ top: 0, behavior: behavior }); return; }
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: behavior });
    });
  });
})();
