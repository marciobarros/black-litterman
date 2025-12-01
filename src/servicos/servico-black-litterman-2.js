var modeloBlackLitterman = function() {

    // Verifica se a capitalização dos ativos é válida
    function verificaCapitalizacao(ativos) {
        var soma = 0;
        
        for (var i = 0; i < ativos.length; i++) {
            soma += parseFloat(ativos[i].capitalizacao);
        }
      
        if (Math.abs(soma - 100.0) > 0.0001) {
            return { status: "erro", mensagem: "O somatório das capitalizações deve ser igual a 100%." }
        }

        return { status: "sucesso" }
    }

    // Verifica se as opiniões indicadas pelos usuários são válidas
    function verificaOpinioes(opinioes, ativos) {
        for (var i = 0; i < opinioes.length; i++) {
            var habilitada = opinioes[i].habilitada == undefined ? false : opinioes[i].habilitada

            if (habilitada) {
                var soma = 0.0

                for (var j = 0; j < ativos.length; j++) {
                    var ativo = ativos[j].nomeCurto
                    var opiniao = (opinioes[i][ativo] == undefined) ? 0.0 : parseFloat(opinioes[i][ativo])
                    soma += opiniao
                }

                if (Math.abs(soma) > 0.0001) {
                    return { status: "erro", mensagem: "O somatório dos componentes de uma opinião deve ser igual a zero." }
                }

                if (opinioes[i].retorno < 0.001) {
                    return { status: "erro", mensagem: `O retorno da opinião #${i+1} deve ser maior que zero.` }
                }
            }
        }
        
        return { status: "sucesso" }
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

    // Calcula a matriz NxN de covariâncias a partir das correlações e volatilidades
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

    // Cria uma matriz Nx1 com as capitalizações dos ativos
    function criaMatrizCapitalizacao(ativos) {
        var n = ativos.length
        var pi = criaMatriz(n, 1)

        for (var i = 0; i < n; i++) {
            pi[i][0] = parseFloat(ativos[i].capitalizacao)
        }

        return pi
    }

    // Calcula uma matriz Nx1 com os retornos esperados no equilíbrio
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

    // Conta o número de opiniões habilitadas
    function contaOpinioesHabilitadas(opinioes) {
        var contador = 0

        for (var i = 0; i < opinioes.length; i++) {
            var habilitada = opinioes[i].habilitada == undefined ? false : opinioes[i].habilitada

            if (habilitada) {
                contador++
            }
        }

        return contador
    }

    // Monta uma matriz KxN com a participação dos ativos nas opiniões
    function criaMatrizParticipacaoAtivosOpiniao(opinioes, ativos) {
        var numero_opinioes = contaOpinioesHabilitadas(opinioes)
        var numero_ativos = ativos.length

        var opiniao = criaMatriz(numero_opinioes, numero_ativos, 0)
        var indice_opiniao = 0

        for (var i = 0; i < opinioes.length; i++) {
            var habilitada = opinioes[i].habilitada == undefined ? false : opinioes[i].habilitada
            
            if (habilitada) {
                for (var j = 0; j < numero_ativos; j++) {
                    var ativo = ativos[j].nomeCurto
                    var valor_opiniao = (opinioes[i][ativo] == undefined) ? 0.0 : parseFloat(opinioes[i][ativo])
                    opiniao[indice_opiniao][j] = valor_opiniao
                }

                indice_opiniao++
            }
        }

        return opiniao
    }

    // Monta uma matriz Kx1 com os retornos das opiniões
    function criaMatrizRetornosOpiniao(opinioes) {
        var numero_opinioes = contaOpinioesHabilitadas(opinioes)
        var opiniao = criaMatriz(numero_opinioes, 1, 0)
        var indice_opiniao = 0

        for (var i = 0; i < opinioes.length; i++) {
            var habilitada = (opinioes[i].habilitada == undefined) ? false : opinioes[i].habilitada
            
            if (habilitada) {
                opiniao[indice_opiniao][0] = opinioes[i].retorno
                indice_opiniao++
            }
        }

        return opiniao
    }

    // Monta uma matriz Kx1 com os pesos das opiniões
    function criaMatrizPesosOpiniao(opinioes) {
        var numero_opinioes = contaOpinioesHabilitadas(opinioes)
        var opiniao = criaMatriz(numero_opinioes, 1, 0)
        var indice_opiniao = 0

        for (var i = 0; i < opinioes.length; i++) {
            var habilitada = (opinioes[i].habilitada == undefined) ? false : opinioes[i].habilitada
            
            if (habilitada) {
                opiniao[indice_opiniao][0] = opinioes[i].omega
                indice_opiniao++
            }
        }

        return opiniao
    }













    // Ajusta os retornos esperados com base nas opiniões dos investidores
    function ajustaRetornosOpiniao(matriz_opiniao, retornos_prior, ajusteRetorno) {
        var indices_subidas = []
        var indices_quedas = []

        for (var i = 0; i < matriz_opiniao[0].length; i++) {
            if (matriz_opiniao[0][i] > 0) {
                indices_subidas.push(i)
            } else if (matriz_opiniao[0][i] < 0) {
                indices_quedas.push(i)
            }
        } 

        if (indices_subidas.length == 1 && indices_quedas.length >= 1) {
            var retornos_ajustados = copiaMatriz(retornos_prior)

            var indice_subida = indices_subidas[0]
            retornos_ajustados[indice_subida][0] += ajusteRetorno / 2.0

            var indice_queda = indices_quedas[0]
            var soma = 0.0

            for (var i = 1; i < indices_quedas.length; i++) {
                var indice_queda_i = indices_quedas[i]
                soma += Math.abs(matriz_opiniao[0][indice_queda_i]) * (retornos_prior[indice_queda_i][0] - retornos_prior[indice_queda][0])
            }
            
            retornos_ajustados[indice_queda][0] = retornos_ajustados[indice_subida][0] - ajusteRetorno - soma

            for (var i = 1; i < indices_quedas.length; i++) {
                var indice_queda_i = indices_quedas[i]
                retornos_ajustados[indice_queda_i][0] = retornos_ajustados[indice_queda][0] + retornos_prior[indice_queda_i][0] - retornos_prior[indice_queda][0]
            }

            return retornos_ajustados
        }

        return null
    }

    // Calcula o modelo de Black-Litterman
    function calculaModeloBlackLitterman(ativos, correlacoes, opinioes, parametros) {
        // Verifica se a capitalização é igual a 100%
        var resultadoCapitalizacao = verificaCapitalizacao(ativos)

        if (resultadoCapitalizacao.status == "erro") {
            return resultadoCapitalizacao
        }

        // Verifica se a capitalização é igual a 100%
        var resultadoOpinioes = verificaOpinioes(opinioes, ativos)

        if (resultadoOpinioes.status == "erro") {
            return resultadoOpinioes
        }

        // Calcula as estatísticas
        var volatilidades = pegaVolatilidades(ativos)
        var covariancias = calculaCovariancas(correlacoes, volatilidades)

        if (!covariancias) {
            return { status: "erro", mensagem: "Não foi possível calcular a matriz de covariância." }
        }

        // Calcula as capitalizacoes e os retornos esperados no equilíbrio
        var capitalizacoes = criaMatrizCapitalizacao(ativos)
        var retornos_prior = calculaRetornosEquilibrio(ativos, covariancias, parametros)

        // Monta a matriz de opiniões
        var participacao_opiniao = criaMatrizParticipacaoAtivosOpiniao(opinioes, ativos)
        var retornos_opiniao = criaMatrizRetornosOpiniao(opinioes)
        var pesos_opiniao = criaMatrizPesosOpiniao(opinioes)

        // Calcula a matriz de covariâncias invertida
        var covariancias_invertidas = inverteMatriz(covariancias)

        // Transpõe a matriz de opiniões
        var matriz_opiniao_transposta = transpoeMatriz(participacao_opiniao)



        // Continuar a partir daqui ...
        var retornos_ajustados_opiniao = ajustaRetornosOpiniao(participacao_opiniao, retornos_prior, retornos_opiniao)
        alert("BINGO!")
        var alocacao_ajustada_opiniao = multiplicaMatrizEscalar(multiplicaMatrizes(covariancias_invertidas, retornos_ajustados_opiniao), 1.0 / parametros.aversaoRisco)
        var percentual_livre_risco_ajustada_opiniao = 100.0 - somaCelulasMatriz(alocacao_ajustada_opiniao) * 100.0

        var omega = multiplicaMatrizes(multiplicaMatrizes(participacao_opiniao, covariancias), matriz_opiniao_transposta) * parametros.tau
        var omega_invertido = 1.0 / omega

        var c0 = multiplicaMatrizes(multiplicaMatrizEscalar(matriz_opiniao_transposta, omega_invertido), participacao_opiniao)
        var c1 = somaMatrizes(multiplicaMatrizEscalar(covariancias_invertidas, 1.0 / parametros.tau), c0)
        var c2 = inverteMatriz(c1)
        var c3 = somaMatrizes(c2, covariancias)
        var c4 = inverteMatriz(c3)
        
        var pesos_posterior = somaMatrizes(multiplicaMatrizEscalar(multiplicaMatrizes(covariancias_invertidas, retornos_prior), 1.0 / parametros.tau), multiplicaMatrizEscalar(multiplicaMatrizEscalar(matriz_opiniao_transposta, omega_invertido), 0.05))
        var retornos_posterior = multiplicaMatrizes(c2, pesos_posterior)
        var pesos_posterior_ajustado_risco = multiplicaMatrizEscalar(multiplicaMatrizes(c4, retornos_posterior), 1.0 / parametros.aversaoRisco)
        var percentual_livre_risco = 100.0 - somaCelulasMatriz(pesos_posterior_ajustado_risco) * 100.0

        var A = omega / parametros.tau + multiplicaMatrizes(participacao_opiniao, multiplicaMatrizes(covariancias, matriz_opiniao_transposta))[0][0] / (1.0 + parametros.tau)
        var lambda = parametros.tau * omega_invertido * 0.05 / parametros.aversaoRisco
        lambda = lambda - (1.0 / A) * (1.0 / (1.0 + parametros.tau)) * multiplicaMatrizes(participacao_opiniao, multiplicaMatrizes(covariancias, capitalizacoes))[0][0] / 100.0
        lambda = lambda - (1.0 / A) * (1.0 / (1.0 + parametros.tau)) * multiplicaMatrizes(participacao_opiniao, multiplicaMatrizes(covariancias, matriz_opiniao_transposta))[0][0] * parametros.tau * omega_invertido * 0.05 / parametros.aversaoRisco

        // TODO aplicar a matriz no processo de calculo

        return { 
            status: "sucesso", 
            covariancias: covariancias, 
            
            pesos_prior: capitalizacoes, 
            volatilidades: volatilidades,
            retornos_prior: retornos_prior,

            retornos_ajustados_opiniao: retornos_ajustados_opiniao,
            alocacao_ajustada_opiniao: alocacao_ajustada_opiniao,
            percentual_livre_risco_ajustada_opiniao: percentual_livre_risco_ajustada_opiniao,
            
            pesos_posterior: pesos_posterior, 
            retornos_posterior: retornos_posterior,
            pesos_posterior_risco: pesos_posterior_ajustado_risco,
            percentual_livre_risco: percentual_livre_risco,
        }
    }

    return { calculaModeloBlackLitterman }
}();