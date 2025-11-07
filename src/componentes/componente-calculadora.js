var componenteCalculadora = function() {

    // Template da página da calculadora
    const template = `
      <div class="container">
        <h2 class="text-left">Calculadora Black-Litterman</h2>
        <div id="mensagem-calculadora" class="mt-3"></div>

        <h5 class="mt-8 text-left">Matriz de covariância</h5>
        <div id="matrizCovarianciaContainer" class="mt-3"></div>

        <h5 class="mt-8 text-left">Pesos e retornos no equilíbrio</h5>
        <div id="premiosRiscoEquilibrioContainer" class="mt-3"></div>

        <h5 class="mt-8 text-left">Pesos e retornos com as opiniões e aversão a risco</h5>
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

    // Apresenta os pesos e retornos de equilíbrio em uma tabela HTML
    function mostrarPesosRetornosEquilibrio(ativos, volatilidades, pesos, retornos) {
        let html = `
            <table class="table table-bordered table-hover table-sm bg-white shadow-sm">
                <thead class="table-secondary">
                    <tr>
                        <th>Ativo</th>
                        <th class='text-right'>Vols</th>
                        <th class='text-right'>Peso</th>
                        <th class='text-right'>Retorno</th>
                    </tr>
                </thead>
                <tbody>`;

        for (let i = 0; i < ativos.length; i++) {
            html += `<tr><th class="table-secondary">${ativos[i].nomeCurto}</th>`;
            html += `<td class='text-right'>${volatilidades[i].toFixed(2)}%</td>`;
            html += `<td class='text-right'>${pesos[i][0].toFixed(2)}%</td>`;
            html += `<td class='text-right'>${(retornos[i][0] * 100).toFixed(2)}%</td>`;
            html += `</tr>`;
        }

        html += `</tbody></table>`;
        $("#premiosRiscoEquilibrioContainer").html(html);
    }

    // Apresenta os pesos e retornos ajustados pela opinião em uma tabela HTML
    function mostrarPesosAjustadosOpiniao(ativos, pesos, retornos, pesos_ajustados_risco, percentual_livre_risco) {
        let html = `
            <table class="table table-bordered table-hover table-sm bg-white shadow-sm">
                <thead class="table-secondary">
                    <tr>
                        <th>Ativo</th>
                        <th class='text-right'>Pesos</th>
                        <th class='text-right'>Retornos</th>
                        <th class='text-right'>Alocação</th>
                    </tr>
                </thead>
                <tbody>`;

        for (let i = 0; i < ativos.length; i++) {
            html += `<tr><th class="table-secondary">${ativos[i].nomeCurto}</th>`;
            html += `<td class='text-right'>${pesos[i][0].toFixed(2)}%</td>`;
            html += `<td class='text-right'>${(retornos[i][0] * 100).toFixed(2)}%</td>`;
            html += `<td class='text-right'>${(pesos_ajustados_risco[i][0] * 100).toFixed(2)}%</td>`;
            html += `</tr>`;
        }

        html += `</tbody></table>`;
        html += `Investimento em ativo livre de risco: ${percentual_livre_risco.toFixed(2)}%`;
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
        mostrarPesosRetornosEquilibrio(ativos, resultado.volatilidades, resultado.pesos_prior, resultado.retornos_prior)
        mostrarPesosAjustadosOpiniao(ativos, resultado.pesos_posterior, resultado.retornos_posterior, resultado.pesos_posterior_risco, resultado.percentual_livre_risco)
    }

    return { template, apresenta }
}()