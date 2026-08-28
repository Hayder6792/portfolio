/* Hayder Hasan. One file, no dependencies.
   Nothing here is required for the page to be readable: all content is in the
   HTML and the only JS-gated styling is scoped under html.js in the stylesheet. */
(function () {
  "use strict";

  var EMAIL = "hayderahasan@icloud.com";
  var mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mqHover = window.matchMedia("(hover: hover)");
  var reduceMotion = mqMotion.matches;

  /* ---------- year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- scroll progress ---------- */
  var progress = document.getElementById("progress");
  if (progress) {
    var ticking = false;
    var setProgress = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      progress.style.width = pct + "%";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(setProgress); }
    }, { passive: true });
    setProgress();
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = document.querySelectorAll(".reveal");
  var showAll = function () {
    for (var i = 0; i < revealables.length; i++) revealables[i].classList.add("is-in");
  };
  // Anything already on screen is shown without waiting for the observer.
  // This is the safety net: content must never be stuck invisible, whatever
  // the scroll position is at load (a deep link like /#contact lands mid page).
  var revealVisible = function () {
    for (var i = 0; i < revealables.length; i++) {
      var el = revealables[i];
      if (el.classList.contains("is-in")) continue;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
    }
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    for (var j = 0; j < revealables.length; j++) io.observe(revealables[j]);

    revealVisible();
    window.addEventListener("load", revealVisible);
    window.addEventListener("hashchange", revealVisible);
    // late passes, in case layout or an image settles the scroll position
    window.setTimeout(revealVisible, 250);
    window.setTimeout(revealVisible, 1000);
    window.setTimeout(revealVisible, 2500);
  }

  /* ---------- per project accent ---------- */
  var accented = document.querySelectorAll("[data-accent]");
  for (var k = 0; k < accented.length; k++) {
    accented[k].style.setProperty("--accent", accented[k].dataset.accent);
  }

  /* ---------- hero dot grid ---------- */
  var canvas = document.getElementById("grid");
  var hero = document.querySelector(".hero");
  if (canvas && hero && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var dots = [];
    var mouse = { x: -9999, y: -9999 };
    var w = 0, h = 0;
    var running = false;
    var visible = true;
    var rafId = null;

    // read the brand colour from CSS so retheming the token retints the canvas
    var bone = (getComputedStyle(document.documentElement)
      .getPropertyValue("--bone") || "#d8d2c4").trim();
    var rgb = (function (hex) {
      var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [216, 210, 196];
    })(bone);
    var rgbPrefix = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",";

    var MAX_DOTS = 1200;   // hard cap: a 3440px display used to allocate ~3200
    var REACH = 150;

    function build() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (!w || !h) { dots = []; return; }

      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // grow the spacing until the grid fits inside the cap
      var gap = 38;
      while ((Math.floor(w / gap) * Math.floor(h / gap)) > MAX_DOTS) gap += 4;

      dots = [];
      for (var x = gap; x < w; x += gap) {
        for (var y = gap; y < h; y += gap) dots.push({ x: x, y: y });
      }
    }

    function draw() {
      if (!dots.length) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var dx = d.x - mouse.x, dy = d.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var t = dist < REACH ? 1 - dist / REACH : 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1 + t * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = rgbPrefix + (0.16 + t * 0.7).toFixed(3) + ")";
        ctx.fill();
      }
    }

    function loop() {
      draw();
      rafId = window.requestAnimationFrame(loop);
    }
    function start() {
      if (running || !visible || !mqHover.matches) return;
      running = true; loop();
    }
    function stop() {
      running = false;
      if (rafId) { window.cancelAnimationFrame(rafId); rafId = null; }
    }

    build();
    draw();

    // never burn frames on a hero that is scrolled out of view
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0 }).observe(hero);
    } else {
      start();
    }

    if (mqHover.matches) {
      hero.addEventListener("mousemove", function (e) {
        var r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      }, { passive: true });
      hero.addEventListener("mouseleave", function () {
        mouse.x = -9999; mouse.y = -9999;
      });
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () { build(); draw(); }, 150);
    });
  }

  /* ---------- contact form ----------
     The action still carries the REPLACE sentinel, so this composes a mail
     message instead of posting. Paste a real endpoint in and the fetch path
     takes over with no other change. */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("contactStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        if (status) status.textContent = "Please fill in all three fields.";
        form.reportValidity();
        return;
      }
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();
      var action = form.getAttribute("action") || "";

      if (action.indexOf("REPLACE") !== -1) {
        var subject = encodeURIComponent("Enquiry from " + name);
        var body = encodeURIComponent(message + "\n\nFrom: " + name + " <" + email + ">");
        if (status) status.textContent = "Opening your email app with this message ready to send.";
        window.location.href = "mailto:" + EMAIL + "?subject=" + subject + "&body=" + body;
        return;
      }

      if (status) status.textContent = "Sending.";
      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (!res.ok) throw new Error("bad response");
        form.reset();
        if (status) status.textContent = "Thank you. I will get back to you soon.";
      }).catch(function () {
        if (status) status.textContent = "That did not send. Write to " + EMAIL + " directly.";
      });
    });
  }

  /* ---------- smooth anchors ---------- */
  var anchors = document.querySelectorAll('a[href^="#"]');
  for (var a = 0; a < anchors.length; a++) {
    anchors[a].addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (!href || href.length < 2) return;
      var behavior = mqMotion.matches ? "auto" : "smooth";
      if (href === "#top") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: behavior });
        return;
      }
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: behavior, block: "start" });
    });
  }
})();
