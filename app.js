// jogo do amigo secreto
let amigos = [];
let sorteioFinalizado = {}; // Objeto para armazenar o resultado do sorteio {doador: presenteado}

function adicionar() {
  let input = document.getElementById("nome");
  // LINHA DE MODIFICAÇÃO 1: Normaliza o nome antes de adicionar
  let nome = input.value.trim().toLowerCase(); // Adiciona .trim() e .toLowerCase() aqui
  // O que muda: Remove espaços em branco do início/fim e converte todo o nome para minúsculas.

  if (!nome) {
    alert("Por favor, digite um nome válido.");
    return;
  }

  // Impede nomes duplicados (a comparação agora é normalizada)
  if (amigos.includes(nome)) {
    alert("Este nome já foi adicionado.");
    return;
  }

  amigos.push(nome);
  atualizarLista();
  input.value = "";
}

function remover(index) {
  amigos.splice(index, 1);
  atualizarLista();
}

function atualizarLista() {
  let lista = document.getElementById("listaAmigos");
  // O 'nome' aqui já estará em minúsculas por causa da modificação na função 'adicionar'
  lista.innerHTML = amigos.map((nome, i) =>
    `<li>${nome} <button onclick="remover(${i})">X</button></li>`
  ).join("");
  document.getElementById("resultado").innerHTML = "";
  sorteioFinalizado = {};
}

function sortear() {
  if (amigos.length < 2) {
    alert("Adicione pelo menos dois nomes para sortear.");
    return;
  }

  let amigosEmbaralhados = [...amigos];
  for (let i = amigosEmbaralhados.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [amigosEmbaralhados[i], amigosEmbaralhados[j]] = [amigosEmbaralhados[j], amigosEmbaralhados[i]];
  }

  let resultadoTemporario = {};
  let sorteioValido = false;

  while (!sorteioValido) {
    sorteioValido = true;
    for (let i = 0; i < amigos.length; i++) {
      let presenteadoIndex = (i + 1) % amigos.length;

      if (amigos[i] === amigosEmbaralhados[presenteadoIndex]) {
        sorteioValido = false;
        for (let k = amigosEmbaralhados.length - 1; k > 0; k--) {
          let l = Math.floor(Math.random() * (k + 1));
          [amigosEmbaralhados[k], amigosEmbaralhados[l]] = [amigosEmbaralhados[l], amigosEmbaralhados[k]];
        }
        break;
      }
      resultadoTemporario[amigos[i]] = amigosEmbaralhados[presenteadoIndex];
    }
  }

  sorteioFinalizado = resultadoTemporario;

  let resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = `
    <h2>Sorteio realizado!</h2>
    <p>Agora, cada participante pode descobrir seu amigo secreto.</p>
    <div class="input-wrapper">
        <input type="text" id="meuNome" class="input-name" placeholder="Digite seu nome para ver quem você tirou">
        <button class="button-reveal" onclick="revelarMeuAmigo()">Revelar</button>
    </div>
    <p id="amigoRevelado" class="result-text"></p>
  `;
}

function revelarMeuAmigo() {
  let meuNomeInput = document.getElementById("meuNome");
  // LINHA DE MODIFICAÇÃO 2: Normaliza o nome antes de procurar no sorteio
  let meuNome = meuNomeInput.value.trim().toLowerCase(); // Adiciona .trim() e .toLowerCase() aqui
  // O que muda: Remove espaços em branco do início/fim e converte todo o nome para minúsculas
  // para que a comparação com os nomes armazenados (que também estão em minúsculas) seja precisa.

  let amigoReveladoParagrafo = document.getElementById("amigoRevelado");

  if (!meuNome) {
    amigoReveladoParagrafo.innerText = "Por favor, digite seu nome.";
    return;
  }

  // A comparação agora é consistente devido à normalização
  if (sorteioFinalizado[meuNome]) {
    let nomeAmigoSorteado = sorteioFinalizado[meuNome];
    // LINHA DE MODIFICAÇÃO 3 (Opcional, para exibição): Capitaliza a primeira letra do nome sorteado
    amigoReveladoParagrafo.innerText = `Você tirou: ${nomeAmigoSorteado.charAt(0).toUpperCase() + nomeAmigoSorteado.slice(1)}`;
    // O que muda: Melhora a apresentação do nome sorteado, tornando a primeira letra maiúscula.
  } else {
    amigoReveladoParagrafo.innerText = "Nome não encontrado no sorteio ou sorteio não realizado. Verifique a grafia.";
  }
  meuNomeInput.value = "";
}