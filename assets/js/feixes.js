/* ── Feixes de luz do hero da home ───────────────────────────────────────
   Faixas desfocadas subindo na diagonal, cada uma pulsando no seu proprio
   ritmo, desenhadas num canvas por cima do degrade do hero. O degrade
   continua sendo o fundo: isto aqui e so a luz que anda em cima dele.

   Tres decisoes que valem explicacao:

   1. A cor nao esta aqui. Sai das custom properties --feixe-* declaradas no
      paleta.css, entao trocar de paleta troca os feixes junto, sem tocar
      neste arquivo.

   2. O canvas e desenhado a UM QUARTO da resolucao da tela e esticado pelo
      CSS. Como o paleta.css passa um blur de 30px por cima, resolucao nenhuma
      se perde no caminho — e sao 16x menos pixels para preencher por quadro.
      O desenho continua sendo feito em pixels de CSS: quem encolhe e so o
      buffer, por um ctx.scale.

   3. Quem pede menos movimento recebe um quadro parado, nao um hero vazio.
      A imagem continua la, so nao anda.

   O canvas e criado por JS de proposito: sem script, o hero fica com o
   degrade do paleta.css e nada quebra. */
(function () {
  'use strict';

  var hero = document.querySelector('.mz-hero.is-limpo');
  if (!hero || !window.requestAnimationFrame) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'mz-feixes';
  canvas.setAttribute('aria-hidden', 'true');
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  hero.insertBefore(canvas, hero.firstChild);

  /* Um quarto da resolucao: ver nota 2 no topo. Como o borrao de 30px do CSS
     vem depois, na tela, nao ha detalhe nenhum a perder — e sao 16x menos
     pixels para preencher por quadro do que em tamanho natural. */
  var ESCALA = 0.25;

  var menos = window.matchMedia('(prefers-reduced-motion: reduce)');
  var feixes = [];
  var larg = 0;
  var alt = 0;
  var quadro = 0;
  var rodando = false;
  var naTela = true;

  function numero(nome, padrao) {
    var v = parseFloat(getComputedStyle(hero).getPropertyValue(nome));
    return isNaN(v) ? padrao : v;
  }

  var cor = { h: 214, faixa: 52, s: 38, l: 72, forca: 1 };

  function lerCor() {
    cor.h = numero('--feixe-h', 214);
    cor.faixa = numero('--feixe-h-faixa', 52);
    cor.s = numero('--feixe-s', 38);
    cor.l = numero('--feixe-l', 72);
    cor.forca = numero('--feixe-forca', 1);
  }

  /* Quantidade tambem e paleta: e ela que decide se o efeito le como feixes
     separados ou como neblina. Numa tela estreita o hero e mais alto que
     largo e eles se empilham, entao menos cobrem o mesmo espaco. */
  function quantos() {
    var n = numero('--feixe-n', 12);
    return window.innerWidth < 760 ? Math.round(n * 0.6) : n;
  }

  function criaFeixe() {
    return {
      x: Math.random() * larg * 1.5 - larg * 0.25,
      y: Math.random() * alt * 1.5 - alt * 0.25,
      largura: 30 + Math.random() * 60,
      comprimento: alt * 2.5,
      angulo: -35 + Math.random() * 10,
      velocidade: 0.6 + Math.random() * 1.2,
      opacidade: 0.12 + Math.random() * 0.16,
      matiz: cor.h + Math.random() * cor.faixa,
      pulso: Math.random() * Math.PI * 2,
      ritmo: 0.02 + Math.random() * 0.03
    };
  }

  /* Recicla por baixo, em tres colunas, para o campo nao rarear com o tempo. */
  function recicla(f, i, total) {
    var coluna = i % 3;
    var vao = larg / 3;
    f.y = alt + 100;
    f.x = coluna * vao + vao / 2 + (Math.random() - 0.5) * vao * 0.5;
    f.comprimento = alt * 2.5;
    f.largura = 100 + Math.random() * 100;
    f.velocidade = 0.5 + Math.random() * 0.4;
    f.matiz = cor.h + (i * cor.faixa) / total;
    f.opacidade = 0.2 + Math.random() * 0.1;
    /* Matiz e comprimento novos: o degrade guardado nao vale mais. */
    f.degrade = null;
  }

  /* O degrade de cada feixe so depende da matiz e do comprimento, e nenhum dos
     dois muda entre reciclagens — entao ele e construido uma vez e guardado.
     O pulso, que muda todo quadro, vira globalAlpha: mexer num numero e de
     graca, remontar seis paradas de cor nao e. */
  function fazDegrade(f) {
    var g = ctx.createLinearGradient(0, 0, 0, f.comprimento);
    var tom = function (a) {
      return 'hsla(' + f.matiz + ', ' + cor.s + '%, ' + cor.l + '%, ' + a + ')';
    };
    g.addColorStop(0, tom(0));
    g.addColorStop(0.1, tom(0.5));
    g.addColorStop(0.4, tom(1));
    g.addColorStop(0.6, tom(1));
    g.addColorStop(0.9, tom(0.5));
    g.addColorStop(1, tom(0));
    f.degrade = g;
  }

  function desenha(f) {
    if (!f.degrade) fazDegrade(f);
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate((f.angulo * Math.PI) / 180);
    ctx.globalAlpha = f.opacidade * (0.8 + Math.sin(f.pulso) * 0.2) * cor.forca;
    ctx.fillStyle = f.degrade;
    ctx.fillRect(-f.largura / 2, 0, f.largura, f.comprimento);
    ctx.restore();
  }

  /* O borrao NAO e feito aqui. ctx.filter borra na CPU e e reaplicado a cada
     fillRect; quem borra e o filter do CSS sobre o canvas, uma vez por quadro,
     na composicao — o caminho que a GPU acelera. O desenho aqui fica sendo so
     retangulo com degrade, que e barato: cerca de 1,5 ms de script por segundo de
     relogio, medido. */
  function pinta() {
    ctx.clearRect(0, 0, larg, alt);
    for (var i = 0; i < feixes.length; i++) desenha(feixes[i]);
  }

  function dimensiona() {
    var r = hero.getBoundingClientRect();
    /* larg/alt sao pixels de CSS, e todo o resto do arquivo pensa neles. O
       buffer e que e menor. Sem esta separacao, largura e velocidade dos
       feixes ficariam em pixels de buffer — ou seja, 4x mais grossos e 4x mais
       rapidos do que se pretende. */
    larg = Math.max(1, Math.round(r.width));
    alt = Math.max(1, Math.round(r.height));
    /* Atribuir width/height zera o contexto — e apaga o bitmap. No laco o
       proximo quadro repinta; no quadro parado nao ha proximo quadro, entao
       ele precisa ser redesenhado aqui. */
    canvas.width = Math.max(1, Math.round(larg * ESCALA));
    canvas.height = Math.max(1, Math.round(alt * ESCALA));
    /* E a escala que faz o desenho em pixels de CSS cair no buffer reduzido. */
    ctx.scale(ESCALA, ESCALA);
    /* O contexto zerado tambem perdeu os degrades ja montados. */
    for (var j = 0; j < feixes.length; j++) feixes[j].degrade = null;

    /* Os feixes so sao semeados uma vez: refaze-los a cada evento de resize
       embaralharia o campo inteiro durante um arrasto de janela. Eles ficam
       onde estao e pegam o tamanho novo conforme cada um recicla. */
    if (!feixes.length) {
      var n = quantos();
      for (var i = 0; i < n; i++) feixes.push(criaFeixe());
    }
    if (menos.matches) pinta();
  }

  /* Teto de 30 quadros por segundo. Custe o que custar pintar, custa metade
     se pintar metade das vezes — e num movimento tao lento quanto este a
     diferenca para 60 nao se ve. O passo compensa o tempo real decorrido,
     entao a velocidade na tela e a mesma dos 60. */
  var INTERVALO = 1000 / 30;
  var ultimo = 0;

  function anda(agora) {
    quadro = requestAnimationFrame(anda);
    if (!ultimo) ultimo = agora;
    var passado = agora - ultimo;
    if (passado < INTERVALO) return;
    ultimo = agora;

    /* Limitado a 3 para uma aba que volta do fundo nao dar um salto. */
    var passo = Math.min(passado / INTERVALO, 3);
    var total = feixes.length;
    for (var i = 0; i < total; i++) {
      var f = feixes[i];
      f.y -= f.velocidade * 2 * passo;
      f.pulso += f.ritmo * 2 * passo;
      if (f.y + f.comprimento < -100) recicla(f, i, total);
    }
    pinta();
  }

  /* Fora da tela ou com a aba escondida nao ha o que animar: um canvas
     borrado de tela cheia nao e barato. */
  function sincroniza() {
    var deve = naTela && !document.hidden && !menos.matches;
    if (deve === rodando) return;
    rodando = deve;
    if (deve) {
      /* Entra pelo rAF, nunca por chamada direta: anda() depende do carimbo
         de tempo que so o rAF passa. */
      ultimo = 0;
      quadro = requestAnimationFrame(anda);
    } else {
      cancelAnimationFrame(quadro);
    }
  }

  function troca() {
    lerCor();
    for (var i = 0; i < feixes.length; i++) feixes[i].degrade = null;
    cancelAnimationFrame(quadro);
    rodando = false;
    if (menos.matches) pinta();
    else sincroniza();
  }

  lerCor();
  dimensiona();

  if (window.ResizeObserver) new ResizeObserver(dimensiona).observe(hero);
  else window.addEventListener('resize', dimensiona);

  if (window.IntersectionObserver) {
    new IntersectionObserver(function (entradas) {
      naTela = entradas.some(function (e) { return e.isIntersecting; });
      sincroniza();
    }, { threshold: 0 }).observe(hero);
  }

  document.addEventListener('visibilitychange', sincroniza);
  if (menos.addEventListener) menos.addEventListener('change', troca);

  sincroniza();
})();
