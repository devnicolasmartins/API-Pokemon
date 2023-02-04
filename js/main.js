async function getPokemonInfo(){
  try{
    var selection = document.getElementById("pokedex");
    var pokeinfo = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
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

  var img = document.createElement("img");
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split("/")[6]}.png`;
  img.setAttribute("class", "pokeImg");
  div.appendChild(img);

  return div;
}
getPokemonInfo();