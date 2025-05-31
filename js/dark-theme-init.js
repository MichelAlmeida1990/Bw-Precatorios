/**
 * Arquivo de inicialização para melhorias do tema escuro
 * Este script adiciona classes e inicializa efeitos visuais para o tema escuro melhorado
 */

(function() {
    // Adicionar o link para o CSS de melhorias do tema escuro
    function addDarkThemeEnhancements() {
        if (!document.querySelector('link[href="css/dark-theme-enhancements.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/dark-theme-enhancements.css';
            document.head.appendChild(link);
        }
    }

    // Adicionar classes para efeitos visuais a elementos específicos
    function addVisualEffects() {
        // Adicionar efeito de vidro aos cards principais
        document.querySelectorAll('.card').forEach(card => {
            if (!card.classList.contains('glass-effect') && 
                !card.closest('.accordion-item')) {
                card.classList.add('glass-effect');
            }
        });

        // Adicionar efeito de brilho aos ícones
        document.querySelectorAll('.fas, .fab, .far').forEach(icon => {
            if (!icon.closest('button') && !icon.closest('.bottom-nav-item')) {
                icon.parentElement.classList.add('icon-glow');
            }
        });

        // Adicionar efeito de gradiente aos títulos principais
        document.querySelectorAll('h1, h2').forEach(heading => {
            if (!heading.classList.contains('gradient-text') && 
                !heading.closest('.card') && 
                !heading.closest('.accordion-item')) {
                heading.classList.add('gradient-text');
            }
        });

        // Adicionar efeito 3D aos botões principais
        document.querySelectorAll('.btn-primary').forEach(button => {
            if (!button.classList.contains('btn-3d') && 
                !button.closest('.navbar') && 
                !button.closest('.bottom-nav')) {
                button.classList.add('btn-3d');
            }
        });
    }

    // Configurar listener para alterações de tema
    function setupThemeChangeListeners() {
        // Ouvir evento de mudança de tema
        document.addEventListener('themeChange', function(e) {
            if (e.detail.theme === 'dark') {
                // Aplicar efeitos quando o tema escuro for ativado
                setTimeout(addVisualEffects, 100);
                document.body.classList.add('dark-theme-ready');
            } else {
                // Remover classe quando o tema claro for ativado
                document.body.classList.remove('dark-theme-ready');
            }
        });

        // Verificar tema atual
        if (document.documentElement.classList.contains('dark-mode')) {
            setTimeout(addVisualEffects, 100);
            document.body.classList.add('dark-theme-ready');
        }
    }

    // Inicializar quando o DOM estiver pronto
    function initialize() {
        addDarkThemeEnhancements();
        setupThemeChangeListeners();
        
        // Adicionar efeitos visuais se o tema escuro já estiver ativo
        if (document.documentElement.classList.contains('dark-mode')) {
            setTimeout(addVisualEffects, 300);
            setTimeout(() => {
                document.body.classList.add('dark-theme-ready');
            }, 500);
        }
    }

    // Executar a inicialização quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();