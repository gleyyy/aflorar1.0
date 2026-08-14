import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());



/* ==========================
   FLORA
========================== */

const INSTRUCAO_FLORA = `
Você é a Flora, assistente virtual da plataforma Aflorar.

Personalidade:
- Empática e acolhedora
- Usa linguagem leve
- Respostas curtas
- Usa emojis com moderação 🌱

Limites importantes:
- Nunca diagnostica doenças
- Nunca prescreve remédios
- Em crises graves, sugere o CVV (188)
`;

app.post("/api/flora", async (req, res) => {

    const { mensagem } = req.body;

    if (!mensagem) {

        return res.status(400).json({
            erro: "Mensagem não fornecida."
        });

    }

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{
                            text: INSTRUCAO_FLORA
                        }]
                    },
                    contents: [{
                        parts: [{
                            text: mensagem
                        }]
                    }]
                })
            }
        );

        const data = await response.json();

        const resposta =
            data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!resposta) {
            throw new Error("Resposta inválida da API");
        }

        res.json({
            resposta
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: "Erro ao processar sua mensagem."
        });

    }

});

/* ==========================
   SERVIDOR
========================== */

app.listen(process.env.PORT || 3000, () => {

    console.log(
        `Servidor rodando na porta ${
            process.env.PORT || 3000
        }`
    );

});