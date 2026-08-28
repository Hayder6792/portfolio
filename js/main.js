/* ============================================================
   Hayder Hasan — portfolio interactions
   Vanilla JS, no dependencies. Deliberately quiet: a gentle
   reveal, a nav that settles on scroll, and a copy button.
   Everything degrades gracefully.
   ============================================================ */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- nav settles into a bar once you leave the hero ---------- */
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle("is-stuck", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- per project accent ---------- */
  document.querySelectorAll("[data-accent]").forEach((el) => {
    el.style.setProperty("--accent", el.dataset.accent);
  });

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
        status.textContent = "Copied. Paste it wherever you read your mail.";
      } catch (err) {
        status.textContent = ADDR;
      }
    });
  }

  /* ---------- smooth anchor offset for the fixed nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const behavior = reduceMotion ? "auto" : "smooth";
      // #top is the fixed nav, which scrollIntoView treats as always visible, so jump to page top
      if (id === "#top") { e.preventDefault(); window.scrollTo({ top: 0, behavior: behavior }); return; }
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: behavior });
    });
  });
})();
