import {randomIntFromInterval, randomFloatFromInterval} from './funciones.js';
export default class Libro{
   constructor(idOpenLibra, titulo, autor, categoria, editorial, paginas, precio, idioma, traductor, anoEdicion, tipoEncuadernacion, sinopsis, urlThumbnail, urlCover, cantidad){
      this.idOpenLibra = idOpenLibra;
      this.titulo = titulo;
      this.autor = autor;
      this.categoria = categoria;
      this.editorial = editorial;
      this.paginas = paginas;
      this.precio = precio;
      this.idioma = idioma;
      this.traductor = traductor;
      this.anoEdicion = anoEdicion;
      this.tipoEncuadernacion = tipoEncuadernacion;
      this.sinopsis = sinopsis;
      this.urlThumbnail = urlThumbnail;
      this.urlCover = urlCover;
      this.cantidad = cantidad;
   }

   static crearLibroOpenLibra(libroOpenLibra){
      let idOpenLibra = libroOpenLibra.ID;
      let titulo = libroOpenLibra.title;
      let autor = libroOpenLibra.author;
      let categoria = libroOpenLibra.categories;
      let editorial = libroOpenLibra.publisher;
      let paginas = libroOpenLibra.pages;
      let precio = randomFloatFromInterval(3,40,2);
      let idioma = libroOpenLibra.languaje;
      let traductor = libroOpenLibra.author;
      let anoEdicion = libroOpenLibra.publisher_date;
      let tipoEncuadernacion = 'PDF';
      let sinopsis = libroOpenLibra.content;
      let urlThumbnail = libroOpenLibra.thumbnail;
      let urlCover = libroOpenLibra.cover;
      let cantidad = 1;

      return new Libro(idOpenLibra, titulo, autor, categoria, editorial, paginas, precio, idioma, traductor, anoEdicion, tipoEncuadernacion, sinopsis, urlThumbnail, urlCover, cantidad);
   }
   
   get idOpenLibra(){
      return this._idOpenLibra;
   }
   set idOpenLibra(newId) {
      this._idOpenLibra = newId;
   }
      
   get titulo(){
      return this._titulo;
   }
   set titulo(newTitulo) {
      this._titulo = newTitulo;
   }
   
   get autor(){
      return this._autor;
   }
   set autor(newAutor) {
      this._autor = newAutor;
   }
   
   get categoria(){
      return this._categoria;
   }
   set categoria(newCategoria) {
      this._categoria = newCategoria;
   }
   
   get editorial(){
      return this._editorial;
   }
   set editorial(newEditorial) {
      this._editorial = newEditorial;
   }
   
   get paginas(){
      return this._paginas;
   }
   set paginas(newPaginas) {
      this._paginas = newPaginas;
   }
   
   get precio(){
      return this._precio;
   }
   set precio(newPrecio) {
      //Si el precio es un número decimal del tipo 5,0, se eliminan los decimales
      if(newPrecio % 1 != 0){
         this._precio = parseFloat(newPrecio);
      }else{
         this._precio = Math.floor(newPrecio);
      }
   }
   
   get idioma(){
      return this._idioma;
   }
   set idioma(newIdioma) {
      this._idioma = newIdioma;
   }
   
   get traductor(){
      return this._traductor;
   }
   set traductor(newTraductor) {
      this._traductor = newTraductor;
   }
   
   get anoEdicion(){
      return this._anoEdicion;
   }
   set anoEdicion(newAnoEdicion) {
      this._anoEdicion = newAnoEdicion;
   }
   
   get tipoEncuadernacion(){
      return this._tipoEncuadernacion;
   }
   set tipoEncuadernacion(newTipoEncuadernacion) {
      this._tipoEncuadernacion = newTipoEncuadernacion;
   }
   
   get sinopsis(){
      return this._sinopsis;
   }
   set sinopsis(newSinopsis) {
      this._sinopsis = newSinopsis;
   }

   get urlThumbnail(){
      return this._urlThumbnail;
   }
   set urlThumbnail(newUrlThumbnail) {
      this._urlThumbnail = newUrlThumbnail;
   }

   get urlCover(){
      return this._urlCover;
   }
   set urlCover(newUrlCover) {
      this._urlCover = newUrlCover;
   }

   get cantidad(){
      return this._cantidad;
   }
   set cantidad(newCantidad) {
      this._cantidad = newCantidad;
   }

   static copiarLibro(source) {
      return Object.assign(new Libro(), source);
   }

   //Cuando se hace JSON.parse, devuelve el objeto pero no es un objeto libro en sí, sino un objeto que contiene la información del libro. Hay que crear el objeto
   static copiarLibroJSON(libroParseJSON) {
      return new Libro (libroParseJSON._idOpenLibra, libroParseJSON._titulo, libroParseJSON._autor, libroParseJSON._categoria, libroParseJSON._editorial, libroParseJSON._paginas, libroParseJSON._precio, libroParseJSON._idioma, libroParseJSON._traductor, libroParseJSON._anoEdicion, libroParseJSON._tipoEncuadernacion, libroParseJSON._sinopsis, libroParseJSON._urlThumbnail, libroParseJSON._urlCover, libroParseJSON._cantidad);
   }
   static copiarLibros(librosACopiar) {
      let librosCopiados = [];
      for (let libro of librosACopiar) {
         librosCopiados.push(this.copiarLibro(libro));
      }
      return librosCopiados;
   }
   static copiarLibrosJSON(librosACopiar) {
      let librosCopiados = [];
      for (let libro of librosACopiar) {
         librosCopiados.push(this.copiarLibroJSON(libro));
      }
      return librosCopiados;
   }
}