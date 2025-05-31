// Theme Manager
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeKey = 'bw_precatorios_theme';
        this.defaultTheme = 'light';
        
        // Inicialização segura
        try {
            this.initialize();
        } catch (error) {
            console.error('Erro ao inicializar o gerenciador de temas:', error);
        }
    }

    initialize() {
        // Verificar se o botão de alternância existe
        if (!this.themeToggle) {
            console.warn('Elemento de alternância de tema não encontrado');
            return;
        }

        // Configurar evento de clique
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Aplicar tema salvo ou preferência do sistema
        this.applySavedTheme();
        
        // Observar mudanças no tema do sistema
        this.setupSystemThemeListener();
    }

    applySavedTheme() {
        try {
            // Tentar obter tema salvo
            const savedTheme = localStorage.getItem(this.themeKey);
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            // Usar tema salvo, preferência do sistema ou padrão
            const themeToApply = savedTheme || (prefersDark ? 'dark' : this.defaultTheme);
            this.setTheme(themeToApply, false);
        } catch (error) {
            console.error('Erro ao aplicar tema salvo:', error);
            this.setTheme(this.defaultTheme, false);
        }
    }

    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemThemeChange = (e) => {
            // Só altera se o usuário não tiver uma preferência salva
            if (!localStorage.getItem(this.themeKey)) {
                this.setTheme(e.matches ? 'dark' : 'light', true);
            }
        };
        
        // Adicionar listener para mudanças futuras
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else {
            mediaQuery.addListener(handleSystemThemeChange); // Para navegadores mais antigos
        }
    }

    setTheme(theme, fromSystem = false) {
        try {
            // Validar tema
            if (theme !== 'light' && theme !== 'dark') {
                theme = this.defaultTheme;
            }
            
            // Aplicar classe ao documento
            document.documentElement.classList.toggle('dark-mode', theme === 'dark');
            
            // Atualizar ícone
            this.updateThemeIcon(theme);
            
            // Salvar preferência (a menos que venha do sistema e já exista uma preferência)
            if (!fromSystem || !localStorage.getItem(this.themeKey)) {
                localStorage.setItem(this.themeKey, theme);
            }
            
            // Disparar evento personalizado
            this.dispatchThemeChange(theme);
            
        } catch (error) {
            console.error('Erro ao definir o tema:', error);
        }
    }
    
    updateThemeIcon(theme) {
        const icon = this.themeToggle?.querySelector('i');
        if (!icon) return;
        
        // Adicionar classe de transição suave
        icon.style.transition = 'opacity 0.3s ease';
        icon.style.opacity = '0';
        
        // Aguardar a transição de fade out
        setTimeout(() => {
            // Atualizar classes do ícone
            icon.className = `fas fa-${theme === 'dark' ? 'sun' : 'moon'}`;
            
            // Forçar repaint
            void icon.offsetWidth;
            
            // Fade in
            icon.style.opacity = '1';
            
            // Remover estilo após a transição
            setTimeout(() => {
                icon.style.transition = '';
                icon.style.opacity = '';
            }, 300);
        }, 150);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
        this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }
    
    dispatchThemeChange(theme) {
        try {
            document.dispatchEvent(new CustomEvent('themeChange', { 
                detail: { theme } 
            }));
        } catch (error) {
            // Fallback para navegadores mais antigos
            const event = document.createEvent('CustomEvent');
            event.initCustomEvent('themeChange', true, true, { theme });
            document.dispatchEvent(event);
        }
    }
}

// Inicialização segura quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Pequeno atraso para garantir que todos os recursos foram carregados
    setTimeout(() => {
        try {
            new ThemeManager();
        } catch (error) {
            console.error('Falha ao inicializar o gerenciador de temas:', error);
        }
    }, 100);
});
