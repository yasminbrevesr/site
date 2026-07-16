(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* Entrada progressiva, com fallback sem IntersectionObserver. */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function revealVisible() {
    var limit = window.innerHeight * 0.92;
    reveals.forEach(function (element) {
      if (element.classList.contains('in')) return;
      var rect = element.getBoundingClientRect();
      if (rect.top < limit && rect.bottom > 0) element.classList.add('in');
    });
  }

  if (reducedMotion) {
    reveals.forEach(function (element) { element.classList.add('in'); });
  } else if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    reveals.forEach(function (element) {
      if (!element.classList.contains('in')) revealObserver.observe(element);
    });
  } else {
    revealVisible();
  }

  /* Navegação responsiva. */
  var body = document.body;
  var header = document.querySelector('[data-header]');
  var nav = document.getElementById('main-nav');
  var navToggle = document.querySelector('.nav-toggle');

  function closeMenu() {
    if (!nav || !navToggle) return;
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
    body.classList.remove('menu-open');
  }

  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMenu); });
    window.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) closeMenu(); });
  }

  /* Progresso, estado do cabeçalho e movimento do objeto central. */
  var pageProgress = document.querySelector('[data-page-progress]');
  var hero = document.querySelector('[data-hero]');
  var orbit = document.querySelector('[data-orbit]');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var spySections = navLinks.map(function (link) { return document.getElementById(link.getAttribute('data-nav')); });
  var scrollTicking = false;

  function updateNavSpy() {
    var current = '';
    spySections.forEach(function (section) {
      if (section && section.getBoundingClientRect().top <= 180) current = section.id;
    });
    navLinks.forEach(function (link) { link.classList.toggle('active', link.getAttribute('data-nav') === current); });
  }

  function updateScrollState() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 38);
    if (pageProgress) {
      var max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      pageProgress.style.width = Math.min(100, Math.max(0, (y / max) * 100)) + '%';
    }
    if (hero && orbit && !reducedMotion) {
      var progress = Math.min(1, Math.max(0, y / Math.max(hero.offsetHeight * 0.82, 1)));
      hero.style.setProperty('--orbit-scroll', (progress * 90).toFixed(2) + 'deg');
      hero.style.setProperty('--orbit-lift', (progress * -34).toFixed(1) + 'px');
    }
    updateNavSpy();
    revealVisible();
  }

  window.addEventListener('scroll', function () {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      scrollTicking = false;
      updateScrollState();
    });
  }, { passive: true });

  if (hero && orbit && finePointer && !reducedMotion) {
    hero.addEventListener('pointermove', function (event) {
      var rect = orbit.getBoundingClientRect();
      var x = Math.max(-1, Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2)));
      var y = Math.max(-1, Math.min(1, (event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2)));
      hero.style.setProperty('--orbit-x', (x * 7).toFixed(2) + 'deg');
      hero.style.setProperty('--orbit-y', (y * -5).toFixed(2) + 'deg');
    });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--orbit-x', '0deg');
      hero.style.setProperty('--orbit-y', '0deg');
    });
  }

  /* Abas acessíveis das frentes de atuação. */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.practice-tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.practice-panel'));

  function activateTab(tab, focus) {
    var target = tab.getAttribute('data-tab');
    tabs.forEach(function (item) {
      var active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', active ? 'true' : 'false');
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach(function (panel) {
      var active = panel.getAttribute('data-panel') === target;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { activateTab(tab, false); });
    tab.addEventListener('keydown', function (event) {
      var index = tabs.indexOf(tab);
      var next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activateTab(tabs[next], true);
    });
  });
  if (tabs.length) activateTab(tabs[0], false);

  /* O fluxo processual se move lentamente e pausa em aba inativa. */
  var flowRows = Array.prototype.slice.call(document.querySelectorAll('.flow-row'));
  if (flowRows.length > 1 && !reducedMotion) {
    var flowIndex = 0;
    window.setInterval(function () {
      if (document.hidden || document.getElementById('panel-contencioso').hidden) return;
      flowRows[flowIndex].classList.remove('active');
      flowIndex = (flowIndex + 1) % flowRows.length;
      flowRows[flowIndex].classList.add('active');
    }, 2400);
  }

  /* Destaque da etapa do método observada. */
  var methodSteps = Array.prototype.slice.call(document.querySelectorAll('.method-steps li'));
  if ('IntersectionObserver' in window && methodSteps.length) {
    var methodObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        methodSteps.forEach(function (step) { step.classList.toggle('is-current', step === entry.target); });
      });
    }, { rootMargin: '-35% 0px -50% 0px', threshold: 0 });
    methodSteps.forEach(function (step) { methodObserver.observe(step); });
  }

  /* Diagnóstico operacional. */
  var diagnostic = document.querySelector('[data-diagnostic]');
  if (diagnostic) {
    var questions = Array.prototype.slice.call(diagnostic.querySelectorAll('[data-question]'));
    var result = diagnostic.querySelector('[data-diagnostic-result]');
    var diagnosticProgress = diagnostic.querySelector('[data-diagnostic-progress]');
    var diagnosticCta = diagnostic.querySelector('[data-diagnostic-cta]');
    var answers = {};

    function updateDiagnostic() {
      var keys = Object.keys(answers);
      var answered = keys.length;
      var score = keys.reduce(function (total, key) { return total + answers[key]; }, 0);
      diagnosticProgress.style.width = ((answered / questions.length) * 100) + '%';

      if (answered < questions.length) {
        var remaining = questions.length - answered;
        result.querySelector('strong').textContent = remaining === 1 ? 'Falta 1 resposta.' : 'Faltam ' + remaining + ' respostas.';
        result.querySelector('p').textContent = 'A análise é atualizada conforme você responde.';
        diagnosticCta.disabled = true;
        return;
      }

      var title;
      var description;
      if (score >= 3) {
        title = 'Há alto potencial para organizar e automatizar a operação.';
        description = 'O ponto de partida recomendado é mapear prazos, responsabilidades e integrações.';
      } else if (score >= 1) {
        title = 'A operação tem oportunidades pontuais de consolidação.';
        description = 'Uma leitura dos fluxos ajuda a priorizar ganhos sem interromper a rotina.';
      } else {
        title = 'A operação já demonstra boa maturidade de processos.';
        description = 'O diagnóstico pode concentrar-se em inteligência gerencial e evolução da experiência.';
      }
      result.querySelector('strong').textContent = title;
      result.querySelector('p').textContent = description;
      diagnosticCta.disabled = false;
      diagnosticCta.dataset.score = String(score);
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
      if (message) message.value = 'Quero conversar sobre o diagnóstico inicial. Resultado: ' + diagnosticCta.dataset.score + ' de 4 pontos de atenção operacional.';
      if (form) {
        form.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
        window.setTimeout(function () {
          var firstField = form.querySelector('input:not([type="hidden"])');
          if (firstField) firstField.focus({ preventScroll: true });
        }, reducedMotion ? 0 : 650);
      }
    });
  }

  /* Alternância do canal, mantendo um único campo e payload para o Supabase. */
  var channelButtons = Array.prototype.slice.call(document.querySelectorAll('[data-channel]'));
  var contactInput = document.getElementById('f-contato');
  var channelInput = document.getElementById('f-canal');
  channelButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var channel = button.getAttribute('data-channel');
      channelButtons.forEach(function (item) { item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); });
      if (!contactInput || !channelInput) return;
      channelInput.value = channel;
      contactInput.value = '';
      if (channel === 'whatsapp') {
        contactInput.type = 'tel';
        contactInput.placeholder = '(00) 90000-0000';
        contactInput.autocomplete = 'tel';
        contactInput.maxLength = 30;
      } else {
        contactInput.type = 'email';
        contactInput.placeholder = 'seu@email.com';
        contactInput.autocomplete = 'email';
        contactInput.maxLength = 254;
      }
      contactInput.focus();
    });
  });

  /* Mantém apenas uma resposta do FAQ aberta por vez. */
  var details = Array.prototype.slice.call(document.querySelectorAll('.faq details'));
  details.forEach(function (detail) {
    detail.addEventListener('toggle', function () {
      if (!detail.open) return;
      details.forEach(function (other) { if (other !== detail) other.open = false; });
    });
  });

  updateScrollState();
  window.addEventListener('load', updateScrollState);
})();
