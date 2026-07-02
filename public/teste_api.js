const API_URL = "http://localhost:3000/filmes";

const CORES = { GET: "#5db0e0", POST: "#57c46a", PUT: "#e8a33d", DELETE: "#ef5350" };

// Corpo de exemplo usado nas requisições POST e PUT
const filmeExemplo = {
  titulo: "Duna: Parte Dois",
  genero: "Ficção Científica",
  nota: 8.5,
  ano: 2024,
  duracao: 166,
  imagem: "https://picsum.photos/seed/movie-duna/400/600",
  sinopseCurta: "Paul Atreides se une aos Fremen para vingar sua família.",
  sinopseCompleta: "Paul Atreides une-se a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família, tentando evitar um futuro terrível que só ele consegue prever.",
  tags: ["deserto", "especiaria", "profecia", "épico"],
  destaque: true
};

function getTargetId() {
  const el = document.getElementById("target-id");
  return el && el.value ? el.value : "1";
}

/**
 * Monta a URL, o corpo e as opções de fetch para cada método HTTP
 */
function montarRequisicao(metodo) {
  const id = getTargetId();
  switch (metodo) {
    case "GET":
      return { url: API_URL, options: { method: "GET" }, body: null };
    case "POST":
      return { url: API_URL, options: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filmeExemplo)
      }, body: filmeExemplo };
    case "PUT":
      return { url: `${API_URL}/${id}`, options: {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...filmeExemplo, titulo: filmeExemplo.titulo + " (Edição Estendida)", nota: 9.0 })
      }, body: { ...filmeExemplo, titulo: filmeExemplo.titulo + " (Edição Estendida)", nota: 9.0 } };
    case "DELETE":
      return { url: `${API_URL}/${id}`, options: { method: "DELETE" }, body: null };
  }
}

function renderRequisicao(metodo, url, body) {
  const cor = CORES[metodo];
  document.getElementById("req-info").innerHTML = `
    <div class="req-linha">
      <span class="metodo-badge" style="background:${cor}">${metodo}</span>
      ${url}
    </div>
    ${body ? `<pre class="resposta">${JSON.stringify(body, null, 2)}</pre>` : "<p style='color:var(--cor-texto-suave)'>Sem corpo de requisição.</p>"}
  `;
}

async function renderResposta(response) {
  let dados;
  const texto = await response.text();
  try { dados = JSON.parse(texto); } catch { dados = texto; }

  const classe = response.ok ? "status-ok" : "status-fail";
  document.getElementById("res-info").innerHTML = `
    <p class="${classe}">HTTP ${response.status} ${response.statusText || (response.ok ? "OK" : "")}</p>
    <pre class="resposta">${typeof dados === "string" ? dados : JSON.stringify(dados, null, 2)}</pre>
  `;
}

/**
 * Executa a requisição para o método informado
 */
async function run(metodo) {
  const { url, options, body } = montarRequisicao(metodo);
  renderRequisicao(metodo, url, body);
  try {
    const response = await fetch(url, options);
    await renderResposta(response);
  } catch (error) {
    document.getElementById("res-info").innerHTML =
      `<p class="status-fail">Falha na requisição: ${error.message}</p>`;
  }
}

// Permite auto-executar um método via query string (?run=GET&id=1)
// usado para gerar os prints de cada teste automaticamente.
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const metodo = params.get("run");
  const id = params.get("id");
  if (id) document.getElementById("target-id").value = id;
  if (metodo) run(metodo.toUpperCase());
});
