/**
 * Timeline Animation - Script para adicionar interatividade à seção Sobre Nós
 */
document.addEventListener('DOMContentLoaded', function() {
  // Elementos da timeline
  const timelineMilestones = document.querySelectorAll('.timeline-milestone');
  const aboutTabs = document.querySelectorAll('.about-tab');
  const ourJourney = document.getElementById('our-journey');
  const teamContributors = document.getElementById('team-contributors');
  const aboutDetails = document.getElementById('about-details');
  
  // Inicialização da visualização
  if (ourJourney) ourJourney.style.display = 'block';
  if (teamContributors) teamContributors.style.display = 'none';
  if (aboutDetails) aboutDetails.style.display = 'none';
  
  // Adiciona elementos decorativos flutuantes
  const ourStory = document.querySelector('.our-story');
  if (ourStory) {
    // Adiciona elementos decorativos flutuantes
    const floatingElements = 3;
    for (let i = 0; i < floatingElements; i++) {
      const element = document.createElement('div');
      element.className = 'floating-element';
      ourStory.appendChild(element);
    }
  }
  
  // Função para alternar entre as abas
  function switchTab(tabId) {
    // Esconde todas as seções
    if (ourJourney) ourJourney.style.display = 'none';
    if (teamContributors) teamContributors.style.display = 'none';
    if (aboutDetails) aboutDetails.style.display = 'none';
    
    // Remove a classe ativa de todas as abas
    aboutTabs.forEach(tab => tab.classList.remove('active'));
    
    // Mostra a seção selecionada
    const selectedSection = document.getElementById(tabId);
    if (selectedSection) selectedSection.style.display = 'block';
    
    // Ativa a aba correspondente
    aboutTabs.forEach(tab => {
      if (tab.getAttribute('href') === '#' + tabId) {
        tab.classList.add('active');
      }
    });
    
    // Reativa as animações AOS
    AOS.refresh();
  }
  
  // Adiciona event listeners às abas
  aboutTabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      switchTab(targetId);
    });
  });
  
  // Efeito de parallax suave para as imagens
  window.addEventListener('scroll', function() {
    const milestoneImages = document.querySelectorAll('.milestone-image-wrapper img');
    milestoneImages.forEach(img => {
      const parent = img.closest('.timeline-milestone');
      const parentTop = parent.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (parentTop < windowHeight && parentTop > -parent.offsetHeight) {
        const scrollPosition = parentTop / windowHeight;
        img.style.transform = `translateY(${scrollPosition * 15}px)`;
      }
    });
  });
  
  // Adiciona classe especial quando o usuário passar o mouse sobre um milestone
  timelineMilestones.forEach(milestone => {
    milestone.addEventListener('mouseenter', function() {
      timelineMilestones.forEach(m => m.classList.remove('highlight'));
      this.classList.add('highlight');
    });
    
    milestone.addEventListener('mouseleave', function() {
      this.classList.remove('highlight');
    });
  });
  
  // Inicializa a primeira aba como ativa
  const firstTab = aboutTabs[0];
  if (firstTab) {
    firstTab.classList.add('active');
  }
  
  // Adiciona a funcionalidade de "revelar mais" para parágrafos longos
  const longTexts = document.querySelectorAll('.milestone-text-wrapper p');
  longTexts.forEach(text => {
    // Se o texto for mais longo que 150 caracteres
    if (text.textContent.length > 150 && !text.classList.contains('quote-author')) {
      const fullText = text.textContent;
      const shortenedText = fullText.substring(0, 150) + '...';
      
      // Cria elementos para o texto resumido e o botão "ler mais"
      text.innerHTML = `
        <span class="short-text">${shortenedText}</span>
        <span class="full-text" style="display: none;">${fullText}</span>
        <button class="read-more-btn">Ler mais</button>
      `;
      
      // Adiciona funcionalidade ao botão
      const readMoreBtn = text.querySelector('.read-more-btn');
      const shortText = text.querySelector('.short-text');
      const fullText = text.querySelector('.full-text');
      
      readMoreBtn.addEventListener('click', function() {
        if (shortText.style.display !== 'none') {
          shortText.style.display = 'none';
          fullText.style.display = 'inline';
          readMoreBtn.textContent = 'Ler menos';
        } else {
          shortText.style.display = 'inline';
          fullText.style.display = 'none';
          readMoreBtn.textContent = 'Ler mais';
        }
      });
    }
  });
  
  // Ajusta os atributos data-aos para melhorar a animação da timeline
  timelineMilestones.forEach((milestone, index) => {
    if (milestone.classList.contains('left')) {
      milestone.setAttribute('data-aos', 'timeline-fade-right');
    } else {
      milestone.setAttribute('data-aos', 'timeline-fade-left');
    }
    milestone.setAttribute('data-aos-delay', (index * 100).toString());
    milestone.setAttribute('data-aos-duration', '800');
  });
});