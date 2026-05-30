// ======================================
// CONTROLE DINÂMICO DOS MODAIS DE SERVIÇOS
// ======================================

// Banco de dados das especificações técnicas dos serviços
const dadosServicos = {
    cabine: {
        titulo: "Cabine de Fotos Tradicional",
        img: "./img/cabine.jpg",
        desc: "A clássica Cabine de Fotos oferece um ambiente reservado e intimista. Os convidados entram, fecham a cortina e se soltam usando nossos adereços divertidos, gerando tirinhas de fotos impressas na hora com alta fidelidade.",
        tecnico: "Estrutura modular de alumínio revestido (1,20m x 1,50m x 2,00m). Câmera DSLR Profissional, Iluminação LED difusa integrada, impressora térmica de alta velocidade (foto pronta em 12 segundos). Necessita de um ponto de energia dedicado de 110v ou 220v.",
        ambiente: "Espaços cobertos e planos. Perfeita para casamentos, formaturas e aniversários tradicionais localizados próximos à pista de dança ou recepção de convidados."
    },
    espelho: {
        titulo: "Espelho Retrô Interativo",
        img: "./img/espelho.jpg",
        desc: "Uma peça de decoração luxuosa que se transforma em uma estação interativa de fotos. O espelho touchscreen exibe animações gráficas guiando os convidados, permite assinaturas na tela e emite elogios dinâmicos antes de capturar o clique.",
        tecnico: "Moldura de madeira trabalhada com espelho reflexivo de 55 polegadas touchscreen capacitivo. Iluminação de estúdio (Flash acoplado de alta potência) e câmera DSLR embutida. Impressões personalizadas instantâneas.",
        ambiente: "Salões internos requintados, halls de entrada e eventos de gala. Exige superfície totalmente plana e proteção contra luz solar direta forte para não interferir nos sensores de toque."
    },
    totem: {
        titulo: "Totem Retrô Vintage",
        img: "./img/totem.jpg",
        desc: "Criado para eventos que prezam pelo design e estética. Construído em madeira nobre, ele une o charme do mobiliário rústico/vintage com o que há de mais moderno em engenharia de imagem.",
        tecnico: "Gabinete artesanal em madeira maciça selada. Tela interna de retorno, câmera DSLR profissional oculta no design, flash com difusor em formato de sombrinha clássica e saída de impressão limpa por trás.",
        ambiente: "Casamentos ao ar livre (estilo Boho Chic, rústico ou no campo), aniversários temáticos e recepções integradas a decorações florais ou amadeiradas."
    },
    plataforma: {
        titulo: "Plataforma 360 Graus",
        img: "./img/360.jpg",
        desc: "A sensação do momento em engajamento digital. Os convidados sobem na plataforma e um braço automatizado gira ao redor deles capturando um vídeo em alta resolução com efeitos de aceleração e câmera lenta (slow-motion).",
        tecnico: "Base de aço reforçado com capacidade para até 4 pessoas simultaneamente (450kg max). Braço giratório motorizado com controle de velocidade, suporte estabilizador para smartphone/câmera, e anel de luz LED (Ring Light) de alto CRI.",
        ambiente: "Áreas amplas de transição ou pistas de dança. Requer um espaço livre mínimo de raio de 3 metros ao redor da base para a operação segura do braço giratório. Pode ser usado em ambientes externos."
    },
    compacto: {
        titulo: "Totem Compacto Slim",
        img: "./img/totemslim.png",
        desc: "Focado em eficiência, velocidade de atendimento e captação de dados. O Totem Slim ocupa pouquíssimo espaço físico e incentiva o compartilhamento imediato das marcas em redes sociais.",
        tecnico: "Estrutura ultra fina em aço carbono branco, equipada com iPad Pro de última geração, iluminação circular Ring Light contínua e sistema de compartilhamento digital nativo via QR Code, Email e WhatsApp.",
        ambiente: "Stands de feiras de negócios, convenções corporativas, inaurações de lojas e estabelecimentos com alta rotatividade de pessoas e metragem restrita."
    },
    pista: {
        titulo: "Pistas de LED Paris e Galáxia",
        img: "./img/pistaled.png",
        desc: "Transforme a sua pista de dança no centro absoluto das atenções do evento. Nossas placas de LED trazem o efeito estrelado clássico (Paris) e grafismos espaciais profundos (Galáxia) que mudam conforme o ritmo.",
        tecnico: "Placas modulares ultra-resistentes de vidro temperado que suportam alto impacto. Controladores digitais DMX sincronizados, fiação embutida segura e opções de montagem nos formatos versáteis de 4x4 metros ou 5x5 metros.",
        ambiente: "Centro de salões de festas principais, palcos de shows ou logo à frente da mesa do DJ. Exige piso inferior nivelado e liso."
    },
    lembranca: {
        titulo: "Estação Foto Lembrança",
        img: "./img/fotolembranca.png",
        desc: "Focada na praticidade para organizadores. Diferente das cabines temporizadas, a estação opera focada em produzir volumes exatos de lembranças físicas personalizadas para que nenhum convidado saia de mãos vazias.",
        tecnico: "Operação assistida por fotógrafo ou técnico, câmera profissional externa, estação portátil de processamento gráfico com molduras institucionais personalizadas pré-configuradas e impressoras industriais dedicadas.",
        ambiente: "Festas corporativas de final de ano, jantares de premiação, mini-weddings ou eventos onde a entrega da foto acontece diretamente na saída ou mesas dos convidados."
    },
    tunel: {
        titulo: "Túnel LED Infinito",
        img: "./img/tunelled.webp",
        desc: "Uma imersão visual e futurista de tirar o fôlego. Os convidados entram em uma estrutura espelhada envolta em faixas de LED programadas, gerando reflexos infinitos tridimensionais que dão a impressão de flutuar no espaço.",
        tecnico: "Estrutura de passagem com paredes feitas em espelhos de acrílico de alta segurança e fitas de LED Pixel endereçáveis (RGB digitais). Câmera interna de alta velocidade acoplada e software de renderização instantânea de clipes de vídeo.",
        ambiente: "Eventos corporativos disruptivos, lançamentos de produtos tecnológicos, festas de música eletrônica ou baladas de formaturas de grande porte."
    }
};

// Variavel global para armazenar o serviço que está aberto no modal atualmente
let servicoSelecionadoNoModal = "";

const modalServicoElemento = document.getElementById('modalServico');
if (modalServicoElemento) {
    modalServicoElemento.addEventListener('show.bs.modal', function (event) {
        const botaoDisparador = event.relatedTarget;
        const servicoChave = botaoDisparador.getAttribute('data-servico');
        const dados = dadosServicos[servicoChave];

        if (dados) {
            // Guarda o título do serviço ativo para o redirecionamento posterior
            servicoSelecionadoNoModal = dados.titulo;

            document.getElementById('modalServicoTitle').textContent = dados.titulo;
            document.getElementById('modalServicoImg').src = dados.img;
            document.getElementById('modalServicoImg').alt = dados.titulo;
            document.getElementById('modalServicoDesc').textContent = dados.desc;
            document.getElementById('modalServicoTecnico').textContent = dados.tecnico;
            document.getElementById('modalServicoAmbiente').textContent = dados.ambiente;
        }
    });
}

// ======================================
// REDIRECIONAMENTO COM SERVIÇO PARA O WHATSAPP
// ======================================
const btnOrcamentoModal = document.querySelector('#modalServico .btn-red-pill');

if (btnOrcamentoModal) {
    btnOrcamentoModal.addEventListener('click', function(e) {
        // Altera o comportamento do link padrão (contato.html) se quisermos mandar direto para o WhatsApp
        e.preventDefault();
        
        const numeroWhatsApp = "5511959507336";
        let mensagem = "Olá! Gostaria de mais informações sobre os serviços da LaCabine.";
        
        if (servicoSelecionadoNoModal) {
            mensagem = `Olá! Vi os detalhes técnicos no site e gostaria de solicitar um orçamento para o serviço: *${servicoSelecionadoNoModal}*.`;
        }
        
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    });
}

// ======================================
// FILTROS DINÂMICOS DA GALERIA
// ======================================
const botoesFiltro = document.querySelectorAll("#filtros-galeria button");
const cardsGaleria = document.querySelectorAll(".galeria-card");

if (botoesFiltro.length > 0 && cardsGaleria.length > 0) {
    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", () => {
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
}

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
                lightboxCaption.innerText = imgInterna.getAttribute("alt") || "";
                customLightbox.classList.add("active");
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", () => {
            customLightbox.classList.remove("active");
        });
    }

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

        if (numerosLimpos.length === 11) {
            if (validarCPF(numerosLimpos)) {
                documentoInput.classList.remove("is-invalid");
                documentoInput.classList.add("is-valid");
            } else {
                documentoInput.classList.remove("is-valid");
                documentoInput.classList.add("is-invalid");
            }
        } 
        else if (numerosLimpos.length === 14) {
            if (!validarCNPJ(numerosLimpos)) {
                documentoInput.classList.remove("is-valid");
                documentoInput.classList.add("is-invalid");
                return;
            }

            try {
                const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${numerosLimpos}`);
                
                if (resposta.status === 200) {
                    const dadosEmpresa = await resposta.json();
                    documentoInput.classList.remove("is-invalid");
                    documentoInput.classList.add("is-valid");

                    const campoNome = document.getElementById("campo-nome");
                    if (campoNome && dadosEmpresa.razao_social) {
                        campoNome.value = dadosEmpresa.razao_social;
                    }
                } else {
                    documentoInput.classList.remove("is-valid");
                    documentoInput.classList.add("is-invalid");
                }
            } catch (erro) {
                console.error("Erro ao consultar API de CNPJ:", erro);
            }
        } else {
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