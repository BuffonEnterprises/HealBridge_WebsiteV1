/**
 * Sophos Academy - JavaScript Otimizado
 * Versão: 2.0
 * Funcionalidades: Carrosséis, Formulários, Chatbot, Animações
 */

// ===== CONFIGURAÇÕES GLOBAIS =====
const SOPHOS_CONFIG = {
  swiper: {
    autoplayDelay: 4000,
    transitionSpeed: 800,
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 10 },
      576: { slidesPerView: 1.5, spaceBetween: 15 },
      768: { slidesPerView: 2.5, spaceBetween: 20 },
      992: { slidesPerView: 3.5, spaceBetween: 25 },
      1200: { slidesPerView: 3.5, spaceBetween: 30 }
    }
  },
  animations: {
    duration: 300,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  }
};

// ===== CLASSE PRINCIPAL =====
class SophosAcademy {
  constructor() {
    this.swipers = {};
    this.chatbot = null;
    this.observers = [];
    this.init();
  }

  init() {
    this.initEventListeners();
    this.initSwipers();
    this.initChatbot();
    this.initFormValidation();
    this.initAnimations();
    this.initLazyLoading();
    this.initAccessibility();
  }

  // ===== EVENT LISTENERS =====
  initEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.onDOMContentLoaded();
    });

    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));

    window.addEventListener('scroll', this.throttle(() => {
      this.handleScroll();
    }, 16));

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  onDOMContentLoaded() {
    this.updateSwipers();
    this.initSmoothScrolling();
    this.initNavigation();
    // Sophos Academy carregado com sucesso
  }

  // ===== CARROSSÉIS OTIMIZADOS =====
  initSwipers() {
    this.initFeatureSwiper();
    this.initTestimonialsSwiper();
  }

  initFeatureSwiper() {
    const container = document.querySelector('.feature-swiper');
    if (!container) return;

    // Destruir instância existente
    if (this.swipers.features) {
      this.swipers.features.destroy(true, true);
    }

    this.swipers.features = new Swiper(container, {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 20,
      loop: true,
      loopAdditionalSlides: 3,
      speed: SOPHOS_CONFIG.swiper.transitionSpeed,
      grabCursor: true,
      watchSlidesProgress: true,
      effect: "coverflow",
      coverflowEffect: {
        rotate: 5,
        stretch: 0,
        depth: 200,
        modifier: 1,
        slideShadows: true
      },
      autoplay: {
        delay: SOPHOS_CONFIG.swiper.autoplayDelay,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
        renderBullet: (index, className) => {
          return `<span class="${className}" aria-label="Slide ${index + 1}"></span>`;
        },
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: SOPHOS_CONFIG.swiper.breakpoints,
      on: {
        init: () => this.onSwiperInit(container),
        slideChange: () => this.onSwiperSlideChange(container),
        resize: () => this.onSwiperResize(container)
      }
    });

    this.setupSwiperObserver(container);
  }

  initTestimonialsSwiper() {
    const container = document.querySelector('.depoimentos-slider');
    if (!container) return;

    // Evitar inicialização duplicada (assets/js/main.js pode já ter inicializado)
    if (container.swiper) {
      this.swipers.testimonials = container.swiper;
      return;
    }

    this.swipers.testimonials = new Swiper(container, {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      speed: SOPHOS_CONFIG.swiper.transitionSpeed,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        type: 'bullets'
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 30 }
      }
    });
  }

  onSwiperInit(container) {
    const slides = container.querySelectorAll('.swiper-slide');
    slides.forEach((slide, index) => {
      slide.setAttribute('role', 'option');
      slide.setAttribute('aria-selected', 'false');
      
      setTimeout(() => {
        slide.style.opacity = "1";
        slide.style.transform = "translateY(0)";
      }, 100 * index);
    });
  }

  onSwiperSlideChange(container) {
    const slides = container.querySelectorAll('.swiper-slide');
    slides.forEach(slide => {
      slide.setAttribute('aria-selected', 
        slide.classList.contains('swiper-slide-active') ? 'true' : 'false');
    });
  }

  onSwiperResize(container) {
    if (container.swiper) {
      container.swiper.update();
    }
  }

  setupSwiperObserver(container) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const swiper = this.swipers.features;
        if (!swiper) return;

        if (entry.isIntersecting) {
          swiper.update();
          if (swiper.autoplay && !swiper.autoplay.running) {
            swiper.autoplay.start();
          }
        } else {
          if (swiper.autoplay && swiper.autoplay.running) {
            swiper.autoplay.stop();
          }
        }
      });
    }, { threshold: 0.1 });

    observer.observe(container);
    this.observers.push(observer);
  }

  updateSwipers() {
    Object.values(this.swipers).forEach(swiper => {
      if (swiper && swiper.update) {
        swiper.update();
      }
    });
  }

  // ===== CHATBOT INTELIGENTE =====
  initChatbot() {
    const openBtn = document.getElementById('open-chatbot');
    const closeBtn = document.getElementById('close-chatbot');
    const chatbot = document.getElementById('ai-chatbot');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-message');
    const messages = document.getElementById('chatbot-messages');

    if (!openBtn || !closeBtn || !chatbot) return;

    this.chatbot = {
      isOpen: false,
      messages: [],
      responses: this.getChatbotResponses()
    };

    openBtn.addEventListener('click', () => this.openChatbot());
    closeBtn.addEventListener('click', () => this.closeChatbot());
    
    if (form) {
      form.addEventListener('submit', (e) => this.handleChatbotMessage(e));
    }

    // Quick reply buttons
    this.initQuickReplies();

    // Auto-open após 30 segundos - DESABILITADO
    // setTimeout(() => {
    //   if (!this.chatbot.isOpen) {
    //     this.showChatbotNotification();
    //   }
    // }, 30000);
  }

  initQuickReplies() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-reply-btn')) {
        const message = e.target.getAttribute('data-message');
        if (message) {
          this.sendQuickReply(message);
        }
      }
    });
  }

  sendQuickReply(message) {
    const input = document.getElementById('chatbot-message');
    if (input) {
      input.value = message;
      const form = document.getElementById('chatbot-form');
      if (form) {
        form.dispatchEvent(new Event('submit'));
      }
    }
    
    // Ocultar quick replies após o primeiro uso
    const quickReplies = document.getElementById('quick-replies');
    if (quickReplies) {
      quickReplies.style.display = 'none';
    }
  }

  openChatbot() {
    const chatbot = document.getElementById('ai-chatbot');
    const openBtn = document.getElementById('open-chatbot');
    
    chatbot.style.display = 'block';
    openBtn.style.display = 'none';
    this.chatbot.isOpen = true;
    
    // Remover badge de notificação
    const badge = openBtn.querySelector('.chat-badge');
    if (badge) {
      badge.style.display = 'none';
    }
    
    // Animação de entrada
    chatbot.style.transform = 'translateY(20px)';
    chatbot.style.opacity = '0';
    
    requestAnimationFrame(() => {
      chatbot.style.transition = 'all 0.3s ease';
      chatbot.style.transform = 'translateY(0)';
      chatbot.style.opacity = '1';
    });

    // Focus no input
    const input = document.getElementById('chatbot-message');
    if (input) {
      setTimeout(() => input.focus(), 300);
    }
  }

  closeChatbot() {
    const chatbot = document.getElementById('ai-chatbot');
    const openBtn = document.getElementById('open-chatbot');
    
    chatbot.style.transition = 'all 0.3s ease';
    chatbot.style.transform = 'translateY(20px)';
    chatbot.style.opacity = '0';
    
    setTimeout(() => {
      chatbot.style.display = 'none';
      openBtn.style.display = 'block';
      this.chatbot.isOpen = false;
    }, 300);
  }

  handleChatbotMessage(e) {
    e.preventDefault();
    
    const input = document.getElementById('chatbot-message');
    const message = input.value.trim();
    
    if (!message) return;
    
    this.addChatbotMessage(message, 'user');
    input.value = '';
    
    // Mostrar indicador de digitação
    this.showTypingIndicator();
    
    // Simular digitação com delay variável baseado no tamanho da resposta
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.getChatbotResponse(message);
      this.addChatbotMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message typing-message';
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    typingDiv.id = 'typing-indicator-msg';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator-msg');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  addChatbotMessage(message, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    messageDiv.innerHTML = `
      <div class="message-content">${message}</div>
      <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Animação de entrada
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    
    requestAnimationFrame(() => {
      messageDiv.style.transition = 'all 0.3s ease';
      messageDiv.style.opacity = '1';
      messageDiv.style.transform = 'translateY(0)';
    });
  }

  getChatbotResponse(message) {
    const responses = this.chatbot.responses;
    const lowerMessage = message.toLowerCase();
    
    for (const [keywords, response] of Object.entries(responses)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return Array.isArray(response) ? 
          response[Math.floor(Math.random() * response.length)] : response;
      }
    }
    
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  }

  getChatbotResponses() {
    return {
      'quero conhecer os planos,ver planos,planos': [
        '📚 Temos 6 planos principais:\n\n' +
        '• Vestibular+ - Para estudantes de pré-vestibular\n' +
        '• Residente+ - Para preparação de residência médica\n' +
        '• University - Para acadêmicos de medicina\n' +
        '• Enterprise - Solução corporativa\n' +
        '• Custom - Personalizado para você\n' +
        '• Versão Teste - 7 dias grátis!\n\n' +
        'Qual deles te interessa mais? 😊'
      ],
      'como funciona a metodologia,metodologia': [
        '💡 Nossa metodologia é baseada em 3 pilares:\n\n' +
        '1️⃣ Revisão Espaçada - Sistema científico que otimiza a retenção de conhecimento\n' +
        '2️⃣ Second Brain - Organize todo seu conhecimento de forma eficiente\n' +
        '3️⃣ IA Personalizada - Algoritmos que adaptam seu estudo ao seu perfil\n\n' +
        'Nossa metodologia é baseada em estudos científicos com eficácia comprovada! Quer uma demonstração? 🎯'
      ],
      'preciso de suporte,suporte,ajuda': [
        '💬 Estamos aqui para ajudar!\n\n' +
        '📱 WhatsApp: (51) 99999-9999\n' +
        '📧 Email: contato@sophosacademy.com\n' +
        '⏰ Atendimento 24/7\n\n' +
        'Nossa equipe responde em até 2 horas! Qual sua dúvida específica?'
      ],
      'quero fazer um teste grátis,teste grátis,teste gratuito,trial': [
        '🎯 Ótima escolha! Nosso teste grátis inclui:\n\n' +
        '✅ 14 dias de acesso completo\n' +
        '✅ Todas as funcionalidades premium\n' +
        '✅ Suporte especializado\n' +
        '✅ Sem cartão de crédito\n' +
        '✅ Cancele quando quiser\n\n' +
        'Clique no botão "COMEÇAR TESTE GRÁTIS" no topo da página ou me diga seu email que te envio o link! 🚀'
      ],
      'preço,valor,custo,investimento': [
        'Nossos planos começam a partir de R$ 97/mês. Gostaria de conhecer as opções disponíveis?',
        'Temos diferentes planos para atender suas necessidades. Posso te mostrar as opções?'
      ],
      'vestibular,medicina,aprovação': [
        'Nosso Projeto Vestibular usa Active Recall e IA adaptativa! Quer saber mais sobre nossa metodologia?',
        'Preparação para medicina com metodologia científica comprovada. Como posso te ajudar?'
      ],
      'residência,especialização': [
        'O Projeto Residência Médica é nosso mais procurado! Tem alguma especialidade em mente?',
        'Nossa metodologia para residência médica é baseada em neurociência. Quer conhecer os diferenciais?'
      ],
      'contato,falar,conversar': [
        'Você pode falar conosco pelo WhatsApp (51) 99999-9999 ou email contato@sophosacademy.com',
        'Nossa equipe está disponível para te atender. Prefere WhatsApp ou email?'
      ],
      'obrigado,obrigada,valeu': [
        'Por nada! Estou aqui para ajudar. Tem mais alguma dúvida? 😊',
        'Fico feliz em ajudar! Precisa de mais alguma informação? 🎓'
      ],
      'default': [
        'Interessante! Pode me contar mais sobre o que você está procurando?',
        'Entendi. Como posso te ajudar especificamente com seus estudos?',
        'Ótima pergunta! Nosso time pode te dar mais detalhes. Quer que eu te conecte com um consultor?',
        'Vou anotar sua dúvida. Enquanto isso, que tal conhecer nossos casos de sucesso?'
      ]
    };
  }

  showChatbotNotification() {
    const openBtn = document.getElementById('open-chatbot');
    if (!openBtn) return;

    // Criar notificação
    const notification = document.createElement('div');
    notification.className = 'chatbot-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <p>👋 Olá! Precisa de ajuda com seus estudos?</p>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    openBtn.parentElement.appendChild(notification);
    
    // Remover após 10 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }

  // ===== VALIDAÇÃO DE FORMULÁRIOS =====
  initFormValidation() {
    const forms = document.querySelectorAll('.php-email-form');
    forms.forEach(form => this.setupFormValidation(form));
  }

  setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let message = '';

    // Validações específicas
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          message = 'Por favor, insira um email válido';
        }
        break;
      case 'text':
        if (field.name === 'name' && value.length < 2) {
          isValid = false;
          message = 'Nome deve ter pelo menos 2 caracteres';
        }
        break;
      case 'textarea':
        if (value.length < 10) {
          isValid = false;
          message = 'Mensagem deve ter pelo menos 10 caracteres';
        }
        break;
    }

    // Verificar se é obrigatório
    if (field.required && !value) {
      isValid = false;
      message = 'Este campo é obrigatório';
    }

    this.showFieldValidation(field, isValid, message);
    return isValid;
  }

  showFieldValidation(field, isValid, message) {
    // Remover validação anterior
    this.clearFieldError(field);

    if (!isValid) {
      field.classList.add('is-invalid');
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'invalid-feedback';
      errorDiv.textContent = message;
      
      field.parentElement.appendChild(errorDiv);
    } else {
      field.classList.add('is-valid');
    }
  }

  clearFieldError(field) {
    field.classList.remove('is-invalid', 'is-valid');
    const errorDiv = field.parentElement.querySelector('.invalid-feedback');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  async handleFormSubmit(e, form) {
    e.preventDefault();
    
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    // Validar todos os campos
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      this.showFormMessage(form, 'Por favor, corrija os erros antes de enviar', 'error');
      return;
    }

    // Mostrar loading
    this.showFormMessage(form, 'Enviando mensagem...', 'loading');
    
    try {
      // Simular envio (substituir pela integração real)
      await this.simulateFormSubmit(form);
      this.showFormMessage(form, 'Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
      form.reset();
      
      // Limpar validações
      inputs.forEach(input => this.clearFieldError(input));
      
    } catch (error) {
      this.showFormMessage(form, 'Erro ao enviar mensagem. Tente novamente.', 'error');
    }
  }

  showFormMessage(form, message, type) {
    // Remover mensagens anteriores
    const existingMessages = form.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.innerHTML = `
      <div class="message-content">
        ${type === 'loading' ? '<div class="spinner"></div>' : ''}
        <span>${message}</span>
      </div>
    `;

    form.appendChild(messageDiv);

    // Remover após 5 segundos (exceto loading)
    if (type !== 'loading') {
      setTimeout(() => {
        if (messageDiv.parentElement) {
          messageDiv.remove();
        }
      }, 5000);
    }
  }

  async simulateFormSubmit(form) {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Aqui você integraria com o backend real
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Dados do formulário capturados
    
    // Simular sucesso (95% de chance)
    if (Math.random() > 0.95) {
      throw new Error('Erro simulado');
    }
  }

  // ===== ANIMAÇÕES E EFEITOS =====
  initAnimations() {
    this.initScrollAnimations();
    this.initHoverEffects();
    this.initParallaxEffects();
  }

  initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));
    this.observers.push(observer);
  }

  initHoverEffects() {
    // Efeitos de hover para cards
    const cards = document.querySelectorAll('.service-card, .feature-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const rate = scrolled * -0.5;
        el.style.transform = `translateY(${rate}px)`;
      });
    };

    window.addEventListener('scroll', this.throttle(updateParallax, 16));
  }

  // ===== LAZY LOADING =====
  initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy-load');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      img.classList.add('lazy-load');
      imageObserver.observe(img);
    });

    this.observers.push(imageObserver);
  }

  // ===== ACESSIBILIDADE =====
  initAccessibility() {
    this.initKeyboardNavigation();
    this.initFocusManagement();
    this.initScreenReaderSupport();
  }

  initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC para fechar chatbot
      if (e.key === 'Escape' && this.chatbot?.isOpen) {
        this.closeChatbot();
      }
      
      // Tab navigation melhorado
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
    });
  }

  initFocusManagement() {
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(el => {
      el.addEventListener('focus', () => {
        el.classList.add('focused');
      });
      
      el.addEventListener('blur', () => {
        el.classList.remove('focused');
      });
    });
  }

  initScreenReaderSupport() {
    // Adicionar labels para elementos interativos
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(btn => {
      if (!btn.textContent.trim()) {
        btn.setAttribute('aria-label', 'Botão interativo');
      }
    });

    // Anunciar mudanças dinâmicas
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    this.announcer = announcer;
  }

  announce(message) {
    if (this.announcer) {
      this.announcer.textContent = message;
    }
  }

  // ===== NAVEGAÇÃO E SCROLL =====
  initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  initNavigation() {
    const navLinks = document.querySelectorAll('.navmenu a');
    
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 100;
      
      navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    });
  }

  // ===== TEMA =====
  toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
      body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
    
    // Atualizar ícone
    const darkIcon = document.querySelector('.dark-icon');
    const lightIcon = document.querySelector('.light-icon');
    
    if (darkIcon && lightIcon) {
      darkIcon.classList.toggle('d-none');
      lightIcon.classList.toggle('d-none');
    }
  }

  // ===== HANDLERS DE EVENTOS =====
  handleResize() {
    this.updateSwipers();
    this.updateParallax();
  }

  handleScroll() {
    this.updateScrollProgress();
    this.updateHeaderState();
  }

  updateScrollProgress() {
    const scrollProgress = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}%`);
  }

  updateHeaderState() {
    const header = document.getElementById('header');
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  // ===== UTILITÁRIOS =====
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // ===== CLEANUP =====
  destroy() {
    // Limpar observers
    this.observers.forEach(observer => observer.disconnect());
    
    // Limpar swipers
    Object.values(this.swipers).forEach(swiper => {
      if (swiper && swiper.destroy) {
        swiper.destroy(true, true);
      }
    });
    
    // Sophos Academy cleanup concluído
  }
}

// ===== INICIALIZAÇÃO =====
let sophosApp;

document.addEventListener('DOMContentLoaded', () => {
  sophosApp = new SophosAcademy();
});

// Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
  if (sophosApp) {
    sophosApp.destroy();
  }
});

// ===== EXPORTAR PARA DEBUGGING =====
if (typeof window !== 'undefined') {
  window.SophosAcademy = SophosAcademy;
  window.sophosApp = sophosApp;
}

// ===== ESTILOS CSS PARA MENSAGENS DE FORMULÁRIO =====
const formStyles = `
<style>
.form-message {
  margin-top: 15px;
  padding: 15px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

.form-message.success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.form-message.error {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.form-message.loading {
  background-color: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
}

.form-message .message-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-message .spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.is-invalid {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}

.is-valid {
  border-color: #28a745 !important;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 5px;
  font-size: 12px;
  color: #dc3545;
}

.chatbot-notification {
  position: fixed;
  bottom: 90px;
  right: 20px;
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  z-index: 999;
  max-width: 250px;
  animation: slideInRight 0.3s ease;
}

.chatbot-notification .notification-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.chatbot-notification p {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.chatbot-notification button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.focused {
  outline: 2px solid #42b983 !important;
  outline-offset: 2px !important;
}

.dark-theme {
  --text-color: #f8f9fa;
  --bg-color: #212529;
  --card-bg: #343a40;
}

.dark-theme .form-message.success {
  background-color: #155724;
  border-color: #1e7e34;
  color: #d4edda;
}

.dark-theme .form-message.error {
  background-color: #721c24;
  border-color: #a71e2a;
  color: #f8d7da;
}

.dark-theme .chatbot-notification {
  background: #343a40;
  color: #f8f9fa;
}

.dark-theme .chatbot-notification p {
  color: #f8f9fa;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', formStyles); 