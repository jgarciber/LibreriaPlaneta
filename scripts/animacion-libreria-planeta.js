var planeta;
var libro;
var elipses_1;
var elipses_2;
var texto;
var fondo;

window.addEventListener("load", function() {
   svg = document.getElementById('svg-object').contentDocument;
   planeta = svg.getElementById('planeta_libreriaPlaneta');
   libro = svg.getElementById('libro_libreriaPlaneta');
   elipses_1 = svg.getElementById('elipses-1_libreriaPlaneta');
   elipses_2 = svg.getElementById('elipses-2_libreriaPlaneta');
   texto = svg.getElementById('texto_libreriaPlaneta');
   fondo = svg.getElementById('fondo_libreriaPlaneta');

   animacion1 = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
   animacion2 = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
   animacion3 = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');

   // elipses_1.addEventListener('mouseenter', mover1);
   // libro.addEventListener('mouseenter', mover1);
   // libro.addEventListener('mouseenter', rotar1);
   
   //Inicio las animaciones
   mover1();
   rotar1();

   //Reinicio las animaciones. No es necesario eliminarla y luego insertarla nuevamente.
   elipses_1.addEventListener('mouseenter', () => {
      reiniciarAnimacionesSVG(planeta);
      reiniciarAnimacionesSVG(elipses_1);
      reiniciarAnimacionesSVG(elipses_2);
   });
   libro.addEventListener('mouseenter', () => {reiniciarAnimacionesSVG(libro);});
   libro.addEventListener('mouseenter', () => {reiniciarTransformacionesSVG(libro);});


   // libro.style.transformOrigin = 'center';
   // libro.style.transformBox = 'fill-box';
   // libro.animate([
   //    {transform: 'translate(0,0)'},
   //    {transform: 'translate(-20px,0)'},
   //    {transform: 'translate(15px,0)'},
   //    {transform: 'translate(-10px,0)'},
   //    {transform: 'translate(5px,0)'},
   //    {transform: 'translate(0px,0)'}
   //    ], {
   //    duration: 1000,
   //    easing: 'ease-out',
   //    iterations: 10
   // });
   // libro.animate([
   //    {transform: 'rotate(30deg)'}
   //    ], {
   //    duration: 1000,
   //    easing: 'ease-out',
   //    iterations: 10
   // });
});

function mover1(){
   animacion1.setAttributeNS(null, 'dur', '2s');
   animacion1.setAttributeNS(null, 'path', 'm0 0,0 3,0 -3 z');
   animacion1.setAttributeNS(null, 'repeatCount', '1');
   animacion1.setAttributeNS(null, 'restart', 'whenNotActive');
   planeta.insertBefore(animacion1.cloneNode(true), planeta.firstChild);
   elipses_1.insertBefore(animacion1.cloneNode(true), elipses_1.firstChild);
   elipses_2.insertBefore(animacion1.cloneNode(true), elipses_2.firstChild);
}

function rotar1(){
   var rect = libro.getBoundingClientRect();
   var cx = rect.left + (rect.right - rect.left)/2;
   var cy = rect.top + (rect.bottom - rect.top)/2;
   // console.log(rect.top);
   // console.log(rect.right);
   // console.log(rect.bottom);
   // console.log(rect.left);
   // console.log(cx);
   // console.log(cy);

   //Rotación
   animacion2.setAttributeNS(null, 'attributeName', 'transform');
   animacion2.setAttributeNS(null, 'attributeType', 'xml');
   animacion2.setAttributeNS(null, 'type', 'rotate');
   animacion2.setAttributeNS(null, 'keyTimes', "0; 0.2; 0.4; 0.6; 0.75; 1");
   animacion2.setAttributeNS(null, 'values', 
      '0 '+ cx + ' ' + cy + ";" +
      '-10 '+ cx + ' ' + cy + ";" +
      '10 '+ cx + ' ' + cy + ";" +
      '-10 '+ cx + ' ' + cy + ";" +
      '10 '+ cx + ' ' + cy + ";" +
      '0 '+ cx + ' ' + cy + ";"
   );
   animacion2.setAttributeNS(null, 'dur', '3s');
   animacion2.setAttributeNS(null, 'repeatCount', '1');
   animacion2.setAttributeNS(null, 'restart', 'whenNotActive');

   //Movimiento
   animacion3.setAttributeNS(null, 'dur', '3s');
   animacion3.setAttributeNS(null, 'path', 'm0 0,0 -30,0 30 z');
   animacion3.setAttributeNS(null, 'repeatCount', '1');
   animacion3.setAttributeNS(null, 'restart', 'whenNotActive');

   libro.insertBefore(animacion2.cloneNode(true), libro.firstChild);
   libro.insertBefore(animacion3.cloneNode(true), libro.firstChild);
}

function reiniciarAnimacionesSVG(nodo){
   nodo.querySelectorAll("animateMotion").forEach(element => {element.beginElement();})
}

function reiniciarTransformacionesSVG(nodo){
   nodo.querySelectorAll("animateTransform").forEach(element => {element.beginElement();})
}

function eliminarAnimacionesSVG(nodo){
   let hijos = nodo.querySelectorAll("animateMotion");
   for (hijo of hijos) {
      nodo.removeChild(hijo);
   }
}

function eliminarTransformacionesSVG(nodo){
   let hijos = nodo.querySelectorAll("animateTransform");
   for (hijo of hijos) {
      nodo.removeChild(hijo);
   }
}

