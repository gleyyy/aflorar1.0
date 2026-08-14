document
.querySelector("form")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    const { data, error } =
        await supabase.auth.signInWithPassword({

            email,
            password: senha

        });

    if(error){

        alert("Email ou senha inválidos");
        return;

    }

    const { data:perfil } =
        await supabase
        .from("perfis")
        .select("*")
        .eq("id", data.user.id)
        .single();

    localStorage.setItem(
        "usuario",
        JSON.stringify(perfil)
    );

    localStorage.setItem(
        "aflorar_usuario_id",
        data.user.id
    );

    window.location.href =
        "inicio.html";

});