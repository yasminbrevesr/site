/* Chat de dúvidas — roda inteiro no navegador.
   Sem servidor, sem API, sem conta externa: as respostas abaixo são fixas e
   toda conversa termina no WhatsApp. Para remover o widget do site, basta
   apagar as duas linhas de <link> e <script> das páginas; nenhum outro
   arquivo depende deste. */
(function () {
  'use strict';

  var WHATSAPP = 'https://wa.me/5521984371741';

  /* Todo o conteúdo editável vive aqui. Cada pergunta tem o texto do botão
     (p), a resposta (r), a mensagem que o botão do rodapé passa a levar para
     o WhatsApp depois dela (wa) e, quando faz sentido, um link para
     aprofundar (link). */
  var CONTEUDO = {
    matriz: {
      saudacao: 'Olá! Aqui dá para tirar as dúvidas mais comuns sobre a BREVES. Sobre o que você quer saber?',
      perguntas: [
        {
          p: 'O que a BREVES faz?',
          r: 'Desenhamos tecnologia sob medida para a operação de cada cliente: automação de rotinas, integração entre sistemas por API, agentes de IA, chatbot de atendimento, gestão de marketplace e painéis em Power BI. Nada aqui é pacote pronto — a proposta parte sempre do que já roda na sua empresa.',
          wa: 'Olá! Vi o site e queria entender melhor o que a BREVES faz.'
        },
        {
          p: 'Quanto custa?',
          r: 'Não temos tabela de preço, e chutar um valor sem conhecer a operação seria desonesto. O escopo sai de uma conversa inicial, em que entendemos o cenário antes de propor qualquer caminho — e essa primeira conversa é sem compromisso.',
          wa: 'Olá! Queria entender como funciona o orçamento da BREVES.'
        },
        {
          p: 'Integra com o sistema que eu já uso?',
          r: 'Na maioria dos casos, sim — e trocar de sistema quase nunca é o ponto de partida. Já conectamos ERPs, CRMs, marketplaces, Power BI, Power Automate, Teams, Excel, SharePoint, Google Sheets, n8n e Zapier. Se a sua ferramenta não estiver nessa lista, dá para avaliar: na prática depende da API que ela abre.',
          wa: 'Olá! Queria saber se a BREVES integra com os sistemas que eu já uso.'
        },
        {
          p: 'Quanto tempo demora?',
          r: 'Depende do escopo, mas a implantação acontece por etapas: cada entrega é validada antes de entrar na rotina. Isso evita parar a operação e permite começar por uma frente só, a mais crítica, em vez de tudo de uma vez.',
          wa: 'Olá! Queria entender os prazos de um projeto com a BREVES.'
        },
        {
          p: 'Atendem escritórios de advocacia?',
          r: 'Sim — é uma vertical inteira da empresa. A BREVES Jurídico cuida de migração de sistemas, cálculos, controle de intimações e prazos, cadastro automático de clientes e elaboração de petições no padrão do próprio escritório.',
          link: { href: 'juridico/', texto: 'Ver a página do Jurídico' },
          wa: 'Olá! Tenho um escritório de advocacia e queria conhecer a BREVES Jurídico.'
        },
        {
          p: 'Como começa?',
          r: 'Com uma conversa sem compromisso. Escutamos o que está travando hoje, fazemos uma leitura objetiva do cenário e apontamos o que dá para resolver primeiro. Sem fórmula pronta e sem proposta antes de entender o problema.',
          wa: 'Olá! Queria marcar uma conversa inicial com a BREVES.'
        }
      ]
    },

    juridico: {
      saudacao: 'Olá! Aqui dá para tirar as dúvidas mais comuns sobre a BREVES Jurídico. Sobre o que você quer saber?',
      perguntas: [
        {
          p: 'O que vocês fazem por um escritório?',
          r: 'Migração de sistemas, cálculos jurídicos conferíveis, gestão inteligente de processos, controle de intimações e prazos, cadastro automático de clientes a partir da procuração e elaboração de petições no padrão do escritório. Tudo desenhado em cima da rotina que já existe.',
          wa: 'Olá! Tenho um escritório e queria entender o que a BREVES Jurídico faz.'
        },
        {
          p: 'Quanto custa?',
          r: 'Não trabalhamos com tabela de preço. Cada escritório tem um fluxo diferente, então o escopo sai de uma conversa inicial — sem compromisso — em que entendemos o cenário antes de propor qualquer caminho.',
          wa: 'Olá! Queria entender como funciona o orçamento da BREVES Jurídico.'
        },
        {
          p: 'Funciona com o sistema que já usamos?',
          r: 'Normalmente sim, e trocar de sistema não é o ponto de partida. Já trabalhamos com ADVBOX, Trello, Google Drive, Gmail, WhatsApp, Google Agenda, Notion, ClickUp, Outlook e Power BI, entre outros. Substituir só faz sentido quando o próprio sistema é o gargalo.',
          wa: 'Olá! Queria saber se a BREVES integra com o sistema do meu escritório.'
        },
        {
          p: 'A IA vai substituir minha equipe?',
          r: 'Não. A automação tira do caminho a tarefa repetitiva — capturar publicação, redigitar dado, montar cadastro — para a equipe focar no que exige julgamento. A revisão humana continua dentro do fluxo em todas as etapas.',
          wa: 'Olá! Queria entender como a automação se encaixa na rotina da minha equipe.'
        },
        {
          p: 'Como é a migração de sistema?',
          r: 'Migramos dados, históricos e fluxos operacionais com planejamento: mapeamos as informações, validamos a integridade dos dados e preparamos a equipe antes da virada. O objetivo é que a rotina do escritório não pare durante a transição.',
          wa: 'Olá! Preciso migrar o sistema do meu escritório e queria conversar sobre isso.'
        },
        {
          p: 'Como começa?',
          r: 'Com uma conversa sem compromisso. Entendemos onde a rotina trava hoje, fazemos uma leitura objetiva do cenário e apontamos por onde começar. Depois a implantação acontece por etapas, com cada entrega validada antes de entrar no dia a dia.',
          wa: 'Olá! Queria marcar uma conversa inicial com a BREVES Jurídico.'
        }
      ]
    }
  };

  /* O mesmo destino do formulário de contato. A origem reaproveita os
     valores que a tabela já aceita; o que distingue um lead do chat vai na
     mensagem, que é texto livre e não tem restrição. */
  var SUPABASE_URL = 'https://mubkdnwzscnirfqnhcpu.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_tBvoqhNTb_Aw-HSLoKblsA_LD2M3Qye';
  var ORIGEM = {
    matriz: 'site-matriz-tecnologia',
    juridico: 'site-principal-juridico'
  };

  var script = document.querySelector('script[data-breves-chat]');
  var pagina = (script && script.getAttribute('data-breves-chat')) || 'matriz';
  var dados = CONTEUDO[pagina];
  if (!dados) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var restantes = dados.perguntas.slice();
  var aberto = false;
  var iniciado = false;

  function link(mensagem) {
    return WHATSAPP + '?text=' + encodeURIComponent(mensagem);
  }

  function el(tag, classe, texto) {
    var node = document.createElement(tag);
    if (classe) node.className = classe;
    if (texto) node.textContent = texto;
    return node;
  }

  /* ------------------------------------------------------------- estrutura */

  var launcher = el('button', 'bv-chat-launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'bv-chat-panel');
  launcher.setAttribute('aria-label', 'Abrir chat de dúvidas');
  launcher.innerHTML =
    '<svg class="bv-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.5 9.5 0 0 1-2.8-.4L3 21l1.6-4.7A8.2 8.2 0 0 1 3.5 11 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z"/></svg>' +
    '<svg class="bv-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';

  var painel = el('div', 'bv-chat');
  painel.id = 'bv-chat-panel';
  painel.setAttribute('role', 'dialog');
  painel.setAttribute('aria-label', 'Chat de dúvidas da BREVES');
  painel.hidden = true;

  var cabecalho = el('div', 'bv-chat-head');
  var titulo = el('div', 'bv-chat-title');
  titulo.appendChild(el('b', null, 'BREVES'));
  titulo.appendChild(el('span', null, 'Respostas rápidas · sem compromisso'));
  var fechar = el('button', 'bv-chat-close');
  fechar.type = 'button';
  fechar.setAttribute('aria-label', 'Fechar chat de dúvidas');
  fechar.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  cabecalho.appendChild(titulo);
  cabecalho.appendChild(fechar);

  var log = el('div', 'bv-chat-log');
  log.setAttribute('role', 'log');
  log.setAttribute('aria-live', 'polite');

  var rodape = el('div', 'bv-chat-foot');
  var waRodape = el('a', 'bv-chat-wa', 'Falar no WhatsApp');
  waRodape.href = link('Olá! Gostaria de saber mais sobre as soluções da empresa.');
  waRodape.target = '_blank';
  waRodape.rel = 'noopener noreferrer';
  rodape.appendChild(waRodape);

  painel.appendChild(cabecalho);
  painel.appendChild(log);
  painel.appendChild(rodape);
  document.body.appendChild(painel);
  document.body.appendChild(launcher);

  /* --------------------------------------------------------------- mensagens */

  /* Rolar até o fim deixaria a lista de sugestões na tela e empurraria a
     resposta para cima, fora da vista. O ponto certo de parada é o topo da
     pergunta: a partir dele vêm a resposta e, só depois, as sugestões. */
  function mostrarTopo(elemento) {
    var deslocamento = elemento.getBoundingClientRect().top - log.getBoundingClientRect().top;
    var destino = Math.max(0, log.scrollTop + deslocamento - 12);
    if (reducedMotion || !log.scrollTo) log.scrollTop = destino;
    else log.scrollTo({ top: destino, behavior: 'smooth' });
  }

  function balao(classe, texto) {
    var msg = el('div', 'bv-msg ' + classe);
    msg.appendChild(el('p', null, texto));
    log.appendChild(msg);
    return msg;
  }

  function opcoes() {
    var bloco = el('div', 'bv-options');

    restantes.forEach(function (item) {
      var botao = el('button', 'bv-opt', item.p);
      botao.type = 'button';
      botao.addEventListener('click', function () { responder(item); });
      bloco.appendChild(botao);
    });

    var escape = el('a', 'bv-opt bv-opt-wa', restantes.length
      ? 'Minha dúvida não está aqui'
      : 'Falar com alguém agora');
    escape.href = link(restantes.length
      ? 'Olá! Tenho uma dúvida que não estava no chat do site.'
      : 'Olá! Vi as respostas no site e queria conversar.');
    escape.target = '_blank';
    escape.rel = 'noopener noreferrer';
    bloco.appendChild(escape);

    log.appendChild(bloco);
  }

  function responder(item) {
    /* Cada pergunta sai da lista para as opções seguintes mostrarem só o que
       ainda não foi respondido. */
    restantes = restantes.filter(function (outro) { return outro !== item; });

    var listas = log.querySelectorAll('.bv-options');
    if (listas.length) listas[listas.length - 1].remove();

    var pergunta = balao('bv-user', item.p);

    /* Repetir o link do WhatsApp embaixo de cada resposta ficava insistente.
       Em vez disso, o botão fixo do rodapé passa a carregar a mensagem da
       última dúvida — o contexto se preserva sem poluir a conversa. */
    if (item.wa) waRodape.href = link(item.wa);

    var digitando = el('div', 'bv-msg bv-bot bv-typing');
    digitando.innerHTML = '<span></span><span></span><span></span>';
    digitando.setAttribute('aria-hidden', 'true');
    log.appendChild(digitando);
    mostrarTopo(pergunta);

    /* A digitação acompanha o tamanho da resposta, como aconteceria com
       alguém escrevendo do outro lado. */
    var espera = reducedMotion ? 0 : Math.min(1900, 800 + item.r.length * 3);

    window.setTimeout(function () {
      digitando.remove();
      var msg = balao('bv-bot', item.r);

      if (item.link) {
        var ancora = el('a', 'bv-msg-link', item.link.texto);
        ancora.href = item.link.href;
        msg.appendChild(ancora);
      }

      if (!restantes.length) {
        balao('bv-bot', 'Por aqui era isso. Se ficou alguma coisa de fora, o caminho mais rápido é o WhatsApp — respondemos por lá mesmo.');
      }

      opcoes();
      mostrarTopo(pergunta);
    }, espera);
  }

  /* ------------------------------------------------ identificação do lead */

  var CADASTRO = 'bv-chat-lead';

  function jaSeIdentificou() {
    try { return window.sessionStorage.getItem(CADASTRO) === '1'; } catch (erro) { return false; }
  }

  function registrar(nome, telefone) {
    return window.fetch(SUPABASE_URL + '/rest/v1/contatos_site', {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        nome: nome,
        contato: telefone,
        canal: 'whatsapp',
        origem: ORIGEM[pagina] || ORIGEM.matriz,
        mensagem: 'Contato iniciado pelo chat de dúvidas do site.',
        user_agent: navigator.userAgent.slice(0, 500),
        pagina_origem: window.location.href.slice(0, 500)
      })
    }).then(function (resposta) {
      if (!resposta.ok) {
        return resposta.text().catch(function () { return ''; }).then(function (detalhe) {
          throw new Error('HTTP ' + resposta.status + (detalhe ? ' — ' + detalhe : ''));
        });
      }
    });
  }

  function identificacao() {
    var bloco = el('form', 'bv-lead');
    bloco.noValidate = true;

    var campoNome = el('label', 'bv-lead-campo');
    campoNome.appendChild(el('span', null, 'Seu nome'));
    var nome = document.createElement('input');
    nome.type = 'text';
    nome.required = true;
    nome.maxLength = 120;
    nome.autocomplete = 'name';
    nome.placeholder = 'Como podemos chamar você?';
    campoNome.appendChild(nome);

    var campoTel = el('label', 'bv-lead-campo');
    campoTel.appendChild(el('span', null, 'WhatsApp'));
    var tel = document.createElement('input');
    tel.type = 'tel';
    tel.required = true;
    tel.maxLength = 30;
    tel.autocomplete = 'tel';
    tel.placeholder = '(00) 90000-0000';
    campoTel.appendChild(tel);

    var erro = el('p', 'bv-lead-erro');
    erro.hidden = true;

    var enviar = el('button', 'bv-lead-enviar', 'Começar');
    enviar.type = 'submit';

    bloco.appendChild(campoNome);
    bloco.appendChild(campoTel);
    bloco.appendChild(erro);
    bloco.appendChild(enviar);
    log.appendChild(bloco);

    bloco.addEventListener('submit', function (evento) {
      evento.preventDefault();
      var n = nome.value.trim();
      var t = tel.value.trim();

      if (n.length < 2) { falhar('Digite o seu nome para continuar.', nome); return; }
      /* Só conta os dígitos: o formato varia demais para validar máscara. */
      if (t.replace(/\D/g, '').length < 10) { falhar('Digite um WhatsApp com DDD.', tel); return; }

      enviar.disabled = true;
      enviar.textContent = 'Enviando…';
      erro.hidden = true;

      registrar(n, t).then(function () {
        marcarIdentificado();
        bloco.remove();
        balao('bv-user', n + ' · ' + t);
        abrirMenu(n);
      }).catch(function (falha) {
        /* O cadastro não pode barrar a conversa: se o registro falha, a
           pessoa segue para as respostas do mesmo jeito. */
        if (window.console && console.warn) console.warn('Chat: falha ao registrar contato:', falha.message);
        marcarIdentificado();
        bloco.remove();
        balao('bv-user', n + ' · ' + t);
        abrirMenu(n);
      });
    });

    function falhar(texto, campo) {
      erro.textContent = texto;
      erro.hidden = false;
      campo.focus();
    }

    window.setTimeout(function () { nome.focus(); }, reducedMotion ? 0 : 320);
  }

  function marcarIdentificado() {
    try { window.sessionStorage.setItem(CADASTRO, '1'); } catch (erro) { /* modo restrito */ }
  }

  function abrirMenu(nome) {
    balao('bv-bot', nome
      ? 'Obrigado, ' + nome.split(' ')[0] + '! ' + dados.saudacao
      : dados.saudacao);
    opcoes();
  }

  function iniciar() {
    if (iniciado) return;
    iniciado = true;

    if (jaSeIdentificou()) {
      abrirMenu('');
      log.scrollTop = 0;
      return;
    }

    balao('bv-bot', 'Antes de começar, como podemos falar com você? Assim a gente retoma a conversa se ela cair.');
    identificacao();
  }

  /* -------------------------------------------------- chamada de atenção */

  /* Um botão parado no canto passa despercebido, mas insistir para sempre
     irrita. A chamada acontece em três toques espaçados e some ao primeiro
     clique. Depois de aparecer uma vez ela descansa por meia hora, para não
     abordar de novo a cada página — e volta sozinha se a visita se estender,
     em vez de ficar calada pelo resto da aba. */
  var MARCA = 'bv-chat-visto';
  var DESCANSO = 30 * 60 * 1000;
  var relogios = [];
  var selo = null;
  var convite = null;

  function jaViu() {
    try {
      var quando = parseInt(window.sessionStorage.getItem(MARCA), 10);
      return !!quando && (Date.now() - quando) < DESCANSO;
    } catch (erro) {
      return false;
    }
  }

  function marcarVisto() {
    try { window.sessionStorage.setItem(MARCA, String(Date.now())); } catch (erro) { /* modo restrito */ }
  }

  function balancar() {
    if (reducedMotion) return;
    launcher.classList.remove('bv-nudge');
    /* Sem o reflow a classe reaplicada não reinicia a animação. */
    void launcher.offsetWidth;
    launcher.classList.add('bv-nudge');
  }

  /* Fora do balanço a classe não deve sobrar: enquanto ela está no botão, a
     animação disputa o transform com o hover. */
  launcher.addEventListener('animationend', function (evento) {
    if (evento.animationName === 'bv-wiggle') launcher.classList.remove('bv-nudge');
  });

  function esconderConvite() {
    if (!convite) return;
    var alvo = convite;
    convite = null;
    alvo.classList.remove('is-on');
    window.setTimeout(function () { alvo.remove(); }, reducedMotion ? 0 : 320);
  }

  function encerrarChamada() {
    relogios.forEach(window.clearTimeout);
    relogios = [];
    launcher.classList.remove('bv-nudge', 'bv-alerta');
    if (selo) { selo.remove(); selo = null; }
    esconderConvite();
    marcarVisto();
  }

  function chamar() {
    /* O descanso conta a partir da exibição, não do clique: quem ignorou a
       chamada também não deve ser abordado outra vez na página seguinte. */
    marcarVisto();

    selo = el('span', 'bv-badge', '1');
    selo.setAttribute('aria-hidden', 'true');
    launcher.appendChild(selo);
    launcher.classList.add('bv-alerta');

    convite = el('button', 'bv-invite', 'Dúvida rápida? Respondo aqui.');
    convite.type = 'button';
    convite.addEventListener('click', abrir);
    document.body.appendChild(convite);
    void convite.offsetWidth;
    convite.classList.add('is-on');

    balancar();
  }

  if (!jaViu()) {
    relogios.push(window.setTimeout(chamar, 5000));
    relogios.push(window.setTimeout(esconderConvite, 13000));
    relogios.push(window.setTimeout(balancar, 24000));
    relogios.push(window.setTimeout(balancar, 44000));
  }

  /* ----------------------------------------------------------- abrir/fechar */

  function abrir() {
    encerrarChamada();
    aberto = true;
    painel.hidden = false;
    document.body.classList.add('bv-chat-open');
    launcher.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', 'Fechar chat de dúvidas');
    /* O reflow garante que a transição de entrada rode na primeira abertura. */
    void painel.offsetWidth;
    painel.classList.add('is-open');
    iniciar();
    fechar.focus();
  }

  function fecharPainel(devolveFoco) {
    aberto = false;
    painel.classList.remove('is-open');
    document.body.classList.remove('bv-chat-open');
    launcher.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', 'Abrir chat de dúvidas');
    if (devolveFoco) launcher.focus();

    if (reducedMotion) {
      painel.hidden = true;
    } else {
      window.setTimeout(function () {
        if (!aberto) painel.hidden = true;
      }, 260);
    }
  }

  launcher.addEventListener('click', function () {
    if (aberto) fecharPainel(true); else abrir();
  });

  fechar.addEventListener('click', function () { fecharPainel(true); });

  document.addEventListener('keydown', function (event) {
    if (aberto && event.key === 'Escape') fecharPainel(true);
  });
}());
