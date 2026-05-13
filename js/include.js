/* DRA Framework — partial loader, theme toggle, image lightbox. */
(function () {
  'use strict';

  // ---- Theme toggle ------------------------------------------------------
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('dra-theme', theme); } catch (_) {}
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.querySelector('[data-theme-label]')?.replaceChildren(
        document.createTextNode(theme === 'dark' ? 'Light mode' : 'Dark mode')
      );
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

  // ---- Partial includes --------------------------------------------------
  function loadIncludes(root) {
    var nodes = (root || document).querySelectorAll('[data-include]');
    var jobs = [];
    nodes.forEach(function (el) {
      var url = el.getAttribute('data-include');
      jobs.push(
        fetch(url)
          .then(function (r) {
            if (!r.ok) throw new Error('Failed: ' + url);
            return r.text();
          })
          .then(function (html) {
            el.innerHTML = html;
            // Recursively load nested includes
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

  // ---- Global event delegation ------------------------------------------
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

    // Anchor link handling: smooth-scroll same-page, no-op same-URL,
    // let the browser handle real cross-document navigation (with
    // view-transition CSS taking care of the visual smoothness).
    var a = e.target.closest('a[href]');
    if (!a) return;
    if (a.target && a.target !== '' && a.target !== '_self') return;
    if (a.hasAttribute('download')) return;
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var href = a.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

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
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // ---- Boot --------------------------------------------------------------
  function setActiveNav() {
    var here = window.location.pathname.replace(/\/+$/, '');
    document.querySelectorAll('.side-nav a[href]').forEach(function (a) {
      var url;
      try { url = new URL(a.href, window.location.href); } catch (_) { return; }
      var path = url.pathname.replace(/\/+$/, '');
      if (path === here && (!url.hash || url.hash === '')) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    loadIncludes().then(function () {
      applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
      setActiveNav();
    });
  });
})();
