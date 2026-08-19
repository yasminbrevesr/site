# -*- coding: utf-8 -*-
"""Gera as páginas de produto a partir de um template único.

A estrutura sai idêntica por construção — é essa a razão de existir deste
arquivo. Cabeçalho, rodapé e menu vêm daqui; o conteúdo vem de dados.py.
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dados import PRODUTOS, CATALOGO

# Relativo ao proprio arquivo: o caminho absoluto so valia na maquina em que
# o gerador nasceu, e quebraria em qualquer outra.
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://brevestech.com'

CHECK = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" '
         'stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>')


def menu_produtos(atual, indent):
    """O mesmo catálogo em toda página, com a atual marcada."""
    linhas = []
    for nome, url in CATALOGO:
        aqui = url.rstrip('/') == atual
        href = './' if aqui else '../' + url
        cls = ' class="is-here"' if aqui else ''
        linhas.append(f'{indent}<a{cls} href="{href}">{nome}</a>')
    return '\n'.join(linhas)


def bloco_arte(arte):
    saida = []
    for rotulo, valor, tipo, itens in arte:
        v = f'<b>{valor}</b>' if valor else ''
        c = [f'        <div class="pd-arte">',
             f'          <div class="pd-arte-topo"><span>{rotulo}</span>{v}</div>']
        if tipo == 'chips':
            c.append('          <div class="pd-arte-chips">')
            c += [f'            <span>{i}</span>' for i in itens]
            c.append('          </div>')
        else:
            c.append('          <ul class="pd-arte-campos">')
            for nome, val, mod in itens:
                b = f'<b class="{mod}">' if mod else '<b>'
                c.append(f'            <li><span>{nome}</span>{b}{val}</b></li>')
            c.append('          </ul>')
        c.append('        </div>')
        saida.append('\n'.join(c))
    return '\n\n'.join(saida)


def bloco_painel(pn):
    """A ilustração de relatório do hero. Marcada aria-hidden: é figura, e o
    leitor de tela recebe a descrição pelo aria-label do contêiner."""
    kpis = '\n'.join(
        f"""            <div class="pd-pn-kpi">
              <small>{rot}</small>
              <strong>{val}</strong>
              <i>{ap1}</i>
              <i><em>{ap2}</em></i>
              <span class="pd-pn-meta"><span>Meta</span><u style="--n:{larg}"></u><b>{pct}</b></span>
            </div>""" for rot, val, ap1, ap2, larg, pct in pn['kpis'])

    barras = '\n'.join(
        f'              <li><span>{n}</span><u style="--n:{w}"></u><b>{v}</b></li>'
        for n, v, w in pn['barras'])

    serie = ''.join(f'<i style="--n:{h}"></i>' for h in pn['serie'])
    meses = ''.join(f'<span>{m}</span>' for m in pn['meses'])

    ca, cb, cc = pn['tabela_colunas']
    linhas = '\n'.join(
        f'                <tr><td>{n}</td><td>{v}</td>'
        f'<td class="{"is-ok" if ok else ""}">{p}</td></tr>'
        for n, v, p, ok in pn['tabela'])

    filtros = '\n'.join(
        f'            <span class="pd-pn-filtro"><small>{r}</small><b>{v}</b></span>'
        for r, v in pn['filtros'])

    return f"""      <div class="pd-painel reveal" role="img" aria-label="Ilustração de um relatório de vendas em Power BI, com indicadores, faturamento por grupo de produto, série ao longo do tempo e quebra por região. Os dados são de exemplo.">
        <div class="pd-pn-topo" aria-hidden="true">
          <span class="pd-pn-nome"><b>{pn['titulo']}</b><span class="pd-pn-tag">exemplo</span></span>
          <span class="pd-pn-filtros">
{filtros}
          </span>
        </div>

        <div class="pd-pn-corpo" aria-hidden="true">
          <div class="pd-pn-bloco">
            <b>Principais indicadores</b>
            <div class="pd-pn-kpis">
{kpis}
            </div>
          </div>

          <div class="pd-pn-bloco">
            <b>{pn['barras_titulo']}</b>
            <ul class="pd-pn-barras">
{barras}
            </ul>
          </div>

          <div class="pd-pn-bloco">
            <b>{pn['serie_titulo']}</b>
            <div class="pd-pn-serie">{serie}</div>
            <div class="pd-pn-meses">{meses}</div>
          </div>

          <div class="pd-pn-bloco">
            <b>{pn['tabela_titulo']}</b>
            <table class="pd-pn-tabela">
              <thead><tr><th>{ca}</th><th>{cb}</th><th>{cc}</th></tr></thead>
              <tbody>
{linhas}
              </tbody>
            </table>
          </div>
        </div>
      </div>"""


def hero_arte(p):
    """Duas formas para a coluna direita do hero.

    A padrão são os cartões .pd-arte ao lado da copy. Quem declarar 'painel'
    recebe o hero em vitrine: copy em cima, relatório inteiro embaixo.
    """
    if p.get('painel'):
        return bloco_painel(p['painel'])
    return (f'      <div class="pd-hero-arte reveal" aria-label="{p["arte_rotulo"]}">\n'
            + bloco_arte(p['arte']) + '\n      </div>')


def bloco_passos(passos):
    saida = []
    for i, (titulo, texto) in enumerate(passos, 1):
        saida.append(f'''        <article class="pd-passo" data-passo>
          <div class="pd-passo-copy">
            <span class="pd-passo-n" aria-hidden="true">{i:02d}</span>
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </div>
        </article>''')
    return '\n\n'.join(saida)


def bloco_recursos(recursos):
    return '\n'.join(
        f'''        <article class="pd-feat">
          <span class="pd-feat-ic" aria-hidden="true">{CHECK}</span>
          <b>{t}</b>
          <p>{p}</p>
        </article>''' for t, p in recursos)


def bloco_cartoes(motivos):
    return '\n'.join(
        f"""        <article class="pd-cartao">
          <span class="pd-cartao-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{ic}</svg></span>
          <b>{t}</b>
          <p>{p}</p>
        </article>""" for ic, t, p in motivos)


def secao_recursos(p):
    """Duas formas para o mesmo lugar da página.

    A padrão é a grade de recursos com selo de check. Quem declarar 'motivos'
    troca por cartões claros sobre fundo escuro.

    E quem não declarar 'recursos' não recebe seção nenhuma: é o caso de uma
    página em que a lista de soluções já faz esse trabalho, e duas seções
    seguidas dizendo a mesma coisa de dois jeitos é ruído.
    """
    if not p.get('recursos') and not p.get('motivos'):
        return ''
    if not p.get('motivos'):
        return f"""  <section class="pd-section is-alt" id="recursos">
    <div class="section-frame">
      <header class="pd-flow-head reveal">
        <div class="section-label">Recursos</div>
        <h2 data-editorial>{p['recursos_titulo']}</h2>
      </header>

      <div class="pd-feats reveal">
{bloco_recursos(p['recursos'])}
      </div>
    </div>
  </section>"""
    return f"""  <section class="pd-section is-escuro" id="recursos">
    <div class="section-frame">
      <header class="pd-flow-head reveal">
        <div class="section-label">Por que a BREVES</div>
        <h2 data-editorial>{p['motivos_titulo']}</h2>
        <p class="pd-flow-head-apoio">{p['motivos_apoio']}</p>
      </header>

      <div class="pd-cartoes reveal">
{bloco_cartoes(p['motivos'])}
      </div>
    </div>
  </section>"""


def secao_solucoes(p):
    """Opcional: a lista do que fica mais facil com o produto no ar.

    So sai para quem declarar 'solucoes'. Entra depois da linha do tempo e
    antes da grade de motivos — e leve de proposito, para nao virar mais uma
    grade de cartao entre duas que ja existem.
    """
    if not p.get('solucoes'):
        return ''
    itens = '\n'.join(
        f"""        <article class="pd-soluc">
          <span class="pd-soluc-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{ic}</svg></span>
          <p>{t}</p>
        </article>""" for ic, t in p['solucoes'])
    return f"""
  <section class="pd-section is-escuro" id="solucoes">
    <div class="section-frame">
      <header class="pd-flow-head reveal">
        <div class="section-label">Soluções</div>
        <h2 data-editorial>{p['solucoes_titulo']}</h2>
      </header>

      <div class="pd-solucoes reveal">
{itens}
      </div>

      <div class="pd-solucoes-fim reveal">
        <a class="button button-primary" href="#fale" data-magnetic>{p['cta_hero']} <span aria-hidden="true">&rarr;</span></a>
      </div>
    </div>
  </section>
"""


def links_secao(p, indent, prefixo=''):
    """Os atalhos do menu e do rodape seguem as secoes que a pagina tem."""
    itens = [('Como funciona', 'como-funciona')]
    if p.get('solucoes'):
        itens.append(('Soluções', 'solucoes'))
    if p.get('recursos') or p.get('motivos'):
        itens.append(('Recursos', 'recursos'))
    itens.append(('Dúvidas', 'duvidas'))
    return '\n'.join(f'{indent}<a href="#{a}" data-nav="{a}">{t}</a>' for t, a in itens)


def bloco_faq(faq):
    return '\n'.join(
        f'''        <details>
          <summary><span>{i:02d}</span>{q}<i></i></summary>
          <p>{r}</p>
        </details>''' for i, (q, r) in enumerate(faq, 1))


def schema(p):
    url = f'{SITE}/{p["slug"]}/'
    g = [
      {"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": p['titulo'],
       "description": p['schema_desc'],
       "isPartOf": {"@id": SITE + "/#website"}, "publisher": {"@id": SITE + "/#organization"},
       "breadcrumb": {"@id": url + "#breadcrumb"}},
      {"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Início", "item": SITE + "/"},
        {"@type": "ListItem", "position": 2, "name": "Produtos", "item": SITE + "/#produtos"},
        {"@type": "ListItem", "position": 3, "name": p['nome']}]},
      {"@type": "Service", "@id": url + "#servico", "name": p['schema_nome'],
       "serviceType": p['schema_tipo'], "description": p['schema_desc'],
       "provider": {"@id": SITE + "/#organization"}, "areaServed": "BR"},
      {"@type": "FAQPage", "@id": url + "#faq", "mainEntity": [
        {"@type": "Question", "name": q,
         "acceptedAnswer": {"@type": "Answer", "text": re.sub(r'<[^>]+>', '', r)}}
        for q, r in p['faq']]},
    ]
    return json.dumps({"@context": "https://schema.org", "@graph": g},
                      ensure_ascii=False, indent=2)



# ── relacionados ────────────────────────────────────────────────────────────
# Escrito como lista de PARES, e nao como lista por pagina: assim a
# reciprocidade e garantida por construcao em vez de conferida depois. Cada par
# carrega os dois motivos, um por sentido, porque o texto muda conforme de onde
# a pessoa esta lendo.
#
# A primeira versao era por pagina e a conferencia achou quatro links de mao
# unica e a gestao de marketplace orfa — que e exatamente o problema que este
# bloco existe para resolver.

RELAC_ROTULO = {
  'automacao-de-processos':  ('Rotinas',                 'Automação de processos'),
  'integracao-de-sistemas':  ('APIs',                    'Integração entre sistemas'),
  'agentes-de-ia':           ('Inteligência artificial', 'Agentes de IA'),
  'chatbot':                 ('Atendimento',             'Chatbot com IA'),
  'gestao-de-marketplace':   ('Vendas',                  'Gestão de marketplace'),
  'dashboards-power-bi':     ('Dados',                   'Painéis em Power BI'),
}

RELAC_PARES = [
 ('automacao-de-processos', 'integracao-de-sistemas',
  'Automatizar uma rotina que atravessa dois sistemas começa por fazer os dois conversarem — sem isso, a automação vira alguém copiando dado mais rápido.',
  'Com os sistemas conversando, a rotina que dependia da redigitação passa a rodar sem ninguém no meio.'),
 ('automacao-de-processos', 'agentes-de-ia',
  'Quando a regra é fixa, a automação resolve. Quando a tarefa exige ler um texto livre e decidir, é caso de agente.',
  'Nem toda tarefa repetitiva pede IA. Quando a regra é sempre a mesma, a automação sai mais barata e mais previsível.'),
 ('automacao-de-processos', 'dashboards-power-bi',
  'Depois que a rotina roda sozinha, o passo seguinte costuma ser enxergar o que ela produziu.',
  'Se o número certo já aparece, o passo seguinte costuma ser automatizar a rotina que ele revelou como gargalo.'),
 ('integracao-de-sistemas', 'dashboards-power-bi',
  'Integrar é o que faz o painel se atualizar sozinho. Sem a fonte conectada, o relatório volta a depender de alguém alimentando planilha.',
  'O painel começa nas fontes. Conectar os sistemas é o que tira a planilha alimentada à mão do meio do caminho.'),
 ('integracao-de-sistemas', 'chatbot',
  'Um atendimento que consulta pedido, prazo e cadastro na hora depende da integração — é ela que separa isso de um robô de respostas prontas.',
  'É a integração que separa um robô de respostas prontas de um atendimento que consulta pedido, prazo e cadastro na hora.'),
 ('integracao-de-sistemas', 'gestao-de-marketplace',
  'Loja em marketplace com estoque e preço errados quase sempre é um problema de integração com o ERP, e não de anúncio.',
  'Estoque e preço errados no anúncio quase sempre são um problema de integração entre a loja e o ERP, não de anúncio.'),
 ('agentes-de-ia', 'chatbot',
  'O agente executa tarefa; o chatbot conversa com quem chega. Muita operação precisa dos dois, em pontos diferentes do fluxo.',
  'O chatbot responde a quem escreveu. O agente age sozinho — por horário, por e-mail recebido ou por registro que mudou.'),
 ('gestao-de-marketplace', 'dashboards-power-bi',
  'Anúncio, publicidade e preço só se ajustam com número na frente. O painel é onde o resultado da operação aparece.',
  'Quem vende em marketplace decide preço e anúncio pelo número — e é o painel que mostra qual deles está pagando.'),
]

RELAC = {s: [] for s in RELAC_ROTULO}
for _a, _b, _ma, _mb in RELAC_PARES:
    RELAC[_a].append((_b, _ma))
    RELAC[_b].append((_a, _mb))


def bloco_relacionados(slug):
    itens = []
    for alvo, motivo in RELAC[slug]:
        eyebrow, nome = RELAC_ROTULO[alvo]
        # O link e so o nome do produto, e nao o cartao inteiro. Envolvendo tudo,
        # a ancora virava "APIs Integração entre sistemas Automatizar uma rotina
        # que atravessa..." — justamente o sinal que o link contextual existe
        # para dar, diluido em quarenta palavras. O cartao continua clicavel
        # inteiro pelo ::after esticado (produto.css).
        itens.append(
            '        <li>\n'
            '          <small>%s</small>\n'
            '          <b><a href="../%s/">%s</a></b>\n'
            '          <p>%s</p>\n'
            '          <i aria-hidden="true">Ver a página &rarr;</i>\n'
            '        </li>' % (eyebrow, alvo, nome, motivo))
    return ('  <section class="pd-relac" aria-labelledby="pd-relac-titulo">\n'
            '    <div class="section-frame">\n'
            '      <div class="pd-relac-head reveal">\n'
            '        <div class="section-label">Costuma vir junto</div>\n'
            '        <h2 id="pd-relac-titulo">O que quase sempre aparece na mesma conversa</h2>\n'
            '      </div>\n'
            '      <ul class="pd-relac-lista reveal">\n'
            + '\n'.join(itens) + '\n'
            '      </ul>\n'
            '    </div>\n'
            '  </section>\n')


TEMPLATE = '''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-BKBH3N8BSZ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());

  gtag('config', 'G-BKBH3N8BSZ');
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#ffffff">

<title>{titulo}</title>

<meta name="description" content="{meta}">

<link rel="canonical" href="{site}/{slug}/">

<!-- Identidade da página -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="BREVES">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{og}">
<meta property="og:url" content="{site}/{slug}/">
<meta property="og:image" content="{site}/assets/media/og-breves.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="BREVES">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{site}/assets/media/og-breves.png">

<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="48x48" href="/assets/media/favicon-48.png">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/media/favicon-96.png">
<link rel="icon" type="image/png" sizes="192x192" href="/assets/media/favicon-192.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/media/apple-touch-icon.png">

<!-- Dados estruturados da página -->
<script type="application/ld+json">
{schema}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link rel="stylesheet" href="../assets/css/shared.css?v=shared-1">
<link rel="stylesheet" href="../assets/css/nucleo.css?v=nucleo-1">
<link rel="stylesheet" href="../assets/css/base.css?v=base-1">
<link rel="stylesheet" href="../assets/css/chat.css?v=chat-9">
<link rel="stylesheet" href="../assets/css/identidade.css?v=identidade-27">
<link rel="stylesheet" href="../assets/css/produto.css?v=produto-33">
<link rel="stylesheet" href="../assets/css/paleta.css?v=paleta-7">
<script>
  /* ?paleta=<nome> liga uma paleta de teste em qualquer página. Inline e no
     head de propósito: em <script defer> a página pisca na paleta antiga
     antes de trocar. A checagem do formato evita que alguém injete um valor
     qualquer no atributo. */
  (function () {{
    var p = new URLSearchParams(location.search).get('paleta');
    if (p && /^[a-z]{{1,16}}$/.test(p)) document.documentElement.setAttribute('data-paleta', p);
  }})();
</script>
</head>
<body>

<a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
<div class="page-progress" aria-hidden="true"><i data-page-progress></i></div>

<header class="site-header" data-header>
  <div class="nav-shell">
    <a class="brand" href="../" aria-label="BREVES — início">
      <img src="../assets/media/newlogo-mark.png" alt="">
      <span><b>BREVES</b><small>TECNOLOGIA</small></span>
    </a>

    <nav id="main-nav" aria-label="Navegação principal">
      <div class="nav-drop">
        <a class="nav-drop-trigger" href="../#produtos">Produtos <i aria-hidden="true"></i></a>
        <div class="nav-drop-menu">
{menu}
        </div>
      </div>
{nav_secoes}
      <a href="../juridico/" class="nav-external">Jurídico <span aria-hidden="true">↗︎</span></a>
    </nav>

    <a class="nav-cta" href="#fale" data-magnetic>Iniciar conversa <span aria-hidden="true">↗︎</span></a>
    <button class="nav-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="main-nav">
      <span></span><span></span>
    </button>
  </div>
</header>

<main id="conteudo">
  <section class="mz-hero pd-hero{hero_mod}" id="inicio" data-hero>

    <div class="mz-hero-inner">
      <div class="mz-hero-copy">
        <nav class="pd-crumbs reveal in" aria-label="Trilha de navegação">
          <a href="../">Início</a><span aria-hidden="true">/</span><a href="../#produtos">Produtos</a><span aria-hidden="true">/</span><b>{nome}</b>
        </nav>
        <div class="pd-hero-badge reveal in">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{icone}</svg>
          {badge}
        </div>
        <h1 class="reveal in">{h1}</h1>
        <p class="pd-hero-text reveal in">{lead}</p>
        <div class="mz-hero-actions reveal in">
          <a class="button button-primary" href="#fale" data-magnetic>{cta_hero} <span aria-hidden="true">→</span></a>
          <a class="mz-btn-ghost" href="#como-funciona">Ver como funciona</a>
        </div>
      </div>

{hero_arte}
    </div>
  </section>


  <section class="pd-flow" id="como-funciona">
    <div class="section-frame">
      <header class="pd-flow-head reveal">
        <div class="section-label">Como funciona</div>
        <h2 data-editorial>{flow_titulo}</h2>
      </header>

      <div class="pd-linha is-texto" data-linha>
        <div class="pd-linha-trilho" aria-hidden="true"><i data-linha-preenche></i></div>

{passos}

        <div class="pd-linha-fim" data-passo data-linha-fim>
          <a class="button button-primary" href="#fale" data-magnetic>Começar agora <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </div>
  </section>

{secao_solucoes}
{secao_recursos}

  <section class="faq" id="duvidas">
    <div class="section-frame faq-grid">
      <div class="faq-intro reveal">
        <div class="section-label">Dúvidas frequentes</div>
        <h2 data-editorial>{faq_titulo}</h2>
        <p>Se a sua dúvida não estiver aqui, use o formulário e conte brevemente sobre o cenário.</p>
      </div>
      <div class="faq-list reveal">
{faq}
      </div>
    </div>
  </section>

{relacionados}
  <section class="pd-final" id="fale">
    <div class="section-frame">
      <div class="pd-final-card is-form reveal">
        <div class="pd-final-copy">
          <h2>{final_titulo}</h2>
          <p>{final_texto}</p>
          <a class="mz-btn-ghost" href="../#produtos">Ver todos os produtos</a>
        </div>

        <form class="mz-fale-campos pd-fale-form" data-contact-form novalidate
              aria-label="Formulário de contato sobre {nome}">
          <div class="field">
            <label for="f-nome">Seu nome</label>
            <input required minlength="2" maxlength="120" id="f-nome" type="text" name="nome" placeholder="Como podemos chamar você?" autocomplete="name">
          </div>
          <div class="field">
            <label for="f-empresa">Empresa</label>
            <input maxlength="160" id="f-empresa" type="text" name="escritorio" placeholder="Nome da empresa" autocomplete="organization">
          </div>
          <div class="field">
            <label for="f-contato">WhatsApp</label>
            <input required maxlength="30" id="f-contato" type="tel" name="contato" placeholder="(00) 90000-0000" autocomplete="tel">
            <input type="hidden" name="canal" value="whatsapp">
          </div>
          <div class="field">
            <label for="f-msg">Sobre a sua operação</label>
            <textarea maxlength="3000" id="f-msg" name="mensagem" placeholder="Onde isso trava hoje?"></textarea>
          </div>
          <input type="hidden" name="origem" value="site-produto-{slug}">
          <button class="button button-primary mz-fale-enviar" type="submit">{cta_final} <span aria-hidden="true">→</span></button>
          <span class="form-ok" data-form-feedback role="status" aria-live="polite"></span>
          <p class="pd-fale-nota">Seus dados são usados só para responder este contato, em até 1 dia útil. <a href="../privacidade/" target="_blank" rel="noopener">Como tratamos seus dados</a>.</p>
        </form>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer footer-rich">
  <div class="section-frame">
    <div class="footer-top">
      <div class="footer-brand-block">
        <a class="brand footer-brand" href="../" aria-label="BREVES Tecnologia — voltar ao início">
          <img src="../assets/media/newlogo-mark.png" alt="BREVES"><span>BREVES</span>
        </a>
        <p>Tecnologia, dados e automação sob medida — a base que conecta toda a operação do seu negócio.</p>
        <div class="footer-social" aria-label="Redes sociais">
          <a class="fs-linkedin" href="https://www.linkedin.com/company/breves-corp/" target="_blank" rel="noopener noreferrer" aria-label="BREVES no LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.47-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.1 20.45H3.54V8.98H7.1v11.47Z"/></svg></a>
          <a class="fs-instagram" href="https://www.instagram.com/brevescorp" target="_blank" rel="noopener noreferrer" aria-label="BREVES no Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg></a>
          <a class="fs-whatsapp" href="https://wa.me/5521984371741?text={wa}" target="_blank" rel="noopener noreferrer" aria-label="Falar com a BREVES no WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.87 9.87 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2Zm0 1.83c2.16 0 4.19.84 5.72 2.37a8.03 8.03 0 0 1 2.37 5.72c0 4.46-3.63 8.08-8.09 8.08a8.2 8.2 0 0 1-4.13-1.13l-.3-.18-3.13.82.84-3.05-.2-.31a8.02 8.02 0 0 1-1.24-4.3c0-4.45 3.63-8.08 8.09-8.08Zm-3.2 4.3c-.15 0-.4.06-.61.28-.21.22-.8.79-.8 1.92s.82 2.23.94 2.38c.11.15 1.6 2.44 3.88 3.42.54.23.96.37 1.29.48.54.17 1.04.15 1.43.09.44-.06 1.34-.55 1.53-1.08.19-.53.19-.98.13-1.08-.06-.09-.21-.15-.44-.26-.23-.12-1.34-.66-1.55-.74-.21-.08-.36-.11-.51.11-.15.23-.58.74-.71.89-.13.15-.26.17-.49.06-.23-.12-.96-.36-1.83-1.13-.68-.6-1.13-1.35-1.27-1.57-.13-.23-.01-.35.1-.46.1-.1.23-.27.34-.4.11-.14.15-.23.23-.38.08-.15.04-.29-.02-.4-.06-.12-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.39h-.43Z"/></svg></a>
        </div>
      </div>

      <nav class="footer-col" aria-label="Produtos">
        <h3>Produtos</h3>
{menu_rodape}
      </nav>

      <nav class="footer-col" aria-label="Links">
        <h3>Links</h3>
        <a href="../juridico/">BREVES Jurídico <span aria-hidden="true">↗︎</span></a>
        <a href="../">Início</a>
{rodape_secoes}
        <a href="#fale">Contato</a>
      </nav>

      <div class="footer-col footer-contact" aria-label="Contato">
        <h3>Contato</h3>
        <ul>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg> <a href="mailto:contato@brevestech.com">contato@brevestech.com</a></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2z"/></svg> <a href="tel:+5521984371741">+55 21 98437-1741</a></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg> <a href="https://www.linkedin.com/company/breves-corp/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg> <span>Rio de Janeiro &middot; RJ</span></li>
        </ul>
        <a class="footer-cta" href="#fale">Iniciar conversa <span aria-hidden="true">→</span></a>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© 2026 BREVES</span>
      <span class="footer-registro">68.054.344 LUANA COSTA DE PAIVA DE MEDEIROS · CNPJ 68.054.344/0001-17</span>
      <span>Tecnologia · Dados · Automação</span>
      <a class="footer-legal" href="../privacidade/">Privacidade</a>
    </div>
  </div>
</footer>


<script type="module" src="../assets/js/contact-form.js?v=ga4-1"></script>
<script defer src="../assets/js/site.js?v=ga4-1"></script>
<script defer data-breves-chat="{chave}" src="../assets/js/chat.js?v=chat-12"></script>
</body>
</html>
'''

FLOW_TITULO = {
  'automacao-de-processos':  'Do gatilho ao resultado entregue,<br><em>sem ninguém no meio.</em>',
  'integracao-de-sistemas':  'De um sistema ao outro,<br><em>sem ninguém redigitar.</em>',
  'gestao-de-marketplace':   'Da busca do comprador à venda,<br><em>sem etapa pulada.</em>',
  'dashboards-power-bi':     'Da fonte ao painel publicado,<br><em>e não o contrário.</em>',
}

from urllib.parse import quote

for p in PRODUTOS:
    html = TEMPLATE.format(
        site=SITE, slug=p['slug'], nome=p['nome'], chave=p['chave_form'],
        titulo=p['titulo'], meta=p['meta'], og=p['og'],
        schema=schema(p), icone=p['icone'], badge=p['badge'],
        h1=p['h1'], lead=p['lead'], cta_hero=p['cta_hero'],
        hero_arte=hero_arte(p),
        hero_mod=' is-vitrine' if p.get('painel') else '',
        flow_titulo=FLOW_TITULO[p['slug']], passos=bloco_passos(p['passos']),
        secao_recursos=secao_recursos(p),
        secao_solucoes=secao_solucoes(p),
        nav_secoes=links_secao(p, ' ' * 6),
        rodape_secoes=links_secao(p, ' ' * 8),
        faq_titulo=p['faq_titulo'], faq=bloco_faq(p['faq']),
        relacionados=bloco_relacionados(p['slug']),
        final_titulo=p['final_titulo'], final_texto=p['final_texto'], cta_final=p['cta_final'],
        wa=quote(p['wa'], safe=''),
        menu=menu_produtos(p['slug'], ' ' * 10),
        menu_rodape=menu_produtos(p['slug'], ' ' * 8),
    )
    destino = os.path.join(RAIZ, p['slug'])
    os.makedirs(destino, exist_ok=True)
    with open(os.path.join(destino, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)
    print('escrito:', p['slug'] + '/index.html', len(html), 'bytes')
