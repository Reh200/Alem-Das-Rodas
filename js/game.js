const packet = document.getElementById('packet');
const zones = document.querySelectorAll('.zone');
const msg = document.getElementById('msg');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');

// Botões
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');

const pacotes = [
    { nome: "DADOS DE STREAMING LOCAL", tipo: "fibra" },
    { nome: "DADOS INTERCONTINENTAIS", tipo: "submarino" },
    { nome: "DADOS DE ÁREA REMOTA", tipo: "satelite" }
];

let pacoteAtual = 0;
let seconds = 0;
let points = 0;
let timerInterval = null;
let isRunning = false;

// Atualiza o contador de tempo e pontos na tela
function updateDisplay() {
    timerElement.innerText = `Tempo: ${seconds}s`;
    scoreElement.innerText = `Pontos: ${points}`;
}

// Funções de Controle do Jogo
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        // Ajuste visual dos botões
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        stopBtn.style.display = 'inline-block';

        timerInterval = setInterval(() => {
            seconds++;
            updateDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    startBtn.innerText = "Retomar";
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
}

function stopTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    seconds = 0;
    points = 0;
    updateDisplay();
    
    // Reset visual dos botões
    startBtn.innerText = "Iniciar Desafio";
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    stopBtn.style.display = 'none';
}

// Lógica do Jogo
function atualizarPacote() {
    packet.innerText = "PACOTE: " + pacotes[pacoteAtual].nome;
    packet.dataset.tipo = pacotes[pacoteAtual].tipo;
}

function addPoints(valor) {
    points += valor;
    updateDisplay();
}

// Event Listeners dos botões
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
stopBtn.addEventListener('click', stopTimer);

// Lógica de Drag and Drop
packet.addEventListener('dragstart', (e) => {
    if (!isRunning) {
        e.preventDefault(); // Impede arrastar se o jogo estiver pausado
        alert("Clique em 'Iniciar' para começar!");
        return;
    }
    e.dataTransfer.setData('tipo', packet.dataset.tipo);
});

zones.forEach(zone => {
    zone.addEventListener('dragover', (e) => e.preventDefault());

    zone.addEventListener('drop', (e) => {
        if (!isRunning) return;

        const tipoPacote = e.dataTransfer.getData('tipo');
        const rotaDestino = zone.getAttribute('data-route');

        if (rotaDestino === tipoPacote) {
            msg.innerText = "🚀 Rota estabelecida! +10 pontos";
            msg.style.color = "#2ecc71";
            addPoints(10);
            
            setTimeout(() => {
                pacoteAtual = (pacoteAtual + 1) % pacotes.length;
                atualizarPacote();
                msg.innerText = "";
            }, 1000);
            
        } else {
            msg.innerText = "⚠️ Latência alta! -5 pontos";
            msg.style.color = "#f1c40f";
            addPoints(-5);
        }
    });
});

// Inicialização
atualizarPacote();
updateDisplay();