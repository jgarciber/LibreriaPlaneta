import Libro from "./libro.js";
const DESCUENTO = 10;
const IVA = 21;
var reduccionPorDescuento;
var incrementoPorIVA;
var sumatoriaAntesDescuentosEImpuestos;
var precisionPrecio = 2;
var divCarrito = $("#carrito");

export default class Carrito{
   constructor(libros){
      this._libros = libros;
      this._total = 0;
   }
   
   get libros(){
      return this._libros;
   }
   set libros(newLibros) {
      if(newLibros.length != 0){
         for (let libro of newLibros) {
            this.anadirLibro(Libro.copiarLibro(libro));
         }
      }else{
         this._libros = newLibros;
      }
   }

   get total(){
      return this._total;
   }
   set total(newTotal) {
      this._total = newTotal;
   }

   calcularPrecioTotal(){
		let total = 0;
      // total = this.libros.reduce((total, libro) => total + libro.precio * libro.cantidad);
      this.libros.forEach(libro => {
         total += (libro.cantidad * libro.precio);
      });
      sumatoriaAntesDescuentosEImpuestos = total.toFixed(precisionPrecio);
      reduccionPorDescuento = (total * DESCUENTO/100).toFixed(precisionPrecio);
      incrementoPorIVA = parseFloat(((total - reduccionPorDescuento) * IVA/100).toFixed(precisionPrecio));
      this.total = parseFloat(total - reduccionPorDescuento + incrementoPorIVA).toFixed(precisionPrecio);
   }

   actualizarCantidadLibros(nuevoLibro){
      let libroEncontrado = this.libros.find(libro => libro.idOpenLibra == nuevoLibro.idOpenLibra);
      if(libroEncontrado){
         libroEncontrado.cantidad += nuevoLibro.cantidad;
      }else{
         this.anadirLibro(nuevoLibro);
      }
      // console.log(this);

      // let repetido = false;
      // for (let libro of this.libros){
      //    let titulo1 = libro.titulo;
      //    let titulo2 = nuevoLibro.titulo;
      //    if (titulo1 == titulo2){
      //       libro.cantidad += 1;
      //       repetido = true;
      //       break;
      //    }
      // }
      // // if (!repetido) carrito.push(copiarObjeto(nuevoLibro));
      // if (!repetido) this.anadirLibro(nuevoLibro);
   }

   anadirLibro(nuevoLibro){
      this.libros.push(nuevoLibro);
   }

   actualizarPantallaCarrito(){
      var self = this;
      divCarrito.find("#table-libros-carrito tbody").empty();
      for (let libro of this.libros){
         let tuplaLibro = $(`
            <tr>
               <td><img src="${libro.urlThumbnail}"</td>
               <td class="precio">${libro.precio}</td>
               <td><i class="fas fa-plus-square btn-aumentar-cantidad"></i>${libro.cantidad}<i class="fas fa-minus-square btn-reducir-cantidad"></i></td>
               <td class="precio">${(libro.cantidad * libro.precio).toFixed(precisionPrecio)} </td>
               <td><i class="fas fa-window-close btn-cerrar"></i>
               </td>
            </tr>
         `);
			$(tuplaLibro[0]).find(".btn-aumentar-cantidad").click(function(){
				//Tengo que utilizar self para no confundir al compilador con this. En este caso this, no representaria a la clase, sino a tuplaLibro[0]
				libro.cantidad += 1;
				self.actualizarPantallaCarrito();
         });
			$(tuplaLibro[0]).find(".btn-reducir-cantidad").click(function(){
				if(libro.cantidad > 1){
					libro.cantidad -= 1;
				}else{
					$(tuplaLibro[0]).find(".btn-cerrar").click();
				}
				self.actualizarPantallaCarrito();
         });

         $(tuplaLibro[0]).find(".btn-cerrar").click(function(){
				let libroEncontrado = self.libros.find(libroCarrito => libroCarrito.idOpenLibra == libro.idOpenLibra);
            if (window.confirm(`¿Realmente desea eliminar el libro "${libroEncontrado.titulo}" del carrito?.`)){
               let index = self.libros.indexOf(libroEncontrado);
               if (index > -1) {
                  self.libros.splice(index, 1);
               }
               self.actualizarPantallaCarrito();
               divCarrito.delay(2000).fadeOut("slow");
            }
         });
   
         divCarrito.find("#table-libros-carrito tbody").prepend($(tuplaLibro));
      }
      this.calcularPrecioTotal();
      let descuentosEImpuestos = $(`
         <p class="precio">Subtotal: ${sumatoriaAntesDescuentosEImpuestos}</p>
         <p class="precio">Descuento (${DESCUENTO}%) : - ${reduccionPorDescuento}</p>
         <p class="precio">IVA (${IVA}%) : + ${incrementoPorIVA}</p>
         <p class="precio"><b>TOTAL: ${this.total}</b></p>
         <button>Ir a mi carrito</button>
         <button id="btn-vaciar-carrito">Eliminar todo</button>
      `);
      // divCarrito.find("#precio-total > p").remove().prepend(descuentosEImpuestos);
      // console.log(divCarrito.find("#precio-total").find("p")[0]);
      // document.querySelectorAll("#precio-total .precio").forEach(precio => precio
      // divCarrito.find("#precio-total > .precio").replaceWith(descuentosEImpuestos);
      // divCarrito.find("#precio-total").empty().append(descuentosEImpuestos);
      if(this.total != 0){
         divCarrito.find("#precio-total").empty().append(descuentosEImpuestos);
         $("#btn-vaciar-carrito").click(function(){
            self.vaciarCarrito();
         });
         divCarrito.find("#table-libros-carrito").show();
      }else{
         divCarrito.find("#table-libros-carrito").hide();
         let sinArticulos = $(`
            <p>No hay ningún artículo</p>
            <button>Ir a mi carrito</button>
         `);
         divCarrito.find("#precio-total").empty().append(sinArticulos);
         divCarrito.delay(2000).fadeOut("slow");
      }
   }
   
	vaciarCarrito(){
      if (window.confirm(`¿Realmente desea eliminar todos los libros del carrito?.`)){
         this.libros = [];
         divCarrito.find("#table-libros-carrito").hide();
         divCarrito.addClass("zarandear2");
         setTimeout(function(){divCarrito.removeClass("zarandear2");}, 1500);
         // divCarrito.effect( "shake",{times:3}, 600);
			this.actualizarPantallaCarrito();
		}
	}
   
   static copiarCarrito(source) {
      return Object.assign(new Carrito(), source);
   }   
   static copiarCarritoJSON(objCarritoJSON) {
      let librosCreados = Libro.copiarLibrosJSON(objCarritoJSON._libros);
      return new Carrito(librosCreados);
   }   
}