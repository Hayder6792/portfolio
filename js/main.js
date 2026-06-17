/* ============================================================
   Hayder Hasan — portfolio interactions
   Vanilla JS, no dependencies. Everything degrades gracefully.
   ============================================================ */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;

  /* ---------- year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- preloader ---------- */
  const loader = document.getElementById("loader");
  const countEl = document.getElementById("loaderCount");
  const barEl = document.getElementById("loaderBar");

  function finishLoad() {
    document.body.classList.add("is-ready");
    if (loader) loader.classList.add("is-done");
  }

  if (loader && !reduceMotion) {
    let n = 0;
    const tick = () => {
      n += Math.max(1, Math.round((100 - n) * 0.08));
      if (n >= 100) n = 100;
      countEl.textContent = n;
      barEl.style.width = n + "%";
      if (n < 100) {
        setTimeout(tick, 40 + Math.random() * 50);
      } else {
        setTimeout(finishLoad, 350);
      }
    };
    window.addEventListener("load", () => setTimeout(tick, 120));
    // safety net so the page never stays hidden
    setTimeout(finishLoad, 4000);
  } else {
    finishLoad();
  }

  /* ---------- custom cursor ---------- */
  if (canHover) {
    const cursor = document.querySelector(".cursor");
    const dot = document.querySelector(".cursor__dot");
    const ring = document.querySelector(".cursor__ring");
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    });

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    };
    loop();

    document.addEventListener("mousedown", () => cursor.classList.add("is-down"));
    document.addEventListener("mouseup", () => cursor.classList.remove("is-down"));

    const hot = "a, button, [data-magnetic], .project__link";
    document.querySelectorAll(hot).forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
  }

  /* ---------- magnetic elements ---------- */
  if (canHover && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = el.classList.contains("btn") ? 0.4 : 0.28;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0,0)";
      });
    });
  }

  /* ---------- scroll progress ---------- */
  const progress = document.getElementById("progress");
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    if (progress) progress.style.width = (scrolled * 100) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- per project accent ---------- */
  document.querySelectorAll(".project[data-accent]").forEach((el) => {
    el.style.setProperty("--accent", el.dataset.accent);
  });

  /* ---------- reactive grid canvas (hero) ---------- */
  const canvas = document.getElementById("grid");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, dots = [];
    const gap = 38;
    const mouse = { x: -999, y: -999 };

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = gap; y < h; y += gap) {
        for (let x = gap; x < w; x += gap) {
          dots.push({ x, y });
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const reach = 150;
        let r = 1;
        let a = 0.16;
        if (dist < reach) {
          const f = 1 - dist / reach;
          r = 1 + f * 2.6;
          a = 0.16 + f * 0.7;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216, 210, 196, ${a})`;
        ctx.fill();
      }
    }
    // only animate on real pointer devices; on touch draw one static frame (saves battery)
    function animate() { draw(); requestAnimationFrame(animate); }

    const heroEl = document.querySelector(".hero");
    heroEl.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    heroEl.addEventListener("mouseleave", () => { mouse.x = -999; mouse.y = -999; });

    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { build(); if (!canHover) draw(); }, 150); });
    build();
    if (canHover) animate(); else draw();
  }

  /* ---------- smooth anchor offset for fixed nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
})();
