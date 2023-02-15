var pagination = 0;

document.getElementById("nextBtn").addEventListener("click", function(){
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
  principalDiv.setAttribute("class", "info-pokemon text-center col-3")
  principalDiv.addEventListener("click", function(){
    openModal(pokemon);
  });

  var infoDiv = document.createElement("div");
  infoDiv.setAttribute("class", "name-of-pokemon");

  var pokemonName= pokemon.name.split(" ").map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(" ");
  infoDiv.textContent=pokemonName;
  createType(pokemon).then(types=> {
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
        pokemonTypes.forEach( pokemonTypes =>{
            var pType = document.createElement("p");
            pType.textContent = pokemonTypes.type.name.split(" ").map(name => name[0].toUpperCase() + name.slice(1)).join(" ");
            pType.classList.add(`type-${pokemonTypes.type.name}`);
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

function createModall(pokemon){
  var modalId = `modal-${pokemon.name}`;
  var modal = document.createElement("div");
  modal.setAttribute("class", "modal fade");
  modal.setAttribute("id", modalId);
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", "${modalId}-label");
  modal.setAttribute("aria-hidden", "true");

  var dialog = document.createElement("div");
  dialog.setAttribute("class", "modal-dialog modal-lg modal-dialog-centered");

  var content = document.createElement("div");
  content.setAttribute("class", "modal-content");

  var body = document.createElement("div");
  body.setAttribute("class", "modal-body");

  var title = document.createElement("h4");
  title.setAttribute("class", "title-modal title-modal-adjust")
  title.setAttribute("id", `${modalId}-label`)
  title.textContent = pokemon.name.split(" ").map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(" ");

  var showId= createId(pokemon);
  showId.classList.add("id-modal");
  showId.classList.remove("pokemon-id")

  var textContainer= document.createElement("div");
  textContainer.setAttribute("class", "text-container")
  textContainer.appendChild(title);
  textContainer.appendChild(showId);
  body.appendChild(textContainer)

  var closeBtn = document.createElement("button");
  closeBtn.setAttribute("type", "button");
  closeBtn.setAttribute("class", "btn-close my-close-btn");
  closeBtn.setAttribute("data-bs-dismiss", "modal");
  closeBtn.setAttribute("aria-label", "Close");

  var imgContainer = document.createElement("div");
  imgContainer.setAttribute("class", "img-container");

  var pokemonImg = createImg(pokemon);
  imgContainer.appendChild(pokemonImg);
  pokemonImg.classList.add("modal-img")
  pokemonImg.classList.remove("pokeImg")
  
  var typeList = document.createElement("div");
  typeList.classList.add("type-list")

  createType(pokemon).then(types =>{
    typeBg = types[0].textContent;
    imgContainer.classList.add(`type-${typeBg}-bg`)
    types.forEach(typeDiv=>{
      typeList.appendChild(typeDiv);
      body.appendChild(typeList);
      body.appendChild(imgContainer);
      typeDiv.classList.add("types-of-pokemon-modal")
    });
  });

  
  body.appendChild(closeBtn);
  content.appendChild(body);
  content.appendChild(body);
  dialog.appendChild(content);
  modal.appendChild(dialog);

  return modal;
}

function openModal(pokemon){
  var modalId = `modal-${pokemon.name}`;
  var selection = document.getElementById("pokedex");
  var modal = createModall(pokemon);
  selection.appendChild(modal);
  var modalElement = new bootstrap.Modal(document.getElementById(modalId));
  modalElement.show();
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

async function searchPokemon(){
  var inputValue = inputPokemon.value;
  if (inputValue.length === 0) {
    limit = 12;
  } else {
    limit = 1008;
  }
  await getAllPokemon(limit);
  var pokeFilter = allPokemon.filter(pokemon =>{
    return pokemon.name.toLowerCase().includes(inputValue.toLowerCase());
  })
  var selection = document.getElementById("pokedex");
  selection.innerHTML = "";
  pokeFilter.forEach(async pokemon=>{
    selection.appendChild(await createDiv(pokemon));
  });
}

getAllPokemon(limit);
getPokemonInfo();