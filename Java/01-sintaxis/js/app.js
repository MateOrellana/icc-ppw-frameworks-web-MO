'use strict';

const nombre = 'Pablo';
const apellido = 'Torres';
let ciclo = 5;
const activo = true;

const direccion = {
    ciudad: 'Cuenca',
    provincia: 'Azuay'
}

console.table({nombre, apellido, ciclo, activo, direccion});

const notas = [10, 20, 30, 40];
const calcularPromedio = notas.reduce((a, b) => a + b, 0) / numeros.length;
console.log(promedio);

const esMayorEdad = (edad) => edad >= 18;
esMayorEdad(25);

const getSaludo = (nombre, hora) => {
    if (hora < 12)
        return `Buenos dias, ${nombre}`;
    if (hora < 18)
        return `Buenos tardes, ${nombre}`;
    return `Buenas noches, ${nombre}`;
}

const getSaludo2 = (nombre, hora) => hora < 12
    ? `Buenos dias, ${nombre}`
    : hora < 18
        ? `Buenas tardes, ${nombre}`
        : `Buenas noches, ${nombre}`;

//Mostrar en html
document.getElementById('nombre').textContent = `${nombre}`;
document.getElementById('apellido').textContent = `${apellido}`;
document.getElementById('ciclo').textContent = `${ciclo}`;
