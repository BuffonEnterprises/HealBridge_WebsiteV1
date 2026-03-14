/**
 * Inicializa um carrossel Swiper para os recursos do template
 * com configurações otimizadas para fluidez e proporção
 */
function initSwiper() {
  // Verifica se o elemento existe para evitar erros
  if (!document.querySelector('.feature-swiper')) return;

  // Destrói instância existente de Swiper (caso exista)
  if (window.featureSwiper && window.featureSwiper.destroy) {
    window.featureSwiper.destroy(true, true);
  }

  // Inicializa um novo Swiper com configurações aprimoradas
  window.featureSwiper = new Swiper('.feature-swiper', {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 20,
    loop: true,
    loopAdditionalSlides: 3,
    speed: 800,
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
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '"></span>';
      },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      576: {
        slidesPerView: 1.5,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 2.5,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 3.5,
        spaceBetween: 25,
      },
      1200: {
        slidesPerView: 3.5,
        spaceBetween: 30,
      },
    },
    on: {
      init: function() {
        // Melhora a acessibilidade e a marcação semântica dos slides
        document.querySelectorAll('.feature-swiper .swiper-slide').forEach(slide => {
          slide.setAttribute('role', 'option');
          slide.setAttribute('aria-selected', slide.classList.contains('swiper-slide-active') ? 'true' : 'false');
        });
        
        // Adiciona classe para animação de entrada
        setTimeout(() => {
          document.querySelectorAll('.feature-swiper .swiper-slide').forEach((slide, index) => {
            setTimeout(() => {
              slide.style.opacity = "1";
              slide.style.transform = "translateY(0)";
            }, 100 * index);
          });
        }, 300);
      },
      slideChange: function() {
        // Atualiza o estado de acessibilidade quando o slide muda
        document.querySelectorAll('.feature-swiper .swiper-slide').forEach(slide => {
          slide.setAttribute('aria-selected', slide.classList.contains('swiper-slide-active') ? 'true' : 'false');
        });
        
        // Adiciona classe para animação no slide ativo
        document.querySelectorAll('.feature-swiper .swiper-slide-active').forEach(slide => {
          slide.style.transform = "translateY(-10px)";
          setTimeout(() => {
            slide.style.transform = "translateY(0)";
          }, 300);
        });
      },
      resize: function() {
        // Atualiza o swiper quando o tamanho da janela muda
        this.update();
      },
      touchStart: function() {
        // Adiciona efeito de pressionar
        document.querySelectorAll('.feature-swiper .swiper-slide-active').forEach(slide => {
          slide.style.transform = "scale(0.98)";
        });
      },
      touchEnd: function() {
        // Remove efeito de pressionar
        document.querySelectorAll('.feature-swiper .swiper-slide-active').forEach(slide => {
          slide.style.transform = "scale(1)";
        });
      }
    }
  });
  
  // Observador de interseção para verificar quando o carrossel está visível
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (window.featureSwiper) {
          window.featureSwiper.update();
          
          // Reinicia a reprodução automática quando o carrossel está visível
          if (window.featureSwiper.autoplay && window.featureSwiper.autoplay.running === false) {
            window.featureSwiper.autoplay.start();
          }
          
          // Adiciona animação de entrada para os cards
          document.querySelectorAll('.feature-swiper .swiper-slide').forEach((slide, index) => {
            slide.style.transitionDelay = (index * 0.1) + "s";
            slide.classList.add('animated');
          });
        }
      } else {
        // Pausa a reprodução automática quando não estiver visível
        if (window.featureSwiper && window.featureSwiper.autoplay && window.featureSwiper.autoplay.running) {
          window.featureSwiper.autoplay.stop();
        }
      }
    });
  }, {
    threshold: 0.1
  });
  
  // Observa a seção do carrossel
  const featureSection = document.querySelector('.template-features-wrapper');
  if (featureSection) {
    observer.observe(featureSection);
  }
  
  // Adicionar efeitos de hover aos cards
  document.querySelectorAll('.feature-swiper .swiper-slide').forEach(slide => {
    slide.addEventListener('mouseenter', function() {
      // Destacar o card quando o mouse passar por cima
      this.style.zIndex = "5";
    });
    
    slide.addEventListener('mouseleave', function() {
      // Restaurar o z-index padrão
      this.style.zIndex = "1";
    });
  });
}

// Inicializa o carrossel de depoimentos para a página principal
function initTestimonialsCarousel() {
  // Verificar se o elemento existe para evitar erros
  const testimonialsSection = document.querySelector('.depoimentos-section');
  if (!testimonialsSection) return;
  
  // Inicializa o carrossel de depoimentos
  const testimonialSwiper = new Swiper('.depoimentos-slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    speed: 800,
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
      // Configurações para diferentes tamanhos de tela
      768: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  });
}

// Chama a inicialização do Swiper quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
  initSwiper();
  initTestimonialsCarousel();
});

// Atualiza o Swiper quando a janela é redimensionada
window.addEventListener('resize', () => {
  if (window.featureSwiper) {
    window.featureSwiper.update();
  }
});

// Evento para garantir que o Swiper seja atualizado durante a rolagem
window.addEventListener('scroll', function() {
  if (window.featureSwiper) {
    window.featureSwiper.update();
  }
}, { passive: true });