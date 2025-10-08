let sortConfig = { key: null, direction: "asc" };

// Retorna o template da página de ativos
function pegaTemplateAtivos() {
  return `
    <div class="container-ativos mt-4">
      <h2 class="mb-4 text-left">Ativos passíveis de investimento</h2>

      <!-- Formulário -->
      <div class="card mb-4">
        <div class="card-header">Criar ou editar ativo</div>
        <div class="card-body">
          <form id="elementForm">
            <input type="hidden" id="editIndex">
            <div class="row g-3">
              <div class="col-md-2">
                <label class="form-label">Nome curto</label>
                <input type="text" class="form-control" id="nome-curto" required>
              </div>
              <div class="col-md-4">
                <label class="form-label">Nome longo</label>
                <input type="text" class="form-control" id="nome-longo" required>
              </div>
              <div class="col-md-2">
                <label class="form-label">Volatilidade (%)</label>
                <input type="number" class="form-control" id="volatilidade" required min="1" max="100" step="0.01">
              </div>
              <div class="col-md-2">
                <label class="form-label">Capitalização (%)</label>
                <input type="number" class="form-control" id="capitalizacao" required min="0" max="100" step="0.01">
              </div>
              <div class="col-md-2">
                <label class="form-label">Opinião (%)</label>
                <input type="number" class="form-control" id="opiniao" required min="-100" max="100" step="0.01">
              </div>
            </div>
            <div class="mt-3">
              <button type="submit" class="btn btn-primary">Salvar</button>
              <button type="reset" class="btn btn-secondary" id="cancelEdit" style="display:none;">Cancelar edição</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Tabela -->
      <div class="card">
        <div class="card-header">Lista de ativos passíveis de investimento</div>
        <div class="card-body p-0">
          <table class="table table-striped table-hover mb-0" id="elementTable">
            <thead class="table-dark">
              <tr>
                <th class="sortable" data-key="nomeCurto">Nome curto</th>
                <th class="sortable" data-key="nomeLongo">Nome longo</th>
                <th class="sortable" data-key="volatilidade">Volatilidade (%)</th>
                <th class="sortable" data-key="capitalizacao">Capitalização (%)</th>
                <th class="sortable" data-key="opiniao">Opinião (%)</th>
                <th class="text-right">Ações</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>`
}

// Renderiza a tabela
function apresentaTabelaAtivos() {
  let elements = pegaAtivos();

  // Ordenação
  if (sortConfig.key) {
    elements.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      if (sortConfig.key === "volatilidade" || sortConfig.key === "capitalizacao" || sortConfig.key === "opiniao") {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      } else {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const tbody = $("#elementTable tbody");
  tbody.empty();

  if (elements.length === 0) {
    tbody.append(`<tr><td colspan="6" class="text-center text-muted">Nenhum ativo encontrado</td></tr>`);
    return;
  }

  elements.forEach((el, index) => {
    tbody.append(`
      <tr>
        <td>${el.nomeCurto}</td>
        <td>${el.nomeLongo}</td>
        <td>${parseFloat(el.volatilidade).toFixed(2)}</td>
        <td>${parseFloat(el.capitalizacao).toFixed(2)}</td>
        <td>${parseFloat(el.opiniao).toFixed(2)}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-2" onclick="editaAtivo(${index})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="removeAtivo(${index})">Remover</button>
        </td>
      </tr>
    `);
  });
}

// Editar elemento
function editaAtivo(index) {
  const el = pegaAtivos()[index];
  $("#nome-curto").val(el.nomeCurto);
  $("#nome-longo").val(el.nomeLongo);
  $("#volatilidade").val(el.volatilidade);
  $("#capitalizacao").val(el.capitalizacao);
  $("#opiniao").val(el.opiniao);
  $("#editIndex").val(index);
  $("#cancelEdit").show();
}

// Salva um ativo em edição
function atualizaAtivo(e) {
  e.preventDefault();
  const nomeCurto = $("#nome-curto").val().trim();
  const nomeLongo = $("#nome-longo").val().trim();
  const volatilidade = $("#volatilidade").val();
  const capitalizacao = $("#capitalizacao").val();
  const opiniao = $("#opiniao").val();
  const editIndex = $("#editIndex").val();

  if (!nomeCurto) 
    return alert("Informe o nome curto do ativo.");

  if (nomeCurto.length > 5) 
    return alert("O nome curto não deve ter mais do que 5 caracteres");

  if (!nomeLongo) 
    return alert("Informe o nome longo longo.");

  if (nomeCurto.length > 20) 
    return alert("O nome longo não deve ter mais do que 20 caracteres.");

  if (volatilidade > 100 || volatilidade < 1) 
    return alert("A volatilidade do ativo deve estar entre 1% e 100%.");

  if (capitalizacao > 100 || capitalizacao < 0) 
    return alert("A capitalização do ativo deve estar entre 0% e 100%.");

  if (opiniao > 100 || opiniao < -100) 
    return alert("A opinião sobre o ativo deve estar entre 0% e 100%.");

  let ativos = pegaAtivos();
  const novoAtivo = { nomeCurto, nomeLongo, volatilidade, capitalizacao, opiniao };

  if (editIndex === "") {
    ativos.push(novoAtivo);
  } else {
    ativos[editIndex] = novoAtivo;
  }

  salvaAtivos(ativos);
  apresentaTabelaAtivos();
  this.reset();
  $("#cancelEdit").hide();
  $("#editIndex").val("");
}

// Remover elemento
function removeAtivo(index) {
  if (!confirm("Tem certeza que deseja remover este ativo?")) return;
  let elements = pegaAtivos();
  elements.splice(index, 1);
  salvaAtivos(elements);
  apresentaTabelaAtivos();
}

// Cancela a edicao do ativo
function cancelaEdicaoAtivo() {
  $("#elementForm")[0].reset();
  $("#editIndex").val("");
  $(this).hide();
}

// Ordena a tabela
function ordenaAtivos() {
  const key = $(this).data("key");
  if (sortConfig.key === key) {
    sortConfig.direction = sortConfig.direction === "asc" ? "desc" : "asc";
  } else {
    sortConfig.key = key;
    sortConfig.direction = "asc";
  }
  $("th.sortable").removeClass("asc desc");
  $(this).addClass(sortConfig.direction);
  apresentaTabelaAtivos();
}

// Inicialização
function preparaPaginaAtivos() {
  $("#elementForm").on("submit", atualizaAtivo);
  $("#cancelEdit").on("click", cancelaEdicaoAtivo);
  $("th.sortable").on("click", ordenaAtivos);
  apresentaTabelaAtivos();
}