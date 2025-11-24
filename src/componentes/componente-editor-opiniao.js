var componenteEditorOpiniao = function() {

  // Template da página de correlação
  const template = `
    <div class="container-opiniao">
      <h2 class="mb-4 text-left">Opiniões sobre os ativos</h2>
      <div id="opiniaoContainer" class="mb-4"></div>
      <div class="mt-3">
        <button type="button" id="btNovaOpiniao" class="btn btn-primary">Nova Opinião</button>
      </div>
    </div>`

  // Gera a tabela que representa a matriz de correlação
  function geraTabelaOpiniao() {
    var ativos = servicoModelo.pegaAtivos()
    var opinioes = servicoModelo.pegaOpinioes()

    const nomes = ativos.map(a => a.nomeCurto).filter(s => s.length > 0);

    if (nomes.length === 0) {
      return;
    }

    let html = `<table class="table table-bordered text-center align-middle">
                  <thead class="table-secondary">
                    <tr>
                      <th>#</th>
                      ${nomes.map(n => `<th>${n}</th>`).join("")}
                      <th>Retorno</th>
                      <th>Omega</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>`;

    for (let indiceOpiniao = 0; indiceOpiniao < opinioes.length; indiceOpiniao++) {
      const opiniao = opinioes[indiceOpiniao]

      const opiniaoHabilitada = (opiniao.habilitada === undefined) ? false : opiniao.habilitada
      const classeColuna = opiniaoHabilitada ? "" : "opiniao-desabilitada"
      const statusComponentes = opiniaoHabilitada ? "" : "disabled"

      html += `<tr><th class="table-secondary">${indiceOpiniao+1}</th>`;

      for (let indiceNome = 0; indiceNome < nomes.length; indiceNome++) {
        var value = (opiniao[nomes[indiceNome]] !== undefined) ? opiniao[nomes[indiceNome]] : 0
        html += `<td class="${classeColuna}"><input type="number" class="valor" min="-1" max="1" step="0.0001" data-indice="${indiceOpiniao}" data-ativo="${indiceNome}" value="${value}" ${statusComponentes}></td>`;
      }

      html += `<td class="${classeColuna}"><input type="number" min="0" max="100" step="0.1" class="retorno" data-indice="${indiceOpiniao}" value="${opiniao.retorno}" ${statusComponentes}></td>`;
      html += `<td class="${classeColuna}"><input type="number" min="0" max="10000" step="0.1" class="omega" data-indice="${indiceOpiniao}" value="${opiniao.omega}" ${statusComponentes}></td>`;
      html += `<td class="${classeColuna}" class="text-center">`

      if (opiniaoHabilitada) {
        html += `<button style="margin-right: 4px" class="btn btn-sm btn-primary btn-desabilita-opiniao" data-indice="${indiceOpiniao}"><i class="bi bi-eye"></i></button>`
      }
      else {
        html += `<button style="margin-right: 4px" class="btn btn-sm btn-primary btn-habilita-opiniao" data-indice="${indiceOpiniao}"><i class="bi bi-eye-slash"></i></button>`
      }

      html += `<button class="btn btn-sm btn-danger btn-remove-opiniao" data-indice="${indiceOpiniao}"><i class="bi bi-trash"></i></button>`
      html += `</td>`
      html += `</tr>`;
    }

    if (opinioes.length === 0) {
      html += `<tr><td colspan="${nomes.length + 3}">Nenhuma opinião definida.</td></tr>`;
    }

    html += `</tbody></table>`;
    $("#opiniaoContainer").html(html);
  }

  // Salva a participação de um ativo em uma opinião
  function salvaParticipacaoAtivoOpiniao(event) {
    const indiceOpiniao = parseInt($(event.currentTarget).data("indice"))
    const indiceAtivo = parseInt($(event.currentTarget).data("ativo"))

    var ativos = servicoModelo.pegaAtivos()
    var opinioes = servicoModelo.pegaOpinioes()

    const nomes = ativos.map(a => a.nomeCurto).filter(s => s.length > 0);
    opinioes[indiceOpiniao][nomes[indiceAtivo]] = parseFloat($(event.currentTarget).val())
    servicoModelo.salvaOpinioes(opinioes)
  }

  // Salva o retorno associado a uma opinião
  function salvaRetornoOpiniao(event) {
    const indiceOpiniao = parseInt($(event.currentTarget).data("indice"))
    var opinioes = servicoModelo.pegaOpinioes()
    opinioes[indiceOpiniao].retorno = parseFloat($(event.currentTarget).val())
    servicoModelo.salvaOpinioes(opinioes)
  }

  // Salva o omega associado a uma opinião
  function salvaOmegaOpiniao(event) {
    const indiceOpiniao = parseInt($(event.currentTarget).data("indice"))
    var opinioes = servicoModelo.pegaOpinioes()
    opinioes[indiceOpiniao].omega = parseFloat($(event.currentTarget).val())
    servicoModelo.salvaOpinioes(opinioes)
  }

  // Cria uma nova opinião
  function novaOpiniao() {
    var opinioes = servicoModelo.pegaOpinioes()
    opinioes.push({ retorno: 0, omega: 0, habilitada: true })
    servicoModelo.salvaOpinioes(opinioes)
    geraTabelaOpiniao()
  }

  // Remove uma opinião
  function removeOpiniao(event) {
    const indiceOpiniao = parseInt($(event.currentTarget).data("indice"))
    var opinioes = servicoModelo.pegaOpinioes()
    opinioes.splice(indiceOpiniao, 1)
    servicoModelo.salvaOpinioes(opinioes)
    geraTabelaOpiniao()
  }

  // Habilita uma opinião
  function habilitaOpiniao(event) {
    const indiceOpiniao = parseInt($(event.currentTarget).data("indice"))
    var opinioes = servicoModelo.pegaOpinioes()
    opinioes[indiceOpiniao].habilitada = true
    servicoModelo.salvaOpinioes(opinioes)
    geraTabelaOpiniao()
  }

  // Desabilita uma opinião
  function desabilitaOpiniao(event) {
    const indiceOpiniao = parseInt($(event.currentTarget).data("indice"))
    var opinioes = servicoModelo.pegaOpinioes()
    opinioes[indiceOpiniao].habilitada = false
    servicoModelo.salvaOpinioes(opinioes)
    geraTabelaOpiniao()
  }

  // Função inicial
  function apresenta() {
      geraTabelaOpiniao()
      $(document).on("input", ".container-opiniao .valor", salvaParticipacaoAtivoOpiniao)
      $(document).on("input", ".container-opiniao .retorno", salvaRetornoOpiniao)
      $(document).on("input", ".container-opiniao .omega", salvaOmegaOpiniao)
      $(document).on('click', '.container-opiniao .btn-remove-opiniao', removeOpiniao)
      $(document).on('click', '.container-opiniao .btn-habilita-opiniao', habilitaOpiniao)
      $(document).on('click', '.container-opiniao .btn-desabilita-opiniao', desabilitaOpiniao)
      $(document).on('click', '#btNovaOpiniao', novaOpiniao)
  }

  return { template, apresenta }
}()