// ======================================
// BOTÕES DE SERVIÇOS (CARDS) -> WHATSAPP
// ======================================
const botoes = document.querySelectorAll(".btn-red-pill");

botoes.forEach(botao => {
    botao.addEventListener("click", (e) => {
        // Aplica o comportamento apenas se o botão NÃO for o do formulário principal
        if (e.target.closest('form')) return;

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

// ======================================
// LIGHTBOX DA GALERIA
// ======================================
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

// ======================================
// MÁSCARA CELULAR / WHATSAPP NO FORMULÁRIO
// ======================================
const telInput = document.getElementById('telefone');
if (telInput) {
    telInput.addEventListener('input', function(e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
}

// ======================================
// MÁSCARA CPF / CNPJ
// ======================================
const cpfCnpjInput = document.getElementById("cpfCnpj");

if (cpfCnpjInput) {
    cpfCnpjInput.addEventListener("input", () => {
        let valor = cpfCnpjInput.value.replace(/\D/g, "");

        if (valor.length <= 11) {
            valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
            valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
            valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        } else {
            valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
            valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
            valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
            valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
        }

        cpfCnpjInput.value = valor;
    });
}

// ======================================
// FUNÇÃO VALIDAR CPF
// ======================================
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf))
        return false;

    let soma = 0;

    for (let i = 0; i < 9; i++)
        soma += parseInt(cpf.charAt(i)) * (10 - i);

    let resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11)
        resto = 0;

    if (resto !== parseInt(cpf.charAt(9)))
        return false;

    soma = 0;

    for (let i = 0; i < 10; i++)
        soma += parseInt(cpf.charAt(i)) * (11 - i);

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11)
        resto = 0;

    return resto === parseInt(cpf.charAt(10));
}

// ======================================
// FUNÇÃO VALIDAR CNPJ
// ======================================
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');

    if (cnpj.length !== 14)
        return false;

    if (/^(\d)\1+$/.test(cnpj))
        return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);

    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

    if (resultado != digitos.charAt(0))
        return false;

    tamanho++;
    numeros = cnpj.substring(0, tamanho);

    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

    return resultado == digitos.charAt(1);
}

// ======================================
// CONSULTA VIA CEP
// ======================================
const cepInput = document.getElementById("cep");
const cepMsg = document.getElementById("cepMsg");

if (cepInput) {
    cepInput.addEventListener("input", () => {
        let cep = cepInput.value.replace(/\D/g, "");
        cep = cep.replace(/^(\d{5})(\d)/, "$1-$2");
        cepInput.value = cep;
    });

    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, "");

        if (cep.length !== 8) {
            if(cepMsg) cepMsg.innerText = "CEP inválido";
            return;
        }

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await resposta.json();

            if (dados.erro) {
                if(cepMsg) cepMsg.innerText = "CEP não encontrado";
                return;
            }

            if(cepMsg) cepMsg.innerText = "";

            document.getElementById("rua").value = dados.logradouro || "";
            document.getElementById("bairro").value = dados.bairro || "";
            document.getElementById("cidade").value = dados.localidade || "";
            document.getElementById("estado").value = dados.uf || "";

        } catch {
            if(cepMsg) cepMsg.innerText = "Erro ao consultar CEP";
        }
    });
}

// ======================================
// FORMULÁRIO -> ENVIO DA MENSAGEM WHATSAPP
// ======================================
const formulario = document.querySelector("form");

if (formulario) {
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        const documento = document.getElementById("cpfCnpj").value;
        const numeros = documento.replace(/\D/g, "");

        let documentoValido = false;

        if (numeros.length === 11)
            documentoValido = validarCPF(numeros);

        if (numeros.length === 14)
            documentoValido = validarCNPJ(numeros);

        if (!documentoValido) {
            alert("Por favor, insira um CPF ou CNPJ válido.");
            return;
        }

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const dataEvento = document.getElementById("dataEvento").value;
        const tipoEvento = document.getElementById("tipoEvento").value;
        const convidados = document.getElementById("convidados").value;
        const horasEvento = document.getElementById("horasEvento").value;
        const qtdAtracoes = document.getElementById("qtdAtracoes").value;
        const atracaoPrincipal = document.getElementById("atracaoPrincipal").value;
        const localEvento = document.getElementById("localEvento").value;

        const cep = document.getElementById("cep").value;
        const rua = document.getElementById("rua").value;
        const numero = document.getElementById("numero").value;
        const bairro = document.getElementById("bairro").value;
        const cidade = document.getElementById("cidade").value;
        const estado = document.getElementById("estado").value;

        const mensagem = document.getElementById("mensagem").value;

        const texto = `
*SOLICITAÇÃO DE ORÇAMENTO - LACABINE*

👤 Nome: ${nome}
📧 E-mail: ${email}
📱 Telefone: ${telefone}
🪪 CPF/CNPJ: ${documento}

📅 Data: ${dataEvento}
🎉 Tipo: ${tipoEvento}
👥 Convidados: ${convidados}
⏱ Horas: ${horasEvento}
🎭 Quantidade de atrações: ${qtdAtracoes}
⭐ Atração principal: ${atracaoPrincipal}

📍 Local: ${localEvento}

🏠 Endereço:
CEP: ${cep}
Rua: ${rua}
Nº: ${numero}
Bairro: ${bairro}
Cidade: ${cidade}
Estado: ${estado}

📝 Observações:
${mensagem || 'Nenhuma'}
`;

        const numeroWhatsApp = "5511959507336";

        window.open(
            `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`,
            "_blank"
        );
    });
}