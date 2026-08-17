const form =
    document.getElementById("cadastroForm");

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const nome =
            document.getElementById("nome").value;

        const email =
            document.getElementById("email").value;

        const senha =
            document.getElementById("senha").value;

        const confirmar =
            document.getElementById("confirmar").value;

        if(senha !== confirmar){

            alert("As senhas não coincidem.");
            return;

        }

        const { data, error } =
            await supabase.auth.signUp({

                email,
                password: senha

            });

        if(error){

            alert(error.message);
            return;

        }

        const usuarioId =
            data.user.id;

        await supabase
        .from("perfis")
        .insert([{

            id: usuarioId,
            nome

        }]);

        alert(
            "Cadastro realizado com sucesso!"
        );

        window.location.href =
            "login.html";

    }
);
