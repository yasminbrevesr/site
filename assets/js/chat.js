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

    /* Página do produto chatbot. Aqui o widget é a própria demonstração do que
       a página vende, então as perguntas são todas sobre atendimento. */
    chatbot: {
      saudacao: 'Olá! Este chat é um exemplo do que fazemos. Sobre o chatbot com IA, o que você quer saber?',
      perguntas: [
        {
          p: 'Como o chatbot atende meus clientes?',
          r: 'Ele entende o que a pessoa escreveu — sem menu de opções e mesmo com erro de digitação —, responde a partir do que foi definido com você e, quando o assunto exige dado atualizado, consulta o seu sistema na hora. O que dá para concluir, ele conclui; o que exige julgamento vai para a sua equipe com o histórico junto.',
          wa: 'Olá! Queria entender como funciona o chatbot com IA da BREVES.'
        },
        {
          p: 'Ele funciona no meu WhatsApp?',
          r: 'Sim, no mesmo número que a sua empresa já usa. Sua equipe continua enxergando as conversas e pode assumir qualquer uma quando quiser — o chatbot não toma o canal para si. Também dá para atender pelo site e pelo Instagram.',
          wa: 'Olá! Queria saber se o chatbot da BREVES funciona no WhatsApp que eu já uso.'
        },
        {
          p: 'Ele consulta meus sistemas?',
          r: 'Quando o sistema abre uma API, sim — e é isso que separa um robô de respostas prontas de um atendimento de verdade. Em vez de texto genérico, ele consulta pedido, status, agenda ou cadastro durante a conversa. Já conectamos ERPs, CRMs, planilhas, agenda, Power BI, n8n e Zapier.',
          wa: 'Olá! Queria saber se o chatbot da BREVES integra com os sistemas que eu já uso.'
        },
        {
          p: 'E se ele não souber responder?',
          r: 'Ele não inventa. Quando a pergunta sai do que foi definido, assume que não tem a resposta e encaminha para uma pessoa, com a conversa inteira junto — sem pedir para o cliente repetir a história. Chute em atendimento custa cliente, e o desenho parte disso.',
          wa: 'Olá! Queria entender como o chatbot da BREVES lida com perguntas fora do escopo.'
        },
        {
          p: 'Quanto tempo leva para colocar no ar?',
          r: 'Depende do escopo, mas a implantação acontece por etapas. Começa pelo conjunto de perguntas que mais se repete, entra em operação e cresce a partir do que as conversas reais mostram — em vez de tentar prever tudo antes de começar.',
          wa: 'Olá! Queria entender o prazo para colocar um chatbot no ar com a BREVES.'
        },
        {
          p: 'Quanto custa?',
          r: 'Não temos tabela de preço, e chutar um valor sem conhecer o atendimento seria desonesto. O escopo sai de uma conversa inicial, em que entendemos por onde chega a demanda e o que mais perguntam — e essa primeira conversa é sem compromisso.',
          wa: 'Olá! Queria entender como funciona o orçamento do chatbot da BREVES.'
        }
      ]
    },

    /* Página do produto agentes de IA. A primeira pergunta é a diferença para o
       chatbot de propósito: é a dúvida que aparece antes de qualquer outra, e
       responder isso mal manda o lead para o produto errado. */
    agentes: {
      saudacao: 'Olá! Este chat responde as dúvidas mais comuns sobre agentes de IA. O que você quer saber?',
      perguntas: [
        {
          p: 'Qual a diferença para o chatbot?',
          r: 'O chatbot conversa; o agente executa. Um chatbot responde a quem escreveu para ele. Um agente é acionado por um horário, por um e-mail que chegou ou por um registro que mudou — consulta as bases da empresa, decide pela regra do negócio e conclui a tarefa, mesmo sem ninguém conversando com ele.',
          wa: 'Olá! Queria entender a diferença entre um agente de IA e um chatbot.',
          link: { texto: 'Ver a página do chatbot', href: '../chatbot/' }
        },
        {
          p: 'O que um agente consegue fazer?',
          r: 'Ler um e-mail em texto livre e responder, consultar uma base antes de decidir, registrar um lead com os campos preenchidos a partir da própria conversa, percorrer uma equipe inteira comparando resultados com uma meta e disparar o aviso certo para quem precisa agir. A página traz quatro exemplos de agentes que já construímos.',
          wa: 'Olá! Queria entender o que um agente de IA consegue fazer na minha operação.'
        },
        {
          p: 'Ele mexe nos meus sistemas?',
          r: 'Quando o sistema abre API, sim, e nos dois sentidos: consulta o dado antes de responder e grava o resultado onde a operação precisa — planilha, banco, CRM ou ERP. É essa parte que separa um agente de um texto bem escrito. Se a sua ferramenta não abre integração, dá para avaliar outros caminhos.',
          wa: 'Olá! Queria saber se um agente de IA da BREVES integra com os sistemas que eu já uso.'
        },
        {
          p: 'E se o agente errar?',
          r: 'O desenho começa pelo que ele não pode fazer. Definimos junto quais decisões o agente toma sozinho, quais exigem confirmação de uma pessoa e o que ele nunca deve afirmar — prazo, valor ou promessa de resultado, por exemplo. Toda execução fica registrada, então dá para auditar qualquer caso depois.',
          wa: 'Olá! Queria entender como vocês controlam o que um agente de IA pode ou não fazer.'
        },
        {
          p: 'Todo processo precisa de um agente?',
          r: 'Não, e dizer isso faz parte do trabalho. Quando a regra é clara e não muda — avisar que um item ficou abaixo do estoque mínimo, por exemplo —, uma automação simples resolve, custa menos e não erra. O agente entra quando o texto é livre, o pedido chega diferente a cada vez ou a decisão exige interpretar o contexto.',
          wa: 'Olá! Queria entender se o meu caso pede um agente de IA ou uma automação simples.'
        },
        {
          p: 'Quanto custa?',
          r: 'Não temos tabela de preço, e chutar um valor sem conhecer o processo seria desonesto. O escopo sai de uma conversa inicial, em que entendemos quem faz a tarefa hoje, de onde vem a informação e o que decide o resultado — e essa primeira conversa é sem compromisso.',
          wa: 'Olá! Queria entender como funciona o orçamento de um agente de IA da BREVES.'
        }
      ]
    },

    /* Página do produto automação de processos. */
    automacao: {
      saudacao: 'Olá! Este chat responde as dúvidas mais comuns sobre automação de processos. O que você quer saber?',
      perguntas: [
        {
          p: 'O que dá para automatizar?',
          r: 'Rotina que se repete e tem regra clara: transferir informação entre sistemas, atualizar planilha e banco de dados, conferir pedido contra nota, gerar documento e relatório, montar e enviar o arquivo de sempre. Se alguém faz a mesma coisa toda semana seguindo um critério, em geral dá para automatizar.',
          wa: 'Olá! Queria entender o que dá para automatizar na minha operação.'
        },
        {
          p: 'Preciso trocar de sistema?',
          r: 'Não. A automação entra em volta do que já existe — lê a planilha, o e-mail e o sistema que a sua equipe usa hoje. Trocar de ferramenta é outro projeto, e quase nunca é o que estava travando a rotina.',
          wa: 'Olá! Queria saber se a automação da BREVES funciona com os sistemas que eu já uso.'
        },
        {
          p: 'E se der erro?',
          r: 'A automação confere a estrutura antes de processar e para quando algo foge do previsto, avisando alguém em vez de gravar dado errado. Cada execução também deixa registro do que leu e do que fez, então dá para auditar qualquer dia depois.',
          wa: 'Olá! Queria entender como a BREVES trata erro em automação.'
        },
        {
          p: 'Vai substituir minha equipe?',
          r: 'Não. Substitui a parte do dia que ninguém queria fazer: copiar, conferir linha por linha e montar o mesmo arquivo. O que exige julgamento, negociação ou exceção continua com quem sabe decidir.',
          wa: 'Olá! Queria entender como a automação se encaixa na rotina da minha equipe.'
        },
        {
          p: 'Quanto custa?',
          r: 'Não temos tabela de preço, e chutar um valor sem conhecer a rotina seria desonesto. O escopo sai de uma conversa inicial, em que entendemos quem faz a tarefa hoje e o que decide o resultado — e essa primeira conversa é sem compromisso.',
          wa: 'Olá! Queria entender como funciona o orçamento de uma automação da BREVES.'
        }
      ]
    },
    /* Página do produto integração entre sistemas. */
    integracao: {
      saudacao: 'Olá! Este chat responde as dúvidas mais comuns sobre integração entre sistemas. O que você quer saber?',
      perguntas: [
        {
          p: 'O que dá para integrar?',
          r: 'ERP, CRM, e-commerce, marketplace, banco de dados, planilha, agenda e ferramentas internas. Já conectamos ERPs, CRMs, marketplaces, Power BI, Excel, Google Sheets e plataformas de automação. Na prática depende da API que a ferramenta abre.',
          wa: 'Olá! Queria saber o que a BREVES consegue integrar.'
        },
        {
          p: 'Meu sistema não tem API.',
          r: 'Em geral ainda dá, por outro caminho: exportação programada, acesso ao banco ou troca de arquivo em pasta compartilhada. Fica menos imediato, mas resolve. Quando não há caminho nenhum, dizemos isso em vez de prometer.',
          wa: 'Olá! Meu sistema não tem API e queria saber se dá para integrar.'
        },
        {
          p: 'Preciso trocar de ERP?',
          r: 'Não é o ponto de partida. Integrar custa menos e para menos a operação do que migrar. Trocar de sistema só entra na conversa quando o próprio sistema é o gargalo.',
          wa: 'Olá! Queria saber se preciso trocar de ERP para integrar meus sistemas.'
        },
        {
          p: 'E se a integração falhar?',
          r: 'O registro entra na fila e é tentado de novo quando o outro lado voltar, e a falha vira aviso para uma pessoa. Cada troca guarda o que saiu, o que entrou e o que o outro lado respondeu.',
          wa: 'Olá! Queria entender como a BREVES trata falha em integração.'
        },
        {
          p: 'Quanto custa?',
          r: 'Não temos tabela de preço. O escopo depende de quantos sistemas entram e do que cada um permite, então sai de uma conversa inicial — sem compromisso — em que entendemos o cenário antes de propor caminho.',
          wa: 'Olá! Queria entender como funciona o orçamento de uma integração da BREVES.'
        }
      ]
    },
    /* Página do produto gestão de marketplace. */
    marketplace: {
      saudacao: 'Olá! Este chat responde as dúvidas mais comuns sobre gestão de marketplace. O que você quer saber?',
      perguntas: [
        {
          p: 'O que vocês fazem pela minha loja?',
          r: 'Revisão do anúncio — título, ficha técnica, foto, descrição e preço —, publicidade dentro do canal, estratégia de venda e acompanhamento do resultado por número. Estoque e envio continuam com você.',
          wa: 'Olá! Queria entender o que a BREVES faz na gestão de marketplace.'
        },
        {
          p: 'Vocês garantem aumento de venda?',
          r: 'Não, e desconfie de quem garante. Venda depende de preço, produto, estoque, prazo e concorrência, e parte disso é da sua operação. O que garantimos é o trabalho feito e o resultado medido de forma honesta.',
          wa: 'Olá! Queria entender que resultado esperar da gestão de marketplace da BREVES.'
        },
        {
          p: 'Já tenho anúncio no ar.',
          r: 'Melhor ainda: começa por uma revisão do que já existe. Em geral a maior parte do ganho está no título, na ficha técnica e na foto, antes de qualquer verba de publicidade.',
          wa: 'Olá! Já vendo em marketplace e queria uma revisão dos meus anúncios.'
        },
        {
          p: 'Em quais canais vocês atuam?',
          r: 'Nos marketplaces mais usados no Brasil. O que muda de um para o outro é a regra de anúncio, o formato de publicidade e o critério de posição. Conte em qual você vende e dizemos com franqueza se faz sentido.',
          wa: 'Olá! Queria saber em quais marketplaces a BREVES trabalha.'
        },
        {
          p: 'Quanto custa?',
          r: 'Não temos tabela de preço. O escopo depende de quantos canais e de quantos anúncios entram, então sai de uma conversa inicial — sem compromisso — em que entendemos a loja antes de propor caminho.',
          wa: 'Olá! Queria entender como funciona o orçamento da gestão de marketplace da BREVES.'
        }
      ]
    },
    /* Página do produto painéis em power bi. */
    powerbi: {
      saudacao: 'Olá! Este chat responde as dúvidas mais comuns sobre painéis em Power BI. O que você quer saber?',
      perguntas: [
        {
          p: 'Como vocês trabalham?',
          r: 'A ordem importa: primeiro entender qual decisão está travada, depois organizar de onde vem cada número, depois automatizar a carga e só então montar o painel. Painel sobre planilha alimentada à mão quebra na primeira semana em que alguém esquece de salvar.',
          wa: 'Olá! Queria entender como a BREVES trabalha com Power BI.'
        },
        {
          p: 'Meus dados estão em planilha.',
          r: 'É o cenário mais comum, e dá para começar assim. A diferença é que a planilha entra como fonte a ser organizada e integrada, não como base permanente. Se ela continuar sendo alimentada à mão, o painel herda o mesmo problema.',
          wa: 'Olá! Meus dados estão em planilha e queria saber se dá para montar um painel.'
        },
        {
          p: 'Pronto ou sob medida?',
          r: 'Modelo pronto serve para ver rápido como uma coisa parece, e trava assim que o seu processo não é igual ao do modelo. Sob medida custa mais no começo e é o que sobrevive à segunda mudança da operação.',
          wa: 'Olá! Queria entender a diferença entre dashboard pronto e sob medida.'
        },
        {
          p: 'Quem mantém depois?',
          r: 'É combinado antes. Dá para entregar com documentação para a sua equipe assumir, ou acompanhar a evolução junto. O que não dá é entregar e sumir: fonte muda, e painel sem dono para de valer em poucos meses.',
          wa: 'Olá! Queria entender como fica a manutenção de um painel feito pela BREVES.'
        },
        {
          p: 'Quanto custa?',
          r: 'Não temos tabela de preço. O valor depende de quantas fontes entram e do estado em que elas estão — integrar costuma pesar mais que montar o painel. O escopo sai de uma conversa inicial, sem compromisso.',
          wa: 'Olá! Queria entender como funciona o orçamento de um painel em Power BI da BREVES.'
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
    juridico: 'site-principal-juridico',
    automacao: 'site-produto-automacao-de-processos',
    integracao: 'site-produto-integracao-de-sistemas',
    agentes: 'site-produto-agentes-de-ia',
    chatbot: 'site-produto-chatbot',
    marketplace: 'site-produto-gestao-de-marketplace',
    powerbi: 'site-produto-dashboards-power-bi'
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
