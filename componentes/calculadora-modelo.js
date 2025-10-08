// Retorna o template da calculadora
function pegaTemplateCalculadora() {
    return `
      <div class="container">
        <h2 class="mb-4 text-left">Calculadora Black-Litterman</h2>
        <div id="mensagem-calculadora" class="mt-3"></div>
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

// Prepara a página da calculadora
function preparaPaginaCalculadora() {
    var ativos = pegaAtivos();

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
    var covariancas = calculaCovariancas(correlacoes, volatilidades);

    if (!covariancas) {
        $("#mensagem-calculadora").html(`<div class="alert alert-danger">Não foi possível calcular a matriz de covariância.</div>`);
        return;
    }

    // TODO calcular o prêmio de risco de equilibrio

    // TODO calcular os pesos de equilíbrio

    // TODO calcular os pesos ajustados com as opiniões
}