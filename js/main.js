async function getPokemonInfo(){
  try{
    var selection = document.getElementById("pokedex");
    var pokeinfo = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1008&offset=0");
    var pokemon  = pokeinfo.data.results;
    pokemon.forEach(pokemon =>{
      createDiv(pokemon);
      console.log(pokemon);
      selection.appendChild(createDiv(pokemon))
    });
  } catch(error){
    console.error(`Erro ao buscar informações sobre o Pokémon: ${error}`);
  }
}
function createDiv(pokemon){
  div = document.createElement("div");
  div.setAttribute("class", "info-pokemon text-center col-3")
  p = document.createElement("p");
  p.setAttribute("class", "name-of-pokemon");
  var pokemonName= pokemon.name.toLowerCase().split(" ").map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(" ");
  p.textContent=pokemonName;
  div.appendChild(p);
  div.appendChild(createImg(pokemon));

  return div;
}
function createImg(pokemon){
  var img = document.createElement("img");
  var pokemonId = pokemon.url.split("/")[6];
  if (pokemonId.length === 1) {
    pokemonId = "00" + pokemonId;
  }
  else if (pokemonId.length === 2){
    pokemonId = "0" + pokemonId;
  }
  img.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemonId}.png`;
  // img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`;
  img.setAttribute("class", "pokeImg");
  return img;
}

getPokemonInfo();