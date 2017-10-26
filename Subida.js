var uploaders = [];
var uploader;
var ArrayFile = [];
var footer = document.querySelector('footer');
var nnombre;
var chunk = []; 

document.addEventListener('DOMContentLoaded',iniciar);


	function iniciar(){
	
	var dropZone = document.getElementById('dropzone');
	    Entrada = fileToUpload;
	
	dropZone.addEventListener('drop',handleFileSelect,false);
	dropZone.addEventListener('dragover',fileDragHover,false);
	dropZone.addEventListener('dragleave',fileDragLeave,false);
	
	//funcion para crear los botones
	Entrada.addEventListener('change',function nuevoEnvio(ev){
		añadirElemento(ev.target);
		
	botonEnvio = document.querySelector(".enviar");
	

		
	});
	//funcion para crear los listeners

	
		
}

	function fileDragHover (ev){
		ev.stopPropagation();
		ev.preventDefault();

		return false;
	}

	function fileDragLeave(ev){
		ev.stopPropagation();
		ev.preventDefault();
		
		
		return false;
	}

	function handleFileSelect(ev){
	
	ev.stopPropagation();
	ev.preventDefault();
	
	var datos =ev.dataTransfer; //filelist
	
	añadirElemento(datos);
	}
		
	function inicioEnvio(ev){
	for (var i = 0;i < uploaders.length;i++){
		uploaders[i].inicio();
		
	}
	e.preventDefault();
}

	function añadirElementoFooter(archivo){
		
			//esto solamente añade footer
		
		
		//for (var i = 0; i< ArrayFile.length;i++){
			//	if (ArrayFile[i].name == nombre) var elemento = ArrayFile[i];
				
				//{
			
			
							
			//elemento.reader = new FileReader();
			//elemento.reader.padre = elemento;
			
			//elemento.reader.addEventListener('load',function(){
				src = 'data:'+archivo.file.type+';base64,' + window.btoa(archivo.file.reader.result);
				var nombre = archivo.file_name;
				añadirFooter(nombre,src,nnombre);
				crearListenerSpan(archivo,nnombre);
				nnombre++;
			//});
				}
			//elemento.reader.readAsDataURL(elemento);
			
				

	function añadirFooter(nombreArchivo,src,nnombre){
	
		var nuevodiv = "<div data-full-path=/"+nombreArchivo+" id='"+nombreArchivo.replace('.','-')+"hist"+nnombre+"' ><span onclick=eliminarElemento(this.parentElement.id) id='"+nombreArchivo.replace('.','-')+"footer"+nnombre+"' class = 'close eliminar'>X</span>"+
		"<img title='"+nombreArchivo+"' alt='"+nombreArchivo+"' src='"+src+"'><span>'"+nombreArchivo+"'</span>"+
		"</div>";
		idFooter.innerHTML+=nuevodiv;
	
	
	
	
}

	function crearListenerSpan(elemento,nnombre){
	
		
			
			var file=elemento;
			var nombreArchivo= file.file_name;
			var spanBorrar   = document.getElementById(nombreArchivo.replace('.','-')+'footer'+nnombre);

			spanBorrar.file =file;

			
			//listener para los span del historial
			spanBorrar.addEventListener('click',function(ev){
				
				eliminarElemento(ev.currentTarget.file.name+'hist'+nnombre,file.length);					
			},false);
		
	}

	function añadirElemento(files){
		
		
		var acargar=files.files.length;
		var n = 0;
		var cargados=0;
		var datos = files;
		var envio = [];
		
		//separar en dos funciones SRC para leer img en base64 y otra para el resto de archivos
		
		var url;
		
				

		while(++n <= acargar ){
				
				var estado = "";
			
				var file=datos.files[n-1];
				file.reader=new FileReader();
				file.reader.padre=file;
				
				
				if(document.getElementById(file.name.replace('.','-'))){
					cargados++;
					continue;
					}				
				
				envio.push(file);
				//lee el archivo y lo envia para crear los listeners y blob
												
				
				file.reader.addEventListener('load',function(ev){
					
					var re = new RegExp("image[/]");
					var nombre = this.padre.name;
					file.binario = ev.target.result;
					file.src = "";
							
					if(re.test(file.type)) {
						file.src = 'data:'+this.padre.type+';base64,' + window.btoa(this.result);
						
					}
										
					añadirDespues(nombre,file.src);
					cargados++;
					if(cargados==acargar) {
						crearListeners(envio);
						
					}
					
				});
				
			file.reader.readAsBinaryString(file);
				
				
		
				
			
					
			

				
				
		}		
	}

	function añadirDespues(nombreArchivo,src){
		
	
		
		
		var porcentaje = "percent";
		var progreso   = "progressBar" ;
		var nombreArchivo = nombreArchivo.replace('.','-');
		var nuevoDiv = "<div class='unfichero-upload' id='"+nombreArchivo+"'><div id='"+porcentaje+nombreArchivo+"'>Waiting...</div>"+
		"<progress id='"+progreso+nombreArchivo+"' value='0' max='100'></progress>"+
		"<div class = 'nombreArchivo'><p>'"+nombreArchivo+"'</p></div>"+
		"<div class='file-preview'><img height='150' src='"+src+"'><br clear ='left`'></div>"+
		"<div class= 'botones'><button class='enviar'>Enviar</button><button class='parar'>Parar</button>"+
		"<button class='eliminar'>Eliminar</button></div></div>";

		divINI.innerHTML+=nuevoDiv;
		
	}	
		
	function ExisteDato(dato){
	
	
	if (ArrayFile.length == 0) return true;
		else{
			for (var i = 0; i<ArrayFile.lenght; i++){
				if(dato.name == ArrayFile[i].name) return false;		
			}
		}
return true;
}
		
	function crearListeners(dato){
		var nuevoUploader;
		//el objeto nombre de archivo tiene que contener tambien los elementos anteriores
		for (var i = 0; i < dato.length; i++){
			
			if(ExisteDato(dato[i]))	ArrayFile.push(dato[i]); //añade todos los datos en un nuevo array
			
		}
		var idAnteriores = document.querySelectorAll('#divINI > div');
		
		
		for(var n=0;n<idAnteriores.length;n++){
			
			var nombreArchivo=ArrayFile[n].name;
			
			
			
			console.log("Los uploaders son: "+uploaders);
			console.log(ArrayFile);
			var eliminar  = document.querySelector('#'+nombreArchivo.replace('.','-')+' button.eliminar');						
		    var pausa     = document.querySelector('#'+nombreArchivo.replace('.','-')+' button.parar');
			var enviar    = document.querySelector('#'+nombreArchivo.replace('.','-')+' button.enviar');
			
			if(uploaders[n] && uploaders[n].file_name == ArrayFile[n].name)continue;//si ya existe el archivo no se crea otra vez el listener;
			
			nuevoUploader = new ChunkedUploader(ArrayFile[n]);
			chunk.push(nuevoUploader);
			pausa.uploader    =  	nuevoUploader;
			enviar.uploader   =	 	nuevoUploader;
			eliminar.uploader =  	nuevoUploader;
			pausa.style.visibility = 'hidden';
	
			//para eleiminar los archivos no subidos
			eliminar.addEventListener('click',function(ev){
				
				eliminarElemento(ev.currentTarget.uploader.file_name);	
				eliminarUploader(ev.currentTarget.uploader);
				eliminarArrayFile(ev.currentTarget.uploader.file_name);
			}.bind(nuevoUploader));
			
			
			//para enviar
			enviar.addEventListener('click',function(ev){
				var nuevoUpload = ev.currentTarget.uploader;
					
					if(encontrarUpload(nuevoUpload)) uploaders.push(uploader);
					ev.currentTarget.nextSibling.style.visibility='visible';
					start(ev.currentTarget.uploader);								
				
			},false);
		
			//para abortar la subida ya implementada otrodiv es global
			pausa.addEventListener('click',function(ev){
				
			
				if(ev.currentTarget.className == 'parar'){ //si no estaba parado class == parar
					ev.currentTarget.className = 'resumir';  //el boton enviar se oculta y el boton parar  = resumir
					ev.currentTarget.innerHTML="Resumir";
					ev.currentTarget.previousSibling.style.visibility = 'hidden';
					pause(ev.currentTarget.uploader);
				}
				else {
												//siya estaba parado class != resumir
					ev.currentTarget.className = 'parar';   //el boton parar pasa a ser resumir
					ev.currentTarget.innerHTML = 'Parar'
					ev.currentTarget.previousSibling.style.visibility = 'visible';
					if(!uploader.acabo)resume(ev.currentTarget.uploader); // si no acabo resumimos
					else ev.currentTarget.innerHTML="Finalizado";
				}
			
			}.bind(nuevoUploader));
		
		
		}
}	
		
	function eliminarUploader(upload){
			
			for(var i=0;i< chunk.length;i++){
				if(chunk[i].file_name == upload.file_name){
					for(var p = i;p<chunk.length;p++){
						if(i == chunk.length-1){
							chunk.pop();
							break;
						}
					chunk.splice(p,1);
					}					
				}
			}			
		}
		
	function eliminarArrayFile(nombre){
			
			for(var i=0;i< ArrayFile.length;i++){
				if(nombre == ArrayFile[i].name){
					for(var p = i;p<ArrayFile.length;p++){
						if(i == ArrayFile.length-1){
							ArrayFile.pop();
							break;
						}
					ArrayFile.splice(p,1);
					}					
				}
			}			
		}
		
	function encontrarUpload(nuevoUpload){
			
			this.nuevoUpload = nuevoUpload;
				if (uploaders.length == 0) { //si el uploader es el primero qeu se sube o el array esta vacio
				uploader = new ChunkedUploader(nuevoUpload);
				return true;
				}
			
			for(var i= 0;i< uploaders.length;i++){
				if(uploaders[i].file_name == nuevoUpload.name) {
				
					uploader = uploaders[i];
					return false	
				
				} // si el upload ya existe
			}
		    
			uploader = new ChunkedUploader(nuevoUpload); // si es un uploader nuevo
			return true;
			
		}
	
	function encuentraUploader(nuevoUpload){
		
		this.nuevoUpload = nuevoUpload;
		for(var i = 0;i<chunk.length;i++){
			if(chunk[i].file_name == nuevoUpload) return chunk[i];
		}
		
		
		
	}
	
	
	
	function eliminarElemento(nombreArchivo){
		nombreArchivo=nombreArchivo.replace('.','-');
		var DivEliminar = document.getElementById(nombreArchivo);
		DivEliminar.outerHTML = "";
		delete DivEliminar;
		fileToUpload.value =  ''; //permite la presubida del mismo archivo si no se envió
		
		
		//hacer un nuevo file pero sin el el n empezando en n+1		
		
	}
	
	function ChunkedUploader(file){
	
	if(!this instanceof ChunkedUploader){
		return new ChunkedUploader(file);
	}
	
	
	this.file = file;
	this.file_size = this.file.size;
	this.chunk_size = (1024 * 100);
	this.range_start = 0;
	this.range_end = this.chunk_size;
	this.slice_method = 'slice';
	this.file_name = this.file.name;
	this.index = 0;
	this.slicesTotal = Math.ceil(this.file_size/this.chunk_size);
	this.stopEnvio = false;
	this.reanudado = false;
	this.nombre_nuevo = this.file.name;
	this.completo = false;
	//funciones para el envio y respuesta de HTTP
	this.is_paused = false;
	this.acabo = false;
	this.upload_request = new XMLHttpRequest();
	
	this.upload_request.onload = _onChunkComplete.bind(this);
	this.upload_request.onreadystatechange = _completaBarra.bind(this.upload_request);
	this.partesOk =[];
	
};
	
	
	//metodos de la clase
	
	// ChunkedUploader.prototype = {
	
		


		 _upload = function(envio){
				
				var self = envio,
					chunk;
		
			setTimeout(function(){
				if(self.range_end > self.file_size)self.range_end=self.file_size;
				
		
			chunk = self.file[self.slice_method](self.range_start,self.range_end);
	
			
			self.upload_request.open("POST","blob.php",true);//envio de los datos
			self.upload_request.setRequestHeader('HTTP_X_COMPLETO',  self.completo     );
			self.upload_request.setRequestHeader("HTTP_X_FILENAME",  self.nombre_nuevo );
			self.upload_request.setRequestHeader("HTTP_X_FILESIZE",  self.file_size    );
			self.upload_request.setRequestHeader("HTTP_X_MAXINDEX",  self.slicesTotal  );
			self.upload_request.setRequestHeader("HTTP_X_REANUDADO", self.reanudado    );
			self.upload_request.setRequestHeader("HTTP_X_CANCELADO", self.stopEnvio    );
			self.upload_request.setRequestHeader("HTTP_X_INDEX",     (parseInt(self.index)+1).toString());
			self.upload_request.setRequestHeader("HTTP_X_NOMRE", self.file_name);
			
			
			
			if((parseInt(self.index)+1).toString() <= self.slicesTotal) self.upload_request.send(chunk); //si es la segunda vez que se envia no lo permite ya que indice > indice_max
				
			
			console.log(self.index);
			self.index++;
	
        }, 20);
    
	
	
	}.bind();
 
		
	
	//envio finalizado
	
		function _onChunkComplete(){
			
			var Upload = encuentraUploader(this.file_name);
			
			if(Upload.range_end === Upload.file_size){//si ya acabo de realizar el envio
				if (Upload.existe == 'true') console.log("El Archivo: "+Upload.file_name+"ya existia en el servidor");
				console.log("Archivo: "+Upload.file_name+" subido correcto");
				Upload.acabo = true;
				añadirElementoFooter(Upload);
			}
			//actualizar los rangos del chunk
			
			Upload.range_start = Upload.range_end;
			Upload.range_end = Upload.range_start + Upload.chunk_size;
			
			if(!Upload.is_paused && !Upload.acabo){
				_upload(Upload);
			}
			
		};
		
		_completaBarra=function(){
			
			 if (this.readyState == 4 ){
					
					 	var Upload =  _controlEnvio(this);
					
					var data = this.responseText;
					var json =JSON.parse(data); 
					
				
					if(this.responseText) console.log(this.responseText);											
					document.getElementById("progressBar"+Upload.file_name.replace('.','-')).max   = Upload.slicesTotal;
					document.getElementById("progressBar"+Upload.file_name.replace('.','-')).value = Upload.index;
					var percentageDiv = document.getElementById("percent"+Upload.file_name.replace('.','-')).innerHTML = Math.round(Upload.index/Upload.slicesTotal * 100) + "%";
					
					
			 
		
			}
		};

		
		
		
		
		  _controlEnvio = function(respuesta) {
				
					var data = respuesta.responseText;
					var json =JSON.parse(data); 
					
					var Upload = encuentraUploader(json.cabeceras['HTTP_X_NOMRE']);
					  
					console.log("LA RESPUESTA ES:    "+Upload.upload_request.getAllResponseHeaders());
					Upload.partesOk.push(json.cabeceras['HTTP_X_NOMRE']+"_"+json.cabeceras['HTTP_X_MAXINDEX']+"_"+json.cabeceras['HTTP_X_INDEX']);
					console.log(Upload.partesOk);
					
					//Inicio de envio
						//1. El archivo ya esta parcialemte subido en el servidor(REANUDACION)
						if(json.existe  && !json.finalizado) {
								Upload.index = (parseInt(json.idx_reanudacion)).toString(); //decimos que el que acabamos de enviar es el ultimo que figura en la base de  datos como pause
								Upload.range_end = parseInt(Upload.index) * Upload.chunk_size;
								Upload.reanudado = true;
								Upload.existe = false;
						}
						//2. El archivo esta totalmente subido no podemos asegurar que sea el mismo
						//se sube con distinto nombre, una vez subido, comprobamos si el cifrado es el mismo si lo es se sustituye si no se crea uno con un identificador distinto
						
						if(json.existe && json.finalizado) {
						
							var index = Upload.nombre_nuevo.lastIndexOf('.'); //posicion justo antes de la extension
							Upload.nombre_nuevo = Upload.nombre_nuevo.substr(0,index) + "(" +(parseInt(json.cuantos)+1).toString()+")" + Upload.nombre_nuevo.substr(index);
							Upload.completo = true;
							//uploader.nombre_nuevo = uploader.nombre_nuevo +"("+(parseInt(json.cuantos)+1).toString()+")";
							
							Upload.reanudado = false;
							
						
						}
						
						
						
						
					return Upload;
					
		  }
		

		
		// _cabeceraControl: function(){
			
			// uploader.upload_request.open('POST','blob.php',true);
			// uploader.upload_request.setRequestHeader("HTTP_X_FILENAME",  uploader.file_name);
			// uploader.upload_request.setRequestHeader("HTTP_X_INDEX",       uploader.index+1);
			// uploader.upload_request.setRequestHeader("HTTP_X_MAXINDEX",uploader.slicesTotal);
			// uploader.upload_request.setRequestHeader("HTTP_X_CANCELADO", uploader.stopEnvio);
			
		// },
		
	
		
	// };

	
	//inicio del envio
	 function start(envio){
			envio.acabo = false;
			envio.is_paused = false;
			_upload(envio);
		};
	//pausar el envio
	function pause(envio){
			envio.is_paused = true;//mandamos cabecera HTTP_X_CANCELADO , true;
			envio.stopEnvio = true;
			_upload(envio);
		};
	//volver a enviar	
	function resume(envio){//empezar aqui añadir la parte en la que empieza
			
			envio.index = envio.index -1;
			envio.range_start = envio.range_end - envio.chunk_size;
			
			envio.is_paused = false;
			envio.stopEnvio = false;
			_upload(envio);
			
		};
	
	
	
	
	Number.prototype.formatBytes = function(){
		
		var units = ['B','KB','MB','GB','TB'],
		bytes = this,
		i;
		
		for (i = 0; bytes >= 1024 && i < 4;i++){
			bytes/=1024;
		}
	return bytes.toFixed(2) + units[i];
	
	}