# 🎥 Guia do Vídeo de Apresentação - Seção CTA

## 📍 Localização

O vídeo de apresentação foi adicionado na **seção CTA** (Call-to-Action), logo **acima dos botões** "Começar Teste Grátis Agora" e "Acessar Demo do App".

**Arquivo:** `index.html`
**Linhas:** 2058-2070

---

## 🎨 Design e Características

### **Visual**
- ✅ Container responsivo com **aspect ratio 16:9**
- ✅ Borda arredondada (20px) com **efeito gradiente** (#667eea → #764ba2)
- ✅ Sombra elegante com **hover effect** (elevação)
- ✅ Máximo de **800px de largura** (centralizado)
- ✅ **Lazy loading** ativado para performance

### **Animações**
- ✅ **Fade-up** ao aparecer (AOS animation)
- ✅ **Hover effect** com elevação e sombra aumentada
- ✅ Transições suaves (0.3s)

### **Responsivo**
- Desktop: 800px de largura máxima
- Mobile: Adapta-se à tela com padding lateral reduzido
- Bordas arredondadas ajustadas para mobile (15px)

---

## 🔧 Como Configurar o Vídeo

### **1. Vídeo do YouTube**

No arquivo `index.html`, linha **2062**, substitua `VIDEO_ID_AQUI` pelo ID do seu vídeo:

```html
<iframe
  src="https://www.youtube.com/embed/SEU_VIDEO_ID"
  title="Vídeo de Apresentação - Sophos Academy"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  loading="lazy">
</iframe>
```

**Como encontrar o ID do vídeo:**
- URL do YouTube: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- ID é: `dQw4w9WgXcQ`
- URL final: `https://www.youtube.com/embed/dQw4w9WgXcQ`

### **2. Vídeo do Vimeo**

Se preferir Vimeo, substitua o iframe por:

```html
<iframe
  src="https://player.vimeo.com/video/SEU_VIDEO_ID"
  title="Vídeo de Apresentação - Sophos Academy"
  frameborder="0"
  allow="autoplay; fullscreen; picture-in-picture"
  allowfullscreen
  loading="lazy">
</iframe>
```

### **3. Vídeo Local (MP4)**

Para usar um vídeo hospedado localmente:

```html
<div class="cta-video-wrapper">
  <video
    controls
    poster="assets/img/video-thumbnail.jpg"
    preload="metadata">
    <source src="assets/videos/apresentacao.mp4" type="video/mp4">
    Seu navegador não suporta vídeos HTML5.
  </video>
</div>
```

**E adicione este CSS:**

```css
.cta-video-wrapper video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 17px;
  object-fit: cover;
}
```

---

## 🎬 Opções Avançadas do YouTube

### **Autoplay (não recomendado para UX)**

```html
src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1"
```

### **Esconder controles**

```html
src="https://www.youtube.com/embed/VIDEO_ID?controls=0"
```

### **Loop infinito**

```html
src="https://www.youtube.com/embed/VIDEO_ID?loop=1&playlist=VIDEO_ID"
```

### **Iniciar em tempo específico** (ex: 30 segundos)

```html
src="https://www.youtube.com/embed/VIDEO_ID?start=30"
```

### **Combinação de parâmetros**

```html
src="https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1&showinfo=0"
```

Parâmetros:
- `rel=0` - Não mostrar vídeos relacionados no final
- `modestbranding=1` - Esconder logo do YouTube
- `showinfo=0` - Esconder informações do vídeo

---

## 📐 Estrutura HTML Completa

```html
<!-- Video Container -->
<div class="cta-video-container" data-aos="fade-up" data-aos-delay="450">
  <div class="cta-video-wrapper">
    <iframe
      src="https://www.youtube.com/embed/VIDEO_ID_AQUI"
      title="Vídeo de Apresentação - Sophos Academy"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy">
    </iframe>
  </div>
</div>
```

---

## 🎨 CSS Aplicado

### **Container Principal**

```css
.cta-video-container {
  margin: 50px auto 40px;
  max-width: 800px;
  padding: 0 20px;
}
```

### **Wrapper Responsivo**

```css
.cta-video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 3px solid transparent;
  background-clip: padding-box;
  transition: all 0.3s ease;
}
```

### **Hover Effect**

```css
.cta-video-wrapper:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 70px rgba(102, 126, 234, 0.3);
}
```

### **Iframe**

```css
.cta-video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 17px;
}
```

---

## 📱 CSS Responsivo (Mobile)

```css
@media (max-width: 768px) {
  .cta-video-container {
    margin: 30px auto 30px;
    padding: 0 15px;
  }

  .cta-video-wrapper {
    border-radius: 15px;
  }

  .cta-video-wrapper iframe {
    border-radius: 12px;
  }
}
```

---

## 💡 Dicas de Uso

### **1. Duração Ideal do Vídeo**
- ✅ **30-90 segundos** para apresentação rápida
- ✅ **2-3 minutos** para demonstração completa
- ❌ Evitar vídeos longos (>5min) na seção CTA

### **2. Conteúdo Recomendado**
- 📱 Demo do aplicativo em ação
- 👤 Depoimento de aluno aprovado
- 🎓 Overview da metodologia
- 🚀 Principais benefícios em ação

### **3. Qualidade do Vídeo**
- ✅ Mínimo: **720p (HD)**
- ✅ Recomendado: **1080p (Full HD)**
- ✅ Proporção: **16:9** (widescreen)

### **4. Performance**
- ✅ Sempre use `loading="lazy"`
- ✅ Prefira YouTube/Vimeo (CDN otimizado)
- ✅ Se usar vídeo local, comprima com H.264

---

## 🔍 Testes Recomendados

### **1. Responsividade**
```
- [ ] Desktop (1920px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] Mobile landscape
```

### **2. Navegadores**
```
- [ ] Chrome
- [ ] Safari
- [ ] Firefox
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)
```

### **3. Performance**
```
- [ ] Vídeo carrega apenas quando visível (lazy loading)
- [ ] Hover effect suave (sem lag)
- [ ] Animação AOS funciona corretamente
```

---

## 🎯 Exemplo de Implementação Completa

### **YouTube com configurações otimizadas:**

```html
<div class="cta-video-container" data-aos="fade-up" data-aos-delay="450">
  <div class="cta-video-wrapper">
    <iframe
      src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
      title="Vídeo de Apresentação - Sophos Academy"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy">
    </iframe>
  </div>
</div>
```

---

## 📊 Antes vs Depois

### **Antes:**
```
[Features Grid]
↓
[Botões CTA]
```

### **Depois:**
```
[Features Grid]
↓
[🎥 VÍDEO DE APRESENTAÇÃO] ← NOVO!
↓
[Botões CTA]
```

---

## ✅ Checklist de Configuração

```
- [ ] Substituir VIDEO_ID_AQUI pelo ID real
- [ ] Testar vídeo em diferentes dispositivos
- [ ] Verificar se lazy loading está ativo
- [ ] Confirmar aspect ratio 16:9
- [ ] Testar hover effect
- [ ] Verificar responsividade mobile
- [ ] Confirmar que vídeo não auto-play (melhor UX)
```

---

## 🚀 Performance

**Impacto estimado:**
- ✅ Lazy loading reduz carga inicial
- ✅ YouTube/Vimeo CDN = loading rápido
- ✅ GPU acceleration no hover effect
- ✅ Sem impacto negativo no Lighthouse score

---

## 🎨 Customizações Opcionais

### **Mudar cores do gradiente:**

```css
.cta-video-wrapper {
  background: linear-gradient(135deg, #42b983 0%, #667eea 100%);
}
```

### **Aumentar tamanho máximo:**

```css
.cta-video-container {
  max-width: 1000px; /* Era 800px */
}
```

### **Mudar proporção (4:3):**

```css
.cta-video-wrapper {
  padding-bottom: 75%; /* Era 56.25% (16:9) */
}
```

---

**Criado por:** Claude (Anthropic)
**Data:** 2025-11-23
**Versão:** 1.0
**Status:** ✅ Implementado e funcionando

---

## 📞 Próximos Passos

1. **Gravar vídeo de apresentação** (30-90 segundos)
2. **Fazer upload no YouTube** (ou Vimeo)
3. **Pegar ID do vídeo**
4. **Substituir VIDEO_ID_AQUI** no index.html
5. **Testar em diferentes dispositivos**
6. **Publicar! 🚀**
