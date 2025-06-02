// Log de inicialização do script
console.log('Script calculator.js carregado com sucesso!');

// Classe para gerenciar a calculadora de precatórios
class PrecatorioCalculator {
    constructor() {
        try {
            this.form = document.querySelector('.calculator-form');
            this.resultContainer = document.querySelector('.calculator-result');
            this.calculateButton = document.querySelector('.calculate-button');
            
            this.valorInput = document.getElementById('valor-precatorio');
            this.tipoSelect = document.getElementById('tipo-precatorio');
            this.prazoInput = document.getElementById('prazo');
            
            // Verificar se todos os elementos foram encontrados
            if (!this.form) console.error('Elemento .calculator-form não encontrado');
            if (!this.resultContainer) console.error('Elemento .calculator-result não encontrado');
            if (!this.calculateButton) console.error('Elemento .calculate-button não encontrado');
            if (!this.valorInput) console.error('Elemento #valor-precatorio não encontrado');
            if (!this.tipoSelect) console.error('Elemento #tipo-precatorio não encontrado');
            if (!this.prazoInput) console.error('Elemento #prazo não encontrado');
            
            // Verificar se o DOM está pronto
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initialize());
            } else {
                this.initialize();
            }
        } catch (error) {
            console.error('Erro ao inicializar a calculadora:', error);
        }
    }

    initialize() {
        this.calculateButton.addEventListener('click', () => this.calculate());
        this.form.addEventListener('input', () => this.updateResult());
        
        // Adicionar validação em tempo real
        this.valorInput.addEventListener('input', () => this.validateInput(this.valorInput));
        this.tipoSelect.addEventListener('change', () => this.validateInput(this.tipoSelect));
        this.prazoInput.addEventListener('input', () => this.validateInput(this.prazoInput));
    }

    calculate() {
        this.calculateButton.classList.add('loading');
        
        const valor = parseFloat(this.valorInput.value);
        const tipo = this.tipoSelect.value;
        const prazo = parseInt(this.prazoInput.value);
        
        if (!this.validateInputs(valor, tipo, prazo)) {
            this.calculateButton.classList.remove('loading');
            return;
        }
        
        try {
            const resultado = this.calculateResult(valor, tipo, prazo);
            this.showResult(resultado);
        } catch (error) {
            this.showError('Erro ao calcular. Por favor, tente novamente.');
        } finally {
            this.calculateButton.classList.remove('loading');
        }
    }

    validateInput(element) {
        const value = element.value;
        
        if (element === this.valorInput) {
            if (isNaN(value) || value <= 0) {
                this.addError(this.valorInput);
            } else {
                this.removeError(this.valorInput);
            }
        } else if (element === this.tipoSelect) {
            if (!value) {
                this.addError(this.tipoSelect);
            } else {
                this.removeError(this.tipoSelect);
            }
        } else if (element === this.prazoInput) {
            if (isNaN(value) || value <= 0) {
                this.addError(this.prazoInput);
            } else {
                this.removeError(this.prazoInput);
            }
        }
    }

    validateInputs(valor, tipo, prazo) {
        let isValid = true;
        
        if (isNaN(valor) || valor <= 0) {
            isValid = false;
            this.addError(this.valorInput);
        }
        
        if (!tipo) {
            isValid = false;
            this.addError(this.tipoSelect);
        }
        
        if (isNaN(prazo) || prazo <= 0) {
            isValid = false;
            this.addError(this.prazoInput);
        }
        
        this.calculateButton.disabled = !isValid;
        return isValid;
    }

    addError(element) {
        element.classList.add('error');
        element.nextElementSibling?.classList.add('error');
    }

    removeError(element) {
        element.classList.remove('error');
        element.nextElementSibling?.classList.remove('error');
    }

    calculateResult(valor, tipo, prazo) {
        // Taxas baseadas no tipo de precatório
        const taxas = {
            federal: 0.05,  // 5% para precatórios federais
            estadual: 0.07, // 7% para estaduais
            municipal: 0.08  // 8% para municipais
        };
        
        const taxa = taxas[tipo];
        const valorFinal = valor * (1 - taxa);
        
        // Desconto adicional baseado no prazo
        const descontoPrazo = valorFinal * (prazo / 100);
        const valorFinalComDesconto = valorFinal - descontoPrazo;
        
        return {
            valorOriginal: valor,
            taxa: taxa * 100,
            valorFinal: valorFinalComDesconto,
            desconto: valor - valorFinalComDesconto
        };
    }

    showResult(resultado) {
        this.resultContainer.innerHTML = `
            <h3>Resultado do Cálculo</h3>
            <p class="result-value">Valor Final: R$ ${resultado.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <div>
                <p><strong>Valor Original:</strong> R$ ${resultado.valorOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p><strong>Taxa Aplicada:</strong> ${resultado.taxa}%</p>
                <p><strong>Desconto Total:</strong> R$ ${resultado.desconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
        `;
        this.resultContainer.style.display = 'block';
    }

    showError(message) {
        this.resultContainer.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i>
                ${message}
            </div>
        `;
        this.resultContainer.style.display = 'block';
    }

    updateResult() {
        const valor = parseFloat(this.valorInput.value);
        const tipo = this.tipoSelect.value;
        const prazo = parseInt(this.prazoInput.value);
        
        if (valor && tipo && prazo) {
            const resultado = this.calculateResult(valor, tipo, prazo);
            this.showResult(resultado);
        } else {
            this.resultContainer.style.display = 'none';
        }
    }
}

// Inicializar a calculadora quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new PrecatorioCalculator();
});
