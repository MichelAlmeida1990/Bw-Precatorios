class TimelineManager {
    constructor() {
        this.progress = document.querySelector('.timeline-progress-bar');
        this.items = document.querySelectorAll('.timeline-item');
        this.tooltips = document.querySelectorAll('.timeline-tooltip');
        this.filters = document.querySelectorAll('.timeline-filter');
        this.searchInput = document.querySelector('.timeline-search input');
        this.container = document.querySelector('.timeline-container');
        this.printButton = document.querySelector('.timeline-print');
        
        this.initialize();
    }

    initialize() {
        this.setupTheme();
        this.setupProgress();
        this.setupTooltips();
        this.setupSearch();
        this.setupPrint();
        this.setupFilters();
        this.setupAnimations();
    }

    setupTheme() {
        // Atualizar tema inicialmente
        this.updateTheme();
        
        // Adicionar listener para mudanças de tema
        document.addEventListener('themeChange', () => this.updateTheme());
    }

    updateTheme() {
        const isDark = document.documentElement.classList.contains('dark-mode');
        
        this.container.style.background = isDark ? '#1a1a1a' : 'white';
        this.container.style.boxShadow = isDark ? '0 4px 6px rgba(0, 0, 0, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.1)';
        
        this.items.forEach(item => {
            const content = item.querySelector('.timeline-content');
            if (content) {
                content.style.background = isDark ? '#2d2d2d' : 'white';
                content.style.color = isDark ? '#ffffff' : '#333333';
            }
        });
        
        this.tooltips.forEach(tooltip => {
            tooltip.style.background = isDark ? '#2d2d2d' : 'rgba(255, 255, 255, 0.95)';
            tooltip.style.color = isDark ? '#ffffff' : '#333333';
        });
        
        this.searchInput?.style.background = isDark ? '#2d2d2d' : 'white';
        this.searchInput?.style.color = isDark ? '#ffffff' : '#333333';
        this.searchInput?.style.borderColor = isDark ? '#4d4d4d' : '#ddd';
    }

    setupProgress() {
        this.updateProgress();
        
        // Adicionar animação de progresso
        this.progress.style.transition = 'width 0.5s ease';
    }

    updateProgress() {
        if (!this.progress) return;
        
        const totalItems = this.items.length;
        const completedItems = Array.from(this.items).filter(item => item.classList.contains('completed')).length;
        const progress = (completedItems / totalItems) * 100;
        
        this.progress.style.width = `${progress}%`;
        this.progress.style.background = `linear-gradient(90deg, var(--primary-color), ${document.documentElement.classList.contains('dark-mode') ? '#4d4d4d' : '#ddd'})`;
    }

    setupTooltips() {
        this.tooltips.forEach(tooltip => {
            const parent = tooltip.closest('.timeline-item');
            
            parent.addEventListener('mouseenter', () => {
                tooltip.style.display = 'block';
                tooltip.style.opacity = '0';
                
                // Posicionar o tooltip
                const rect = parent.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
                tooltip.style.top = `${rect.top - tooltipRect.height - 10}px`;
                
                // Adicionar animação de fade
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                }, 100);
            });
            
            parent.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                
                // Remover tooltip após fade
                setTimeout(() => {
                    tooltip.style.display = 'none';
                }, 300);
            });
        });
    }

    setupSearch() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            this.items.forEach(item => {
                const title = item.querySelector('.timeline-title').textContent.toLowerCase();
                const description = item.querySelector('.timeline-description').textContent.toLowerCase();
                const date = item.querySelector('.timeline-date').textContent.toLowerCase();
                
                const matches = title.includes(searchTerm) || description.includes(searchTerm) || date.includes(searchTerm);
                item.style.display = matches ? 'block' : 'none';
                
                // Atualizar progresso quando itens são filtrados
                this.updateProgress();
            });
        });
    }

    setupPrint() {
        if (!this.printButton) return;

        this.printButton.addEventListener('click', () => {
            // Criar conteúdo para impressão
            const printContent = document.createElement('div');
            printContent.className = 'print-timeline-content';
            
            // Adicionar cabeçalho
            const header = document.createElement('h1');
            header.textContent = document.title;
            printContent.appendChild(header);
            
            // Adicionar data e hora
            const date = new Date();
            const timestamp = document.createElement('p');
            timestamp.className = 'print-timestamp';
            timestamp.textContent = `Impresso em: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            printContent.appendChild(timestamp);
            
            // Adicionar etapas
            this.items.forEach(item => {
                if (item.style.display !== 'none') {
                    const content = item.cloneNode(true);
                    content.style.display = 'block';
                    
                    // Remover tooltip
                    const tooltip = content.querySelector('.timeline-tooltip');
                    if (tooltip) {
                        tooltip.remove();
                    }
                    
                    printContent.appendChild(content);
                }
            });
            
            // Criar nova janela para impressão
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>${document.title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { text-align: center; margin-bottom: 20px; }
                        .print-timestamp { color: #666; margin-bottom: 20px; }
                        .timeline-item { margin-bottom: 20px; }
                        .timeline-content { padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                        .timeline-title { margin: 10px 0; font-size: 18px; }
                        .timeline-description { color: #666; }
                    </style>
                </head>
                <body>
                    ${printContent.outerHTML}
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
            printWindow.close();
        });
    }

    setupFilters() {
        if (!this.filters.length) return;

        this.filters.forEach(filter => {
            filter.addEventListener('change', () => {
                const filterValue = filter.value;
                
                this.items.forEach(item => {
                    const category = item.dataset.category || 'all';
                    const matches = filterValue === 'all' || category === filterValue;
                    item.style.display = matches ? 'block' : 'none';
                    
                    // Atualizar progresso quando itens são filtrados
                    this.updateProgress();
                });
            });
        });
    }

    setupAnimations() {
        // Animação de entrada
        this.items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                item.style.transition = 'all 0.5s ease';
            }, index * 100);
        });

        // Animação de rolagem
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('load', () => this.handleScroll());
    }

    handleScroll() {
        this.items.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    }
}

// Inicializar timeline quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new TimelineManager();
});

// Timeline Navigation
timelineLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Timeline Filters
function applyFilters(filterValue) {
    timelineItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

timelineFilters.forEach(filter => {
    filter.addEventListener('change', () => {
        const filterValue = filter.value;
        applyFilters(filterValue);
    });
});

// Timeline Search
if (timelineSearchInput) {
    timelineSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        timelineItems.forEach(item => {
            const title = item.querySelector('.timeline-title')?.textContent?.toLowerCase() || '';
            const description = item.querySelector('.timeline-description')?.textContent?.toLowerCase() || '';
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Função para calcular progresso
function updateProgress() {
    if (!timelineProgress) return;
    
    const totalItems = timelineItems.length;
    const completedItems = Array.from(timelineItems).filter(item => item.classList.contains('completed')).length;
    const progress = (completedItems / totalItems) * 100;
    
    timelineProgress.style.width = `${progress}%`;
}

// Inicializar progresso
updateProgress();

// Tooltips
timelineTooltips.forEach(tooltip => {
    const parent = tooltip.closest('.timeline-item');
    
    parent.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
        
        // Posicionar o tooltip
        const rect = parent.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
        tooltip.style.top = `${rect.top - tooltipRect.height - 10}px`;
    });
    
    parent.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
});

// Scroll Animation
function animateOnScroll() {
    timelineItems.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Timeline Navigation
timelineLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Timeline Filters
function applyFilters(filterValue) {
    timelineItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

timelineFilters.forEach(filter => {
    filter.addEventListener('change', () => {
        const filterValue = filter.value;
        applyFilters(filterValue);
    });
});

// Timeline Search
if (timelineSearch) {
    timelineSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        timelineItems.forEach(item => {
            const title = item.querySelector('.timeline-title')?.textContent?.toLowerCase() || '';
            const description = item.querySelector('.timeline-description')?.textContent?.toLowerCase() || '';
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Timeline Search
const timelineSearch = document.querySelector('.timeline-search');

if (timelineSearch) {
    timelineSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        timelineItems.forEach(item => {
            const title = item.querySelector('.timeline-title').textContent.toLowerCase();
            const description = item.querySelector('.timeline-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}
