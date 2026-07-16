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

  /* ---------- diagnóstico operacional ---------- */
  var diagnostic = document.querySelector('[data-diagnostic]');
  if (diagnostic) {
    var questions = Array.prototype.slice.call(diagnostic.querySelectorAll('[data-question]'));
    var result = diagnostic.querySelector('[data-diagnostic-result]');
    var progress = diagnostic.querySelector('[data-diagnostic-progress]');
    var diagnosticCta = diagnostic.querySelector('[data-diagnostic-cta]');
    var answers = {};

    function updateDiagnostic() {
      var answered = Object.keys(answers).length;
      var score = Object.keys(answers).reduce(function (total, key) { return total + answers[key]; }, 0);
      progress.style.width = ((answered / questions.length) * 100) + '%';

      if (answered < questions.length) {
        result.querySelector('strong').textContent = 'Faltam ' + (questions.length - answered) + ' resposta(s) para concluir.';
        result.querySelector('p').textContent = 'A análise é atualizada conforme você responde.';
        diagnosticCta.disabled = true;
        return;
      }

      var title;
      var description;
      if (score >= 3) {
        title = 'Sua operação tem alto potencial de ganho com automação.';
        description = 'O melhor ponto de partida é mapear prazos, distribuição de tarefas e integrações para reduzir retrabalho e dependência de conferência.';
      } else if (score >= 1) {
        title = 'Seu escritório está em uma boa fase para consolidar processos.';
        description = 'Há oportunidades pontuais de integração e visibilidade que podem ser priorizadas sem interromper a rotina da equipe.';
      } else {
        title = 'Sua operação já demonstra boa maturidade de processos.';
        description = 'O diagnóstico pode identificar ganhos mais específicos em inteligência gerencial, experiência do cliente e escala.';
      }
      result.querySelector('strong').textContent = title;
      result.querySelector('p').textContent = description;
      diagnosticCta.disabled = false;
      diagnosticCta.dataset.score = score;
    }

    questions.forEach(function (question) {
      question.querySelectorAll('button[data-value]').forEach(function (button) {
        button.addEventListener('click', function () {
          question.querySelectorAll('button[data-value]').forEach(function (item) {
            item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
          });
          answers[question.getAttribute('data-question')] = Number(button.getAttribute('data-value'));
          updateDiagnostic();
        });
      });
    });

    diagnosticCta.addEventListener('click', function () {
      var message = document.getElementById('f-msg');
      var form = document.querySelector('[data-contact-form]');
      if (message) message.value = 'Quero receber um diagnóstico do escritório. Resultado preliminar: ' + diagnosticCta.dataset.score + ' de 4 pontos de atenção operacional.';
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.setTimeout(function () {
          var firstField = form.querySelector('input:not([type="hidden"])');
          if (firstField) firstField.focus({ preventScroll: true });
        }, 650);
      }
    });
  }

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
