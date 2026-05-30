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
const telInput = document.getElementById('campo-whatsapp');
if (telInput) {
    telInput.addEventListener('input', function(e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
}

// ======================================
// MÁSCARA CPF / CNPJ
// ======================================
const cpfCnpjInput = document.getElementById("campo-documento");

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
const cepInput = document.getElementById("campo-cep");

if (cepInput) {
    cepInput.addEventListener("input", () => {
        let cep = cepInput.value.replace(/\D/g, "");
        cep = cep.replace(/^(\d{5})(\d)/, "$1-$2");
        cepInput.value = cep;
    });

    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, "");
        const campoEndereco = document.getElementById("campo-endereco");
        const divFeedback = cepInput.nextElementSibling; // Pega o .invalid-feedback

        if (cep.length !== 8) {
            cepInput.classList.add("is-invalid");
            return;
        }

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await resposta.json();

            if (dados.erro) {
                cepInput.classList.add("is-invalid");
                if (campoEndereco) campoEndereco.value = "";
                return;
            }

            cepInput.classList.remove("is-invalid");
            
            // Como no novo HTML o endereço é um campo só, concatenamos as informações de forma limpa
            if (campoEndereco) {
                let enderecoCompleto = "";
                if (dados.logradouro) enderecoCompleto += `${dados.logradouro}, `;
                if (dados.bairro) enderecoCompleto += `${dados.bairro}, `;
                if (dados.localidade) enderecoCompleto += `${dados.localidade}`;
                if (dados.uf) enderecoCompleto += ` - ${dados.uf}`;
                
                campoEndereco.value = enderecoCompleto;
            }

        } catch {
            cepInput.classList.add("is-invalid");
        }
    });
}

// ======================================
// FORMULÁRIO -> ENVIO DA MENSAGEM WHATSAPP
// ======================================
const formulario = document.getElementById("form-orcamento");

if (formulario) {
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        // 1. Validação de CPF/CNPJ
        const documento = document.getElementById("campo-documento").value;
        const numerosDocumento = documento.replace(/\D/g, "");
        let documentoValido = false;

        if (numerosDocumento.length === 11) {
            documentoValido = validarCPF(numerosDocumento);
        } else if (numerosDocumento.length === 14) {
            documentoValido = validarCNPJ(numerosDocumento);
        }

        const inputDoc = document.getElementById("campo-documento");
        if (!documentoValido) {
            inputDoc.classList.add("is-invalid");
            alert("Por favor, insira um CPF ou CNPJ válido.");
            return;
        } else {
            inputDoc.classList.remove("is-invalid");
        }

        // 2. Validação de Checkboxes (Atrações)
        const checkboxesMarcados = document.querySelectorAll(".atracao-check:checked");
        const erroAtracoes = document.getElementById("erro-atracoes");

        if (checkboxesMarcados.length === 0) {
            if (erroAtracoes) erroAtracoes.classList.remove("d-none");
            alert("Selecione pelo menos uma atração.");
            return;
        } else {
            if (erroAtracoes) erroAtracoes.classList.add("d-none");
        }

        // Mapeia os valores selecionados para uma string limpa separada por vírgulas
        const listaAtracoes = Array.from(checkboxesMarcados).map(cb => cb.value).join(", ");

        // 3. Validação de Data Futura e Antecedência Mínima
        const dataEvento = document.getElementById("campo-data").value;
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataSelecionada = new Date(dataEvento);

        if (dataSelecionada < hoje) {
            alert("Selecione uma data futura.");
            return;
        }

        const diferencaDias = (dataSelecionada - hoje) / (1000 * 60 * 60 * 24);
        if (diferencaDias < 7) {
            alert("Solicitações devem ser feitas com pelo menos 7 dias de antecedência.");
            return;
        }

        // 4. Captura dos demais valores atualizados do HTML
        const nome = document.getElementById("campo-nome").value;
        const email = document.getElementById("campo-email").value;
        const telefone = document.getElementById("campo-whatsapp").value;
        const tipoEventoSelect = document.getElementById("campo-tipo-evento");
        const tipoEvento = tipoEventoSelect.options[tipoEventoSelect.selectedIndex].text;
        const duracaoSelect = document.getElementById("campo-duracao");
        const horasEvento = duracaoSelect.options[duracaoSelect.selectedIndex].text;
        const convidados = document.getElementById("campo-convidados").value;
        const cep = document.getElementById("campo-cep").value;
        const enderecoLocal = document.getElementById("campo-endereco").value;
        const mensagemAdicional = document.getElementById("campo-mensagem").value;

        // 5. Formatação do Texto do WhatsApp
        const texto = `
*SOLICITAÇÃO DE ORÇAMENTO - LACABINE*

👤 Nome: ${nome}
📧 E-mail: ${email}
📱 Telefone: ${telefone}
🪪 CPF/CNPJ: ${documento}

📅 Data do Evento: ${dataEvento.split('-').reverse().join('/')}
🎉 Tipo de Evento: ${tipoEvento}
👥 Qtd. Convidados: ${convidados}
⏱ Duração Contratada: ${horasEvento}
⭐ Atrações Escolhidas: ${listaAtracoes}

📍 Local de Realização:
CEP: ${cep}
Endereço: ${enderecoLocal}

📝 Observações / Detalhes:
${mensagemAdicional || 'Nenhuma observação informada.'}
`;

        const numeroWhatsApp = "5511959507336";

        // 6. Disparo da janela externa
        window.open(
            `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`,
            "_blank"
        );
    });
}