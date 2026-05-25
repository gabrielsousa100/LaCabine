// Mensagem quando clicar nos botões

const botoes = document.querySelectorAll(".btn-dark");

botoes.forEach(botao => {

    botao.addEventListener("click", () => {

        alert("Mais informações em breve!");

    });

});