(function () {
  var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  function pending() { return els.filter(function (el) { return !el.classList.contains('in'); }); }

  function manualCheck() {
    var vh = window.innerHeight;
    pending().forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add('in');
    });
  }

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    pending().forEach(function (el) { io.observe(el); });
  }

  var header = document.querySelector('header');
  var hint = document.querySelector('.scroll-hint');
  var pageProgress = document.querySelector('[data-page-progress]');
  var hero = document.querySelector('[data-hero]');
  var heroStage = document.querySelector('[data-hero-stage]');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (hint) hint.classList.toggle('gone', y > 80);

    if (pageProgress) {
      var max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      pageProgress.style.width = Math.min(100, Math.max(0, (y / max) * 100)) + '%';
    }

    if (!reduceMotion && hero) {
      var heroProgress = Math.min(1, Math.max(0, y / Math.max(hero.offsetHeight * 0.82, 1)));
      hero.style.setProperty('--hero-circle', (1 + heroProgress * 0.18).toFixed(3));
      if (heroStage) heroStage.style.setProperty('--scroll-rotate', (-3.5 + heroProgress * 3.5).toFixed(2) + 'deg');
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      manualCheck();
      onScroll();
    });
  }, { passive: true });
  window.addEventListener('load', manualCheck);
  manualCheck();
  onScroll();

  /* ---------- direção visual do hero ---------- */
  if (!reduceMotion && hero && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', function (event) {
      var rect = hero.getBoundingClientRect();
      hero.style.setProperty('--glow-x', (((event.clientX - rect.left) / rect.width) * 100).toFixed(1) + '%');
      hero.style.setProperty('--glow-y', (((event.clientY - rect.top) / rect.height) * 100).toFixed(1) + '%');
    });
  }

  var tiltCard = document.querySelector('[data-tilt-card]');
  if (!reduceMotion && heroStage && tiltCard && window.matchMedia('(pointer: fine)').matches) {
    heroStage.addEventListener('pointermove', function (event) {
      var rect = heroStage.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      heroStage.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg');
      heroStage.style.setProperty('--rx', (y * -5).toFixed(2) + 'deg');
    });
    heroStage.addEventListener('pointerleave', function () {
      heroStage.style.setProperty('--ry', '0deg');
      heroStage.style.setProperty('--rx', '0deg');
    });
  }

  var operationEvents = Array.prototype.slice.call(document.querySelectorAll('.operation-event'));
  if (!reduceMotion && operationEvents.length > 1) {
    var activeEvent = 0;
    window.setInterval(function () {
      if (document.hidden) return;
      operationEvents[activeEvent].classList.remove('is-active');
      activeEvent = (activeEvent + 1) % operationEvents.length;
      operationEvents[activeEvent].classList.add('is-active');
    }, 2300);
  }

  /* ---------- cartões com foco e spotlight ---------- */
  Array.prototype.slice.call(document.querySelectorAll('[data-focus-group]')).forEach(function (group) {
    var cards = Array.prototype.slice.call(group.children);
    function focusCard(card) {
      cards.forEach(function (item) { item.classList.toggle('is-dimmed', item !== card); });
    }
    function clearFocus() {
      cards.forEach(function (item) { item.classList.remove('is-dimmed'); });
    }
    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () { focusCard(card); });
      card.addEventListener('focusin', function () { focusCard(card); });
      card.addEventListener('focusout', function (event) {
        if (!group.contains(event.relatedTarget)) clearFocus();
      });
    });
    group.addEventListener('mouseleave', clearFocus);
  });

  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    Array.prototype.slice.call(document.querySelectorAll('[data-spotlight]')).forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', (event.clientX - rect.left).toFixed(1) + 'px');
        card.style.setProperty('--spot-y', (event.clientY - rect.top).toFixed(1) + 'px');
      });
    });
  }

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
