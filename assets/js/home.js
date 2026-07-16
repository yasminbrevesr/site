(function () {
  var siteHeader = document.querySelector('header.site');
  var navToggle = document.querySelector('.nav-toggle');
  if (siteHeader && navToggle) {
    navToggle.addEventListener('click', function () {
      var open = siteHeader.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    siteHeader.querySelectorAll('nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteHeader.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && siteHeader.classList.contains('nav-open')) {
        siteHeader.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu');
        navToggle.focus();
      }
    });
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 860px)').matches;

  /* ---------- scroll reveal (IO + manual fallback) ---------- */
  var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function pending() { return els.filter(function (el) { return !el.classList.contains('in'); }); }
  function markIn(el) {
    if (el.classList.contains('in')) return;
    el.classList.add('in');
    el.querySelectorAll('[data-target]').forEach(startCount);
  }
  function manualCheck() {
    var vh = window.innerHeight;
    pending().forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) markIn(el);
    });
  }
  if (reduced) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { markIn(e.target); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      pending().forEach(function (el) { io.observe(el); });
    }
    manualCheck();
    window.addEventListener('load', manualCheck);
  }

  /* ---------- count-up stats ---------- */
  var counted = [];
  function startCount(el) {
    if (reduced || counted.indexOf(el) !== -1) return;
    counted.push(el);
    var target = parseFloat(el.getAttribute('data-target'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var sep = el.getAttribute('data-sep') === '1';
    var dur = 1300, t0 = Date.now();
    var timer = setInterval(function () {
      var p = Math.min(1, (Date.now() - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(decimals);
      var str = decimals ? val.replace('.', ',') : val;
      if (sep) str = str.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      el.textContent = prefix + str + suffix;
      if (p >= 1) clearInterval(timer);
    }, 24);
  }

  /* ---------- header state + scrollspy + hint ---------- */
  var header = document.querySelector('header.site');
  var hint = document.querySelector('.scroll-hint');
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('nav a[data-spy]'));
  var spySections = spyLinks.map(function (a) { return document.getElementById(a.getAttribute('data-spy')); });

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 40);
    if (hint) hint.classList.toggle('gone', y > 80);

    var current = 0;
    for (var i = 0; i < spySections.length; i++) {
      if (spySections[i] && spySections[i].getBoundingClientRect().top <= 140) current = i;
    }
    spyLinks.forEach(function (a, i) { a.classList.toggle('active', i === current); });
  }

  var t;
  window.addEventListener('scroll', function () {
    if (t) return;
    t = setTimeout(function () { t = null; onScroll(); if (!reduced) manualCheck(); }, 80);
  }, { passive: true });
  onScroll();

  /* ---------- laptop lid: Apple-style scroll scrub with inertia ---------- */
  var lid = document.getElementById('lid3d');
  var shade = document.getElementById('screen-shade');
  var heroEl = document.querySelector('.hero');
  var lidCur = -82, lidTgt = -82;

  function lidCalc() {
    var total = Math.max(heroEl.offsetHeight - window.innerHeight, 1);
    var y = window.scrollY || document.documentElement.scrollTop;
    var p = Math.min(1, Math.max(0, y / total));
    var t = Math.min(1, p / 0.85);            // abre nos primeiros 85% do pin
    var e = 1 - Math.pow(1 - t, 2);           // desacelera perto do fim
    lidTgt = -82 + e * 78;                    // fechado (-82°) → aberto (-4°)
  }

  var floorGlow = document.getElementById('floor-glow');
  function lidApply(a) {
    lid.style.transform = 'rotateX(' + a.toFixed(2) + 'deg)';
    var dark = Math.min(1, Math.max(0, (-28 - a) / 34));
    if (shade) shade.style.opacity = dark.toFixed(2);
    if (floorGlow) floorGlow.style.opacity = ((1 - dark) * 0.9).toFixed(2);
  }

  var lidFrame = null;
  function lidTick() {
    lidCur += (lidTgt - lidCur) * 0.16;
    if (Math.abs(lidTgt - lidCur) < 0.04) lidCur = lidTgt;
    lidApply(lidCur);
    if (lidCur !== lidTgt) lidFrame = requestAnimationFrame(lidTick);
    else lidFrame = null;
  }
  function scheduleLid() {
    if (lidFrame === null) lidFrame = requestAnimationFrame(lidTick);
  }

  /* ---------- manifesto: as palavras acendem com o scroll ---------- */
  var mani = document.querySelector('.manifesto');
  var maniWords = Array.prototype.slice.call(document.querySelectorAll('.mani-text span'));
  function maniUpdate() {
    if (!mani || reduced || isMobile) return;
    var total = Math.max(mani.offsetHeight - window.innerHeight, 1);
    var p = Math.min(1, Math.max(0, -mani.getBoundingClientRect().top / total));
    var litCount = Math.round(p * 1.12 * maniWords.length);
    maniWords.forEach(function (w, i) { w.classList.toggle('lit', i < litCount); });
  }

  /* ---------- paralaxe sutil no fluxo do Jurídico ---------- */
  var jflowEl = document.querySelector('.jflow');
  function plxUpdate() {
    if (!jflowEl || reduced) return;
    var r = jflowEl.getBoundingClientRect();
    var off = (r.top + r.height / 2 - window.innerHeight / 2) * -0.05;
    jflowEl.style.transform = 'translateY(' + off.toFixed(1) + 'px)';
  }

  if (lid && !reduced && !isMobile) {
    lidCalc();
    lidApply(lidCur);
    window.addEventListener('scroll', function () {
      lidCalc();
      scheduleLid();
      maniUpdate();
      plxUpdate();
      if (document.hidden) { lidCur = lidTgt; lidApply(lidCur); }
    }, { passive: true });
    window.addEventListener('resize', function () { lidCalc(); scheduleLid(); });
    scheduleLid();
    maniUpdate();
    plxUpdate();
  } else {
    if (lid) { lidApply(-4); if (shade) shade.style.opacity = '0'; }
    if (!reduced) {
      window.addEventListener('scroll', plxUpdate, { passive: true });
      plxUpdate();
    }
  }


  /* ---------- toggle de canal: e-mail vs whatsapp ---------- */
  var chanEmail = document.getElementById('chan-email');
  var chanWhats = document.getElementById('chan-whats');
  var fieldContato = document.getElementById('f-email');
  var fieldCanal = document.getElementById('f-canal');
  if (chanEmail && chanWhats && fieldContato) {
    function setChannel(canal) {
      var isEmail = canal === 'email';
      chanEmail.setAttribute('aria-pressed', isEmail ? 'true' : 'false');
      chanWhats.setAttribute('aria-pressed', isEmail ? 'false' : 'true');
      fieldContato.value = '';
      if (isEmail) {
        fieldContato.type = 'email';
        fieldContato.placeholder = 'seu@email.com';
        fieldContato.setAttribute('inputmode', 'email');
        fieldContato.autocomplete = 'email';
      } else {
        fieldContato.type = 'tel';
        fieldContato.placeholder = '(00) 90000-0000';
        fieldContato.setAttribute('inputmode', 'tel');
        fieldContato.autocomplete = 'tel';
      }
      fieldCanal.value = canal;
    }
    chanEmail.addEventListener('click', function () { setChannel('email'); });
    chanWhats.addEventListener('click', function () { setChannel('whatsapp'); });
  }
})();
