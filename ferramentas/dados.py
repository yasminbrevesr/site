# -*- coding: utf-8 -*-
"""Conteúdo das páginas de produto da BREVES.

Uma entrada por produto. A estrutura é sempre a mesma — hero, linha do tempo
de quatro passos, grade de recursos, cinco dúvidas e chamada final —, então o
que muda de uma página para outra é só o que está aqui.

Nada aqui afirma resultado de cliente, prazo ou preço: o site não tem case
publicado, e inventar número numa página de produto é o tipo de coisa que
aparece na primeira reunião.
"""

# A lista de produtos do site, na ordem em que aparece na home. Vale para o
# menu, para o rodapé e para o sitemap.
CATALOGO = [
    ('Automação de processos',    'automacao-de-processos/'),
    ('Integração entre sistemas', 'integracao-de-sistemas/'),
    ('Agentes de IA',             'agentes-de-ia/'),
    ('Chatbot com IA',            'chatbot/'),
    ('Gestão de marketplace',     'gestao-de-marketplace/'),
    ('Painéis em Power BI',       'dashboards-power-bi/'),
]

PRODUTOS = [

# ══════════════════════════════════════════════════ automação de processos ══
{
 'slug': 'automacao-de-processos',
 'nome': 'Automação de processos',
 'chave_form': 'automacao',
 'titulo': 'Automação de processos para empresas | BREVES',
 'meta': 'Automatize as rotinas manuais da sua empresa: transferência de dados '
         'entre sistemas, atualização de planilhas, conferências e geração de relatórios.',
 'og': 'As rotinas que alguém refaz toda semana passam a rodar sozinhas, em cima '
       'do processo que já existe e sem trocar as ferramentas da sua equipe.',
 'schema_nome': 'Automação de processos',
 'schema_tipo': 'Automação de processos empresariais',
 'schema_desc': 'Desenvolvimento de automações para rotinas manuais e repetitivas: '
                'transferência de informações entre sistemas, atualização de planilhas '
                'e bancos de dados, conferências, geração de documentos e relatórios.',
 'badge': 'Rotinas · Planilhas · Documentos',
 'icone': '<path d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2.1 2.1M8.6 15.4l-2.1 2.1m0-11.9 2.1 2.1m6.8 6.8 2.1 2.1"/>'
          '<circle cx="12" cy="12" r="3.2"/>',
 'h1': 'Automação de processos que tira da sua equipe o trabalho <em>que se repete todo dia.</em>',
 'lead': 'Cada hora gasta copiando dado de um sistema para outro, conferindo planilha e '
         'montando o mesmo relatório é margem que evapora. Automatizamos essas rotinas em '
         'cima do processo que já existe, sem trocar as ferramentas que a sua equipe usa.',
 'cta_hero': 'Quero automatizar uma rotina',
 'arte_rotulo': 'Exemplo de uma rotina automatizada: a automação roda no horário combinado, '
                'processa os dados e entrega o resultado pronto',
 'arte': [
   ('Rotina', 'toda segunda, 8h', 'chips',
    ['ler as planilhas do time', 'conferir contra o sistema', 'gerar o relatório', 'enviar para o financeiro']),
   ('Execução', 'concluída', 'campos',
    [('Linhas processadas', '1.842', ''), ('Divergências separadas', '3', ''),
     ('Relatório', 'enviado', 'is-ok')]),
 ],
 'passos': [
   ('Mapeia o que é feito hoje',
    'Antes de automatizar qualquer coisa, a rotina é destrinchada: quem faz, com que '
    'frequência, de onde vem cada informação e o que decide o resultado. Automatizar um '
    'processo que ninguém entende só deixa o problema mais rápido.'),
   ('Conecta as pontas',
    'Planilha, e-mail, sistema, pasta compartilhada. A automação vai buscar o dado onde ele '
    'já está hoje — não é preciso mudar nada de lugar antes de começar.'),
   ('Executa a regra',
    'O que era decisão repetida vira regra escrita: conferir, comparar, separar, calcular, '
    'preencher. Sempre do mesmo jeito, sem depender de quem está de plantão naquele dia.'),
   ('Entrega e avisa',
    'O resultado chega pronto onde precisa chegar — planilha, sistema ou e-mail. E quando '
    'algo sai do previsto, alguém é avisado em vez de descobrir no fechamento do mês.'),
 ],
 'recursos_titulo': 'Não é macro de planilha.<br><em>É a rotina inteira.</em>',
 'recursos': [
   ('Roda no horário combinado',
    'Toda segunda de manhã, todo dia às 9h, todo fim de mês. A rotina deixa de depender de '
    'alguém lembrar de rodar.'),
   ('Lê onde o dado já está',
    'Planilha, e-mail, sistema, pasta compartilhada. Não é preciso reorganizar a empresa para '
    'começar a automatizar.'),
   ('A regra é sua e fica escrita',
    'O critério de conferência, de corte e de aprovação é o da sua operação — escrito e '
    'conferível, não improvisado a cada execução.'),
   ('Avisa quando algo foge',
    'Automação silenciosa esconde erro. Quando a fonte falha ou o número sai do esperado, '
    'alguém recebe o aviso na hora.'),
   ('Deixa registro',
    'Cada execução guarda o que leu, o que fez e o que gerou. Dá para auditar um dia '
    'específico depois, um a um.'),
   ('Começa pequeno',
    'Entra pela rotina que mais dói e cresce a partir dela, em vez de tentar automatizar a '
    'empresa inteira de uma vez.'),
 ],
 'faq_titulo': 'Antes de automatizar, <em>é importante saber.</em>',
 'faq': [
   ('Preciso trocar os sistemas que já uso?',
    'Não. A automação entra em volta do que já existe: ela lê a planilha, o e-mail e o sistema '
    'que a sua equipe usa hoje. Trocar de ferramenta é um projeto à parte, e raramente é o que '
    'estava travando a rotina.'),
   ('E se a planilha mudar de formato?',
    'A automação confere a estrutura antes de processar. Se a coluna sumiu ou o formato mudou, '
    'ela para e avisa, em vez de gravar dado errado em cima do certo. Corrigir um aviso custa '
    'muito menos que descobrir a divergência no fechamento.'),
   ('Isso substitui a minha equipe?',
    'Não. Substitui a parte do dia que ninguém queria fazer: copiar, conferir linha por linha '
    'e montar o mesmo arquivo toda semana. O que exige julgamento, negociação ou exceção '
    'continua com quem sabe decidir.'),
   ('Quanto tempo leva para entrar no ar?',
    'Depende do escopo, mas a implantação acontece por etapas. Começa pela rotina mais crítica, '
    'entra em operação e cresce a partir do que a execução real mostra — em vez de tentar '
    'prever tudo antes de começar.'),
   ('Como eu sei que está funcionando?',
    'Cada execução deixa registro do que leu, do que fez e do que gerou, e qualquer coisa fora '
    'do previsto vira aviso. Você não precisa confiar: dá para conferir.'),
 ],
 'final_titulo': 'A conta do trabalho manual <em>só aparece no fim do mês.</em>',
 'final_texto': 'Conte qual rotina consome mais tempo da sua equipe hoje: quem faz, de onde vem '
                'a informação e o que decide o resultado. A partir daí desenhamos a automação em '
                'cima do seu processo, não de um modelo pronto.',
 'cta_final': 'Falar sobre a minha operação',
 'wa': 'Olá! Gostaria de saber mais sobre automação de processos com a BREVES.',
 'chat_saudacao': 'Olá! Este chat responde as dúvidas mais comuns sobre automação de processos. '
                  'O que você quer saber?',
 'chat': [
   ('O que dá para automatizar?',
    'Rotina que se repete e tem regra clara: transferir informação entre sistemas, atualizar '
    'planilha e banco de dados, conferir pedido contra nota, gerar documento e relatório, montar '
    'e enviar o arquivo de sempre. Se alguém faz a mesma coisa toda semana seguindo um critério, '
    'em geral dá para automatizar.',
    'Olá! Queria entender o que dá para automatizar na minha operação.'),
   ('Preciso trocar de sistema?',
    'Não. A automação entra em volta do que já existe — lê a planilha, o e-mail e o sistema que a '
    'sua equipe usa hoje. Trocar de ferramenta é outro projeto, e quase nunca é o que estava '
    'travando a rotina.',
    'Olá! Queria saber se a automação da BREVES funciona com os sistemas que eu já uso.'),
   ('E se der erro?',
    'A automação confere a estrutura antes de processar e para quando algo foge do previsto, '
    'avisando alguém em vez de gravar dado errado. Cada execução também deixa registro do que leu '
    'e do que fez, então dá para auditar qualquer dia depois.',
    'Olá! Queria entender como a BREVES trata erro em automação.'),
   ('Vai substituir minha equipe?',
    'Não. Substitui a parte do dia que ninguém queria fazer: copiar, conferir linha por linha e '
    'montar o mesmo arquivo. O que exige julgamento, negociação ou exceção continua com quem sabe '
    'decidir.',
    'Olá! Queria entender como a automação se encaixa na rotina da minha equipe.'),
   ('Quanto custa?',
    'Não temos tabela de preço, e chutar um valor sem conhecer a rotina seria desonesto. O escopo '
    'sai de uma conversa inicial, em que entendemos quem faz a tarefa hoje e o que decide o '
    'resultado — e essa primeira conversa é sem compromisso.',
    'Olá! Queria entender como funciona o orçamento de uma automação da BREVES.'),
 ],
},

# ══════════════════════════════════════════════ integração entre sistemas ══
{
 'slug': 'integracao-de-sistemas',
 'nome': 'Integração entre sistemas',
 'chave_form': 'integracao',
 'titulo': 'Integração entre sistemas e APIs | BREVES',
 'meta': 'Conectamos ERP, CRM, e-commerce e planilhas por API para a informação circular '
         'sozinha entre os sistemas, sem redigitação e sem divergência.',
 'og': 'Pedido, estoque, cadastro e status circulando sozinhos entre os sistemas que a sua '
       'empresa já usa — o dado digitado uma vez só.',
 'schema_nome': 'Integração entre sistemas e APIs',
 'schema_tipo': 'Integração de sistemas empresariais',
 'schema_desc': 'Desenvolvimento e integração de APIs entre ERPs, CRMs, e-commerce, bancos de '
                'dados e sistemas internos, para sincronizar informações e eliminar a digitação '
                'do mesmo dado em mais de um lugar.',
 'badge': 'API · ERP · CRM · Planilhas',
 'icone': '<path d="M9 7H7a5 5 0 0 0 0 10h2m6-10h2a5 5 0 0 1 0 10h-2M8 12h8"/>',
 'h1': 'Integração entre sistemas para o dado ser digitado <em>uma vez só.</em>',
 'lead': 'Informação redigitada em dois lugares vira divergência, e divergência aparece no '
         'fechamento do mês. Conectamos por API os sistemas que a sua empresa já usa, para que '
         'pedido, estoque, cadastro e status circulem sozinhos entre eles.',
 'cta_hero': 'Quero integrar meus sistemas',
 'arte_rotulo': 'Exemplo de uma integração: o pedido criado na loja chega ao ERP e ao CRM sem '
                'ninguém redigitar',
 'arte': [
   ('Gatilho', 'pedido criado na loja', 'campos',
    [('Origem', 'e-commerce', ''), ('Campos mapeados', '14', ''), ('Regra', 'só pedido pago', '')]),
   ('Sincronização', 'concluída', 'campos',
    [('ERP', 'atualizado', 'is-ok'), ('CRM', 'atualizado', 'is-ok'),
     ('Estoque', 'baixado', 'is-ok')]),
 ],
 'passos': [
   ('Mapeia o que precisa circular',
    'Nem todo dado precisa ir para todo lugar. O primeiro passo é decidir o que sai de onde, '
    'para onde vai, com que frequência e quem manda quando os dois lados discordam.'),
   ('Abre o caminho',
    'Onde o sistema publica API, a conexão é direta. Onde não publica, existem outros caminhos — '
    'exportação programada, banco, arquivo — e a escolha depende do que a ferramenta permite, '
    'não do que seria mais bonito.'),
   ('Traduz de um lado para o outro',
    'Cada sistema chama a mesma coisa por um nome diferente e guarda a data de um jeito. A '
    'integração faz essa tradução, que é onde a maioria delas quebra.'),
   ('Cuida do que falha',
    'Integração que quebra em silêncio é pior que integração nenhuma. Quando o outro lado sai do '
    'ar ou recusa o registro, o caso fica na fila, é tentado de novo e alguém é avisado.'),
 ],
 'recursos_titulo': 'O que separa uma integração<br><em>de uma exportação de planilha.</em>',
 'recursos': [
   ('Conecta os dois sentidos',
    'Não é só puxar dado para relatório. O que precisa voltar volta: status, código, confirmação '
    'e baixa de estoque.'),
   ('Sabe quem manda',
    'Quando os dois lados têm a mesma informação diferente, a regra de precedência está definida '
    'antes — e não é decidida no susto.'),
   ('Não perde registro',
    'Se o outro sistema recusa ou sai do ar, o caso entra na fila e é tentado de novo, em vez de '
    'simplesmente sumir.'),
   ('Avisa quando falha',
    'Toda falha vira aviso para uma pessoa. Ninguém descobre no fechamento que a integração parou '
    'há duas semanas.'),
   ('Deixa rastro',
    'Cada troca guarda o que saiu, o que entrou e o que o outro lado respondeu. Dá para auditar um '
    'pedido específico depois.'),
   ('Vale para o que existe hoje',
    'Já conectamos ERPs, CRMs, marketplaces, bancos de dados, Power BI, Excel, Google Sheets e '
    'plataformas de automação. Na prática, depende da API que a ferramenta abre.'),
 ],
 'faq_titulo': 'Antes de conectar, <em>é importante saber.</em>',
 'faq': [
   ('Meu sistema não tem API. Dá para integrar?',
    'Em geral sim, por outro caminho: exportação programada, acesso ao banco ou troca de arquivo '
    'em pasta compartilhada. Fica menos imediato que uma API, mas resolve. Quando não há caminho '
    'nenhum, dizemos isso em vez de vender uma integração que não vai existir.'),
   ('E se um dos sistemas sair do ar?',
    'O registro entra na fila e é tentado de novo quando o outro lado voltar. Nada é descartado em '
    'silêncio, e alguém é avisado se a falha persistir.'),
   ('Vocês trocam meu ERP?',
    'Não é o ponto de partida. Integrar custa menos e para menos a operação do que migrar. Trocar '
    'de sistema só entra na conversa quando o próprio sistema é o gargalo.'),
   ('Quanto tempo leva?',
    'Depende de quantos sistemas entram e do que cada um permite. A implantação acontece por '
    'etapas: começa pela troca mais crítica, entra em operação e cresce a partir do que aparece '
    'na prática.'),
   ('Como fica a segurança dos dados?',
    'A integração usa as credenciais e as permissões que você definir, com acesso restrito ao que '
    'ela precisa ler e escrever. Cada troca fica registrada, então dá para auditar o que circulou.'),
 ],
 'final_titulo': 'Se o número não bate, <em>alguém está digitando duas vezes.</em>',
 'final_texto': 'Conte quais sistemas a sua empresa usa e onde a informação trava hoje. A partir '
                'daí desenhamos a integração em cima do que existe, e dizemos com franqueza o que '
                'dá e o que não dá para conectar.',
 'cta_final': 'Falar sobre os meus sistemas',
 'wa': 'Olá! Gostaria de saber mais sobre integração entre sistemas com a BREVES.',
 'chat_saudacao': 'Olá! Este chat responde as dúvidas mais comuns sobre integração entre sistemas. '
                  'O que você quer saber?',
 'chat': [
   ('O que dá para integrar?',
    'ERP, CRM, e-commerce, marketplace, banco de dados, planilha, agenda e ferramentas internas. Já '
    'conectamos ERPs, CRMs, marketplaces, Power BI, Excel, Google Sheets e plataformas de '
    'automação. Na prática depende da API que a ferramenta abre.',
    'Olá! Queria saber o que a BREVES consegue integrar.'),
   ('Meu sistema não tem API.',
    'Em geral ainda dá, por outro caminho: exportação programada, acesso ao banco ou troca de '
    'arquivo em pasta compartilhada. Fica menos imediato, mas resolve. Quando não há caminho '
    'nenhum, dizemos isso em vez de prometer.',
    'Olá! Meu sistema não tem API e queria saber se dá para integrar.'),
   ('Preciso trocar de ERP?',
    'Não é o ponto de partida. Integrar custa menos e para menos a operação do que migrar. Trocar '
    'de sistema só entra na conversa quando o próprio sistema é o gargalo.',
    'Olá! Queria saber se preciso trocar de ERP para integrar meus sistemas.'),
   ('E se a integração falhar?',
    'O registro entra na fila e é tentado de novo quando o outro lado voltar, e a falha vira aviso '
    'para uma pessoa. Cada troca guarda o que saiu, o que entrou e o que o outro lado respondeu.',
    'Olá! Queria entender como a BREVES trata falha em integração.'),
   ('Quanto custa?',
    'Não temos tabela de preço. O escopo depende de quantos sistemas entram e do que cada um '
    'permite, então sai de uma conversa inicial — sem compromisso — em que entendemos o cenário '
    'antes de propor caminho.',
    'Olá! Queria entender como funciona o orçamento de uma integração da BREVES.'),
 ],
},

# ═══════════════════════════════════════════════════ gestão de marketplace ══
{
 'slug': 'gestao-de-marketplace',
 'nome': 'Gestão de marketplace',
 'chave_form': 'marketplace',
 'titulo': 'Gestão de marketplace: anúncio, publicidade e venda | BREVES',
 'meta': 'Gestão de marketplace ponta a ponta: anúncio otimizado, ficha técnica completa, '
         'publicidade e estratégia de preço, com resultado acompanhado por número.',
 'og': 'Anúncio, publicidade e estratégia cuidados de perto, com o resultado acompanhado por '
       'número — não por impressão.',
 'schema_nome': 'Gestão de marketplace',
 'schema_tipo': 'Gestão de vendas em marketplace',
 'schema_desc': 'Gestão de operações de marketplace: otimização de anúncios e fichas técnicas, '
                'publicidade, estratégia de preço e acompanhamento de resultados de venda.',
 'badge': 'Anúncios · Publicidade · Estratégia',
 'icone': '<path d="M4 8h16l-1.2 10.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8Zm4 0V6.5a4 4 0 0 1 8 0V8"/>',
 'h1': 'Gestão de marketplace para a sua loja <em>parar de perder venda.</em>',
 'lead': 'Anúncio mal descrito, ficha incompleta e preço fora da faixa entregam venda de graça ao '
         'concorrente que está do lado na mesma busca. Cuidamos do anúncio, da publicidade e da '
         'estratégia, com o resultado acompanhado por número.',
 'cta_hero': 'Quero vender mais no marketplace',
 'arte_rotulo': 'Exemplo do trabalho: o anúncio é revisado ponto a ponto e o resultado é '
                'acompanhado toda semana',
 'arte': [
   ('Anúncio', 'revisado', 'chips',
    ['título com o termo de busca', 'ficha técnica completa', 'fotos no padrão do canal',
     'preço dentro da faixa']),
   ('Acompanhamento', 'toda semana', 'campos',
    [('Publicidade', 'campanha ativa', ''), ('Perguntas', 'respondidas', 'is-ok'),
     ('Relatório', 'enviado', 'is-ok')]),
 ],
 'passos': [
   ('Olha a loja como o comprador vê',
    'A primeira coisa é buscar o seu produto no canal e ver o que aparece: quem está acima, o que '
    'o anúncio deles tem e o seu não tem, e em que ponto o comprador desiste.'),
   ('Arruma o anúncio',
    'Título com o termo que as pessoas realmente buscam, ficha técnica preenchida até o fim, foto '
    'no padrão do canal e descrição que responde a dúvida antes de ela virar pergunta.'),
   ('Coloca publicidade onde converte',
    'Anúncio ruim com verba em cima continua ruim, só que mais caro. A publicidade entra depois do '
    'anúncio arrumado, e concentrada no que já mostra tração.'),
   ('Acompanha e ajusta',
    'Preço, estoque, prazo e concorrência mudam toda semana. O acompanhamento é por número — e o '
    'que não funcionou é dito, não escondido no relatório.'),
 ],
 'recursos_titulo': 'Não é só subir produto.<br><em>É cuidar da loja.</em>',
 'recursos': [
   ('Anúncio pensado para a busca',
    'O título carrega o termo que o comprador digita, não o nome interno do produto no seu '
    'cadastro.'),
   ('Ficha técnica até o fim',
    'Campo em branco derruba o anúncio no filtro e na busca. Preencher tudo é chato e é onde a '
    'maioria das lojas perde posição de graça.'),
   ('Publicidade depois do básico',
    'Verba em anúncio malfeito é dinheiro queimado. A campanha entra quando o anúncio já está de '
    'pé, e concentrada no que converte.'),
   ('Preço acompanhado',
    'Ficar fora da faixa do canal derruba a posição. O preço é acompanhado junto com a '
    'concorrência, não definido uma vez e esquecido.'),
   ('Pergunta respondida rápido',
    'Pergunta parada é venda que vai para quem respondeu antes. Dá para automatizar a resposta do '
    'que se repete e deixar o resto com gente.'),
   ('Resultado por número',
    'Relatório com o que subiu, o que caiu e o que foi feito naquela semana. Sem número, é opinião '
    'sobre a sua loja.'),
 ],
 'faq_titulo': 'Antes de começar, <em>é importante saber.</em>',
 'faq': [
   ('Vocês trabalham com quais canais?',
    'Os marketplaces mais usados no Brasil. O que muda de um para o outro é a regra de anúncio, o '
    'formato de publicidade e o critério de posição — o método de trabalho é o mesmo. Conte em '
    'qual você vende hoje e dizemos com franqueza se faz sentido.'),
   ('Vocês garantem aumento de venda?',
    'Não, e desconfie de quem garante. Venda depende de preço, produto, estoque, prazo e '
    'concorrência — parte disso é da sua operação, não da gestão do anúncio. O que dá para '
    'garantir é o trabalho feito e o resultado medido de forma honesta.'),
   ('Quem cuida do estoque e do envio?',
    'Continua com você. Cuidamos do anúncio, da publicidade e da estratégia de venda. Se o gargalo '
    'estiver no estoque ou no prazo de envio, dizemos — porque nenhum anúncio conserta isso.'),
   ('Já tenho anúncio no ar. Começa do zero?',
    'Não. Começa por uma revisão do que já existe: título, ficha, foto, descrição e preço. Em geral '
    'é aí que está a maior parte do ganho, antes de qualquer verba de publicidade.'),
   ('Como acompanho o resultado?',
    'Com um relatório periódico do que subiu, do que caiu e do que foi feito naquela semana. O que '
    'não funcionou entra no relatório também.'),
 ],
 'final_titulo': 'O concorrente do lado <em>está na mesma busca que você.</em>',
 'final_texto': 'Conte em quais canais a sua loja vende hoje, o que já foi tentado e onde a venda '
                'trava. A partir daí olhamos a loja como o comprador vê e dizemos por onde começar.',
 'cta_final': 'Falar sobre a minha loja',
 'wa': 'Olá! Gostaria de saber mais sobre gestão de marketplace com a BREVES.',
 'chat_saudacao': 'Olá! Este chat responde as dúvidas mais comuns sobre gestão de marketplace. O '
                  'que você quer saber?',
 'chat': [
   ('O que vocês fazem pela minha loja?',
    'Revisão do anúncio — título, ficha técnica, foto, descrição e preço —, publicidade dentro do '
    'canal, estratégia de venda e acompanhamento do resultado por número. Estoque e envio '
    'continuam com você.',
    'Olá! Queria entender o que a BREVES faz na gestão de marketplace.'),
   ('Vocês garantem aumento de venda?',
    'Não, e desconfie de quem garante. Venda depende de preço, produto, estoque, prazo e '
    'concorrência, e parte disso é da sua operação. O que garantimos é o trabalho feito e o '
    'resultado medido de forma honesta.',
    'Olá! Queria entender que resultado esperar da gestão de marketplace da BREVES.'),
   ('Já tenho anúncio no ar.',
    'Melhor ainda: começa por uma revisão do que já existe. Em geral a maior parte do ganho está '
    'no título, na ficha técnica e na foto, antes de qualquer verba de publicidade.',
    'Olá! Já vendo em marketplace e queria uma revisão dos meus anúncios.'),
   ('Em quais canais vocês atuam?',
    'Nos marketplaces mais usados no Brasil. O que muda de um para o outro é a regra de anúncio, o '
    'formato de publicidade e o critério de posição. Conte em qual você vende e dizemos com '
    'franqueza se faz sentido.',
    'Olá! Queria saber em quais marketplaces a BREVES trabalha.'),
   ('Quanto custa?',
    'Não temos tabela de preço. O escopo depende de quantos canais e de quantos anúncios entram, '
    'então sai de uma conversa inicial — sem compromisso — em que entendemos a loja antes de '
    'propor caminho.',
    'Olá! Queria entender como funciona o orçamento da gestão de marketplace da BREVES.'),
 ],
},

# ══════════════════════════════════════════════════════ painéis em power bi ══
{
 'slug': 'dashboards-power-bi',
 'nome': 'Painéis em Power BI',
 'chave_form': 'powerbi',
 'titulo': 'Dashboards em Power BI sob medida | BREVES',
 'meta': 'Dashboards em Power BI construídos sobre dados integrados e atualização automática, '
         'e não sobre planilha alimentada à mão. Peça um diagnóstico do seu processo.',
 'og': 'Antes do visual, as fontes são integradas e a carga é automatizada. O painel é a última '
       'etapa, não a primeira.',
 'schema_nome': 'Desenvolvimento de painéis em Power BI',
 'schema_tipo': 'Dashboards e business intelligence em Power BI',
 'schema_desc': 'Construção de painéis em Power BI sobre fontes de dados integradas e carga '
                'automatizada: diagnóstico do processo, organização das fontes, modelagem, '
                'publicação do painel e acompanhamento.',
 'badge': 'Power BI · ERP · Planilhas',
 'icone': '<path d="M4 19h16M7 19V9m5 10V5m5 14v-7"/>',
 'h1': 'Dashboards em Power BI que se atualizam <em>sem ninguém alimentar planilha.</em>',
 'lead': 'Painel construído sobre planilha feita à mão quebra na primeira semana em que alguém '
         'esquece de salvar. Antes do visual, integramos as fontes e automatizamos a carga — o '
         'painel é a última etapa, não a primeira.',
 'cta_hero': 'Quero um diagnóstico',
 'arte_rotulo': 'Exemplo da entrega: as fontes são integradas e o painel se atualiza sozinho',
 'arte': [
   ('Fontes', 'integradas', 'campos',
    [('ERP', 'venda e estoque', ''), ('Planilhas', 'metas por área', ''),
     ('Atualização', 'diária, automática', 'is-ok')]),
   ('Painel', 'publicado', 'campos',
    [('Indicadores', 'por área', ''), ('Acesso', 'por login', ''),
     ('Origem do número', 'rastreável', 'is-ok')]),
 ],
 'passos': [
   ('Entende a decisão que trava',
    'Antes de escolher gráfico, a pergunta é qual decisão está sendo tomada no escuro hoje, por '
    'quem e com que frequência. Painel sem decisão atrás vira quadro bonito que ninguém abre.'),
   ('Organiza as fontes',
    'De onde vem cada número, com que frequência muda, quem alimenta e o que fazer quando dois '
    'sistemas discordam. É a etapa que a maioria pula, e é ela que decide se o painel sobrevive.'),
   ('Automatiza a carga',
    'A atualização deixa de depender de alguém salvar a planilha na pasta certa. O dado chega '
    'sozinho, no horário combinado, e a falha vira aviso em vez de número velho na tela.'),
   ('Publica e acompanha',
    'O painel entra em uso com quem vai usar de verdade. Depois, o que ninguém abre sai e o que '
    'faltou entra — a primeira versão nunca é a última.'),
 ],
 # O hero desta página mostra um relatório em vez de descrever um.
 # Os números são de exemplo e fecham entre si: os seis grupos de produto somam
 # 6,98 Mi, as cinco regiões também, e o ticket médio (6.978.211 / 22.456) dá
 # R$ 310,75. Ilustração que não fecha é a primeira coisa que alguém de dados
 # percebe.
 'painel': {
   'titulo': 'Performance de vendas',
   'filtros': [('Visão', 'Mês'), ('Ano', '2026'), ('Período', 'Todos'),
               ('Indicador', 'Faturamento')],
   'kpis': [
     ('Faturamento', 'R$ 6.978.211', 'Melhor mês: outubro', '+53,0% vs. ano anterior', '104%', '104%'),
     ('Margem bruta', 'R$ 3.098.759', '44,4% do faturamento', '+42,4% vs. ano anterior', '101%', '101%'),
     ('Pedidos', '22.456', 'Ticket médio: R$ 310,75', '+80,8% vs. ano anterior', '96%', '96%'),
   ],
   'barras_titulo': 'Faturamento por grupo de produto',
   'barras': [
     ('Farinhas de trigo', 'R$ 1,67 Mi', '100%'),
     ('Fermentos',         'R$ 1,42 Mi', '85%'),
     ('Óleos',             'R$ 1,18 Mi', '71%'),
     ('Farinhas mistas',   'R$ 0,96 Mi', '58%'),
     ('Farofas',           'R$ 0,88 Mi', '53%'),
     ('Doces',             'R$ 0,87 Mi', '52%'),
   ],
   'serie_titulo': 'Faturamento ao longo do tempo',
   'serie': ['38%', '46%', '41%', '55%', '49%', '62%', '58%', '71%', '66%', '92%', '78%', '85%'],
   'meses': ['jan', 'abr', 'jul', 'out', 'dez'],
   'tabela_titulo': 'Faturamento por região',
   'tabela_colunas': ('Região', 'Faturamento', '% da meta'),
   'tabela': [
     ('Sudeste',      'R$ 2,44 Mi', '118%', True),
     ('Sul',          'R$ 1,68 Mi', '109%', True),
     ('Nordeste',     'R$ 1,21 Mi', '104%', True),
     ('Centro-Oeste', 'R$ 0,93 Mi', '97%',  False),
     ('Norte',        'R$ 0,72 Mi', '91%',  False),
   ],
 },
 # A seção que lista o que o cliente passa a conseguir fazer com o painel no
 # ar. É capacidade, não resultado prometido: cada linha é uma pergunta que o
 # relatório passa a responder, e nenhuma delas afirma quanto alguém ganhou.
 'solucoes_titulo': 'Com o painel no ar,<br><em>fica mais fácil:</em>',
 'solucoes': [
   ('<path d="M4 19h16M7 19v-6m5 6V8m5 11v-9"/><path d="m6 9 4-4 3.5 3.5L20 3"/>',
    'Acompanhar a meta do mês todo dia, e não só no fechamento.'),
   ('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.2V12l3.2 1.9"/>',
    'Fechar o mês sem passar dias consolidando planilha.'),
   ('<circle cx="10" cy="8" r="3.4"/><path d="M3.6 19a6.4 6.4 0 0 1 12.8 0"/>'
    '<path d="m17.4 12.4 2 2 3.1-3.1"/>',
    'Entender o que cada cliente compra, com que frequência e quando parou.'),
   ('<path d="M3 8.5h11a3.5 3.5 0 0 1 0 7H8"/><path d="m10.5 6 2.5 2.5L10.5 11"/>'
    '<path d="m10.5 13 -2.5 2.5L10.5 18"/>',
    'Negociar prazo de recebimento e de pagamento com número na mão.'),
   ('<path d="M4 19h16"/><rect x="5.5" y="9" width="3.4" height="7" rx="1"/>'
    '<rect x="10.8" y="5.5" width="3.4" height="10.5" rx="1"/>'
    '<rect x="16.1" y="11.5" width="3.4" height="4.5" rx="1"/>',
    'Ver para onde a despesa está indo antes de virar surpresa no caixa.'),
   ('<circle cx="12" cy="12" r="8.5"/><path d="M14.6 9.2a3 3 0 1 0 0 5.6"/>'
    '<path d="M12 6.6v10.8"/>',
    'Acompanhar o ciclo financeiro e o caixa projetado das próximas semanas.'),
   ('<path d="M4 19h16"/><path d="m5.5 15.5 4-4.5 3 2.5 6-7"/>'
    '<path d="M18.5 6.5H15m3.5 0V10"/>',
    'Saber qual produto sustenta a margem e qual só ocupa estoque.'),
   ('<rect x="3" y="4.5" width="18" height="15" rx="2.2"/><path d="M3 9.5h18M9 9.5V19.5"/>'
    '<path d="M12.5 13h5.5M12.5 16h3.5"/>',
    'Comparar filial, região e vendedor pelo mesmo critério.'),

   ('<path d="M4 6h6M4 11h4M4 16h6"/><circle cx="15.5" cy="12.5" r="4.6"/>'
    '<path d="m18.9 15.9 2.6 2.6"/>',
    'Explicar de onde veio cada número, quando foi atualizado e com que regra.'),
 ],
 'faq_titulo': 'Antes de construir, <em>é importante saber.</em>',
 'faq': [
   ('Meus dados estão espalhados em planilhas. Dá para começar?',
    'Dá, e é o cenário mais comum. A diferença é que a planilha entra como fonte a ser organizada '
    'e integrada, não como base permanente do painel. Se ela continuar sendo alimentada à mão, o '
    'painel herda o mesmo problema.'),
   ('Dashboard pronto ou sob medida?',
    'Modelo pronto serve para ver rápido como uma coisa parece, e trava assim que o seu processo '
    'não é igual ao do modelo. Sob medida custa mais no começo e é o que sobrevive à segunda '
    'mudança da operação.'),
   ('Preciso ter ERP para ter painel?',
    'Não. A fonte pode ser ERP, CRM, e-commerce, banco de dados ou planilha — o que importa é que '
    'ela seja acessível de forma programada. O que não funciona é fonte que só existe na cabeça '
    'de uma pessoa.'),
   ('Quanto tempo leva?',
    'Depende de quantas fontes entram e de que estado elas estão. A parte de integrar e organizar '
    'costuma levar mais tempo que a de montar o painel — e é justamente a que não dá para pular.'),
   ('Quem mantém o painel depois?',
    'Isso é combinado antes. Dá para entregar com a documentação para a sua equipe assumir, ou '
    'acompanhar a evolução junto. O que não dá é entregar e sumir: fonte muda, e painel sem dono '
    'para de valer em poucos meses.'),
 ],
 'final_titulo': 'Se o número chega tarde, <em>a decisão já foi tomada sem ele.</em>',
 'final_texto': 'Conte como o seu relatório é montado hoje: quem faz, de onde vem cada número e '
                'quanto tempo leva até chegar em quem decide. A partir daí desenhamos o caminho — '
                'e ele começa nas fontes, não no painel.',
 'cta_final': 'Falar sobre os meus dados',
 'wa': 'Olá! Gostaria de saber mais sobre painéis em Power BI com a BREVES.',
 'chat_saudacao': 'Olá! Este chat responde as dúvidas mais comuns sobre painéis em Power BI. O que '
                  'você quer saber?',
 'chat': [
   ('Como vocês trabalham?',
    'A ordem importa: primeiro entender qual decisão está travada, depois organizar de onde vem '
    'cada número, depois automatizar a carga e só então montar o painel. Painel sobre planilha '
    'alimentada à mão quebra na primeira semana em que alguém esquece de salvar.',
    'Olá! Queria entender como a BREVES trabalha com Power BI.'),
   ('Meus dados estão em planilha.',
    'É o cenário mais comum, e dá para começar assim. A diferença é que a planilha entra como '
    'fonte a ser organizada e integrada, não como base permanente. Se ela continuar sendo '
    'alimentada à mão, o painel herda o mesmo problema.',
    'Olá! Meus dados estão em planilha e queria saber se dá para montar um painel.'),
   ('Pronto ou sob medida?',
    'Modelo pronto serve para ver rápido como uma coisa parece, e trava assim que o seu processo '
    'não é igual ao do modelo. Sob medida custa mais no começo e é o que sobrevive à segunda '
    'mudança da operação.',
    'Olá! Queria entender a diferença entre dashboard pronto e sob medida.'),
   ('Quem mantém depois?',
    'É combinado antes. Dá para entregar com documentação para a sua equipe assumir, ou acompanhar '
    'a evolução junto. O que não dá é entregar e sumir: fonte muda, e painel sem dono para de '
    'valer em poucos meses.',
    'Olá! Queria entender como fica a manutenção de um painel feito pela BREVES.'),
   ('Quanto custa?',
    'Não temos tabela de preço. O valor depende de quantas fontes entram e do estado em que elas '
    'estão — integrar costuma pesar mais que montar o painel. O escopo sai de uma conversa '
    'inicial, sem compromisso.',
    'Olá! Queria entender como funciona o orçamento de um painel em Power BI da BREVES.'),
 ],
},

]
