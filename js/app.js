const installButton = document.getElementById('installButton');

window.addEventListener("beforeinstallprompt", prompt);


function prompt() {
    window.addEventListener("beforeinstallprompt", (beforeInstallPromptEvent) => {
        // Previene que el prompt se muestre inmediatamente
        // beforeInstallPromptEvent.preventDefault(); 
      
        // Evento para el botón de instalar
        installButton.addEventListener("click", () => {
          // you should not use the MouseEvent here, obviously
        beforeInstallPromptEvent.prompt();
    
        // Promise que resuelve que eligió el usuario, instalar o cancelar.
        beforeInstallPromptEvent.userChoice
          .then(respuesta => console.log(respuesta))
          .catch(error => console.log(error))
        });
      })
}


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
    prompt();
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