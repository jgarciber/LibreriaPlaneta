import Libro from './libro.js';
import * as PRINCIPAL from './principal.js';
import {smoothScrollJS} from './funciones.js';
window.addEventListener("load",init);
var libroFichaCompleta;
var contenedorFichaLibroCompleto;
var contenedorSinopsis;
var contenedorLibrosRelacionados;

var libros = PRINCIPAL.libros;
var carrito = PRINCIPAL.carrito;
var contenedorLibros = PRINCIPAL.contenedorLibros;
var divCarrito = PRINCIPAL.divCarrito;
var palabraBusqueda = PRINCIPAL.palabraBusqueda;
var formBarraBusqueda = PRINCIPAL.formBarraBusqueda;
var svgObject = PRINCIPAL.svgObject;
var idCategoriaActual = PRINCIPAL.idCategoriaActual;
var divMensajesEsquina = PRINCIPAL.divMensajesEsquina;
var descargando = PRINCIPAL.descargando;

function init(){
  libros = PRINCIPAL.libros;
  carrito = PRINCIPAL.carrito;
  contenedorLibros = PRINCIPAL.contenedorLibros;
  divCarrito = PRINCIPAL.divCarrito;
  palabraBusqueda = PRINCIPAL.palabraBusqueda;
  formBarraBusqueda = PRINCIPAL.formBarraBusqueda;
  svgObject = PRINCIPAL.svgObject;
  idCategoriaActual = PRINCIPAL.idCategoriaActual;
  divMensajesEsquina = PRINCIPAL.divMensajesEsquina;
  descargando = PRINCIPAL.descargando;

  libroFichaCompleta = localStorage.getItem("libro-fichaLibro.html") ? Libro.copiarLibroJSON(JSON.parse(localStorage.getItem("libro-fichaLibro.html"))) : "";
  libros.push(Libro.copiarLibro(libroFichaCompleta));

  contenedorFichaLibroCompleto = document.getElementById("contenedor-ficha-libro-completa");
  contenedorSinopsis = document.getElementById("contenedor-sinopsis");
  contenedorLibrosRelacionados = document.getElementById("contenedor-libros-relacionados");

  // let parametros1 = {
  //   "id": libroFichaCompleta.idOpenLibra
  // }
  // console.log(parametros1);
  // PRINCIPAL.obtenerLibros(parametros1).then(function(librosObtenido){
  //   insertarLibroFichaLibro(librosObtenido);
  // });
  insertarLibroFichaLibro(libroFichaCompleta);
  setTimeout(function() { 
    location.href = "#main-section"; 
  }, 500);
  insertarRelacionados(libroFichaCompleta);
}


function insertarLibroFichaLibro(libroObtenido){
  let categoriasLibro = [];
  libroObtenido.categoria.forEach(function(categoria){
    let enlace = $(`<a href="#main-section">${categoria.name}</a>`)[0];
    enlace.addEventListener('click', function(){
      PRINCIPAL.formBarraBusqueda.reset();
      PRINCIPAL.limpiarContenedorLibros();
      PRINCIPAL.initCargarLibrosScrollBottom();
      idCategoriaActual = categoria.category_id;
      $(document.body).find(".cabecera-contenedor-libros").html('Categoria: ' + categoria.name);

      let parametros2 = {
        "category_id": categoria.category_id,
        "num_items" : PRINCIPAL.nNuevosLibrosPaginacion
      }
      PRINCIPAL.obtenerEInsertarLibrosIndex(parametros2, contenedorLibros);
    });

    categoriasLibro.push(enlace);
    //Añado nodos de texto para espaciar las categorias a las que pertenece el libro
    categoriasLibro.push(document.createTextNode(", "));
  });
  //Elimino el último elemento (textNode) del array para evitar que aparece ", " al final de las categoriasLibro.
  categoriasLibro.pop();

  let estructuraFichaLibroCompleta = $(`
  <div class=libroCompleto id="${libroObtenido.idOpenLibra}">
    <a href="${libroObtenido.urlCover}"><img src="${libroObtenido.urlCover}" alt="Portada de libro" title="${libroObtenido.titulo}" class="portada-libro"></a>
    <div class="fichaLibroCompleta">
        <ul>
          <li><b>Título: </b><a href="${libroObtenido.urlCover}">${libroObtenido.titulo}</a></li>
          <li><b>Autor: </b>${libroObtenido.autor}</li>
          <li class="categoriasLibro"><b>Categoría: </b></li>
          <li><b>Editorial: </b>${libroObtenido.editorial}</li>
          <li><b>Páginas: </b>${libroObtenido.paginas}</li>
          <li class="precio"><b>Precio: </b>${libroObtenido.precio}</li>
        </ul>
        <ul>
          <li><b>Idioma: </b>${libroObtenido.idioma}</li>
          <li><b>Traductor: </b>${libroObtenido.traductor}</li>
          <li><b>Año de la edición: </b>${libroObtenido.anoEdicion}</li>
          <li><b>Tipo de encuadernación: </b>${libroObtenido.tipoEncuadernacion}</li>
          <br>
          <span>
          <button class="btAnadirCarrito" title="Añadir al carrito">Añadir al carrito</button>
          <select class="cantidad-anadir">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>10</option>
          </select>
        </span>
        </ul>
    </div>
  </div>
  `)[0];
    // <div class="audio">
    //     <audio controls loop>
    //       <source src="./audio/audio_convertido/Piano Inspier.ogg" type="audio/ogg">
    //       <source src="./audio/audio_original/Piano Inspier.mp3" type="audio/mpeg">
    //       <p>Tu navegador no implementa el elemento audio</p>
    //     </audio>
    //     <ul>
    //       <li>Autor pista: Draganov89 </li>
    //       <li>||</li>
    //       <li>Nombre pista: Piano Inspier</li>
    //     </ul>
    // </div>

  let sinopsis = $(`
  <div class="sinopsis">
  <p></p>
  </div>
  `)[0];
  //Esta opción funciona pero no es del todo válida, aparece el texto correctamente pero las etiquetas se interpretan literalmente, no son nodos, por tanto no se renderiza adecuadamente las listas, enlaces, etc
  // let doc = new DOMParser().parseFromString(p, 'text/html');
  // let nodoContenidoSinopsis = doc.body.firstChild;
  // sinopsis.querySelector("p").append(nodoContenidoSinopsis);

  //---------------------------------
  //Esta opción funciona correctamente, se crean los nodos y se renderiza el contenido de html
  // Tengo que convertir el texto proporcionado por OPENLibra (sinopsis) en html, esto es así ya que viene con caracteres codificados del tipo &lt; &quot; etc. Si se intenta convertir esta cadena codificada mediante el selector de jQuery se producirá un error.
  // Creo un nodo auxiliar textarea para poder utilizar la funcion .html() de jQuery. $().html no es válido, por eso debo utilizar un nodo. Una vez convertido el texto en etiquetas html, obtengo su contenido en una cadena mediante la funcion .text()
  // Inserto la cadena de texto que contiene las etiquetas html en un nodo de tipo párrafo. Esto hay que hacerlo ya que a veces el texto de sinopsis empieza directamente con un nodo de texto (que no es una etiqueta párrafo), y entonces jQuery no será capaz de reconstruir los nodos del DOM correctamente. Si inserto todo dentro de un <p></p> se evita este problema, ya que todo el texto de la sinopsis estará siempre contenido en una etiqueta párrafo.
  // Por último, convierto toda la cadena con etiquestas html (contenida dentro de una etiqueta párrafo) en elementos de DOM gracias a la funcion $() de jQuery. A continuación obtengo todos los nodos resultantes en un array con la función toArray(), y serán todos estos nodos los que inserte finalmente en el contenedor de sinopsis. Esta última operación la realizo pasando a la funcion .append() todos los nodos, para ello desplegando los elementos del array haciendo uso del parámetro ...rest
  let contenidoSinopsis = $('<textarea />').html(libroObtenido.sinopsis).text();
  contenidoSinopsis = '<p>'+contenidoSinopsis+'</p>';
  sinopsis.querySelector("p").append(...$(contenidoSinopsis).toArray());
  // <h2>Sinopsis</h2>
  estructuraFichaLibroCompleta.querySelector(".categoriasLibro").append(...categoriasLibro);
  PRINCIPAL.initBotonAnadirCarrito(estructuraFichaLibroCompleta);
  contenedorFichaLibroCompleto.appendChild(estructuraFichaLibroCompleta);
  contenedorSinopsis.append(sinopsis);
  // PRINCIPAL.divMensajesEsquina.delay(1000).fadeOut("slow");
}

function insertarRelacionados(libroARelacionar){
  let parametros4 = {
    // "results_range": libros.length + "," + nNuevosLibros,
    "category_id": libroARelacionar.categoria[0].category_id
  }
  PRINCIPAL.obtenerEInsertarLibrosIndex(parametros4, contenedorLibrosRelacionados);
}