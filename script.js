'use strict';

// Hacemos la petición a la API

fetch('https://rickandmortyapi.com/api/character/') // realizamos la solicitud a la API para obtener los personajes
  .then(response => response.json()) // convertimos la respuesta a un objeto
  .then(data => console.log(data))  // mostramos los datos en la consola (data es el objeto conertido)
  .catch(error => console.error(error.message)) // capturamos y mostramos cualquier error que ocurra
  .finally(() => console.log('Fetch completado.')); // siempre se ejecuta al final


// Función para obtener personajes con un nombre específico

const getCharacters = async (nombreBuscado) => { //creamos una función asíncrona para esperar datos

    try {

      const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${nombreBuscado}`); 
      // petición a la API. // añadimos a la URL el parámetro name con ?name= para filtrar los resultados + {nombreBuscado} con lo que se escriba en el buscador

      if(!response.ok) throw new Error ('Error al obtener los personajes'); // si la respuesta no es exitosa, lanzamos error

      const data = await response.json(); // convertimos la respuesta a objeto, para esto también hay que esperar así que escribimos await

      const resultadosDiv = document.getElementById('resultados'); // obtenemos el contenedor donde mostraremos los resultados
      resultadosDiv.innerHTML = ''; // limpiamos el contenido anterior del contenedor

      if (data.results && data.results.length > 0) { // results pertenece a una clave del objeto JSON de todos los personajes (inspeccionar JSON)
        mostrarResultados(data.results); // llamamos a la función para mostrar los resultados si hay personajes
      } 

    } catch (error) {
        console.log(error.message); // mostramos el mensaje de error si ocurre algún problema

    } finally {
      console.log('Fetch completado'); // este bloque se ejecuta siempre
    }

}


// Función para mostrar los resultados en la página

function mostrarResultados(personajes) { // ahora mismo personajes = data.results

  const resultadosDiv = document.getElementById('resultados'); 
  // contenedor de resultados donde se mostrarán todos los personajes
  resultadosDiv.innerHTML = '';
  // aquí borramos todo el contenido en búsquedas anteriores para que no se mezclen los resultados antiguos con los nuevos

  personajes.forEach(personaje => { // recorremos cada personaje
    
    const divPersonaje = document.createElement('div'); // creamos un div para cada personaje
    divPersonaje.classList.add('personaje'); // añadimos una clase al div

    // añadimos el contenido para cada personaje
    divPersonaje.innerHTML = ` 
    <img src="${personaje.image}" "alt=${personaje.name}" width="100" />
    <h3>${personaje.name}</h3>
    <p><strong>Especie:</strong> ${personaje.species}</p>
    <p class="estado"><strong>Estado:</strong> ${personaje.status}</p>
    `;

    const estado = divPersonaje.querySelector('.estado'); // clase creada previamente

    if (estado.textContent.toLowerCase().includes('dead')) {  // devuelve "estado: dead"
      estado.classList.add('muerto'); // Añadimos la clase 'muerto' si el estado contiene 'dead'
    }

    resultadosDiv.appendChild(divPersonaje); // esto coloca visualmente el nuevo elemento (divPersonaje) dentro del contenedor en la página.
  });

}

// Sugerencias en input

const buscador = document.getElementById('buscador');
const sugerencias = document.getElementById('sugerencias');


// Evento para capturar lo que se escribe en tiempo real
// Aquí decimos que cuando alguien escriba algo dentro del input quiero que ejecutes esta función

buscador.addEventListener('input', async (e) => { 
// input, como evento, detecta cada letra que el usuario escribe o borra
  const query = e.target.value.trim(); // captura lo que el usuario escribe

  if (!query) { 
    sugerencias.innerHTML = ''; // si no hay texto limpiamos las sugerencias
    return; // no sigue ejecutando nada más si no hay texto
  }

  try {
    // llamamos a la API para buscar personajes cuyo nombre coincida con query
    const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${query}`); 
    if (!response.ok) throw new Error('Error al obtener las sugerencias');

    const data = await response.json(); // convertimos la respuesta en datos utilizables (objeto)

    if (data.results && data.results.length > 0) {
      mostrarSugerencias(data.results); // si hay resultados, mostramos las sugerencias
    } 

  } catch (error) {
    console.log(error.message);
  }

});

// función para mostrar las sugerencias

function mostrarSugerencias(personajes) { // personajes = data.results

  sugerencias.innerHTML = ''; // limpiamos las sugerencias anteriores

  personajes.forEach(personaje => {

    const li = document.createElement('li');

    li.textContent = personaje.name; // a este li se le asigna como texto el nombre del personaje

    li.addEventListener('click', () => {
      buscador.value = personaje.name; 
      // cuando alguien hace clic en la sugerencia, el input se rellena con el nombre del personaje
      sugerencias.innerHTML = ''; 
      // cuando alguien hace clic en la sugerencua, limpiamos el contenedor de sugerencias (ya no son necesarias porque el usuario ha seleccionado una)
      getCharacters(personaje.name); // llamamos a getCharacters() para mostrar los detalles del personaje
    })

    sugerencias.appendChild(li); // añadimos cada sugerencia a la lista visible en la página

  });
}

// Evento que detecta cuando el usuario escribe
buscador.addEventListener('input', (e) => {
  if (e.target.value.trim() !== '') {
      sugerencias.style.display = 'block'; // Muestra el contenedor
  } else {
      sugerencias.style.display = 'none'; // Oculta si está vacío
  }
});


// Ocultar sugerencias si el usuario hace clic fuera

document.addEventListener('click', (e) => {
  if (!e.target.closest('#sugerencias') && e.target !== buscador) {
      sugerencias.style.display = 'none'; // Ocultar el contenedor
  }
});
// closest() es un método que busca el elemento más cercano que cumpla con un selector (por ejemplo, .contenedor1).


// Ocultar sugerencias si el usuario hace clic en Enter

buscador.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { // Si la tecla presionada es Enter
    sugerencias.style.display = 'none'; // Ocultamos el contenedor de sugerencias
  }
});


// Manejar la interacción con el botón de búsqueda

const button = document.getElementById('boton');

button.addEventListener('click', (e) => { // indicamos al usuario que cuando se haga click en el botón, se ejecutará la siguiente función

  const nombreBuscado = document.getElementById('buscador').value.trim();
  // value nos da el valor (el texto que se ha escrito el ususario en el campo)
  // trim elimina espacios del texto para que la búsqueda concuerde con los resultados
  
  const errorMensaje = document.getElementById('errorMensaje');

  if (nombreBuscado === '') { // si el campo está vacío...
    errorMensaje.textContent = 'Por favor, ingresa un nombre.' // se muestra este mensaje
    return; // detenemos la ejecución 
  }

  errorMensaje.textContent = ''; // si el usuario ingresa un nombre, limpiamos el mensaje de error
  getCharacters(nombreBuscado); // llamamos a getCharacters con el nombre buscado

});


// Añadir evento keydown para Enter 

document.getElementById('buscador').addEventListener('keydown', (e) => { // el evento ocurre en el input
  if (e.key === 'Enter') { // la tecla presionada es "Enter"

    const nombreBuscado = document.getElementById('buscador').value.trim();
    const errorMensaje = document.getElementById('errorMensaje');
    
    if (nombreBuscado === '') { 
      errorMensaje.textContent = 'Por favor, ingresa un nombre.';
      return;
    }

    errorMensaje.textContent = '';
    getCharacters(nombreBuscado);
  }   

});


// Para borrar el errorMensaje cuando volvemos a escribir en el input

document.getElementById('buscador').addEventListener('input', (e) => {
  
  const nombreBuscado = document.getElementById('buscador').value.trim();
  const errorMensaje = document.getElementById('errorMensaje');

  if (nombreBuscado.length > 0) {
    
    errorMensaje.textContent = '';
  }
  

})


// Botón de inicio para redirigir a la página principal

const inicio = document.getElementById('inicio');

inicio.addEventListener('click', (e) => {

  const resultadosDiv = document.getElementById('resultados');

  resultadosDiv.innerHTML = '';

  window.location.href = 'index.html';
  // Cuando haces window.location.href = 'index.html';, el navegador cambia la URL de la página actual y la reemplaza por 'index.html'. Es como hacer clic en un enlace a esa página. Es decir, redirige al navegador a la página que le digas, en este caso a 'index.html', que sería la página principal de tu sitio web.
});

