async function getPokemonInfo(){
  try{
    var pokeinfo = await axios.get("https://pokeapi.co/api/v2/pokemon");
    var pokemon  = pokeinfo.data;
    console.log(pokemon.results);
  } catch(error){
    console.error(`Erro ao buscar informações sobre o Pokémon: ${error}`);
  }
}
getPokemonInfo();