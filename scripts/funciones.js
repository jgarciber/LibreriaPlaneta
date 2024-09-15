var mousePosX, mousePosY;
document.addEventListener('mousemove', saveMousePosition);
export function saveMousePosition(event) {
   var eventDoc, doc, body;

   event = event || window.event; // IE-ism

   // If pageX/Y aren't available and clientX/Y are,
   // calculate pageX/Y - logic taken from jQuery.
   // (This is to support old IE)
   if (event.pageX == null && event.clientX != null) {
      eventDoc = (event.target && event.target.ownerDocument) || document;
      doc = eventDoc.documentElement;
      body = eventDoc.body;

      event.pageX = event.clientX +
         (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
         (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY +
         (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
         (doc && doc.clientTop  || body && body.clientTop  || 0 );
   }

   // Use event.pageX / event.pageY here
   mousePosX = event.pageX;
   mousePosY = event.pageY;
}

export function getMousePosition(){
   return [mousePosX,mousePosY];
}

export function smoothScrollJS(idDestino){
   document.getElementById(idDestino).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function mostrarMensajeEnCursor(mensajeAMostrar){
   var myDiv = '<div id="mensajesAJAXCursor">';
   var fadeDelay = 3000;
   var divMensajes = $(myDiv)
      .css({
         "left": mousePosX + 'px',
         "top": mousePosY + 'px'
      })
      .append(mensajeAMostrar)
      .appendTo(document.body);

   setTimeout(function() { 
      divMensajes.fadeOut("slow", function() { $(this).remove(); });
   }, fadeDelay);
   // $(document).mousemove(function(e){
   //    var divMensajes = $(myDiv)
   //       .css({
   //          "left": e.pageX + 'px',
   //          "top": e.pageY + 'px'
   //       })
   //       .append(mensajeAMostrar)
   //       .appendTo(document.body);
   //       $(document).off("mousemove");

   //    setTimeout(function() { 
   //       divMensajes.fadeOut("slow", function() { $(this).remove(); });
   //    }, fadeDelay);
   // });
}

export function mostrarMensajeEsquina(mensajeAMostrar, activateDelay){
   var myDiv = '<div id="mensajesAJAXEsquina">';
   var divMensajes = $(myDiv).css({
      "position": "fixed",
      "font-size": "0.7em",
      "padding": "10px",
      "border-radius": "5px",
      "background-color": "lightblue",
      "font-weight": "bold",
      "bottom": "60px",
      "right": "30px",
      "opacity": "1"
   });
   var fadeDelay = 3000;
   divMensajes.append(mensajeAMostrar).appendTo(document.body).delay(3000).remove();

   if(activateDelay){
      setTimeout(function() { 
         divMensajes.fadeOut("slow", function() { $(this).remove(); });
      }, fadeDelay);
   }
}

export function mostrarMensajeEsquina2(mensajeAMostrar, activateDelay){
   var divMensajes = $("#mensajesAJAXEsquina");
   var fadeDelay = 3000;
   divMensajes.empty().append(mensajeAMostrar).fadeIn("slow");
   if(activateDelay){
      setTimeout(function() {divMensajes.fadeOut("slow");},fadeDelay);
   }
}

export function mostrarToastEsquina(mensajeAMostrar){
   var fadeDelay = 3000;
   var myDiv = `<div class="toast" data-delay="${fadeDelay}" style="position: fixed; right: 30px; bottom: 30px;">
      <div class="toast-header">
         <strong class="mr-auto">Notificación Extranet</strong>
         <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
         </button>
      </div>
      <div class="toast-body">
         ${mensajeAMostrar}
      </div>
      </div>`;
   var divMensajes = $(myDiv).appendTo(document.body);
   $('.toast').toast('show');
   setTimeout(function() { divMensajes.remove();}, fadeDelay+1000);
}

export function mensajeConfirmacion(mensaje){
   return `<div class="alert alert-success">${mensaje}</div>`;
}
export function mensajeError(mensaje){
   return `<div class="alert alert-danger">${mensaje}</div>`;
}


export async function APIOpenLibra(parametros){
   document.querySelectorAll("button").forEach(button => button.disabled = true);
   let urlSerializada = decodeURIComponent('https://www.etnassoft.com/api/v1/get/?' + $.param(parametros));
   // funciones.mostrarMensajeEsquina('Petición enviada, espere por favor ...');
   let mensaje = `
   <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
     <span class="sr-only">Loading...</span>
   </div>`;
   this.mostrarMensajeEsquina(mensaje);
   let respuesta = await fetch(urlSerializada);
   if (!respuesta.ok) {
     throw new Error(`HTTP error! status: ${respuesta.status}`);
   } else {
     respuesta = respuesta.json();
     document.querySelectorAll("button").forEach(button => button.disabled = false);
     return respuesta; 
   }
}

export function randomIntFromInterval(min, max) { // min and max included 
   return Math.floor(Math.random() * (max - min + 1) + min);
}
export function randomFloatFromInterval(min, max, precision) {
   return (Math.random() * (max - min) + min).toFixed(precision);
}

export function validezInputNumber(event, inputNumber, permiteDecimales) {
   var numTecla = Number.parseInt(event.key);
   //Hay que añadir el número introducido por teclado como una cadena ya que el campo todavía no tiene el valor (el evento se lanzó justo antes de establecerse el valor)
   var valorInput = Number.parseInt(inputNumber.value.concat(numTecla));
   var minNota = inputNumber.min != '' ? inputNumber.min : Number.MIN_VALUE;
   var maxNota = inputNumber.max != '' ? inputNumber.max : Number.MAX_VALUE;
   var maxDigitos = maxNota.toString().length;
   if(valorInput < minNota || valorInput > maxNota || valorInput.toString().length > maxDigitos || Number.isNaN(numTecla)){
      if(event.key != 'Backspace'){
         if(!permiteDecimales || (event.code != 'NumpadDecimal' && event.code != 'Period')){
            event.preventDefault();
            event.stopPropagation();
         }
      }
   }
}

export function setStylesOnElement(styles, element){
   Object.assign(element.style, styles);
}