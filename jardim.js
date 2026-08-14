(function(){
  "use strict";

  const TOTAL_SLOTS = 6; // 3x2 grid, last slot can be the "+" button

  // ---------- estado ----------
  let usuarioId = localStorage.getItem("aflorar_usuario_id");
  let canteiros = []; // [{id, usuario_id, nome, nivel, posicao}]
  let editingId = null; // null = criando novo

  // ---------- elementos ----------
  const grid = document.getElementById("garden-grid");
  const loadingOverlay = document.getElementById("loading-overlay");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalTitle = document.getElementById("modal-title");
  const modalSub = document.getElementById("modal-sub");
  const inputNome = document.getElementById("input-nome");
  const fieldNivel = document.getElementById("field-nivel");
  const levelPicker = document.getElementById("level-picker");
  const modalError = document.getElementById("modal-error");
  const btnSave = document.getElementById("btn-save");
  const btnCancel = document.getElementById("btn-cancel");
  const toastEl = document.getElementById("toast");
  const sideCard = document.getElementById("side-card");
  const sideCardTitle = document.getElementById("side-card-title");
  const sideCardBody = document.getElementById("side-card-body");
  const closeCard = document.getElementById("close-card");

  let selectedLevel = 1;

  // ---------- utilidades ----------
  function showToast(msg, type){
    toastEl.textContent = msg;
    toastEl.className = "toast show" + (type ? " " + type : "");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { toastEl.className = "toast"; }, 3200);
  }

  function setLoading(isLoading){
    loadingOverlay.style.opacity = isLoading ? "1" : "0";
    loadingOverlay.style.pointerEvents = isLoading ? "auto" : "none";
  }

  function levelStarsSVG(nivel){
    let html = "";
    for(let i=1;i<=5;i++){
      html += `<svg viewBox="0 0 24 24" fill="${i<=nivel ? '#F0A868' : 'rgba(255,255,255,0.6)'}" stroke="none"><polygon points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18 5.5,22 7,14.5 2,9.5 9,9"/></svg>`;
    }
    return html;
  }

  function planterSVG(){
    return `
      <svg viewBox="0 0 170 88">
        <defs>
          <linearGradient id="boxFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--canteiro-claro)"/>
            <stop offset="100%" stop-color="var(--canteiro)"/>
          </linearGradient>
        </defs>
        <polygon points="10,28 160,28 145,84 25,84" fill="url(#boxFront)"/>
        <polygon points="10,28 160,28 150,12 20,12" fill="var(--canteiro-claro)"/>
        <polygon points="20,12 150,12 145,28 25,28" fill="var(--canteiro-escuro)" opacity="0.55"/>
      </svg>
    `;
  }

  // ---------- render ----------
  function renderGrid(){
    grid.innerHTML = "";

    for(let pos = 1; pos <= TOTAL_SLOTS; pos++){
      const slot = document.createElement("div");
      slot.className = "plot-slot";

      const canteiro = canteiros.find(c => c.posicao === pos);

      if(canteiro){
        const el = document.createElement("div");
        el.className = "planter";
        el.dataset.id = canteiro.id;
        el.innerHTML = `
          <div class="planter-box">${planterSVG()}</div>
          <div class="planter-name">${escapeHTML(canteiro.nome)}</div>
          <div class="planter-level">${levelStarsSVG(canteiro.nivel || 1)}</div>
        `;
        el.addEventListener("click", () => openEditModal(canteiro));
        slot.appendChild(el);
      } else {
        const nextPos = getNextAvailablePosition();
        if(pos === nextPos){
          const addBtn = document.createElement("div");
          addBtn.className = "add-plot";
          addBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>`;
          addBtn.addEventListener("click", () => openCreateModal(pos));
          slot.appendChild(addBtn);
        }
      }

      grid.appendChild(slot);
    }
  }

  function getNextAvailablePosition(){
    const usadas = new Set(canteiros.map(c => c.posicao));
    for(let i=1;i<=TOTAL_SLOTS;i++){
      if(!usadas.has(i)) return i;
    }
    return null;
  }

  function escapeHTML(str){
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------- API ----------
 async function carregarCanteiros(){

    if(!usuarioId){

        canteiros = [];
        renderGrid();
        return;

    }

    setLoading(true);

    try{

        const { data, error } =
            await supabase
            .from("jardins")
            .select("*")
            .eq("usuario_id", usuarioId)
            .order("posicao");

        if(error){
            throw error;
        }

        canteiros = data || [];
        renderGrid();

    }catch(error){

        console.error(error);
        showToast(
            "Erro ao carregar jardim",
            "error"
        );

    }finally{

        setLoading(false);

    }

}
 async function criarCanteiro(
    nome,
    posicao
){

    const { data, error } =
        await supabase
        .from("jardins")
        .insert([{

            usuario_id: usuarioId,
            nome,
            nivel:1,
            posicao

        }])
        .select()
        .single();

    if(error)
        throw error;

    return {
        canteiro:data
    };

}

async function atualizarCanteiro(
    id,
    updates
){

    const { data, error } =
        await supabase
        .from("jardins")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if(error){
        throw error;
    }

    return {
        canteiro: data
    };

}

  // ---------- modal ----------
  function openCreateModal(posicao){
    editingId = null;
    modalTitle.textContent = "Novo canteiro";
    modalSub.textContent = "Dê um nome para o seu novo canteiro 🌱";
    inputNome.value = "";
    fieldNivel.style.display = "none";
    btnSave.textContent = "Criar";
    modalError.classList.remove("show");
    modalBackdrop.dataset.posicao = posicao;
    modalBackdrop.classList.add("show");
    setTimeout(() => inputNome.focus(), 200);
  }

  function openEditModal(canteiro){
    editingId = canteiro.id;
    modalTitle.textContent = "Editar canteiro";
    modalSub.textContent = "Atualize o nome e o nível do seu canteiro";
    inputNome.value = canteiro.nome;
    fieldNivel.style.display = "block";
    selectLevel(canteiro.nivel || 1);
    btnSave.textContent = "Salvar alterações";
    modalError.classList.remove("show");
    modalBackdrop.classList.add("show");
    setTimeout(() => inputNome.focus(), 200);
  }

  function closeModal(){
    modalBackdrop.classList.remove("show");
    editingId = null;
  }

  function selectLevel(n){
    selectedLevel = n;
    [...levelPicker.children].forEach(star => {
      star.classList.toggle("active", Number(star.dataset.level) === n);
    });
  }

  levelPicker.addEventListener("click", (e) => {
    const star = e.target.closest(".level-star");
    if(!star) return;
    selectLevel(Number(star.dataset.level));
  });

  btnCancel.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if(e.target === modalBackdrop) closeModal();
  });

  btnSave.addEventListener("click", async () => {
    const nome = inputNome.value.trim();
    if(!nome){
      modalError.textContent = "Digite um nome para o canteiro.";
      modalError.classList.add("show");
      return;
    }
    modalError.classList.remove("show");
    btnSave.disabled = true;
    const textoOriginal = btnSave.textContent;
    btnSave.textContent = "Salvando...";

    try{
      if(editingId){
        const atualizado = await atualizarCanteiro(editingId, { nome, nivel: selectedLevel });
        const idx = canteiros.findIndex(c => c.id === editingId);
        if(idx > -1){
          canteiros[idx] = { ...canteiros[idx], nome, nivel: selectedLevel, ...(atualizado.canteiro || {}) };
        }
        showToast("Canteiro atualizado!", "success");
      } else {
        const posicao = Number(modalBackdrop.dataset.posicao);
        const criado = await criarCanteiro(nome, posicao);
        const novo = criado.canteiro || criado;
        canteiros.push({
          id: novo.id,
          usuario_id: usuarioId,
          nome,
          nivel: 1,
          posicao
        });
        showToast("Canteiro criado!", "success");
      }
      renderGrid();
      closeModal();
    }catch(err){
      console.error(err);
      modalError.textContent = "Não foi possível salvar. Tente novamente.";
      modalError.classList.add("show");
    }finally{
      btnSave.disabled = false;
      btnSave.textContent = textoOriginal;
    }
  });

  // clique no canteiro leva à página de detalhes (preparado, sem navegar de fato ainda)
  function irParaDetalhes(id){
    // window.location.href = `/canteiro.html?id=${id}`;
    console.log("Navegar para detalhes do canteiro", id);
  }

  // ---------- side cards ----------
  const cardContent = {
    loja: { title: "Loja", body: "Em breve você poderá comprar sementes, adubos e decorações para o seu jardim aqui." },
    cofre: { title: "Cofre", body: "Guarde suas sementes e itens especiais. Em breve." },
    config: { title: "Configurações", body: "Ajustes de conta, notificações e preferências. Em breve." }
  };

  document.querySelectorAll(".side-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.card;
      const content = cardContent[key] || { title: "", body: "" };
      sideCardTitle.textContent = content.title;
      sideCardBody.textContent = content.body;
      sideCard.classList.add("show");
    });
  });
  closeCard.addEventListener("click", () => sideCard.classList.remove("show"));

  document.getElementById("btn-perfil").addEventListener("click", () => {
    sideCardTitle.textContent = "Perfil";
    sideCardBody.textContent = "Suas informações de conta aparecerão aqui.";
    sideCard.classList.add("show");
  });

  // ---------- fence ----------
  (function buildFence(){
    const fence = document.getElementById("fence");
    const count = 40;
    for(let i=0;i<count;i++){
      const picket = document.createElement("div");
      picket.className = "picket";
      fence.appendChild(picket);
    }
  })();

  // ---------- nav arrows (placeholder pagination) ----------
  document.getElementById("btn-prev").addEventListener("click", () => showToast("Você já está na primeira página do jardim."));
  document.getElementById("btn-next").addEventListener("click", () => showToast("Mais espaços de jardim em breve!"));

  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  // ---------- init ----------
  carregarCanteiros();

  // expõe funções úteis para debug/dev
  window.Aflorar = { carregarCanteiros, irParaDetalhes };

})();