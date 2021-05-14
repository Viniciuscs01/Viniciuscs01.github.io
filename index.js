let pokemons = [];
let offset = 0;
let limit = 10;
let ids = Array.from([...new Array(limit).keys()]);
const readPokemons = async () => {
  // let ids = [];
  // for (let i = offset + 1; i <= offset + limit; i++) {
  //   ids.push(i)
  // }

  const data = await Promise.all(ids.map(id =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${id + 1 + offset}`).then(response => response.json())
  ));

  offset += limit;

  for (let i = 0; i < data.length; i++) {
    pokemons.push(
      {
        nome: data[i].name,
        habilidades: data[i].types.map(t => t.type.name),
        id: data[i].id,
        imagem: data[i].sprites.other["official-artwork"].front_default
      })
  }
}

const renderPokemons = (filter) => {
  let newPokemons;
  if (!filter)
    newPokemons = pokemons;
  else
    newPokemons = pokemons.filter(p => p.nome.toLowerCase().indexOf(filter) > -1);

  let html = "";
  for (let i = 0; i < newPokemons.length; i++) {
    let pokemon = newPokemons[i];
    html += `
    <li class="pokemonCard">
      <div class="image">
        <img height="200px" src="${pokemon.imagem}" />
      </div>
      <div class="info">
        <p>${pokemon.id.toString().padStart(3, 0)}</p>
        <h5>${pokemon.nome}</h5>
      </div>
      <div class="habilidades">
        ${pokemon.habilidades.map(h => `<span class="${h}">${h}</span>`)}
      </div>
    </li>`
  }

  const listContainer = document.querySelector('.pokemonList');
  listContainer.innerHTML = html;
}

window.onload = async function () {
  await readPokemons();
  renderPokemons();
  let searchBar = document.getElementById('searchBar');
  searchBar.addEventListener("input", function (e) {
    renderPokemons(e.target.value.toLowerCase());
  });
  document.getElementById('loadMore').addEventListener("click", async function (e) {
    await readPokemons();
    renderPokemons(searchBar.value);
  });
}
