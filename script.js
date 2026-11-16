
const currentOperationEl = document.getElementById('current-operation');
const previousOperationEl = document.getElementById('previous-operation');
const themeToggleBtn = document.getElementById('theme-toggle');
const historyToggleBtn = document.getElementById('history-toggle');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');


let currentInput = '0';
let previousInput = '';
let operator = null;
let resetScreen = false;
let history = [];


document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        if (button.dataset.number !== undefined) {
            appendNumber(button.dataset.number);
        } else if (button.dataset.operator !== undefined) {
            handleOperator(button.dataset.operator);
        } else if (button.dataset.action !== undefined) {
            handleAction(button.dataset.action);
        }
        updateDisplay();
    });
});


window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        appendNumber(e.key);
    } else if (e.key === '+' || e.key === '-') {
        handleOperator(e.key);
    } else if (e.key === '*') {
        handleOperator('×');
    } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
    } else if (e.key === 'Enter' || e.key === '=') {
        handleAction('calculate');
    } else if (e.key === 'Backspace') {
        handleAction('backspace');
    } else if (e.key === 'Escape') {
        handleAction('clear');
    }
    updateDisplay();
});


function appendNumber(number) {
    if (currentInput === '0' || resetScreen) {
        currentInput = number;
        resetScreen = false;
    } else {
        
        if (number === '.' && currentInput.includes('.')) return;
        currentInput += number;
    }
}


function handleOperator(op) {
    if (operator !== null && !resetScreen) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    resetScreen = true;
    previousOperationEl.textContent = `${previousInput} ${operator}`;
}


function handleAction(action) {
    switch (action) {
        case 'clear':
            clearAll();
            break;
        case 'backspace':
            if (resetScreen) return;
            currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
            break;
        case 'percent':
            currentInput = String(parseFloat(currentInput) / 100);
            break;
        case 'sqrt':
            if (parseFloat(currentInput) < 0) {
                currentInput = 'Erro';
                resetScreen = true;
                return;
            }
            const resultSqrt = Math.sqrt(parseFloat(currentInput));
            addHistory(`√(${currentInput})`, resultSqrt);
            currentInput = String(resultSqrt);
            resetScreen = true;
            break;
        case 'calculate':
            calculate();
            break;
    }
}


function calculate() {
    if (operator === null || resetScreen) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            if (current === 0) {
                // Seleciona a caixa inteira do visor para exibir a imagem perfeitamente
                const displayEl = document.querySelector('.display');
                displayEl.innerHTML = `<img src="charmander.jpg" alt="Não divide por zero" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;">`;
                
                previousOperationEl.textContent = '';
                operator = null;
                resetScreen = true;
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    
    result = parseFloat(result.toFixed(10));

    addHistory(`${previousInput} ${operator} ${currentInput}`, result);

    previousOperationEl.textContent = `${previousInput} ${operator} ${currentInput} =`;
    currentInput = String(result);
    operator = null;
    resetScreen = true;
}


function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    previousOperationEl.textContent = '';
    resetScreen = false;
    
    // Restaura o visor para o formato padrão caso estivesse mostrando a imagem
    const displayEl = document.querySelector('.display');
    displayEl.innerHTML = `
        <div id="previous-operation" class="previous-operation"></div>
        <div id="current-operation" class="current-operation">0</div>
    `;
    // Reatribui as referências globais das divs do visor
    window.currentOperationEl = document.getElementById('current-operation');
    window.previousOperationEl = document.getElementById('previous-operation');
}


function updateDisplay() {
    currentOperationEl.textContent = currentInput;
}


function addHistory(expression, result) {
    const item = { expression, result };
    history.unshift(item);
    if (history.length > 20) history.pop(); 
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `${item.expression}<span>= ${item.result}</span>`;
        historyList.appendChild(li);
    });
}


themeToggleBtn.addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    
    
    const icon = themeToggleBtn.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
});


historyToggleBtn.addEventListener('click', () => {
    historyPanel.classList.toggle('active');
});

clearHistoryBtn.addEventListener('click', () => {
    history = [];
    renderHistory();
});