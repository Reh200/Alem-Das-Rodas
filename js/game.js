const packet = document.getElementById('packet');
const zones = document.querySelectorAll('.zone');
const msg = document.getElementById('msg');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const summaryElement = document.getElementById('game-summary');
const statsElement = document.getElementById('final-stats');
const gameArea = document.getElementById('game-area');

const pacotes = [
    { nome: "DADOS DE STREAMING LOCAL", tipo: "fibra" },
    { nome: "DADOS INTERCONTINENTAIS", tipo: "submarino" },
    { nome: "DADOS DE ÁREA REMOTA", tipo: "satelite" },
    { nome: "TRÁFEGO DE ALTA VELOCIDADE", tipo: "fibra" },
    { nome: "COMUNICAÇÃO TRANSOCEÂNICA", tipo: "submarino" },
    { nome: "CONEXÃO EM ALTO MAR", tipo: "satelite" },
    { nome: "DADOS DE FIBRA RESIDENCIAL", tipo: "fibra" },
    { nome: "DADOS DE CABO DE COBRE", tipo: "fibra" }
];
let pacoteAtual = 0;
let seconds = 0;
let points = 0;
let timerInterval = null;
let isRunning = false;
let acertos = [];
let erros = [];

function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Troca elementos de posição
    }
    return array;
}

// Atualiza placar na tela
function updateDisplay() {
    timerElement.innerText = `Tempo: ${seconds}s`;
    scoreElement.innerText = `Pontos: ${points}`;
}

// Iniciar/Retomar o cronômetro
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        stopBtn.style.display = 'inline-block';

        timerInterval = setInterval(() => {
            seconds++;
            updateDisplay();
        }, 1000);
    }
}

// Pausar o cronômetro
function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    startBtn.innerText = "Retomar";
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
}

// Finalizar o Jogo e exibir resumo
function finalizarJogo() {
    isRunning = false;
    clearInterval(timerInterval);
    
    // Esconde área de jogo e estatísticas do topo
    if (gameArea) gameArea.style.display = 'none';
    const statsContainer = document.querySelector('.game-stats');
    if (statsContainer) statsContainer.style.display = 'none';
    
    // Exibe resumo
    summaryElement.style.display = 'block';
    
    const progresso = Math.round(((acertos.length + erros.length) / pacotes.length) * 100);
    
    statsElement.innerHTML = `
        <p>Parabéns! Você concluiu <strong>${progresso}%</strong> do desafio.</p>
        <p><strong>Acertos:</strong> ${acertos.length > 0 ? acertos.join(', ') : 'Nenhum'}</p>
        <p><strong>Erros:</strong> ${erros.length > 0 ? erros.join(', ') : 'Nenhum'}</p>
        <hr style="margin:15px 0; border:0; border-top:1px solid #ffafcc;">
        <p><strong>Tempo total:</strong> ${seconds}s | <strong>Pontuação:</strong> ${points} pontos</p>
    `;
    
    // Ajusta visibilidade dos botões
    startBtn.innerText = "Jogar Novamente";
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    stopBtn.style.display = 'none';
}

// Lógica de Pacotes
function atualizarPacote() {
    packet.innerText = "PACOTE: " + pacotes[pacoteAtual].nome;
    packet.dataset.tipo = pacotes[pacoteAtual].tipo;
}

function addPoints(valor) {
    points += valor;
    updateDisplay();
}

// Eventos dos Botões
startBtn.addEventListener('click', () => {
    if (startBtn.innerText === "Jogar Novamente") {
        location.reload();
    } else {
        startTimer();
    }
});

pauseBtn.addEventListener('click', pauseTimer);
stopBtn.addEventListener('click', finalizarJogo);

// Drag and Drop
packet.addEventListener('dragstart', (e) => {
    if (!isRunning) {
        e.preventDefault();
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
        const nomePacote = pacotes[pacoteAtual].nome;

        if (rotaDestino === tipoPacote) {
            msg.innerText = "🚀 Sucesso! +10 pontos";
            msg.style.color = "#52b788";
            acertos.push(nomePacote);
            addPoints(10);
            
            setTimeout(() => {
                pacoteAtual++;
                if (pacoteAtual >= pacotes.length) {
                    finalizarJogo();
                } else {
                    atualizarPacote();
                    msg.innerText = "";
                }
            }, 1000);
        } else {
            msg.innerText = "⚠️ Latência! -5 pontos";
            msg.style.color = "#ff4d6d";
            erros.push(nomePacote);
            addPoints(-5);
        }
    });
});

// Inicialização
atualizarPacote();
updateDisplay();
// Embaralha ao carregar o jogo
embaralhar(pacotes);
