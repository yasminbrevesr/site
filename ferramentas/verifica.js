#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   VERIFICAÇÃO DO SITE

   Rode antes de publicar qualquer mudança:

       node ferramentas/verifica.js

   Sobe um servidor estático próprio na pasta do site, abre as páginas num
   navegador de verdade e confere o que dá para conferir sozinho. Sai com
   código 1 se algo falhar, então serve em CI sem adaptação.

   Cada checagem aqui nasceu de um defeito real que passou por revisão visual
   — o comentário de cada uma diz qual. É por isso que ela existe: o que
   quebra num site assim quase nunca aparece na tela.

   NUNCA escreve no Supabase do cliente: toda chamada é interceptada e
   respondida localmente. Nenhum contato de teste chega à base.

   Requisitos: Node 18+ e Playwright com Chromium.
   ══════════════════════════════════════════════════════════════════════════ */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RAIZ = path.resolve(__dirname, '..');

/* A porta é escolhida pelo sistema (listen 0) e lida depois. Com número fixo,
   um processo órfão de uma execução anterior derrubava a verificação inteira
   com EADDRINUSE e um stack trace — que é o oposto do que uma ferramenta de
   conferência deve produzir quando o problema é dela. */
let BASE = '';

/* O Playwright pode estar instalado no projeto ou global. Resolver nos dois
   lugares evita exigir uma instalação específica de quem for rodar. */
function carregaPlaywright() {
  const tentativas = ['playwright', 'playwright-core',
    '/opt/node22/lib/node_modules/playwright'];
  for (const t of tentativas) {
    try { return require(t); } catch (e) { /* tenta o próximo */ }
  }
  console.error('Playwright não encontrado. Instale com:  npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}
const { chromium, devices } = carregaPlaywright();

/* ─────────────────────────────────────────────────────────── as páginas */

const PAGINAS = ['/', '/privacidade/', '/juridico/', '/automacao-de-processos/',
  '/integracao-de-sistemas/', '/agentes-de-ia/', '/chatbot/',
  '/gestao-de-marketplace/', '/dashboards-power-bi/'];

const PRODUTOS = {
  'automacao-de-processos': 'site-produto-automacao-de-processos',
  'integracao-de-sistemas': 'site-produto-integracao-de-sistemas',
  'agentes-de-ia': 'site-produto-agentes-de-ia',
  'chatbot': 'site-produto-chatbot',
  'gestao-de-marketplace': 'site-produto-gestao-de-marketplace',
  'dashboards-power-bi': 'site-produto-dashboards-power-bi',
};

/* A página legal não tem chat nem formulário de propósito: é documento. */
const SEM_CHAT = new Set(['/privacidade/']);

/* ──────────────────────────────────────────────── servidor estático local */

const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };

function servidor() {
  return http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const arquivo = path.join(RAIZ, p);
    /* Não deixa sair da pasta do site nem por caminho relativo. */
    if (!arquivo.startsWith(RAIZ)) { res.writeHead(403).end(); return; }
    fs.readFile(arquivo, (err, dados) => {
      if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('404'); return; }
      res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' });
      res.end(dados);
    });
  });
}

/* ──────────────────────────────────────────────────────── infraestrutura */

const falhas = [];
const avisos = [];
let atual = '';
const erro = m => falhas.push(`[${atual}] ${m}`);
const aviso = m => avisos.push(`[${atual}] ${m}`);


/* Toda página nasce com o Supabase bloqueado e os erros de JS capturados. */
async function abre(ctx, rota, { supabase = 'aborta' } = {}) {
  const page = await ctx.newPage();
  page._erros = [];
  page._enviado = null;
  await page.route('**supabase.co/**', r => {
    if (supabase === 'aborta') return r.abort();
    try { page._enviado = JSON.parse(r.request().postData() || '{}'); } catch (e) { }
    return r.fulfill({ status: supabase === 'falha' ? 500 : 201, body: '' });
  });
  page.on('pageerror', e => page._erros.push(e.message));
  const resp = await page.goto(BASE + rota, { waitUntil: 'networkidle' });
  if (resp.status() !== 200) erro(`${rota}: HTTP ${resp.status()}`);
  return page;
}

const EVENTOS = `() => (window.dataLayer || []).map(a => Array.from(a))
  .filter(a => a[0] === 'event').map(a => [a[1], a[2] || {}])`;

/* ═══════════════════════════════════════════════════════════ checagens ═══ */

/* 1. Estrutura de cada página. */
async function estrutura(ctx) {
  atual = 'estrutura';
  for (const rota of PAGINAS) {
    const page = await abre(ctx, rota);
    const d = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      canonical: [...document.querySelectorAll('link[rel=canonical]')].map(l => l.href),
      titulo: document.title,
      desc: (document.querySelector('meta[name=description]') || {}).content || '',
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      lang: document.documentElement.lang,
    }));
    if (d.h1 !== 1) erro(`${rota}: ${d.h1} h1 (deve ser 1)`);
    if (d.canonical.length !== 1) erro(`${rota}: ${d.canonical.length} canonical`);
    else if (!d.canonical[0].includes(rota)) erro(`${rota}: canonical aponta para ${d.canonical[0]}`);
    if (!d.titulo) erro(`${rota}: sem title`);
    else if (d.titulo.length > 65) aviso(`${rota}: title com ${d.titulo.length} caracteres`);
    if (!d.desc) erro(`${rota}: sem meta description`);
    else if (d.desc.length > 160) aviso(`${rota}: description com ${d.desc.length} caracteres`);
    if (d.lang !== 'pt-BR') erro(`${rota}: lang="${d.lang}"`);
    if (d.overflow) erro(`${rota}: rolagem horizontal`);
    d.ld.forEach((t, i) => { try { JSON.parse(t); } catch (e) { erro(`${rota}: JSON-LD #${i} inválido`); } });
    page._erros.forEach(e => erro(`${rota}: erro de JS — ${e}`));
    await page.close();
  }
}

/* 2. O h1 precisa compartilhar termo com o próprio título.
   Nasceu de um h1 que era pergunta retórica e não dizia o assunto da página. */
async function h1Coerente(ctx) {
  atual = 'h1';
  const VAZIAS = new Set(['a','o','as','os','de','da','do','das','dos','e','em','no','na','nos','nas',
    'para','por','com','sem','que','se','um','uma','ao','aos','breves','sua','seu','sob','mais','como']);
  const tokens = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/).filter(w => w.length > 2 && !VAZIAS.has(w));

  for (const rota of PAGINAS) {
    const page = await abre(ctx, rota);
    const d = await page.evaluate(() => ({
      h1: (document.querySelector('h1') || {}).textContent || '',
      titulo: document.title,
    }));
    /* textContent, e não innerText: um <br> sem espaço em volta cola duas
       palavras e some com a palavra-chave. Já aconteceu. */
    const th = new Set(tokens(d.h1));
    const comuns = [...new Set(tokens(d.titulo))].filter(w => th.has(w));
    if (!comuns.length) erro(`${rota}: h1 não tem nenhum termo do title — "${d.h1.trim()}"`);
    await page.close();
  }
}

/* 2b. Palavra colada por quebra de linha.

   <br> não produz espaço no textContent: escrito "automação<br>para", o título
   dizia "automaçãopara" para tudo que lê o documento sem renderizar — e a
   palavra-chave que estava ali por decisão de SEO ficava partida. Na tela nada
   aparece, então só o código-fonte denuncia.

   Procura no HTML, e não no texto renderizado: adivinhar pelo resultado
   acusava CamelCase legítimo de marca, como WhatsApp. */
function colagem() {
  atual = 'colagem';
  const arquivos = PAGINAS.map(r => path.join(RAIZ, r, 'index.html'));
  const padrao = /[A-Za-zÀ-ÿ]<br\s*\/?>[A-Za-zÀ-ÿ]/g;
  for (const f of arquivos) {
    const html = fs.readFileSync(f, 'utf8');
    for (const m of html.matchAll(padrao)) {
      const volta = html.lastIndexOf('\n', m.index) + 1;
      const linha = html.slice(volta, html.indexOf('\n', m.index)).trim();
      erro(`${path.relative(RAIZ, f)}: <br> cola duas palavras — ${linha.slice(0, 90)}`);
    }
  }
}

/* 3. Links internos e âncoras. */
async function links(ctx) {
  atual = 'links';
  const externos = new Set();
  for (const rota of PAGINAS) {
    const page = await abre(ctx, rota);
    const hrefs = await page.$$eval('a[href]', as => as.map(a => ({
      bruto: a.getAttribute('href'), abs: a.href, txt: a.textContent.trim().slice(0, 40),
    })));
    for (const l of hrefs) {
      if (/^(mailto:|tel:|javascript:)/.test(l.bruto)) continue;
      if (l.bruto.startsWith('#')) {
        if (l.bruto.length > 1) {
          const existe = await page.$(l.bruto).catch(() => null);
          if (!existe) erro(`${rota}: âncora ${l.bruto} não existe ("${l.txt}")`);
        }
        continue;
      }
      if (!l.abs.startsWith(BASE)) { externos.add(new URL(l.abs).host); continue; }
      const r = await page.request.get(l.abs).catch(() => null);
      if (!r || r.status() >= 400) erro(`${rota}: link quebrado ${l.bruto} (${r ? r.status() : 'erro'})`);
    }
    await page.close();
  }
  return [...externos];
}

/* 4. As seis páginas de produto formam um cluster recíproco, e a âncora é o
   nome do produto — não o cartão inteiro, que diluía o sinal em 40 palavras. */
async function cluster(ctx) {
  atual = 'cluster';
  const g = {};
  for (const slug of Object.keys(PRODUTOS)) {
    const page = await abre(ctx, `/${slug}/`);
    const alvos = await page.$$eval('.pd-relac-lista b a', as => as.map(a => ({
      p: new URL(a.href).pathname.replace(/\//g, ''),
      txt: a.textContent.trim(),
    })));
    if (!alvos.length) erro(`/${slug}/: sem bloco de relacionados`);
    g[slug] = alvos.map(x => x.p);
    for (const a of alvos) {
      if (a.txt.length > 40) erro(`/${slug}/: âncora longa demais — "${a.txt.slice(0, 50)}..."`);
    }
    await page.close();
  }
  for (const a of Object.keys(g)) {
    for (const b of new Set(g[a] || [])) {
      if (!PRODUTOS[b]) { erro(`${a} aponta para ${b}, que não é produto`); continue; }
      if (!(g[b] || []).includes(a)) erro(`${a} → ${b} sem volta`);
    }
  }
  const orfas = Object.keys(PRODUTOS).filter(s => !Object.keys(g).some(o => o !== s && (g[o] || []).includes(s)));
  if (orfas.length) erro(`páginas que ninguém referencia: ${orfas.join(', ')}`);
}

/* 5. Dados estruturados, e — o que já divergiu em silêncio — o schema tem de
   corresponder ao texto que está na tela. */
async function schema(ctx) {
  atual = 'schema';
  for (const rota of PAGINAS) {
    const page = await abre(ctx, rota);
    const d = await page.evaluate(() => {
      const g = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .flatMap(s => { try { const j = JSON.parse(s.textContent); return j['@graph'] || [j]; } catch (e) { return []; } });
      /* textContent, e não innerText: a resposta do FAQ mora dentro de
         <details> fechado, e innerText ignora conteúdo colapsado. */
      return { g, texto: document.body.textContent.replace(/\s+/g, ' ') };
    });
    const tipos = d.g.map(x => x['@type']);
    if (!tipos.includes('WebPage') && rota !== '/') erro(`${rota}: sem WebPage no schema`);
    if (rota === '/' && !tipos.includes('Organization')) erro('home: sem Organization');

    for (const f of d.g.filter(x => x['@type'] === 'FAQPage')) {
      for (const q of f.mainEntity || []) {
        if (!d.texto.includes(q.name)) erro(`${rota}: pergunta do schema ausente da tela — "${q.name}"`);
        const r = (q.acceptedAnswer || {}).text || '';
        /* Comparação do texto inteiro: por prefixo, uma resposta editada só no
           final passa despercebida. Já passou. */
        if (r && !d.texto.includes(r)) erro(`${rota}: resposta do schema difere da tela — "${r.slice(0, 55)}..."`);
      }
    }
    for (const s of d.g.filter(x => x['@type'] === 'Service')) {
      for (const o of (s.hasOfferCatalog || {}).itemListElement || []) {
        const n = ((o.itemOffered || {}).name) || '';
        if (n && !d.texto.includes(n)) erro(`${rota}: serviço do schema ausente da tela — "${n}"`);
      }
    }
    /* Referência @id que aponta para nada dentro da própria página. */
    const ids = new Set(d.g.map(x => x['@id']).filter(Boolean));
    for (const x of d.g) {
      for (const campo of ['breadcrumb', 'provider', 'publisher', 'isPartOf']) {
        const ref = x[campo] && x[campo]['@id'];
        if (ref && ref.includes(rota) && !ids.has(ref)) erro(`${rota}: ${campo} aponta para ${ref}, que não existe`);
      }
    }
    await page.close();
  }
}

/* 6. Formulários: existem, os CTAs ancoram na própria página, a origem certa
   chega ao banco e o evento de conversão dispara. */
async function formularios(ctx) {
  atual = 'formulários';
  for (const [slug, origem] of Object.entries(PRODUTOS)) {
    const rota = `/${slug}/`;
    const page = await abre(ctx, rota, { supabase: 'ok' });

    if (!await page.$('[data-contact-form]')) { erro(`${rota}: sem formulário`); await page.close(); continue; }
    if (!await page.$('#fale')) erro(`${rota}: sem âncora #fale`);

    /* Todo CTA que fala em "fale" tem de ficar na página. O do cabeçalho e os
       do rodapé já apontaram para a home depois de a correção ter sido dada
       como pronta. */
    const fora = await page.$$eval('a[href*="fale"]',
      as => as.map(a => a.getAttribute('href')).filter(h => h !== '#fale'));
    fora.forEach(h => erro(`${rota}: CTA sai da página — ${h}`));

    const semNome = await page.$eval('[data-contact-form]',
      f => !f.getAttribute('aria-label') && !f.getAttribute('aria-labelledby') && !f.closest('[aria-labelledby]'));
    if (semNome) erro(`${rota}: formulário sem nome acessível`);

    await page.fill('[data-contact-form] [name="nome"]', 'Verificação Local');
    await page.fill('[data-contact-form] [name="contato"]', '(11) 99999-0000');
    await page.click('[data-contact-form] button[type="submit"]');
    await page.waitForTimeout(700);

    if (!page._enviado) erro(`${rota}: nada enviado`);
    else if (page._enviado.origem !== origem) erro(`${rota}: origem "${page._enviado.origem}" ≠ "${origem}"`);

    const ev = await page.evaluate(eval(EVENTOS));
    const lead = ev.find(e => e[0] === 'generate_lead');
    if (!lead) erro(`${rota}: generate_lead não disparou`);
    else if (lead[1].origem !== origem) erro(`${rota}: evento com origem "${lead[1].origem}"`);

    const txt = await page.textContent('[data-form-feedback]').catch(() => '');
    if (!/Recebido/.test(txt || '')) erro(`${rota}: sem confirmação na tela`);
    page._erros.forEach(e => erro(`${rota}: erro de JS — ${e}`));
    await page.close();
  }
}

/* 7. Medição no GA4: o envio que falha não pode contar como lead, e a ausência
   do gtag não pode derrubar o formulário. */
async function analytics(ctx) {
  atual = 'analytics';

  const falha = await abre(ctx, '/', { supabase: 'falha' });
  await falha.fill('#fale [name="nome"]', 'Verificação Local');
  await falha.fill('#fale [name="contato"]', '(11) 99999-0000');
  await falha.click('#fale button[type="submit"]');
  await falha.waitForTimeout(700);
  const ev = await falha.evaluate(eval(EVENTOS));
  if (ev.some(e => e[0] === 'generate_lead')) erro('envio com HTTP 500 contou como generate_lead');
  if (!ev.some(e => e[0] === 'lead_falhou')) erro('envio com HTTP 500 não disparou lead_falhou');
  await falha.close();

  const wa = await abre(ctx, '/dashboards-power-bi/');
  const alvo = await wa.$('a[href*="wa.me"]');
  if (!alvo) erro('nenhum link de WhatsApp na página de produto');
  else {
    await alvo.evaluate(a => {
      a.removeAttribute('target');
      document.addEventListener('click', e => e.preventDefault(), true);
      a.click();
    });
    await wa.waitForTimeout(300);
    const e2 = await wa.evaluate(eval(EVENTOS));
    if (!e2.some(x => x[0] === 'click_whatsapp')) erro('click_whatsapp não disparou');
  }
  await wa.close();

  const sem = await abre(ctx, '/', { supabase: 'ok' });
  await sem.evaluate(() => { window.gtag = undefined; });
  await sem.fill('#fale [name="nome"]', 'Verificação Local');
  await sem.fill('#fale [name="contato"]', '(11) 99999-0000');
  await sem.click('#fale button[type="submit"]');
  await sem.waitForTimeout(700);
  const conf = await sem.textContent('[data-form-feedback]').catch(() => '');
  if (!/Recebido/.test(conf || '')) erro('sem gtag, o formulário deixou de confirmar');
  sem._erros.forEach(e => erro(`sem gtag: erro de JS — ${e}`));
  await sem.close();
}

/* 8. Todo ponto que pede dado pessoal declara a finalidade e alcança a
   política. Exigência da LGPD, e o que remove a hesitação de quem digita. */
async function lgpd(ctx) {
  atual = 'lgpd';
  for (const rota of PAGINAS) {
    const page = await abre(ctx, rota);
    const temForm = await page.$('[data-contact-form]');
    if (temForm) {
      const d = await page.evaluate(() => {
        const f = document.querySelector('[data-contact-form]');
        const notas = [...(f.closest('aside, .pd-final-card') || f).querySelectorAll('p')];
        const nota = notas.find(p => /responder este contato/i.test(p.textContent));
        return nota ? { txt: nota.textContent, href: (nota.querySelector('a[href*="privacidade"]') || {}).href } : null;
      });
      if (!d) erro(`${rota}: formulário sem declaração de finalidade`);
      else if (!d.href) erro(`${rota}: declaração sem link para a política`);
      else {
        const r = await page.request.get(d.href);
        if (r.status() !== 200) erro(`${rota}: link da política responde ${r.status()}`);
      }
    }
    if (!SEM_CHAT.has(rota)) {
      await page.click('.bv-chat-launcher').catch(() => erro(`${rota}: chat não abriu`));
      await page.waitForSelector('.bv-lead', { timeout: 3000 }).catch(() => erro(`${rota}: chat sem cadastro`));
      const n = await page.$('.bv-lead-nota');
      if (!n) erro(`${rota}: chat sem declaração de finalidade`);
    }
    await page.close();
  }
  /* O rodapé leva à política de qualquer página. */
  for (const rota of PAGINAS) {
    const page = await abre(ctx, rota);
    if (!await page.$('.footer-legal')) erro(`${rota}: rodapé sem link da política`);
    await page.close();
  }
}

/* 9. Celular: piso de 11px na interface e alvo de toque de 24px.
   As maquetes (painel do Power BI, celular do chatbot) ficam de fora — ali o
   texto é proporção de ilustração, como numa captura de tela. */
async function mobile(browser) {
  atual = 'mobile';
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  for (const rota of PAGINAS) {
    const page = await abre(ctx, rota);
    const d = await page.evaluate(() => {
      const pequenas = [], alvos = [];
      document.querySelectorAll('*').forEach(e => {
        const dentroDeMaquete = e.closest('[aria-hidden="true"], .pd-painel, .pd-fone');
        const proprio = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        const px = parseFloat(getComputedStyle(e).fontSize);
        if (!dentroDeMaquete && proprio && px < 11)
          pequenas.push(`${px}px ${e.tagName.toLowerCase()} "${e.textContent.trim().slice(0, 24)}"`);
      });
      document.querySelectorAll('a,button').forEach(e => {
        let r = e.getBoundingClientRect();
        /* O alvo efetivo pode ser um ::after esticado sobre um cartão inteiro;
           getBoundingClientRect não enxerga pseudo-elemento. */
        const ap = getComputedStyle(e, '::after');
        if (ap.content !== 'none' && ap.position === 'absolute') {
          const w = parseFloat(ap.width), h = parseFloat(ap.height);
          if (w > r.width || h > r.height) r = { width: Math.max(w, r.width), height: Math.max(h, r.height) };
        }
        /* Exceção "inline" da WCAG 2.5.8: alvo dentro de uma frase, com o
           tamanho determinado pela entrelinha do texto em volta. */
        const bloco = e.parentElement;
        const inline = bloco && /^(P|LI|SPAN|SMALL|EM|STRONG|B|I|DD|TD)$/.test(bloco.tagName)
          && bloco.textContent.replace(e.textContent, '').trim().length > 0;
        if (!inline && r.width > 0 && r.height > 0 && (r.height < 24 || r.width < 24))
          alvos.push(`${Math.round(r.width)}x${Math.round(r.height)} ${e.tagName.toLowerCase()} "${e.textContent.trim().slice(0, 22)}"`);
      });
      return { pequenas: [...new Set(pequenas)], alvos: [...new Set(alvos)],
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1 };
    });
    d.pequenas.forEach(x => erro(`${rota}: texto abaixo de 11px — ${x}`));
    d.alvos.forEach(x => erro(`${rota}: alvo abaixo de 24px — ${x}`));
    if (d.overflow) erro(`${rota}: rolagem horizontal no celular`);
    await page.close();
  }
  await ctx.close();
}

/* 10. Identidade da empresa presente e consistente entre tela e schema. */
async function identidade(ctx) {
  atual = 'identidade';
  const RAZAO = '68.054.344 LUANA COSTA DE PAIVA DE MEDEIROS';
  for (const rota of PAGINAS) {
    const page = await abre(ctx, rota);
    const txt = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
    if (!txt.includes(RAZAO)) erro(`${rota}: razão social ausente do rodapé`);
    if (!txt.includes('Rio de Janeiro')) erro(`${rota}: localização ausente do rodapé`);
    await page.close();
  }
  const home = await abre(ctx, '/');
  const org = await home.evaluate(() => {
    const g = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap(s => { try { const j = JSON.parse(s.textContent); return j['@graph'] || [j]; } catch (e) { return []; } });
    return g.find(x => x['@type'] === 'Organization') || null;
  });
  if (!org) erro('home: sem Organization');
  else {
    for (const campo of ['legalName', 'taxID', 'address', 'areaServed', 'email', 'telephone'])
      if (!org[campo]) erro(`Organization sem ${campo}`);
    if (org.legalName && org.legalName !== RAZAO) erro(`legalName "${org.legalName}" ≠ rodapé`);
  }
  await home.close();
}

/* 11. Estados que só existem depois de um clique — e que por isso somem quando
   alguém corta CSS "não usado". Já sumiram. */
async function estados(browser) {
  atual = 'estados';
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p1 = await abre(desk, '/');
  await p1.hover('.nav-drop-trigger');
  await p1.waitForTimeout(400);
  if (!await p1.isVisible('.nav-drop-menu a')) erro('menu suspenso não abre no desktop');
  await p1.click('.bv-chat-launcher');
  await p1.waitForSelector('.bv-lead', { timeout: 3000 }).catch(() => erro('chat não abre'));
  await p1.focus('#f-nome');
  const borda = await p1.$eval('#f-nome', e => getComputedStyle(e).borderColor);
  if (!borda || borda === 'rgba(0, 0, 0, 0)') erro('campo sem borda visível no foco');
  await p1.close();
  await desk.close();

  const mob = await browser.newContext({ ...devices['iPhone 13'] });
  const p2 = await abre(mob, '/chatbot/');
  await p2.click('.nav-toggle');
  await p2.waitForTimeout(600);
  if (!await p2.isVisible('#main-nav a')) erro('menu do celular não abre');
  await p2.close();
  await mob.close();
}

/* 12. Peso do CSS. Informativo: entra como aviso, não como falha. */
async function peso(ctx) {
  atual = 'peso';
  for (const rota of ['/', '/chatbot/']) {
    const page = await ctx.newPage();
    await page.route('**supabase.co/**', r => r.abort());
    await page.coverage.startCSSCoverage();
    await page.goto(BASE + rota, { waitUntil: 'load' });
    const cov = await page.coverage.stopCSSCoverage();
    let total = 0, usado = 0;
    for (const e of cov) { total += e.text.length; usado += e.ranges.reduce((s, r) => s + r.end - r.start, 0); }
    const kb = Math.round(total / 1024);
    console.log(`      ${rota.padEnd(12)} ${kb} KB de CSS, ${Math.round(100 * usado / total)}% usado`);
    if (kb > 260) aviso(`${rota}: ${kb} KB de CSS sem comprimir`);
    await page.close();
  }
}

/* 13. Regerar as páginas tem de reproduzir o repositório. Sem esta checagem,
   quem rodar o gerador reintroduz em silêncio o que já foi corrigido à mão —
   foi assim que os blocos de relacionados e o link da política sumiram. */
function gerador() {
  atual = 'gerador';
  const script = path.join(__dirname, 'gera.py');
  if (!fs.existsSync(script)) { aviso('gerador ausente — checagem de sincronia pulada'); return; }
  const alvos = ['automacao-de-processos', 'integracao-de-sistemas',
    'gestao-de-marketplace', 'dashboards-power-bi'];
  const antes = {};
  for (const a of alvos) antes[a] = fs.readFileSync(path.join(RAIZ, a, 'index.html'), 'utf8');
  try {
    execFileSync('python3', [script], { cwd: __dirname, stdio: 'pipe' });
  } catch (e) {
    erro(`gerador falhou ao rodar: ${String(e.stderr || e.message).slice(0, 200)}`);
    return;
  }
  for (const a of alvos) {
    const depois = fs.readFileSync(path.join(RAIZ, a, 'index.html'), 'utf8');
    if (depois !== antes[a]) {
      erro(`${a}: regerar muda o arquivo — gerador e repositório divergiram`);
      fs.writeFileSync(path.join(RAIZ, a, 'index.html'), antes[a]);  // devolve o estado
    }
  }
}

/* ══════════════════════════════════════════════════════════════════ main */

(async () => {
  const srv = servidor();
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  BASE = `http://127.0.0.1:${srv.address().port}`;

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  const etapas = [
    ['estrutura', () => estrutura(ctx)],
    ['h1', () => h1Coerente(ctx)],
    ['colagem', () => colagem()],
    ['links', () => links(ctx)],
    ['cluster', () => cluster(ctx)],
    ['schema', () => schema(ctx)],
    ['formulários', () => formularios(ctx)],
    ['analytics', () => analytics(ctx)],
    ['lgpd', () => lgpd(ctx)],
    ['mobile', () => mobile(browser)],
    ['identidade', () => identidade(ctx)],
    ['estados', () => estados(browser)],
    ['peso', () => peso(ctx)],
    ['gerador', () => gerador()],
  ];

  for (const [nome, fn] of etapas) {
    const antes = falhas.length;
    process.stdout.write(`  ${nome.padEnd(14)}`);
    try { await fn(); } catch (e) { falhas.push(`[${nome}] a checagem quebrou: ${e.message}`); }
    const novas = falhas.length - antes;
    console.log(novas ? `✗ ${novas} falha${novas > 1 ? 's' : ''}` : 'ok');
  }

  await browser.close();
  srv.close();

  if (avisos.length) {
    console.log(`\n  avisos (${avisos.length}):`);
    avisos.forEach(a => console.log(`    · ${a}`));
  }
  if (falhas.length) {
    console.log(`\n  FALHAS (${falhas.length}):`);
    falhas.forEach(f => console.log(`    ✗ ${f}`));
    console.log('');
    process.exit(1);
  }
  console.log(`\n  ${PAGINAS.length} páginas verificadas, nenhuma falha.\n`);
})();
