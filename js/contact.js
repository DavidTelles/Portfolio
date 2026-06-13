emailjs.init({
    publicKey: "FbGZFtVABk8LhbEtq"
});

const form = document.getElementById("contactForm");
const feedback = document.getElementById("formFeedback");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    feedback.textContent = "Enviando mensagem...";

    try {
        await emailjs.send(
            "service_x0icszm",
            "template_y1dz7kj",
            {
                from_name: document.getElementById("name").value,
                from_email: document.getElementById("email").value,
                message: document.getElementById("message").value
            }
        );

        feedback.textContent = "✅ Mensagem enviada com sucesso!";
        form.reset();
    } catch (error) {
        console.error("ERRO COMPLETO:", error);
        console.error("STATUS:", error.status);
        console.error("TEXT:", error.text);
    
        feedback.textContent =
            "Erro ao enviar: " + error.text;
    }

    submitBtn.disabled = false;
});