'use strict';

/* =========================
   FORMULARIO
========================= */
const formulario     = document.querySelector('#formulario');
const inputNombre    = document.querySelector('#nombre');
const inputEmail     = document.querySelector('#email');
const selectAsunto   = document.querySelector('#asunto');
const textMensaje    = document.querySelector('#mensaje');
const charCount      = document.querySelector('#chars');
const resultado      = document.querySelector('#resultado');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 4.2 Validación base
function validarCampo(input, esValido, errorId) {
  const errorMsg = document.getElementById(errorId);
  if (esValido) {
    input.classList.remove('error');
    errorMsg.classList.remove('visible');
  } else {
    input.classList.add('error');
    errorMsg.classList.add('visible');
  }
  return esValido;
}

// 4.3 Validadores individuales
function validarNombre() {
  return validarCampo(inputNombre, inputNombre.value.trim().length >= 3, 'error-nombre');
}
function validarEmail() {
  return validarCampo(inputEmail, EMAIL_REGEX.test(inputEmail.value.trim()), 'error-email');
}
function validarAsunto() {
  return validarCampo(selectAsunto, selectAsunto.value.trim() !== '', 'error-asunto');
}
function validarMensaje() {
  return validarCampo(textMensaje, textMensaje.value.trim().length >= 10, 'error-mensaje');
}

// 4.4 Contador de caracteres
function actualizarContador(e) {
  const longitud = e.target.value.length;                          // 4.4.1
  charCount.textContent = longitud;                                // 4.4.2
  charCount.style.color = longitud > 270 ? '#e74c3c' : '#999';    // 4.4.3
}
textMensaje.addEventListener('input', actualizarContador);         // 4.4.4

// 4.5 Blur para validar al salir del campo
inputNombre.addEventListener('blur', validarNombre);               // 4.5.1
inputEmail.addEventListener('blur', validarEmail);                 // 4.5.2
selectAsunto.addEventListener('blur', validarAsunto);              // 4.5.3
textMensaje.addEventListener('blur', validarMensaje);              // 4.5.4

/* =========================
   PASO 5
========================= */

// 5.1 Limpiar error de un campo
function limpiarError(input, errorId) {
  input.classList.remove('error');
  document.getElementById(errorId).classList.remove('visible');
}

// 5.2 Limpiar errores mientras escribe
inputNombre.addEventListener('input',  () => limpiarError(inputNombre,  'error-nombre'));   // 5.2.1
inputEmail.addEventListener('input',   () => limpiarError(inputEmail,   'error-email'));    // 5.2.2
selectAsunto.addEventListener('change',() => limpiarError(selectAsunto, 'error-asunto'));   // 5.2.3
textMensaje.addEventListener('input',  () => limpiarError(textMensaje,  'error-mensaje'));  // 5.2.4

// 5.3 Mostrar resultado
function mostrarResultado() {
  resultado.innerHTML = '';

  const titulo   = document.createElement('strong');
  titulo.textContent = 'Datos recibidos:';

  const pNombre  = document.createElement('p');
  pNombre.textContent = `Nombre: ${inputNombre.value.trim()}`;

  const pEmail   = document.createElement('p');
  pEmail.textContent = `Email: ${inputEmail.value.trim()}`;

  const pAsunto  = document.createElement('p');
  pAsunto.textContent = `Asunto: ${selectAsunto.options[selectAsunto.selectedIndex].text}`;

  const pMensaje = document.createElement('p');
  pMensaje.textContent = `Mensaje: ${textMensaje.value.trim()}`;

  resultado.appendChild(titulo);
  resultado.appendChild(pNombre);
  resultado.appendChild(pEmail);
  resultado.appendChild(pAsunto);
  resultado.appendChild(pMensaje);
  resultado.classList.add('visible');
}

// 5.4 Resetear formulario
function resetearFormulario() {
  formulario.reset();
  charCount.textContent = '0';
  charCount.style.color = '#999';
  [inputNombre, inputEmail, selectAsunto, textMensaje].forEach(campo => {
    campo.classList.remove('error');
  });
  document.querySelectorAll('.error-msg').forEach(msg => {
    msg.classList.remove('visible');
  });
}

// 5.5 Evento submit
formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombreValido  = validarNombre();    // 5.5.1
  const emailValido   = validarEmail();
  const asuntoValido  = validarAsunto();
  const mensajeValido = validarMensaje();

  if (nombreValido && emailValido && asuntoValido && mensajeValido) {  // 5.5.2
    mostrarResultado();
    resetearFormulario();
    return;
  }

  // 5.5.3 Focus en el primer campo inválido
  if (!nombreValido)  { inputNombre.focus();  return; }
  if (!emailValido)   { inputEmail.focus();   return; }
  if (!asuntoValido)  { selectAsunto.focus(); return; }
  textMensaje.focus();
});

/* =========================
   PASO 6 - ATAJO TECLADO
========================= */
document.addEventListener('keydown', (e) => {      // 6.1
  if (e.ctrlKey && e.key === 'Enter') {            // 6.2
    e.preventDefault();
    formulario.requestSubmit();                    // 6.3
  }
});

/* =========================
   TAREAS CON DELEGACIÓN
========================= */
const inputNuevaTarea = document.querySelector('#nueva-tarea');
const btnAgregar      = document.querySelector('#btn-agregar');
const listaTareas     = document.querySelector('#lista-tareas');
const contadorTareas  = document.querySelector('#contador-tareas');

let tareas = [
  { id: 1, texto: 'Estudiar JavaScript',   completada: false },
  { id: 2, texto: 'Hacer la práctica',     completada: false },
  { id: 3, texto: 'Subir al repositorio',  completada: true  }
];

// 7.2 Funciones helper
function crearBotonEliminar() {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.textContent = 'Eliminar';
  boton.className = 'btn-eliminar';
  boton.dataset.action = 'eliminar';
  return boton;
}

function crearTextoTarea(tarea) {
  const span = document.createElement('span');
  span.textContent = tarea.texto;
  span.className = 'tarea-texto';
  span.dataset.action = 'toggle';
  return span;
}

function crearItemTarea(tarea) {
  const li = document.createElement('li');
  li.className = `tarea-item${tarea.completada ? ' completada' : ''}`;
  li.dataset.id = tarea.id;
  li.appendChild(crearTextoTarea(tarea));
  li.appendChild(crearBotonEliminar());
  return li;
}

// Contador de tareas
function actualizarContadorTareas() {
  const pendientes = tareas.filter(t => !t.completada).length;
  contadorTareas.textContent = `${pendientes} pendiente(s)`;
}

// 7.4 Renderizar tareas
function renderizarTareas() {
  listaTareas.innerHTML = '';

  if (tareas.length === 0) {                               // 7.4.1
    const itemVacio = document.createElement('li');
    itemVacio.className = 'estado-vacio';
    itemVacio.textContent = 'No hay tareas registradas';
    listaTareas.appendChild(itemVacio);
    contadorTareas.textContent = '0 pendiente(s)';
    return;
  }

  tareas.forEach(tarea => {                                // 7.4.2
    listaTareas.appendChild(crearItemTarea(tarea));
  });

  actualizarContadorTareas();                              // 7.4.3
}

// 7.5 Agregar tarea
function agregarTarea() {
  const texto = inputNuevaTarea.value.trim();              // 7.5.1

  if (texto === '') {                                      // 7.5.2
    inputNuevaTarea.focus();
    return;
  }

  tareas.push({ id: Date.now(), texto, completada: false });  // 7.5.3
  inputNuevaTarea.value = '';                              // 7.5.4
  renderizarTareas();                                      // 7.5.5
  inputNuevaTarea.focus();                                 // 7.5.6
}

// 7.6 Eventos botón y Enter
btnAgregar.addEventListener('click', agregarTarea);        // 7.6.1

inputNuevaTarea.addEventListener('keydown', (e) => {       // 7.6.2
  if (e.key === 'Enter') {
    e.preventDefault();
    agregarTarea();
  }
});

// 7.7 Event delegation
listaTareas.addEventListener('click', (e) => {
  const action = e.target.dataset.action;

  if (!action) return;                                     // 7.7.1

  const item = e.target.closest('li');                    // 7.7.2
  if (!item || !item.dataset.id) return;

  const id = Number(item.dataset.id);                     // 7.7.3

  if (action === 'eliminar') {                            // 7.7.4
    tareas = tareas.filter(t => t.id !== id);
    renderizarTareas();
    return;
  }

  if (action === 'toggle') {                              // 7.7.5
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
      tarea.completada = !tarea.completada;
      renderizarTareas();
    }
  }
});

// 7.8 Renderizado inicial
renderizarTareas();