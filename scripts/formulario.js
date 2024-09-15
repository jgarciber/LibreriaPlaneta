var formulario;
var submitFormulario;
window.addEventListener('load', init);

function init(){
   formulario = document.forms["form-contacto"];
   submitFormulario = formulario.querySelector("input[type=submit]");
   submitFormulario.disabled = true;
   formulario.addEventListener('input', mostrarBotonEnviar);
   // formulario.addEventListener('change', function(){formulario.reportValidity();});
   formulario.querySelectorAll("input, textarea").forEach(campo => {
      campo.addEventListener('change', function(e){e.currentTarget.reportValidity(); 
      });
   });
}

function mostrarBotonEnviar(){
   if(formulario.checkValidity()){
      submitFormulario.disabled = false;
   }else{
      submitFormulario.disabled = true;
   }
}