// Retorna o template da página de parâmetros
function pegaTemplateParametros() {
    return `
      <div class="container">
        <h2 class="mb-4">Parâmetros do modelo</h2>

        <div class="card shadow-sm">
          <div class="card-body">
            <div class="mb-3">
              <label for="aversaoRisco" class="form-label">Aversão a risco (delta)</label>
              <input type="number" id="aversaoRisco" step="0.01" class="form-control" placeholder="Exemplo: 2.5">
            </div>

            <div class="mb-3">
              <label for="tau" class="form-label">Tau</label>
              <input type="number" id="tau" step="0.0001" class="form-control" placeholder="Exemplo: 0.05">
            </div>

            <button id="salvar-parametros" class="btn btn-primary">Salvar</button>
          </div>
        </div>

        <div id="mensagem-parametros" class="mt-3"></div>
      </div>`;
}

// Apresenta os parametros no formulario
function apresentaValoresParametros(parametros) {
  $("#aversaoRisco").val(parametros.aversaoRisco);
  $("#tau").val(parametros.tau);
}

// Salva os parametros do formulario
function salvaParametrosFormulario() {
  const aversaoRisco = parseFloat($("#aversaoRisco").val()).toFixed(2);
  const tau = parseFloat($("#tau").val()).toFixed(4);

  if (isNaN(aversaoRisco) || isNaN(tau)) {
    $("#mensagem-parametros").html(`<div class="alert alert-warning">Por favor, insira valores válidos para os parâmetros.</div>`);
    return;
  }

  salvaParametros(aversaoRisco, tau);
  $("#mensagem-parametros").html(`<div class="alert alert-success">✅ Valores salvos com sucesso!</div>`);
}

// Função inicial
function preparaPaginaParametros() {
  const parametros = pegaParametros();
  apresentaValoresParametros(parametros);
  $("#salvar-parametros").click(salvaParametrosFormulario);
}