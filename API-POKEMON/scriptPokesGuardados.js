function obtenerPokemon() {
    const pokemonInfo = JSON.parse(localStorage.getItem('pokemonSeleccionado')) || [];
    console.log(pokemonInfo);

    // Verificar si hay Pokémon guardados
    if (pokemonInfo.length === 0) {
        console.error("No hay Pokémon guardados.");
        return;
    }

    // Seleccionar el contenedor donde se mostrarán los Pokémon
    const contenedor = document.querySelector('.pokemon-lista');
    if(contenedor){
            // Limpiar el contenedor antes de agregar nuevos elementos
    contenedor.innerHTML += '';

    // Recorrer el array y mostrar cada Pokémon
    pokemonInfo.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('pokemon-card');

        const imagen = document.createElement('img');
        imagen.src = pokemon.imagenPokemon;
        imagen.alt = pokemon.nombrePokemon;
        imagen.classList.add('pokemon-sprite');

        const nombre = document.createElement('p');
        nombre.textContent = pokemon.nombrePokemon;
        nombre.classList.add('pokemon-name');

        const contenedorTipos = document.createElement('div');
        contenedorTipos.classList.add('contenedor__tipos');

        const tipo1 = document.createElement('p');
        tipo1.textContent = pokemon.tipo1;
        tipo1.classList.add('contenedor__tipo1');

        const tipo2 = document.createElement('p');
        tipo2.textContent = pokemon.tipo2;
        tipo2.classList.add('contenedor__tipo2');

        const pokedex = document.createElement('p');
        pokedex.textContent = pokemon.pokedexPokemon;
        pokedex.classList.add('tipos__pokemon');

        const buttonPokemon = document.createElement('button');
        buttonPokemon.classList.add('button__pokemon');
        buttonPokemon.textContent = "drop this pokemon";
        buttonPokemon.setAttribute('data-id',pokedex.textContent)

        buttonPokemon.onclick = function (e) {
            e.preventDefault();
            console.log('Desde el botón eliminar');

        
            // Obtener el ID del Pokémon desde el botón
            const idPokemon = e.target.getAttribute('data-id');
            // console.log('ID del Pokémon a eliminar:', idPokemon);

        
            // Obtener la lista actualizada desde localStorage
            let pokemonGuardados = JSON.parse(localStorage.getItem('pokemonSeleccionado')) || [];
            console.log('Pokémon en localStorage antes de eliminar:', pokemonGuardados);
            
                    // Filtrar la lista eliminando el Pokémon seleccionado
            const nuevosPokes = pokemonGuardados.filter(pokemones => {
                // console.log(`Comparando ${pokemones.pokedexPokemon} con ${idPokemon}`);
                return pokemones.pokedexPokemon !== idPokemon; 
            });

            console.log('Pokémon actualizados:', nuevosPokes);
        
            // Guardar la nueva lista en LocalStorage
            localStorage.setItem('pokemonSeleccionado', JSON.stringify(nuevosPokes));
            console.log('LocalStorage actualizado:', JSON.parse(localStorage.getItem('pokemonSeleccionado')));
        
            // Eliminar la tarjeta visualmente
            e.target.parentNode.remove();
            
        };
        
        

        // Agregar los elementos al card
        contenedorTipos.appendChild(tipo1);
        contenedorTipos.appendChild(tipo2);
        card.appendChild(imagen);
        card.appendChild(nombre);
        card.appendChild(contenedorTipos);
        card.appendChild(pokedex);
        card.appendChild(buttonPokemon);

        // Agregar la card al contenedor
        contenedor.appendChild(card);
    });
    }
}

// Ejecutar la función cuando cargue la página
document.addEventListener('DOMContentLoaded', obtenerPokemon);
