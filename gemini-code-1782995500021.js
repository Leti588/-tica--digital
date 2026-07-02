// DADOS DOS DILEMAS (O Que Você Faria?)
const scenariosData = [
    {
        question: "Um colega deixou a conta da rede social logada no computador da escola. O que você faz?",
        options: [
            { text: "Deslogo da conta imediatamente sem bisbilhotar.", points: 10 },
            { text: "Posto uma brincadeira inofensiva no perfil dele.", points: 5 },
            { text: "Olho as mensagens privadas para descobrir segredos.", points: 0 }
        ]
    },
    {
        question: "Você recebeu um link com uma notícia chocante sobre um famoso, mas o site parece duvidoso. Como age?",
        options: [
            { text: "Verifico em canais de notícias confiáveis antes de enviar para alguém.", points: 10 },
            { text: "Não mudo nada, mas compartilho no grupo da família 'por via das dúvidas'.", points: 2 },
            { text: "Curto e espalho de imediato para ganhar engajamento.", points: 0 }
        ]
    }
];

// DADOS DO QUIZ TRADICIONAL
const quizData = [
    {
        question: "Qual das alternativas representa uma prática em conformidade com a LGPD?",
        options: [
            { text: "Coletar e guardar todos os dados possíveis sem aviso.", correct: false },
            { text: "Pedir consentimento explícito antes de salvar dados do usuário.", correct: true },
            { text: "Compartilhar e-mails de clientes com empresas parceiras.", correct: false }
        ]
    },
    {
        question: "O que caracteriza o conceito de 'Viés Algorítmico' na IA?",
        options: [
            { text: "Uma Inteligência Artificial que toma decisões baseadas em preconceitos humanos presentes nos dados históricos.", correct: true },
            { text: "O computador funcionando de forma mais rápida à noite.", correct: false },
            { text: "Softwares originais criados sem código aberto.", correct: false }
        ]
    }
];

// ESTADOS DO APP
let currentFontSize = 16;
let currentScenario = 0;
let currentQuiz = 0;
let scenarioScore = 0;
let quizScore = 0;
let pNameScenarios = "";
let pNameQuiz = "";

// ELEMENTOS DOM - ACESSIBILIDADE
document.querySelector('.acc-toggle').addEventListener('click', () => {
    const options = document.querySelector('.acc-options');
    options.style.display = options.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('btn-theme').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});

document.getElementById('btn-font-plus').addEventListener('click', () => {
    currentFontSize += 2;
    document.documentElement.style.setProperty('--fonte-tamanho-base', currentFontSize + 'px');
});

document.getElementById('btn-font-minus').addEventListener('click', () => {
    if(currentFontSize > 12) {
        currentFontSize -= 2;
        document.documentElement.style.setProperty('--fonte-tamanho-base', currentFontSize + 'px');
    }
});

document.getElementById('btn-tts').addEventListener('click', () => {
    const textToRead = document.querySelector('.intro-section').innerText;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.cancel(); // Para se já estiver lendo algo
    window.speechSynthesis.speak(utterance);
});

// LÓGICA: O QUE VOCÊ FARIA (DILEMAS)
document.getElementById('btn-start-scenarios').addEventListener('click', () => {
    const nameInput = document.getElementById('player-name-scenarios').value.trim();
    if (!nameInput) return alert("Por favor, insira um apelido virtual.");
    pNameScenarios = nameInput;
    document.getElementById('scenario-setup').classList.add('hidden');
    document.getElementById('scenarios-container').classList.remove('hidden');
    loadScenario();
});

function loadScenario() {
    if (currentScenario < scenariosData.length) {
        const data = scenariosData[currentScenario];
        document.getElementById('scenario-title').innerText = `Dilema #${currentScenario + 1}`;
        document.getElementById('scenario-text').innerText = data.question;
        
        const optionsDiv = document.getElementById('scenario-options');
        optionsDiv.innerHTML = '';
        
        // Barra progresso
        document.getElementById('scenario-progress').style.width = `${((currentScenario) / scenariosData.length) * 100}%`;

        data.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt.text;
            btn.addEventListener('click', () => {
                scenarioScore += opt.points;
                currentScenario++;
                loadScenario();
            });
            optionsDiv.appendChild(btn);
        });
    } else {
        endScenarios();
    }
}

function endScenarios() {
    document.getElementById('scenarios-container').classList.add('hidden');
    document.getElementById('scenarios-result').classList.remove('hidden');
    document.getElementById('scenario-final-score').innerText = `${pNameScenarios}, você acumulou ${scenarioScore} pontos de Consciência Ética!`;
    
    saveAndRenderRanking('scenariosRanking', pNameScenarios, scenarioScore, 'scenarios-ranking-list');
}

document.getElementById('btn-restart-scenarios').addEventListener('click', () => {
    currentScenario = 0; scenarioScore = 0;
    document.getElementById('scenarios-result').classList.add('hidden');
    document.getElementById('scenario-setup').classList.remove('hidden');
});

// LÓGICA: QUIZ TRADICIONAL
document.getElementById('btn-start-quiz').addEventListener('click', () => {
    const nameInput = document.getElementById('player-name-quiz').value.trim();
    if (!nameInput) return alert("Insira seu nome para o Quiz.");
    pNameQuiz = nameInput;
    document.getElementById('quiz-setup').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    loadQuiz();
});

function loadQuiz() {
    if (currentQuiz < quizData.length) {
        const data = quizData[currentQuiz];
        document.getElementById('quiz-question').innerText = data.question;
        
        const optionsDiv = document.getElementById('quiz-options');
        optionsDiv.innerHTML = '';
        
        document.getElementById('quiz-progress').style.width = `${((currentQuiz) / quizData.length) * 100}%`;

        data.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt.text;
            btn.addEventListener('click', () => {
                if(opt.correct) quizScore += 50; // 50 pontos por acerto
                currentQuiz++;
                loadQuiz();
            });
            optionsDiv.appendChild(btn);
        });
    } else {
        endQuiz();
    }
}

function endQuiz() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('quiz-result').classList.remove('hidden');
    document.getElementById('quiz-final-score').innerText = `${pNameQuiz}, você fez ${quizScore} pontos no Quiz de Conhecimentos!`;
    
    saveAndRenderRanking('quizRanking', pNameQuiz, quizScore, 'quiz-ranking-list');
}

document.getElementById('btn-restart-quiz').addEventListener('click', () => {
    currentQuiz = 0; quizScore = 0;
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-setup').classList.remove('hidden');
});

// SISTEMA GLOBAL DE LOCALSTORAGE PARA RANKING
function saveAndRenderRanking(storageKey, name, score, elementId) {
    let ranking = JSON.parse(localStorage.getItem(storageKey)) || [];
    ranking.push({ name, score });
    // Ordena do maior para o menor
    ranking.sort((a, b) => b.score - a.score);
    // Salva apenas o top 5
    ranking = ranking.slice(0, 5);
    localStorage.setItem(storageKey, JSON.stringify(ranking));

    const listElement = document.getElementById(elementId);
    listElement.innerHTML = '';
    ranking.forEach((player, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${index + 1}º Lugar:</strong> ${player.name} — <span>${player.score} pts</span>`;
        listElement.appendChild(li);
    });
}