const API_URL = "http://localhost:3000/filmes";

function renderMessage(titulo, mensagem) {
  const container = document.getElementById("details-container");
  container.innerHTML = `
    <div class="erro-box">
      <h2>${titulo}</h2>
      <p>${mensagem}</p>
      <a href="index.html" class="btn-detalhes">Voltar para a Home</a>
    </div>
  `;
}

/**
 * READ - Busca um filme específico pelo id
 */
async function fetchItemById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar item:", error);
    return null;
  }
}

function renderDetails(item) {
  const container = document.getElementById("details-container");
  const tagsHtml = item.tags.map((tag) => `<span class="chip">${tag}</span>`).join("");

  container.innerHTML = `
    <div class="details-card">
      <div class="details-image-wrapper">
        <img src="${item.imagem}" alt="Pôster de ${item.titulo}" class="details-image" />
        ${item.destaque ? '<span class="badge-destaque">Destaque</span>' : ""}
      </div>
      <div class="details-info">
        <span class="card-categoria">${item.genero}</span>
        <h2 class="details-titulo">${item.titulo}</h2>
        <p class="details-endereco">📅 ${item.ano} · ⏱️ ${item.duracao} min</p>
        <div class="details-preco">★ ${item.nota}<small>/10</small></div>
        <h3 class="details-subtitulo">Sinopse</h3>
        <p class="details-descricao">${item.sinopseCompleta}</p>
        <h3 class="details-subtitulo">Tags</h3>
        <div class="chips-container">${tagsHtml}</div>
        <div class="details-actions">
          <a href="cadastro_filme.html?id=${item.id}" class="btn-reservar btn-editar">✏️ Editar</a>
          <button class="btn-reservar btn-excluir" onclick="excluirFilme(${item.id})">🗑️ Excluir</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * DELETE - Exclui o filme pelo id (implementado na etapa de CRUD)
 */
async function excluirFilme(id) {
  if (!confirm("Deseja realmente excluir este filme?")) return;
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    alert("Filme excluído com sucesso!");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Erro ao excluir:", error);
    alert("Não foi possível excluir o filme.");
  }
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    renderMessage("ID não informado", "Nenhum identificador de filme foi passado na URL.");
    return;
  }

  const item = await fetchItemById(id);
  if (!item) {
    renderMessage("Filme não encontrado", `Não foi possível localizar um filme com o ID ${id}.`);
    return;
  }

  renderDetails(item);
}

document.addEventListener("DOMContentLoaded", init);
