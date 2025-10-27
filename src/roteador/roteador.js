var roteador = function() {
    var elementoConteudoComponentes = null

    const componentes = {
        "home": { menu: "🏠 Início", componente: componenteHomepage },
        "ativos": { menu: "📋 Ativos investíveis", componente: componenteEditorAtivos },
        "correlacoes": { menu: "🔢 Matriz de correlação", componente: componenteEditorCorrelacao },
        "parametros": { menu: "⚙️ Outros parâmetros", componente: componenteEditorParametros },
        "exportacao": { menu: "📦 Importa / Exporta", componente: componenteExportacao },
        "resultados": { menu: "⚡ Resultados", componente: componenteCalculadora }
    }

    // Cria a sidebar de navegação
    function criaNavegador(elementoSidebar, elementoConteudo, titulo) {
        $(`<h4>${titulo}</h4>`).appendTo(elementoSidebar)
     
        for (const [page, info] of Object.entries(componentes)) {
            const link = $(`<a href="#" class="nav-link" data-page="${page}">${info.menu}</a>`)
            link.appendTo(elementoSidebar)
        }

        elementoConteudoComponentes = elementoConteudo
        $(".nav-link").click((e) => apresentaComponente(e, elementoConteudo))
    }

    // Apresenta um componente
    function apresentaComponente(e, elementoConteudo) {
        e.preventDefault()
        
        $(".nav-link").removeClass("active")
        $(e.currentTarget).addClass("active")

        const page = $(e.currentTarget).data("page")
        const componenteInfo = componentes[page]

        if (componenteInfo) {
            elementoConteudo.html(componenteInfo.componente.template);
            componenteInfo.componente.apresenta();
        }
    }

    // Seleciona um componente
    function selecionaComponente(page) {
        $(".nav-link").removeClass("active")
        $(`.nav-link[data-page=${page}]`).addClass("active")
        const componenteInfo = componentes[page]

        if (componenteInfo) {
            elementoConteudoComponentes.html(componenteInfo.componente.template);
            componenteInfo.componente.apresenta();
        }
    }

    return { criaNavegador, selecionaComponente }
}();