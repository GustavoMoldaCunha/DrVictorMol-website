# Auditoria técnica — Ultrassonografia Domiciliar

Data: 22/09/2026. Escopo: somente a página `/ultrassonografia-domiciliar/`, sem alterações nos textos das seções ou no CSS visual.

## Ajustes realizados

- Dimensões intrínsecas da imagem principal corrigidas de 360 × 270 para 1512 × 1900, correspondentes ao arquivo, para reservar a proporção correta durante o carregamento.
- Versões WebP de 480 px (25.104 bytes) e 960 px (57.100 bytes), mantendo o original de 1512 px (82.840 bytes). `srcset`, `sizes` e preload responsivo consistentes; prioridade alta e carregamento imediato preservados. O navegador do teste escolheu apenas a versão de 960 px: redução de aproximadamente 31% no recurso principal. Não foi necessário converter para AVIF.
- JSON-LD específico desta página: `Service`, `MedicalWebPage`, `Physician` e `BreadcrumbList`, ligados por identificadores absolutos. Serviço associado ao médico e às quatro cidades efetivamente informadas na página. Especialidade normalizada para `https://schema.org/Radiography`; removida desta página a propriedade `worksFor`, inadequada para o tipo organizacional `Physician` e que apontava para uma entidade ausente do grafo. Nenhum preço, avaliação ou credencial inventado.
- Componentes compartilhados receberam parâmetros opcionais; as outras páginas mantêm os valores anteriores.

## Indexação e metadados

- Publicação consultada: HTTP 200; canonical autorreferente `https://www.victormol.com.br/ultrassonografia-domiciliar/`; meta robots `index, follow, max-image-preview:large`; sem `X-Robots-Tag` bloqueando indexação.
- `robots.txt` publicado: HTTP 200, `Allow: /`, referência ao sitemap. Índice de sitemap publicado: HTTP 200, apontando para `sitemap-0.xml`.
- Build local: URL presente no sitemap XML; um único H1; canonical, robots, Open Graph e imagem social conferidos. Title e description aprovados foram preservados.
- Todos os 22 elementos `img` do HTML têm ALT e dimensões. Imagem informativa com ALT descritivo; imagens decorativas com ALT vazio. Não houve adição de palavras-chave aos ALTs.
- Nenhuma rota antiga equivalente localizada no código ou no histórico Git disponível. Nenhum redirect arbitrário criado. Redirecionamentos externos ao repositório e URLs legadas desconhecidas não puderam ser auditados.
- Acesso HTTP e ausência de bloqueios tornam a página rastreável; não comprovam inclusão no índice. Confirmação de indexação e canonical escolhido pelo Google requerem Search Console.

## FAQ

FAQ visual preservado; não foi adicionado `FAQPage` para rich results. A documentação atual do Google informa que os resultados enriquecidos de FAQ deixaram de aparecer em 7/05/2026 e que a documentação correspondente foi removida em junho.

Fonte: https://developers.google.com/search/updates

## Analytics

Não foram encontrados scripts de GA4/GTM ou IDs configurados no código inspecionado e no HTML gerado. A consulta ao HTML publicado também não encontrou IDs de GA4/GTM. Nenhuma integração foi removida, substituída ou criada. Injeções por configuração externa de hospedagem/contêiner não foram verificadas com acesso administrativo.

## Desempenho mobile

Lighthouse 13.5.0, build de produção servido localmente, perfil mobile padrão, em 22/09/2026. Resultado final:

| Métrica | Resultado |
| --- | --- |
| Performance | 96/100 |
| SEO automatizado | 100/100 |
| LCP | 2,8 s |
| CLS | 0,008 |
| Total Blocking Time | 0 ms |
| First Contentful Paint | 0,9 s |

São medições de laboratório, sujeitas a variação. O LCP ainda está acima da referência de 2,5 s; não se afirma aprovação nos Core Web Vitals. INP e resultados de usuários reais não foram medidos; exigem CrUX/Search Console ou coleta em produção. TBT não substitui INP.

O Lighthouse ainda aponta a imagem compartilhada do logotipo e CSS como oportunidades. Não houve alteração desses recursos visuais globais nesta revisão. A imagem principal já não baixa a versão original no perfil testado. HTML de aproximadamente 53 KB, com estimativa gzip de 11 KB; essa estimativa não prova a compressão configurada na hospedagem.

Fontes: https://web.dev/articles/lcp e https://developers.google.com/search/docs/appearance/core-web-vitals

## Validação

- `npm run build`: concluído.
- `node scripts/audit-domiciliary-seo.mjs`: aprovado (H1, canonical, robots, sitemap, OG, grafo JSON-LD, ALT, dimensões e prioridade da imagem).
- Relatório de laboratório: `docs/ultrassonografia-domiciliar-lighthouse.json`.
- As alterações estão no projeto local; nenhum deploy foi executado nesta tarefa.
