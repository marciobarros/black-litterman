// Retorna o template da pagina de correlacao
function pegaTemplateCorrelacao() {
    return `
      <div class="container-correlacao">
        <h2 class="mb-4 text-left">Matriz de correlações entre os ativos</h2>
        <div id="matrizContainer" class="mb-4"></div>
        <div id="resultadoPD" class="mt-3"></div>
      </div>`;
}

// Gera a tabela que representa a matriz de correlação
function geraTabelaMatrizCorrelacao() {
  var ativos = pegaAtivos()
  var matriz = pegaCorrelacaoAtivos(ativos)

  const nomes = ativos.map(a => a.nomeCurto).filter(s => s.length > 0);

  if (nomes.length === 0) {
    return;
  }

  let html = `<table class="table table-bordered text-center align-middle">
                <thead class="table-secondary">
                  <tr><th></th>${nomes.map(n => `<th>${n}</th>`).join("")}</tr>
                </thead>
                <tbody>`;

  for (let i = 0; i < nomes.length; i++) {
    html += `<tr><th class="table-secondary">${nomes[i]}</th>`;

    for (let j = 0; j < nomes.length; j++) {
      if (i === j) {
        html += `<td><input type="number" value="1" step="0.01" disabled></td>`;
      } 
      else if (i < j) {
        var value = matriz[i][j]
        html += `<td><input type="number" step="0.01" min="-1" max="1" data-row="${i}" data-col="${j}" class="valor" value="${value}"></td>`;
      } 
      else {
        var value = matriz[j][i]
        html += `<td><input type="number" step="0.01" disabled data-row="${i}" data-col="${j}" value="${value}"></td>`;
      }
    }

    html += `</tr>`;
  }

  html += `</tbody></table>`;
  $("#matrizContainer").html(html);
  apresentaResultadoPositivoDefinida();
}

// Espelha os valores na tabela
function espelhaValoresCorrelacao() {
  const val = parseFloat($(this).val());
  const row = parseInt($(this).data("row"));
  const col = parseInt($(this).data("col"));
  $(`input[data-row='${col}'][data-col='${row}']`).val(isNaN(val) ? "" : val);
  apresentaResultadoPositivoDefinida();
}

// Verifica se a matriz é positiva definida
function apresentaResultadoPositivoDefinida() {
    const ativos = pegaAtivos();
    const matriz = pegaMatrizTabela();
    salvaCorrelacaoAtivos(ativos, matriz);

    const isPD = verificaPositivoDefinida(matriz);

    if (isPD) {
        $("#resultadoPD").html(`<div class="alert alert-success">✅ A matriz é positiva definida.</div>`);
    } else {
        $("#resultadoPD").html(`<div class="alert alert-danger">❌ A matriz NÃO é positiva definida.</div>`);
    }
}

// Pega a matriz da tabela representada na pagina
function pegaMatrizTabela() {
  const inputs = $("table input");
  const n = $("table thead th").length - 1;
  let M = Array.from({length: n}, () => Array(n).fill(0));

  inputs.each(function() {
    const i = $(this).data("row");
    const j = $(this).data("col");
    const val = parseFloat($(this).val());
    if (i !== undefined && j !== undefined) M[i][j] = val;
  });

  // Preenche a diagonal e parte inferior
  for (let i = 0; i < n; i++) {
    M[i][i] = 1;

    for (let j = 0; j < i; j++) {
      M[i][j] = M[j][i];
    }
  }

  return M;
}

// Função para testar positividade definida via Cholesky
function verificaPositivoDefinida(matrix) {
  const n = matrix.length;
  const L = Array.from({length: n}, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) sum += L[i][k] * L[j][k];

      if (i === j) {
        const diag = matrix[i][i] - sum;
        if (diag <= 0) return false;
        L[i][j] = Math.sqrt(diag);
      } else {
        L[i][j] = (matrix[i][j] - sum) / L[j][j];
      }
    }
  }
  return true;
}

// Função inicial
function preparaPaginaCorrelacao() {
    geraTabelaMatrizCorrelacao()
    $(document).on("input", ".valor", espelhaValoresCorrelacao);
}