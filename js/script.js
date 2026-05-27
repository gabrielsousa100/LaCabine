const botoes = document.querySelectorAll(".btn-red-pill");

botoes.forEach(botao => {
    botao.addEventListener("click", (e) => {
        e.preventDefault();
        const card = e.target.closest('.card');
        let servico = "";
        if (card) {
            const titulo = card.querySelector('.card-title');
            if (titulo) servico = titulo.innerText;
        }
        const numeroWhatsApp = "5511959507336"; 
        let mensagem = "Olá! Gostaria de mais informações sobre os serviços da LaCabine.";
        if (servico) {
            mensagem = `Olá! Gostaria de solicitar um orçamento para o serviço: *${servico}*.`;
        }
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    });
});
const imagensGaleria = document.querySelectorAll(".img-fluid.rounded");
if (imagensGaleria.length > 0) {
    const overlay = document.createElement("div");
    overlay.classList.add("lightbox-overlay");
    overlay.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <img class="lightbox-img" src="" alt="Imagem Ampliada">
    `;
    document.body.appendChild(overlay);
    const lightboxImg = overlay.querySelector(".lightbox-img");
    const lightboxClose = overlay.querySelector(".lightbox-close");

    imagensGaleria.forEach(img => {
        img.style.cursor = "pointer";
        img.addEventListener("click", () => {
            lightboxImg.src = img.src;
            overlay.classList.add("active");
        });
    });
    lightboxClose.addEventListener("click", () => {
        overlay.classList.remove("active");
    });
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.classList.remove("active");
        }
    });
}