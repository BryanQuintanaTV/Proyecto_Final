<?php include 'ana_garcia.php'; ?>

<?php
// Nombre del archivo a modificar
$file = 'ana_garcia.php';

// Función para cambiar el valor de la variable $nombre en el archivo
function cambiarNombreEnArchivo($file, $nuevoNombre) {
    // Leer el contenido del archivo
    $contenido = file_get_contents($file);
    
    // Buscar y reemplazar el valor de la variable $nombre
    $contenido = preg_replace('/\$nombre = \'[^\']*\';/', "\$nombre = '$nuevoNombre';", $contenido);
    
    // Guardar el archivo con el nuevo contenido
    file_put_contents($file, $contenido);
    
    //  $contenido_button = file_get_contents($file);
     $contenido = preg_replace('/\$showButton = \'[^\']*\';/', "\$showButton = 'false';", $contenido);
     file_put_contents($file, $contenido);
   
}


// Verificar si el formulario ha sido enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Cambiar el nombre por '****'
    cambiarNombreEnArchivo($file, '****');
    
    // Redirigir para evitar que el formulario se envíe nuevamente
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Cambiar Nombre</title>
</head>
<body>

<!-- Formulario con el botón que cambia el nombre -->
<?php if ($showButton == 'true'): ?>
<form method="post">
    <button type="submit">Eliminar Datos De Acceso (2 Clicks)</button>
</form>
<?php endif; ?>

<!-- Incluir el archivo que muestra el nombre -->

</body>
</html>
