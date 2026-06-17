/* ============================================================
   OFF HOURS — events loader
   Reads data/events.json and renders the Upcoming section.
   Wires each "RSVP" button to open the RSVP modal (see main.js).
   ============================================================ */

(function () {
  const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  function fmt(dateStr) {
    // dateStr = "YYYY-MM-DD" — parse as local, not UTC, to avoid day-shift
    const [y, m, d] = dateStr.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return { day: d, mon: MONTHS[m - 1], full: dt, label: dt.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) };
  }

  function isPast(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return dt < today;
  }

  function eventCard(ev) {
    const f = fmt(ev.date);
    const past = isPast(ev.date);
    const tags = (ev.tags || []).map(t => `<span class="event__tag">${esc(t)}</span>`).join("");

    let cta;
    if (past) {
      cta = `<span class="event__free">Past</span><a class="btn btn--ghost" href="${instaUrl()}" target="_blank" rel="noopener">See photos</a>`;
    } else if (ev.soldOut) {
      cta = `<span class="event__free event__sold">Full</span><a class="btn btn--ghost" href="#list">Get on the list</a>`;
    } else {
      cta = `${ev.free ? '<span class="event__free">Free</span>' : ""}<button class="btn btn--accent" data-rsvp="${esc(ev.id)}">RSVP</button>`;
    }

    return `
      <article class="event ${past ? "event--past" : ""}" id="ev-${esc(ev.id)}">
        <div class="event__date">
          <span class="event__day">${f.day}</span>
          <span class="event__mon">${f.mon}</span>
        </div>
        <div class="event__body">
          <div class="event__tags">${tags}</div>
          <h3>${esc(ev.title)}</h3>
          <p class="event__meta"><span>${f.label}</span> · ${esc(ev.time || "")} · ${esc(ev.venue || "")}${ev.city ? " · " + esc(ev.city) : ""}</p>
          ${ev.blurb ? `<p class="event__meta">${esc(ev.blurb)}</p>` : ""}
        </div>
        <div class="event__cta">${cta}</div>
      </article>`;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function instaUrl() {
    return (window.OFFHOURS_CONFIG && window.OFFHOURS_CONFIG.instagram) || "#";
  }

  async function load() {
    const wrap = document.getElementById("events-list");
    if (!wrap) return;
    try {
      const res = await fetch("data/events.json", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const list = (data.events || []).slice().sort((a, b) => a.date.localeCompare(b.date));

      const upcoming = list.filter(e => !isPast(e.date));
      const past = list.filter(e => isPast(e.date)).reverse();
      const ordered = [...upcoming, ...past];

      // expose for the RSVP modal
      window.OFFHOURS_EVENTS = {};
      list.forEach(e => { window.OFFHOURS_EVENTS[e.id] = e; });

      if (!ordered.length) {
        wrap.innerHTML = `<div class="events__empty">Nothing on the calendar right now. Get on the list and we will let you know.</div>`;
        return;
      }
      wrap.innerHTML = ordered.map(eventCard).join("");
      document.dispatchEvent(new CustomEvent("events:rendered"));
    } catch (err) {
      wrap.innerHTML = `<div class="events__empty">Could not load this right now. <a href="#list" style="color:var(--accent)">Get on the list</a> for updates.</div>`;
      console.error("[OFF HOURS] events load failed:", err);
    }
  }

  document.addEventListener("DOMContentLoaded", load);
})();
