const questions = [
{
    question: "Como você se sente hoje?",
    options: [
        "😊 Alegre",
        "😢 Triste",
        "😰 Ansioso(a)",
        "😴 Cansado(a)",
        "😌 Calmo(a)"
    ]
},
{
    question: "O que mais combina com o seu corpo hoje?",
    options: [
        "⚡ Energia e disposição",
        "🙂 Batimento acelerado",
        "😐 Leveza e bem estar",
        "😪 Peso e cansaço",
        "😪 Tensão nos músculos"
    ]
},
{
    question: "E sua mente, como está?",
    options: [
        "🌟 cheia de pensamentos acelerados",
        "👍 Tranquila e serena",
        "😕 preocupada com algo",
        "💔 Meio confusa ou perdida",
        "💔 Focada e motivada"
    ]
    },
{
    question: "O que você mais precisa nesse momento?",
    options: [
        "⚡ Uma palavra de ânimo",
        "🙂 Relaxar e respirar fundo",
        "😐 Um momento de gratidão",
        "😪 Um tempo de oração",
        "😪 Conversar com alguém"
    ]
    },
{
     question: "Seus sentimentos parecem estar mais próximos de?",
    options: [
        "🌟 Alegria | Gratidão",
        "👍 Estresse | Irritação",
        "😕 Cansaço | Apatia",
        "💔 Tristeza | Desânimo",
        "💔 Ansiedade | Preocupação"
    ]
    },
];

const title = document.getElementById("questionTitle");
const optionsContainer = document.getElementById("optionsContainer");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

let currentQuestion = 0;
let selectedAnswer = null;
let answers = [];

function loadQuestion() {

    const q = questions[currentQuestion];

    title.textContent = q.question;

    optionsContainer.innerHTML = "";

    q.options.forEach(option => {

        const div = document.createElement("div");
        div.classList.add("option");
        div.textContent = option;

        div.addEventListener("click", () => {

            document.querySelectorAll(".option")
                .forEach(item => item.classList.remove("selected"));

            div.classList.add("selected");

            selectedAnswer = option;

            nextBtn.disabled = false;
        });

        optionsContainer.appendChild(div);
    });

    progressBar.style.width =
        ((currentQuestion + 1) / questions.length) * 100 + "%";

    nextBtn.disabled = true;
}

nextBtn.addEventListener("click", () => {

    answers.push({
        pergunta: questions[currentQuestion].question,
        resposta: selectedAnswer
    });

    currentQuestion++;

    if(currentQuestion < questions.length){

        loadQuestion();

    }else{

        showResults();
    }
});

function showResults(){

    const emocao = answers[0].resposta;
    const corpo = answers[1].resposta;

    let titulo = "";
    let mensagem = "";

    if (emocao.includes("😊 Alegre") && corpo.includes("⚡ Energia e disposição")) {

        titulo = "Você parece estar bem hoje! 😄";
        mensagem = "Continue cultivando hábitos que fortalecem seu bem-estar emocional.";

    } else if (emocao.includes("😢 Triste") && corpo.includes("😪 Peso e cansaço")) {

        titulo = "Percebemos que você está triste 😢";
        mensagem = "Tente conversar com alguém de confiança ou fazer uma atividade que lhe faça bem.";

    } else if (emocao.includes("😰 Ansioso(a)") && corpo.includes("🙂 Batimento acelerado")) {

        titulo = "Você demonstra sinais de ansiedade 😰";
        mensagem = "Respire fundo, organize suas tarefas e procure momentos de descanso.";

    } else if (
        emocao.includes("😴 Cansado(a)") &&
        (corpo.includes("😪 Peso e cansaço") ||
         corpo.includes("😪 Tensão nos músculos"))
    ) {

        titulo = "Seu corpo e mente podem estar precisando de descanso 😴";
        mensagem = "Considere reservar um tempo para relaxar e recuperar suas energias.";

    } else {

        titulo = "Você parece estar tranquilo(a) 😌";
        mensagem = "Que bom! Procure manter esse equilíbrio ao longo do dia.";
    }

    const acaoHTML = gerarAcao();

    document.querySelector(".quiz-card").innerHTML = `
        <div class="result">
            <h2>${titulo}</h2>
            <p>${mensagem}</p>

            <hr style="margin:20px 0">

            ${acaoHTML}
        </div>
    `;

    iniciarRespiracao();
}
function gerarAcao() {

    const necessidade = answers[3].resposta;

    let titulo = "";
    let mensagem = "";
    let conteudoExtra = "";

    const frasesAnimo = [
        "A persistência realiza o impossível.",
        "Você é mais forte do que imagina.",
        "Grandes conquistas começam com pequenos passos.",
        "Cada dia é uma nova oportunidade para recomeçar.",
        "Seu esforço de hoje constrói o seu amanhã.",
        "Continue avançando, mesmo que devagar."
    ];

    const gratidao = [
        "Agradeça pela sua vida e pelas oportunidades de um novo dia.",
        "Agradeça pelas pessoas que se importam com você.",
        "Agradeça pelos aprendizados que teve até aqui.",
        "Agradeça pelo seu corpo e por tudo o que ele faz por você.",
        "Agradeça pelos momentos felizes que já viveu.",
        "Agradeça pela chance de continuar crescendo e evoluindo."
    ];

    const oracao = [
        "Ore por paz interior e equilíbrio emocional.",
        "Ore pelas pessoas que você ama.",
        "Ore por sabedoria para enfrentar desafios.",
        "Ore por saúde, proteção e bem-estar.",
        "Ore por gratidão pelas coisas boas da vida.",
        "Ore por esperança e força para seguir em frente."
    ];

    if (necessidade.includes("⚡ Uma palavra de ânimo")) {

        titulo = "✨ Palavra de ânimo";
        mensagem = frasesAnimo[Math.floor(Math.random() * frasesAnimo.length)];

    } else if (necessidade.includes("🙂 Relaxar e respirar fundo")) {

        titulo = "🌿 Momento de Respiração";
        mensagem = "Siga o exercício abaixo e acompanhe o círculo.";

       conteudoExtra = `
    <div class="respiracao">
        <div class="circulo-container">
            <div class="circulo"></div>
        </div>

        <p id="instrucao">Prepare-se...</p>
        <p id="contador">3</p>
    </div>
`;

    } else if (necessidade.includes("😐 Um momento de gratidão")) {

        titulo = "🙏 Momento de Gratidão";
        mensagem = gratidao[Math.floor(Math.random() * gratidao.length)];

    } else if (necessidade.includes("😪 Um tempo de oração")) {

        titulo = "🤲 Sugestão para sua oração";
        mensagem = oracao[Math.floor(Math.random() * oracao.length)];

    } else if (necessidade.includes("😪 Conversar com alguém")) {

        titulo = "💬 Você não precisa enfrentar tudo sozinho";
        mensagem = `
            Conversar pode ajudar muito.<br><br>
            • Falar com um amigo ou familiar de confiança;<br>
            • Procurar apoio psicológico profissional;<br>
            • Buscar grupos de apoio da sua comunidade.
        `;
    }

    return `
        <h3>${titulo}</h3>
        <p>${mensagem}</p>
        ${conteudoExtra}
    `;
}
function iniciarRespiracao() {

    const instrucao = document.getElementById("instrucao");
    const contador = document.getElementById("contador");
    const circulo = document.querySelector(".circulo");

    if (!instrucao || !contador || !circulo) return;

    let preparacao = 3;

    instrucao.textContent = "Prepare-se...";
    contador.textContent = preparacao;

    const contagemInicial = setInterval(() => {

        preparacao--;

        if (preparacao > 0) {

            contador.textContent = preparacao;

        } else {

            clearInterval(contagemInicial);

            iniciarCiclo();
        }

    }, 1000);

    function iniciarCiclo() {

        const etapas = [
            {
                texto: "🌬️ Inspire",
                classe: "inspirar",
                segundos: 4
            },
            {
                texto: "⏸️ Segure",
                classe: "segurar",
                segundos: 8
            },
            {
                texto: "🍃 Expire",
                classe: "expirar",
                segundos: 7
            }
        ];

        let indice = 0;

        function executarEtapa() {

            const etapa = etapas[indice];

            circulo.classList.remove(
                "inspirar",
                "segurar",
                "expirar"
            );

            circulo.classList.add(etapa.classe);

            instrucao.textContent = etapa.texto;

            let restante = etapa.segundos;

            contador.textContent = restante;

            const cronometro = setInterval(() => {

                restante--;

                contador.textContent = restante;

                if (restante <= 0) {

                    clearInterval(cronometro);

                    indice = (indice + 1) % etapas.length;

                    executarEtapa();
                }

            }, 1000);
        }

        executarEtapa();
    }
}

loadQuestion();