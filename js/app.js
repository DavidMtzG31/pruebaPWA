const buttonInstall = document.getElementById('installButton');


// https://web.dev/i18n/es/customize-install/

let eventoPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Previene a la mini barra de información que aparezca en smartphones
//   e.preventDefault();
  // Guarda el evento para que se dispare más tarde
  eventoPrompt = e;

  // De manera opcional, envía el evento de analíticos para saber si se mostró la promoción a a instalación del PWA
  console.log(`'beforeinstallprompt' se está ejecutando...`);
});

buttonInstall.addEventListener('click', async () => {
    // Muestre el mensaje de instalación
    eventoPrompt.prompt();
    // Espera a que el usuario responda al mensaje
    const { outcome } = await eventoPrompt.userChoice;
    // De manera opcional, envía analíticos del resultado que eligió el usuario
    console.log(`User response to the install prompt: ${outcome}`);
    // Como ya usamos el mensaje, no lo podemos usar de nuevo, este es descartado
    eventoPrompt = null;
  });


// Constructroes

function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// Realiza la contización con los datos (creamos un prototype)
Seguro.prototype.cotizarSeguro = function () {
    /*
        1 = Americano 1.15
        2 = Asiatico 1.05
        3 = Europeo 1.35
    */

        let cantidad;
        const base = 2000;
   switch(this.marca) {
    case '1': cantidad = base * 1.15;
    break;

    case '2': cantidad = base * 1.05;
    break;

    case '3': cantidad = base * 1.35;
    break;

    default:
        break;

   }

   // Leer el año, cada año el costo se reduce en un 3%
   const diferencia = new Date().getFullYear() - this.year;

   // Cada año que la diferencia es mayor el costo se reduce en 3%
   cantidad -= ( (diferencia * 3) * cantidad ) / 100 ;

   /*
        Si el seguro es básico se multiplica por un 30% más
        Si el seguro es completo se multiplica por un 50% más
   */
   if(this.tipo === 'basico') {
    cantidad = cantidad * 1.3;
   } else {
    cantidad = cantidad * 1.5;
   }
   return cantidad;
}




function UI() {     // User Interface
}


// Llena las opciones de los años
UI.prototype.llenarOpciones = function() {
    const max = new Date().getFullYear();
    const min = max - 20 ;

    const selectYear = document.querySelector('#year');

    for (let i = max ; i > min ; i-- ) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i ;
        selectYear.appendChild(option);
    }
}

// Muestra alertas en pantalla
UI.prototype.mostrarMensaje = function(mensaje, tipo) {
    const div = document.createElement('div')

    if(tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    // Insertar en el HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado') );

    // Quitar el mensaje
    setTimeout(() => {
        div.remove();
    }, 3000)
}

UI.prototype.mostrarResultado = function (total2, seguro) {
    const {marca,year,tipo} = seguro;

    let textoMarca;

    switch(marca) {
        case '1': textoMarca = 'Americano'
        break;
    
        case '2': textoMarca = 'Asiático'
        break;
    
        case '3': textoMarca = 'Europeo'
        break;
 
        default: break;
    }
    // Crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');
    div.innerHTML = `
    <p class="header">Tu resumen</p>
    <p class ="font-bold">Marca: <span class="font-normal"> ${textoMarca}</span></p>
    <p class ="font-bold">Año: <span class="font-normal"> ${year}</span></p>
    <p class ="font-bold">Cobertura: <span class="font-normal uppercase"> ${tipo}</span></p>
    <p class ="font-bold">Total: <span class="font-normal">$ ${total2}</span></p>
    `;
    const resultadoDiv = document.querySelector('#resultado');

    // Mostrar spinner

    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        // Se borra el spinner y arroja el resultado
        resultadoDiv.appendChild(div);
    }, 3000);
}


// Instanciar UI
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();            // Llena el select con los años
} );

listeners();
function listeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    // Leer la marca
    const marca = document.querySelector('#marca').value;


    // Leer el año
    const year = document.querySelector('#year').value;

    // Leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value

    if( marca === '' ) {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    } 
        ui.mostrarMensaje('Cotizando...', 'exito');
        // Ocultar las cotizaciones previas
        const resultados = document.querySelector('#resultado div');
        if (resultados != null) {
            resultados.remove();
        
    }

    // Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();
    let total2 = total.toFixed(2);

    // Utilizar el prototype que va a cotizar
ui.mostrarResultado(total2, seguro);

}