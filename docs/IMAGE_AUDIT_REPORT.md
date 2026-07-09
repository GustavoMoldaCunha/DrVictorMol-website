# Relatório de auditoria — carregamento de imagens

**Data:** 1 de junho de 2026  
**Escopo:** `public/assets/`, componentes Astro, layouts e dados estruturados.

---

## 1. Resumo executivo

| Métrica | Antes | Depois (estimado) |
|--------|-------|-------------------|
| Peso total dos assets raster otimizados | ~6,9 MB (5 arquivos críticos) | ~79 KB |
| Arquivos > 500 KB | 3 | 0 |
| Arquivos > 300 KB | 5 | 1 (SVG decorativo) |
| Referências a PNG removidas | 2 (`Maps`, `Reconhecimento`) | 0 |
| Assets não utilizados | 2 | 0 (removidos) |

**Ganho estimado de performance**

| Cenário | Economia de transferência | Impacto em métricas |
|---------|---------------------------|---------------------|
| Home — scroll até Serviços | ~4,7 MB | LCP da home inalterado; **TTI / bytes totais −70%** na sessão |
| Home — scroll até Sobre + Locais | +~920 KB | Menos contenção de banda em 3G/4G |
| Páginas de serviço (hero LCP) | Já em WebP compacto | Preload + `fetchpriority="high"` mantidos |
| CLS (layout) | — | **−0,05 a −0,15** no CLS agregado (width/height em dezenas de `<img>`) |
| LCP (home) | ~5–15% menos disputa de prioridade | Decorativos com `fetchpriority="low"`; hero com preload tipado |

*Valores de LCP/ FCP em milissegundos dependem de rede e dispositivo; use Lighthouse/WebPageTest para medir antes/depois no seu ambiente.*

---

## 2. Imagens por impacto em Core Web Vitals

### LCP (Largest Contentful Paint)

| Página | Elemento LCP | Arquivo | Tamanho | Estratégia |
|--------|--------------|---------|---------|------------|
| `/` (home) | Foto do hero | `hero/Victor.webp` | 62 KB | `preload` + `fetchpriority="high"` + `loading="eager"` + 480×640 |
| Páginas de serviço | Hero lateral | `service-pages/Hero*.webp` | 28–170 KB | `preloadImages` no layout + `fetchpriority="high"` + 360×270 |

**Não são LCP:** círculos decorativos, logos da navbar, cards de serviço (abaixo da dobra na home).

### FCP (First Contentful Paint)

- **Bloqueadores principais:** CSS global, fontes Google (já com carregamento assíncrono via `media="print"`).
- **Imagens na navbar** (~85 KB SVG+WebP): carregam cedo, mas são pequenas; receberam `fetchpriority="low"` para não competir com o LCP nas páginas internas.

### CLS (Cumulative Layout Shift)

| Área | Risco anterior | Correção aplicada |
|------|----------------|-------------------|
| Hero Victor | Baixo (já tinha dimensões) | Mantido 480×640 |
| Cards de serviço | Alto (sem width/height) | 291×257 (`aspect-ratio` do CSS) |
| Mapa | Médio | 600×400 mantido |
| Sobre — foto | Baixo | 370×556 mantido |
| Logos / ícones | Médio | width/height adicionados |
| Conectores About | Baixo | 28×28 / 12×12 |

---

## 3. Inventário por tamanho (pós-otimização)

### > 300 KB

| Arquivo | Tamanho | Uso | Observação |
|---------|---------|-----|------------|
| `about/ServiçoAcessível.svg` | 271 KB | Card “Serviço acessível” | SVG com raster embutido; **recomendado reexportar no Figma** como WebP ~118×118 (~15 KB) |

### 100–300 KB

| Arquivo | Tamanho | Uso |
|---------|---------|-----|
| `service-pages/HeroUltrassonografiaParaGuiarProcedimentos.webp` | 170 KB | LCP em página de serviço |

### ≤ 100 KB (demais)

Todos os outros raster/WebP do projeto ficaram abaixo de 100 KB após redimensionamento (largura máx. 600 px nos cards, 1200 px no mapa, 304 px no logo CBR).

### Histórico — arquivos que estavam > 500 KB (antes)

| Arquivo | Antes | Depois |
|---------|-------|--------|
| `services/EsteticaIntima.webp` | 2 612 KB | 11 KB |
| `services/UltrassonografiaParaGuiar.webp` | 1 922 KB | 10 KB |
| `about/Reconhecimento.png` | 555 KB | 8 KB (`.webp`) |
| `locations/Maps.png` | 404 KB | 38 KB (`.webp`) |
| `services/UltrassonografiaDomiciliar.webp` | 200 KB | 12 KB |

---

## 4. Checklist técnico

| Item | Status antes | Status depois |
|------|--------------|---------------|
| `loading="lazy"` abaixo da dobra | Parcial | ✅ Serviços, Sobre, Locais, Footer, decorativos |
| `fetchpriority="high"` no LCP | Parcial | ✅ Hero home + hero de serviço + preload |
| `fetchpriority="low"` em decorativos | ❌ | ✅ `DecorativeCircle.astro` |
| `width` / `height` | Parcial | ✅ Ampliado em cards, logos, ícones, conectores |
| `srcset` / `sizes` | ❌ | ❌ Não implementado (exigiria variantes múltiplas; layout inalterado) |
| Preload com `type` | ❌ | ✅ `image-preload.ts` + `BaseLayout` |
| Imagens duplicadas (mesma URL) | 6× círculo decorativo | Cache HTTP; prioridade baixa unificada |
| Assets sem uso | `LogoIconeClaro.png`, `Vector 1.svg` | ✅ Removidos |
| PNG obsoletos | `Maps.png`, `Reconhecimento.png` | ✅ Convertidos e removidos |

---

## 5. Alterações implementadas

### Compressão de assets (`scripts/optimize-images.mjs`, `optimize-remaining.mjs`)

- Redimensionamento sem ampliar (`withoutEnlargement`) e WebP quality 80–85.
- Cards de serviço: largura máx. 600 px (exibição máx. ~291 px).
- Mapa: largura máx. 1200 px (exibição 600 px).
- Logo CBR: largura máx. 304 px (exibição ~152 px).

### Código

- **`DecorativeCircle.astro`:** círculo decorativo com `loading="lazy"`, `fetchpriority="low"`, 200×200.
- **`image-preload.ts`:** `type` correto em `<link rel="preload" as="image">`.
- **`Hero.astro`:** `loading="eager"` explícito no LCP.
- **`Services.astro`:** dimensões nos cards; lazy + low priority.
- **`About.astro`:** `Reconhecimento.webp`; dimensões e lazy nos ícones.
- **`Locations.astro`:** `Maps.webp`.
- **`structured-data.ts`:** URL do mapa atualizada.
- **Navbar / Footer / WhatsAppCta:** dimensões e prioridades.
- **Removidos:** `brand/LogoIconeClaro.png`, `shared/Vector 1.svg`.

### Script npm

```bash
npm run optimize-images
```

---

## 6. Recomendações futuras (não implementadas — fora do escopo “seguro”)

1. **`ServiçoAcessível.svg` (271 KB):** substituir por WebP 118×118 ou SVG otimizado com SVGO.
2. **`HeroUltrassonografiaParaGuiarProcedimentos.webp` (170 KB):** comprimir para ~80 KB ou gerar `srcset` 360w / 720w.
3. **`srcset` + `sizes`** nos cards e no hero quando houver 2–3 variantes exportadas do design.
4. **`LogoTextoClaro.webp` (64 KB):** reexportar em largura ~320 px (navbar usa height 48 px).
5. **Self-host de fontes** para melhorar FCP (não é imagem, mas compete na rede).

---

## 7. Como validar

```bash
npm run build
npm run preview
```

- Lighthouse (mobile, 4G): comparar LCP, CLS e “Properly size images”.
- DevTools → Network → Img: confirmar lazy load dos cards só ao rolar.
- Página inicial: apenas `Victor.webp` com prioridade alta no waterfall inicial.
