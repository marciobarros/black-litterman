// ============================================================
//
// ROTEADOR
//
// ============================================================

function criaRoteador(parElementoSidebar, parElementoConteudo, titulo) {
    
    // Elemento onde o menu será apresentado
    var elementoSidebar = null
    
    // Elemento onde os componentes serão apresentados
    var elementoPlaceholder = null

    // Lista de componentes conhecidos
    const componentes = {}

    // Adiciona um componente no roteador
    function adicionaComponente(page, menu, componente) {
        componentes[page] = { menu, componente }
        const link = $(`<a href="#" class="nav-link" data-page="${page}">${menu}</a>`)
        link.click(apresentaComponente)
        link.appendTo(elementoSidebar)
    }

    // Apresenta um componente
    function apresentaComponente(e) {
        e.preventDefault()
        
        $(".nav-link").removeClass("active")
        $(e.currentTarget).addClass("active")

        const page = $(e.currentTarget).data("page")
        const componenteInfo = componentes[page]

        if (componenteInfo) {
            elementoPlaceholder.html(componenteInfo.componente.template);
            componenteInfo.componente.apresenta();
        }
    }

    // Seleciona um componente
    function selecionaComponente(page) {
        $(".nav-link").removeClass("active")
        $(`.nav-link[data-page=${page}]`).addClass("active")
        const componenteInfo = componentes[page]

        if (componenteInfo) {
            elementoPlaceholder.html(componenteInfo.componente.template);
            componenteInfo.componente.apresenta();
        }
    }

    // Programa principal
    elementoSidebar = parElementoSidebar
    elementoPlaceholder = parElementoConteudo
    $(`<h4>${titulo}</h4>`).appendTo(elementoSidebar)
    return { adicionaComponente, selecionaComponente }
}


// ============================================================
//
// URL DATA
//
// ============================================================

// Processa os dados codificados em base64 vindos em uma URL
function parseUrlData(callback) {
    const queryString = window.location.search
    const urlParameters = new URLSearchParams(queryString)
    const data = urlParameters.get('data')

    if (data) {
        try {
            const jsonString = atob(data);
            const dados = JSON.parse(jsonString);
            callback(dados);
        } catch (e) {
            console.error("Erro ao decodificar os dados da URL:", e);
        }
    }
}

// Gera uma URL com os dados codificados em base64
function generateUrlData(dados) {
    const jsonString = JSON.stringify(dados)
    const encodedData = btoa(jsonString)
    const currentUrl = window.location.href.split('?')[0]
    return `${currentUrl}?data=${encodedData}`
}