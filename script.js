/* HEIST HQ 365, case-file logic: evidence board, declassification, timeline filter, Case Files index.
   Labeling discipline (from the GTA lane): CONFIRMED = official source; REPORT = credited reporting;
   RUMOR = community claim, never presented as fact. Fiction is labeled FICTION. */

/* ===== CASE FILES (Guides hub) =====
   HOW TO ADD A GUIDE: append one object to this array.
   Fields: title, dek (one line), category, date, tag (small caps label under the card).
   Guides are companions to the video coverage, keep the CONFIRMED/RUMOR discipline inside them. */
var CASE_FILES = [
  {
    title: "Reading a Rockstar Trailer Like a Heist Board",
    dek: "The desk's method, pinned out: how we break a trailer into exhibits, what's shown, what's said, what's conspicuously missing, and how each piece earns its label.",
    category: "Method",
    date: "Oct 29, 2026",
    tag: "Launch entry · Companion guide"
  },
  {
    title: "Every Confirmed GTA VI Detail So Far",
    dek: "The living confirmed file in one read: Leonida, Lucia and Jason, the November 19, 2026 date, only what Rockstar or an official source has actually put on the record.",
    category: "The File",
    date: "Oct 29, 2026",
    tag: "Launch entry · Confirmed only"
  },
  {
    title: "Concept vs. Confirmed: How We Label Coverage",
    dek: "Why some GTA videos say [CONCEPT] or [RUMOR] in the title, what each label promises you, and how a rumor graduates to the confirmed file, with receipts.",
    category: "Method",
    date: "Oct 29, 2026",
    tag: "Launch entry · Companion guide"
  }
];

/* ===== EXHIBITS ===== */
var EXHIBITS = [
  {
    file: "EXHIBIT A / ACTIVE LANE",
    title: "The GTA VI Watch",
    body: "The desk's flagship beat: trailer breakdowns, official-announcement coverage, and the running confirmed file on Grand Theft Auto VI, Leonida, Lucia and Jason, and the road to <strong>November 19, 2026</strong>. Every video separates what Rockstar has confirmed from what the community believes, on screen, every time.",
    note: "METHOD: Commentary over credited official material. Speculation is labeled [CONCEPT] / [RUMOR] in titles and on screen."
  },
  {
    file: "EXHIBIT B / ORIGINAL WORK",
    title: "The Fiction File",
    body: "Original heist stories written and narrated by the desk, crews, scores, double-crosses, including the serialized piece <strong>“The Tenth Painting.”</strong> These are invented worlds with invented people. The folder says FICTION because it is.",
    note: "METHOD: No real events, no real people, no borrowed footage. Story first, labeled always."
  },
  {
    file: "EXHIBIT C / THE WIDER BEAT",
    title: "Case Notes",
    body: "The rest of the gaming world, worked the same way: launches, studios, and stories big enough to earn a folder, including launch-week coverage beyond the GTA file when a game demands the full board treatment.",
    note: "METHOD: Same discipline as Exhibit A, official sources for facts, labels for everything else."
  }
];

/* ===== Nav ===== */
(function () {
  var btn = document.getElementById('menuBtn'), links = document.getElementById('navLinks');
  if (btn && links) {
    btn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
    });
  }
})();

var reduceHH = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
(function () {
  var els = [].slice.call(document.querySelectorAll('.reveal'));
  if (reduceHH || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: .15 });
  els.forEach(function (e) { io.observe(e); });
})();

/* ===== Evidence board ===== */
(function () {
  var btns = [].slice.call(document.querySelectorAll('.exhibit'));
  var file = document.getElementById('exFile'), title = document.getElementById('exTitle'),
      body = document.getElementById('exBody'), note = document.getElementById('exNote');
  if (!btns.length || !title) return;
  function select(i) {
    var ex = EXHIBITS[i];
    file.textContent = ex.file; title.textContent = ex.title;
    body.innerHTML = ex.body; note.textContent = ex.note;
    btns.forEach(function (b, j) {
      b.classList.toggle('active', j === i);
      b.setAttribute('aria-pressed', j === i ? 'true' : 'false');
    });
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () { select(parseInt(b.getAttribute('data-exhibit'), 10)); });
  });
  select(0);
})();

/* ===== Declassification (redaction reveals) ===== */
(function () {
  document.querySelectorAll('.redact').forEach(function (bar) {
    bar.addEventListener('click', function () {
      if (bar.classList.contains('revealed')) return;
      bar.classList.add('revealed');
      bar.textContent = bar.getAttribute('data-reveal');
      bar.setAttribute('aria-label', 'Declassified: ' + bar.getAttribute('data-reveal'));
      var tag = bar.parentElement.querySelector('.tag');
      if (tag) tag.hidden = false;
    });
  });
})();

/* ===== Timeline filter ===== */
(function () {
  var btns = [].slice.call(document.querySelectorAll('.filter'));
  var items = [].slice.call(document.querySelectorAll('#tlList li'));
  var empty = document.getElementById('tlEmpty');
  if (!btns.length) return;
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      btns.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var f = b.getAttribute('data-filter'), shown = 0;
      items.forEach(function (li) {
        var match = f === 'all' || li.getAttribute('data-cat') === f;
        li.style.display = match ? '' : 'none';
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  });
})();

/* ===== Case Files render =====
   (Add guides in the CASE_FILES array at the top of this file, see the comment there.) */
(function () {
  var grid = document.getElementById('caseGrid');
  if (!grid) return;
  CASE_FILES.forEach(function (g) {
    var card = document.createElement('article');
    card.className = 'case-card';
    var top = document.createElement('div'); top.className = 'note-top';
    var cat = document.createElement('span'); cat.className = 'note-cat'; cat.textContent = g.category;
    var date = document.createElement('span'); date.className = 'note-date'; date.textContent = g.date;
    top.appendChild(cat); top.appendChild(date);
    var h = document.createElement('h3'); h.textContent = g.title;
    var p = document.createElement('p'); p.textContent = g.dek;
    var tag = document.createElement('span'); tag.className = 'note-tag'; tag.textContent = g.tag;
    card.appendChild(top); card.appendChild(h); card.appendChild(p); card.appendChild(tag);
    grid.appendChild(card);
  });
})();

/* Brand banner parallax, the banner leans toward the visitor pointer. */
(function () {
  var strip = document.querySelector(".banner-strip");
  if (!strip) return;
  var img = strip.querySelector(".banner-img");
  if (!img) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  strip.addEventListener("pointerenter", function () { img.style.animation = "none"; });
  strip.addEventListener("pointermove", function (e) {
    var r = strip.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5;
    var y = (e.clientY - r.top) / r.height - 0.5;
    img.style.transform = "scale(1.1) translate(" + (x * -16) + "px," + (y * -10) + "px)";
  });
  strip.addEventListener("pointerleave", function () { img.style.transform = ""; img.style.animation = ""; });
})();

/* Merch view toggle, flip a garment card between its front and back print. */
(function () {
  document.querySelectorAll(".view-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest("article");
      if (!card) return;
      var front = card.querySelector(".view-front");
      var back = card.querySelector(".view-back");
      if (!back) return;
      var showBack = btn.getAttribute("data-view") === "back";
      if (front) front.hidden = showBack;
      back.hidden = !showBack;
      card.querySelectorAll(".view-btn").forEach(function (b) { b.classList.toggle("on", b === btn); });
    });
  });
})();

/* Highlight voting, one pick per showcase, saved on this device (localStorage). */
(function () {
  var wall = document.getElementById("highlights");
  if (!wall) return;
  var KEY = "heist-highlight-vote";
  var btns = Array.prototype.slice.call(wall.querySelectorAll(".vote-btn:not([disabled])"));
  function paint(pick) {
    btns.forEach(function (b) {
      var mine = b.getAttribute("data-vote") === pick;
      b.classList.toggle("on", mine);
      b.setAttribute("aria-pressed", mine ? "true" : "false");
      var st = b.parentNode.querySelector(".vote-state");
      if (st) st.textContent = mine ? "Your vote" : "";
    });
  }
  var saved = null;
  try { saved = window.localStorage.getItem(KEY); } catch (e) { saved = null; }
  if (saved) paint(saved);
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      var pick = b.getAttribute("data-vote");
      var current = null;
      try { current = window.localStorage.getItem(KEY); } catch (e) { current = null; }
      var next = current === pick ? null : pick;
      try {
        if (next) window.localStorage.setItem(KEY, next); else window.localStorage.removeItem(KEY);
      } catch (e) { /* storage unavailable: the pick still paints for this visit */ }
      paint(next);
    });
  });
})();

/* ===== Scroll progress line + scroll-spy nav ===== */
(function () {
  var bar = document.getElementById("scrollProgress");
  var navLinks = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var targets = [];
  navLinks.forEach(function (a) {
    var t = document.querySelector(a.getAttribute("href"));
    if (t) targets.push({ link: a, el: t });
  });
  function paint() {
    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = "scaleX(" + p + ")";
    }
    var pos = window.scrollY + window.innerHeight * 0.35, current = null;
    targets.forEach(function (t) { if (t.el.offsetTop <= pos) current = t; });
    targets.forEach(function (t) { t.link.classList.toggle("active", t === current); });
  }
  var queued = false;
  window.addEventListener("scroll", function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; paint(); });
  }, { passive: true });
  window.addEventListener("resize", paint);
  paint();
})();

/* Banner scroll parallax, rAF-driven drift, layered under the pointer tilt via the
   standalone translate property so the two never fight over transform. */
(function () {
  var strip = document.querySelector(".banner-strip");
  if (!strip || reduceHH) return;
  var img = strip.querySelector(".banner-img");
  if (!img) return;
  var queued = false;
  function drift() {
    queued = false;
    var r = strip.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    var mid = r.top + r.height / 2 - window.innerHeight / 2;
    var y = Math.max(-16, Math.min(16, mid * -0.05));
    img.style.translate = "0 " + y.toFixed(1) + "px";
  }
  window.addEventListener("scroll", function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(drift);
  }, { passive: true });
  drift();
})();

/* Launch checklist, pre-load ticks save on this device (localStorage).
   Locked play steps are disabled in the markup and never counted. */
(function () {
  var section = document.getElementById("launch-checklist");
  if (!section) return;
  var KEY = "heist-launch-checklist";
  var boxes = Array.prototype.slice.call(section.querySelectorAll("input[data-check]:not([disabled])"));
  var progress = document.getElementById("checklistProgress");
  var stamp = document.getElementById("checklistStamp");
  function load() {
    try { return JSON.parse(window.localStorage.getItem(KEY) || "{}") || {}; }
    catch (e) { return {}; }
  }
  function save(state) {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { /* storage unavailable: ticks still paint for this visit */ }
  }
  function paint() {
    var state = load(), done = 0;
    boxes.forEach(function (b) {
      var on = !!state[b.getAttribute("data-check")];
      b.checked = on;
      var li = b.closest(".check-item");
      if (li) li.classList.toggle("done", on);
      if (on) done++;
    });
    if (progress) progress.textContent = done + " of " + boxes.length + " ready";
    if (stamp) stamp.hidden = done !== boxes.length;
  }
  boxes.forEach(function (b) {
    b.addEventListener("change", function () {
      var state = load(), key = b.getAttribute("data-check");
      if (b.checked) state[key] = true; else delete state[key];
      save(state);
      paint();
    });
  });
  paint();
})();

/* Merch lightbox, click a design for the large view; front/back flip where a back print exists. */
(function () {
  var box = document.getElementById("merchLightbox");
  if (!box) return;
  var img = document.getElementById("lightboxImg");
  var cap = document.getElementById("lightboxCap");
  var toggle = document.getElementById("lightboxToggle");
  var closeBtn = document.getElementById("lightboxClose");
  var views = {}, lastFocus = null;
  function setView(name) {
    if (!views[name]) return;
    img.src = views[name].src;
    img.alt = views[name].alt;
    cap.textContent = views[name].alt;
    toggle.querySelectorAll(".view-btn").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-lb-view") === name);
    });
  }
  function open(card, startView) {
    var front = card.querySelector(".view-front");
    var back = card.querySelector(".view-back");
    if (!front && !back) return;
    views = {};
    if (front) views.front = { src: front.getAttribute("src"), alt: front.getAttribute("alt") || "" };
    if (back) views.back = { src: back.getAttribute("src"), alt: back.getAttribute("alt") || "" };
    toggle.style.display = views.back ? "" : "none";
    lastFocus = document.activeElement;
    box.hidden = false;
    document.body.style.overflow = "hidden";
    setView(startView && views[startView] ? startView : "front");
    closeBtn.focus();
  }
  function close() {
    box.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll("#merch .merch-img").forEach(function (m) {
    m.setAttribute("tabindex", "0");
    m.setAttribute("role", "button");
    m.setAttribute("aria-label", "View larger: " + (m.getAttribute("alt") || "merch design"));
    function go() {
      var card = m.closest("article");
      if (card) open(card, m.classList.contains("view-back") ? "back" : "front");
    }
    m.addEventListener("click", go);
    m.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  });
  toggle.querySelectorAll(".view-btn").forEach(function (b) {
    b.addEventListener("click", function () { setView(b.getAttribute("data-lb-view")); });
  });
  closeBtn.addEventListener("click", close);
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !box.hidden) close();
  });
})();
