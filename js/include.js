// Simple HTML partial includes.
// Usage: <div data-include="partials/publications.html"></div>
document.addEventListener('DOMContentLoaded', function () {
  const nodes = document.querySelectorAll('[data-include]');
  nodes.forEach(function (el) {
    const url = el.getAttribute('data-include');
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load ' + url);
        return r.text();
      })
      .then(function (html) { el.innerHTML = html; })
      .catch(function (err) { console.error(err); });
  });

  // Intercept "View PNG" buttons: render the image inside #main-content
  // instead of opening a new tab. Uses event delegation so it works for
  // links injected by the partial includes above.
  let savedMainHTML = null;
  let savedScrollY = 0;

  document.addEventListener('click', function (e) {
    // View PNG: swap main content with the image view
    const link = e.target.closest('a.view-png');
    if (link) {
      e.preventDefault();
      const main = document.getElementById('main-content');
      if (!main) return;
      const href = link.getAttribute('href');
      const title = link.closest('.card')?.querySelector('.card-title')?.textContent || '';
      if (savedMainHTML === null) {
        savedMainHTML = main.innerHTML;
        savedScrollY = window.scrollY;
      }
      main.innerHTML =
        '<div class="mb-2">' +
          '<button type="button" class="btn btn-secondary mb-3 back-to-cards">&larr; Back</button>' +
          (title ? '<h3>' + title + '</h3>' : '') +
          '<img src="' + href + '" alt="' + title + '" class="img-fluid">' +
        '</div>';
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    // Back: restore the original cards without reloading the page
    const back = e.target.closest('.back-to-cards');
    if (back) {
      e.preventDefault();
      const main = document.getElementById('main-content');
      if (!main || savedMainHTML === null) return;
      main.innerHTML = savedMainHTML;
      savedMainHTML = null;
      window.scrollTo({ top: savedScrollY, behavior: 'auto' });
    }
  });
});

