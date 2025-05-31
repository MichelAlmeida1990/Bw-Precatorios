// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupColorContrast();
        this.setupFocusManagement();
        this.setupAriaLabels();
    }

    // Navegação por teclado
    setupKeyboardNavigation() {
        // Tab focus order
        document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]').forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    this.handleTabNavigation(e);
                }
            });
        });

        // Teclado de atalho para acessibilidade
        document.addEventListener('keydown', (e) => {
            if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.toggleAccessibilityMenu();
            }
        });
    }

    handleTabNavigation(e) {
        const focusableElements = document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]');
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        const nextIndex = currentIndex + (e.shiftKey ? -1 : 1);
        
        if (nextIndex >= 0 && nextIndex < focusableElements.length) {
            focusableElements[nextIndex].focus();
        }
    }

    // Suporte a leitor de tela
    setupScreenReaderSupport() {
        // ARIA labels
        document.querySelectorAll('[data-aria-label]').forEach(element => {
            const ariaLabel = element.dataset.ariaLabel;
            element.setAttribute('aria-label', ariaLabel);
        });

        // ARIA roles
        document.querySelectorAll('[data-aria-role]').forEach(element => {
            const ariaRole = element.dataset.ariaRole;
            element.setAttribute('role', ariaRole);
        });

        // ARIA states
        document.querySelectorAll('[data-aria-state]').forEach(element => {
            const ariaState = element.dataset.ariaState;
            element.setAttribute('aria-' + ariaState.split(':')[0], ariaState.split(':')[1]);
        });
    }

    // Contraste de cores
    setupColorContrast() {
        // Monitorar mudanças de tema
        document.addEventListener('themeChange', () => {
            this.updateColorContrast();
        });

        // Atualizar contraste inicial
        this.updateColorContrast();
    }

    updateColorContrast() {
        // Atualizar contrastes mínimos
        const elements = document.querySelectorAll('body *');
        
        elements.forEach(element => {
            const color = window.getComputedStyle(element).color;
            const backgroundColor = window.getComputedStyle(element).backgroundColor;
            
            if (this.calculateContrast(color, backgroundColor) < 4.5) {
                element.classList.add('low-contrast');
            }
        });
    }

    calculateContrast(color1, color2) {
        const lum1 = this.calculateLuminance(color1);
        const lum2 = this.calculateLuminance(color2);
        return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    }

    calculateLuminance(color) {
        const rgb = this.hexToRgb(color);
        const r = this.relativeLuminance(rgb.r);
        const g = this.relativeLuminance(rgb.g);
        const b = this.relativeLuminance(rgb.b);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    relativeLuminance(c) {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Gerenciamento de foco
    setupFocusManagement() {
        // Adicionar outline visível
        document.querySelectorAll('a, button, input, select, textarea').forEach(element => {
            element.style.outline = '2px solid var(--primary-color)';
            element.style.outlineOffset = '2px';
        });

        // Adicionar foco ao carregar
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelector('[tabindex="0"]')?.focus();
        });
    }

    // Labels ARIA
    setupAriaLabels() {
        // Formulários
        document.querySelectorAll('form').forEach(form => {
            const label = document.createElement('label');
            label.textContent = form.getAttribute('aria-label') || 'Formulário';
            label.setAttribute('for', form.id);
            form.insertBefore(label, form.firstChild);
        });

        // Links
        document.querySelectorAll('a').forEach(link => {
            if (!link.getAttribute('aria-label')) {
                link.setAttribute('aria-label', link.textContent);
            }
        });

        // Botões
        document.querySelectorAll('button').forEach(button => {
            if (!button.getAttribute('aria-label')) {
                button.setAttribute('aria-label', button.textContent);
            }
        });
    }

    // Menu de acessibilidade
    toggleAccessibilityMenu() {
        const menu = document.querySelector('#accessibility-menu');
        if (!menu) {
            this.createAccessibilityMenu();
        } else {
            menu.classList.toggle('visible');
        }
    }

    createAccessibilityMenu() {
        const menu = document.createElement('div');
        menu.id = 'accessibility-menu';
        menu.className = 'accessibility-menu';
        menu.innerHTML = `
            <h2>Menu de Acessibilidade</h2>
            <button onclick="changeFontSize('increase')">Aumentar Fonte</button>
            <button onclick="changeFontSize('decrease')">Diminuir Fonte</button>
            <button onclick="toggleHighContrast()">Contraste Alto</button>
            <button onclick="toggleScreenReaderMode()">Modo Leitor de Tela</button>
        `;
        document.body.appendChild(menu);
    }
}

// Funções auxiliares
function changeFontSize(action) {
    const body = document.body;
    const currentSize = parseFloat(window.getComputedStyle(body).fontSize);
    const newSize = action === 'increase' ? currentSize * 1.2 : currentSize * 0.8;
    body.style.fontSize = `${newSize}px`;
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
}

function toggleScreenReaderMode() {
    document.body.classList.toggle('screen-reader-mode');
}

// Inicializar gerenciador de acessibilidade
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityManager();
});
