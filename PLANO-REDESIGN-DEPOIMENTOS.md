# Plano de Redesign — Seção de Depoimentos
### Sophos Academy · Simplificação, Estética e Profissionalismo

---

## Visão Geral do Diagnóstico

A seção de depoimentos está **tecnicamente funcional**, mas sofre de:
- **Excesso de complexidade visual** — efeitos que competem entre si e distraem do conteúdo
- **3 sistemas CSS paralelos** com variáveis duplicadas (`--hub-*`, `--tv-*`, `--testimonial-*`)
- **~400+ linhas de CSS morto** que nunca são renderizadas
- **3 inicializadores Swiper** para 1 carrossel (bug de dupla inicialização)
- **573 linhas de CSS** só para o componente de navegação prev/next na página individual
- **JavaScript que não encontra seus alvos** (seletores apontam para classes inexistentes)
- **Inconsistência visual** entre as 3 páginas (index, hub, view)

O redesign propõe **subtrair** para chegar a algo mais limpo, coeso e profissional.

---

## 1. Arquitetura CSS — Unificação

### O que temos hoje (3 arquivos, 3 sistemas)

| Arquivo | Linhas | Variáveis | Usado em |
|---------|--------|-----------|----------|
| `testimonials-premium.css` | 625 | `--testimonial-*` | index.html |
| `testimonials-hub.css` | 980 | `--hub-*` | testimonials.html |
| `testimonial-view-redesign.css` | 1.435 | `--tv-*` | video-testimonial-view.html |
| **Total** | **3.040** | **3 conjuntos** | — |

### O que faremos: 1 arquivo, 1 sistema

Criar **`testimonials.css`** unificado com:

```css
:root {
  --dp-primary: #42b983;
  --dp-primary-dark: #38a169;
  --dp-bg: #000000;
  --dp-card-bg: #0a0a0a;
  --dp-card-bg-alt: #111111;
  --dp-text: #ffffff;
  --dp-text-muted: #b0b0b0;
  --dp-border: rgba(66, 185, 131, 0.15);
  --dp-radius: 16px;
  --dp-radius-sm: 8px;
  --dp-shadow: 0 4px 20px rgba(0,0,0,0.4);
  --dp-transition: all 0.3s ease;
}
```

**Meta:** reduzir de ~3.040 linhas para ~800–1.000 linhas (eliminando CSS morto, duplicado e over-engineered).

### CSS morto a remover

| Seletor | Arquivo | Motivo |
|---------|---------|--------|
| `.hero-stats`, `.hero-stat`, `.stat-icon/number/label` | hub.css | HTML inexistente |
| `.loading-skeleton`, `@keyframes shimmer` | hub.css | HTML inexistente |
| `.tv-related`, `.tv-related-header`, `.tv-related-swiper`, etc. | view.css | ~150 linhas, HTML inexistente |
| `.tv-section-header-center` | view.css | Classe não usada |
| Navbar duplicada | view.css | Cópia literal do hub.css |
| `.testimonial-carousel`, `.testimonial-mini-*` | premium.css | HTML inexistente |
| `[data-theme="dark"]` bloco | premium.css | Idêntico ao `:root` |
| `.category-vestibular/faculdade/metodologia` | hub.css + view.css | Categorias que não existem |
| Regras `.testimonials` legadas | main.css | Padrão de HTML antigo |

**Estimativa: ~400+ linhas de CSS eliminadas sem nenhum efeito visual.**

---

## 2. Carrossel na Homepage (index.html)

### O que manter
- Layout de cards em Swiper com 1→2→3 colunas
- Design dark com cards arredondados
- Foto do aluno + nome + depoimento + conquista
- Botão "Ver todos os depoimentos"
- Animação sutil de entrada (fade-up via AOS)

### O que remover

| Elemento | Motivo |
|----------|--------|
| `::before` e `::after` com `@keyframes floatBg` | Backgrounds flutuantes de 20s/25s — imperceptíveis (3% opacidade) mas gastam GPU |
| `verified-badge` com `animation: pulse 2s infinite` | Badge pulsando infinitamente é inquieto e não transmite confiança |
| `testimonial-stats-badge` ("Baseado em neurociência", "IA adaptativa") | Parece marketing genérico, não prova social. Depoimentos devem falar por si |
| `testimonial-counter` hardcoded ("10.000+", "+150%") | Números falsos/genéricos. PureCounter carregado mas não usado. Remover ou substituir por dados reais |
| Vídeo inline no card da Laura | Quebra a consistência visual — todos os outros cards são texto. O vídeo deve estar na página individual |
| Modal estático `#testimonialVideoModal` (5 iframes vazios) | HTML morto, nunca aberto. ~20 linhas de DOM inútil |
| `openTestimonialVideo()` / `closeTestimonialVideo()` no main.js | ~110 linhas de JS morto |
| Segundo inicializador Swiper (`depoimentos-fix.js` vs `main.js`) | Bug de dupla inicialização. Manter apenas um |

### O que simplificar

**Card atual:**
```
┌─────────────────────────┐
│  ★★★★★                  │
│  "Texto do depoimento   │
│   longo..."             │
│                         │
│  ┌──────────────────┐   │
│  │  VÍDEO (só Laura)│   │  ← inconsistente
│  └──────────────────┘   │
│                         │
│  [🏆 Conquista tag]     │
│  [🏆 Conquista tag]     │
│                         │
│  ○ Nome                 │
│    Instituição          │
│  [Ver depoimento →]     │
└─────────────────────────┘
```

**Card proposto:**
```
┌─────────────────────────┐
│                         │
│  "Texto do depoimento   │
│   conciso e impactante" │
│                         │
│  ───────                │
│                         │
│  ○ Nome Sobrenome       │
│    Aprovada em [local]  │
│                         │
│  [Ver história →]       │
└─────────────────────────┘
```

**Mudanças no card:**
- Remover estrelas (★★★★★) — todos são 5/5, não agrega informação
- Remover tags de conquista redundantes (a conquista já está no texto e no subtítulo)
- Remover vídeo inline da Laura
- Manter foto + nome + instituição + link para página individual
- Texto mais curto e direto (2-3 frases no máximo)
- Border sutil com `var(--dp-border)` ao invés de gradient borders
- Hover: elevação suave (shadow + translateY) — sem scale, sem glow excessivo

### Contador — substituir ou remover

**Opção A (recomendada): Remover totalmente**
Os números "10.000+" e "+150%" não são verificáveis e enfraquecem a credibilidade.

**Opção B: Substituir por dados reais simples**
```
6 histórias reais · 100% aprovação · Residência médica
```
Uma linha discreta, sem animação de contagem.

---

## 3. Página Hub (testimonials.html)

### O que manter
- Hero com título e descrição
- Grid de cards com thumbnails
- Link para página individual de cada depoimento
- CTA no final
- Design dark consistente

### O que remover

| Elemento | Motivo |
|----------|--------|
| Sistema de filtros (pills + search) | 100% dos depoimentos são "Residência". Filtros sem utilidade = ruído visual |
| `featured-testimonial` (card destaque gigante) | Prioriza arbitrariamente 1 depoimento. Em 6 total, todos merecem igual destaque |
| Badges de categoria coloridos (rosa/magenta) | Cor rosa `#f093fb → #f5576c` destoa completamente do verde da marca |
| Duplicação de foto (Júlia aparece 2x no featured card) | Imagem repetida na mesma viewport |
| AOS duplicado (init com duration 800, main.js usa 600) | Duas configs conflitantes |

### O que simplificar

**Layout atual:**
```
[HERO grandioso]
[FILTROS sticky - Todos | Residência]
[SEARCH input]
[═══ FEATURED CARD gigante (metade da tela) ═══]
[Card] [Card] [Card]
[Card] [Card]
[CTA com pattern SVG]
```

**Layout proposto:**
```
[Hero limpo — título + subtítulo]
[Card] [Card] [Card]
[Card] [Card] [Card]
[CTA simples]
```

**Detalhamento do novo card do hub:**
```
┌───────────────────────┐
│  ┌─────────────────┐  │
│  │   THUMBNAIL     │  │
│  │   (foto/video)  │  │
│  │      ▶          │  │
│  └─────────────────┘  │
│                       │
│  Nome Sobrenome       │
│  Aprovada · Hospital  │
│                       │
│  "Trecho curto do     │
│   depoimento..."     │
│                       │
│  Ver história →       │
└───────────────────────┘
```

- Grid uniforme: `repeat(auto-fill, minmax(340px, 1fr))` — sem card "featured"
- Todos os 6 cards com o mesmo layout e tamanho
- Thumbnail com overlay discreto e play icon centralizado
- Sem badges de categoria (desnecessário com uma só categoria)
- Hover: shadow mais forte + thumbnail com leve scale (1.03, não 1.1)

### Navbar
Manter navbar simples atual (já refatorada para classes CSS). Unificar no CSS único.

---

## 4. Página Individual (video-testimonial-view.html)

Esta é a página que mais precisa de simplificação. Atualmente tem **1.435 linhas de CSS** sendo que ~573 são só para a navegação prev/next.

### O que manter
- Player de vídeo nativo (bom para performance)
- Informações do aluno (foto, nome, curso)
- Conteúdo textual (história, quote, timeline)
- Cards de resultados (estatísticas)
- Navegação entre depoimentos

### O que remover

| Elemento | Linhas CSS | Motivo |
|----------|-----------|--------|
| `tv-nav-ultra` inteiro | 573 | Over-engineered: spinning rings, shine sweeps, blur on hover, glow — para 3 links |
| `@keyframes spin` (3s) no avatar ring | — | Anel giratório no hover é distrativo |
| `@keyframes spin-slow` (10s) no center | — | Anel tracejado girando permanentemente |
| Shine sweep animation nos cards | — | Efeito "brilho passando" é genérico demais |
| Blur do background image no hover | — | Borrar a foto da pessoa no hover é contra-intuitivo |
| `#shareToast` | JS+HTML | Toast sem botão que o dispare |
| `videoId` (YouTube) nos dados | JS | Campo nunca usado — player é `<video>` nativo |
| Seção `.tv-related` no CSS | ~150 | HTML inexistente |
| `setupVideoControls()` no JS | ~40 | Busca `.video-container`, classe real é `.tv-video-container` |
| `initRelatedCards()` no JS | ~25 | `.related-card` não existe |
| Social share listener no JS | ~5 | `.social-share` não existe |

### Navegação prev/next — redesign radical

**Atual (573 linhas de CSS):**
```
┌──────────────────────────────────────────────┐
│  ← Anterior          ● 6       Próximo →     │
│  ┌────────────┐   ┌──────┐   ┌────────────┐  │
│  │ BG BLUR    │   │SPIN  │   │ BG BLUR    │  │
│  │ GRADIENT   │   │RING  │   │ GRADIENT   │  │
│  │ SHINE      │   │DASH  │   │ SHINE      │  │
│  │ ◯ GLOW     │   │      │   │ ◯ GLOW     │  │
│  │ Nome       │   │ Ver  │   │ Nome       │  │
│  │ "Título"   │   │todos │   │ "Título"   │  │
│  │ [Ler →]    │   │      │   │ [Ler →]    │  │
│  └────────────┘   └──────┘   └────────────┘  │
└──────────────────────────────────────────────┘
```

**Proposto (~60 linhas de CSS):**
```
┌──────────────────────────────────────────────┐
│                                              │
│  ← Anterior                    Próximo →     │
│                                              │
│  ○ Nome                        Nome ○        │
│    Instituição                 Instituição   │
│                                              │
│              Ver todos (6)                   │
│                                              │
└──────────────────────────────────────────────┘
```

- Sem background images, sem blur, sem shine, sem glow, sem spinning rings
- Layout flexbox simples: prev | center | next
- Avatar pequeno (40px) + nome + instituição
- Link "Ver todos" centralizado apontando para o hub
- Hover: cor do texto muda para `--dp-primary`, underline sutil
- **Redução: ~573 → ~60 linhas de CSS**

### Layout de conteúdo — simplificação

**Atual:**
```
[VIDEO full-width, border-radius 24px, shadow 80px]
[  MAIN (60%)          |  SIDEBAR sticky (380px)  ]
[  Author card         |  Results card             ]
[  Story card          |  CTA card                 ]
[  Timeline card       |                           ]
[NAV ULTRA]
```

**Proposto:**
```
[VIDEO full-width, border-radius 16px, shadow moderado]
[  MAIN (65%)          |  SIDEBAR (35%)            ]
[  Author info         |  Resultados               ]
[  História            |  CTA (agendar)            ]
[  Timeline            |                           ]
[NAV simples prev/next]
```

Mudanças:
- `border-radius: 24px` → `16px` (consistente com o resto do site)
- Shadow do vídeo: `0 25px 80px` → `0 8px 30px` (menos dramático)
- Sidebar: `380px` fixo → `35%` (mais responsivo)
- Cards internos: remover os ícones decorativos dos headers (📖 🎯 etc.) — usar apenas tipografia
- Timeline: manter, mas simplificar dots (sem ícones hidden, sem fade de siblings no hover)
- Quote: manter bloco de citação, mas sem ícone SVG gigante — usar `border-left: 3px solid var(--dp-primary)` clássico

---

## 5. JavaScript — Limpeza e Unificação

### Arquivos atuais

| Arquivo | Linhas | Função real |
|---------|--------|------------|
| `depoimentos-fix.js` | 37 | Init Swiper (duplicado) |
| `testimonial-animations.js` | 200 | ~40 linhas úteis, resto morto |
| `main.js` (seção testimonials) | ~130 | Init Swiper (duplicado) + modal morto |

### Plano

**Remover completamente:**
- `depoimentos-fix.js` — duplica o que `main.js` já faz
- `openTestimonialVideo()` + `closeTestimonialVideo()` do `main.js` (~110 linhas)
- `initTestimonialsSlider()` do `main.js` (~40 linhas — `.testimonial-slider` não existe)
- `setupImpactCarousel()` do `main.js` (~60 linhas — `.impact-carousel` não existe)
- `setupVideoControls()` do `testimonial-animations.js` (~40 linhas — seletor errado)
- `initRelatedCards()` do `testimonial-animations.js` (~25 linhas — classe inexistente)
- Social share listener do `testimonial-animations.js` (~5 linhas — classe inexistente)

**Simplificar:**
- `testimonial-animations.js` → manter apenas `initAnimations()` com counter animation (útil para a view page)
- `main.js` → manter um único `initTestimonialsCarousel()` limpo

**Inline script da view page:**
- Remover campo `videoId` de todos os 6 objetos (YouTube nunca usado)
- Mover array de dados para um arquivo `testimonials-data.js` compartilhado (prep para futuro)

**Resultado estimado: ~250 linhas de JS removidas.**

---

## 6. HTML — Limpeza

### index.html

| Ação | Detalhe |
|------|---------|
| Remover modal `#testimonialVideoModal` | 20 linhas de HTML morto |
| Remover `testimonial-stats-badge` | Marketing genérico ("IA adaptativa") |
| Remover `testimonial-counter` | Números não verificáveis |
| Remover vídeo inline do card Laura | Inconsistência visual |
| Remover estrelas `★★★★★` dos cards | Todos 5/5, sem variação = sem informação |
| Remover tags de conquista redundantes | Informação já no subtítulo |
| Simplificar classe da section | `depoimentos-section` apenas (remover `.testimonials` legado) |

### testimonials.html

| Ação | Detalhe |
|------|---------|
| Remover filtros (pills + search) | Sistema sem função com 1 categoria |
| Remover featured card | Igualar peso de todos os 6 depoimentos |
| Unificar grid para 6 cards iguais | `repeat(auto-fill, minmax(340px, 1fr))` |
| Simplificar CTA | Remover SVG pattern overlay |

### video-testimonial-view.html

| Ação | Detalhe |
|------|---------|
| Substituir `tv-nav-ultra` | Nav simples com ~20 linhas de HTML |
| Remover `#shareToast` | Toast sem trigger |
| Simplificar quote (sem ícone SVG) | `border-left` clássico |
| Unificar footer (dados inconsistentes) | Mesmo endereço/cor que o hub |

---

## 7. Decisões de Design

### Paleta final (unificada)

| Uso | Valor |
|-----|-------|
| Primary (verde) | `#42b983` |
| Primary dark | `#38a169` |
| Background | `#000000` |
| Card background | `#0a0a0a` |
| Card alt | `#111111` |
| Texto principal | `#ffffff` |
| Texto secundário | `#b0b0b0` |
| Border | `rgba(66, 185, 131, 0.15)` |
| Gradient | `135deg, #42b983 → #38a169` |

### Tipografia
- Manter a família atual (Poppins/Inter do template)
- **Reduzir tamanhos de heading** — `3.5rem` no hero do hub é grande demais, propor `2.5rem`
- Consistência de `letter-spacing` e `line-height` entre páginas

### Espaçamento
- Padding de seção: `80px 0` (consistente, ao invés de 100px no premium e 80px no hub)
- Gap do grid: `24px` (ao invés de 30px — mais limpo)
- Border-radius: `16px` para cards, `8px` para elementos internos (ao invés de misturar 16/20/24px)

### Animações — regra de ouro
**Máximo 1 animação por elemento. Nenhuma animação infinita.**

| Permitido | Proibido |
|-----------|----------|
| `fade-up` na entrada (AOS, 1x) | `pulse` infinito no verified badge |
| `translateY(-4px)` no hover | `spin`/`spin-slow` permanente |
| `box-shadow` transition no hover | `floatBg` 20s/25s loop |
| Counter animation (1x, na view) | Shine sweep no hover |
| Swiper slide transition | Scale + blur + glow simultâneos |

### Hover states — simplificação

**Card hover (todas as páginas):**
```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(66, 185, 131, 0.15);
  border-color: rgba(66, 185, 131, 0.3);
}
```
Apenas isso. Sem scale na thumbnail, sem glow, sem mudança de cor de fundo.

---

## 8. Ordem de Execução

### Fase 1 — Fundação CSS (~30 min)
1. Criar `assets/css/testimonials.css` unificado
2. Migrar regras úteis dos 3 arquivos, usando variáveis `--dp-*`
3. Eliminar todo CSS morto
4. Simplificar a navegação da view page (573 → ~60 linhas)

### Fase 2 — Homepage (index.html) (~20 min)
1. Remover modal morto, stats badge, counter, estrelas
2. Remover vídeo inline da Laura
3. Simplificar cards (menos tags, menos decoração)
4. Apontar para novo `testimonials.css`
5. Remover `testimonials-premium.css` do `<head>`

### Fase 3 — Hub (testimonials.html) (~20 min)
1. Remover filtros e search
2. Remover featured card — grid uniforme com 6 cards
3. Simplificar CTA
4. Apontar para novo `testimonials.css`
5. Remover `testimonials-hub.css` do `<head>`

### Fase 4 — View (video-testimonial-view.html) (~25 min)
1. Substituir nav ultra por nav simples
2. Remover shareToast, simplificar quote
3. Unificar footer
4. Apontar para novo `testimonials.css`
5. Remover `testimonial-view-redesign.css` do `<head>`

### Fase 5 — JavaScript (~15 min)
1. Remover `depoimentos-fix.js` (ref no HTML também)
2. Limpar `main.js` (remover funções mortas)
3. Limpar `testimonial-animations.js` (remover funções com seletores errados)
4. Remover campo `videoId` dos dados da view page

### Fase 6 — QA (~10 min)
1. Verificar todos os links entre páginas
2. Verificar responsividade (mobile/tablet/desktop)
3. Verificar que nenhum seletor CSS ficou órfão
4. Grep por referências aos arquivos CSS/JS removidos

---

## 9. Métricas Esperadas

| Métrica | Antes | Depois | Redução |
|---------|-------|--------|---------|
| Linhas de CSS (depoimentos) | ~3.040 | ~800–1.000 | **~67%** |
| Arquivos CSS | 3 | 1 | **67%** |
| Linhas de JS removidas | — | ~250 | — |
| Arquivos JS | 3 (depoimentos-fix, animations, main) | 2 (animations, main) | **33%** |
| Animações infinitas | 4 (pulse, spin, spin-slow, floatBg) | 0 | **100%** |
| CSS morto | ~400+ linhas | 0 | **100%** |
| JS morto | ~250+ linhas | 0 | **100%** |
| Variáveis duplicadas | 3 conjuntos | 1 conjunto | **67%** |

---

## 10. O Que NÃO Será Alterado

- Conteúdo textual dos depoimentos (textos, nomes, instituições)
- Fotos e vídeos existentes
- URLs das páginas
- Estrutura de navegação do site (menu principal)
- Footer do site principal
- Funcionalidade do Swiper (carrossel continua funcionando)
- Funcionalidade de navegação entre depoimentos na view
- AOS para animações de entrada (mantido, unificado para duration: 600)
- Player de vídeo nativo (sem mudar para YouTube/embed)

---

## Resumo Visual

```
ANTES                              DEPOIS
─────                              ──────
3 arquivos CSS (3.040 linhas)  →   1 arquivo CSS (~900 linhas)
3 sistemas de variáveis        →   1 sistema (--dp-*)
573 linhas de nav ultra        →   60 linhas de nav simples
4 animações infinitas          →   0 animações infinitas
Filtros sem função             →   Sem filtros
Featured card privilegiado     →   Grid uniforme
Stars ★★★★★ decorativas       →   Sem stars
Counter com números falsos     →   Removido
Modal morto + JS morto         →   Limpo
Vídeo inline inconsistente     →   Vídeo só na view page
3 Swiper initializers          →   1 Swiper initializer
Badges rosa/magenta            →   Sem badges de categoria
```

**Filosofia: menos é mais. O conteúdo dos alunos reais é o protagonista — o design serve para apresentá-lo com clareza, não para competir com ele.**
