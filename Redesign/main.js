/* Prashant Shrestha — portfolio, milestone 1
   Theme, loader, foldable nav, background particles, hero motion.
   No inline handlers, no eval, no innerHTML with dynamic data (strict-CSP friendly). */
/* ---- Part 1: runs immediately (script is in <head>) so the right theme is set before first paint ---- */
(function () {
  var root = document.documentElement;
  var theme = "dark";
  var preferLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  try {
    var saved = localStorage.getItem("portfolio-theme");
    if (saved === "light" || saved === "dark") theme = saved;
    else if (preferLight) theme = "light";
  } catch (e) {
    if (preferLight) theme = "light";
  }
  root.setAttribute("data-theme", theme);
  root.classList.add("js", "loading");
})();

/* ---- Part 2: everything else, runs once the page structure exists ---- */
(function () {
  "use strict";

  function boot() {
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var desktopMQ = window.matchMedia("(min-width: 901px)");
  var hasGsap = function () { return typeof window.gsap !== "undefined"; };

  /* ------------------------------------------------------------------ Theme */
  var themeBtn = $("#themeToggle");

  function labelTheme(t) {
    themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("portfolio-theme", t); } catch (e) { /* storage blocked: ignore */ }
    labelTheme(t);
    document.dispatchEvent(new Event("themechange"));
  }
  labelTheme(root.getAttribute("data-theme"));

  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    if (!document.startViewTransition || reduce) { setTheme(next); return; }
    var r = themeBtn.getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    var vt = document.startViewTransition(function () { setTheme(next); });
    vt.ready.then(function () {
      root.animate(
        { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + end + "px at " + x + "px " + y + "px)"] },
        { duration: 650, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(function () { /* transition skipped */ });
  });

  /* ----------------------------------------------------------------- Loader */
  var loader = $("#loader");
  var ring = $("#ringFill");
  var countEl = $("#loaderCount");
  var finished = false;

  function setProgress(v) {
    v = Math.max(0, Math.min(100, v));
    if (ring) ring.style.strokeDashoffset = String(440 * (1 - v / 100));
    if (countEl) countEl.textContent = Math.round(v) + "%";
  }

  function finishLoader() {
    if (finished) return;
    finished = true;
    setProgress(100);
    if (loader) {
      loader.classList.add("done");
      setTimeout(function () { if (loader && loader.parentNode) loader.parentNode.removeChild(loader); }, 1300);
    }
    root.classList.remove("loading");
    heroIntro();
  }

  function runLoader() {
    if (!loader || reduce) { finishLoader(); return; }
    var loaded = document.readyState === "complete";
    window.addEventListener("load", function () { loaded = true; });
    var MIN = 1500, t0 = performance.now();
    (function frame(now) {
      var v = Math.min((now - t0) / MIN, 1);
      v = 1 - Math.pow(1 - v, 3);
      v *= 100;
      if (!loaded) v = Math.min(v, 92);
      setProgress(v);
      if (v >= 100) { setTimeout(finishLoader, 250); return; }
      requestAnimationFrame(frame);
    })(t0);
    setTimeout(finishLoader, 7000); /* failsafe: never trap the visitor behind the loader */
  }

  /* ---------------------------------------------------------- Foldable nav */
  var nav = $("#nav");
  var inner = $("#navInner");
  var ind = $("#navInd");
  var foldBtn = $("#foldBtn");
  var navLinks = $$(".nav-links > li > a.nav-link");
  var dd = $("#resDd");
  var ddBtn = $(".dd-btn", dd);
  var folded = false, pinnedY = 0, clipTimer = 0, ddTimer = 0;

  function placeInd() {
    var active = navLinks.filter(function (a) { return a.classList.contains("active"); })[0];
    if (!active || !desktopMQ.matches || folded) { ind.style.opacity = "0"; return; }
    var ib = inner.getBoundingClientRect(), ab = active.getBoundingClientRect();
    ind.style.left = (ab.left - ib.left) + "px";
    ind.style.top = (ab.top - ib.top) + "px";
    ind.style.width = ab.width + "px";
    ind.style.height = ab.height + "px";
    ind.style.opacity = "1";
  }

  function openDD() { dd.classList.add("open"); ddBtn.setAttribute("aria-expanded", "true"); }
  function closeDD() { dd.classList.remove("open"); ddBtn.setAttribute("aria-expanded", "false"); }

  function setFolded(f, manual) {
    if (f === folded) return;
    folded = f;
    nav.classList.add("clip");
    nav.classList.toggle("folded", f);
    foldBtn.setAttribute("aria-expanded", String(!f));
    foldBtn.setAttribute("aria-label", f ? "Unfold navigation" : "Fold navigation");
    closeDD();
    if (!f && manual) pinnedY = window.scrollY;
    clearTimeout(clipTimer);
    clipTimer = setTimeout(function () {
      if (!folded) nav.classList.remove("clip");
      placeInd();
    }, 620);
    if (f) ind.style.opacity = "0";
  }

  function closeMobile() {
    if (!nav.classList.contains("open")) return;
    nav.classList.remove("open");
    foldBtn.setAttribute("aria-expanded", "false");
    foldBtn.setAttribute("aria-label", "Open menu");
  }

  function syncMode() {
    nav.classList.remove("open", "clip");
    closeDD();
    if (desktopMQ.matches) {
      foldBtn.setAttribute("aria-expanded", String(!folded));
      foldBtn.setAttribute("aria-label", folded ? "Unfold navigation" : "Fold navigation");
      nav.classList.toggle("folded", folded);
    } else {
      nav.classList.remove("folded");
      foldBtn.setAttribute("aria-expanded", "false");
      foldBtn.setAttribute("aria-label", "Open menu");
    }
    placeInd();
  }
  (desktopMQ.addEventListener ? desktopMQ.addEventListener("change", syncMode) : desktopMQ.addListener(syncMode));
  syncMode();

  foldBtn.addEventListener("click", function () {
    if (desktopMQ.matches) { setFolded(!folded, true); return; }
    var open = nav.classList.toggle("open");
    foldBtn.setAttribute("aria-expanded", String(open));
    foldBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  ddBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (dd.classList.contains("open")) closeDD(); else openDD();
  });
  dd.addEventListener("pointerenter", function (e) {
    if (e.pointerType === "mouse" && desktopMQ.matches) { clearTimeout(ddTimer); openDD(); }
  });
  dd.addEventListener("pointerleave", function (e) {
    if (e.pointerType === "mouse" && desktopMQ.matches) { ddTimer = setTimeout(closeDD, 160); }
  });
  document.addEventListener("click", function (e) {
    if (!dd.contains(e.target)) closeDD();
    if (!desktopMQ.matches && !nav.contains(e.target)) closeMobile();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (dd.classList.contains("open")) { closeDD(); ddBtn.focus(); }
    closeMobile();
  });
  $$("a[href^='#']", nav).forEach(function (a) {
    a.addEventListener("click", function () { closeDD(); closeMobile(); });
  });

  /* Scroll spy */
  var spyIds = navLinks.map(function (a) { return a.getAttribute("href"); })
    .filter(function (h) { return h && h.charAt(0) === "#" && h.length > 1; })
    .map(function (h) { return h.slice(1); });

  function setActive(id) {
    navLinks.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    placeInd();
  }
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    spyIds.forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
  }
  setActive("home");
  window.addEventListener("resize", placeInd);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeInd);

  /* ----------------------------------------- Scroll: progress, nav, to-top */
  var progress = $("#progress");
  var toTop = $("#backToTop");
  var lastY = window.scrollY, ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY;
      var max = Math.max(1, root.scrollHeight - window.innerHeight);
      progress.style.transform = "scaleX(" + Math.min(1, y / max).toFixed(4) + ")";
      nav.classList.toggle("scrolled", y > 8);
      toTop.classList.toggle("visible", y > 480);
      if (desktopMQ.matches) {
        if (y < 40 && folded) setFolded(false);
        else if (!folded && y > 260 && y > pinnedY + 380 && y > lastY) setFolded(true);
      }
      lastY = y;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ------------------------------------------------------ Particle network */
  (function particles() {
    var c = $("#particles");
    var ctx = c && c.getContext("2d");
    if (!ctx) return;
    var w = 0, h = 0, pts = [], raf = 0, running = false;
    var mouse = { x: -9999, y: -9999 };

    function spawn() {
      return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28, r: Math.random() * 1.4 + 0.6 };
    }
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, Math.max(26, (w * h) / 26000)));
      while (pts.length < n) pts.push(spawn());
      pts.length = n;
      if (reduce) draw(false);
    }
    function draw(step) {
      ctx.clearRect(0, 0, w, h);
      var dark = root.getAttribute("data-theme") === "dark";
      var rgb = dark ? "110,231,183" : "5,150,105";
      var dotA = dark ? 0.55 : 0.42, lineA = dark ? 0.22 : 0.18, maxD = 130;
      var i, j, p, q, dx, dy, d;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        if (step) {
          p.x += p.vx; p.y += p.vy;
          dx = p.x - mouse.x; dy = p.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150 && d > 0.1) { p.x += (dx / d) * 0.6; p.y += (dy / d) * 0.6; }
          if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
        }
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + rgb + "," + dotA + ")";
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fill();
        for (j = i + 1; j < pts.length; j++) {
          q = pts[j]; dx = p.x - q.x; dy = p.y - q.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxD) {
            ctx.strokeStyle = "rgba(" + rgb + "," + ((1 - d / maxD) * lineA).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
    }
    function loop() { if (!running) return; draw(true); raf = requestAnimationFrame(loop); }
    function start() { if (reduce || running) return; running = true; raf = requestAnimationFrame(loop); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    size();
    window.addEventListener("resize", size);
    document.addEventListener("themechange", function () { if (reduce) draw(false); });
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
    window.addEventListener("pointermove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
    if (reduce) draw(false); else start();
  })();

  /* ---------------------------------------- Pointer effects (fine pointers) */
  document.addEventListener("pointermove", function (e) {
    var g = e.target.closest && e.target.closest(".glass");
    if (!g) return;
    var r = g.getBoundingClientRect();
    g.style.setProperty("--mx", (e.clientX - r.left) + "px");
    g.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  if (finePointer && !reduce) {
    var glow = $("#cursorGlow");
    var tx = 0, ty = 0, cx = 0, cy = 0, glowRun = false;
    var glowLoop = function () {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      glow.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5) requestAnimationFrame(glowLoop); else glowRun = false;
    };
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add("on");
      if (!glowRun) { glowRun = true; requestAnimationFrame(glowLoop); }
    }, { passive: true });
    document.addEventListener("pointerleave", function () { glow.classList.remove("on"); });

    $$(".magnetic").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        var my = (e.clientY - (r.top + r.height / 2)) * 0.3;
        el.style.transform = "translate(" + mx.toFixed(1) + "px," + my.toFixed(1) + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });

    var hv = $("#heroVisual");
    if (hv) {
      hv.addEventListener("pointermove", function (e) {
        var r = hv.getBoundingClientRect();
        hv.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        hv.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
      hv.addEventListener("pointerleave", function () {
        hv.style.setProperty("--px", "0"); hv.style.setProperty("--py", "0");
      });
    }
  }

  /* ------------------------------------------------ Reveal + count-up stats */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var rio = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { rio.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  $$("[data-count]").forEach(function (el) {
    var end = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (isNaN(end) || reduce || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      if (!hasGsap()) return;
      var o = { v: 0 };
      el.textContent = (0).toFixed(dec);
      window.gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", onUpdate: function () { el.textContent = o.v.toFixed(dec); }, onComplete: function () { el.textContent = end.toFixed(dec); } });
    }, { threshold: 0.6 });
    io.observe(el);
  });

  /* -------------------------------------------------------------- Hero GSAP */
  function heroIntro() {
    if (!hasGsap() || reduce) return;
    var g = window.gsap;
    var tl = g.timeline({ defaults: { ease: "power3.out", clearProps: "transform,opacity" } });
    tl.from(".hero .badge", { y: 16, opacity: 0, duration: 0.6 })
      .from(".hero-title .line > span", { yPercent: 110, duration: 0.95, stagger: 0.12 }, "-=0.3")
      .from(".hero-sub, .hero-intro", { y: 18, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.55")
      .from(".hero-cta .btn", { y: 18, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.45")
      .from(".avatar", { scale: 0.86, opacity: 0, duration: 1.1, ease: "back.out(1.4)" }, "-=1.3")
      .from(".orbit", { opacity: 0, duration: 1, stagger: 0.12, clearProps: "opacity" }, "-=1")
      .from(".chip", { scale: 0, opacity: 0, duration: 0.5, stagger: 0.1, ease: "back.out(2)" }, "-=0.6")
      .from(".hero-cards .card", { y: 30, opacity: 0, duration: 0.8, stagger: 0.12 }, "-=0.5");

    if (typeof window.ScrollTrigger !== "undefined") {
      g.registerPlugin(window.ScrollTrigger);
      g.to("#heroVisual", { y: -50, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
    }
  }

  /* ------------------------------------------------- Small utilities */
  var avatar = $("#avatarImg");
  if (avatar) {
    avatar.addEventListener("error", function () { avatar.hidden = true; });
    if (avatar.complete && avatar.naturalWidth === 0) avatar.hidden = true;
  }

  var clockEl = $("#clock");
  function tick() {
    if (!clockEl) return;
    clockEl.textContent = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kathmandu", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
  }
  tick(); setInterval(tick, 30000);

  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------ Go */
  runLoader();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
