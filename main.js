//DOM
const searchInput = document.getElementById("search");
const searchResultsElement = document.getElementById("search-results");
const searchResultsList = document.getElementById("search-results-list");
const pokemonInfo = document.getElementById("pokemon-info");

let pokemonNames;

let fetchedPokemon = new Map();

async function fetchAllPokemonNames() {
  const response = await fetch("/pokeapi.co.json");
  // const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1302");
  const result = await response.json();
  pokemonNames = result.results.map((pokemon) => pokemon.name);
}
fetchAllPokemonNames();

async function fetchIndividualPokemon(idOrName) {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon/" + idOrName + "/"
  );
  const pokemon = await response.json();
  return pokemon;
}

function clearResults() {
    fetchedPokemon.clear();

    const listItems = document.querySelectorAll("#search-results-list li");

    Array.from(listItems).forEach((listItem) => {
      listItem.parentNode.removeChild(listItem);
    });


}

function clearStats() {
      const statDivs = document.querySelectorAll(".stat div");
      Array.from(statDivs).forEach((stat) => {
        stat.parentNode.removeChild(stat);
      });
}

async function search() {
  clearResults();


  if (searchInput.value.length >= 1) {
    if (Number(searchInput.value)) {
      const pokemon = await fetchIndividualPokemon(Number(searchInput.value));
      addResults(pokemon);
    } else {
      for (let name = 0; name < pokemonNames.length; name++) {
        if (searchInput.value.toLowerCase().startsWith(pokemonNames[name].toLowerCase().substring(0,searchInput.value.length))) 
        {
          
          let pokemon = await fetchIndividualPokemon(pokemonNames[name]);
          addResults(pokemon);
        }
      }
    }
  }
}

function addResults(pokemon) {
  fetchedPokemon.set(pokemon.name, pokemon);

  const li = document.createElement("li");
  const a = document.createElement("a");
  a.textContent = pokemon.name;
  searchResultsList.appendChild(li);
  li.appendChild(a);

  li.addEventListener("click", displayPokemonInfo);
}

function displayPokemonInfo() {
      const statDivs = document.querySelectorAll(".stat");
      Array.from(statDivs).forEach((stat) => {
        stat.parentNode.removeChild(stat);
      });
  const name = this.textContent;
  let pokemon = fetchedPokemon.get(name);

  let types = [];
  let stats = new Map();
  let abilities = [];

  for (let index = 0; index < pokemon.types.length; index++) {
    types.push(pokemon.types[index].type.name); 
  }
  for (let index = 0; index < pokemon.stats.length; index++) {
    stats.set(pokemon.stats[index].stat.name, pokemon.stats[index].base_stat);
  }
  for (let index = 0; index < pokemon.abilities.length; index++) {
    abilities.push(pokemon.abilities[index].ability.name);
  }

  for(const [key, value] of stats) {
    const statDivElement = document.createElement("div");
    const statNameElement = document.createElement("h5");
    const statValueElement = document.createElement("p");

    statDivElement.className = "stat"

    statNameElement.textContent = key;
    statValueElement.textContent = value;


    document.getElementById("pokemon-info-stats").appendChild(statDivElement);
    statDivElement.appendChild(statNameElement);
    statDivElement.appendChild(statValueElement);
  }

  document.getElementById("pokemon-info-name").textContent = pokemon.name;
  document.getElementById("pokemon-info-id").textContent = pokemon.id;
  document.getElementById("pokemon-info-type").textContent = types.join(", ");

  document.getElementById("pokemon-info-img").src = pokemon.sprites.front_default;

  document.getElementById("pokemon-info-abilities").textContent = abilities.join(", ");

}

searchInput.addEventListener("change", search);
