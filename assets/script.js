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
   Theme (auto / light / dark) · section menu · scroll spy · BibTeX · copy
   Everything here is an enhancement: the page is complete without it.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.documentElement;
  var THEME_KEY = 'pzm-theme';

  function read(key)     { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function write(key, v) { try { localStorage.setItem(key, v); } catch (e) {} }
  function forget(key)   { try { localStorage.removeItem(key); } catch (e) {} }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function listen(mq, fn) {
    if (!mq) return;
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
  }

  /* ── theme ─────────────────────────────────────────────── */
  // Three states. "auto" = nothing saved: data-theme stays unset and the CSS
  // follows the operating system by itself, live. "light" / "dark" = a saved
  // choice, applied before first paint by the inline script in <head>. This
  // part keeps the controls, labels and browser-bar colour in step.
  var COLORS = { light: '#fcfbf8', dark: '#0f1115' };
  var themeMetas = document.querySelectorAll('meta[name="theme-color"]');
  var themeToggles = document.querySelectorAll('.js-theme-toggle');
  var themeInputs = document.querySelectorAll('.theme-picker input');
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var calmQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function systemTheme() { return darkQuery && darkQuery.matches ? 'dark' : 'light'; }
  function savedTheme() { var t = read(THEME_KEY); return t === 'light' || t === 'dark' ? t : 'auto'; }
  function shownTheme(pref) { return pref === 'auto' ? systemTheme() : pref; }

  function renderTheme(pref) {
    if (pref === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', pref);
    // browser chrome (mobile address bar, Safari tab bar): in Auto each <meta>
    // keeps the colour for its own media query; a saved choice overrides both
    each(themeMetas, function (m) {
      var forDark = /dark/.test(m.getAttribute('media') || '');
      m.setAttribute('content', pref === 'auto' ? COLORS[forDark ? 'dark' : 'light'] : COLORS[pref]);
    });
    each(themeInputs, function (input) { input.checked = input.value === pref; });
    var label = 'Switch to ' + (shownTheme(pref) === 'dark' ? 'light' : 'dark') + ' theme';
    each(themeToggles, function (btn) {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  }

  function setTheme(pref) {
    if (pref === 'auto') forget(THEME_KEY);
    else write(THEME_KEY, pref);
    // switch everything at once: no per-element colour fades, and a short
    // cross-fade of the whole page where the browser supports it
    root.classList.add('theme-switching');
    var settle = function () {
      window.requestAnimationFrame(function () { root.classList.remove('theme-switching'); });
    };
    var update = function () { renderTheme(pref); };
    if (document.startViewTransition && !(calmQuery && calmQuery.matches)) {
      document.startViewTransition(update).finished.then(settle, settle);
    } else {
      update();
      void root.offsetWidth;   // apply the new colours before transitions return
      settle();
    }
  }

  renderTheme(savedTheme());

  // Auto already follows the system through CSS; the toggle's label needs news
  listen(darkQuery, function () { renderTheme(savedTheme()); });

  // keep any other open tabs of the site in step
  window.addEventListener('storage', function (e) {
    if (e.key === THEME_KEY) renderTheme(savedTheme());
  });

  each(themeInputs, function (input) {
    input.addEventListener('change', function () {
      if (input.checked) setTheme(input.value);
    });
  });

  // quick toggle: flips the theme shown; flipping back to the system's own
  // theme returns to Auto, so no one is left stuck on a forced theme
  each(themeToggles, function (btn) {
    btn.addEventListener('click', function () {
      var next = shownTheme(savedTheme()) === 'dark' ? 'light' : 'dark';
      setTheme(next === systemTheme() ? 'auto' : next);
    });
  });

  /* ── section menu (narrow screens) ─────────────────────── */
  var menu = document.getElementById('menu');
  var menuButton = document.getElementById('menu-toggle');

  function isMenuOpen() { return !!menu && menu.classList.contains('is-open'); }

  function setMenu(open, returnFocus) {
    if (!menu || !menuButton) return;
    menu.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuButton.setAttribute('aria-label', open ? 'Close section menu' : 'Open section menu');
    if (!open && returnFocus) menuButton.focus();
  }

  if (menu && menuButton) {
    menuButton.addEventListener('click', function () { setMenu(!isMenuOpen()); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen()) setMenu(false, true);
    });
    document.addEventListener('click', function (e) {
      if (isMenuOpen() && !e.target.closest('#menu') && !e.target.closest('#menu-toggle')) setMenu(false);
    });
    // the bar (and its menu) disappears on wide screens; never leave it open
    listen(window.matchMedia && window.matchMedia('(min-width: 1024px)'), function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ── compact bar: show the name once the big one scrolls away ── */
  var topbar = document.getElementById('topbar');
  var bigName = document.querySelector('.name');

  if (topbar && bigName && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      topbar.classList.toggle('show-brand', !entries[0].isIntersecting);
    }, { rootMargin: '-56px 0px 0px 0px' }).observe(bigName);
  } else if (topbar) {
    topbar.classList.add('show-brand');
  }

  /* ── scroll spy: mark the section being read ───────────── */
  var navLinks = document.querySelectorAll('.side-nav a[href^="#"], .menu a[href^="#"]');
  var sections = [];
  each(document.querySelectorAll('.side-nav a[href^="#"]'), function (a) {
    var s = document.getElementById(a.getAttribute('href').slice(1));
    if (s) sections.push(s);
  });

  var current = null;
  var ticking = false;

  function spy() {
    ticking = false;
    if (!sections.length) return;
    var line = window.innerHeight * 0.3;
    var active = sections[0].id;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= line) active = sections[i].id;
    }
    // short final sections can never reach the reading line: at the very
    // bottom of the page, the last section is the one being read
    var doc = document.documentElement;
    if (window.innerHeight + window.pageYOffset >= doc.scrollHeight - 2) {
      active = sections[sections.length - 1].id;
    }
    if (active === current) return;
    current = active;
    each(navLinks, function (a) {
      if (a.getAttribute('href') === '#' + active) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  function requestSpy() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(spy); }
  }

  window.addEventListener('scroll', requestSpy, { passive: true });
  window.addEventListener('resize', requestSpy, { passive: true });
  spy();

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

  /* ── BibTeX: expand inline, copy with one click ────────── */
  each(document.querySelectorAll('.js-bib'), function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.classList.toggle('is-open', open);
    });
  });

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

  function selectContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  each(document.querySelectorAll('.js-copy'), function (btn) {
    btn.addEventListener('click', function () {
      var pre = document.getElementById(btn.getAttribute('data-copy'));
      if (!pre) return;
      copyText(pre.textContent.trim()).then(function () {
        toast('BibTeX copied to clipboard');
      }).catch(function () {
        // leave the entry selected so it can be copied by hand
        selectContents(pre);
        toast('Press ⌘/Ctrl + C to copy');
      });
    });
  });

  /* ── copy email (mailto links do nothing for webmail users) ── */
  each(document.querySelectorAll('.js-copy-email'), function (btn) {
    btn.addEventListener('click', function () {
      var email = btn.getAttribute('data-email');
      copyText(email).then(function () {
        toast('Email address copied');
      }).catch(function () {
        toast(email);
      });
    });
  });

  /* ── footer year ───────────────────────────────────────── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
