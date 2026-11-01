

const categorias = [
  "Romance",
  "Ficção científica",
  "Fantasia",
  "Técnico",
  "Biografia",
  "História",
] as const;

type Categoria = (typeof categorias)[number];
type Status = "quero-ler" | "lendo" | "lido";

const listaStatus: Status[] = ["quero-ler", "lendo", "lido"];

const rotuloStatus: Record<Status, string> = {
  "quero-ler": "Quero ler",
  lendo: "Lendo",
  lido: "Lido",
};

interface Livro {
  id: number;
  titulo: string;
  categoria: Categoria;
  ano: number;
  status: Status;
}

let livros: Livro[] = [
  { id: 1, titulo: "Dom Casmurro", categoria: "Romance", ano: 1899, status: "lido" },
  { id: 2, titulo: "Duna", categoria: "Ficção científica", ano: 1965, status: "lendo" },
  { id: 3, titulo: "Código Limpo", categoria: "Técnico", ano: 2008, status: "quero-ler" },
];
let proximoId = 4;


function pegar<T extends HTMLElement = HTMLElement>(id: string): T {
  const elemento = document.getElementById(id);
  if (elemento === null) {
    throw new Error(`Elemento #${id} não encontrado no HTML`);
  }
  return elemento as T;
}

const formulario = pegar<HTMLFormElement>("form-livro");
const campoTitulo = pegar<HTMLInputElement>("titulo");
const campoCategoria = pegar<HTMLSelectElement>("categoria");
const campoAno = pegar<HTMLInputElement>("ano");
const campoStatus = pegar<HTMLSelectElement>("status");
const msgErro = pegar<HTMLParagraphElement>("erro");

const campoBusca = pegar<HTMLInputElement>("busca");
const filtroCategoria = pegar<HTMLSelectElement>("filtro-categoria");
const textoContagem = pegar("contagem");
const listaLivros = pegar<HTMLUListElement>("lista");
const msgVazio = pegar<HTMLParagraphElement>("vazio");



function ehCategoria(valor: string): valor is Categoria {
  return (categorias as readonly string[]).includes(valor);
}


function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}


function validarCampos(titulo: string, categoria: string, ano: string): string | null {
  if (titulo.trim() === "") {
    return "Informe o título do livro.";
  }
  if (!ehCategoria(categoria)) {
    return "Escolha uma categoria.";
  }
  if (ano.trim() === "") {
    return "Informe o ano de publicação.";
  }

  const numero = Number(ano);
  const anoAtual = new Date().getFullYear();
  if (!Number.isInteger(numero) || numero < 1000 || numero > anoAtual) {
    return `O ano precisa ser um número inteiro entre 1000 e ${anoAtual}.`;
  }
  return null;
}

function adicionarLivro(dados: Omit<Livro, "id">): void {
  livros.push({ id: proximoId, ...dados });
  proximoId++;
}

function removerLivro(id: number): void {
  livros = livros.filter((livro) => livro.id !== id);
  atualizarTela();
}

function mudarStatus(id: number, novoStatus: Status): void {
  const livro = livros.find((l) => l.id === id);
  if (livro === undefined) {
    return;
  }
  livro.status = novoStatus;
  atualizarTela();
}

function buscarLivros(): Livro[] {
  const termo = normalizar(campoBusca.value.trim());
  const categoria = filtroCategoria.value;

  return livros.filter((livro) => {
    const achouTitulo = normalizar(livro.titulo).includes(termo);
    const achouCategoria = categoria === "" || livro.categoria === categoria;
    return achouTitulo && achouCategoria;
  });
}

function contarPorStatus(): Record<Status, number> {
  const contagem: Record<Status, number> = { "quero-ler": 0, lendo: 0, lido: 0 };
  for (const livro of livros) {
    contagem[livro.status]++;
  }
  return contagem;
}


function criarItem(livro: Livro): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "livro";
  item.dataset.status = livro.status;

  const titulo = document.createElement("h3");
  titulo.textContent = livro.titulo;

  const categoria = document.createElement("span");
  categoria.textContent = livro.categoria;
  const ano = document.createElement("span");
  ano.textContent = String(livro.ano);

  const detalhes = document.createElement("p");
  detalhes.className = "detalhes";
  detalhes.append(categoria, ano);

  const texto = document.createElement("div");
  texto.className = "texto";
  texto.append(titulo, detalhes);

  const seletor = document.createElement("select");
  seletor.setAttribute("aria-label", `Status de ${livro.titulo}`);
  for (const s of listaStatus) {
    seletor.add(new Option(rotuloStatus[s], s));
  }
  seletor.value = livro.status;
  seletor.addEventListener("change", () => {

    mudarStatus(livro.id, seletor.value as Status);
  });

  const botaoExcluir = document.createElement("button");
  botaoExcluir.type = "button";
  botaoExcluir.className = "excluir";
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.setAttribute("aria-label", `Excluir ${livro.titulo}`);
  botaoExcluir.addEventListener("click", () => removerLivro(livro.id));

  const acoes = document.createElement("div");
  acoes.className = "acoes";
  acoes.append(seletor, botaoExcluir);

  item.append(texto, acoes);
  return item;
}

function renderizarLista(): void {
  const visiveis = buscarLivros();
  listaLivros.replaceChildren(...visiveis.map((livro) => criarItem(livro)));

  if (livros.length === 0) {
    msgVazio.textContent = "Nenhum livro cadastrado ainda. Use o formulário para adicionar o primeiro.";
  } else {
    msgVazio.textContent = "Nenhum livro encontrado. Tente outro título ou escolha outra categoria.";
  }
  msgVazio.hidden = visiveis.length > 0;

  textoContagem.textContent = `Mostrando ${visiveis.length} de ${livros.length}`;
}

function renderizarResumo(): void {
  const porStatus = contarPorStatus();
  pegar("resumo-total").textContent = String(livros.length);
  for (const s of listaStatus) {
    pegar("resumo-" + s).textContent = String(porStatus[s]);
  }
}

function atualizarTela(): void {
  renderizarLista();
  renderizarResumo();
}

function mostrarErro(texto: string): void {
  msgErro.textContent = texto;
  msgErro.hidden = texto === "";
}

function preencherOpcoes(): void {
  for (const cat of categorias) {
    campoCategoria.add(new Option(cat, cat));
    filtroCategoria.add(new Option(cat, cat));
  }
  for (const s of listaStatus) {
    campoStatus.add(new Option(rotuloStatus[s], s));
  }
}



formulario.addEventListener("submit", (evento: SubmitEvent) => {
  evento.preventDefault();

  const titulo = campoTitulo.value.trim();
  const categoria = campoCategoria.value;
  const erro = validarCampos(titulo, categoria, campoAno.value);

  if (erro !== null || !ehCategoria(categoria)) {
    mostrarErro(erro ?? "Escolha uma categoria.");
    return;
  }

  adicionarLivro({
    titulo,
    categoria,
    ano: Number(campoAno.value),
    status: campoStatus.value as Status,
  });

  formulario.reset();
  mostrarErro("");
  campoTitulo.focus();
  atualizarTela();
});


formulario.addEventListener("input", () => mostrarErro(""));

campoBusca.addEventListener("input", renderizarLista);
filtroCategoria.addEventListener("change", renderizarLista);

preencherOpcoes();
atualizarTela();
