const { createClient } = window.supabase;

const supabaseClient = createClient(
    "https://atnfazrohqgsgrzuyzup.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0bmZhenJvaHFnc2dyenV5enVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNDkyNTgsImV4cCI6MjEwMTkyNTI1OH0.JTXEgmCIBWA23M9k62-7x4OKmBJQ7ZVtPhyeUrMeQcU"
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
