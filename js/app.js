// Selectores
const criptoSelect = document.querySelector('#criptomonedas');
const formulario   = document.querySelector('#formulario');
const monedaSelect = document.querySelector('#moneda');
const divResultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptoSelect.addEventListener('change', leerValor);

    monedaSelect.addEventListener('change', leerValor);
})

// Funciones

async function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        selectCriptomonedas(resultado.Data)
    } catch (error) {
        console.log(error);
    }
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {

        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        criptoSelect.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    // Validar formulario
    const {moneda, criptomoneda} = objBusqueda;

    if (moneda === '' || criptomoneda === '') {

        // imprimir alerta solo si no ha insertado antes
        const alerta = document.querySelector('.error');
        if (!alerta) {
            mostrarAlerta('Todos los campos son obligatorios');
            return;
        }
    }

    // Consultar la API
    consultarAPI();
    
}

function mostrarAlerta(mensaje) {
    // Crear elemento HTML
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');

    // Insertar el contenido 
    divMensaje.textContent = mensaje;

    // Insertar al DOM el div con la alerta creada
    formulario.appendChild(divMensaje);

    // Temporizador para eliminar la alerta
    setTimeout(() => {
        divMensaje.remove();
    }, 3000);

}

async function consultarAPI() {
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.log(error);
    }



}

function mostrarCotizacionHTML(cotizacion) {
    // Limpiar HTML
    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    // Precio de la criptomoneda
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    // Precio mas alto de la criptomoneda
    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `Precio mas alto del dia : <span>${HIGHDAY}</span>`;

    // Precio mas bajo de la criptomoneda
    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `Precio mas bajo del dia : <span>${LOWDAY}</span>`;

    // Precio ultimas horas de la criptomoneda
    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variacion ultimas 24h : <span>${CHANGEPCT24HOUR}%</span>`;

    // Ultima actualizacion de la criptomoneda
    const ultimasActualizacion = document.createElement('p');
    ultimasActualizacion.innerHTML = `Ultima actualizacion : <span>${LASTUPDATE}</span>`;

    divResultado.appendChild(precio); 
    divResultado.appendChild(precioAlto); 
    divResultado.appendChild(precioBajo); 
    divResultado.appendChild(ultimasHoras); 
    divResultado.appendChild(ultimasActualizacion); 
}

function limpiarHTML() {
    while (divResultado.firstChild) {
        divResultado.removeChild(divResultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner. innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);
}