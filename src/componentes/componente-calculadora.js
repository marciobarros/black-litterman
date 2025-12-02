var componenteCalculadora = function() {

    // Template da página da calculadora
    const template = `
      <div class="container">
        <h2 class="text-left">Calculadora Black-Litterman</h2>
        <div id="mensagem-calculadora" class="mt-3"></div>

        <h5 class="mt-8 text-left">Matriz de covariância</h5>
        <div id="matrizCovarianciaContainer" class="mt-3"></div>

        <h5 class="mt-8 text-left">Volatilidade, capitalização e retornos no equilíbrio</h5>
        <div id="premiosRiscoEquilibrioContainer" class="mt-3"></div>

        <h5 class="mt-8 text-left">Matriz omega</h5>
        <div id="matrizOmegaContainer" class="mt-3"></div>

        <h5 class="mt-8 text-left">Pesos e retornos pelo modelo de Black & Litterman</h5>
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
                        <th class='text-right'>Volatilidade</th>
                        <th class='text-right'>Capitalização</th>
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

    // Apresenta a matriz Omega em uma tabela HTML
    function mostrarMatrizOmega(omega) {
        if (!Array.isArray(omega)) {
            $("#matrizOmegaContainer").html("<div class='alert alert-danger'>Erro: dados inválidos.</div>");
            return;
        }

        let html = `
            <table class="table table-bordered table-hover table-sm bg-white shadow-sm">
                <thead class="table-secondary">
                <tr><th class="table-secondary"></th>`

        for (let i = 0; i < omega.length; i++) {
            html += `<th class="text-right">#${i+1}</th>`
        }

        html += '</tr></thead><tbody>';

        for (let i = 0; i < omega.length; i++) {
            html += `<tr><th class="table-secondary">#${i+1}</th>`;
            
            for (let j = 0; j < omega[i].length; j++) {
                if (i == j) {
                    const valor = omega[i][j] * 100
                    html += `<td class='text-right'>${valor.toFixed(4)}%</td>`;
                }
                else {
                    html += `<td class='text-right'>-</td>`;
                }
            }

            html += `</tr>`;
        }

        html += `</tbody></table>`;
        $("#matrizOmegaContainer").html(html);
    }

    // Apresenta os resultados finais em uma tabela HTML
    function mostrarResultados(ativos, opiniao, retornos_opiniao, w_sobre_tau, lambda, retornos_posterior, alocacao_posterior_risco, diferenca_alocacao) {
        let html = `
            <table class="table table-bordered table-hover table-sm bg-white shadow-sm tabela-resultados">
                <thead class="table-secondary">
                    <tr>
                        <th class='ativo'>Ativo</th>`

        for (var i = 0; i < opiniao.length; i++) {
            html += `<th class='opiniao'>OP #${i+1}</th>`
        }

        html += `<th class='text-right'>Retorno</th>`
        html += `<th class='text-right'>Alocação</th>`
        html += `<th class='text-right'>Diferença</th>`
        html += `</tr></thead><tbody>`

        for (let i = 0; i < ativos.length; i++) {
            html += `<tr><td class="table-secondary ativo">${ativos[i].nomeCurto}</td>`
            
            for (var j = 0; j < opiniao.length; j++) {
                html += `<td class='text-right'>${(opiniao[j][i] * 100).toFixed(1)}</td>`
            }

            html += `<td class='text-right'>${(retornos_posterior[i][0] * 100).toFixed(1)}</td>`
            html += `<td class='text-right'>${(alocacao_posterior_risco[i][0] * 100).toFixed(1)}%</td>`
            html += `<td class='text-right'>${(diferenca_alocacao[i][0] * 100).toFixed(1)}</td>`
            html += `</tr>`
        }

        html += `<tr><td class="table-secondary ativo">Retorno OP</td>`
        
        for (var i = 0; i < opiniao.length; i++) {
            html += `<td class='text-right retorno-opiniao'>${(retornos_opiniao[i][0] * 100.0).toFixed(2)}%</td>`
        }
        
        html += `</tr>`

        html += `<tr><td class="table-secondary ativo">w / tau</td>`
        
        for (var i = 0; i < opiniao.length; i++) {
            html += `<td class='text-right'>${(w_sobre_tau[i][0]).toFixed(3)}</td>`
        }
        
        html += `</tr>`

        html += `<tr><td class="table-secondary ativo">lambda</td>`
        
        for (var i = 0; i < opiniao.length; i++) {
            html += `<td class='text-right'>${(lambda[i][0]).toFixed(3)}</td>`
        }
        
        html += `</tr>`
        $("#pesosEquilibrioContainer").html(html);
    }

    // Prepara a página da calculadora
    function apresenta() {
        var ativos = servicoModelo.pegaAtivos()
        var opinioes = servicoModelo.pegaOpinioes()
        var parametros = servicoModelo.pegaParametros()
        var correlacoes = servicoModelo.pegaCorrelacaoAtivos(ativos)
        var resultado = modeloBlackLitterman.calculaModeloBlackLitterman(ativos, correlacoes, opinioes, parametros)

        if (resultado.status == "erro") {
            $("#mensagem-calculadora").html(f`<div class="alert alert-danger">${resultado.mensagem}</div>`);
            return;
        }

        mostrarMatrizCovariancia(ativos, resultado.covariancias)
        mostrarPesosRetornosEquilibrio(ativos, resultado.volatilidades, resultado.pesos_prior, resultado.retornos_prior)
        mostrarMatrizOmega(resultado.omega)
        mostrarResultados(ativos, resultado.opiniao, resultado.retornos_opiniao, resultado.w_sobre_tau, resultado.lambda, resultado.retornos_posterior, resultado.pesos_posterior_risco, resultado.diferenca_alocacao)
    }

    return { template, apresenta }
}()