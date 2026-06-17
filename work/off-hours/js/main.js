/* ============================================================
   OFF HOURS — interactions
   Nav, crew rendering, scroll reveals, form submission (guest list
   + RSVP), and the RSVP modal. Submissions go to the endpoint in
   js/config.js, or run in DEMO MODE when none is set.
   ============================================================ */

(function () {
  const CFG = window.OFFHOURS_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- wire up config-driven links ---------- */
  function applyConfig() {
    const year = $("#year"); if (year) year.textContent = new Date().getFullYear();

    const handle = CFG.instagramHandle || "@offhours";
    const url = CFG.instagram || "#";
    const h = $("#insta-handle"); if (h) h.textContent = handle;
    [$("#insta-link"), $("#insta-link-foot")].forEach(a => { if (a) a.href = url; });

    const email = $("#email-link");
    if (email && CFG.contactEmail) email.href = "mailto:" + CFG.contactEmail;
  }

  /* ---------- mobile nav ---------- */
  function nav() {
    const bar = $(".nav"), burger = $("#burger");
    if (!bar || !burger) return;
    const toggle = (open) => {
      bar.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    };
    burger.addEventListener("click", () => toggle(!bar.classList.contains("open")));
    $$(".nav__links a").forEach(a => a.addEventListener("click", () => toggle(false)));
  }

  /* ---------- scroll reveal ---------- */
  function reveal() {
    const els = $$(".section, .hero__inner > *, .event, .crew-card");
    els.forEach(el => el.classList.add("reveal"));
    if (!("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }

  /* ---------- form submission (shared by list + rsvp) ---------- */
  async function submitForm(form, statusEl, extra = {}) {
    const data = Object.fromEntries(new FormData(form).entries());
    Object.assign(data, extra, { _source: "offhours-site", _ts: new Date().toISOString() });

    // basic validation
    if (!data.name || !data.email || !/.+@.+\..+/.test(data.email)) {
      setStatus(statusEl, "Add a name and a valid email.", "err");
      return;
    }
    setStatus(statusEl, "Sending…", "");

    // DEMO MODE, no endpoint configured
    if (!CFG.formEndpoint) {
      await wait(600);
      console.info("[OFF HOURS] DEMO submission (set formEndpoint in js/config.js to go live):", data);
      done(form, "Demo mode is on. Set a form endpoint in js/config.js to collect these for real.");
      return;
    }

    try {
      const res = await fetch(CFG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      done(form, "You're in. We will reach out when there is a meet up.");
    } catch (err) {
      console.error("[OFF HOURS] submit failed:", err);
      setStatus(statusEl, "That did not go through. Try again, or message us on Instagram.", "err");
    }
  }

  function done(form, msg) {
    form.innerHTML = `<p style="font-family:'Anton',sans-serif;font-size:1.6rem;text-transform:uppercase;color:var(--accent)">You're on the list.</p><p style="color:var(--muted)">${escapeHtml(msg)}</p>`;
    form.classList.add("is-done");
  }
  function setStatus(el, msg, kind) {
    if (!el) return;
    el.textContent = msg;
    el.className = "form__status" + (kind ? " is-" + kind : "");
  }
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  function forms() {
    const listForm = $("#list-form");
    if (listForm) listForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitForm(listForm, $("#list-status"), { type: "guest-list" });
    });

    const rsvpForm = $("#rsvp-form");
    if (rsvpForm) rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const ev = rsvpForm.dataset.eventId || "";
      submitForm(rsvpForm, $("#rsvp-status"), { type: "rsvp", eventId: ev });
    });
  }

  /* ---------- RSVP modal ---------- */
  function modal() {
    const m = $("#rsvp-modal");
    if (!m) return;
    const open = (id) => {
      const ev = (window.OFFHOURS_EVENTS || {})[id];
      if (!ev) return;
      $("#rsvp-title").textContent = ev.title;
      $("#rsvp-meta").textContent = [ev.date, ev.time, ev.venue].filter(Boolean).join(" · ");
      const field = $("#rsvp-event-field"); if (field) field.value = ev.title;
      $("#rsvp-form").dataset.eventId = id;
      m.classList.add("is-open");
      m.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => $("#rsvp-name") && $("#rsvp-name").focus(), 80);
    };
    const close = () => {
      m.classList.remove("is-open");
      m.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    // delegate RSVP buttons (events render after this runs)
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-rsvp]");
      if (btn) { e.preventDefault(); open(btn.getAttribute("data-rsvp")); }
      if (e.target.closest("[data-close]")) close();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ---------- helpers ---------- */
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    nav();
    forms();
    modal();
    reveal();
  });
})();
