/* ════════════════════════════════════════════════════════════════
   STACX site interactions
   ════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ── Nav: scrolled state ─────────────────────────────────────── */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu toggle ──────────────────────────────────────── */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  /* ── Scroll reveal ───────────────────────────────────────────── */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ── Animated comparison bars ────────────────────────────────── */
  var bars = Array.prototype.slice.call(document.querySelectorAll(".bar-fill"));
  if ("IntersectionObserver" in window) {
    var bo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); bo.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (el) { bo.observe(el); });
  } else {
    bars.forEach(function (el) { el.classList.add("in"); });
  }

  /* ── Count-up stats ──────────────────────────────────────────── */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    var dur = 1100, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ── Scrollspy: active nav link ──────────────────────────────── */
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
  var sections = navAnchors
    .map(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      return sec ? { a: a, sec: sec } : null;
    })
    .filter(Boolean);

  function spy() {
    var pos = window.scrollY + 120;
    var current = null;
    sections.forEach(function (s) {
      if (s.sec.offsetTop <= pos) current = s;
    });
    navAnchors.forEach(function (a) { a.classList.remove("active"); });
    if (current) current.a.classList.add("active");
  }
  window.addEventListener("scroll", spy, { passive: true });
  spy();

  /* ── Copy BibTeX ─────────────────────────────────────────────── */
  var copyBtn = document.getElementById("copyBtn");
  var bib = document.getElementById("bibtex");
  if (copyBtn && bib) {
    copyBtn.addEventListener("click", function () {
      var text = bib.textContent;
      var done = function () {
        var orig = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Copied';
        setTimeout(function () { copyBtn.innerHTML = orig; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta); done();
      }
    });
  }
})();

/* ════════════════════════════════════════════════════════════════
   Experiments: Script / Results tabs + animated result curves
   ════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var DRAW_MS = 1500;   /* per-line draw duration */
  var STAGGER_MS = 220; /* delay between successive lines in one chart */

  /* Animate every data line (path) and data point (g > circle) in the
     pane's charts: lines draw left-to-right from step 0 via
     stroke-dashoffset; points pop in as the line reaches them. */
  function animateCharts(pane) {
    pane.querySelectorAll(".chart svg").forEach(function (svg) {
      var paths = Array.prototype.slice.call(svg.querySelectorAll("path"));
      var groups = Array.prototype.slice.call(svg.querySelectorAll("g"));
      paths.forEach(function (path, i) {
        var len = path.getTotalLength();
        path.style.transition = "none";
        path.style.strokeDasharray = len + " " + len;
        path.style.strokeDashoffset = len;
        path.getBoundingClientRect(); /* force reflow so the reset applies */
        path.style.transition = "stroke-dashoffset " + DRAW_MS + "ms cubic-bezier(0.4,0,0.2,1) " + (i * STAGGER_MS) + "ms";
        path.style.strokeDashoffset = "0";
      });
      groups.forEach(function (g, gi) {
        var dots = Array.prototype.slice.call(g.querySelectorAll("circle"));
        var last = Math.max(dots.length - 1, 1);
        dots.forEach(function (dot, di) {
          dot.style.transition = "none";
          dot.style.opacity = "0";
          dot.getBoundingClientRect();
          var delay = gi * STAGGER_MS + (di / last) * DRAW_MS;
          dot.style.transition = "opacity 0.25s ease " + delay + "ms";
          dot.style.opacity = "1";
        });
      });
    });
  }

  document.querySelectorAll(".exp-tabs").forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll(".exp-tab"));
    var panes = Array.prototype.slice.call(root.querySelectorAll(".exp-pane"));
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("is-active"); });
        panes.forEach(function (p) { p.classList.remove("is-active"); });
        tab.classList.add("is-active");
        var pane = root.querySelector('.exp-pane[data-pane="' + tab.getAttribute("data-tab") + '"]');
        if (pane) pane.classList.add("is-active");
        /* re-render the curves from step 0 on every Results click */
        if (tab.getAttribute("data-tab") === "results" && pane) animateCharts(pane);
      });
    });
  });
})();
