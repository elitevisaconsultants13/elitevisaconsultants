/* Elite Visa Consultants - shared site behaviour (menu, FAQ, current page, contact form) */
(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  var btn = document.getElementById('hamburger');
  var nav = document.getElementById('navLinks');
  function closeMenu(returnFocus) {
    if (!nav || !btn) return;
    nav.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    if (returnFocus) btn.focus();
  }
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('active');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) closeMenu(true);
    });
  }

  /* ---------- Mark the current page in the navigation ---------- */
  if (nav) {
    var file = location.pathname.split('/').pop();
    if (!file) file = 'index.html';
    if (file.indexOf('.') < 0) file += '.html';
    var parent = {
      'tourist.html': 'services.html', 'schengen.html': 'services.html', 'study.html': 'services.html',
      'work.html': 'services.html', 'business.html': 'services.html', 'family.html': 'services.html',
      'germany.html': 'countries.html'
    };
    var target = parent[file] || file;
    nav.querySelectorAll('a').forEach(function (a) {
      if (a.getAttribute('href') === target) a.setAttribute('aria-current', 'page');
    });
  }

  /* ---------- FAQ accordion (mouse + keyboard) ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item, i) {
    var q = item.querySelector('h3');
    var a = item.querySelector('p');
    if (!q || !a) return;
    if (!a.id) a.id = 'faq-answer-' + i;
    var label = q.textContent.trim();
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-controls', a.id);
    q.textContent = '';
    q.appendChild(b);
    item.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- Give each scrollable table a unique label ---------- */
  document.querySelectorAll('.g-scroll').forEach(function (el, i) {
    el.setAttribute('aria-label', 'Table ' + (i + 1) + ' (scrolls sideways)');
  });

  /* ---------- Contact form: send without leaving the page ---------- */
  var form = document.getElementById('cp-form');
  var status = document.getElementById('cp-status');
  if (form && status && window.fetch && window.FormData) {
    var submit = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var label = submit.textContent;
      submit.disabled = true;
      submit.textContent = 'Sending...';
      status.className = 'cp-status';
      status.textContent = '';
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('send failed');
        form.reset();
        status.className = 'cp-status ok';
        status.textContent = 'Thank you. Your visa assessment request has been sent. Our team will contact you using the details you provided.';
      }).catch(function () {
        status.className = 'cp-status err';
        status.innerHTML = 'We could not send your request. Please try again, or message us on WhatsApp at <a href="https://wa.me/919003313390" rel="noopener noreferrer">+91 90033 13390</a>.';
      }).then(function () {
        submit.disabled = false;
        submit.textContent = label;
      });
    });
  }
})();
