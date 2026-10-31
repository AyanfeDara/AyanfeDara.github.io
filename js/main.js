(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function safeGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function safeSet(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

  /* ---------- light / dark mode ---------- */
  var toggle = document.querySelector('[data-theme-toggle]');
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#0B0D12' : '#F4F2EE');
  }

  applyTheme(root.getAttribute('data-theme') || 'dark');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      safeSet('theme', next);
    });
  }

  // Follow the system setting until the visitor picks a theme themselves.
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: light)');
    var onChange = function (e) { if (!safeGet('theme')) applyTheme(e.matches ? 'light' : 'dark'); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    var setMenu = function (open) {
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
  }

  /* ---------- seamless marquees: duplicate each list ---------- */
  document.querySelectorAll('.track').forEach(function (track) {
    var list = track.querySelector('.marquee-list');
    if (!list) return;
    var copy = list.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    track.appendChild(copy);
  });

  /* ---------- count-up numbers ---------- */
  function format(value, decimals) {
    return decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-US');
  }

  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if (reduceMotion) { el.textContent = format(target, decimals); return; }
    var start = null;
    var duration = 1800;
    function step(t) {
      if (start === null) start = t;
      var k = Math.min(1, (t - start) / duration);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = format(target * eased, decimals);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- in-view triggers: count-ups and the drone line ----------
     Content is complete at rest; numbers only re-run from 0 once they scroll into view. */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- project loops: play only while on screen, never with reduced motion ---------- */
  // The cards stack, so a covered card still counts as on screen. Only the topmost visible one plays.
  var loops = [].slice.call(document.querySelectorAll('video.loop'));
  // Phones get the portrait cut (<name>_m.*) with larger type. Videos don't preload, so this runs before any download.
  if (window.matchMedia && window.matchMedia('(max-width: 640px)').matches) {
    loops.forEach(function (v) {
      v.poster = v.getAttribute('poster').replace('_poster', '_m_poster');
      v.querySelectorAll('source').forEach(function (s) { s.src = s.getAttribute('src').replace(/(\.\w+)$/, '_m$1'); });
      v.setAttribute('width', '1080'); v.setAttribute('height', '1350');
    });
  }
  if (loops.length && !reduceMotion) {
    var pending = false;
    var pickActive = function () {
      pending = false;
      var vh = window.innerHeight, active = null;
      loops.forEach(function (v) {
        var r = v.getBoundingClientRect();
        // Cards in a sideways row: only the one showing in its row counts.
        var vw = window.innerWidth;
        if (r.bottom > 0 && r.top < vh * 0.75 && r.right > 40 && r.left < vw - 40) active = v;
      });
      loops.forEach(function (v) {
        if (v === active) {
          if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); }
          if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (!v.paused) {
          v.pause();
        }
      });
    };
    var queue = function () { if (!pending) { pending = true; requestAnimationFrame(pickActive); } };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    document.querySelectorAll('.rail').forEach(function (rail) { rail.addEventListener('scroll', queue, { passive: true }); });
    pickActive();
  }

  /* ---------- project rows: slide sideways with the arrows, show "2 / 3" ---------- */
  document.querySelectorAll('.tool-group').forEach(function (group) {
    var rail = group.querySelector('.rail');
    var nav = group.querySelector('.rail-nav');
    var count = group.querySelector('.tool-count');
    if (!rail) return;
    var cards = rail.querySelectorAll('.card');
    var n = cards.length;
    if (count) count.textContent = n + (n === 1 ? ' project' : ' projects');
    if (!nav) return;
    if (n < 2) { nav.hidden = true; return; }
    var prev = nav.querySelector('[data-dir="-1"]');
    var next = nav.querySelector('[data-dir="1"]');
    var pos = nav.querySelector('.rail-pos');
    var current = function () { return Math.round(rail.scrollLeft / Math.max(1, cards[0].offsetWidth + 24)); };
    var update = function () {
      var i = Math.min(n - 1, Math.max(0, current()));
      if (pos) pos.textContent = (i + 1) + ' / ' + n;
      prev.disabled = i === 0;
      next.disabled = i === n - 1;
    };
    var go = function (dir) {
      var i = Math.min(n - 1, Math.max(0, current() + dir));
      rail.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    // Auto-advance: one project every 10 seconds, looping back to the first.
    // Pauses on hover, focus or touch and while the row is off screen; stops for good
    // once the visitor uses the arrows; never runs with "reduce motion".
    var manual = false, hovering = false, onScreen = false, timer = null;
    var stopAuto = function () { manual = true; group.classList.remove('is-auto'); };
    var tick = function () {
      if (manual || hovering || !onScreen || document.hidden) return;
      var i = current();
      if (i >= n - 1) rail.scrollTo({ left: 0, behavior: 'smooth' }); else go(1);
    };
    if (!reduceMotion) {
      group.classList.add('is-auto');
      timer = setInterval(tick, 10000);
      group.addEventListener('mouseenter', function () { hovering = true; });
      group.addEventListener('mouseleave', function () { hovering = false; });
      group.addEventListener('focusin', function () { hovering = true; });
      group.addEventListener('focusout', function () { hovering = false; });
      rail.addEventListener('touchstart', stopAuto, { passive: true });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; }, { threshold: 0.5 }).observe(rail);
      } else { onScreen = true; }
    }
    prev.addEventListener('click', function () { stopAuto(); go(-1); });
    next.addEventListener('click', function () { stopAuto(); go(1); });
    rail.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); stopAuto(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); stopAuto(); go(-1); }
    });
    var t = null;
    rail.addEventListener('scroll', function () { if (t) cancelAnimationFrame(t); t = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- live Abuja clock ---------- */
  var clocks = document.querySelectorAll('[data-clock]');
  var fmt;
  try {
    fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' });
  } catch (e) { fmt = null; }
  function tick() {
    if (!fmt) return;
    var now = fmt.format(new Date());
    clocks.forEach(function (el) { el.textContent = now; });
  }
  tick();
  setInterval(tick, 15000);

  /* ---------- footer year ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
