/**
 * Calculadora de Precatórios Avançada
 * Versão: 2.0
 * Recursos:
 * - Cálculo em tempo real
 * - Validação avançada de entrada
 * - Animações e efeitos visuais
 * - Modo de simulação avançada
 * - Exportação de resultados
 * - Histórico de cálculos
 */

class PrecatorioCalculator {
    constructor() {
        this.form = document.querySelector('.calculator-form');
        this.resultContainer = document.querySelector('.calculator-result');
        this.calculateButton = document.querySelector('.calculate-button');
        
        this.valorInput = document.getElementById('valor-precatorio');
        this.tipoSelect = document.getElementById('tipo-precatorio');
        this.prazoInput = document.getElementById('prazo');
        
        this.calculationHistory = [];
        this.maxHistoryItems = 5;
        
        this.initialize();
    }

    initialize() {
        if (!this.form || !this.resultContainer || !this.calculateButton) {
            console.error('Elementos da calculadora não encontrados');
            return;
        }
        
        // Configurar máscaras e formatação
        this.setupInputMasks();
        
        // Configurar eventos
        this.calculateButton.addEventListener('click', () => this.calculate());
        this.form.addEventListener('input', () => this.updateLivePreview());
        
        // Adicionar validação em tempo real
        this.valorInput.addEventListener('input', () => this.validateInput(this.valorInput));
        this.tipoSelect.addEventListener('change', () => this.validateInput(this.tipoSelect));
        this.prazoInput.addEventListener('input', () => this.validateInput(this.prazoInput));
        
        // Criar elementos para histórico e exportação
        this.createExtraElements();
        
        // Verificar se há histórico salvo
        this.loadCalculationHistory();
        
        // Adicionar listener para mudanças de tema
        document.addEventListener('themeChange', () => this.updateThemeSpecificStyles());
        
        // Inicializar tooltips
        this.initializeTooltips();
    }
    
    setupInputMasks() {
        // Formatação de moeda para o input de valor
        if (this.valorInput) {
            this.valorInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value) {
                    value = (parseInt(value) / 100).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    e.target.value = `R$ ${value}`;
                } else {
                    e.target.value = '';
                }
            });
        }
    }
    
    createExtraElements() {
        // Criar container para histórico
        const historyContainer = document.createElement('div');
        historyContainer.className = 'calculator-history';
        historyContainer.innerHTML = `
            <h4>Histórico de Cálculos</h4>
            <div class="history-items"></div>
        `;
        historyContainer.style.display = 'none';
        
        // Criar botões de ação
        const actionButtons = document.createElement('div');
        actionButtons.className = 'calculator-actions mt-3';
        actionButtons.innerHTML = `
            <button type="button" class="btn btn-sm btn-outline-secondary show-history-btn">
                <i class="fas fa-history"></i> Histórico
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary export-btn" disabled>
                <i class="fas fa-file-export"></i> Exportar PDF
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary share-btn" disabled>
                <i class="fas fa-share-alt"></i> Compartilhar
            </button>
        `;
        
        // Adicionar ao DOM
        this.resultContainer.parentNode.insertBefore(historyContainer, this.resultContainer.nextSibling);
        this.resultContainer.parentNode.insertBefore(actionButtons, this.resultContainer.nextSibling);
        
        // Salvar referências
        this.historyContainer = historyContainer;
        this.historyItems = historyContainer.querySelector('.history-items');
        this.showHistoryBtn = actionButtons.querySelector('.show-history-btn');
        this.exportBtn = actionButtons.querySelector('.export-btn');
        this.shareBtn = actionButtons.querySelector('.share-btn');
        
        // Adicionar eventos
        this.showHistoryBtn.addEventListener('click', () => this.toggleHistory());
        this.exportBtn.addEventListener('click', () => this.exportResult());
        this.shareBtn.addEventListener('click', () => this.shareResult());
    }
    
    initializeTooltips() {
        // Adicionar tooltips aos inputs
        this.addTooltip(this.valorInput, 'Insira o valor total do precatório');
        this.addTooltip(this.tipoSelect, 'Selecione o tipo de precatório');
        this.addTooltip(this.prazoInput, 'Insira o prazo estimado em meses');
    }
    
    addTooltip(element, text) {
        if (!element) return;
        
        element.setAttribute('data-bs-toggle', 'tooltip');
        element.setAttribute('data-bs-placement', 'top');
        element.setAttribute('title', text);
        
        // Inicializar tooltip via Bootstrap se disponível
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            new bootstrap.Tooltip(element);
        }
    }

    validateInput(element) {
        if (!element) return false;
        
        let isValid = true;
        const errorClass = 'is-invalid';
        const successClass = 'is-valid';
        
        if (element === this.valorInput) {
            const value = this.getNumericValue(element.value);
            isValid = !isNaN(value) && value > 0;
        } else if (element === this.tipoSelect) {
            isValid = element.value !== '';
        } else if (element === this.prazoInput) {
            const value = parseInt(element.value);
            isValid = !isNaN(value) && value > 0 && value <= 240; // Máximo de 20 anos
        }
        
        // Adicionar ou remover classes de validação
        element.classList.remove(errorClass, successClass);
        element.classList.add(isValid ? successClass : errorClass);
        
        return isValid;
    }
    
    getNumericValue(value) {
        if (!value) return NaN;
        return parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
    }

    updateLivePreview() {
        // Verificar se todos os campos estão preenchidos
        const valor = this.getNumericValue(this.valorInput.value);
        const tipo = this.tipoSelect.value;
        const prazo = parseInt(this.prazoInput.value);
        
        if (!isNaN(valor) && valor > 0 && tipo && !isNaN(prazo) && prazo > 0) {
            // Calcular resultado
            const resultado = this.calculateResult(valor, tipo, prazo);
            
            // Mostrar prévia
            this.showLivePreview(resultado);
        }
    }
    
    showLivePreview(resultado) {
        // Verificar se o container de resultado existe
        if (!this.resultContainer) return;
        
        // Criar ou atualizar elemento de prévia
        let previewElement = this.resultContainer.querySelector('.live-preview');
        
        if (!previewElement) {
            previewElement = document.createElement('div');
            previewElement.className = 'live-preview alert alert-info';
            this.resultContainer.appendChild(previewElement);
        }
        
        // Atualizar conteúdo
        previewElement.innerHTML = `
            <div class="d-flex justify-content-between">
                <span>Valor estimado:</span>
                <strong>R$ ${resultado.valorFinal.toLocaleString('pt-BR')}</strong>
            </div>
        `;
        
        // Mostrar container
        this.resultContainer.style.display = 'block';
    }

    calculate() {
        if (!this.calculateButton) return;
        
        // Adicionar classe de carregamento
        this.calculateButton.classList.add('loading');
        this.calculateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculando...';
        
        // Obter valores
        const valor = this.getNumericValue(this.valorInput.value);
        const tipo = this.tipoSelect.value;
        const prazo = parseInt(this.prazoInput.value);
        
        // Validar inputs
        const isValorValid = this.validateInput(this.valorInput);
        const isTipoValid = this.validateInput(this.tipoSelect);
        const isPrazoValid = this.validateInput(this.prazoInput);
        
        if (!isValorValid || !isTipoValid || !isPrazoValid) {
            this.calculateButton.classList.remove('loading');
            this.calculateButton.innerHTML = 'Calcular';
            this.showError('Por favor, corrija os campos destacados.');
            return;
        }
        
        // Simular processamento
        setTimeout(() => {
            try {
                // Calcular resultado
                const resultado = this.calculateResult(valor, tipo, prazo);
                
                // Adicionar ao histórico
                this.addToHistory(resultado, tipo, prazo);
                
                // Mostrar resultado
                this.showResult(resultado, tipo, prazo);
                
                // Habilitar botões de exportação e compartilhamento
                this.exportBtn.disabled = false;
                this.shareBtn.disabled = false;
            } catch (error) {
                console.error('Erro ao calcular:', error);
                this.showError('Ocorreu um erro ao calcular. Por favor, tente novamente.');
            } finally {
                // Remover classe de carregamento
                this.calculateButton.classList.remove('loading');
                this.calculateButton.innerHTML = 'Calcular';
            }
        }, 800); // Delay para efeito visual
    }

    calculateResult(valor, tipo, prazo) {
        // Taxas de deságio baseadas no tipo e prazo
        const taxasBase = {
            federal: 0.20,  // 20% para precatórios federais
            estadual: 0.30, // 30% para estaduais
            municipal: 0.35  // 35% para municipais
        };
        
        // Ajuste baseado no prazo (quanto maior o prazo, maior o deságio)
        // Limitado a um máximo de 50% de deságio total
        const ajustePrazo = Math.min(prazo * 0.005, 0.15); // 0.5% por mês, máximo 15%
        
        const taxaTotal = Math.min(taxasBase[tipo] + ajustePrazo, 0.50);
        const valorFinal = valor * (1 - taxaTotal);
        
        return {
            valorOriginal: valor,
            taxaDesagio: taxaTotal * 100,
            valorFinal: valorFinal,
            economia: valor - valorFinal,
            taxaBase: taxasBase[tipo] * 100,
            ajustePrazo: ajustePrazo * 100
        };
    }

    showResult(resultado, tipo, prazo) {
        if (!this.resultContainer) return;
        
        // Mapear tipos para nomes amigáveis
        const tiposNomes = {
            federal: 'Federal',
            estadual: 'Estadual',
            municipal: 'Municipal'
        };
        
        // Criar conteúdo HTML
        const html = `
            <div class="result-card">
                <div class="result-header">
                    <h3>Resultado do Cálculo</h3>
                    <span class="result-date">${new Date().toLocaleDateString('pt-BR')}</span>
                </div>
                
                <div class="result-value-container">
                    <div class="result-label">Valor a Receber:</div>
                    <div class="result-value">R$ ${resultado.valorFinal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                </div>
                
                <div class="result-details">
                    <div class="result-detail-item">
                        <span>Valor Original:</span>
                        <strong>R$ ${resultado.valorOriginal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
                    </div>
                    <div class="result-detail-item">
                        <span>Tipo de Precatório:</span>
                        <strong>${tiposNomes[tipo]}</strong>
                    </div>
                    <div class="result-detail-item">
                        <span>Prazo Estimado:</span>
                        <strong>${prazo} meses</strong>
                    </div>
                    <div class="result-detail-item">
                        <span>Taxa de Deságio:</span>
                        <strong>${resultado.taxaDesagio.toFixed(2)}%</strong>
                        <div class="result-tooltip" data-bs-toggle="tooltip" title="Composto por ${resultado.taxaBase.toFixed(1)}% (base) + ${resultado.ajustePrazo.toFixed(1)}% (prazo)">
                            <i class="fas fa-info-circle"></i>
                        </div>
                    </div>
                    <div class="result-detail-item">
                        <span>Economia de Tempo:</span>
                        <strong>${prazo} meses</strong>
                    </div>
                </div>
                
                <div class="result-note mt-3">
                    <p><small>* Este é apenas um cálculo estimativo. Para uma proposta personalizada, entre em contato conosco.</small></p>
                </div>
                
                <div class="result-cta mt-3">
                    <a href="#contact" class="btn btn-primary">
                        <i class="fas fa-phone-alt"></i> Receber Proposta Personalizada
                    </a>
                </div>
            </div>
        `;
        
        // Atualizar conteúdo e mostrar
        this.resultContainer.innerHTML = html;
        this.resultContainer.style.display = 'block';
        
        // Animar entrada
        this.animateResult();
        
        // Inicializar tooltips
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltips = this.resultContainer.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltips.forEach(el => new bootstrap.Tooltip(el));
        }
    }
    
    animateResult() {
        const resultCard = this.resultContainer.querySelector('.result-card');
        if (!resultCard) return;
        
        // Adicionar classe para animação
        resultCard.classList.add('animate-result');
        
        // Animar itens internos sequencialmente
        const items = resultCard.querySelectorAll('.result-detail-item, .result-value-container, .result-cta');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-item');
            }, 100 + (index * 100));
        });
    }

    showError(message) {
        if (!this.resultContainer) return;
        
        this.resultContainer.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle"></i> ${message}
            </div>
        `;
        this.resultContainer.style.display = 'block';
    }
    
    addToHistory(resultado, tipo, prazo) {
        // Criar item de histórico
        const historyItem = {
            id: Date.now(),
            date: new Date().toISOString(),
            valor: resultado.valorOriginal,
            tipo: tipo,
            prazo: prazo,
            valorFinal: resultado.valorFinal,
            taxaDesagio: resultado.taxaDesagio
        };
        
        // Adicionar ao início do array
        this.calculationHistory.unshift(historyItem);
        
        // Limitar tamanho do histórico
        if (this.calculationHistory.length > this.maxHistoryItems) {
            this.calculationHistory.pop();
        }
        
        // Salvar no localStorage
        this.saveCalculationHistory();
        
        // Atualizar UI
        this.updateHistoryUI();
    }
    
    saveCalculationHistory() {
        try {
            localStorage.setItem('calculationHistory', JSON.stringify(this.calculationHistory));
        } catch (error) {
            console.error('Erro ao salvar histórico:', error);
        }
    }
    
    loadCalculationHistory() {
        try {
            const saved = localStorage.getItem('calculationHistory');
            if (saved) {
                this.calculationHistory = JSON.parse(saved);
                this.updateHistoryUI();
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            this.calculationHistory = [];
        }
    }
    
    updateHistoryUI() {
        if (!this.historyItems) return;
        
        // Limpar conteúdo atual
        this.historyItems.innerHTML = '';
        
        // Verificar se há itens
        if (this.calculationHistory.length === 0) {
            this.historyItems.innerHTML = '<p class="text-center text-muted">Nenhum cálculo no histórico</p>';
            return;
        }
        
        // Adicionar cada item
        this.calculationHistory.forEach(item => {
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString('pt-BR');
            
            const itemElement = document.createElement('div');
            itemElement.className = 'history-item';
            itemElement.innerHTML = `
                <div class="history-item-header">
                    <span class="history-date">${formattedDate}</span>
                    <div class="history-actions">
                        <button type="button" class="btn btn-sm btn-link reload-btn" data-id="${item.id}">
                            <i class="fas fa-redo-alt"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-link delete-btn" data-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="history-item-body">
                    <div class="history-item-value">
                        <span>Valor Original:</span>
                        <strong>R$ ${item.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
                    </div>
                    <div class="history-item-result">
                        <span>Valor Final:</span>
                        <strong>R$ ${item.valorFinal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
                    </div>
                </div>
            `;
            
            // Adicionar ao container
            this.historyItems.appendChild(itemElement);
            
            // Adicionar eventos
            const reloadBtn = itemElement.querySelector('.reload-btn');
            const deleteBtn = itemElement.querySelector('.delete-btn');
            
            reloadBtn.addEventListener('click', () => this.reloadHistoryItem(item.id));
            deleteBtn.addEventListener('click', () => this.deleteHistoryItem(item.id));
        });
    }
    
    toggleHistory() {
        if (!this.historyContainer) return;
        
        const isVisible = this.historyContainer.style.display !== 'none';
        
        if (isVisible) {
            this.historyContainer.style.display = 'none';
            this.showHistoryBtn.innerHTML = '<i class="fas fa-history"></i> Histórico';
        } else {
            this.historyContainer.style.display = 'block';
            this.showHistoryBtn.innerHTML = '<i class="fas fa-times"></i> Fechar Histórico';
        }
    }
    
    reloadHistoryItem(id) {
        // Encontrar item no histórico
        const item = this.calculationHistory.find(i => i.id === id);
        if (!item) return;
        
        // Preencher formulário
        if (this.valorInput) {
            this.valorInput.value = `R$ ${item.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
            this.validateInput(this.valorInput);
        }
        
        if (this.tipoSelect) {
            this.tipoSelect.value = item.tipo;
            this.validateInput(this.tipoSelect);
        }
        
        if (this.prazoInput) {
            this.prazoInput.value = item.prazo;
            this.validateInput(this.prazoInput);
        }
        
        // Calcular novamente
        this.calculate();
        
        // Fechar histórico
        this.toggleHistory();
    }
    
    deleteHistoryItem(id) {
        // Remover do array
        this.calculationHistory = this.calculationHistory.filter(i => i.id !== id);
        
        // Salvar e atualizar UI
        this.saveCalculationHistory();
        this.updateHistoryUI();
    }
    
    exportResult() {
        alert('Funcionalidade de exportação em implementação');
        // Aqui seria implementada a exportação para PDF
    }
    
    shareResult() {
        // Verificar se a API Web Share está disponível
        if (navigator.share) {
            const resultado = this.calculationHistory[0];
            if (!resultado) return;
            
            navigator.share({
                title: 'Cálculo de Precatório - BW Precatórios',
                text: `Valor Original: R$ ${resultado.valor.toLocaleString('pt-BR')}\nValor Final: R$ ${resultado.valorFinal.toLocaleString('pt-BR')}\nDeságio: ${resultado.taxaDesagio.toFixed(2)}%`,
                url: window.location.href
            })
            .catch(error => console.error('Erro ao compartilhar:', error));
        } else {
            alert('Funcionalidade de compartilhamento não disponível neste navegador');
        }
    }
    
    updateThemeSpecificStyles() {
        // Ajustar estilos específicos ao tema atual
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        
        // Atualizar estilos da calculadora com base no tema
        if (this.resultContainer) {
            const resultCard = this.resultContainer.querySelector('.result-card');
            if (resultCard) {
                if (isDarkMode) {
                    resultCard.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
                } else {
                    resultCard.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                }
            }
        }
    }
}

// Adicionar estilos CSS para a calculadora
const addCalculatorStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .calculator-form {
            position: relative;
            z-index: 1;
        }
        
        .calculator-input-group {
            margin-bottom: 1.5rem;
            position: relative;
        }
        
        .calculator-input, .calculator-select {
            border-radius: 8px;
            padding: 12px 15px;
            border: 1px solid #ced4da;
            width: 100%;
            transition: all 0.3s ease;
        }
        
        .calculator-input:focus, .calculator-select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
            outline: none;
        }
        
        .calculate-button {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            background: var(--primary-color);
            color: white;
            border: none;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .calculate-button:hover {
            background: var(--secondary-color);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .calculate-button.loading {
            pointer-events: none;
            opacity: 0.8;
        }
        
        .calculator-result {
            margin-top: 2rem;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .result-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .result-card.animate-result {
            opacity: 1;
            transform: translateY(0);
        }
        
        .result-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .result-header h3 {
            margin: 0;
            color: var(--primary-color);
        }
        
        .result-date {
            font-size: 0.9rem;
            color: #6c757d;
        }
        
        .result-value-container {
            background: var(--primary-color);
            color: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            text-align: center;
            opacity: 0;
            transform: scale(0.95);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            transition-delay: 0.1s;
        }
        
        .result-value-container.animate-item {
            opacity: 1;
            transform: scale(1);
        }
        
        .result-label {
            font-size: 1rem;
            margin-bottom: 0.5rem;
        }
        
        .result-value {
            font-size: 2rem;
            font-weight: 700;
        }
        
        .result-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        .result-detail-item {
            display: flex;
            flex-direction: column;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .result-detail-item.animate-item {
            opacity: 1;
            transform: translateY(0);
        }
        
        .result-detail-item span {
            font-size: 0.9rem;
            color: #6c757d;
            margin-bottom: 0.25rem;
        }
        
        .result-detail-item strong {
            font-size: 1.1rem;
            color: #212529;
        }
        
        .result-tooltip {
            display: inline-block;
            margin-left: 0.5rem;
            color: #6c757d;
            cursor: pointer;
        }
        
        .result-cta {
            text-align: center;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            transition-delay: 0.5s;
        }
        
        .result-cta.animate-item {
            opacity: 1;
            transform: translateY(0);
        }
        
        .calculator-history {
            margin-top: 1.5rem;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 12px;
        }
        
        .calculator-history h4 {
            margin-bottom: 1rem;
            color: var(--primary-color);
        }
        
        .history-item {
            background: white;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }
        
        .history-item:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
        }
        
        .history-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        
        .history-date {
            font-size: 0.85rem;
            color: #6c757d;
        }
        
        .history-actions button {
            padding: 0;
            margin-left: 0.5rem;
            color: #6c757d;
        }
        
        .history-item-body {
            display: flex;
            justify-content: space-between;
        }
        
        .history-item-value, .history-item-result {
            display: flex;
            flex-direction: column;
        }
        
        .history-item-value span, .history-item-result span {
