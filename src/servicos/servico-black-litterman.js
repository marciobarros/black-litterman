var modeloBlackLitterman = function() {

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

  // Calcula os pesos de equilíbrio a partir dos prêmios de risco de equilíbrio
  function calculaPesosEquilibrio(ativos) {
      var n = ativos.length
      var pi = criaMatriz(n, 1)

      for (var i = 0; i < n; i++) {
          pi[i][0] = parseFloat(ativos[i].capitalizacao)
      }

      return pi
  }

  // Calcula os retornos esperados no equilíbrio
  function calculaRetornosEquilibrio(ativos, covariancias, parametros) {
      var n = ativos.length
      
      // Verifica se as dimensões são compatíveis para o cálculo
      if (covariancias.length !== n || covariancias[0].length !== n) {
          return null
      }

      // Cria o vetor resultante
      var premios = criaMatriz(n, 1)

      // Calcula os premios de risco de equilíbrio
      for (var i = 0; i < n; i++) {
          var soma = 0.0
          
          for (var j = 0; j < n; j++) {
              var ativo = ativos[j]
              var capitalizacao = parseFloat(ativo.capitalizacao)
              soma += covariancias[i][j] * capitalizacao
          }

          premios[i][0] = soma / 100 * parametros.aversaoRisco
      }

      return premios
  }

  // Monta uma matriz com as opiniões dos ativos
  function montaMatrizOpiniao(ativos) {
      var n = ativos.length
      var opiniao = criaMatriz(1, n, 0)

      for (var i = 0; i < n; i++) {
          opiniao[0][i] = parseFloat(ativos[i].opiniao)
      }

      return opiniao
  }

  // Calcula o modelo de Black-Litterman
  function calculaModeloBlackLitterman(ativos, correlacoes, parametros) {
      var capitalizacaoTotal = somaCapitalizacao(ativos)

      if (Math.abs(capitalizacaoTotal - 100.0) > 0.0001) {
          return { status: "erro", mensagem: "O somatório das capitalizações deve ser igual a 100%." }
      }

      var opiniaoTotal = somaOpiniao(ativos)

      if (Math.abs(opiniaoTotal) > 0.0001) {
          return { status: "erro", mensagem: "O somatório das opiniões deve ser igual a zero." }
      }

      var volatilidades = pegaVolatilidades(ativos)
      var covariancias = calculaCovariancas(correlacoes, volatilidades)

      if (!covariancias) {
          return { status: "erro", mensagem: "Não foi possível calcular a matriz de covariância." }
      }

      var pesos_prior = calculaPesosEquilibrio(ativos)
      var retornos_prior = calculaRetornosEquilibrio(ativos, covariancias, parametros)
      var covariancias_invertidas = inverteMatriz(covariancias)

      var matriz_opiniao = montaMatrizOpiniao(ativos)
      var matriz_opiniao_transposta = transpoeMatriz(matriz_opiniao)

      var omega = multiplicaMatrizes(multiplicaMatrizes(matriz_opiniao, covariancias), matriz_opiniao_transposta) * parametros.tau
      var omega_invertido = 1.0 / omega

      var c0 = multiplicaMatrizes(multiplicaMatrizEscalar(matriz_opiniao_transposta, omega_invertido), matriz_opiniao)
      var c1 = somaMatrizes(multiplicaMatrizEscalar(covariancias_invertidas, 1.0 / parametros.tau), c0)
      var c2 = inverteMatriz(c1)
      var c3 = somaMatrizes(c2, covariancias)
      var c4 = inverteMatriz(c3)
      
      var pesos_posterior = somaMatrizes(multiplicaMatrizEscalar(multiplicaMatrizes(covariancias_invertidas, retornos_prior), 1.0 / parametros.tau), multiplicaMatrizEscalar(multiplicaMatrizEscalar(matriz_opiniao_transposta, omega_invertido), 0.05))
      var retornos_posterior = multiplicaMatrizes(c2, pesos_posterior)
      var pesos_posterior_ajustado_risco = multiplicaMatrizEscalar(multiplicaMatrizes(c4, retornos_posterior), 1.0 / parametros.aversaoRisco)
      var percentual_livre_risco = 100.0 - somaCelulasMatriz(pesos_posterior_ajustado_risco) * 100.0

      var x = PortfolioAllocation.equalRiskContributionWeights(covariancias)

      return { 
        status: "sucesso", 
        covariancias: covariancias, 
        pesos_prior: pesos_prior, 
        volatilidades: volatilidades,
        retornos_prior: retornos_prior,
        pesos_posterior: pesos_posterior, 
        retornos_posterior: retornos_posterior,
        pesos_posterior_risco: pesos_posterior_ajustado_risco,
        percentual_livre_risco: percentual_livre_risco,
      }
  }

  return { calculaModeloBlackLitterman }
}();