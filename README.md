# Site BREVES

Site institucional estático da BREVES, com uma área dedicada ao segmento jurídico.

## Estrutura

- `/index.html`: página institucional.
- `/juridico/index.html`: landing page da BREVES Jurídico.
- `/assets/css`: estilos separados por página.
- `/assets/js`: comportamento das páginas e integração de contatos.
- `/assets/media`: fontes e imagens cacheáveis.

## Execução local

Sirva a raiz com qualquer servidor HTTP estático. Exemplo:

```bash
npx serve .
```

Abrir o HTML diretamente com `file://` não reproduz corretamente todas as regras de carregamento do navegador.

## Contatos

Os formulários cadastram registros em `public.contatos` pelo endpoint REST do Supabase. O frontend utiliza somente a chave pública `anon`; a tabela deve manter RLS ativo e permitir ao papel `anon` apenas `INSERT`.

Nunca adicione a chave `service_role` ao repositório ou ao navegador.
