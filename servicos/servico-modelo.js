const STORAGE_KEY_DADOS = "dados";

const STORAGE_KEY_ATIVOS = "ativos";

const STORAGE_KEY_CORRELACAO = "ativos-correlacao";

const STORAGE_KEY_PARAMETROS = "parametros";

// Carrega todos os dados do localStorage
function pegaDados() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY_DADOS)) || {};
}

// Salva todos os dados no localStorage
function salvaDados(dados) {
  localStorage.setItem(STORAGE_KEY_DADOS, JSON.stringify(dados));
}

// Carrega os ativos do localStorage
function pegaAtivos() {
  //return JSON.parse(localStorage.getItem(STORAGE_KEY_ATIVOS)) || [];
  return pegaDados().ativos || [];
}

// Salva os ativos no localStorage
function salvaAtivos(elements) {
  var dados = pegaDados();
  dados.ativos = elements;
  salvaDados(dados);
}

// Carrega a correlacao do LocalStorage
function pegaCorrelacaoAtivos(ativos) {
    const jsonMatriz = pegaDados().correlacao || {};

    let matriz = Array.from({length: ativos.length}, () => Array(ativos.length).fill(0));

    for (var i = 0; i < ativos.length; i++) {
        var ativoI = ativos[i].nomeCurto.toLowerCase();
        matriz[i][i] = 1.0

        for (var j = i + 1; j < ativos.length; j++) {
            var ativoJ = ativos[j].nomeCurto.toLowerCase();
            var propriedade = "corr-" + ativoI + "-" + ativoJ;

            if (jsonMatriz[propriedade]) {
                matriz[i][j] = matriz[j][i] = jsonMatriz[propriedade];
            }
            else {
                matriz[i][j] = matriz[j][i] = 0.0;
            }
        }
    }

    return matriz;
}

// Salva a correlacao no LocalStorage
function salvaCorrelacaoAtivos(ativos, matriz) {
    var jsonMatriz = {}

    for (var i = 0; i < ativos.length; i++) {
        var ativoI = ativos[i].nomeCurto.toLowerCase();

        for (var j = i + 1; j < ativos.length; j++) {
            var ativoJ = ativos[j].nomeCurto.toLowerCase();
            var propriedade = "corr-" + ativoI + "-" + ativoJ;
            jsonMatriz[propriedade] = matriz[i][j];
        }
    }

  var dados = pegaDados();
  dados.correlacao = jsonMatriz;
  salvaDados(dados);
}

// Carrega os parametros do localStorage
function pegaParametros() {
  return pegaDados().parametros || { aversaoRisco: 2.5, tau: 0.05 };
  //return JSON.parse(localStorage.getItem(STORAGE_KEY_PARAMETROS)) || { aversaoRisco: 2.5, tau: 0.05 };
}

// Salva os parametros no localStorage
function salvaParametros(aversaoRisco, tau) {
  const jsonParametros = { aversaoRisco: parseFloat(aversaoRisco), tau: parseFloat(tau) };
  var dados = pegaDados();
  dados.parametros = jsonParametros;
  salvaDados(dados);
}
