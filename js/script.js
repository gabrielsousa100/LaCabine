// ======================================
// BOTÕES DE SERVIÇOS (CARDS) -> WHATSAPP
// ======================================
const botoes = document.querySelectorAll(".btn-red-pill");

botoes.forEach(botao => {
    botao.addEventListener("click", (e) => {
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
// FILTROS DINÂMICOS DA GALERIA
// ======================================
const botoesFiltro = document.querySelectorAll("#filtros-galeria button");
const cardsGaleria = document.querySelectorAll(".galeria-card");

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", () => {
        // Altera o estado do botão ativo visualmente
        botoesFiltro.forEach(b => b.classList.remove("active"));
        botao.classList.add("active");

        const filtroSelecionado = botao.getAttribute("data-filtro");

        cardsGaleria.forEach(card => {
            const categoriaCard = card.getAttribute("data-categoria");

            if (filtroSelecionado === "todos" || categoriaCard === filtroSelecionado) {
                card.classList.remove("fade-out");
            } else {
                card.classList.add("fade-out");
            }
        });
    });
});

// ======================================
// LIGHTBOX DA GALERIA COM CAPTION (LEGENDA)
// ======================================
const itensGaleria = document.querySelectorAll(".galeria-item");
const customLightbox = document.getElementById("custom-lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

if (itensGaleria.length > 0 && customLightbox) {
    itensGaleria.forEach(item => {
        item.addEventListener("click", () => {
            const imgInterna = item.querySelector("img");
            if (imgInterna) {
                lightboxImg.src = imgInterna.src;
                // Alimenta o texto da legenda usando o atributo 'alt' completo da tag de imagem
                lightboxCaption.innerText = imgInterna.getAttribute("alt") || "";
                customLightbox.classList.add("active");
            }
        });
    });

    // Fecha ao clicar no botão 'X'
    if (lightboxClose) {
        lightboxClose.addEventListener("click", () => {
            customLightbox.classList.remove("active");
        });
    }

    // Fecha se o usuário clicar no fundo escuro vazio
    customLightbox.addEventListener("click", (e) => {
        if (e.target === customLightbox || e.target.classList.contains("text-center") || e.target.classList.contains("position-relative")) {
            customLightbox.classList.remove("active");
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
// MÁSCARA + CONSULTA INSTANTÂNEA DE CPF/CNPJ
// ======================================
const documentoInput = document.getElementById("campo-documento");

if (documentoInput) {
    documentoInput.addEventListener("input", async (e) => {
        let valor = documentoInput.value.replace(/\D/g, "");

        // Aplica a máscara visual em tempo de digitação
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
        documentoInput.value = valor;

        const numerosLimpos = valor.replace(/\D/g, "");

        // Validação Instantânea de CPF (Local)
        if (numerosLimpos.length === 11) {
            if (validarCPF(numerosLimpos)) {
                documentoInput.classList.remove("is-invalid");
                documentoInput.classList.add("is-valid");
            } else {
                documentoInput.classList.remove("is-valid");
                documentoInput.classList.add("is-invalid");
            }
        } 
        // Validação + Consulta Instantânea de CNPJ (Via API)
        else if (numerosLimpos.length === 14) {
            // Verifica primeiro se a estrutura matemática do CNPJ faz sentido
            if (!validarCNPJ(numerosLimpos)) {
                documentoInput.classList.remove("is-valid");
                documentoInput.classList.add("is-invalid");
                return;
            }

            try {
                // Consulta a base da Receita Federal via BrasilAPI
                const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${numerosLimpos}`);
                
                if (resposta.status === 200) {
                    const dadosEmpresa = await resposta.json();
                    documentoInput.classList.remove("is-invalid");
                    documentoInput.classList.add("is-valid");

                    // Preenche o campo de nome automaticamente com a Razão Social da Empresa
                    const campoNome = document.getElementById("campo-nome");
                    if (campoNome && dadosEmpresa.razao_social) {
                        campoNome.value = dadosEmpresa.razao_social;
                    }
                } else {
                    // CNPJ matematicamente correto, mas inexistente/inválido na Receita
                    documentoInput.classList.remove("is-valid");
                    documentoInput.classList.add("is-invalid");
                }
            } catch (erro) {
                console.error("Erro ao consultar API de CNPJ:", erro);
            }
        } else {
            // Se o usuário estiver no meio da digitação, limpa as classes de validação
            documentoInput.classList.remove("is-valid", "is-invalid");
        }
    });
}

// ======================================
// FUNÇÕES MATEMÁTICAS DE VALIDAÇÃO (AUXILIARES)
// ======================================
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;
    tamanho++;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    return resultado == digitos.charAt(1);
}

// ======================================
// CONSULTA VIA CEP (INSTANTÂNEA AO DIGITAR O 8º DÍGITO)
// ======================================
const cepInput = document.getElementById("campo-cep");

if (cepInput) {
    cepInput.addEventListener("input", async (e) => {
        let cep = e.target.value.replace(/\D/g, "");
        cep = cep.replace(/^(\d{5})(\d)/, "$1-$2");
        cepInput.value = cep;

        const cepLimpo = cep.replace(/\D/g, "");
        const campoEndereco = document.getElementById("campo-endereco");

        if (cepLimpo.length === 8) {
            try {
                const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                const dados = await resposta.json();

                if (dados.erro) {
                    cepInput.classList.remove("is-valid");
                    cepInput.classList.add("is-invalid");
                    if (campoEndereco) campoEndereco.value = "";
                    return;
                }

                cepInput.classList.remove("is-invalid");
                cepInput.classList.add("is-valid");
                
                if (campoEndereco) {
                    let enderecoCompleto = "";
                    if (dados.logradouro) enderecoCompleto += `${dados.logradouro}, `;
                    if (dados.bairro) enderecoCompleto += `${dados.bairro}, `;
                    if (dados.localidade) enderecoCompleto += `${dados.localidade}`;
                    if (dados.uf) enderecoCompleto += ` - ${dados.uf}`;
                    
                    campoEndereco.value = enderecoCompleto;
                }
            } catch {
                cepInput.classList.remove("is-valid");
                cepInput.classList.add("is-invalid");
            }
        } else {
            cepInput.classList.remove("is-valid", "is-invalid");
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

        // 1. Validação final de segurança do CPF/CNPJ
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
        }

        // 2. Validação das Atrações (Checkboxes)
        const checkboxesMarcados = document.querySelectorAll(".atracao-check:checked");
        const erroAtracoes = document.getElementById("erro-atracoes");

        if (checkboxesMarcados.length === 0) {
            if (erroAtracoes) erroAtracoes.classList.remove("d-none");
            alert("Selecione pelo menos uma atração.");
            return;
        } else {
            if (erroAtracoes) erroAtracoes.classList.add("d-none");
        }

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

        // 4. Captura dos valores para o texto final
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

        window.open(
            `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`,
            "_blank"
        );
    });
}