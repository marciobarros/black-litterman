// Retorna o template da calculadora
function pegaTemplateCalculadora() {
    return `
      <div class="container">
        <h2 class="mb-4 text-left">Calculadora Black-Litterman</h2>
        <div id="mensagem-calculadora" class="mt-3"></div>

        <h5 class="mb-4 text-left">Matriz de covariância</h5>
        <div id="matrizCovarianciaContainer" class="mt-3"></div>

        <h5 class="mb-4 text-left">Prêmios de risco no equilíbrio</h5>
        <div id="premiosRiscoEquilibrioContainer" class="mt-3"></div>

        <h5 class="mb-4 text-left">Pesos de equilíbrio</h5>
        <div id="pesosEquilibrioContainer" class="mt-3"></div>
      </div>`;
}

// Multiplica duas matrizes
function multiplicaMatrizes(matrixA, matrixB) {
  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;
  const rowsB = matrixB.length;
  const colsB = matrixB[0].length;

  // Verifica se as dimensões são compatíveis para multiplicação
  if (colsA !== rowsB) {
    throw new Error("Number of columns in Matrix A must equal number of rows in Matrix B.");
  }

  // Cria a matriz resultado
  const resultado = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));

  // Realiza a multiplicação
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        resultado[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }

  return resultado;
}

// Soma a capitalização de mercado de uma lista de ativos
function somaCapitalizacao(ativos) {
    var soma = 0;
    
    for (var i = 0; i < ativos.length; i++) {
        soma += parseFloat(ativos[i].capitalizacao);
    }
    
    return soma;
}

// Soma as opiniões sobre uma lista de ativos
function somaOpiniao(ativos) {
    var soma = 0;
    
    for (var i = 0; i < ativos.length; i++) {
        soma += parseFloat(ativos[i].opiniao);
    }
    
    return soma;
}

// Pega as volatilidades dos ativos
function pegaVolatilidades(ativos) {
    var volatilidades = [];
    
    for (var i = 0; i < ativos.length; i++) {
        var volatilidade = parseFloat(ativos[i].volatilidade);
        volatilidades.push(volatilidade);
    }
    
    return volatilidades;
}

// Calcula a matriz de covariâncias a partir das correlações e volatilidades
function calculaCovariancas(correlacoes, volatilidades) {
    var n = volatilidades.length;
    
    // Verifica se as dimensões são compatíveis para o cálculo
    if (correlacoes.length !== n || correlacoes[0].length !== n) {
        return null;
    }

    // Cria a matriz de covariâncias
    var covariancas = Array.from({ length: n }, () => Array(n).fill(0));

    // Calcula as covariâncias
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            covariancas[i][j] = correlacoes[i][j] * volatilidades[i] / 100.0 * volatilidades[j] / 100.0;
        }
    }

    return covariancas;
}
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

// Calcula a matriz de covariâncias a partir das correlações e volatilidades
function calculaPremiosRiscoEquilibrio(ativos, covariancias) {
    var n = ativos.length
    
    // Verifica se as dimensões são compatíveis para o cálculo
    if (covariancias.length !== n || covariancias[0].length !== n) {
        return null
    }

    // Cria o vetor resultante
    var premios = Array(n).fill(0)

    // Calcula os premios de risco de equilíbrio
    for (var i = 0; i < n; i++) {
        var soma = 0.0
        
        for (var j = 0; j < n; j++) {
            var ativo = ativos[j]
            var capitalizacao = parseFloat(ativo.capitalizacao)
            soma += covariancias[i][j] * capitalizacao
        }

        premios[i] = soma
    }

    return premios
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

// Calcula os pesos de equilíbrio a partir dos prêmios de risco de equilíbrio
function calculaPesosEquilibrio(ativos, parametros, premiosRiscoEquilibrio) {
    var n = ativos.length;
    var pi = Array(n).fill(0)

    for (var i = 0; i < n; i++) {
        pi[i] = premiosRiscoEquilibrio[i] * parametros.aversaoRisco - ativos[i].opiniao
    }

    return pi
}

// Apresenta os pesos de equilíbrio em uma tabela HTML
function mostrarPesosEquilibrio(ativos, pesos) {
    let html = `
        <table class="table table-bordered table-hover table-sm bg-white shadow-sm">
            <thead class="table-secondary">
                <tr><th>Ativo</th><th class='text-right'>Peso</th><th class='text-right'>Opinião</th></tr>
            </thead>
            <tbody>`;

    for (let i = 0; i < ativos.length; i++) {
        html += `<tr><th class="table-secondary">${ativos[i].nomeCurto}</th>`;
        html += `<td class='text-right'>${pesos[i].toFixed(4)}</td>`;
        html += `<td class='text-right'>${ativos[i].opiniao}</td>`;
        html += `</tr>`;
    }

    html += `</tbody></table>`;
    $("#pesosEquilibrioContainer").html(html);
}

// Prepara a página da calculadora
function preparaPaginaCalculadora() {
    var ativos = pegaAtivos();
    var parametros = pegaParametros();

    var capitalizacaoTotal = somaCapitalizacao(ativos);

    if (Math.abs(capitalizacaoTotal - 100.0) > 0.0001) {
        $("#mensagem-calculadora").html(`<div class="alert alert-danger">O somatório das capitalizações deve ser igual a 100%.</div>`);
        return;
    }

    var opiniaoTotal = somaOpiniao(ativos);

    if (Math.abs(opiniaoTotal) > 0.0001) {
        $("#mensagem-calculadora").html(`<div class="alert alert-danger">O somatório das opiniões deve ser igual a zero.</div>`);
        return;
    }

    var correlacoes = pegaCorrelacaoAtivos(ativos);
    var volatilidades = pegaVolatilidades(ativos);
    var covariancias = calculaCovariancas(correlacoes, volatilidades);

    if (!covariancias) {
        $("#mensagem-calculadora").html(`<div class="alert alert-danger">Não foi possível calcular a matriz de covariância.</div>`);
        return;
    }

    mostrarMatrizCovariancia(ativos, covariancias)

    var premiosRiscoEquilibrio = calculaPremiosRiscoEquilibrio(ativos, covariancias)
    mostrarPremiosRiscoEquilibrio(ativos, premiosRiscoEquilibrio)

    var pesosEquilibrio = calculaPesosEquilibrio(ativos, parametros, premiosRiscoEquilibrio)
    mostrarPesosEquilibrio(ativos, pesosEquilibrio)

    // https://docs.google.com/spreadsheets/d/1VXgPbSDejq5cHB89FzrBny6dmwqNGO35XdRhSLmqAg8/edit?gid=0#gid=0
    
    // TODO calcular omega

    // TODO matriz de covariância invertida

    // TODO matriz de covariância multiplicada por tau

    // TODO inverte a matriz de covariância multiplicada por tau

    // TODO calcula Ptranspose x omega x P = covariância-invertida-transposta vezes opiniao vezes covariância-invertida

    // TODO soma inv (tau x covariância) + Ptranspose x omega x P

    // TODO ...
}