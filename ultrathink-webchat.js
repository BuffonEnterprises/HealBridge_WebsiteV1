/**
 * Sofia AI Webchat - Clean & Funcional
 * Versão: 5.0
 */

(function() {
  'use strict';

  class SofiaChat {
    constructor() {
      this.isOpen = false;
      this.unreadCount = 0;
      this.chatHistory = [];
      this.init();
    }

    init() {
      this.render();
      this.bindEvents();
      this.scheduleWelcome();
    }

    render() {
      const container = document.createElement('div');
      container.id = 'sofia-webchat';
      container.className = 'ultrathink-webchat-container';
      container.innerHTML = this.getTemplate();
      document.body.appendChild(container);
    }

    getTemplate() {
      return `
        <button id="sofia-toggle" class="ultrathink-toggle-btn" aria-label="Abrir chat">
          <span class="ultrathink-icon-chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </span>
          <span class="ultrathink-icon-close" style="display:none;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </span>
          <span id="sofia-badge" class="ultrathink-badge">0</span>
        </button>

        <div id="sofia-window" class="ultrathink-chat-window">
          <div class="ultrathink-header">
            <div class="ultrathink-header-info">
              <div class="ultrathink-avatar">🌱</div>
              <div class="ultrathink-header-text">
                <h3>Sofia AI</h3>
                <span class="ultrathink-status">
                  <span class="ultrathink-status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <div class="ultrathink-header-actions">
              <button id="sofia-minimize" aria-label="Minimizar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <button id="sofia-close" aria-label="Fechar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          <div id="sofia-messages" class="ultrathink-messages">
            <div class="ultrathink-message ultrathink-bot-message">
              <div class="ultrathink-message-avatar">🌱</div>
              <div class="ultrathink-message-content">
                <p>Olá! Sou a Sofia, assistente da Sophos Academy. Como posso ajudar?</p>
                <span class="ultrathink-message-time">${this.getTime()}</span>
              </div>
            </div>
            <div id="sofia-quick-replies" class="ultrathink-quick-replies">
              <button class="ultrathink-quick-reply" data-msg="Quero conhecer os planos">📚 Planos</button>
              <button class="ultrathink-quick-reply" data-msg="Como funciona a metodologia?">🎯 Metodologia</button>
              <button class="ultrathink-quick-reply" data-msg="Preciso de ajuda">💡 Ajuda</button>
              <button class="ultrathink-quick-reply" data-msg="Falar com especialista">👤 Especialista</button>
            </div>
          </div>

          <div class="ultrathink-input-area">
            <form id="sofia-form" class="ultrathink-form">
              <input type="text" id="sofia-input" class="ultrathink-input" placeholder="Digite sua mensagem..." autocomplete="off">
              <button type="submit" class="ultrathink-send-btn" aria-label="Enviar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
            <div class="ultrathink-powered">Powered by <strong>Sophos Academy</strong></div>
          </div>
        </div>
      `;
    }

    bindEvents() {
      // Toggle
      document.getElementById('sofia-toggle').addEventListener('click', () => this.toggle());
      document.getElementById('sofia-close').addEventListener('click', () => this.close());
      document.getElementById('sofia-minimize').addEventListener('click', () => this.close());

      // Form
      document.getElementById('sofia-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('sofia-input');
        const msg = input.value.trim();
        if (msg) {
          this.sendMessage(msg);
          input.value = '';
        }
      });

      // Quick replies
      document.querySelectorAll('.ultrathink-quick-reply').forEach(btn => {
        btn.addEventListener('click', () => {
          this.sendMessage(btn.dataset.msg);
          document.getElementById('sofia-quick-replies').style.display = 'none';
        });
      });

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });
    }

    toggle() {
      this.isOpen ? this.close() : this.open();
    }

    open() {
      this.isOpen = true;
      document.getElementById('sofia-window').classList.add('ultrathink-active');
      document.querySelector('.ultrathink-icon-chat').style.display = 'none';
      document.querySelector('.ultrathink-icon-close').style.display = 'flex';
      this.clearBadge();
      setTimeout(() => document.getElementById('sofia-input').focus(), 300);
    }

    close() {
      this.isOpen = false;
      document.getElementById('sofia-window').classList.remove('ultrathink-active');
      document.querySelector('.ultrathink-icon-chat').style.display = 'flex';
      document.querySelector('.ultrathink-icon-close').style.display = 'none';
    }

    sendMessage(text) {
      this.addMessage(text, 'user');
      this.showTyping();

      setTimeout(() => {
        this.hideTyping();
        const response = this.getResponse(text);
        this.addMessage(response, 'bot');

        if (!this.isOpen) {
          this.incrementBadge();
        }
      }, 1000 + Math.random() * 500);
    }

    addMessage(text, sender) {
      const container = document.getElementById('sofia-messages');
      const avatar = sender === 'bot' ? '🌱' : '👤';

      const div = document.createElement('div');
      div.className = `ultrathink-message ultrathink-${sender}-message`;
      div.innerHTML = `
        <div class="ultrathink-message-avatar">${avatar}</div>
        <div class="ultrathink-message-content">
          <p>${this.formatText(text)}</p>
          <span class="ultrathink-message-time">${this.getTime()}</span>
        </div>
      `;

      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    showTyping() {
      const container = document.getElementById('sofia-messages');
      const div = document.createElement('div');
      div.id = 'sofia-typing';
      div.className = 'ultrathink-message ultrathink-bot-message';
      div.innerHTML = `
        <div class="ultrathink-message-avatar">🌱</div>
        <div class="ultrathink-message-content">
          <div class="ultrathink-typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      `;
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    hideTyping() {
      const typing = document.getElementById('sofia-typing');
      if (typing) typing.remove();
    }

    getResponse(msg) {
      const lower = msg.toLowerCase();

      if (lower.includes('plano') || lower.includes('preço') || lower.includes('valor')) {
        return `Temos planos para cada necessidade:

• <strong>Essencial</strong> - Para iniciantes
• <strong>Profissional</strong> - Para estudantes dedicados
• <strong>Premium</strong> - Acesso completo

Quer saber mais sobre algum plano específico?`;
      }

      if (lower.includes('metodologia') || lower.includes('método') || lower.includes('funciona')) {
        return `Nossa metodologia é baseada em neurociência:

• <strong>Revisão Espaçada</strong> - IA que aprende seu ritmo
• <strong>Flashcards Adaptativos</strong> - Evolui com você
• <strong>Análise de Performance</strong> - Tempo real

Estudos mostram que Active Recall pode aumentar a retenção em até 150%!*`;
      }

      if (lower.includes('ajuda') || lower.includes('suporte')) {
        return `Estou aqui para ajudar! Você pode:

• 📧 suporte@sophosacademy.com.br
• 💬 Chat 24/7

Sobre o que precisa de ajuda?`;
      }

      if (lower.includes('especialista') || lower.includes('humano')) {
        return `Vou conectar você com um especialista!

Um consultor entrará em contato em breve.

Qual o melhor horário para você?`;
      }

      if (lower.includes('oi') || lower.includes('olá') || lower.includes('bom dia')) {
        return `Olá! 👋

Sou a Sofia, da Sophos Academy. Como posso ajudar você hoje?`;
      }

      return `Entendi! Posso ajudar com:

• Informações sobre planos
• Nossa metodologia
• Suporte técnico
• Falar com especialista

O que prefere?`;
    }

    formatText(text) {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    }

    getTime() {
      return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    incrementBadge() {
      this.unreadCount++;
      const badge = document.getElementById('sofia-badge');
      badge.textContent = this.unreadCount > 9 ? '9+' : this.unreadCount;
      badge.classList.add('active');
    }

    clearBadge() {
      this.unreadCount = 0;
      document.getElementById('sofia-badge').classList.remove('active');
    }

    scheduleWelcome() {
      if (localStorage.getItem('sofia_visited')) return;

      setTimeout(() => {
        if (!this.isOpen) {
          this.incrementBadge();
          this.showNotification('Olá!', 'Precisa de ajuda? Estou aqui!');
        }
        localStorage.setItem('sofia_visited', 'true');
      }, 8000);
    }

    showNotification(title, text) {
      const existing = document.querySelector('.ultrathink-notification');
      if (existing) existing.remove();

      const div = document.createElement('div');
      div.className = 'ultrathink-notification';
      div.innerHTML = `<strong>${title}</strong><p>${text}</p>`;
      document.body.appendChild(div);

      setTimeout(() => {
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 300);
      }, 4000);
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SofiaChat());
  } else {
    new SofiaChat();
  }
})();
