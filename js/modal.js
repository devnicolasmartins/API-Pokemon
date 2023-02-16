function createModall(pokemon){
  var modalId = `modal-${pokemon.name}`;
  var modal = document.createElement("div");
  modal.setAttribute("class", "modal fade");
  modal.setAttribute("id", modalId);
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", `${modalId}-label`);
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

  var infoContainer = document.createElement("div");
  infoContainer.setAttribute("class", "info-container");

  var pokemonImg = createImg(pokemon); // função oriunda do arquivo main.js
  infoContainer.appendChild(pokemonImg);
  pokemonImg.classList.add("modal-img")
  pokemonImg.classList.remove("pokeImg")
  
  var typeList = document.createElement("div");
  typeList.classList.add("type-list");

  var charList = document.createElement("div");
  charList.classList.add("char-list");

  var ul = document.createElement("ul");
  ul.classList.add("modal-ul");
  charList.appendChild(ul);

  characteristics(pokemon).then(char=>{
    var weightLi= document.createElement("li");
    weightLi.classList.add("modal-li");

    var spanWeight = document.createElement("span");
    spanWeight.textContent= "Weight";
    weightLi.appendChild(spanWeight);

    var strongWeight= document.createElement("strong")
    strongWeight.textContent= `${char.weight/10}kg`;
    weightLi.appendChild(strongWeight);

    var heightLi= document.createElement("li");
    heightLi.classList.add("modal-li");

    var spanHeight = document.createElement("span");
    spanHeight.textContent= "Height";
    heightLi.appendChild(spanHeight);
    
    var strongHeight= document.createElement("strong")
    strongHeight.textContent= `${char.height/10}m`;
    heightLi.appendChild(strongHeight);

    var abilityLi= document.createElement("li");
    abilityLi.classList.add("modal-li");

    var spanAbilities = document.createElement("span");
    spanAbilities.textContent= "Abilities";
    abilityLi.appendChild(spanAbilities);

    var button = document.createElement("button");
        button.textContent = "Show more...";
        button.setAttribute("type", "button")
        button.setAttribute("class","btn btn-primary dropdown-toggle btn-modal")
        button.setAttribute("data-bs-toggle", "dropdown");
        button.setAttribute("aria-expanded", "false")
    

    
    var buttonUl = document.createElement("ul");
    buttonUl.setAttribute("class","dropdown-menu btn-ul")
    
    var strongLi= document.createElement("strong")

    char.abilities.forEach((abilityList, index) => {
      // Adiciona o primeiro item da lista de habilidades em uma tag strong
      if (index === 0) {
        strongLi.textContent = abilityList.ability.name.split(" ").map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(" ");
        abilityLi.appendChild(strongLi);
      } else {
        // Adiciona os demais itens da lista de habilidades em tags li
        var buttonLi = document.createElement("li");
        buttonLi.setAttribute("class", "dropdown-item btn-li");
        buttonLi.textContent = abilityList.ability.name.split(" ").map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(" ");
        createType(pokemon).then(types => {
          var typeBtnBg = types[0].textContent;
          buttonLi.classList.add(`type-${typeBtnBg.toLowerCase()}`);
          button.classList.add(`type-${typeBtnBg.toLowerCase()}`);
        });
        buttonUl.appendChild(buttonLi);
      }
    });
    abilityLi.appendChild(buttonUl)
    abilityLi.appendChild(button);
    ul.appendChild(weightLi);
    ul.appendChild(heightLi); 
    ul.appendChild(abilityLi); 
  })

  createType(pokemon).then(types =>{ // função oriunda do arquivo main.js
    var typeBg = types[0].textContent;
    infoContainer.classList.add(`type-${typeBg}-bg`)
    types.forEach(typeDiv=>{
      typeList.appendChild(typeDiv);
      body.appendChild(typeList);
      body.appendChild(infoContainer);
      typeDiv.classList.add("types-of-pokemon-modal")
    });
  });

  infoContainer.appendChild(charList);
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

function characteristics(pokemon){
  var id = pokemon.url.split("/")[6];
  return new Promise((resolve, reject) =>{
    try{
      axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(pokeCharacter=>{
          var height= pokeCharacter.data.height;
          var weight= pokeCharacter.data.weight;
          var abilities = pokeCharacter.data.abilities;
          resolve({height, weight, abilities});
        });
    }
    catch(error){
      console.log(`Erro ao adicionar as características dos pokemons: ${error}`)
      reject(error);
    }
  });
}  