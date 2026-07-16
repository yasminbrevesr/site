(function () {
  var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  function pending() { return els.filter(function (el) { return !el.classList.contains('in'); }); }

  function manualCheck() {
    var vh = window.innerHeight;
    pending().forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add('in');
    });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    pending().forEach(function (el) { io.observe(el); });
  }

  var header = document.querySelector('header');
  var hint = document.querySelector('.scroll-hint');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 40);
    if (hint) hint.classList.toggle('gone', y > 80);
  }

  var t;
  window.addEventListener('scroll', function () {
    if (t) return;
    t = setTimeout(function () { t = null; manualCheck(); onScroll(); }, 90);
  }, { passive: true });
  window.addEventListener('load', manualCheck);
  manualCheck();
  onScroll();

  /* ---------- abas de frentes ---------- */
  var tabBtns = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var tabPanels = Array.prototype.slice.call(document.querySelectorAll('.tpanel'));

  function activateTab(btn, moveFocus) {
    var id = btn.getAttribute('data-tab');
    tabBtns.forEach(function (b) {
      var on = b === btn;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    tabPanels.forEach(function (panel) {
      var on = panel.getAttribute('data-panel') === id;
      panel.classList.toggle('active', on);
      panel.hidden = !on;
    });
    if (moveFocus) btn.focus();
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activateTab(btn, false);
    });
    btn.addEventListener('keydown', function (event) {
      var current = tabBtns.indexOf(btn);
      var next = current;
      if (event.key === 'ArrowRight') next = (current + 1) % tabBtns.length;
      else if (event.key === 'ArrowLeft') next = (current - 1 + tabBtns.length) % tabBtns.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabBtns.length - 1;
      else return;
      event.preventDefault();
      activateTab(tabBtns[next], true);
    });
  });
  if (tabBtns.length) activateTab(tabBtns[0], false);

  /* ---------- calculadora ---------- */
  var cEquipe = document.getElementById('c-equipe');
  var cHoras = document.getElementById('c-horas');
  var cValor = document.getElementById('c-valor');

  function brl(n) { return 'R$ ' + Math.round(n).toLocaleString('pt-BR'); }
  function hrs(n) { return (Math.round(n * 10) / 10).toLocaleString('pt-BR') + ' h'; }

  function calc() {
    var equipe = parseFloat(cEquipe.value);
    var horas = parseFloat(cHoras.value);
    var valor = parseFloat(cValor.value);
    var gastas = equipe * horas * 22;      // 22 dias úteis/mês
    var recup = gastas * 0.7;              // ~70% recuperável com automação
    document.getElementById('o-equipe').textContent = equipe;
    document.getElementById('o-horas').textContent = horas.toLocaleString('pt-BR', { minimumFractionDigits: 1 }) + ' h';
    document.getElementById('o-valor').textContent = brl(valor);
    document.getElementById('r-valor').textContent = brl(recup * valor);
    document.getElementById('r-gastas').textContent = hrs(gastas);
    document.getElementById('r-recup').textContent = hrs(recup);
  }

  if (cEquipe) {
    [cEquipe, cHoras, cValor].forEach(function (el) { el.addEventListener('input', calc); });
    calc();
  }
})();
