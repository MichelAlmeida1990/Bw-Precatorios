// Theme Manager
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeKey = 'bw_precatorios_theme';
        this.defaultTheme = 'light';
        this.transitionDuration = 600; // Duração da transição em ms
        
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
        
        // Adicionar classes para efeitos de transição
        this.setupTransitionEffects();
    }

    setupTransitionEffects() {
        // Adicionar uma classe ao body para controlar transições
        document.body.classList.add('theme-transition-ready');
        
        // Criar e adicionar um elemento de overlay para transição
        const overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0);
            pointer-events: none;
            z-index: 9999;
            transition: opacity ${this.transitionDuration}ms ease;
            opacity: 0;
        `;
        document.body.appendChild(overlay);
        this.overlay = overlay;
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
            
            const currentTheme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
            
            // Se não estiver mudando o tema, não fazer nada
            if (theme === currentTheme) {
                return;
            }
            
            // Iniciar animação de transição
            this.startTransition(theme);
            
            // Aplicar classe ao documento após pequeno delay para permitir animação
            setTimeout(() => {
                document.documentElement.classList.toggle('dark-mode', theme === 'dark');
                
                // Atualizar ícone
                this.updateThemeIcon(theme);
                
                // Salvar preferência (a menos que venha do sistema e já exista uma preferência)
                if (!fromSystem || !localStorage.getItem(this.themeKey)) {
                    localStorage.setItem(this.themeKey, theme);
                }
                
                // Disparar evento personalizado
                this.dispatchThemeChange(theme);
                
                // Completar transição após um tempo
                setTimeout(() => {
                    this.completeTransition();
                }, this.transitionDuration / 2);
            }, 50);
            
        } catch (error) {
            console.error('Erro ao definir o tema:', error);
        }
    }
    
    startTransition(newTheme) {
        // Definir cores para transição com base no tema
        const color = newTheme === 'dark' ? 'rgba(18, 20, 24, 0.3)' : 'rgba(255, 255, 255, 0.3)';
        
        // Aplicar efeito de fade
        this.overlay.style.backgroundColor = color;
        this.overlay.style.opacity = '1';
        
        // Adicionar classe de transição ao body
        document.body.classList.add('theme-transitioning');
    }
    
    completeTransition() {
        // Completar transição
        this.overlay.style.opacity = '0';
        
        // Remover classe de transição após animação completa
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 100);
    }
    
    updateThemeIcon(theme) {
        const icon = this.themeToggle?.querySelector('i');
        if (!icon) return;
        
        // Adicionar classe de transição suave
        icon.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        icon.style.opacity = '0';
        icon.style.transform = 'rotate(180deg)';
        
        // Aguardar a transição de fade out
        setTimeout(() => {
            // Atualizar classes do ícone
            icon.className = `fas fa-${theme === 'dark' ? 'sun' : 'moon'}`;
            
            // Forçar repaint
            void icon.offsetWidth;
            
            // Fade in com rotação
            icon.style.opacity = '1';
            icon.style.transform = 'rotate(0)';
            
            // Remover estilo após a transição
            setTimeout(() => {
                icon.style.transition = '';
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
            window.themeManager = new ThemeManager();
        } catch (error) {
            console.error('Falha ao inicializar o gerenciador de temas:', error);
        }
    }, 100);
});

// Adicionar estilos de transição ao documento
const addTransitionStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .theme-transition-ready * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        .theme-transitioning * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
        }
        
        .theme-transition-overlay {
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
};

// Executar assim que possível
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addTransitionStyles);
} else {
    addTransitionStyles();
}