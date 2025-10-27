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

  // Calcula os pesos de equilíbrio a partir dos prêmios de risco de equilíbrio
  function calculaPesosEquilibrio(ativos, parametros, premiosRiscoEquilibrio) {
      var n = ativos.length;
      var pi = Array(n).fill(0)

      for (var i = 0; i < n; i++) {
          pi[i] = premiosRiscoEquilibrio[i] * parametros.aversaoRisco
      }

      return pi
  }

  // Monta um vetor com as opiniões dos ativos
  function montaVetorOpiniao(ativos) {
      var n = ativos.length;
      var opiniao = Array(n).fill(0);

      for (var i = 0; i < n; i++) {
          opiniao[i] = ativos[i].opiniao;
      }

      return opiniao;
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

      var premios_risco_equilibrio = calculaPremiosRiscoEquilibrio(ativos, covariancias)
      var pesos_prior = calculaPesosEquilibrio(ativos, parametros, premios_risco_equilibrio)
      var covariancias_invertidas = inverteMatriz(covariancias)
      var covariancias_tau = multiplicaMatrizEscalar(covariancias, parametros.tau)
      var invertida_covariancias_tau = inverteMatriz(covariancias_tau)
      var vetor_opiniao = montaVetorOpiniao(ativos)
      var pt_omega_p = multiplicaVetorVetor(vetor_opiniao, multiplicaMatrizVetor(covariancias_invertidas, vetor_opiniao))
      var primeiro_termo = inverteMatriz(somaMatrizEscalar(invertida_covariancias_tau, pt_omega_p))
      var r1 = multiplicaMatrizVetor(invertida_covariancias_tau, pesos_prior)
      var pesos_posterior = multiplicaMatrizVetor(primeiro_termo, r1)

      return { 
        status: "sucesso", 
        pesos_prior: pesos_prior, 
        pesos_posterior: pesos_posterior, 
        covariancias: covariancias, 
        premios_risco_equilibrio: premios_risco_equilibrio 
      }
  }

  return { calculaModeloBlackLitterman }
}();