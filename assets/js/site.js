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

  /* Fundo ASCII animado do hero da matriz — canvas próprio, sem dependências. */
  var asciiCanvas = document.querySelector('[data-ascii]');
  if (asciiCanvas && !reducedMotion && window.matchMedia('(min-width: 1024px)').matches) {
    var asciiCtx = asciiCanvas.getContext('2d');
    var glyphs = '01<>/[]{}=+*·:;#'.split('');
    var host = asciiCanvas.parentNode;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cellSize = 16;
    var cols = 0, rows = 0, grid = [];
    var asciiRaf = null, startTime = 0, lastDraw = 0;

    function asciiBuild() {
      var w = host.offsetWidth, h = host.offsetHeight;
      asciiCanvas.width = Math.round(w * dpr);
      asciiCanvas.height = Math.round(h * dpr);
      asciiCanvas.style.width = w + 'px';
      asciiCanvas.style.height = h + 'px';
      asciiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      asciiCtx.font = '11px "Plex Mono", Consolas, monospace';
      asciiCtx.textBaseline = 'top';
      cols = Math.ceil(w / cellSize);
      rows = Math.ceil(h / cellSize);
      grid = [];
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          grid.push({
            px: x * cellSize,
            py: y * cellSize,
            d: (x / cols + y / rows) / 2,
            phase: Math.random() * Math.PI * 2,
            ch: glyphs[(Math.random() * glyphs.length) | 0]
          });
        }
      }
    }

    function asciiFrame(now) {
      asciiRaf = window.requestAnimationFrame(asciiFrame);
      if (now - lastDraw < 33) return; /* ~30fps */
      lastDraw = now;
      if (!startTime) startTime = now;
      var elapsed = (now - startTime) / 1000;
      var w = asciiCanvas.width / dpr, h = asciiCanvas.height / dpr;
      asciiCtx.clearRect(0, 0, w, h);
      var head = (elapsed * 0.09) % 1;
      for (var i = 0; i < grid.length; i++) {
        var c = grid[i];
        var dd = Math.abs(c.d - head);
        dd = Math.min(dd, 1 - dd);
        var bright = Math.max(0, 1 - dd * 7);
        var base = 0.05 + 0.045 * Math.sin(c.phase + elapsed * 0.7);
        var alpha = base + bright * 0.55;
        if (bright > 0.85 && Math.random() < 0.03) c.ch = glyphs[(Math.random() * glyphs.length) | 0];
        asciiCtx.fillStyle = bright > 0.55
          ? 'rgba(239,182,111,' + alpha.toFixed(3) + ')'
          : 'rgba(242,239,231,' + alpha.toFixed(3) + ')';
        asciiCtx.fillText(c.ch, c.px, c.py);
      }
    }

    asciiBuild();
    asciiRaf = window.requestAnimationFrame(asciiFrame);

    var asciiResize;
    window.addEventListener('resize', function () {
      window.clearTimeout(asciiResize);
      asciiResize = window.setTimeout(function () {
        window.cancelAnimationFrame(asciiRaf);
        startTime = 0;
        asciiBuild();
        asciiRaf = window.requestAnimationFrame(asciiFrame);
      }, 200);
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        window.cancelAnimationFrame(asciiRaf);
      } else {
        startTime = 0; lastDraw = 0;
        asciiRaf = window.requestAnimationFrame(asciiFrame);
      }
    });
  }

  /* Console interativo do hero da matriz — abas, gráfico, métricas ao vivo. */
  var consoleEl = document.querySelector('[data-console]');
  if (consoleEl) {
    var views = {
      operacao: {
        bars: [.4,.6,.5,.78,.55,.86,.66,.9,.7,.95,.6,.82,.5,.72,.56,.66],
        metrics: [{ l: 'Uptime', base: 99.9, dec: 1, s: '%', jit: 0.04 }, { l: 'Tarefas', base: 1240, dec: 0, s: '', jit: 6, k: true }, { l: 'Fila', base: 8, dec: 0, s: '', jit: 2 }],
        term: ['sincronizando prazos…', 'tarefa #128 distribuída', 'operação estável', 'fila processada']
      },
      dados: {
        bars: [.82,.5,.9,.42,.86,.6,.96,.5,.76,.46,.9,.55,.8,.5,.72,.6],
        metrics: [{ l: 'Ingestão', base: 4700, dec: 1, s: '/s', jit: 180, k: true }, { l: 'Latência', base: 42, dec: 0, s: 'ms', jit: 7 }, { l: 'Erros', base: 0, dec: 0, s: '', jit: 0 }],
        term: ['ingestão em tempo real…', 'indexando registros', 'latência nominal', '0 erros nas últimas 24h']
      },
      automacao: {
        bars: [.5,.72,.46,.66,.56,.5,.72,.6,.82,.5,.62,.76,.5,.86,.56,.72],
        metrics: [{ l: 'Fluxos', base: 36, dec: 0, s: '', jit: 1 }, { l: 'Execuções', base: 12400, dec: 1, s: '', jit: 40, k: true }, { l: 'Revisões', base: 3, dec: 0, s: '', jit: 1 }],
        term: ['fluxo #42 concluído', 'disparando automações', 'revisão humana pendente', 'execução agendada']
      }
    };
    var consoleTabs = Array.prototype.slice.call(consoleEl.querySelectorAll('.mz-tab'));
    var chart = consoleEl.querySelector('[data-chart]');
    var metricEls = Array.prototype.slice.call(consoleEl.querySelectorAll('.mz-metric'));
    var termEl = consoleEl.querySelector('[data-term]');
    var barCount = 16;
    var bars = [];
    for (var bi = 0; bi < barCount; bi++) { var bar = document.createElement('i'); chart.appendChild(bar); bars.push(bar); }
    var currentView = 'operacao';
    var termIndex = 0;

    function formatMetric(m, value) {
      if (m.k && value >= 1000) return (value / 1000).toFixed(1) + 'k' + m.s;
      return value.toFixed(m.dec) + m.s;
    }

    function paintBars(jitter) {
      var v = views[currentView];
      for (var i = 0; i < bars.length; i++) {
        var target = v.bars[i];
        if (jitter) target = Math.max(.12, Math.min(1, target + (Math.random() * 2 - 1) * .1));
        bars[i].style.height = (target * 100).toFixed(1) + '%';
      }
    }
    function paintMetrics(jitter) {
      var v = views[currentView];
      metricEls.forEach(function (el, i) {
        var m = v.metrics[i];
        if (!m) return;
        var value = m.base;
        if (jitter && m.jit) value = Math.max(0, m.base + (Math.random() * 2 - 1) * m.jit);
        el.querySelector('[data-ml]').textContent = m.l;
        el.querySelector('[data-mv]').textContent = formatMetric(m, value);
      });
    }
    function setView(view) {
      currentView = view;
      termIndex = 0;
      consoleTabs.forEach(function (t) {
        var active = t.getAttribute('data-view') === view;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      paintBars(false);
      paintMetrics(false);
      if (termEl) termEl.textContent = views[view].term[0];
    }
    consoleTabs.forEach(function (tab) {
      tab.addEventListener('click', function () { setView(tab.getAttribute('data-view')); });
    });
    setView('operacao');

    if (!reducedMotion) {
      window.setInterval(function () {
        if (document.hidden) return;
        paintBars(true);
        paintMetrics(true);
      }, 1500);
      window.setInterval(function () {
        if (document.hidden || !termEl) return;
        var lines = views[currentView].term;
        termIndex = (termIndex + 1) % lines.length;
        termEl.textContent = lines[termIndex];
      }, 2600);
    }
  }

  /* Console de fluxo processual do hero jurídico — narrativa em 4 estágios. */
  var flowConsole = document.querySelector('[data-flow-console]');
  if (flowConsole) {
    var flowRows = Array.prototype.slice.call(flowConsole.querySelectorAll('.mz-flow-row'));
    var flowProgress = flowConsole.querySelector('[data-flow-progress]');
    var flowTerm = flowConsole.querySelector('[data-flow-term]');
    var flowTerms = ['publicação capturada', 'prazo calculado e revisado', 'tarefa atribuída ao responsável', 'cliente atualizado'];
    var flowStep = 0;

    function renderFlow() {
      flowRows.forEach(function (row, i) {
        row.classList.toggle('is-done', i < flowStep);
        row.classList.toggle('is-active', i === flowStep);
      });
      if (flowProgress) flowProgress.style.width = (((flowStep + 1) / flowRows.length) * 100).toFixed(1) + '%';
      if (flowTerm && flowTerms[flowStep]) flowTerm.textContent = flowTerms[flowStep];
    }

    renderFlow();
    if (!reducedMotion && flowRows.length) {
      window.setInterval(function () {
        if (document.hidden) return;
        flowStep = (flowStep + 1) % flowRows.length;
        renderFlow();
      }, 2600);
    }
  }

  /* Seção de integração da matriz — faixas horizontais de ícones percorrendo. */
  var marqueeIcons = document.querySelector('[data-marquee-icons]');
  if (marqueeIcons) {
    var brands = [
      { n: 'WhatsApp', p: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-2.55-1.275-4.22-2.274-5.907-5.17-.173-.297-.018-.458.13-.606.446-.442.446-.768.669-1.208.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-1.714-.025-2.491 1.257-2.491 2.72 0 3.582 3.81 7.034 7.983 7.108 2.981 1.287 3.591 1.157 4.241 1.065.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785a9.87 9.87 0 01-5.034-1.378l-4.102 1.075 1.087-3.973a9.86 9.86 0 01-1.834-5.617C2.168 6.442 6.603 2.009 12.055 2.009c5.45 0 9.884 4.436 9.881 9.892-.003 5.45-4.437 9.884-9.886 9.884M20.463 3.488A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654A11.882 11.882 0 0012.05 23.794c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
      { n: 'Slack', p: 'M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z' },
      { n: 'Notion', p: 'M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933z' },
      { n: 'Trello', p: 'M21.147 0H2.853A2.86 2.86 0 000 2.853v18.294A2.86 2.86 0 002.853 24h18.294A2.86 2.86 0 0024 21.147V2.853A2.86 2.86 0 0021.147 0zM10.34 17.287a.953.953 0 01-.953.953h-4a.954.954 0 01-.954-.953V5.38a.953.953 0 01.954-.953h4a.954.954 0 01.953.953zm9.233-5.467a.944.944 0 01-.953.947h-4a.947.947 0 01-.953-.947V5.38a.953.953 0 01.953-.953h4a.954.954 0 01.953.953z' },
      { n: 'ClickUp', p: 'M2 18.439l3.69-2.828c1.961 2.56 4.044 3.739 6.363 3.739 2.307 0 4.33-1.166 6.203-3.704L22 18.405C19.298 22.065 15.941 24 12.053 24 8.178 24 4.788 22.078 2 18.439zM12.04 6.15l-6.568 5.66-3.036-3.52L12.055 0l9.543 8.296-3.05 3.509z' },
      { n: 'Google Agenda', p: 'M18.316 5.684H24v12.632h-5.684zM5.684 24h12.632v-5.684H5.684zM18.316 5.684V0H1.895A1.894 1.894 0 000 1.895v16.421h5.684V5.684zM0 22.105C0 23.152.848 24 1.895 24h3.289v-5.184H0zM18.816 23.5l4.684-4.684h-4.684z' },
      { n: 'n8n', p: 'M21.474 5.684a2.53 2.53 0 00-2.447 1.895h-2.896a2.526 2.526 0 00-2.492 2.111l-.103.623a1.263 1.263 0 01-1.246 1.055h-1.001a2.527 2.527 0 00-4.893 0H4.973a2.527 2.527 0 10.001 1.263h1.421a2.527 2.527 0 004.894 0h1.001c.62 0 1.148.45 1.246 1.056l.103.623a2.526 2.526 0 002.492 2.11h.37a2.527 2.527 0 10.001-1.262h-.37a1.263 1.263 0 01-1.246-1.056l-.103-.623A2.52 2.52 0 0013.961 12a2.52 2.52 0 00.822-1.48l.103-.622a1.263 1.263 0 011.245-1.056h2.896a2.527 2.527 0 102.447-3.158z' },
      { n: 'Google Drive', p: 'M12.01 1.485H8.267l3.774 6.667 3.76 6.574h7.502L15.768 1.485zM7.25 3.214L0 15.868l3.775 6.595 7.238-12.665zM9.509 15.868l-3.781 6.605h14.466L24 15.868z' }
    ];

    function badgeHTML(brand) {
      return '<span class="mz-mq-badge" title="' + brand.n + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + brand.p + '"/></svg></span>';
    }
    function fillRow(row, items) {
      if (!row) return;
      /* Repete os ícones para que um "grupo" seja mais largo que a tela;
         assim a faixa preenche toda a largura e o loop (translateX -50%)
         fica contínuo, sem sobrar espaço à esquerda. */
      var repeats = Math.max(4, Math.ceil((window.innerWidth + 400) / (items.length * 72)));
      var groupItems = [];
      for (var r = 0; r < repeats; r++) groupItems = groupItems.concat(items);
      var group = groupItems.map(badgeHTML).join('');
      var track = document.createElement('div');
      track.className = 'mz-marquee-track';
      track.innerHTML = group + group; /* dois grupos idênticos para loop contínuo */
      row.appendChild(track);
    }

    var rows = marqueeIcons.querySelectorAll('.mz-marquee-row');
    fillRow(rows[0], brands);
    fillRow(rows[1], brands.slice(4).concat(brands.slice(0, 4)));
  }

})();
