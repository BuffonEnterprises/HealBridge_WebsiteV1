// Portfolio Isotope and filter
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Isotope after images are loaded
  const portfolioContainer = document.querySelector('.portfolio-container');
  
  if (portfolioContainer) {
    imagesLoaded(portfolioContainer, function() {
      const portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });
      
      // Filter buttons
      const portfolioFilters = document.querySelectorAll('.filter-btn');
      portfolioFilters.forEach(function(button) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Remove active class from all filter buttons
          portfolioFilters.forEach(btn => btn.classList.remove('active'));
          // Add active class to clicked button
          this.classList.add('active');
          
          // Filter items
          const filterValue = this.getAttribute('data-filter');
          portfolioIsotope.arrange({
            filter: filterValue === '*' ? '*' : filterValue
          });
          
          // Refresh AOS
          AOS.refresh();
        });
      });
    });
  }
  
  // Initialize PureCounter for statistics
  new PureCounter();
});

/**
* Template Name: Gp
* Template URL: https://bootstrapmade.com/gp-free-multipurpose-html-bootstrap-template/
* Updated: Aug 15 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader || (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top'))) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      // Certifique-se de que o elemento está visível antes de inicializar o Swiper
      if (swiperElement.offsetParent === null) return;
      
      try {
        let config = JSON.parse(
          swiperElement.querySelector(".swiper-config").innerHTML.trim()
        );
        
        // Melhoria para loop contínuo e transição suave
        if (config.loop === true) {
          // Ajustes para garantir transição contínua entre último e primeiro slide
          config.loopFillGroupWithBlank = true;
          config.loopPreventsSlide = false;
          config.rewind = false; // Desativa rewind quando loop está ativo
          config.observer = true;
          config.observeParents = true;
          config.resistanceRatio = 0; // Elimina resistência nas extremidades
          
          // Ajusta propriedades para facilitar o loop
          if (!config.loopAdditionalSlides) {
            config.loopAdditionalSlides = 5; // Aumenta para garantir pré-carregamento
          }
          
          // Otimizações de renderização
          config.preloadImages = true;
          config.updateOnImagesReady = true;
          config.watchOverflow = true;
        }

        // Certifique-se de destruir qualquer instância existente do Swiper antes de inicializar
        if (swiperElement.swiper) {
          swiperElement.swiper.destroy(true, true);
        }

        let swiperInstance;
        if (swiperElement.classList.contains("swiper-tab")) {
          swiperInstance = initSwiperWithCustomPagination(swiperElement, config);
        } else {
          swiperInstance = new Swiper(swiperElement, config);
        }

        // Armazene a instância do Swiper no elemento para referência futura
        swiperElement.swiper = swiperInstance;
        
        // Evento especial para tratar a transição do último para o primeiro slide
        if (config.loop === true) {
          // Atualiza o swiper após a inicialização para garantir loop correto
          setTimeout(function() {
            if (swiperElement.swiper) {
              swiperElement.swiper.update();
              
              // Adiciona listener para evento de transição
              swiperElement.swiper.on('reachEnd', function() {
                // Pequeno atraso para garantir animação fluida
                setTimeout(() => {
                  // Tenta uma transição suave para o primeiro slide
                  if (!swiperElement.swiper.animating) {
                    swiperElement.swiper.slideTo(0, 800, true);
                  }
                }, 300);
              });
              
              // Adiciona evento para garantir loop contínuo
              swiperElement.swiper.on('slideChangeTransitionEnd', function() {
                if (swiperElement.swiper.isEnd) {
                  setTimeout(() => {
                    // Reinicia o loop de forma mais suave quando chegar ao fim
                    if (!swiperElement.swiper.animating) {
                      swiperElement.swiper.slideTo(1, 100, false);
                      swiperElement.swiper.slideTo(0, 800, true);
                    }
                  }, 0);
                }
              });
              
              // Reinicie a reprodução automática se estiver configurada
              if (config.autoplay) {
                swiperElement.swiper.autoplay.start();
              }
            }
          }, 100);
        }
        
        // Adiciona tratamento para reinicializar o swiper quando o conteúdo ficar visível novamente
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && swiperElement.swiper) {
              // Atualize o swiper quando ele se tornar visível novamente
              swiperElement.swiper.update();
              // Reinicia a posição para garantir funcionamento correto do loop
              if (config.loop === true && config.autoplay) {
                swiperElement.swiper.autoplay.start();
              }
            }
          });
        }, { threshold: 0.1 });
        
        observer.observe(swiperElement);
      } catch (error) {
        console.error("Erro ao inicializar Swiper:", error);
      }
    });
  }

  /**
   * Inicializa o carrossel de depoimentos para a seção de testimonials
   */
  function initTestimonialsCarousel() {
    const testimonialsSection = document.querySelector('.depoimentos-section');
    if (!testimonialsSection) return;

    const sliderContainer = testimonialsSection.querySelector('.depoimentos-slider');
    if (!sliderContainer) return;
    
    // Destruir instância existente se houver
    if (sliderContainer.swiper) {
      sliderContainer.swiper.destroy(true, true);
    }
    
    // Inicializar o Swiper para depoimentos
    const testimonialSwiper = new Swiper(sliderContainer, {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      speed: 800,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.depoimentos-slider .swiper-pagination',
        clickable: true,
        type: 'bullets'
      },
      navigation: {
        nextEl: '.depoimentos-section .swiper-button-next',
        prevEl: '.depoimentos-section .swiper-button-prev'
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

    // Atualizar região aria-live ao mudar de slide
    testimonialSwiper.on('slideChangeTransitionEnd', function() {
      var liveRegion = document.getElementById('carousel-live-region');
      if (liveRegion) {
        var activeSlide = sliderContainer.querySelector('.swiper-slide-active');
        var name = activeSlide ? activeSlide.querySelector('h4') : null;
        liveRegion.textContent = name ? 'Mostrando depoimento de ' + name.textContent : '';
      }
    });

    // Adicionar observador para manter o carousel funcionando quando visível
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && testimonialSwiper) {
          testimonialSwiper.update();
          if (testimonialSwiper.autoplay && !testimonialSwiper.autoplay.running) {
            testimonialSwiper.autoplay.start();
          }
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(sliderContainer);
  }

  window.addEventListener("load", function() {
    initSwiper();
    // Inicializar o carrossel de depoimentos com um pequeno atraso para garantir que todos os recursos estejam carregados
    setTimeout(initTestimonialsCarousel, 500);
  });
  
  // Adicione um event listener para o evento de scroll para garantir que o swiper se mantenha funcionando
  window.addEventListener("scroll", function() {
    // Usa debounce para evitar chamadas excessivas
    clearTimeout(window.scrollDebounceTimer);
    window.scrollDebounceTimer = setTimeout(function() {
      document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
        if (swiperElement.swiper && isElementInViewport(swiperElement)) {
          swiperElement.swiper.update();
          if (swiperElement.swiper.params.loop && swiperElement.swiper.params.autoplay) {
            swiperElement.swiper.autoplay.start();
          }
        }
      });
    }, 200);
  });
  
  // Função auxiliar para verificar se um elemento está visível na viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0 &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
      rect.right >= 0
    );
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });


  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Initialize additional modern features
   */
  window.addEventListener('load', () => {
    // Add Intersection Observer for enhanced reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });
    
    document.querySelectorAll('.service-item, .team-member, .portfolio-item').forEach(el => {
      el.classList.add('reveal-element');
      observer.observe(el);
    });
  });

})();