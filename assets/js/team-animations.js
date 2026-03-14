/**
 * Animações e interatividade para a seção "Os Engenheiros da Sophos"
 * Sophos Academy - Apresentação da Equipe
 */

document.addEventListener('DOMContentLoaded', function() {
  // Adicionar partículas de fundo
  addTeamParticles();
  
  // Inicializar efeitos nos cards
  initTeamCardEffects();
  
  // Animações ao scroll
  setupScrollAnimations();
});

/**
 * Adiciona partículas flutuantes ao fundo da seção e efeitos de destaque
 */
function addTeamParticles() {
  const teamSection = document.querySelector('.team-contributors');
  if (!teamSection) return;
  
  // Cria partículas
  for (let i = 1; i <= 15; i++) { // Aumentando para 15 partículas
    const particle = document.createElement('div');
    particle.className = `team-particle particle-${i}`;
    
    // Todas as partículas terão posições e tamanhos aleatórios
    const size = Math.floor(Math.random() * 100) + 50; // Entre 50px e 150px
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.top = `${Math.floor(Math.random() * 90) + 5}%`;
    particle.style.left = `${Math.floor(Math.random() * 90) + 5}%`;
    particle.style.opacity = `${Math.random() * 0.15 + 0.05}`;
    
    // Animação personalizada para as partículas
    const duration = Math.floor(Math.random() * 25) + 20; // Entre 20s e 45s
    const delay = Math.floor(Math.random() * 10); // Atraso de até 10s
    particle.style.animation = `float-around ${duration}s infinite ease-in-out ${delay}s`;
    
    teamSection.appendChild(particle);
  }
  
  // Adiciona efeitos às imagens
  const images = document.querySelectorAll('.contributor-image');
  images.forEach((image, index) => {
    // Adiciona efeito de paralaxe ao scroll
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      const imageTop = image.getBoundingClientRect().top + scroll;
      
      // Só aplica o efeito se a imagem estiver próxima da área visível
      if (scroll > imageTop - window.innerHeight && scroll < imageTop + image.offsetHeight) {
        // Calcula a distância relativa da imagem até o centro da tela
        const relativePosition = (scroll + window.innerHeight / 2) - (imageTop + image.offsetHeight / 2);
        
        // Aplica movimento suave (mais forte para as posições ímpares, movimento inverso para pares)
        const isEven = index % 2 === 0;
        const translateY = isEven ? relativePosition * 0.03 : relativePosition * -0.03;
        const maxTranslate = 20; // Limita o movimento
        
        // Aplica a transformação com limite
        const limitedTranslate = Math.max(Math.min(translateY, maxTranslate), -maxTranslate);
        image.style.transform = `translateY(${limitedTranslate}px)`;
      }
    });
    
    // Adiciona efeito de destaque nas bordas da imagem
    const highlight = document.createElement('div');
    highlight.className = 'image-highlight';
    highlight.style.position = 'absolute';
    highlight.style.top = '0';
    highlight.style.left = '0';
    highlight.style.width = '100%';
    highlight.style.height = '100%';
    highlight.style.boxShadow = 'inset 0 0 30px rgba(66, 185, 131, 0.3)';
    highlight.style.zIndex = '3';
    highlight.style.pointerEvents = 'none';
    highlight.style.opacity = '0';
    highlight.style.transition = 'opacity 0.5s ease';
    
    image.appendChild(highlight);
    
    // Mostra destaque ao passar o mouse
    image.addEventListener('mouseenter', () => {
      highlight.style.opacity = '1';
    });
    
    image.addEventListener('mouseleave', () => {
      highlight.style.opacity = '0';
    });
  });
}

/**
 * Inicializa efeitos interativos nos cards dos membros da equipe
 */
function initTeamCardEffects() {
  const cards = document.querySelectorAll('.contributor-card');
  if (!cards.length) return;
  
  cards.forEach((card, index) => {
    // Adiciona tempo de atraso na animação com base no índice
    card.style.transitionDelay = `${index * 0.1}s`;
    
    // Efeito de tilt 3D DESATIVADO
    // card.addEventListener('mousemove', function(e) {
    //   -- código removido --
    // });
    
    // Reseta a transformação quando o mouse sai
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
      
      const shine = this.querySelector('.contributor-image');
      if (shine) {
        shine.style.boxShadow = '';
        shine.style.transform = '';
        shine.style.background = '';
        
        // Reset da imagem
        const imageElement = shine.querySelector('img');
        if (imageElement) {
          imageElement.style.filter = '';
        }
      }
    });
    
    // Efeito de clique
    card.addEventListener('click', function() {
      // Simula um efeito de "pressionar"
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
}

/**
 * Configura animações baseadas no scroll
 */
function setupScrollAnimations() {
  // Verifica se o elemento IntersectionObserver está disponível
  if ('IntersectionObserver' in window) {
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.2 // Quando 20% do elemento estiver visível
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Se for um membro da equipe, inicia animação
          if (entry.target.classList.contains('contributor-card')) {
            animateTeamMember(entry.target);
          }
          
          // Remove da observação após animar
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    // Observa cada card da equipe
    document.querySelectorAll('.contributor-card').forEach(card => {
      observer.observe(card);
    });
    
    // Observa o título da seção
    const title = document.querySelector('.contributors-title');
    if (title) observer.observe(title);
  }
}

/**
 * Anima a entrada de um membro da equipe
 */
function animateTeamMember(element) {
  // Adiciona classe de animação
  element.classList.add('animated');
  
  // Elementos dentro do card
  const image = element.querySelector('.contributor-image img');
  const name = element.querySelector('.contributor-name');
  const description = element.querySelector('.contributor-description');
  const impactItems = element.querySelectorAll('.contributor-impact li');
  
  // Anima os elementos internos com delay crescente
  if (image) {
    image.style.opacity = '0';
    image.style.transform = 'scale(0.8)';
    setTimeout(() => {
      image.style.transition = 'all 0.6s ease';
      image.style.opacity = '1';
      image.style.transform = 'scale(1)';
    }, 100);
  }
  
  if (name) {
    name.style.opacity = '0';
    name.style.transform = 'translateY(20px)';
    setTimeout(() => {
      name.style.transition = 'all 0.5s ease';
      name.style.opacity = '1';
      name.style.transform = 'translateY(0)';
    }, 200);
  }
  
  if (description) {
    description.style.opacity = '0';
    setTimeout(() => {
      description.style.transition = 'all 0.5s ease';
      description.style.opacity = '1';
    }, 300);
  }
  
  // Anima cada item da lista de contribuições
  impactItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(20px)';
    setTimeout(() => {
      item.style.transition = 'all 0.4s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, 400 + (index * 100));
  });
}