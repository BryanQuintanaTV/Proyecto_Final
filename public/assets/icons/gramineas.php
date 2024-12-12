<?php

     /*Conexión BD*/
    $conexion = mysqli_connect($host, "u511403479_bryanquintana", "BryanPass123", "u511403479_bryanquintana");
    $acentos = $conexion->query("SET NAMES 'utf8'");
    // Probar exito de la conexión
    if (mysqli_connect_errno()) {
        echo 'Error de conexión: ' . mysqli_error($conexion);
    }
    
    $consulta = "SELECT idgraminea,nombrecomun,nombrecientifico,descripcion,imagen"
    . " FROM gramineas order by idgraminea";
 
    //ejecutar sentencia de BD
    $resultado = mysqli_query($conexion, $consulta);
    $nuevoarreglo = array();
    
    while ($fila_bd = mysqli_fetch_assoc($resultado)) {
    $nuevoarreglo[] = $fila_bd;
    }
    
    // obtener todos los registros en formato JSON
    echo json_encode($nuevoarreglo);
?>
