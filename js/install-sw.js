// 3 funciones -> Install, activate, fetch
// No se usa window, se utiliza self
// No se usa document, se utiliza caches
// No se usa localStorage, de utilza fetch

if('serviceWorker' in navigator) {
    console.log('Navegador Compatible');
    console.log('=================================');
    navigator.serviceWorker.register('./sw.js')
        .then (function (registro) {
            console.log('El service worker se ha registrado exitosamente.', registro);
        })
        .catch(function(error) {
            console.log('Falló la instalación', error);
        })
} else {
    console.log('Navegador no compatible');
}
