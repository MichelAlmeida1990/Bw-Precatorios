// Formulário de Contato

class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.nameInput = this.form.querySelector('#name');
        this.emailInput = this.form.querySelector('#email');
        this.phoneInput = this.form.querySelector('#phone');
        this.messageInput = this.form.querySelector('#message');
        this.steps = document.querySelectorAll('.form-steps-nav-item');
        
        this.initialize();
    }

    initialize() {
        if (!this.form) return;

        // Adicionar validação em tempo real
        this.nameInput.addEventListener('input', () => this.validateField(this.nameInput));
        this.emailInput.addEventListener('input', () => this.validateField(this.emailInput));
        this.phoneInput.addEventListener('input', () => this.validateField(this.phoneInput));
        this.messageInput.addEventListener('input', () => this.validateField(this.messageInput));

        // Adicionar máscara para telefone
        this.phoneInput.addEventListener('input', () => this.formatPhone());

        // Adicionar validação ao enviar
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch (field.id) {
            case 'name':
                isValid = value.length >= 2;
                message = 'Nome deve ter pelo menos 2 caracteres.';
                break;
            
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                message = 'Por favor, insira um email válido.';
                break;
            
            case 'phone':
                const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
                isValid = phoneRegex.test(value);
                message = 'Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX.';
                break;
            
            case 'message':
                isValid = value.length >= 10;
                message = 'Mensagem deve ter pelo menos 10 caracteres.';
                break;
        }

        if (!isValid) {
            field.classList.add('is-invalid');
            field.nextElementSibling.textContent = message;
        } else {
            field.classList.remove('is-invalid');
            field.nextElementSibling.textContent = '';
        }

        this.updateSubmitButton();
    }

    formatPhone() {
        const value = this.phoneInput.value.replace(/\D/g, '');
        if (value.length > 11) return;

        const phone = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        const phoneWithMask = phone.replace(/(\d{4,5})(\d)/, '$1-$2');
        this.phoneInput.value = phoneWithMask;
    }

    updateSubmitButton() {
        const isValid = !this.form.querySelector('.is-invalid');
        this.submitButton.disabled = !isValid;
        this.submitButton.classList.toggle('disabled', !isValid);
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.submitButton.disabled) return;

        // Mostrar loading
        this.submitButton.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Enviando...
        `;
        this.submitButton.disabled = true;

        try {
            // Coletar dados do formulário
            const formData = {
                name: this.nameInput.value.trim(),
                email: this.emailInput.value.trim(),
                phone: this.phoneInput.value.trim(),
                message: this.messageInput.value.trim(),
                timestamp: new Date().toISOString()
            };

            // Simular envio para API (em produção, substituir pelo endpoint real)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Sucesso
            this.showSuccessMessage();
            this.resetForm();
        } catch (error) {
            this.showErrorMessage();
        } finally {
            // Resetar botão
            this.submitButton.innerHTML = 'Enviar';
            this.submitButton.disabled = false;
        }
    }

    showSuccessMessage() {
        const successMessage = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle me-2"></i>
                Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.
            </div>
        `;
        this.form.insertAdjacentHTML('beforeend', successMessage);
    }

    showErrorMessage() {
        const errorMessage = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle me-2"></i>
                Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.
            </div>
        `;
        this.form.insertAdjacentHTML('beforeend', errorMessage);
    }

    resetForm() {
        this.form.reset();
        this.form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        this.form.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
        this.updateSubmitButton();
    }
}

// Inicializar formulário quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});
