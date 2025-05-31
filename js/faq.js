class FAQManager {
    constructor() {
        this.searchInput = document.querySelector('.faq-search input');
        this.faqItems = document.querySelectorAll('.accordion-item');
        this.copyButtons = document.querySelectorAll('.copy-button');
        this.shareButtons = document.querySelectorAll('.share-button');
        this.printButton = document.querySelector('.print-faq');
        this.searchIcon = document.querySelector('.faq-search i');
        
        this.initialize();
    }

    initialize() {
        this.setupSearch();
        this.setupCopyButtons();
        this.setupShareButtons();
        this.setupPrintButton();
        this.setupDarkMode();
    }

    setupSearch() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            this.faqItems.forEach(item => {
                const question = item.querySelector('.accordion-button').textContent.toLowerCase();
                const answer = item.querySelector('.accordion-body').textContent.toLowerCase();
                
                const matches = question.includes(searchTerm) || answer.includes(searchTerm);
                item.style.display = matches ? 'block' : 'none';
                
                // Atualizar estado do accordion quando itens são filtrados
                const collapse = item.querySelector('.accordion-collapse');
                if (collapse) {
                    collapse.style.display = matches ? '' : 'none';
                }
            });

            // Atualizar ícone de busca
            this.updateSearchIcon(searchTerm);
        });
    }

    updateSearchIcon(searchTerm) {
        if (!this.searchIcon) return;
        
        if (searchTerm) {
            this.searchIcon.classList.add('active');
        } else {
            this.searchIcon.classList.remove('active');
        }
    }

    setupCopyButtons() {
        if (!this.copyButtons) return;

        this.copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const text = button.getAttribute('data-text');
                
                navigator.clipboard.writeText(text)
                    .then(() => {
                        const originalText = button.textContent;
                        button.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                        
                        setTimeout(() => {
                            button.innerHTML = `<i class="fas fa-copy"></i> ${originalText}`;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Erro ao copiar:', err);
                        const originalText = button.textContent;
                        button.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erro';
                        
                        setTimeout(() => {
                            button.innerHTML = `<i class="fas fa-copy"></i> ${originalText}`;
                        }, 2000);
                    });
            });
        });
    }

    setupShareButtons() {
        if (!this.shareButtons) return;

        this.shareButtons.forEach(button => {
            button.addEventListener('click', () => {
                const url = window.location.href;
                const title = document.title;
                const faqItem = button.closest('.accordion-item');
                const question = faqItem.querySelector('.accordion-button').textContent;
                
                if (navigator.share) {
                    navigator.share({
                        title: `${title} - FAQ: ${question}`,
                        url: url
                    })
                    .catch(console.error);
                } else {
                    const shareUrl = `https://twitter.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)} - FAQ: ${encodeURIComponent(question)}`;
                    window.open(shareUrl, '_blank');
                }
            });
        });
    }

    setupPrintButton() {
        if (!this.printButton) return;

        this.printButton.addEventListener('click', () => {
            // Criar uma cópia do FAQ para impressão
            const printContent = document.createElement('div');
            printContent.className = 'print-faq-content';
            
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
            
            // Adicionar perguntas e respostas
            this.faqItems.forEach(item => {
                if (item.style.display !== 'none') {
                    const question = item.querySelector('.accordion-button').textContent;
                    const answer = item.querySelector('.accordion-body').textContent;
                    
                    const questionElement = document.createElement('h2');
                    questionElement.textContent = question;
                    printContent.appendChild(questionElement);
                    
                    const answerElement = document.createElement('p');
                    answerElement.textContent = answer;
                    printContent.appendChild(answerElement);
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
                        h2 { margin-top: 20px; }
                        .print-timestamp { color: #666; margin-bottom: 20px; }
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

    setupDarkMode() {
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        if (!darkModeToggle) return;

        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            this.updateFAQColors();
        });
    }

    updateFAQColors() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        this.faqItems.forEach(item => {
            const button = item.querySelector('.accordion-button');
            const body = item.querySelector('.accordion-body');
            
            if (isDarkMode) {
                button.style.backgroundColor = '#333';
                button.style.color = '#fff';
                body.style.backgroundColor = '#222';
                body.style.color = '#fff';
            } else {
                button.style.backgroundColor = '#fff';
                button.style.color = '#000';
                body.style.backgroundColor = '#f8f9fa';
                body.style.color = '#000';
            }
        });
    }
}

// Inicializar FAQ quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new FAQManager();
});
