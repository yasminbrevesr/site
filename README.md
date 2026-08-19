# Site BREVES

Site institucional estático da BREVES, com uma área dedicada ao segmento jurídico.

## Estrutura

- `/index.html`: página institucional.
- `/juridico/index.html`: landing page da BREVES Jurídico.
- seis pastas de produto (`/chatbot/`, `/agentes-de-ia/`, …): uma página por solução.
- `/privacidade/index.html`: política de privacidade.
- `/assets/css`: estilos separados por página.
- `/assets/js`: comportamento das páginas e integração de contatos.
- `/assets/media`: fontes e imagens cacheáveis.
- `/ferramentas`: gerador e verificação. Não é site — o `.htaccess` devolve 404.

## Execução local

Sirva a raiz com qualquer servidor HTTP estático. Exemplo:

```bash
npx serve .
```

Abrir o HTML diretamente com `file://` não reproduz corretamente todas as regras de carregamento do navegador.

## Antes de publicar

```bash
node ferramentas/verifica.js
```

Sobe um servidor próprio, abre as nove páginas num navegador real e confere
estrutura, links, dados estruturados, formulários, eventos de conversão,
avisos de LGPD, tipografia e alvos de toque no celular, identidade da empresa
e estados que só existem depois de um clique. Sai com código 1 se algo falhar,
então serve em CI sem adaptação. Nunca escreve no Supabase: toda chamada é
interceptada.

Cada checagem nasceu de um defeito que passou por revisão visual — o
comentário de cada uma diz qual. É o ponto: num site assim, o que quebra quase
nunca aparece na tela.

Requer Node 18+ e Playwright com Chromium:

```bash
npm i -D playwright && npx playwright install chromium
```

## Páginas de produto

Quatro das seis saem de um gerador, para a estrutura ficar idêntica por
construção em vez de por copiar e colar:

```bash
python3 ferramentas/gera.py
```

O conteúdo fica em `ferramentas/dados.py`; o molde, o cabeçalho e o rodapé em
`ferramentas/gera.py`. **Ao editar essas quatro páginas à mão, edite o gerador
junto** — a verificação confere se regerar reproduz o repositório, e falha se
não reproduzir. Chatbot e agentes de IA foram feitas antes do gerador e ainda
são mantidas à mão.
