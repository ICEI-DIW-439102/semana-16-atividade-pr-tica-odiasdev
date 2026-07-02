// Configuração da API (JSON Server)
const API_URL = "http://localhost:3000/filmes";

/**
 * READ - Busca todos os filmes da API
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
    </div>
  `;

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
 * Inicialização
 */
async function init() {
  const items = await fetchItems();
  renderCards(items);
}

document.addEventListener("DOMContentLoaded", init);
