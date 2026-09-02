/* CMF Title — interactions */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.nav');

  /* --- Active nav link (derived from filename) --- */
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (page === '') page = 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    if (href === page) a.classList.add('active');
  });

  /* --- Nav scroll state + scroll progress --- */
  var bar = document.getElementById('progress');
  var ticking = false;
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* --- Mobile menu --- */
  var burger = document.querySelector('.nav__burger');
  var menu = document.querySelector('.mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Scroll reveal --- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* --- Count-up stats --- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        cio.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count')) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var start = null, dur = 1400;
        function tick(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* --- Accordion --- */
  document.querySelectorAll('.acc__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var acc = q.closest('.acc');
      var body = acc.querySelector('.acc__a');
      var open = acc.classList.toggle('open');
      q.setAttribute('aria-expanded', String(open));
      body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
    });
  });
  window.addEventListener('resize', function () {
    document.querySelectorAll('.acc.open .acc__a').forEach(function (b) {
      b.style.maxHeight = b.scrollHeight + 'px';
    });
  });

  /* --- Hero parallax on floating imagery (composed with --fy float anim) --- */
  if (!reduce && window.matchMedia('(hover: hover) and (min-width: 981px)').matches) {
    var hero = document.querySelector('.hero');
    if (hero) {
      var cards = hero.querySelectorAll('[data-parallax]');
      var raf = null, tx = 0, ty = 0;
      hero.addEventListener('mousemove', function (ev) {
        var r = hero.getBoundingClientRect();
        tx = (ev.clientX - r.left) / r.width - 0.5;
        ty = (ev.clientY - r.top) / r.height - 0.5;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          cards.forEach(function (c) {
            var d = parseFloat(c.getAttribute('data-parallax')) || 10;
            c.style.setProperty('--px', (tx * d).toFixed(2) + 'px');
            c.style.setProperty('--py', (ty * d).toFixed(2) + 'px');
          });
        });
      });
      hero.addEventListener('mouseleave', function () {
        cards.forEach(function (c) {
          c.style.setProperty('--px', '0px');
          c.style.setProperty('--py', '0px');
        });
      });
    }
  }

  /* --- Contact form -> mailto --- */
  var cf = document.getElementById('contactForm');
  if (cf) {
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var name = g('name'), email = g('email'), phone = g('phone'), topic = g('topic'), msg = g('message');
      var note = document.getElementById('formNote');
      if (!name || !email) {
        if (note) { note.textContent = 'Please add your name and email so we can reply.'; note.style.color = '#b5715a'; }
        return;
      }
      var subject = 'CMF Title - ' + (topic || 'Inquiry') + ' from ' + name;
      var body =
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'Topic: ' + topic + '\n\n' +
        'Details:\n' + msg + '\n';
      window.location.href = 'mailto:orders@cmftitle.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      if (note) { note.textContent = 'Opening your email app… if nothing happens, email orders@cmftitle.com directly.'; note.style.color = ''; }
    });
  }

  /* --- Current year --- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
