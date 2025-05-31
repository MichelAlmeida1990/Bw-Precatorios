/**
 * Script para aplicar as alterações do tema escuro
 * 
 * Você pode executar este script para inserir o link CSS e o script JS
 * necessários para ativar o tema escuro aprimorado.
 * 
 * Uso:
 * 1. Abra o console do navegador na página index.html
 * 2. Copie e cole todo o conteúdo deste arquivo
 * 3. Pressione Enter para executar
 */

(function() {
    // Adicionar o link CSS do tema escuro se não existir
    if (!document.querySelector('link[href="css/dark-theme-enhancements.css"]')) {
        const linkTheme = document.querySelector('link[href="css/theme.css"]');
        if (linkTheme) {
            const darkThemeLink = document.createElement('link');
            darkThemeLink.rel = 'stylesheet';
            darkThemeLink.href = 'css/dark-theme-enhancements.css';
            linkTheme.parentNode.insertBefore(darkThemeLink, linkTheme.nextSibling);
            console.log('✅ CSS de tema escuro adicionado com sucesso!');
        } else {
            console.error('❌ Não foi possível encontrar o link para theme.css');
        }
    } else {
        console.log('⚠️ O CSS de tema escuro já está presente');
    }

    // Adicionar o script de inicialização do tema escuro
    if (!document.querySelector('script[src="js/dark-theme-init.js"]')) {
        const themeScript = document.querySelector('script[src="js/theme.js"]');
        if (themeScript) {
            const darkThemeScript = document.createElement('script');
            darkThemeScript.src = 'js/dark-theme-init.js';
            themeScript.parentNode.insertBefore(darkThemeScript, themeScript.nextSibling);
            console.log('✅ Script de inicialização do tema escuro adicionado com sucesso!');
        } else {
            console.error('❌ Não foi possível encontrar o script theme.js');
        }
    } else {
        console.log('⚠️ O script de inicialização do tema escuro já está presente');
    }

    // Aplicar classes de demonstração em alguns elementos para mostrar os novos efeitos
    function aplicarClassesDemonstracao() {
        // Adicionar efeito de vidro a alguns cards
        document.querySelectorAll('.card').forEach((card, index) => {
            if (index % 3 === 0) {
                card.classList.add('glass-effect');
            }
        });

        // Adicionar efeito de borda gradiente a alguns cards
        document.querySelectorAll('.card').forEach((card, index) => {
            if (index % 3 === 1) {
                card.classList.add('gradient-border');
            }
        });

        // Adicionar efeito de texto gradiente a títulos principais
        document.querySelectorAll('h1, h2').forEach((heading, index) => {
            if (index % 2 === 0 && !heading.closest('.card')) {
                heading.classList.add('gradient-text');
            }
        });

        // Adicionar efeito de brilho aos ícones
        document.querySelectorAll('.fas, .fab, .far').forEach(icon => {
            if (!icon.closest('button') && !icon.closest('.bottom-nav-item')) {
                if (!icon.parentElement.classList.contains('icon-glow')) {
                    icon.parentElement.classList.add('icon-glow');
                }
            }
        });

        // Adicionar efeito 3D a alguns botões primários
        document.querySelectorAll('.btn-primary').forEach((button, index) => {
            if (index % 2 === 0 && !button.closest('nav')) {
                button.classList.add('btn-3d');
            }
        });

        console.log('✅ Classes de demonstração aplicadas com sucesso!');
    }

    // Aplicar as classes de demonstração apenas se estiver no modo escuro
    if (document.documentElement.classList.contains('dark-mode')) {
        aplicarClassesDemonstracao();
    }

    // Adicionar listener para aplicar classes quando o tema mudar
    document.addEventListener('themeChange', function(e) {
        if (e.detail.theme === 'dark') {
            setTimeout(aplicarClassesDemonstracao, 200);
        }
    });

    console.log('✅ Script de aplicação do tema escuro executado com sucesso!');
    console.log('ℹ️ Para ver todas as melhorias do tema escuro, clique no botão de alternar tema.');
})();