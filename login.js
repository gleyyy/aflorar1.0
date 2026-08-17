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
