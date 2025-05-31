// Performance Optimization

class PerformanceOptimizer {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.lazyLoadImages();
        this.optimizeAnimations();
        this.optimizeEventListeners();
        this.optimizeScroll();
    }

    // Lazy Loading de Imagens
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        images.forEach(img => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            observer.observe(img);
        });
    }

    // Otimização de Animações
    optimizeAnimations() {
        // Remover animações em dispositivos móveis
        if (window.innerWidth <= 768) {
            document.documentElement.classList.add('no-animations');
        }

        // Otimizar requestAnimationFrame
        const animate = (callback) => {
            const lastTime = performance.now();
            
            const loop = (time) => {
                const delta = time - lastTime;
                if (delta >= 16.67) { // 60fps
                    callback(delta);
                    lastTime = time;
                }
                requestAnimationFrame(loop);
            };
            
            requestAnimationFrame(loop);
        };

        window.animate = animate;
    }

    // Otimização de Event Listeners
    optimizeEventListeners() {
        // Delegate eventos para melhor performance
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.matches('.btn, .link')) {
                this.handleEvent(target);
            }
        });

        // Throttle para eventos de scroll e resize
        const throttle = (fn, delay) => {
            let lastCall = 0;
            return (...args) => {
                const now = performance.now();
                if (now - lastCall >= delay) {
                    lastCall = now;
                    return fn(...args);
                }
            };
        };

        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, 100));
    }

    // Otimização de Scroll
    optimizeScroll() {
        // Remover scroll smooth em dispositivos móveis
        if (window.innerWidth <= 768) {
            document.documentElement.style.scrollBehavior = 'auto';
        }

        // Otimizar scroll smooth
        const smoothScroll = (target) => {
            const start = window.pageYOffset;
            const end = target.offsetTop;
            const duration = 500;
            const change = end - start;
            const increment = 20;
            let currentTime = 0;

            const animateScroll = () => {
                currentTime += increment;
                const val = Math.easeInOutQuad(currentTime, start, change, duration);
                window.scrollTo(0, val);
                if (currentTime < duration) {
                    setTimeout(animateScroll, increment);
                }
            };

            animateScroll();
        };

        // Função de easing
        Math.easeInOutQuad = (t, b, c, d) => {
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        };

        // Substituir scroll smooth padrão
        window.smoothScroll = smoothScroll;
    }

    // Handlers
    handleEvent(target) {
        // Implementar lógica específica para eventos
    }

    handleScroll() {
        // Implementar lógica específica para scroll
    }
}

// Inicializar otimizações quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});
