import * as funciones from './funciones.js';
// import './libro.js';
import Carrito from './carrito.js';
// import Libro from './libro.js';
import Libro from './libro.js';
// const {Libro} = require('./libro.js');

var libros = [];
var carrito;
var contenedorLibros;
var divCarrito;
var palabraBusqueda;
var formBarraBusqueda;
var svgObject;
var idCategoriaActual = "";
var divMensajesEsquina;
var descargando = false;
window.addEventListener("load",init);

function init(){
  initButtonScrollTop();
  initCargarLibrosScrollBottom();
  contenedorLibros = document.getElementById("contenedor-libros");
  divCarrito = $("#carrito");
  divMensajesEsquina = $("#mensajesAJAXEsquina");

  //NO FUNCIONA el enlace al index
  svgObject = document.getElementById("svg-object");
  svgObject.addEventListener("click", function(){location.href = "./index.html"}, false);

  //RELLENO LA PÁGINA INDEX POR DEFECTO, ES DECIR, LOS LIBROS QUE SON LOS MÁS VISTOS DE TODAS LAS CATEGORIAS
  librosDefaultIndex();
  function librosDefaultIndex(){
    limpiarContenedorLibros();
    let parametros1 = {
      // "results_range":divLibros.children.length + "," + nLibros.value,
      "results_range": "0,10",
      "criteria":"most_viewed"
    }
    // contenedorLibros.parentNode.insertBefore($('<h1>Best-seller</h1>')[0], contenedorLibros.parentNode.firstChild);
    $(document.body).find(".cabecera-contenedor-libros").html('Best-seller');
    obtenerLibros(parametros1);
  }

  //RELLENAR LAS CATEGORIAS
  rellenarCategorias();
  function rellenarCategorias(){
    let parametros2 = {
      "get_categories": "all"
    }
    APIOpenLibra(parametros2).then(function(categorias){
      let listaCategorias = document.createElement("ul");
      for(let categoria of categorias){
        let estructuraCategoria = $(`
          <li id="categoria-${categoria.category_id}"><a href="#">${categoria.name}</a></li>
        `)[0];
        let parametros5 = {
          "category_id": categoria.category_id
        }
        estructuraCategoria.addEventListener('click', function(){
          limpiarContenedorLibros();
          idCategoriaActual = categoria.category_id;
          $(document.body).find(".cabecera-contenedor-libros").html('Categoria: ' + categoria.name);
          obtenerLibros(parametros5);
        })
        listaCategorias.appendChild(estructuraCategoria);
      }
      document.getElementsByClassName("main-aside")[0].appendChild(listaCategorias);
  
      divMensajesEsquina.fadeOut("slow");
      // $("#mensajesAJAXEsquina").fadeOut("slow", function() { $(this).remove(); });
    }).catch(e => console.log(e));
  }

  palabraBusqueda = document.getElementById("palabra-busqueda");
  palabraBusqueda.addEventListener('input', function(){
    //'Reinicio' el contenido de los libros de index.html en el caso de que la barra de búsqueda esté vacía, ya sea por haber borrado todo o haber seleccionado la x
    if(this.value == ""){
      librosDefaultIndex();
    }
  })
  formBarraBusqueda = document.getElementById("form-barra-busqueda");
  formBarraBusqueda.addEventListener("submit", function(e){
    let parametros3 = {
      "book_title": palabraBusqueda.value
    }
    limpiarContenedorLibros();
    $(document.body).find(".cabecera-contenedor-libros").html('Resultados de la búsqueda: ' + palabraBusqueda.value);
    obtenerLibros(parametros3);
    e.preventDefault();
    e.stopPropagation();
  });

  carrito = localStorage.getItem("carrito") ? Carrito.copiarCarritoJSON(JSON.parse(localStorage.getItem("carrito"))) : new Carrito([]);
  carrito.actualizarPantallaCarrito();

  window.addEventListener('unload', function(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
  });

  // $("#btn-cerrar-carrito").click(function(){
  //   divCarrito.fadeOut("slow");
  // });
  $("#btn-vaciar-carrito").click(function(){
    carrito.vaciarCarrito();
  });
  $(".icono-carrito").mouseenter(function(e){
    // console.log(1);
    divCarrito.fadeIn("slow");
  });
  divCarrito.mouseleave(function(){
    // console.log(2);
    divCarrito.fadeOut("slow");
  });
  divCarrito.mouseenter(function(){
    // console.log(3);
    $(this).stop(true, true).fadeIn("slow");
  });
}

function initButtonScrollTop(){
  var limiteBtScrollTop = 150;
  $(document).ready(function () {
    $("#bt-scroll-top").click(function(){ scrollTo(0,0) });
    $(window).on("scroll", function myFunction() {
      if (document.body.scrollTop > limiteBtScrollTop || document.documentElement.scrollTop > limiteBtScrollTop) {
        $("#bt-scroll-top").fadeIn("slow");
      } else {
        $("#bt-scroll-top").fadeOut();
      }
    });
  });
}

function initCargarLibrosScrollBottom(){
  $(window).scroll(function() {
    let pxAntesDelFinal = 500;
    let nNuevosLibros = 20;
      if($(window).scrollTop() + $(window).height() > $(document).height() - pxAntesDelFinal) {
        if(!descargando){
          let parametros4;
          if(idCategoriaActual == ""){
            parametros4 = {
              "results_range": libros.length + "," + nNuevosLibros,
              "criteria":"most_viewed"
            }
          }else{
            parametros4 = {
              "results_range": libros.length + "," + nNuevosLibros,
              "category_id": idCategoriaActual
            }
            console.log(parametros4);
          }
          obtenerLibros(parametros4); 
        }
    }
  });
}

function obtenerLibros(parametros){
  APIOpenLibra(parametros).then(function(librosOpenLibra){
    let nuevosLibrosURL = [];
    for(let libroOpenLibra of librosOpenLibra){
      let newLibro = Libro.crearLibroOpenLibra(libroOpenLibra);
      nuevosLibrosURL.push(Libro.copiarLibro(newLibro));
      libros.push(newLibro);
    }
    for(let libro of nuevosLibrosURL){
      let estructuraLibroIndex = $(`
        <div class="libroIndex" id="${libro.idOpenLibra}">
          <div class="contenedor-portada-libro">
            <a href="./ficha-libro.html"><img src="${libro.urlThumbnail}" alt="Portada de libro" title="${libro.titulo}" id="idOpenLibra-${libro.idOpenLibra}" class="portada-libro"></a>
          </div>
          <div class="fichaLibro">
            <ul>
              <li><b>Título: </b><a href="./ficha-libro.html" class="titulo">${libro.titulo}</a></li>
              <li><b>Autor: </b>${libro.autor}</li>
              <li class="precio"><b>Precio: </b>${libro.precio}</li>
            </ul>
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
          </div>
        </div>
      `)[0];

      estructuraLibroIndex.querySelector("img").loading = "lazy";
      //Guardo el libro que se mostrará en la página ficha-libro.html
      estructuraLibroIndex.querySelector("img").addEventListener('click', function(){
        localStorage.setItem("libro-fichaLibro.html", JSON.stringify(libro));
      });
      // figura.append(img, tituloFigura);
      initBotonAnadirCarrito(estructuraLibroIndex);
      contenedorLibros.appendChild(estructuraLibroIndex);
    }
    divMensajesEsquina.delay(1000).fadeOut("slow");
    descargando = false;

    // $("#mensajesAJAXEsquina").delay(1000).fadeOut("slow", function() { $(this).remove(); });
    // document.removeChild(document.getElementById("mensajesAJAXEsquina"));
    // $("#mensajesAJAXEsquina").remove();
  }).catch(e => console.log(e));
}
   
function buscarLibro(idOpenLibra){
  return libros.find(libro => libro.idOpenLibra == idOpenLibra);
}

function initBotonAnadirCarrito(estructuraLibroIndex){
  $(estructuraLibroIndex).find(".btAnadirCarrito").click(function(){
    let libroEncontrado = Libro.copiarLibro(buscarLibro(estructuraLibroIndex.id));
    libroEncontrado.cantidad = parseInt(estructuraLibroIndex.querySelector(".cantidad-anadir").value);
    carrito.actualizarCantidadLibros(libroEncontrado);

    let mensaje = `"${libroEncontrado.titulo}" añadido al carrito`;
    funciones.mostrarMensajeEsquina2(mensaje, true);
    carrito.actualizarPantallaCarrito();
    //En el caso de que se pulsen varias veces seguidas el boton 'añadir el carrito', se eliminan la cola de animaciones para mostrar momentaneamente el carrito, quedando solo la última. De esta forma no aparece o desaparece varias veces, tantas como se haya pulsado el botón 'anadir al carrito'.
    // Sintaxis -> .stop( [clearQueue ] [, jumpToEnd ] )
    divCarrito.stop(true, false).fadeIn("slow").delay(1500).fadeOut("slow");
   
    // let imgCopiada = $(this).parent().parent().siblings().eq(0).find("img").clone();
    let imgCopiada = $(estructuraLibroIndex).find("img").clone();
    let [mousePosX, mousePosY] = funciones.getMousePosition();
    // imgCopiada.css({
    //   "z-index": "1000",
    //   "position":"absolute",
    //   // "left": imgCopiada.offsetLeft + 'px',
    //   "right": window.innerWidth-imgCopiada.offsetLeft + 'px',
    //   "top": imgCopiada.offsetTop + 'px'
    // });
    imgCopiada.css({
      "z-index": "1000",
      "position":"fixed",
      "right": window.innerWidth-mousePosX + 'px',
      "top": mousePosY - $(window).scrollTop() + 'px'
    });
    imgCopiada.addClass("producto-al-carrito");
    contenedorLibros.append(imgCopiada[0]);
    setTimeout(function() { imgCopiada.remove();}, 1900);
  });
}

async function APIOpenLibra(parametros){
  let urlSerializada = decodeURIComponent('https://www.etnassoft.com/api/v1/get/?' + $.param(parametros));
  // let mensaje = `
  // <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
  //   <span class="sr-only">Loading...</span>
  // </div>`;
  let mensaje = `
    <i class="fas fa-spinner spinner"></i>
  `;
  funciones.mostrarMensajeEsquina2(mensaje, false);
  descargando = true;
  let respuesta = await fetch(urlSerializada);
  if (!respuesta.ok) {
    throw new Error(`HTTP error! status: ${respuesta.status}`);
  } else {
    respuesta = await respuesta.json();
    return respuesta; 
  }
}

function copiarObjeto(objetoACopiar){
  return JSON.parse(JSON.stringify(objetoACopiar));
}

function limpiarContenedorLibros(){
  idCategoriaActual = "";
  contenedorLibros.innerHTML = "";
  libros = [];
}