const { createClient } = window.supabase;

const supabaseClient = createClient(
    "SUA_URL_DO_SUPABASE",
    "SUA_CHAVE_ANON"
);

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: senha
        });

    if (error) {
        console.error(error);
        alert("Login inválido");
        return;
    }

    localStorage.setItem(
        "aflorar_usuario_id",
        data.user.id
    );

    alert("Login realizado!");

    window.location.href = "inicio.html";
});
const form =
    document.getElementById("loginForm");

form.addEventListener(
    "submit",
    async (e) => {

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

            alert("Login inválido");
            return;

        }

        localStorage.setItem(
            "aflorar_usuario_id",
            data.user.id
        );

        alert("Login realizado!");

        window.location.href =
            "inicio.html";

    }
);
