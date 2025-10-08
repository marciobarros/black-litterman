// Retorna o template da página de exportação
function pegaTemplateExportacao() {
    return `
      <div class="container">
        <h2 class="mb-4 txt-left">Importação / Exportação</h2>

        <div class="card shadow-sm">
          <div class="card-body">
            <div class="mb-3">
              <label for="importacao" class="form-label">Importação</label>
              <textarea class="form-control" rows="10" id="importacao"></textarea>
            </div>

            <button id="importar-modelo" class="btn btn-primary">Importar</button>
          </div>
        </div>

        <div class="card shadow-sm mt-4">
          <div class="card-body">
            <div class="mb-3">
              <label for="exportacao" class="form-label">Exportação</label>
              <textarea class="form-control" rows="10" id="exportacao"></textarea>
            </div>
          </div>
        </div>

        <div id="mensagem-importacao" class="mt-3"></div>
      </div>`;
}

// Importa o modelo
function importaModelo() {
  const texto = $("#importacao").val();
  salvaDados(JSON.parse(texto));
  $("#mensagem-importacao").html(`<div class="alert alert-success">✅ Modelo importado com sucesso!</div>`);
  $("#exportacao").val(JSON.stringify(pegaDados(), null, 2));
}

// Função inicial
function preparaPaginaExportacao() {
  $("#exportacao").val(JSON.stringify(pegaDados(), null, 2));
  $("#importar-modelo").click(importaModelo);
}