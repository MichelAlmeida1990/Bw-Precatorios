// Form multi-step functionality
const formSteps = document.querySelector('.form-steps');
const formStepsNav = document.querySelector('.form-steps-nav');
const formStepsNavItems = document.querySelectorAll('.form-steps-nav-item');
const formStepsContent = document.querySelectorAll('.form-steps-content');

let currentStep = 1;

// Initialize form
if (formSteps) {
    initializeForm();
}

function initializeForm() {
    // Add progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = `
        <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: 0%"></div>
        </div>
    `;
    formSteps.insertBefore(progressBar, formSteps.firstChild);

    // Add event listeners to nav items
    formStepsNavItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (index + 1 !== currentStep) {
                goToStep(index + 1);
            }
        });
    });

    // Add next/previous buttons
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary next-step';
    nextBtn.textContent = 'Próximo';
    nextBtn.addEventListener('click', () => {
        if (validateCurrentStep()) {
            goToStep(currentStep + 1);
        }
    });

    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-secondary prev-step';
    prevBtn.textContent = 'Voltar';
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    });

    formSteps.appendChild(prevBtn);
    formSteps.appendChild(nextBtn);

    // Initialize first step
    showStep(1);
}

function showStep(step) {
    // Update progress bar
    const progress = ((step - 1) / (formStepsNavItems.length - 1)) * 100;
    document.querySelector('.progress-bar .progress-bar').style.width = `${progress}%`;

    // Update nav items
    formStepsNavItems.forEach((item, index) => {
        if (index + 1 <= step) {
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
        }
    });

    // Update content
    formStepsContent.forEach(content => {
        content.style.display = 'none';
    });
    document.querySelector(`.step-${step}`).style.display = 'block';

    // Update buttons
    const nextBtn = document.querySelector('.next-step');
    const prevBtn = document.querySelector('.prev-step');
    
    if (step === formStepsNavItems.length) {
        nextBtn.textContent = 'Enviar';
    } else {
        nextBtn.textContent = 'Próximo';
    }

    if (step === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }

    currentStep = step;
}

function validateCurrentStep() {
    const currentStepContent = document.querySelector(`.step-${currentStep}`);
    const requiredInputs = currentStepContent.querySelectorAll('input[required], select[required], textarea[required]');
    
    let isValid = true;
    requiredInputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });

    return isValid;
}

function goToStep(step) {
    if (step > currentStep) {
        if (validateCurrentStep()) {
            showStep(step);
        }
    } else {
        showStep(step);
    }
}

// Auto-complete
const autoCompleteInputs = document.querySelectorAll('.auto-complete');

autoCompleteInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        const suggestions = getSuggestions(value);
        showSuggestions(suggestions, e.target);
    });
});

function getSuggestions(value) {
    // Implementar lógica de sugestões baseada no valor
    return ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia'];
}

function showSuggestions(suggestions, input) {
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'suggestions-container';
    
    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'suggestion-item';
        suggestionElement.textContent = suggestion;
        suggestionElement.addEventListener('click', () => {
            input.value = suggestion;
            suggestionsContainer.remove();
        });
        suggestionsContainer.appendChild(suggestionElement);
    });

    input.parentNode.appendChild(suggestionsContainer);
}

// Document upload
const fileInputs = document.querySelectorAll('.file-upload');

fileInputs.forEach(input => {
    input.addEventListener('change', (e) => {
        const files = e.target.files;
        const previewContainer = document.createElement('div');
        previewContainer.className = 'file-preview';

        Array.from(files).forEach(file => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" class="preview-image">
                        <span class="file-name">${file.name}</span>
                        <button class="remove-file" onclick="removeFile(this)">×</button>
                    `;
                };
                reader.readAsDataURL(file);
            } else {
                previewItem.innerHTML = `
                    <i class="fas fa-file"></i>
                    <span class="file-name">${file.name}</span>
                    <button class="remove-file" onclick="removeFile(this)">×</button>
                `;
            }

            previewContainer.appendChild(previewItem);
        });

        input.parentNode.insertBefore(previewContainer, input.nextSibling);
    });
});

function removeFile(button) {
    const previewItem = button.parentElement;
    const previewContainer = previewItem.parentElement;
    const fileInput = previewContainer.previousElementSibling;
    
    previewItem.remove();
    
    if (previewContainer.children.length === 0) {
        previewContainer.remove();
    }
}
