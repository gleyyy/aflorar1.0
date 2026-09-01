const form = document.getElementById("cadastroForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirmar").value;

    if (senha !== confirmar) {
        alert("As senhas não coincidem.");
        return;
    }

    // Cria o usuário no Supabase Auth
    const { data, error } =
        await supabaseClient.auth.signUp({
            email: email,
            password: senha
        });

    if (error) {
        alert(error.message);
        return;
    }

    // ID do usuário criado no Auth
    const usuarioId = data.user.id;

    // Salva os dados adicionais na tabela perfis
    const { error: perfilError } =
        await supabaseClient
            .from("perfis")
            .insert([{
                id: usuarioId,
                nome: nome
            }]);

    if (perfilError) {
        alert(perfilError.message);
        return;
    }

    alert("Cadastro realizado com sucesso!");

    // Redireciona para a página inicial
    window.location.href = "inicio.html";
});
