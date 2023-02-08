var pagination = 0;
document.getElementById("nextBtn").addEventListener("click", function(){
  if (pagination >= 1008){
    return;
  }
  pagination += 12;
  getPokemonInfo(pagination);
})

async function getPokemonInfo(offset){
  if (offset > 1008){
    return;
  }
  try{
    var selection = document.getElementById("pokedex");
    var pokeinfo = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=12&offset=${offset}`);
    var pokemon  = pokeinfo.data.results;
    pokemon.forEach(async pokemon =>{
      createDiv(pokemon);
      selection.appendChild(createDiv(pokemon));
    });
  } catch(error){
    console.error(`Erro ao buscar informações sobre o Pokémon: ${error}`);
  }
}
function createDiv(pokemon){
  principalDiv = document.createElement("div");
  principalDiv.setAttribute("class", "info-pokemon text-center col-3")
  infoDiv = document.createElement("div");
  infoDiv.setAttribute("class", "name-of-pokemon");
  var pokemonName= pokemon.name.toLowerCase().split(" ").map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(" ");
  infoDiv.textContent=pokemonName;
  principalDiv.appendChild(infoDiv);
  principalDiv.appendChild(createImg(pokemon));

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
  img.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemonId}.png`; 
  //img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`;
  img.setAttribute("class", "pokeImg");
  } catch(error){
    console.error(`Erro ao buscar imagens do Pokémon: ${error}`);
  }
  return img;
}
function createType(pokemon){
  var types = document.createElement("div");
  var id = pokemon.url.split("/")[6];
  try{
  axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(function(pokeType){
      var pokemonTypes = pokeType.data.types;
      var typesArray = [];
      pokemonTypes.forEach( pokemonTypes =>{
        typesArray.push(pokemonTypes.type.name)
      })
      types.textContent = typesArray.join(", ");
      resolve(types);
    });
  }catch(error){
    console.log(`Erro ao adicionar os tipos dos pokemons: ${error}`)
  }
}
getPokemonInfo();