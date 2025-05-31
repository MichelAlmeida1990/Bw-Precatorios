// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .service-card, .step-card, .testimonial-card').forEach((el) => {
    observer.observe(el);
});

// Form validation with animations
const contactForm = document.getElementById('contactForm');
const formInputs = contactForm.querySelectorAll('input');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate each field
        formInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        if (!isValid) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger fade-in';
            errorMessage.textContent = 'Por favor, preencha todos os campos obrigatórios.';
            contactForm.insertBefore(errorMessage, contactForm.firstChild);
            setTimeout(() => {
                errorMessage.remove();
            }, 3000);
            return;
        }

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success fade-in';
        successMessage.textContent = 'Formulário enviado com sucesso! Entraremos em contato em breve.';
        contactForm.insertBefore(successMessage, contactForm.firstChild);
        
        // Reset form and hide success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
            contactForm.reset();
        }, 3000);
    });

    // Add input focus animations
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.classList.remove('focused');
        });
    });
}

// Smooth scrolling with active navigation highlighting
const navLinks = document.querySelectorAll('nav a[href^="#"]');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Update active link
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Navbar scroll effect with smooth transitions
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scrolled');
        navbar.classList.remove('hidden');
        return;
    }

    if (currentScroll > lastScroll && !navbar.classList.contains('hidden')) {
        // Scrolling down
        navbar.classList.remove('scrolled');
        navbar.classList.add('hidden');
    } else if (currentScroll < lastScroll && navbar.classList.contains('hidden')) {
        // Scrolling up
        navbar.classList.remove('hidden');
        navbar.classList.add('scrolled');
    }
    lastScroll = currentScroll;
});

// Mobile menu with smooth animations
document.querySelector('.navbar-toggler').addEventListener('click', function() {
    const navCollapse = document.querySelector('.navbar-collapse');
    navCollapse.classList.toggle('show');
    
    // Add animation class
    if (navCollapse.classList.contains('show')) {
        navCollapse.style.height = navCollapse.scrollHeight + 'px';
    } else {
        navCollapse.style.height = '0';
    }
});

// Add floating animation to logo
const logo = document.querySelector('.navbar-brand img');
if (logo) {
    logo.classList.add('float');
}

// Add parallax effect to hero section
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    });
}

// Add hover effects to buttons
const buttons = document.querySelectorAll('.btn-primary');
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.05)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
});

// Add scroll progress indicator
const progress = document.createElement('div');
progress.className = 'scroll-progress';
document.body.appendChild(progress);

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progress.style.width = scrolled + '%';
});

// Add copy to clipboard functionality for contact info
const contactInfo = document.querySelectorAll('.contact-info');
contactInfo.forEach(info => {
    info.addEventListener('click', () => {
        const text = info.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            tooltip.textContent = 'Copiado!';
            info.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.remove();
            }, 1500);
        });
    });
});

// Testimonials animation
const testimonials = document.querySelectorAll('.testimonial-card');
testimonials.forEach(testimonial => {
    testimonial.addEventListener('mouseenter', () => {
        testimonial.style.transform = 'scale(1.05)';
    });

    testimonial.addEventListener('mouseleave', () => {
        testimonial.style.transform = 'scale(1)';
    });
});

// Add testimonial carousel functionality
const testimonialCarousel = document.querySelector('.testimonial-carousel');
if (testimonialCarousel) {
    let currentIndex = 0;
    const testimonials = testimonialCarousel.querySelectorAll('.testimonial-card');
    const totalTestimonials = testimonials.length;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = 'none';
            if (i === index) {
                testimonial.style.display = 'block';
            }
        });
    }

    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % totalTestimonials;
        showTestimonial(currentIndex);
    }

    // Auto-rotate testimonials every 5 seconds
    setInterval(nextTestimonial, 5000);

    // Add navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-control-prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.onclick = () => {
        currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials;
        showTestimonial(currentIndex);
    };

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-control-next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.onclick = nextTestimonial;

    testimonialCarousel.appendChild(prevBtn);
    testimonialCarousel.appendChild(nextBtn);
}
