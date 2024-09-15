import * as funciones from './funciones.js';
import Carrito from './carrito.js';
import Libro from './libro.js';

export var libros = [];
export var nNuevosLibrosPaginacion = 20;
export var carrito;
export var contenedorLibros;
export var divCarrito;
export var palabraBusqueda;
export var formBarraBusqueda;
export var svgObject;
export var idCategoriaActual = "";
export var idSubcategoriaActual = "";
export var divMensajesEsquina;
export var descargando = false;
export var arrayCategorias = [];
export var arraySubcategorias = [];
export var mapSubcategorias = new Map();
export var contenedorCategorias;

window.addEventListener("load",init);

export function init(){
   initButtonScrollTopBottom();
   // initCargarLibrosScrollBottom();
   contenedorLibros = document.getElementById("contenedor-libros");
   divCarrito = $("#carrito");
   divMensajesEsquina = $("#mensajesAJAXEsquina");

   //Se tienen que incluir eventos onclick a todos los elementos que forman la imangen svg, de lo contrario no se activará el evento al hacer click en ella.
   svgObject = document.getElementById("svg-object").contentDocument;
   $(svgObject).children().on('click touchstart', function(event){
      event.stopPropagation();
      event.preventDefault();
      location.href = "./index.html"})
   ;

   palabraBusqueda = document.getElementById("palabra-busqueda");
   palabraBusqueda.addEventListener('input', function(){
      //'Reinicio' el contenido de los libros de index.html en el caso de que la barra de búsqueda esté vacía, ya sea por haber borrado todo o haber seleccionado la x
      if(this.value == ""){
         librosDefaultIndex();
      }
   });

   formBarraBusqueda = document.getElementById("form-barra-busqueda");
   formBarraBusqueda.addEventListener("submit", function(e){
      let parametros3 = {
         "book_title": palabraBusqueda.value,
         "num_items" : nNuevosLibrosPaginacion
      }
      limpiarContenedorLibros();
      initCargarLibrosScrollBottom();
      $(document.body).find(".cabecera-contenedor-libros").html('Resultados de la búsqueda: ' + palabraBusqueda.value);
      obtenerEInsertarLibrosIndex(parametros3, contenedorLibros);
      e.preventDefault();
      e.stopPropagation();
   });
   
   //RELLENAR LAS CATEGORIAS
   let parametrosTodasCategorias = {
      "get_categories": "all"
   }

   contenedorCategorias = document.getElementsByClassName("main-aside")[0];

   // Para ahorrar consultas de las categorias y las subcategorias cada vez que se recarga la página, guardo todas las categorias y subcategorias en la sesion localStorage. Esto tiene una clara ventaja en cuanto la rendimiento en la carga y se reduce enormemente el número de consultas, además de cargar mucho más rápido la página. Como desventaja, si se añade una nueva categoria o subcategoria esta no sería detectada hasta que se cerrase la sesión, ya que se recuperan los datos antiguos. Una posible solución a dicho problema sería eliminar las categorias y subcategorias de la memorias local cada cierto tiempo (cada 5-10 minutos o algo así), o implementar un método que haga una consulta para comprobar si ha cambiado el número de categorias o subcategorias teniendo como referencia las ya almacenas (si varían su nombre u otra infomación no sería detectada, habría que hacerlo entonces de otra manera). Creo que con el uso de sessionStorage ya nos aseguramos de que cada vez que el usuario cierre la página y vuelva a entrar, se recuperarán los datos actualizados tanto de categorias como de subcategorias.
   if(sessionStorage.getItem("categorias")){
      arrayCategorias = JSON.parse(sessionStorage.getItem("categorias"));
      // insertarCategorias(arrayCategorias, contenedorCategorias);
      if(sessionStorage.getItem("subcategorias")){
         arraySubcategorias = JSON.parse(sessionStorage.getItem("subcategorias"));
         mapSubcategorias = new Map(JSON.parse(sessionStorage.getItem("mapSubcategorias")));
         // insertarSubcategorias(arraySubcategorias.flat(), contenedorCategorias);
      }
      insertarCategoriasConSubcategorias(arrayCategorias, mapSubcategorias, contenedorCategorias);
   }else{
      obtenerCategoriasYSubcategorias(parametrosTodasCategorias);
      let categoriasInsertadas = false;
      let comprobarSiCategoriasYSubcategoriasObtenidas = setInterval(function(){
         if (divMensajesEsquina.is(":hidden")) mostrarSpinnerCarga();
         if(arrayCategorias != "" && !categoriasInsertadas){
            insertarCategorias(arrayCategorias, contenedorCategorias);
            categoriasInsertadas = true;
         } 
         if(arrayCategorias != "" && arraySubcategorias != "" && mapSubcategorias != ""){
            clearInterval(comprobarSiCategoriasYSubcategoriasObtenidas);
            contenedorCategorias.innerHTML = "";
            insertarCategoriasConSubcategorias(arrayCategorias, mapSubcategorias, contenedorCategorias);
            ocultarSpinnerCarga();
         }
      }, 500);
   // obtenerEInsertarCategoriasYSubcategorias(parametrosTodasCategorias);
   }
   
   carrito = localStorage.getItem("carrito") ? Carrito.copiarCarritoJSON(JSON.parse(localStorage.getItem("carrito"))) : new Carrito([]);
   carrito.actualizarPantallaCarrito();

   window.addEventListener('unload', function(){
      localStorage.setItem("carrito", JSON.stringify(carrito));
   });

   //Inicializo el comportamiento de la visibilidad del carrito

   // $("#btn-cerrar-carrito").click(function(){
   //   divCarrito.fadeOut("slow");
   // });
   $("#btn-vaciar-carrito").click(function(){
      carrito.vaciarCarrito();
   });
   $(".icono-carrito").mouseenter(function(e){
      divCarrito.fadeIn("slow");
   });
   divCarrito.mouseleave(function(){
      divCarrito.fadeOut("slow");
   });
   divCarrito.mouseenter(function(){
      $(this).stop(true, true).fadeIn("slow");
   });
}

export function initButtonScrollTopBottom(){
   var margenSuperiorBtScrollTop = 150;
   $(document).ready(function () {
      $("#bt-scroll-top").click(function(){ 
         scrollTo(0,$(document).height()) 
      });
      $(window).on("scroll", function myFunction() {
         if (document.body.scrollTop > margenSuperiorBtScrollTop || document.documentElement.scrollTop > margenSuperiorBtScrollTop) {
            // $("#bt-scroll-top").css("transform", "rotate(0deg)");
            $("#bt-scroll-top").addClass("rotate180");
            // $("#bt-scroll-top").removeClass("fa-rotate-180");
            $("#bt-scroll-top").off('click');
            $("#bt-scroll-top").click(function(){ 
               scrollTo(0,0);
            });
         } else {
            // $("#bt-scroll-top").css("transform", "rotate(180deg)"); 
            $("#bt-scroll-top").removeClass("rotate180");
            // $("#bt-scroll-top").addClass("fa-rotate-180");
            $("#bt-scroll-top").off('click');
            $("#bt-scroll-top").click(function(){ 
               scrollTo(0,$(document).height()) 
            });
         }
      });
   });

   //VERSION ANTIGUA, SOLO SUBE HACIA ARRIBA, NO ROTA, DESAPARECE O APARECE EN FUNCION DE LA POSICIÓN DE LA VENTANA DEL CLIENTE
   // var margenSuperiorBtScrollTop = 150;
   // $(document).ready(function () {
   //    $("#bt-scroll-top").click(function(){ scrollTo(0,0) });
   //    $(window).on("scroll", function myFunction() {
   //       if (document.body.scrollTop > margenSuperiorBtScrollTop || document.documentElement.scrollTop > margenSuperiorBtScrollTop) {
   //       $("#bt-scroll-top").fadeIn("slow");
   //       } else {
   //       $("#bt-scroll-top").fadeOut();
   //       }
   //    });
   // });
}

export function initCargarLibrosScrollBottom(){
   $(window).scroll(function() {
      let pxAntesDelFinal = 500;
         if($(window).scrollTop() + $(window).height() > $(document).height() - pxAntesDelFinal) {
         if(!descargando){
            let parametros4;
            if (idCategoriaActual == "" && idSubcategoriaActual == "" && palabraBusqueda.value == ""){
               parametros4 = {
                  "results_range": libros.length + "," + nNuevosLibrosPaginacion,
                  "criteria":"most_viewed"
               }
            }
            if(idCategoriaActual != ""){
               parametros4 = {
                  "results_range": libros.length + "," + nNuevosLibrosPaginacion,
                  "category_id": idCategoriaActual
               }
            }
            if(idSubcategoriaActual != ""){
               parametros4 = {
                  "results_range": libros.length + "," + nNuevosLibrosPaginacion,
                  "subcategory_id": idSubcategoriaActual
               }
            }
            if(palabraBusqueda.value != ""){
               parametros4 = {
                  "results_range": libros.length + "," + nNuevosLibrosPaginacion,
                  "book_title": palabraBusqueda.value
               }
            }
            console.log(parametros4);
            obtenerEInsertarLibrosIndex(parametros4, contenedorLibros);
         }
      }
   });
}

export function librosDefaultIndex(){
   formBarraBusqueda.reset();
   limpiarContenedorLibros();
   location.href = "#";
   let parametros1 = {
      // "results_range":divLibros.children.length + "," + nLibros.value,
      "results_range": "0," + nNuevosLibrosPaginacion,
      "criteria":"most_viewed"
   }
   // contenedorLibros.parentNode.insertBefore($('<h1>Best-seller</h1>')[0], contenedorLibros.parentNode.firstChild);
   $(document.body).find(".cabecera-contenedor-libros").html('Best-seller');
   obtenerEInsertarLibrosIndex(parametros1, contenedorLibros);
   initCargarLibrosScrollBottom();
   //Es mejor no poner autoscroll en la página de inicio por defecto ya que si se ve en una tablet, directamente va a la seccion de best-seller, y se omite la cebecera de la página con las secciones importantes (logo, cuenta, carrito, etc). Además, si el usuario borra la palabra de búsqueda de la barra de búsqueda, tampoco es agradable que se haga autoscroll hasta el best seller. Si es cierto que se cargarán automaticamente los libros best-seller si la barra de búsqueda está vacía, pero el usuario ya tiene que decidir si verlos, acceder a otro sitio, o introducir una palabra de búsqueda. En definitiva, NO hacer autoscroll en la carga por defecto de la página index, es incómodo y merma la usabilidad.
   // setTimeout(function() { location.href = "#main-section";}, 500);
}

export function obtenerEInsertarCategoriasYSubcategorias(parametrosCategorias, insertar=true){
   mostrarSpinnerCarga();
   APIOpenLibra(parametrosCategorias).then(function(categorias){
      arrayCategorias = categorias;
      if(insertar){
         insertarCategorias(arrayCategorias, contenedorCategorias);
         obtenerEInsertarSubcategoriasDeCategorias(arrayCategorias);
      }else{
         obtenerEInsertarSubcategoriasDeCategorias(arrayCategorias, false);
      }
   }).catch(e => console.log(e)).finally(function(){
      sessionStorage.setItem("categorias", JSON.stringify(arrayCategorias));
      ocultarSpinnerCarga();
   });
}

export function obtenerCategoriasYSubcategorias(parametrosCategorias){
   obtenerEInsertarCategoriasYSubcategorias(parametrosCategorias, false);
}

export function insertarCategorias(categorias, contenedor){
   let listaCategorias = document.createElement("ul");
   for(let categoria of categorias){
      let estructuraCategoria = $(`
      <li id="categoria-${categoria.category_id}"><a href="#main-section">${categoria.name}</a></li>
      `)[0];
      let parametros5 = {
         "category_id": categoria.category_id,
         "num_items" : nNuevosLibrosPaginacion
      }
      estructuraCategoria.addEventListener('click', function(){
         formBarraBusqueda.reset();
         limpiarContenedorLibros();
         initCargarLibrosScrollBottom();
         idCategoriaActual = categoria.category_id;
         $(document.body).find(".cabecera-contenedor-libros").html('Categoria: ' + categoria.name);
         obtenerEInsertarLibrosIndex(parametros5, contenedorLibros);
      });
   listaCategorias.appendChild(estructuraCategoria);
   }
   contenedor.appendChild($(`<h2>Categorías (${categorias.length})</h2>`)[0]);
   contenedor.appendChild(listaCategorias);
}

export function insertarCategoriasConSubcategorias(categorias, mapaSubcategorias, contenedor){
   let listaCategorias = document.createElement("ul");
   for(let categoria of categorias){
      let subcategoriasOptions = `<option> --- </option>`;
      let conSubcategoria = false;
      for(let subcategoria of mapaSubcategorias.get(categoria.category_id)){
         if(subcategoria != ""){
            subcategoriasOptions += `<option id="prueba-subcategoria-${subcategoria.subcategory_id}" class="prueba-subcategoria">${subcategoria.name}</option>`;
            conSubcategoria = true;
         } 
      }
      let estructuraCategoriaSubcategoria
      if(conSubcategoria){
         estructuraCategoriaSubcategoria = $(`
            <li>
               <a href="#main-section" id="prueba-categoria-${categoria.category_id}" class="prueba-categoria">${categoria.name}</a>
               <select class="select-subcategorias">
                  ${subcategoriasOptions}
               </select>
            </li>
         `)[0];
      }else{
         estructuraCategoriaSubcategoria = $(`
         <li>
            <a href="#main-section" id="prueba-categoria-${categoria.category_id}" class="prueba-categoria">${categoria.name}</a>
         </li>
      `)[0];
      }
      listaCategorias.appendChild(estructuraCategoriaSubcategoria);
   }
   contenedor.appendChild($(`<h2>Categorías (${arrayCategorias.length}) con subcategorías (${arraySubcategorias.flat(1).length})</h2>`)[0]);
   contenedor.appendChild(listaCategorias);

   let classSubcategoria = ".select-subcategorias";
   let classCategoria = ".prueba-categoria";
   document.querySelectorAll(classCategoria).forEach(function(categoria){
      // Los 'id' de los input option siguen un formato prueba-categoria-5
      let idCategoria = $(categoria).prop('id').split("-")[2];
      // console.log('cat' +idCategoria);
      let parametros5 = {
         "category_id": idCategoria,
         "num_items" : nNuevosLibrosPaginacion
      }
      categoria.addEventListener('click', function(){
         formBarraBusqueda.reset();
         limpiarContenedorLibros();
         initCargarLibrosScrollBottom();
         idCategoriaActual = idCategoria;
         $(document.body).find(".cabecera-contenedor-libros").html('Categoría: ' + this.innerText);
         obtenerEInsertarLibrosIndex(parametros5, contenedorLibros);
      });
   });
   document.querySelectorAll(".select-subcategorias").forEach(function(select){
      select.addEventListener('change', function(){
         if (this.selectedIndex == 0) return librosDefaultIndex();
         let opcionSeleccionada = this.selectedOptions[0];
         let indiceSeleccionado = this.selectedIndex;
         //Reinicio el resto de select a su estado original
         document.querySelectorAll(".select-subcategorias").forEach(function(select){
            select.style.backgroundColor = "#CCCC99";
            select.selectedIndex = 0;
         });
         this.style.backgroundColor = "white";
         this.selectedIndex = indiceSeleccionado;
         // Los 'id' de los input option siguen un formato prueba-subcategoria-5
         let idSubcategoria = $(opcionSeleccionada).prop('id').split("-")[2];
         // console.log('sub' + idSubcategoria);
         let parametros6 = {
            "subcategory_id": idSubcategoria,
            "num_items" : nNuevosLibrosPaginacion
         }
         formBarraBusqueda.reset();
         limpiarContenedorLibros();
         initCargarLibrosScrollBottom();
         idSubcategoriaActual = idSubcategoria;
         $(document.body).find(".cabecera-contenedor-libros").html('Subcategoría: ' + opcionSeleccionada.innerText);

         mostrarSpinnerCarga();
         obtenerLibros(parametros6).then(function(librosObtenidos){
            insertarLibrosIndex(librosObtenidos, contenedorLibros);
         }).finally(function(){
            ocultarSpinnerCarga();
            setTimeout(function() { descargando = false;}, 1500);
         });
      });
   });
   // document.querySelectorAll(classSubcategoria).forEach(function(sub){
   //    // Los 'id' de los input option siguen un formato prueba-subcategoria-5
   //    let idSubcategoria = $(sub).prop('id').split("-")[2];
   //    // console.log('sub' + idSubcategoria);
   //    let parametros6 = {
   //       "subcategory_id": idSubcategoria,
            // "num_items" : nNuevosLibrosPaginacion
// 
   //    }
   //    sub.addEventListener('input', function(){
   //       console.log(2);
   //       formBarraBusqueda.reset();
   //       limpiarContenedorLibros();
   //       initCargarLibrosScrollBottom();
   //       idSubcategoriaActual = idSubcategoria;
   //       $(document.body).find(".cabecera-contenedor-libros").html('Subcategoríaa: ' + this.innerText);
            // obtenerEInsertarLibrosIndex(parametros6, contenedorLibros);
   //    });
   // });
}

export function obtenerEInsertarSubcategoriasDeCategorias(categorias, insertar=true) {
   let promesasSubcategorias = [];
   for(let categoria of categorias){
      let parametrosSubcategoria = {
         "get_subcategories_by_category_ID": categoria.category_id
      }
      let promesa = APIOpenLibra(parametrosSubcategoria);
      let copiaPromesa = promesa;
      promesasSubcategorias.push(promesa);
      copiaPromesa.then(subcategorias => mapSubcategorias.set(categoria.category_id, subcategorias));
   }
   // console.log(mapSubcategorias.entries());
   // console.log(Array.from(mapSubcategorias.entries()));
   // mapSubcategorias = new Map(JSON.parse(JSON.stringify(Array.from(mapSubcategorias.entries()))));
   // console.log(mapSubcategorias);

   
   Promise.all([...promesasSubcategorias]).then(function(subcategorias){
      subcategorias.forEach(function(sub){
         if(sub != "") arraySubcategorias.push(sub);
      });
      if(insertar) insertarSubcategorias(arraySubcategorias.flat(), contenedorCategorias);
      sessionStorage.setItem("subcategorias", JSON.stringify(arraySubcategorias));
      sessionStorage.setItem("mapSubcategorias", JSON.stringify(Array.from(mapSubcategorias.entries())));
   }).catch(e => console.log(e));
}

export function insertarSubcategorias(subcategorias, contenedor){
   let listaSubcategorias = document.createElement("ul");
   for(let subcategoria of subcategorias){
      let estructuraSubcategoria = $(`
      <li id="subcategoria-${subcategoria.subcategory_id}"><a href="#main-section">${subcategoria.name}</a></li>
      `)[0];
      let parametros5 = {
         "subcategory_id": subcategoria.subcategory_id,
         "num_items" : nNuevosLibrosPaginacion
      }
      estructuraSubcategoria.addEventListener('click', function(){
         formBarraBusqueda.reset();
         limpiarContenedorLibros();
         initCargarLibrosScrollBottom();
         idSubcategoriaActual = subcategoria.subcategory_id;
         $(document.body).find(".cabecera-contenedor-libros").html('Subcategoria: ' + subcategoria.name);
         obtenerEInsertarLibrosIndex(parametros5, contenedorLibros);
      });
      listaSubcategorias.appendChild(estructuraSubcategoria);
   }
   contenedor.appendChild($(`<h2>Subcategorías (${subcategorias.length})</h2>`)[0]);
   contenedor.appendChild(listaSubcategorias);
}
export async function obtenerLibros(parametros){
   var nuevosLibrosURL = [];
   // mostrarSpinnerCarga();
   await APIOpenLibra(parametros).then(function(librosOpenLibra){
      for(let libroOpenLibra of librosOpenLibra){
         // console.log(libroOpenLibra);
         let newLibro = Libro.crearLibroOpenLibra(libroOpenLibra);
         nuevosLibrosURL.push(Libro.copiarLibro(newLibro));
         libros.push(newLibro);
      }
   }).catch(e => console.log(e));
   return nuevosLibrosURL;
}

export function insertarLibrosIndex(librosAInsertar, contenedor){
   for(let libro of librosAInsertar){
      let estructuraLibroIndex = $(`
      <div class="libroIndex" id="${libro.idOpenLibra}">
         <div class="contenedor-portada-libro">
            <a href="./ficha-libro.html"><img src="${libro.urlThumbnail}" alt="Portada de libro" title="${libro.titulo}" id="idOpenLibra-${libro.idOpenLibra}" class="portada-libro"></a>
         </div>
         <div class="fichaLibro">
            <ul>
               <li class="titulo"><b>Título: </b><a href="./ficha-libro.html">${libro.titulo}</a></li>
               <li class="autor"><b>Autor: </b>${libro.autor}</li>
               <li class="precio"><b>Precio: </b>${libro.precio}</li>
            </ul>
            <span class="opciones-libro-index">
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
      estructuraLibroIndex.querySelector(".titulo").addEventListener('click', function(){
         localStorage.setItem("libro-fichaLibro.html", JSON.stringify(libro));
      });
      initBotonAnadirCarrito(estructuraLibroIndex);
      contenedor.appendChild(estructuraLibroIndex);
   }
   // divMensajesEsquina.fadeOut("slow");
}
   
export function obtenerEInsertarLibrosIndex(parametrosBusqueda, contenedorARellenar){
   mostrarSpinnerCarga();
   obtenerLibros(parametrosBusqueda).then(function(librosObtenidos){
      insertarLibrosIndex(librosObtenidos, contenedorARellenar);
   }).finally(function(){
      ocultarSpinnerCarga();
      //Añado un poco de retardo a las descargas sucesivas para evitar que se lancen demasiadas peticiones si el usuario se encuentra constantemente al final de la página.
      setTimeout(function() { descargando = false;}, 1500);
   });
}

export function buscarLibro(idOpenLibra){
  return libros.find(libro => libro.idOpenLibra == idOpenLibra);
}

export function initBotonAnadirCarrito(nodoConBotonAnadirCarrito){
   $(nodoConBotonAnadirCarrito).find(".btAnadirCarrito").click(function(){
      let libroEncontrado = Libro.copiarLibro(buscarLibro(nodoConBotonAnadirCarrito.id));
      libroEncontrado.cantidad = parseInt(nodoConBotonAnadirCarrito.querySelector(".cantidad-anadir").value);
      carrito.actualizarCantidadLibros(libroEncontrado);

      let mensaje = `"${libroEncontrado.titulo}" añadido al carrito`;
      funciones.mostrarMensajeEsquina2(mensaje, true);
      carrito.actualizarPantallaCarrito();
      //En el caso de que se pulsen varias veces seguidas el boton 'añadir el carrito', se eliminan la cola de animaciones para mostrar momentaneamente el carrito, quedando solo la última. De esta forma no aparece o desaparece varias veces, tantas como se haya pulsado el botón 'anadir al carrito'.
      // Sintaxis -> .stop( [clearQueue ] [, jumpToEnd ] )
      divCarrito.stop(true, false).fadeIn("slow").delay(2000).fadeOut("slow");
      
      // let imgCopiada = $(this).parent().parent().siblings().eq(0).find("img").clone();
      let imgCopiada = $(nodoConBotonAnadirCarrito).find("img").clone();
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
      $(document.body).append(imgCopiada[0]);
      setTimeout(function() { imgCopiada.remove();}, 1900);
   });
}

export async function APIOpenLibra(parametros){
   // La función $.param() permite convertir un objeto con los parametros:valor, en una cadena tipo query para enviar datos por la URL. Por ejemplo, el objeto {param1:valor1, param2:valor2} se convierte a param1=valor1&param2=valor2. Hay que tener en cuenta que la cadena resultante está codificada, y por ello hay que utilizar la funcion decodeURIComponent, para obtener la URL sin codificar, que será la que últimamente se utilice para realizar la petición. Si se omite el paso de la decoficacion, también funcionará..
   // let urlSerializada = decodeURIComponent('https://www.etnassoft.com/api/v1/get/?' + $.param(parametros));
   let urlSerializada = 'https://www.etnassoft.com/api/v1/get/?' + $.param(parametros);
   // console.log(urlSerializada);
   // let mensaje = `
   // <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
   //   <span class="sr-only">Loading...</span>
   // </div>`;
   // mostrarSpinnerCarga();
   descargando = true;
   let respuesta = await fetch(urlSerializada);
   if (!respuesta.ok) {
      throw new Error(`HTTP error! status: ${respuesta.status}`);
   } else {
      respuesta = await respuesta.json();
      return respuesta; 
   }
}

export function copiarObjeto(objetoACopiar){
  return JSON.parse(JSON.stringify(objetoACopiar));
}

export function limpiarContenedorLibros(){
   idCategoriaActual = ""; 
   idSubcategoriaActual = ""; 
   // contenedorLibros.innerHTML = "";
   $(".main-section").children().empty();
   libros = [];
   location.href = "#main-section";
}

export function mostrarSpinnerCarga(){
   let mensaje = `
      <i class="fas fa-spinner fa-2x spinner"></i>
   `;
   funciones.mostrarMensajeEsquina2(mensaje, false);
}
export function ocultarSpinnerCarga(){
   divMensajesEsquina.fadeOut("slow");
}