const pokemonSeleccion = document.querySelector('.pokemon__seleccion');
const pokemonGrid = document.querySelector('.pokemon__grid');
const pokemonMuestras = document.querySelector('.pokemon__muestras');



const mensajeAdvertencia = document.body.children[2];
console.log(mensajeAdvertencia);

const divWarning = document.createElement('div');
divWarning.classList.add('error__contenedor');

const warningError = document.createElement('p');
warningError.classList.add('error__warning');
warningError.textContent = "keep in mind not all pokemon will appear here";

divWarning.appendChild(warningError);

pokemonGrid.appendChild(divWarning);


let contenedorPokemon =[];

if(pokemonSeleccion){
    pokemonSeleccion.addEventListener('change',consultarPokemon);

    document.addEventListener('DOMContentLoaded',()=>{
        consultarRegion();
    })
}


function consultarRegion(){
    const url =`https://pokeapi.co/api/v2/region`;

    fetch(url)
        .then(solicitud => solicitud.json())
        .then(resultado => mostrarRegion(resultado.results));
}

function mostrarRegion(region){
    const regionesFiltradas = region.filter(regiones => regiones.name !== 'hisui');

    regionesFiltradas.forEach((regiones,numRegion) =>{
        let {name} = regiones;
        const nombreRegion = document.createElement('option');
        nombreRegion.value = numRegion + 1;
        nombreRegion.textContent = name;

        if(nombreRegion.value === "hisui"){
            nombreRegion.value = null;
        }

        pokemonSeleccion.appendChild(nombreRegion);

    })
}



function consultarPokemon(e){

    const region = e.target.value;

    const url = `https://pokeapi.co/api/v2/generation/${region}/`;

    fetch(url)
        .then(solicitud => solicitud.json())
        .then(respuesta => {
            if(!respuesta.pokemon_species || respuesta.pokemon_species.lenght === 0 ){
                throw new Error(`la region ${region} no tiene datos de pokemon`);
            }
            if(respuesta.pokemon_species.lenght === 0){
                pokemonGrid.innerHTML ='`<p>No hay información disponible para esta región.</p>`;'
            }
            else{
                mostrarPokemon(respuesta.pokemon_species)
            }
        })
        .catch((error)=>{
            console.error(`Error al obtener los Pokémon de la región ${region}:`, error);
            // pokemonGrid.innerHTML = `<p class="error">No se pudo cargar la información de la región seleccionada. Intenta nuevamente.</p>`;
        });
}



function mostrarPokemon(pokemon){

    pokemon.forEach(pokemones =>{
        limpiarHTML();

        // console.log(pokemones.name);
        let {name: pokemonName} = pokemones;

        const urlSprite = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    
        fetch(urlSprite)
            .then(solicitud => solicitud.json())
            .then(respuesta =>{

                const spriteURL = respuesta.sprites.front_default;
                if(spriteURL){

                    const card = document.createElement('div');
                    card.classList.add('pokemon-card');

                    const mostrarPokemon = document.createElement('p');
                    mostrarPokemon.textContent = pokemonName; 
                    mostrarPokemon.classList.add('pokemon-name');

                    const contenedorSprite = document.createElement('div');
                    contenedorSprite.classList.add('pokemon__contenedor-sprite');

                    const sprite = document.createElement('img');
                    sprite.src = spriteURL;
                    sprite.alt = pokemonName;
                    sprite.classList.add('pokemon-sprite');

                    const contenedorTipos = document.createElement('div');
                    contenedorTipos.classList.add('contenedor__tipos');



                    contenedorSprite.appendChild(sprite);
                    card.appendChild(contenedorSprite);
                    card.appendChild(mostrarPokemon);

                    //mostrar los tipos de los pokes
                    respuesta.types.forEach(tipoInfo => {
                        const tiposPokedex = document.createElement('p');
                        tiposPokedex.classList.add('tipos__pokedex');
                        tiposPokedex.textContent = tipoInfo.type.name;
                        contenedorTipos.appendChild(tiposPokedex);
                        card.appendChild(contenedorTipos);
                    });

                    const urlPokedex = `https://pokeapi.co/api/v2/pokemon-species/${respuesta.name}/`;
                    fetch(urlPokedex)
                        .then(peticion => peticion.json())
                        .then(respuesta => {

                            for(let i=0; i<1; i++){
                                const pokedexPokemon = document.createElement('p');
                                pokedexPokemon.classList.add('tipos__pokemon');
                                pokedexPokemon.textContent =respuesta.pokedex_numbers[0].entry_number ;
                                card.appendChild(pokedexPokemon);

                                const buttonPokemon = document.createElement('button');
                                buttonPokemon.classList.add('button__pokemon');
                                buttonPokemon.textContent = "add this pokemon to your team";
                                buttonPokemon.setAttribute('data-id',pokedexPokemon.textContent);
                            
                                buttonPokemon.onclick = function(e){
                                    guardarInfoPokemon(e);
                                }
            
                                card.appendChild(buttonPokemon);   
                                return;
                            }
                            // console.log(respuesta.pokedex_numbers[0].entry_number);
                        })

                        pokemonGrid.appendChild(card);       

                }
            })
            .catch((error)=>{
                mostrarError( `Error al obtener la imagen del Pokémon ${pokemonName}:`,error)
            })
    })
}


function limpiarHTML(){
    while(pokemonGrid.firstChild){
        pokemonGrid.removeChild(pokemonGrid.firstChild);
    }
}

function guardarInfoPokemon(e) {
// Obtener el array actual de localStorage (si existe)
let contenedorPokemon = JSON.parse(localStorage.getItem('pokemonSeleccionado')) || [];

// Obtener datos del Pokémon seleccionado
const cardPokemon = e.target.parentNode;
const imagenPokemon = cardPokemon.querySelector('.pokemon__contenedor-sprite img').src;
const nombrePokemon = cardPokemon.querySelector('.pokemon-name').textContent;
const tiposPokemon = cardPokemon.querySelector('.contenedor__tipos').textContent;
console.log(tiposPokemon);
const pokedexPokemon = cardPokemon.querySelector('.tipos__pokemon').textContent;
const botonPokemon = cardPokemon.querySelector('.button__pokemon').value;

const tiposElementos = cardPokemon.querySelectorAll('.contenedor__tipos p');
const tiposElemental = [...tiposElementos].map(tipo => tipo.textContent); // Obtener un array con los tipos
console.log(tiposElemental);
let tipo1 = tiposElemental[0];
let tipo2 = tiposElemental[1] ? tiposElemental[1] : null;
console.log(tipo1);
console.log(tipo2);

const contenedorTipos = cardPokemon.querySelector('.contenedor__tipos');
contenedorTipos.innerHTML = ''; // Limpiar antes de agregar

tiposElemental.forEach(tipo => {
    const tipoElemento = document.createElement('p');
    tipoElemento.textContent = tipo;
    tipoElemento.classList.add('tipos__elemental');
    contenedorTipos.appendChild(tipoElemento); 

    
    console.log(tipoElemento);
});

console.log(tiposElemental);

// Crear un nuevo objeto Pokémon
const nuevoPokemon = { imagenPokemon, nombrePokemon,  tipo1, tipo2, pokedexPokemon };
    console.log(nuevoPokemon);

    // Agregar el nuevo Pokémon al array existente
    contenedorPokemon = [...contenedorPokemon,nuevoPokemon];
    if(contenedorPokemon.length >6){
        alert('no puedes tener mas de 6 pokemon en tu equipo');
        return;
    }
    // Guardar el array actualizado en localStorage
    localStorage.setItem('pokemonSeleccionado', JSON.stringify(contenedorPokemon));

    // Redireccionar a la otra página
    window.location.href = 'pokemon-guardados.html';
}

function mostrarError(texto,err){
    
    const contenedorError = document.createElement('div');
    contenedorError.classList.add('error__contenedor');

    const verError = document.createElement('p');
    verError.classList.add('error__texto');
    verError.textContent = texto;

    const tipoError = document.createElement('p');
    tipoError.classList.add('error__tipo');
    tipoError.textContent = err;

    contenedorError.appendChild(verError);
    contenedorError.appendChild(tipoError);

    // pokemonMuestras.appendChild(warningError);
    pokemonGrid.appendChild(contenedorError)

    console.log(texto,err)
}