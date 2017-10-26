<?php
	//sys_get_temp_dir ( void ) directorio temporal
	global $obj;
	
	$cabeceras=getallheaders();
    $dir_subida = 'uploads';
	//$nombrefichero=ini_get('upload_tmp_dir') . '/' . $cabeceras['HTTP_X_FILENAME'] . '_' . $cabeceras['HTTP_X_INDEX'] . '_' . $cabeceras['HTTP_X_MAXINDEX'] . '_.temp';
 	$nombrefichero = ini_get('upload_tmp_dir') . '/' . $cabeceras['HTTP_X_FILENAME'] . '_' . $cabeceras['HTTP_X_MAXINDEX'] . '_.temp';
	$nombreficherofinal=$dir_subida . '/' .$cabeceras['HTTP_X_FILENAME'];
	$nombreFicheroTemporal = ini_get('upload_tmp_dir') . '/' . $cabeceras['HTTP_X_FILENAME']; 
	$obj = new stdClass();
	$obj -> cabeceras=$cabeceras;
	$obj -> fichero=$nombrefichero;
	$obj -> indice = $cabeceras['HTTP_X_INDEX'];
	$obj -> indice_max = $cabeceras['HTTP_X_MAXINDEX'];
	$obj -> existe = false;
	$obj -> finalizado = false;
	$obj -> estado = "ArchivoNuevo";
	$obj -> addChunk = true; //añadimos una nueva parte por defecto
	$obj -> cuantos = 0;
	$obj -> nombrefichero = $nombrefichero;
	$obj -> cancelar = $cabeceras['HTTP_X_CANCELADO'];
	$obj -> contenido = file_get_contents('php://input');
	$obj -> nombreFicheroFinal = $dir_subida . '/' .$cabeceras['HTTP_X_FILENAME'];
	$obj -> ext = pathinfo($nombrefichero, PATHINFO_EXTENSION);
	//si es el primer paquete que se envia
				//1.comprobar si el archivo ya existe en el registro
				// 1.1 Existe
					//Si esta completo mnsg (el archivo ya esta en  el servidor)
					//si no esta completo reanudar en el chunk indicado por el ultimo indice de la base de datos
				//1.2 No Existe
					//se carga de forma normal
		

		///   INICIO / REANUDAR
		if($cabeceras['HTTP_X_INDEX'] == '1') {
	
			//echo "el resultado tiene que ser true" . var_dump(archivoCompleto($cabeceras));		
			if(!archivoCompleto($cabeceras)){
					
					$obj -> estado = "ExisteArchivoCompleto";
					$obj -> existe = true; //ARCHIVO COMPLETO Existe
					$obj -> finalizado = true;
					$obj -> cuantos = getIndice($cabeceras);
					
					//añadir la cabecera con otro nombre
					
					$obj -> nombrefichero = añadirIndice($obj -> nombrefichero,$cabeceras);
					
					//si el archivo no tiene un solo paquete
					if(!($cabeceras['HTTP_X_INDEX'] == $cabeceras['HTTP_X_MAXINDEX']))añadirChunk($cabeceras,$obj);
					$obj -> addChunk = false;
					
				}
		
		if(cuantosPartes($cabeceras) != 0 && $obj -> estado != "ExisteArchivoCompleto"){//ARCHIVO EXISTE	
				//ARCHIVO EXISTE no completo
						
						
						$obj -> estado = "ExisteArchivoIncompleto";
						$obj -> existe = true;
						$obj -> finalizado = false;
						$obj -> idx_reanudacion = cuantosPartes($cabeceras);
						responderJson($obj);
						$obj -> addChunk = false;
			}
		
		
		
		}
			
		///REANUDACION
		if($cabeceras['HTTP_X_REANUDADO'] == 'true' && $cabeceras['HTTP_X_INDEX'] != 1 && $cabeceras['HTTP_X_INDEX'] != $cabeceras['HTTP_X_MAXINDEX']){ //siguiente paquete despues de la reanudacion => index = index_pausa + 1;
	
			$obj -> estado = "reanudacion";
			responderJson($obj);
		
			$obj -> addChunk = false;
		
		}
		//CANCELADO/PAUSA
		
		if ($cabeceras['HTTP_X_CANCELADO'] == 'true'){ 
					
					
				
					$obj -> estado = "cancelado";
					addCancelado ($cabeceras);
					$obj -> idx_reanudacion = cuantosPartes($cabeceras);
					//añadirChunk($cabeceras,$obj);
					responderJson($obj);
					$obj -> addChunk = false;
		
		}
				
		
		
		
		
		//FINALIZADO
		//se ha enviado todo el archivo, se recompone y se borra el registro
		if($cabeceras['HTTP_X_INDEX'] == $cabeceras['HTTP_X_MAXINDEX']) {
			//comprobacion si el archivo ya existia y tienen el mismo md5
			
			$obj -> addChunk = true;
			añadirChunk($cabeceras,$obj);
			//if($obj -> estado == 'ExisteArchivoCompleto') $nombreficherofinal = $nombreficherofinal . "(" . $obj -> indice . ")";
			rename($obj ->nombrefichero,$nombreFicheroTemporal); // renombra el archivo en el fichero temporal
			$md5 = md5(file_get_contents($nombreFicheroTemporal));
			$obj -> codmd5 = $md5;
			borraRegistro($cabeceras['HTTP_X_FILENAME'],$obj); //elimina el registro hay que dejar constacia de que esta completo HACER
			onServer($cabeceras,$obj -> estado,$obj -> codmd5); // añadimos completo si se trata de un fichero nuevo
			
			
			//if(!archivoModificado($cabeceras,$md5) and ($obj -> estado == 'ExisteArchivoCompleto'))
			if(!archivoModificado($cabeceras,$md5) and $cabeceras['HTTP_X_COMPLETO'] == 'true') {
			
				// //el archivo no esta modificado
					// //1.
				 
				// $nombre = $cabeceras['HTTP_X_FILENAME'].'_COMPLETO';
				// //print($nombre);
				// //hay que meter el sql para que identifique el archivo modificado y no borre los dos
				unlink($nombreFicheroTemporal);
				$obj -> estado = "sinMod";
				// //borraRegistro($nombre,$obj);
				
			
				
			}
			//if(archivoModificado($cabeceras,$md5) and $obj -> estado == 'ExisteArchivoCompleto')
			
			
			if(archivoModificado($cabeceras,$md5) and $cabeceras['HTTP_X_COMPLETO'] == 'true'){
				
				// si el contenido del archivo fue modificado
				
				//$nombreficherofinal = añadirIndice($nombreficherofinal,$cabeceras);
				//$cabeceras['HTTP_X_FILENAME'] = añadirIndice($cabeceras['HTTP_X_FILENAME'],$cabeceras);
				$obj -> estado = "archivoModificado";
				$cabeceras['HTTP_X_COMPLETO'] = 'false';
				onServer ($cabeceras,$obj->estado,$obj -> codmd5);
				
			}
			
			
		
		
			
			if($obj -> estado != "sinMod")rename($nombreFicheroTemporal,$nombreficherofinal);
			
			
				$obj -> estado = "finalizado";
				
				
				
				$obj -> onServer = true;
				
			
			
			
			
				$obj -> addChunk = false;
				
		}
			
			
		//ENVIO NORMAL
		//añade un nuevo trozo
		//si acabo => addChunk == false no envio
		if($obj -> addChunk)añadirChunk($cabeceras,$obj);	
			
			
		


		function añadirIndice($fichero,$cabeceras){
			
			
			$nombre = $cabeceras['HTTP_X_FILENAME'];
			//$sql = "select * as cuantos from test.gestordescargas where nombreArchivo  regexp '$nombre' ";
			$indice = getIndice($cabeceras) + 1;
			$partes = explode(".",$fichero);
		
			//$partes[count($partes)-2] = $partes[count($partes)-2] ."(" .$indice. ")";
			//$partes[key( array_slice( $partes,-2,1 ))] = $partes[key (array_slice( $partes,-2,1 ))] . "(" . $indice . ")";
			 $longitud =count($partes);
				
				 
					 
			$partes[0] =  $partes[0] . "(" . $indice . ")";
					
					 
			
			
			return $modificado = implode('.',$partes);
			
		}
		
		
		function añadirChunk($cabeceras,$obj)	{	
			$obj -> añadido = "true";
			$obj -> parte_añadida = $cabeceras['HTTP_X_INDEX'];
			if($obj -> addChunk)file_put_contents($obj -> nombrefichero,$obj -> contenido,FILE_APPEND);
			responderJson($obj);
			if($obj -> estado != "ExisteArchivoCompleto")añadirParte($cabeceras);
		}
		
		
		
		
		
		function getIndice($cabeceras){
			
			$nombre = $cabeceras['HTTP_X_FILENAME'];
			$partes= explode(".",$nombre);			
		    array_pop($partes);
			
			$nombre = implode(".",$partes);
			
			$sql = "Select count(*)  as cuantos from gestordescargas where nombreArchivo regexp '$nombre'"; //devuelve el numero de archivos completo 
			return $cuantos = obtenerEscalarSql($sql,'cuantos');
			
			
		}
		
		
		
		function addCancelado($cabeceras){
			
			$dateTime = new DateTime();
			$fecha = date_format($dateTime, 'Y-m-d h:i:s');
			$nombre = $cabeceras['HTTP_X_FILENAME'];
			$index = $cabeceras['HTTP_X_INDEX']-1 ;
			$maxIndex = $cabeceras['HTTP_X_MAXINDEX'];
			$pausa = $cabeceras['HTTP_X_CANCELADO'];
			$md5 = md5((file_get_contents('php://input')));
			
			//$sql = "INSERT into gestordescargas (nombreArchivo,Indice,maxIndex,pausa,clavemd5,fechSubida) values ('$nombre','$index','$maxIndex','$pausa','$md5','$fecha') ";
			$sql = "update test.gestordescargas set nombreArchivo = '$nombre', Indice = '$index', maxIndex = '$maxIndex', pausa = '$pausa',clavemd5 = '$md5', fechaSubida = '$fecha'  where   ID = (select maxid from (select max(ID) as maxid from test.gestordescargas)as tmp)";
			
			$enlace = conectar();
			mysqli_query($enlace,$sql);
			
		
		}
		
		function onServer($cabeceras,$estado, $md5){
			
			
			$dateTime = new DateTime();
			$fecha = date_format($dateTime, 'Y-m-d h:i:s');
			$nombre = $cabeceras['HTTP_X_FILENAME'] . '_COMPLETO';
			$maxIndex = $cabeceras['HTTP_X_MAXINDEX'];
			$index = $cabeceras['HTTP_X_INDEX'];
			$pausa = $cabeceras['HTTP_X_CANCELADO'];
			
			if($cabeceras['HTTP_X_COMPLETO'] == 'false'){ //solo se añade si no existia el archivo completo antes
				$sql = "INSERT into gestordescargas (nombreArchivo,Indice,maxIndex,pausa,clavemd5,fechaSubida) values ('$nombre','$index','$maxIndex','$pausa','$md5','$fecha')";
				$enlace = conectar();
				mysqli_query($enlace,$sql);
			}
		}
		
		
		function borraRegistro($nombre,$obj){
			
			$sql = "delete from test.gestordescargas where nombreArchivo = '$nombre'";
			// if($obj -> estado == "sinMod"){
				
			
				// $sql = "delete from test.gestordescargas where nombreArchivo = trim('$nombre') and ID = (select maxid from (select max(ID) as maxid from test.gestordescargas)as tmp)";
				// $enlace = conectar();
				
				// mysqli_query($enlace,$sql);
				
			// }
		
			$enlace = conectar();
			mysqli_query($enlace,$sql);
			
		}
	
	//funcion para comprobar si el archivo ya exisitia en la base de datos
	
		function archivoCompleto($cabeceras){
			
			global $nombreficherofinal;
		
			$nombre = $cabeceras['HTTP_X_FILENAME'];
			$sql = "select count(nombreArchivo) as cuantos from test.gestordescargas where nombreArchivo = concat('$nombre','_COMPLETO')";
			$cuantos = obtenerEscalarSql($sql,'cuantos');
		
			 //&& $cabeceras['HTTP_X_INDEX'] != 1
			
			if(!file_exists($nombreficherofinal)){
				//si el archivo ya no existe en el servidor y mo es la primera cabecera
				
				$sql = "delete from test.gestordescargas where nombreArchivo = concat('$nombre','_COMPLETO')"; //eliminamos cualquier fichero que permanezca en la base de datos 
				$enlace = conectar();			
				mysqli_query($enlace,$sql);
				return true;
			}
			
			if ($cuantos == 0)return true; //no hay ningun archivo completado
			return false;
			
		}
	
	

	
	
	
	//funcion para conectar con la base de datos
	
	
	function responderJson($obj){
	echo json_encode($obj);
}
	
	
	function conectar(){
		static $enlace;
		if($enlace) return $enlace;
		$enlace = mysqli_connect('127.0.0.1','root','','test');
		if(!$enlace){
			
			 echo "Error: No se pudo conectar a MySQL." . PHP_EOL;
			 echo "errno de depuración: " . mysqli_connect_errno() . PHP_EOL;
			 echo "error de depuración: " . mysqli_connect_error() . PHP_EOL;
			 exit;
		}
		mysqli_query($enlace,"SET NAMES 'utf8'");
		return $enlace;
	}
	
	function añadirParte($cabeceras){
		
		$dateTime = new DateTime();
		$fecha = date_format($dateTime, 'Y-m-d h:i:s');
		
		$nombre = $cabeceras['HTTP_X_FILENAME'];
		$indice = $cabeceras['HTTP_X_INDEX'];
		$maxIndice = $cabeceras['HTTP_X_MAXINDEX'];
		$pausa = $cabeceras['HTTP_X_CANCELADO'];
		$md5 = md5((file_get_contents('php://input')));
		
		$sql = "INSERT INTO gestordescargas (nombreArchivo,Indice,maxIndex,Pausa,clavemd5,fechaSubida) VALUES ('$nombre','$indice','$maxIndice','$pausa','$md5','$fecha')";
		$enlace = conectar();
		mysqli_query($enlace,$sql);
	}
	
	
	function obtenerEscalarSql($sql,$campo){
	
	$enlace=conectar();
	$resultado=mysqli_query($enlace,$sql);
	
	if($resultado){
		$fila=mysqli_fetch_array($resultado,MYSQLI_ASSOC);
		return $cuantos=$fila[$campo];
	}
	
	mysqli_close($enlace);

}
	
	
	
	//obtinene el numero de partes guardadadas en total
	function cuantosPartes($cabeceras){
		
		
		$nombre = $cabeceras['HTTP_X_FILENAME'];
		$sql = "SELECT  *  from test.gestordescargas where nombreArchivo='$nombre'  and ID =(select max(ID) from gestordescargas)";
		$enlace = conectar();
		return  obtenerEscalarSql($sql,'Indice');
		
	}
	
	
	
	function archivoModificado($cabeceras,$md5){
		
		
		$nombre = $cabeceras['HTTP_X_FILENAME'];
		
		
		$sql = "SELECT count(*) as cuantos from test.gestordescargas where nombreArchivo  regexp '_COMPLETO' and clavemd5 like '$md5'";
		$enlace = conectar();
		if(obtenerEscalarSql($sql,'cuantos') == 0) return true;
		return false;
		
	}
	
	
	
	
	
?>
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
