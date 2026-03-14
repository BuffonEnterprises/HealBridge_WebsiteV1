/**
 * Função auxiliar para melhorar o contraste de texto específico no modo escuro
 * Implementa funcionalidade semelhante ao pseudo-seletor :contains que não existe nativamente no CSS
 */
document.addEventListener('DOMContentLoaded', function() {
    // Lista de textos específicos para melhorar no modo escuro
    const textosEspeciais = [
        "Metodologia científica comprovada",
        "Mais equilíbrio",
        "Redução significativa",
        "Comprovado",
        "Algoritmos de IA",
        "Suporte técnico",
        "Análise contínua",
        "Integração com",
        "Metodologia embasada"
    ];
    
    // Seleciona todos os elementos de texto que podem conter esses trechos
    const elementos = document.querySelectorAll('p, li, div, span, h1, h2, h3, h4, h5, h6');
    
    // Função para verificar e aplicar classes aos elementos
    function verificarTextos() {
        elementos.forEach(elemento => {
            const textoElemento = elemento.textContent.trim();
            
            // Verifica se o elemento contém algum dos textos especiais
            textosEspeciais.forEach(textoEspecial => {
                if (textoElemento.includes(textoEspecial)) {
                    // Adiciona classe especial para estilização via CSS
                    elemento.classList.add('texto-especial-contraste');
                    
                    // Adiciona atributo de dados para CSS mais específico
                    elemento.setAttribute('data-texto-especial', 'true');
                }
            });
            
            // Caso especial para "Comprovado" como título
            if (textoElemento === "Comprovado" || 
                textoElemento === "COMPROVADO" || 
                textoElemento.startsWith("Comprovado:")) {
                elemento.classList.add('titulo-comprovado');
            }
        });
    }
    
    // Executa a verificação inicial
    verificarTextos();
    
    // Monitora mudanças de tema e reaplica a verificação
    const observador = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class' && 
                mutation.target === document.body && 
                document.body.classList.contains('dark-mode')) {
                verificarTextos();
            }
        });
    });
    
    // Inicia a observação
    observador.observe(document.body, { attributes: true });
    
    // Adiciona o CSS dinamicamente ao documento
    const estilosDinamicos = document.createElement('style');
    estilosDinamicos.textContent = `
        body.dark-mode .texto-especial-contraste {
            color: #212529 !important;
            background-color: #ffffff !important;
            padding: 3px 8px !important;
            border-radius: 4px !important;
            display: inline-block !important;
            margin: 2px 0 !important;
            font-weight: 500 !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        }
        
        body.dark-mode .titulo-comprovado {
            color: #212529 !important;
            background-color: #ffffff !important;
            padding: 5px 15px !important;
            border-radius: 6px !important;
            display: inline-block !important;
            margin: 5px 0 !important;
            font-weight: 700 !important;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15) !important;
            border-left: 4px solid var(--primary-light-color) !important;
        }
        
        body.dark-mode [data-texto-especial="true"] {
            color: #212529 !important;
        }
    `;
    document.head.appendChild(estilosDinamicos);
});