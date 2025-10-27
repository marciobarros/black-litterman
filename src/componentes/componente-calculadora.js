var componenteCalculadora = function() {

    // Template da página da calculadora
    const template = `
      <div class="container">
        <h2 class="mb-4 text-left">Calculadora Black-Litterman</h2>
        <div id="mensagem-calculadora" class="mt-3"></div>

        <h5 class="mb-4 text-left">Matriz de covariância</h5>
        <div id="matrizCovarianciaContainer" class="mt-3"></div>

        <h5 class="mb-4 text-left">Prêmios de risco no equilíbrio</h5>
        <div id="premiosRiscoEquilibrioContainer" class="mt-3"></div>

        <h5 class="mb-4 text-left">Pesos de equilíbrio</h5>
        <div id="pesosEquilibrioContainer" class="mt-3"></div>
      </div>`

    // Apresenta a matriz de covariância em uma tabela HTML
    function mostrarMatrizCovariancia(ativos, matriz) {
        if (!Array.isArray(ativos) || !Array.isArray(matriz)) {
            $("#matrizCovarianciaContainer").html("<div class='alert alert-danger'>Erro: dados inválidos.</div>");
            return;
        }

        let html = `
            <table class="table table-bordered table-hover table-sm bg-white shadow-sm">
                <thead class="table-secondary">
                    <tr><th>${ativos.map(a => `<th>${a.nomeCurto}</th>`).join("")}</th></tr>
                </thead>
                <tbody>`;

        for (let i = 0; i < matriz.length; i++) {
            html += `<tr><th class="table-secondary">${ativos[i].nomeCurto}</th>`;
            
            for (let j = 0; j < matriz[i].length; j++) {
                const valor = matriz[i][j];
                html += `<td class='text-right'>${valor.toFixed(4)}</td>`;
            }

            html += `</tr>`;
        }

        html += `</tbody></table>`;
        $("#matrizCovarianciaContainer").html(html);
    }

    // Apresenta os prêmios de risco de equilíbrio em uma tabela HTML
    function mostrarPremiosRiscoEquilibrio(ativos, premios) {
        let html = `
            <table class="table table-bordered table-hover table-sm bg-white shadow-sm">
                <tbody>`;

        for (let i = 0; i < ativos.length; i++) {
            html += `<tr><th class="table-secondary">${ativos[i].nomeCurto}</th>`;
            html += `<td class='text-right'>${premios[i].toFixed(4)}</td>`;
            html += `</tr>`;
        }

        html += `</tbody></table>`;
        $("#premiosRiscoEquilibrioContainer").html(html);
    }

    // Apresenta os pesos de equilíbrio em uma tabela HTML
    function mostrarPesosEquilibrio(ativos, pesos_prior, pesos_posterior) {
        let html = `
            <table class="table table-bordered table-hover table-sm bg-white shadow-sm">
                <thead class="table-secondary">
                    <tr>
                        <th>Ativo</th>
                        <th class='text-right'>Peso Prior</th>
                        <th class='text-right'>Opinião</th>
                        <th class='text-right'>Peso Post</th>
                    </tr>
                </thead>
                <tbody>`;

        for (let i = 0; i < ativos.length; i++) {
            html += `<tr><th class="table-secondary">${ativos[i].nomeCurto}</th>`;
            html += `<td class='text-right'>${pesos_prior[i].toFixed(4)}</td>`;
            html += `<td class='text-right'>${ativos[i].opiniao}</td>`;
            html += `<td class='text-right'>${pesos_posterior[i].toFixed(4)}</td>`;
            html += `</tr>`;
        }

        html += `</tbody></table>`;
        $("#pesosEquilibrioContainer").html(html);
    }

    // Prepara a página da calculadora
    function apresenta() {
        var ativos = servicoModelo.pegaAtivos()
        var parametros = servicoModelo.pegaParametros()
        var correlacoes = servicoModelo.pegaCorrelacaoAtivos(ativos)
        var resultado = modeloBlackLitterman.calculaModeloBlackLitterman(ativos, correlacoes, parametros)

        if (resultado.status == "erro") {
            $("#mensagem-calculadora").html(f`<div class="alert alert-danger">${resultado.mensagem}</div>`);
            return;
        }

        mostrarMatrizCovariancia(ativos, resultado.covariancias)
        mostrarPremiosRiscoEquilibrio(ativos, resultado.premios_risco_equilibrio)
        mostrarPesosEquilibrio(ativos, resultado.pesos_prior, resultado.pesos_posterior)
    }

    return { template, apresenta }
}()