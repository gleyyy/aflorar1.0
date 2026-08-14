const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");

async function enviarMensagem() {
  const texto = input.value.trim();
  if (texto === "") return;

  const usuarioId =
  localStorage.getItem(
    "aflorar_usuario_id"
);

  // Renderiza mensagem do usuário
  const userMsg = document.createElement("div");
  userMsg.classList.add("message", "user");
  userMsg.innerHTML = `<p>${texto}</p>`;
  chatBox.appendChild(userMsg);

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
  input.disabled = true;
  sendBtn.disabled = true;

  // Loading
  const botLoading = document.createElement("div");
  botLoading.classList.add("message", "bot");
  botLoading.innerHTML = `<span class="avatar">🤖</span><p><em>Digitando...</em></p>`;
  chatBox.appendChild(botLoading);

  await supabase
.from("mensagens_flora")
.insert([{

    usuario_id: usuarioId,
    remetente:"usuario",
    mensagem:texto

}]);

  try {
    const response = await fetch("http://localhost:3000/api/flora", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem: texto }),
    });

    const data = await response.json();
    chatBox.removeChild(botLoading);

    if (data.resposta) {
      const botMsg = document.createElement("div");
      botMsg.classList.add("message", "bot");
      botMsg.innerHTML = `<span class="avatar">🤖</span><p>${data.resposta}</p>`;
      chatBox.appendChild(botMsg);
    } else {
      throw new Error(data.erro);
    }

    await supabase
.from("mensagens_flora")
.insert([{

    usuario_id: usuarioId,
    remetente:"flora",
    mensagem:data.resposta

}]);

  } catch (error) {
    console.error("Erro:", error);
    if (chatBox.contains(botLoading)) chatBox.removeChild(botLoading);

    const erroMsg = document.createElement("div");
    erroMsg.classList.add("message", "bot");
    erroMsg.innerHTML = `<span class="avatar">🤖</span><p>Desculpe, tive um probleminha técnico. Pode tentar de novo?</p>`;
    chatBox.appendChild(erroMsg);

  } finally {
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

sendBtn.addEventListener("click", enviarMensagem);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") enviarMensagem();
});