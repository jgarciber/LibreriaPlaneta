// import * as PRINCIPAL from './principal.js';
// window.addEventListener("load",init);

// function init(){
//   //RELLENO LA PÁGINA INDEX POR DEFECTO, ES DECIR, LOS LIBROS QUE SON LOS MÁS VISTOS DE TODAS LAS CATEGORIAS
//   PRINCIPAL.librosDefaultIndex();
// }
import {librosDefaultIndex} from './principal.js';
window.addEventListener("load",init);

function init(){
  //RELLENO LA PÁGINA INDEX POR DEFECTO, ES DECIR, LOS LIBROS QUE SON LOS MÁS VISTOS DE TODAS LAS CATEGORIAS
  librosDefaultIndex();
}

