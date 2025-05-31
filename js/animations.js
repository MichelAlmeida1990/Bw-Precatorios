// Partículas animadas
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#2563eb' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false, animation: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
        size: { value: 3, random: true, animation: { enable: true, speed: 2, size_min: 0.1, sync: false } },
        line_linked: { enable: true, distance: 150, color: '#2563eb', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        },
        modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});

// Texto digitando (typewriter effect)
const typedText = new Typed('#typed-text', {
    strings: ['Antecipação de Precatórios', 'Solução Financeira', 'Oportunidade de Investimento'],
    typeSpeed: 50,
    backSpeed: 30,
    loop: true
});

// Scroll Indicator
const scrollIndicator = document.createElement('div');
scrollIndicator.className = 'scroll-indicator';
scrollIndicator.innerHTML = '<i class="fas fa-arrow-down"></i>';
document.body.appendChild(scrollIndicator);

// Efeito glassmorphism no navbar
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    navbar.style.backdropFilter = 'blur(10px)';
    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
});

// Hover 3D nos cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.5s ease';
    
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'rotateY(10deg) rotateX(10deg) scale(1.05)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateY(0) rotateX(0) scale(1)';
    });
});

// Animações ao scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1 });

// Observar elementos específicos
const elements = document.querySelectorAll('.feature-card, .service-card, .testimonial-card');
elements.forEach(element => observer.observe(element));
