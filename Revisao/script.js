const sensoresIniciais = [
  { id: 1, nome: "Sensor Galpão A", tipo: "Temperatura", valor: 24.5, unidade: "°C", status: "normal", historico: ["24.1 °C", "24.3 °C", "24.5 °C"] },
  { id: 2, nome: "Sensor Estufa 02", tipo: "Umidade", valor: 88.0, unidade: "%", status: "critico", historico: ["85.0 %", "86.5 %", "88.0 %"] },
  { id: 3, nome: "Sensor Compressor", tipo: "Pressão", valor: 6.2, unidade: "bar", status: "normal", historico: ["6.0 bar", "6.1 bar", "6.2 bar"] },
  { id: 4, nome: "Sensor Câmara Fria", tipo: "Temperatura", valor: -2.1, unidade: "°C", status: "normal", historico: ["-2.5 °C", "-2.3 °C", "-2.1 °C"] },
  { id: 5, nome: "Sensor Almoxarifado", tipo: "Umidade", valor: 45.5, unidade: "%", status: "normal", historico: ["44.0 %", "45.0 %", "45.5 %"] },
  { id: 6, nome: "Sensor Caldeira", tipo: "Temperatura", valor: 98.4, unidade: "°C", status: "critico", historico: ["95.0 °C", "97.2 °C", "98.4 °C"] }
];

const gridElement = document.getElementById("grid-sensores");
const filtroElement = document.getElementById("filtro-tipo");
const btnAtualizar = document.getElementById("botao-atualizar");
const timestampElement = document.getElementById("timestamp");

const modalHistorico = document.getElementById("modal-historico");
const modalTitulo = document.getElementById("modal-titulo");
const modalLista = document.getElementById("modal-lista-historico");
const modalFechar = document.getElementById("modal-fechar");

// Função para desenhar os cards na tela
function renderizarDashboard(lista) {
    // Limpa a tela antes de desenhar para não duplicar cards
    gridElement.innerHTML = "";

    // Percorre cada sensor da lista recebida
    lista.forEach(sensor => {
        // Define se deve adicionar a classe de alerta (vermelho)
        let classeAlerta = "";
        if (sensor.status === "critico") {
            classeAlerta = "card-alerta";
        }

        // Injeta o HTML do card diretamente dentro do container
        gridElement.innerHTML += `
            <div class="sensor-card ${classeAlerta}">
                <h3>${sensor.nome}</h3>
                <p>Tipo: ${sensor.tipo}</p>
                <h2>${sensor.valor} ${sensor.unidade}</h2>
                <button class="btn-historico" onclick="abrirHistorico(${sensor.id})">
                Ver Histórico
                </button>
            </div>
        `;
    });
}

// Função para filtrar os sensores pelo tipo selecionado
function aplicarFiltro() {
    const tipoSelecionado = filtroElement.value;

    if (tipoSelecionado === "Todos") {
        // Se escolheu "todos", renderiza todos os sensores
        renderizarDashboard(sensoresIniciais);
    } 
    else {
        // Usa o .filter() para criar uma nova lista apenas com os sensores do tipo selecionado
        const listaFiltrada = sensoresIniciais.filter(sensor => sensor.tipo === tipoSelecionado);

        // Desenha na tela apenas os sensores filtrados
        renderizarDashboard(listaFiltrada);
    }
}

// Função para atualizar o horário do rodapé (HH:MM:SS)
function atualizarHorario() {
    const agora = new Date();
    timestampElement.textContent = agora.toLocaleTimeString("pt-BR");
}

// Função para alterar levemente os valores dos sensores
function simularAtualizacao() {
    sensoresIniciais.forEach(sensor => {
        // Gera a variação aleatória
        const variacao = (Math.random() * 2 - 1);

        // Atualiza o valor atual do sensor
        sensor.valor = parseFloat((sensor.valor + variacao).toFixed(1));

        // Se o histórico não existir ainda, inicializa como um array vazio
        if (!sensor.historico) {
            sensor.historico = [];
        }

        // Guarda o novo valor aleatório no histórico do sensor, formatado com a unidade
        sensor.historico.push(`${sensor.valor} ${sensor.unidade}`);

        // Mantém apenas os últimos 10 valores 
        if (sensor.historico.length > 10) {
            sensor.historico.shift();
        }
    });

    // Re-aplica o filtro e atualiza o relógio
    aplicarFiltro();
    atualizarHorario();
}

// Função para abrir o modal e preencher com as leituras do sensor
function abrirHistorico(sensorId) {
    const sensor = sensoresIniciais.find(s => s.id === sensorId);
    
    if (sensor) {
        modalTitulo.textContent = `Histórico: ${sensor.nome}`;
        modalLista.innerHTML = "";

        // Adiciona cada leitura gravada na lista do modal
        sensor.historico.forEach((leitura, index) => {
            modalLista.innerHTML += `
                <li>
                    <span>Leitura ${index + 1}</span>
                    <strong>${leitura}</strong>
                </li>
            `;
        });

        modalHistorico.classList.remove("hidden");
    }
}

// Evento para fechar o modal no botão de fechar
modalFechar.addEventListener("click", () => {
    modalHistorico.classList.add("hidden");
});

// Evento para fechar o modal clicando na área escura (fora da caixa)
modalHistorico.addEventListener("click", (e) => {
    if (e.target === modalHistorico) {
        modalHistorico.classList.add("hidden");
    }
});

// Altera o estado do botão Online/Offline ao ser clicado, mudando a cor e o texto
const statusConexao = document.querySelector(".status-conexao");

statusConexao.addEventListener("click", () => {
    if (statusConexao.classList.contains("online")) {
        statusConexao.textContent = "● Offline";
        statusConexao.classList.remove("online");
        statusConexao.classList.add("offline");
    } else {
        statusConexao.textContent = "● Online";
        statusConexao.classList.remove("offline");
        statusConexao.classList.add("online");
    }
});

// Escutadores de Eventos (Event Listeners)

// Dispara o filtro sempre que mudar a opção no menu suspenso
filtroElement.addEventListener("change", aplicarFiltro);

// Dispara a atualização manual ao clicar no botão
btnAtualizar.addEventListener("click", simularAtualizacao);

// Primeira renderização assim que a página carrega
aplicarFiltro();

// Atualiza os dados automaticamente a cada 30 segundos (30000 ms)
setInterval(simularAtualizacao, 30000);