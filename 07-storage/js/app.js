'use strict';

/* =========================
   SELECCIÓN DE ELEMENTOS
========================= */
const formTarea     = document.getElementById('form-tarea');
const inputTarea    = document.getElementById('input-tarea');
const listaTareas   = document.getElementById('lista-tareas');
const mensajeEstado = document.getElementById('mensaje-estado');
const btnLimpiar    = document.getElementById('btn-limpiar');
const themeBtns     = document.querySelectorAll('[data-theme]');

/* =========================
   ESTADO GLOBAL
========================= */
let tareas = [];

/* =========================
   COMPONENTES DOM
========================= */

// 5.2 Crear elemento de tarea
function crearElementoTarea(tarea) {
  const li = document.createElement('li');
  li.className  = 'task-item';
  li.dataset.id = tarea.id;

  if (tarea.completada) {
    li.classList.add('task-item--completed');
  }

  // 5.2.1.1 Checkbox
  const checkbox     = document.createElement('input');
  checkbox.type      = 'checkbox';
  checkbox.className = 'task-item__checkbox';
  checkbox.checked   = tarea.completada;

  // 5.2.1.2 Texto
  const span       = document.createElement('span');
  span.className   = 'task-item__text';
  span.textContent = tarea.texto;          // textContent, NUNCA innerHTML

  // 5.2.1.3 Botón eliminar
  const btnEliminar       = document.createElement('button');
  btnEliminar.className   = 'btn btn--danger btn--small';
  btnEliminar.textContent = '🗑️';

  // 5.2.1.4 Contenedor de acciones
  const divAcciones     = document.createElement('div');
  divAcciones.className = 'task-item__actions';
  divAcciones.appendChild(btnEliminar);

  // 5.2.1.5 Ensamblar
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(divAcciones);

  // 5.2.1.6 Event listeners
  checkbox.addEventListener('change', () => toggleTarea(tarea.id));
  btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));

  return li;
}

// 5.3 Renderizar tareas
function renderizarTareas() {
  listaTareas.innerHTML = '';                        // 5.3.1.1

  if (tareas.length === 0) {                         // 5.3.1.2
    const divVacio = document.createElement('div');
    divVacio.className = 'empty-state';
    const p = document.createElement('p');
    p.textContent = '📭 No hay tareas. ¡Agrega una para comenzar!';
    divVacio.appendChild(p);
    listaTareas.appendChild(divVacio);
    return;
  }

  tareas.forEach(tarea => {                          // 5.3.1.3
    listaTareas.appendChild(crearElementoTarea(tarea));
  });
}

// 5.4 Mostrar mensaje temporal
function mostrarMensaje(texto, tipo = 'success') {
  mensajeEstado.textContent = texto;
  mensajeEstado.className   = `mensaje mensaje--${tipo}`;
  mensajeEstado.classList.remove('oculto');
  setTimeout(() => {
    mensajeEstado.classList.add('oculto');
  }, 3000);
}

/* =========================
   LÓGICA DE TAREAS
========================= */

// 6.1 Cargar tareas
function cargarTareas() {
  tareas = TareaStorage.getAll();
  renderizarTareas();
}

// 6.2 Agregar tarea
function agregarTarea(texto) {
  if (!texto.trim()) {                               // 6.2.1.1
    mostrarMensaje('El texto no puede estar vacío', 'error');
    return;
  }

  const nueva = TareaStorage.crear(texto);           // 6.2.1.2
  tareas      = TareaStorage.getAll();               // 6.2.1.3
  renderizarTareas();                                // 6.2.1.4
  mostrarMensaje(`✓ Tarea "${nueva.texto}" agregada`); // 6.2.1.5
}

// 6.3.1 Toggle completada
function toggleTarea(id) {
  TareaStorage.toggleCompletada(id);                 // 6.3.1.1
  tareas = TareaStorage.getAll();                    // 6.3.1.2
  renderizarTareas();                                // 6.3.1.3
}

// 6.3.2 Eliminar tarea
function eliminarTarea(id) {
  const tarea = tareas.find(t => t.id === id);       // 6.3.2.1
  if (!confirm(`¿Eliminar "${tarea.texto}"?`)) return; // 6.3.2.2

  TareaStorage.eliminar(id);                         // 6.3.2.3
  tareas = TareaStorage.getAll();                    // 6.3.2.4
  renderizarTareas();
  mostrarMensaje(`🗑️ Tarea eliminada`);               // 6.3.2.5
}

// 6.3.3 Limpiar todo
function limpiarTodo() {
  if (tareas.length === 0) {                         // 6.3.3.1
    mostrarMensaje('No hay tareas para limpiar', 'error');
    return;
  }

  if (!confirm('¿Eliminar TODAS las tareas?')) return; // 6.3.3.2

  TareaStorage.limpiarTodo();                        // 6.3.3.3
  tareas = [];                                       // 6.3.3.4
  renderizarTareas();
  mostrarMensaje('🗑️ Todas las tareas eliminadas');
}

/* =========================
   TEMA
========================= */

// 7.1 Aplicar tema
function aplicarTema(nombreTema) {
  if (nombreTema === 'oscuro') {                     // 7.1.1.1
    document.documentElement.style.setProperty('--bg-primary',    '#0f0f1a');
    document.documentElement.style.setProperty('--bg-secondary',  '#1a1a2e');
    document.documentElement.style.setProperty('--card-bg',       '#16213e');
    document.documentElement.style.setProperty('--text-primary',  '#e0e0e0');
    document.documentElement.style.setProperty('--text-secondary','#94a3b8');
    document.documentElement.style.setProperty('--border-color',  '#2a2a4a');
    document.documentElement.style.setProperty('--success-bg',    '#0d2137');
    document.documentElement.style.setProperty('--success-color', '#4ade80');
    document.documentElement.style.setProperty('--error-bg',      '#2d1212');
    document.documentElement.style.setProperty('--error-color',   '#f87171');
    document.documentElement.style.setProperty('--completed-color','#555');
  } else {
    document.documentElement.style.setProperty('--bg-primary',    '#f0f2f5');
    document.documentElement.style.setProperty('--bg-secondary',  '#ffffff');
    document.documentElement.style.setProperty('--card-bg',       '#ffffff');
    document.documentElement.style.setProperty('--text-primary',  '#1a1a2e');
    document.documentElement.style.setProperty('--text-secondary','#555');
    document.documentElement.style.setProperty('--border-color',  '#e2e8f0');
    document.documentElement.style.setProperty('--success-bg',    '#d4edda');
    document.documentElement.style.setProperty('--success-color', '#155724');
    document.documentElement.style.setProperty('--error-bg',      '#fde8e8');
    document.documentElement.style.setProperty('--error-color',   '#721c24');
    document.documentElement.style.setProperty('--completed-color','#aaa');
  }

  // 7.1.1.2 Actualizar botones activos
  themeBtns.forEach(btn => {
    btn.classList.toggle('theme-btn--active', btn.dataset.theme === nombreTema);
  });

  // 7.1.1.3 Guardar en localStorage
  TemaStorage.setTema(nombreTema);
}

/* =========================
   EVENTOS
========================= */
formTarea.addEventListener('submit', (e) => {
  e.preventDefault();
  const texto = inputTarea.value.trim();
  agregarTarea(texto);
  inputTarea.value = '';
});

btnLimpiar.addEventListener('click', limpiarTodo);

themeBtns.forEach(btn => {
  btn.addEventListener('click', () => aplicarTema(btn.dataset.theme));
});

/* =========================
   INICIALIZACIÓN
========================= */
const temaGuardado = TemaStorage.getTema();
aplicarTema(temaGuardado);

cargarTareas();

if (tareas.length === 0) {
  mostrarMensaje('👋 ¡Bienvenido! Agrega tu primera tarea', 'success');
}