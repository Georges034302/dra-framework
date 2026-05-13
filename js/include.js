/* DRA Framework — SPA-style navigation, partials, theme, lightbox.
   The .app shell is replaced in place via fetch + DOM swap so the
   sidebar's Overview / DRA v1.0 / DRA v2.0 links are always present
   and there is no full-document reload (no white flash).
*/
(function () {
  'use strict';

  // ---- Theme -------------------------------------------------------------
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('dra-theme', theme); } catch (_) {}
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      var label = btn.querySelector('[data-theme-label]');
      if (label) label.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    });
  }
  function initTheme() {
    var stored;
    try { stored = localStorage.getItem('dra-theme'); } catch (_) {}
    var prefersDark = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(stored || (prefersDark ? 'dark' : 'light'));
  }
  initTheme();

  // ---- Partial includes (recursive) -------------------------------------
  function loadIncludes(root) {
    var nodes = (root || document).querySelectorAll('[data-include]');
    var jobs = [];
    nodes.forEach(function (el) {
      var url = el.getAttribute('data-include');
      el.removeAttribute('data-include');
      jobs.push(
        fetch(url)
          .then(function (r) {
            if (!r.ok) throw new Error('Failed: ' + url);
            return r.text();
          })
          .then(function (html) {
            el.innerHTML = html;
            return loadIncludes(el);
          })
          .catch(function (err) { console.error(err); })
      );
    });
    return Promise.all(jobs);
  }

  // ---- Lightbox ----------------------------------------------------------
  function ensureLightbox() {
    var lb = document.getElementById('dra-lightbox');
    if (lb) return lb;
    lb = document.createElement('div');
    lb.id = 'dra-lightbox';
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML =
      '<div class="lightbox-card">' +
        '<div class="lightbox-head">' +
          '<h3 data-lb-title>Diagram</h3>' +
          '<button type="button" class="lightbox-close" aria-label="Close">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="lightbox-body"><img alt="" data-lb-img></div>' +
      '</div>';
    document.body.appendChild(lb);
    return lb;
  }
  function openLightbox(src, title) {
    var lb = ensureLightbox();
    lb.querySelector('[data-lb-img]').src = src;
    lb.querySelector('[data-lb-img]').alt = title || '';
    lb.querySelector('[data-lb-title]').textContent = title || 'Diagram';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    var lb = document.getElementById('dra-lightbox');
    if (!lb) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ---- Active nav --------------------------------------------------------
  function setActiveNav() {
    var here = window.location.pathname.replace(/\/+$/, '');
    document.querySelectorAll('.side-nav a[href]').forEach(function (a) {
      var url;
      try { url = new URL(a.href, window.location.href); } catch (_) { return; }
      if (url.origin !== window.location.origin) return;
      var path = url.pathname.replace(/\/+$/, '');
      if (path === here && (!url.hash || url.hash === '')) a.classList.add('active');
      else a.classList.remove('active');
    });
  }

  // ---- SPA navigation ----------------------------------------------------
  // Cache fetched documents to make repeat navigations instant.
  var docCache = Object.create(null);
  var navSeq = 0;

  function fetchDoc(href) {
    if (docCache[href]) return Promise.resolve(docCache[href]);
    return fetch(href, { credentials: 'same-origin' })
      .then(function (r) {
        if (!r.ok) throw new Error('Nav failed: ' + href);
        return r.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        docCache[href] = doc;
        return doc;
      });
  }

  function swapApp(doc) {
    var newApp = doc.querySelector('.app');
    var curApp = document.querySelector('.app');
    if (!newApp || !curApp) {
      // Fallback: hard navigate.
      return false;
    }
    curApp.innerHTML = newApp.innerHTML;
    var newTitle = doc.querySelector('title');
    if (newTitle) document.title = newTitle.textContent;
    return true;
  }

  function navigate(href, push) {
    var seq = ++navSeq;
    return fetchDoc(href).then(function (doc) {
      if (seq !== navSeq) return; // a newer nav superseded us
      if (!swapApp(doc)) {
        window.location.href = href;
        return;
      }
      if (push) history.pushState({ href: href }, '', href);
      window.scrollTo(0, 0);
      // Re-apply theme labels and process any data-includes in the new DOM.
      applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
      return loadIncludes().then(function () {
        applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
        setActiveNav();
        // Warm cache for siblings so the next click is instant.
        prefetchSiblings();
      });
    }).catch(function (err) {
      console.error(err);
      window.location.href = href;
    });
  }

  function prefetchSiblings() {
    document.querySelectorAll('.side-nav a[href]').forEach(function (a) {
      var url;
      try { url = new URL(a.href, window.location.href); } catch (_) { return; }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      if (docCache[url.href]) return;
      // Fire-and-forget; ignore errors.
      fetchDoc(url.href).catch(function () {});
    });
  }

  window.addEventListener('popstate', function () {
    navigate(window.location.href, false);
  });

  // ---- Click delegation --------------------------------------------------
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-theme-toggle]');
    if (toggle) {
      e.preventDefault();
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
      return;
    }

    var view = e.target.closest('.view-png, [data-view-png]');
    if (view) {
      e.preventDefault();
      var src = view.getAttribute('data-src') ||
                view.getAttribute('href') ||
                view.dataset.viewPng;
      var title =
        view.getAttribute('data-title') ||
        view.closest('.card')?.querySelector('.card-title')?.textContent ||
        '';
      if (src) openLightbox(src, title.trim());
      return;
    }

    if (e.target.closest('.lightbox-close') ||
        (e.target.id === 'dra-lightbox')) {
      closeLightbox();
      return;
    }

    var a = e.target.closest('a[href]');
    if (!a) return;
    if (a.target && a.target !== '' && a.target !== '_self') return;
    if (a.hasAttribute('download')) return;
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var raw = a.getAttribute('href');
    if (!raw || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:')) return;

    var url;
    try { url = new URL(a.href, window.location.href); } catch (_) { return; }
    if (url.origin !== window.location.origin) return;

    var samePath = url.pathname === window.location.pathname;
    if (samePath) {
      e.preventDefault();
      if (url.hash && url.hash.length > 1) {
        var target = document.querySelector(url.hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', url.hash);
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Cross-document → SPA-swap if it's an .html page on this site.
    if (/\.html?$/.test(url.pathname) || url.pathname === '/' ||
        url.pathname.endsWith('/')) {
      e.preventDefault();
      navigate(url.href, true);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // ---- Boot --------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    loadIncludes().then(function () {
      applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
      setActiveNav();
      prefetchSiblings();
    });
  });
})();
