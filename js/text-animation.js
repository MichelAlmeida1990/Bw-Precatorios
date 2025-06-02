/**
 * Animação de texto usando Typed.js
 * Para o título "Antecipação de Precatórios com Confiança e Agilidade"
 */
(function() {
    document.addEventListener("DOMContentLoaded", function() {
        // Seleciona o elemento h1 na seção hero
        const headingElement = document.querySelector(".hero h1");
        
        if (!headingElement) {
            console.warn("Elemento de título não encontrado para animação");
            return;
        }
        
        // Texto original para restaurar posteriormente
        const originalText = headingElement.textContent;
        
        // Preparar o elemento para animação
        headingElement.innerHTML = `<span id="typed-text"></span>`;
        
        // Inicializar Typed.js
        const typed = new Typed("#typed-text", {
            strings: [
                "Antecipação de Precatórios com Confiança e Agilidade",
                "Receba seu Precatório <strong>Antes do Prazo</strong>",
                "Precatórios com <strong>Transparência</strong> e Segurança",
                "Transforme seu Precatório em <strong>Dinheiro Agora</strong>"
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            startDelay: 1000,
            loop: true,
            cursorChar: "|",
            contentType: "html"
        });
        
        // Restaura o texto original quando o usuário navegar para outra seção
        const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
        navLinks.forEach(link => {
            link.addEventListener("click", function() {
                // Verificar se o usuário está saindo da seção hero
                if (!window.location.hash.includes("home")) {
                    typed.destroy();
                    headingElement.innerHTML = originalText;
                }
            });
        });
    });
})();
