const diasContainer = document.getElementById("dias");
function gerarSemana() {

    diasContainer.innerHTML = "";

    const hoje = new Date();

    const diasSemana = [
        "Dom",
        "Seg",
        "Ter",
        "Qua",
        "Qui",
        "Sex",
        "Sáb"
    ];

    const diaAtualSemana = hoje.getDay();

    const domingo = new Date(hoje);
    domingo.setDate(hoje.getDate() - diaAtualSemana);

    for (let i = 0; i < 7; i++) {

        const dia = new Date(domingo);
        dia.setDate(domingo.getDate() + i);

        const data = dia.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit"
        });

        const emojiSalvo = localStorage.getItem(data) || "🙂";

        diasContainer.innerHTML += `
            <div class="dia">
                <div>${diasSemana[i]}</div>
                <div>${data}</div>
                <div class="emoji">${emojiSalvo}</div>
            </div>
        `;
    }
}
gerarSemana();

const overlay = document.getElementById("overlay");

function abrirModal() {
    overlay.classList.remove("hidden");
}

function fecharModal() {
    overlay.classList.add("hidden");
}

function voltar() {
    fecharModal();
}

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        fecharModal();
    }
});

async function selecionar(emoji){

    const usuarioId =
        localStorage.getItem(
            "aflorar_usuario_id"
        );

    const hoje =
        new Date()
        .toISOString()
        .split("T")[0];

    await supabase
    .from("emocoes")
    .upsert([{

        usuario_id: usuarioId,
        emoji,
        data_registro: hoje

    }]);

    voltar();

    gerarSemana();

}

const links = document.querySelectorAll(".menu a");

links.forEach(link => {
  link.addEventListener("click", () => {
    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

function toggleAjuda() {
  const painel = document.getElementById("painel-ajuda");
  painel.classList.toggle("hidden");
}

// Ir para a tela do quiz
function abrirQuiz() {
    window.location.href = "../FrontEnd/quiz.html";
}

const btnChat = document.getElementById("btnChat");

// Ir para a tela do chat
btnChat.addEventListener("click", () => {
    window.location.href = "chat.html";
});

// criando um banco de emoções para o card humor atual

const emocoes = {
    "😊": {
        nome: "Feliz",
        descricao: "A felicidade é um estado subjetivo de bem-estar caracterizado por emoções positivas, satisfação com a vida e um sentimento de propósito."
    },

    "😁": {
        nome: "Radiante",
        descricao: "Você está experimentando um momento de grande entusiasmo, alegria e energia positiva."
    },

    "😐": {
        nome: "Neutro",
        descricao: "Você está em um estado emocional equilibrado, sem emoções intensas predominando no momento."
    },

    "😠": {
        nome: "Irritado",
        descricao: "A irritação pode surgir quando algo gera desconforto, frustração ou sensação de injustiça."
    },

    "😢": {
        nome: "Triste",
        descricao: "A tristeza é uma emoção natural diante de perdas, dificuldades ou situações que causam sofrimento emocional."
    },

    "😰": {
        nome: "Ansioso",
        descricao: "A ansiedade costuma aparecer diante de preocupações, incertezas ou expectativas sobre o futuro."
    },

    "😵": {
        nome: "Estressado",
        descricao: "O estresse surge quando as demandas parecem maiores do que os recursos disponíveis para lidar com elas."
    },

    "😞": {
        nome: "Depressivo",
        descricao: "Sentimentos persistentes de desânimo, falta de energia ou perda de interesse podem indicar um estado depressivo."
    },

    "😟": {
        nome: "Inseguro",
        descricao: "A insegurança está relacionada a dúvidas sobre si mesmo, suas capacidades ou decisões."
    },

    "😴": {
        nome: "Cansado",
        descricao: "O cansaço pode ser físico, mental ou emocional e sinaliza a necessidade de descanso e recuperação."
    },

    "😶": {
        nome: "Desmotivado",
        descricao: "A desmotivação pode surgir quando objetivos parecem distantes ou quando falta energia para agir."
    },

    "😧": {
        nome: "Preocupado",
        descricao: "A preocupação é uma resposta comum diante de situações que parecem incertas ou desafiadoras."
    }
};

// abrindo modal de humor atual
const cardHumor = document.getElementById("cardHumor");
const modalHumor = document.getElementById("modalHumor");

cardHumor.addEventListener("click", abrirHumor);

// Função para mostrar a emoção do dia

function abrirHumor() {

    const hoje = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit"
    });

    const emoji = localStorage.getItem(hoje);

    if (!emoji) {
        alert("Você ainda não registrou uma emoção hoje.");
        return;
    }

    const emocao = emocoes[emoji];

    document.getElementById("emojiHumor").textContent = emoji;
    document.getElementById("tituloHumor").textContent = emocao.nome;
    document.getElementById("descricaoHumor").textContent = emocao.descricao;

    modalHumor.classList.remove("hidden");
}

// Fechando modal
function fecharHumor() {
    modalHumor.classList.add("hidden");
}

modalHumor.addEventListener("click", (e) => {
    if (e.target === modalHumor) {
        fecharHumor();
    }
});

// Troca das palavras de ânimo
const frases = [
    "A persistência realiza o impossível.",
    "Você é mais forte do que imagina.",
    "Pequenos passos levam a grandes conquistas.",
    "Cada dia é uma nova oportunidade.",
    "Seu esforço de hoje é o sucesso de amanhã.",
    "Continue, você está evoluindo.",
    "Acredite no seu potencial."
];

const card = document.getElementById("cardFrase");
const botao = document.getElementById("btnAnimo");
const texto = document.getElementById("textoFrase");

function trocarFrase() {
    const indiceAleatorio = Math.floor(Math.random() * frases.length);
    texto.textContent = frases[indiceAleatorio];
}

// Clique no card
card.addEventListener("click", trocarFrase);

// Clique no botão
botao.addEventListener("click", trocarFrase);
