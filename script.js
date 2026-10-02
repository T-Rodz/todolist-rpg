// Estado inicial do jogador
let player = {
    level: 1,
    xp: 0,
    coins: 0,
    tasks: []
};

// Constantes do Jogo
const XP_PER_TASK = 20;
const COINS_PER_TASK = 5;
const XP_TO_LEVEL_UP = 100;

// Itens disponíveis na loja
const shopItems = [
    { name: "1 hora de PS5", price: 30 },
    { name: "Comer um lanche diferente", price: 50 },
    { name: "Comprar um equipamento novo", price: 300 }
];

// Carrega os dados ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('questLogData');
    if (savedData) {
        player = JSON.parse(savedData);
    }
    updateUI();
    renderTasks();
});

// Função para atualizar os textos e a barra de XP na tela
function updateUI() {
    document.getElementById('level-display').textContent = player.level;
    document.getElementById('coin-display').textContent = player.coins;
    document.getElementById('xp-display').textContent = player.xp;
    
    // Calcula a porcentagem da barra de XP
    const xpPercentage = (player.xp / XP_TO_LEVEL_UP) * 100;
    document.getElementById('xp-bar').style.width = `${xpPercentage}%`;


    renderShop();
}

// Salva os dados no navegador
function saveData() {
    localStorage.setItem('questLogData', JSON.stringify(player));
}

// Adiciona uma nova missão
function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();

    if (text !== "") {
        player.tasks.push(text);
        input.value = ""; // Limpa o campo
        saveData();
        renderTasks();
    }
}

// Completa uma missão e ganha recompensas
function completeTask(index) {
    // Remove a tarefa da lista
    player.tasks.splice(index, 1);
    
    // Ganha recompensas
    player.xp += XP_PER_TASK;
    player.coins += COINS_PER_TASK;

    // Lógica de subir de nível
    if (player.xp >= XP_TO_LEVEL_UP) {
        player.level++;
        player.xp = player.xp - XP_TO_LEVEL_UP; // Guarda o XP excedente
        alert(`🎉 LEVEL UP! Você alcançou o Nível ${player.level}!`);
    }

    saveData();
    renderTasks();
    updateUI();
}

// Desenha a lista de tarefas na tela
function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = ""; // Limpa a lista antes de desenhar

    player.tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        
        li.innerHTML = `
            <span>${task}</span>
            <button class="complete-btn" onclick="completeTask(${index})">Feito ✔</button>
        `;
        
        list.appendChild(li);
    });
}

// Desenha a loja na tela
function renderShop() {
    const shopList = document.getElementById('shop-list');
    shopList.innerHTML = "";

    shopItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'shop-item';
        
        // Verifica se o jogador tem dinheiro para comprar
        const canAfford = player.coins >= item.price;
        
        div.innerHTML = `
            <div class="shop-item-info">
                <strong>${item.name}</strong>
                <span>🪙 ${item.price}</span>
            </div>
            <button class="buy-btn" onclick="buyItem(${index})" ${!canAfford ? 'disabled' : ''}>
                Comprar
            </button>
        `;
        
        shopList.appendChild(div);
    });
}

// Lógica de comprar um item
function buyItem(index) {
    const item = shopItems[index];
    
    if (player.coins >= item.price) {
        player.coins -= item.price; // Desconta o valor
        alert(`🎉 Parabéns! Você resgatou: ${item.name}! Vá aproveitar sua recompensa.`);
        saveData();
        updateUI();
    } else {
        alert("Moedas insuficientes! Complete mais missões diárias.");
    }
}