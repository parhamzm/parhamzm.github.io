/*
 * Copyright 2026 Parham Zilouchian Moghaddam
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* ════════════════════════════════════════════════════════════════════
   Parham Zilouchian Moghaddam — site behaviour
   Theme · mobile nav · scroll spy · progress · reveals · BibTeX copy
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.documentElement;
  var THEME_KEY = 'pzm-theme';

  function read(key)      { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function write(key, v)  { try { localStorage.setItem(key, v); } catch (e) {} }

  /* ── theme ─────────────────────────────────────────────── */
  var toggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      var label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', label);
    }
  }

  var media = window.matchMedia('(prefers-color-scheme: dark)');
  applyTheme(read(THEME_KEY) || (media.matches ? 'dark' : 'light'));

  media.addEventListener('change', function (e) {
    if (!read(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light');
  });

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      write(THEME_KEY, next);
    });
  }

  /* ── mobile navigation ─────────────────────────────────── */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('nav-toggle');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) return;
      if (!e.target.closest('#nav') && !e.target.closest('#nav-toggle')) closeNav();
    });
  }

  /* ── sticky bar state + reading progress ───────────────── */
  var topbar = document.getElementById('topbar');
  var progress = document.getElementById('scroll-progress');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (topbar) topbar.classList.toggle('scrolled', y > 8);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? Math.min(y / max, 1) * 100 : 0) + '%';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ── scroll spy ────────────────────────────────────────── */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var visible = Object.create(null);

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });
      // highlight the first section currently in the reading band
      var current = null;
      for (var i = 0; i < sections.length; i++) {
        if (visible[sections[i].id]) { current = sections[i].id; break; }
      }
      links.forEach(function (a) {
        a.classList.toggle('active', current !== null && a.getAttribute('href') === '#' + current);
      });
    }, { rootMargin: '-84px 0px -58% 0px', threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ── reveal on scroll ──────────────────────────────────── */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduce && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll(
      '.section-head, .section-lede, .group-head, .prose > *, .about-side > *, ' +
      '.news li, .tl-item, .pub, .edu-card, .honors li, .teach-table, ' +
      '.proj-card, .cert-card, .skill-card, .ref-card, .contact-panel, .postal'
    );

    Array.prototype.forEach.call(targets, function (el) { el.classList.add('reveal'); });

    // Once a target is marked .reveal it starts at opacity:0 and only the
    // observer below ever makes it visible again — if setup throws (or a
    // browser's IntersectionObserver misbehaves), fail open and show
    // everything immediately rather than leave the page stuck invisible.
    try {
      var revealer = new IntersectionObserver(function (entries, obs) {
        var shown = 0;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.style.transitionDelay = Math.min(shown++ * 55, 260) + 'ms';
          el.classList.add('in');
          obs.unobserve(el);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

      Array.prototype.forEach.call(targets, function (el) { revealer.observe(el); });
    } catch (e) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('in'); });
    }
  }

  /* ── toast ─────────────────────────────────────────────── */
  var toastEl = document.getElementById('toast');
  var toastTimer;

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }

  /* ── copy BibTeX ───────────────────────────────────────── */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy') ? resolve() : reject(); }
      catch (e) { reject(e); }
      finally { document.body.removeChild(ta); }
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.js-cite'), function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.pub-body');
      var pre = card && card.querySelector('.bibtex');
      if (!pre) return;

      copyText(pre.textContent.trim()).then(function () {
        var original = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        toast('BibTeX copied to clipboard');
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 1800);
      }).catch(function () {
        toast('Press ⌘/Ctrl + C to copy');
      });
    });
  });

  /* ── footer year ───────────────────────────────────────── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
