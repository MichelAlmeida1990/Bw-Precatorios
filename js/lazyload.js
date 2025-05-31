// Lazy Loading Manager
class LazyLoadManager {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.lazyLoadScripts();
        this.lazyLoadImages();
        this.lazyLoadFonts();
    }

    // Lazy Loading de Scripts
    lazyLoadScripts() {
        const scripts = document.querySelectorAll('script[data-src]');
        
        scripts.forEach(script => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const newScript = document.createElement('script');
                        newScript.src = script.dataset.src;
                        newScript.async = true;
                        script.parentNode.replaceChild(newScript, script);
                        observer.unobserve(script);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            observer.observe(script);
        });
    }

    // Lazy Loading de Imagens
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        images.forEach(img => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            observer.observe(img);
        });
    }

    // Lazy Loading de Fontes
    lazyLoadFonts() {
        const fonts = document.querySelectorAll('link[data-font]');
        
        fonts.forEach(font => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const newFont = document.createElement('link');
                        newFont.href = font.dataset.font;
                        newFont.rel = 'stylesheet';
                        font.parentNode.replaceChild(newFont, font);
                        observer.unobserve(font);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            observer.observe(font);
        });
    }

    // Otimização de Carregamento
    optimizeLoading() {
        // Priorizar recursos críticos
        const criticalResources = document.querySelectorAll('[data-critical]');
        criticalResources.forEach(resource => {
            resource.classList.remove('lazy');
            resource.classList.add('critical');
        });

        // Adicionar loading spinner
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        loadingSpinner.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        `;
        document.body.appendChild(loadingSpinner);

        // Remover spinner quando carregado
        window.addEventListener('load', () => {
            loadingSpinner.remove();
        });
    }

    // Otimização de Cache
    optimizeCache() {
        // Cache de imagens
        const cache = new Map();
        
        document.querySelectorAll('img').forEach(img => {
            if (!cache.has(img.src)) {
                cache.set(img.src, new Image());
                cache.get(img.src).src = img.src;
            }
        });

        // Cache de scripts
        const scriptCache = new Map();
        
        document.querySelectorAll('script').forEach(script => {
            if (!scriptCache.has(script.src)) {
                scriptCache.set(script.src, true);
            }
        });
    }
}

// Inicializar LazyLoadManager quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new LazyLoadManager();
});
