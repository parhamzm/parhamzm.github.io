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
   Theme · section menu · scroll spy · compact-bar name · BibTeX
   Everything here is an enhancement: the page is complete without it.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.documentElement;
  var THEME_KEY = 'pzm-theme';

  function read(key)     { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function write(key, v) { try { localStorage.setItem(key, v); } catch (e) {} }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function listen(mq, fn) {
    if (!mq) return;
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
  }

  /* ── theme ─────────────────────────────────────────────── */
  var themeButtons = document.querySelectorAll('.js-theme');
  var themeMetas = document.querySelectorAll('meta[name="theme-color"]');
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    each(themeButtons, function (btn) {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
    // keep the browser chrome (mobile address bar, Safari tab bar) in step
    // with the theme actually shown, not just the operating-system setting
    var bg = getComputedStyle(root).getPropertyValue('--bg').trim();
    if (bg) each(themeMetas, function (m) { m.setAttribute('content', bg); });
  }

  applyTheme(read(THEME_KEY) || (darkQuery && darkQuery.matches ? 'dark' : 'light'));

  listen(darkQuery, function (e) {
    if (!read(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light');
  });

  each(themeButtons, function (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      write(THEME_KEY, next);
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
