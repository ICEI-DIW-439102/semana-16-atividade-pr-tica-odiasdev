// Configuração da API (JSON Server)
const API_URL = "http://localhost:3000/filmes";

/**
 * READ - Busca todos os filmes da API (GET)
 */
async function fetchItems() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return [];
  }
}

/**
 * Cria o elemento HTML de um card a partir de um item
 */
function createCard(item) {
  const card = document.createElement("article");
  card.className = "card";

  card.innerHTML = `
    <div class="card-image-wrapper">
      <img src="${item.imagem}" alt="Pôster de ${item.titulo}" class="card-image" />
      ${item.destaque ? '<span class="badge-destaque">Destaque</span>' : ""}
    </div>
    <div class="card-body">
      <span class="card-categoria">${item.genero}</span>
      <h3 class="card-titulo">${item.titulo}</h3>
      <p class="card-descricao">${item.sinopseCurta}</p>
      <div class="card-footer">
        <span class="card-preco">★ ${item.nota}<small> · ${item.ano}</small></span>
        <a href="details.html?id=${item.id}" class="btn-detalhes">Ver detalhes</a>
      </div>
      <div class="card-actions">
        <a href="cadastro_filme.html?id=${item.id}" class="btn-acao btn-editar-card">✏️ Editar</a>
        <button class="btn-acao btn-excluir-card" data-id="${item.id}">🗑️ Excluir</button>
      </div>
    </div>
  `;

  // DELETE - exclui o filme e atualiza a lista dinamicamente
  card.querySelector(".btn-excluir-card").addEventListener("click", () => excluirFilme(item.id, item.titulo));

  return card;
}

/**
 * Renderiza a lista de cards no container
 */
function renderCards(items) {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  if (!items || items.length === 0) {
    container.innerHTML = '<p class="loading">Nenhum filme cadastrado.</p>';
    return;
  }

  items.forEach((item) => container.appendChild(createCard(item)));
}

/**
 * DELETE - Remove um filme e recarrega a lista (atualização dinâmica da DOM)
 */
async function excluirFilme(id, titulo) {
  if (!confirm(`Deseja realmente excluir "${titulo}"?`)) return;
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    await carregar(); // recarrega a lista sem recarregar a página
  } catch (error) {
    console.error("Erro ao excluir:", error);
    alert("Não foi possível excluir o filme.");
  }
}

/**
 * Carrega e renderiza os filmes
 */
async function carregar() {
  const items = await fetchItems();
  renderCards(items);
}

document.addEventListener("DOMContentLoaded", carregar);
