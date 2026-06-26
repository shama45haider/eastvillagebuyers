/* East Village Buyers — Category Page Interactivity */
(function () {
  'use strict';

  // FAQ2 accordion (button-driven expand/collapse)
  function initFAQ2() {
    var buttons = document.querySelectorAll('.faq2-q');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var answer = btn.parentElement.querySelector('.faq2-a');
        if (!answer) return;

        btn.setAttribute('aria-expanded', String(!expanded));
        if (expanded) {
          answer.classList.remove('faq2-a--open');
        } else {
          answer.classList.add('faq2-a--open');
        }
      });
    });
  }

  // Brand directory search filter (sneakers page)
  function initDirectorySearch() {
    var input = document.getElementById('dirSearch');
    var list = document.getElementById('dirList');
    var empty = document.getElementById('dirEmpty');
    if (!input || !list) return;

    input.addEventListener('input', function () {
      var q = input.value.toLowerCase().trim();
      var groups = list.querySelectorAll('.cp-dir-group');
      var totalVisible = 0;

      groups.forEach(function (group) {
        var items = group.querySelectorAll('.cp-dir-item');
        var groupVisible = 0;

        items.forEach(function (item) {
          var text = item.textContent.toLowerCase();
          var match = !q || text.indexOf(q) !== -1;
          item.style.display = match ? '' : 'none';
          if (match) groupVisible++;
        });

        group.style.display = groupVisible > 0 ? '' : 'none';
        totalVisible += groupVisible;
      });

      if (empty) {
        empty.style.display = totalVisible === 0 ? 'block' : 'none';
      }
    });
  }

  // Smooth scroll for anchor links within category pages
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initFAQ2();
    initDirectorySearch();
    initSmoothScroll();
  }
})();
