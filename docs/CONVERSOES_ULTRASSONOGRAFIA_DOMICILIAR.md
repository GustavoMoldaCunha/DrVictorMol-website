# Conversões — Ultrassonografia Domiciliar

## Estado da implementação

Eventos implementados no `dataLayer`, somente em `/ultrassonografia-domiciliar/`. Não foram encontrados IDs, carregadores de GA4/GTM nem configurações de Google Ads no projeto. Nenhum ID foi criado ou sobrescrito. Os eventos estão prontos para consumo por um contêiner GTM, mas **não são enviados ao Google apenas por estarem no dataLayer**. A ativação exige o contêiner e as tags reais da conta.

O código preserva o dataLayer existente e seu método `push`, não carrega outra instalação de GTM/gtag, não altera consentimento e não impede a navegação dos CTAs. A inicialização é protegida contra repetição.

## Eventos

| Evento no dataLayer | Quando ocorre | Papel |
| --- | --- | --- |
| `domiciliary_page_view` | Uma vez por carregamento da página | Visualização/contexto, sem conversão |
| `domiciliary_whatsapp_click` | Clique em link do WhatsApp | Conversão principal proposta |
| `domiciliary_phone_click` | Clique em link `tel:` | Contato secundário |
| `domiciliary_schedule_click` | Clique em link/botão com a palavra “Agendar” | Interesse secundário |

O clique em “Agendar pelo WhatsApp” gera um evento de WhatsApp e um evento secundário de agendamento, compartilhando `interaction_id`. Somente o primeiro deve ser configurado como conversão principal. Ele mede intenção de contato/abertura do WhatsApp; não comprova envio de mensagem, agendamento confirmado ou exame realizado.

Não existe formulário na página: nenhum evento de envio foi inventado. Se um formulário for implementado, a conversão de envio deverá ocorrer após confirmação de sucesso, não apenas no clique em “Enviar”. Também não há link `tel:` atualmente: o telefone do rodapé abre o WhatsApp e é classificado como WhatsApp. A captura de `tel:` já está preparada, sem alteração dos links.

## Parâmetros

- `service_name`: `ultrassonografia_domiciliar`.
- `page_path`: caminho fixo da página.
- `page_location`: origem e caminho, sem query string ou fragmento.
- `cta_location`: origem do CTA (tabela abaixo).
- `contact_method`: `whatsapp`, `phone` ou `null`.
- `is_primary_conversion`: verdadeiro apenas no clique do WhatsApp. É um parâmetro descritivo; não configura automaticamente o GA4 ou Ads.
- `is_scheduling_cta`: indica texto com “Agendar”.
- `interaction_id`: identificador aleatório compartilhado pelos eventos do mesmo clique. Não cadastrar como dimensão personalizada de alta cardinalidade.

Não são coletados telefone, mensagem pré-preenchida, nome, pedido médico, bairro, endereço do paciente ou conteúdo de formulário. Campos de conversão são redefinidos em cada evento para não herdar valores anteriores do dataLayer.

| `cta_location` | Posição |
| --- | --- |
| `hero` | Hero |
| `apos_introducao` | CTA após introdução |
| `lista_exames` | Lista de exames |
| `doppler_venoso` | Doppler venoso |
| `atendimento_particular` | Mapeamento preparado; a seção atual não contém CTA |
| `regioes_atendidas` | Regiões |
| `como_funciona` | Agendamento |
| `final_pagina` | CTA final |
| `fixo_mobile` / `fixo_desktop` | Botão flutuante, breakpoint de 768 px |
| `menu_mobile` / `menu` | Navegação |
| `rodape` | Contato do rodapé |

## Ativação no GTM e GA4

1. Confirmar ID do contêiner e como ele é instalado. Se já houver carregamento pela hospedagem, não instalar novamente. Preservar as tags e IDs da conta.
2. Criar variáveis de camada de dados versão 2 para os parâmetros acima.
3. Criar acionadores de evento personalizado para os nomes exatos da tabela; limitar `page_path` a `/ultrassonografia-domiciliar/`.
4. Vincular eventos de clique a tags de evento GA4 usando a Google tag/ID GA4 existente. Enviar `cta_location`, `contact_method`, `service_name` e `is_scheduling_cta` como parâmetros. Cadastrar `cta_location` como dimensão personalizada com escopo de evento.
5. Marcar somente `domiciliary_whatsapp_click` como evento principal para este fluxo. Não marcar também `domiciliary_schedule_click` como conversão principal do mesmo contato.
6. Para visualizações, manter o `page_view` automático da Google tag já configurada. O evento local `domiciliary_page_view` pode alimentar um evento adicional `service_page_view` (não principal). Só mapeá-lo a `page_view` se a medição automática estiver explicitamente desativada e não houver outra tag enviando a mesma visualização.
7. Verificar acionadores de cliques preexistentes e evitar que eles e os novos acionadores enviem o mesmo evento/conversão. Preservar consentimento e configurações atuais.

## Google Ads

Preparado para uma tag de acompanhamento de conversões do Google Ads acionada exclusivamente por `domiciliary_whatsapp_click`, com filtro da página. Utilizar o ID e o rótulo reais da ação de conversão. `interaction_id` pode alimentar o campo ID da transação para deduplicar o mesmo clique; para leads, configurar contagem “Uma”. Não atribuir valor monetário fictício.

Conferir a Google tag/Conversion Linker já existente conforme a configuração da conta, sem duplicá-la. Se a conversão for importada do GA4, não manter simultaneamente a mesma ação direta do Ads como outra conversão principal. Escolher uma fonte principal para evitar contagem dupla.

## Validação

- `node --test scripts/domiciliary-tracking.test.mjs`: cinco testes aprovados, incluindo preservação do dataLayer, escopo da página, origem dos CTAs, clique no ícone, menu mobile, telefone, eventos secundários e ausência de conteúdo pessoal no payload.
- `npm run build`: aprovado.
- Após informar os IDs/configurar as tags: usar GTM Preview/Tag Assistant e GA4 DebugView; confirmar uma conversão principal por clique e que `page_view` não foi duplicado. Validar também abertura normal do WhatsApp e acionamento pelo teclado.
- Não foi possível validar entrega a GA4/Ads ou publicar um contêiner sem os IDs e acesso à configuração externa. Nenhum deploy foi realizado.

Referências oficiais:

- https://developers.google.com/tag-platform/devguides/datalayer
- https://developers.google.com/analytics/devguides/collection/ga4/views
- https://support.google.com/tagmanager/answer/7549390
