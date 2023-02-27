var pagination = 0;
var pokemon;
var nextBtn = document.getElementById("nextBtn");
nextBtn.addEventListener("click", function(){
  if (pagination >= 1008){
    return;
  }
  pagination += 12;
  getPokemonInfo(pagination);
})
async function getPokemonInfo(offset){
  try{
    var selection = document.getElementById("pokedex");
    var pokeinfo = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=12&offset=${offset}`);
    var pokemon  = pokeinfo.data.results;
    pokemon.forEach(async pokemon =>{
      selection.appendChild(createDiv(pokemon));
    });
  } catch(error){
    console.error(`Erro ao buscar informações sobre o Pokémon: ${error}`);
  }
}
function createDiv(pokemon){
  var principalDiv = document.createElement("div");
  principalDiv.setAttribute("class", "info-pokemon text-center col-sm-3")
  principalDiv.addEventListener("click", function(){
    openModal(pokemon);
  });

  var infoDiv = document.createElement("div");
  infoDiv.setAttribute("class", "name-of-pokemon");

  var pokemonName= pokemon.name.split(" ").map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(" ");
  infoDiv.textContent=pokemonName;
  createType(pokemon).then(types=> {
    types.reverse();
    principalDiv.appendChild(infoDiv);
    principalDiv.appendChild(createImg(pokemon));
    principalDiv.appendChild(createId(pokemon));
    types.forEach(typeDiv=> {
      principalDiv.appendChild(typeDiv);
    });
  });
  return principalDiv;
}

function createImg(pokemon){
  try{
  var img = document.createElement("img");
  var pokemonId = pokemon.url.split("/")[6];
  if (pokemonId.length === 1) {
    pokemonId = "00" + pokemonId;
  }
  else if (pokemonId.length === 2){
    pokemonId = "0" + pokemonId;
  }
  img.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemonId}.png`; 
  //img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`;
  img.setAttribute("class", "pokeImg");
  } catch(error){
    console.error(`Erro ao buscar imagens do Pokémon: ${error}`);
  }
  return img;
}

function createType(pokemon){
  var id = pokemon.url.split("/")[6];
  return new Promise((resolve, reject)=>{
    try{
    axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(function(pokeType){
        var pokemonTypes = pokeType.data.types;
        var typesArray = [];
        pokemonTypes.forEach(types =>{
            var pType = document.createElement("p");
            pType.textContent = types.type.name.split(" ").map(name => name[0].toUpperCase() + name.slice(1)).join(" ");
            pType.classList.add(`type-${types.type.name}`);
            pType.classList.add("types-of-pokemon");
            typesArray.push(pType);
        });
        resolve(typesArray);
      });
    }catch(error){
        console.log(`Erro ao adicionar os tipos dos pokemons: ${error}`)
      reject(error);
  }
});
}

function createId(pokemon){
  var pokemonId = pokemon.url.split("/")[6];
  if (pokemonId.length === 1) {
    pokemonId = "#000" + pokemonId;
  }
  else if (pokemonId.length === 2){
    pokemonId = "#00" + pokemonId;
  }
  else if (pokemonId.length === 3){
    pokemonId = "#0" + pokemonId;
  }
  else if (pokemonId.length === 4){
    pokemonId = "#" + pokemonId;
  }
  
  var id = document.createElement("p");
  id.setAttribute("class", "pokemon-id")
  id.textContent = pokemonId;
  
  return id;
}
var inputPokemon = document.getElementById("floatingInput");
inputPokemon.addEventListener("input", searchPokemon);
var allPokemon = [];
var limit;
async function getAllPokemon(limit) {
  try {
    var res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    allPokemon = res.data.results;
  } catch (error) {
    console.error(`Erro ao buscar informações sobre os pokemons: ${error}`);
  }
}

function showLoading() {
  nextBtn.style.display = "none"
  var loadingDiv = document.createElement("div");
  loadingDiv.id = "loading";
  loadingDiv.style.display = "flex";
  loadingDiv.innerHTML = `
    <div class="spinner-border text-primary col-sm-3" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `;
  var selection = document.getElementById("pokedex");
  selection.innerHTML = "";
  selection.appendChild(loadingDiv);
}

function hideLoading() {
  var loading = document.getElementById("loading");
  if (loading) {
    loading.remove();
  }
}

async function searchPokemon() {
  showLoading(); // mostra o elemento de carregamento
  var inputValue = inputPokemon.value;
  if (inputValue.length === 0) {
    limit = 12;
  } else {
    limit = 1008;
  }
  await getAllPokemon(limit);
  var pokeFilter = allPokemon.filter(pokemon => {
    return pokemon.name.toLowerCase().includes(inputValue.toLowerCase());
  })
  var selection = document.getElementById("pokedex");
  selection.innerHTML = "";
  if (pokeFilter.length === 0) {
    var notFoundDiv = document.createElement("div");
    notFoundDiv.textContent = "Nenhum pokémon encontrado."
    notFoundDiv.classList.add("not-found")
    selection.appendChild(notFoundDiv)
    nextBtn.style.display = "none"
  } else {
    pokeFilter.forEach(async pokemon => {
      selection.appendChild(await createDiv(pokemon));
    });
    nextBtn.style.display = "flex"
  }
  hideLoading(); // oculta o elemento de carregamento
}

getAllPokemon(limit);
getPokemonInfo();