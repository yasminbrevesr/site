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
    var activeIndex = tabs.indexOf(tab);
    var shell = tab.closest('.practice-shell');
    if (shell) shell.style.setProperty('--active-step', activeIndex);
    tabs.forEach(function (item) {
      var active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', active ? 'true' : 'false');
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach(function (panel) {
      var active = panel.getAttribute('data-panel') === target;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
      if (active && !reducedMotion) {
        panel.style.animation = 'none';
        void panel.offsetWidth;
        panel.style.animation = '';
      }
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

  /* Calculadora de eficiência operacional. */
  var calculator = document.querySelector('[data-calculator]');
  if (calculator) {
    var teamInput = document.getElementById('calc-equipe');
    var hoursInput = document.getElementById('calc-horas');
    var hourlyInput = document.getElementById('calc-valor');
    var teamOutput = document.getElementById('calc-equipe-output');
    var hoursOutput = document.getElementById('calc-horas-output');
    var hourlyOutput = document.getElementById('calc-valor-output');
    var valueOutput = document.getElementById('calculator-value');
    var manualHoursOutput = document.getElementById('calculator-manual-hours');
    var recoveredHoursOutput = document.getElementById('calculator-recovered-hours');
    var calculatorResult = calculator.querySelector('[data-calculator-result]');
    var calculatorProgress = calculator.querySelector('[data-calculator-progress]');
    var progressLabel = calculator.querySelector('[data-calculator-progress-label]');
    var calculatorCta = calculator.querySelector('[data-calculator-cta]');
    var inputs = [teamInput, hoursInput, hourlyInput];
    var touched = {};
    var displayedValue = 23100;
    var animationFrame;

    function currency(value) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
    }

    function updateRangeTrack(input) {
      var progress = ((Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min))) * 100;
      input.style.setProperty('--range-progress', progress + '%');
    }

    function animateValue(nextValue) {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      var startValue = displayedValue;
      var startTime;

      function frame(time) {
        if (!startTime) startTime = time;
        var progress = Math.min((time - startTime) / 460, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        displayedValue = Math.round(startValue + ((nextValue - startValue) * eased));
        valueOutput.textContent = currency(displayedValue);
        if (progress < 1) animationFrame = window.requestAnimationFrame(frame);
      }

      if (reducedMotion) {
        displayedValue = nextValue;
        valueOutput.textContent = currency(nextValue);
      } else {
        animationFrame = window.requestAnimationFrame(frame);
      }
      calculatorResult.classList.remove('is-updating');
      void calculatorResult.offsetWidth;
      calculatorResult.classList.add('is-updating');
      window.setTimeout(function () { calculatorResult.classList.remove('is-updating'); }, 520);
    }

    function updateCalculator(animate) {
      var team = Number(teamInput.value);
      var dailyHours = Number(hoursInput.value);
      var hourlyRate = Number(hourlyInput.value);
      var manualHours = team * dailyHours * 22;
      var recoveredHours = manualHours * .7;
      var recoverableValue = Math.round(recoveredHours * hourlyRate);

      teamOutput.textContent = team + (team === 1 ? ' pessoa' : ' pessoas');
      hoursOutput.textContent = dailyHours.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' h/dia';
      hourlyOutput.textContent = currency(hourlyRate);
      manualHoursOutput.textContent = Math.round(manualHours).toLocaleString('pt-BR') + ' h';
      recoveredHoursOutput.textContent = Math.round(recoveredHours).toLocaleString('pt-BR') + ' h';
      inputs.forEach(updateRangeTrack);

      if (animate) animateValue(recoverableValue);
      else {
        displayedValue = recoverableValue;
        valueOutput.textContent = currency(recoverableValue);
      }
    }

    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        touched[input.id] = true;
        var adjusted = Object.keys(touched).length;
        calculatorProgress.style.width = ((adjusted / inputs.length) * 100) + '%';
        progressLabel.textContent = adjusted === inputs.length ? 'Cenário personalizado' : adjusted + ' de ' + inputs.length + ' ajustados';
        updateCalculator(true);
      });
    });

    calculatorCta.addEventListener('click', function () {
      var message = document.getElementById('f-msg');
      var form = document.querySelector('[data-contact-form]');
      if (message) {
        message.value = 'Quero entender como recuperar cerca de ' + recoveredHoursOutput.textContent + ' por mês. Cenário estimado pela calculadora: ' + valueOutput.textContent + ' em horas de trabalho.';
        message.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (form) {
        form.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
        window.setTimeout(function () {
          var firstField = form.querySelector('input:not([type="hidden"])');
          if (firstField) firstField.focus({ preventScroll: true });
        }, reducedMotion ? 0 : 650);
      }
    });

    updateCalculator(false);
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
  /* Random Letter Swap — interação isolada do botão de envio. */
  var randomLetterButton = document.querySelector('[data-random-letter-button]');
  if (randomLetterButton) {
    var randomLetterLabel = randomLetterButton.querySelector('[data-random-letter-label]');
    var originalLabel = randomLetterLabel.getAttribute('data-random-letter-label') || '';
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var swapTimers = [];
    var swapRunning = false;

    function clearSwapTimers() {
      swapTimers.forEach(function (timer) { window.clearTimeout(timer); });
      swapTimers = [];
    }

    function buildSwapLetters() {
      randomLetterLabel.textContent = '';
      Array.prototype.forEach.call(originalLabel, function (character) {
        var letter = document.createElement('span');
        letter.className = character === ' ' ? 'swap-char swap-space' : 'swap-char';
        letter.textContent = character === ' ' ? '\u00a0' : character;
        letter.setAttribute('data-original-letter', character);
        randomLetterLabel.appendChild(letter);
      });
    }

    function randomCharacter() {
      return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    function runLetterSwap() {
      if (reducedMotion || swapRunning) return;
      swapRunning = true;
      clearSwapTimers();
      var letters = randomLetterLabel.querySelectorAll('.swap-char:not(.swap-space)');

      letters.forEach(function (letter, index) {
        var original = letter.getAttribute('data-original-letter');
        var start = index * 18;
        [0, 32, 64, 96].forEach(function (offset) {
          swapTimers.push(window.setTimeout(function () {
            letter.textContent = randomCharacter();
          }, start + offset));
        });
        swapTimers.push(window.setTimeout(function () {
          letter.textContent = original;
          if (index === letters.length - 1) swapRunning = false;
        }, start + 142));
      });
    }

    buildSwapLetters();
    randomLetterButton.addEventListener('pointerenter', runLetterSwap);
    randomLetterButton.addEventListener('focus', runLetterSwap);
  }

  /* Atraso progressivo (~100ms) entre irmãos que entram em cascata. */
  reveals.forEach(function (element) {
    if (element.classList.contains('in')) return;
    var parent = element.parentNode;
    if (!parent) return;
    var siblings = Array.prototype.filter.call(parent.children, function (child) {
      return child.classList && child.classList.contains('reveal');
    });
    var index = siblings.indexOf(element);
    if (siblings.length > 1 && index > 0) {
      element.style.setProperty('--reveal-delay', (Math.min(index, 5) * 0.1).toFixed(1) + 's');
    }
  });

  /* Entrada editorial: títulos revelados linha por linha. */
  var editorials = Array.prototype.slice.call(document.querySelectorAll('[data-editorial]'));
  if (editorials.length) {
    editorials.forEach(function (heading) {
      var lines = heading.innerHTML.split(/<br\s*\/?>/i);
      heading.innerHTML = lines.map(function (line) {
        return '<span class="ed-line"><span class="ed-inner">' + line + '</span></span>';
      }).join('');
    });
    if (reducedMotion || !('IntersectionObserver' in window)) {
      editorials.forEach(function (heading) { heading.classList.add('in'); });
    } else {
      var editorialObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.2 });
      editorials.forEach(function (heading) { editorialObserver.observe(heading); });
    }
  }

  /* Narrativa central: fluxo jurídico em quatro estágios no núcleo do hero. */
  var orbitStage = document.querySelector('[data-orbit-stage]');
  var orbitIndex = document.querySelector('[data-orbit-index]');
  var orbitSteps = Array.prototype.slice.call(document.querySelectorAll('.orbit-steps i'));
  if (orbitStage && orbitSteps.length === 4 && !reducedMotion) {
    var stages = ['Publicação recebida', 'Prazo identificado', 'Tarefa distribuída', 'Cliente atualizado'];
    var stageIndex = 0;

    function renderStage() {
      orbitStage.textContent = stages[stageIndex];
      orbitStage.classList.remove('is-swapping');
      void orbitStage.offsetWidth;
      orbitStage.classList.add('is-swapping');
      if (orbitIndex) orbitIndex.textContent = '0' + (stageIndex + 1) + ' · 04';
      orbitSteps.forEach(function (dot, i) {
        dot.classList.toggle('on', i === stageIndex);
        dot.classList.toggle('done', i < stageIndex);
      });
    }

    window.setInterval(function () {
      if (document.hidden) return;
      stageIndex = (stageIndex + 1) % stages.length;
      renderStage();
    }, 3400);
  }

  /* Atração magnética muito sutil dos botões pelo cursor. */
  if (finePointer && !reducedMotion) {
    var magnetic = Array.prototype.slice.call(document.querySelectorAll('[data-magnetic]'));
    magnetic.forEach(function (element) {
      var strength = 0.2;
      var maxShift = 6;
      element.addEventListener('pointermove', function (event) {
        var rect = element.getBoundingClientRect();
        var moveX = (event.clientX - (rect.left + rect.width / 2)) * strength;
        var moveY = (event.clientY - (rect.top + rect.height / 2)) * strength;
        moveX = Math.max(-maxShift, Math.min(maxShift, moveX));
        moveY = Math.max(-maxShift, Math.min(maxShift, moveY));
        element.style.setProperty('--mag-x', moveX.toFixed(1) + 'px');
        element.style.setProperty('--mag-y', moveY.toFixed(1) + 'px');
      });
      element.addEventListener('pointerleave', function () {
        element.style.setProperty('--mag-x', '0px');
        element.style.setProperty('--mag-y', '0px');
      });
    });
  }

})();
