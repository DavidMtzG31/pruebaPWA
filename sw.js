// 3 funciones -> Install, activate, fetch
// No se usa window, se utiliza self
// No se usa document, se utiliza caches
// No se usa localStorage, de utilza fetch


// Instalando el service Worker. Solo se ejecuta una vez, buen lugar para cachear 
self.addEventListener('install', function(e) {
    console.log('Se instaló correctamente');
    // console.log(e);
})

// Se ejecuta cuando se activa, es un buen lugar para nuevas versiones
self.addEventListener('activate', function(e) {
    console.log('Se activó correctamente');
    // console.log(e);
})

// Fetch para descargar archivos estáticos
self.addEventListener('fetch', function(e) {
    console.log('Fetch');
    // console.log(e);
})

