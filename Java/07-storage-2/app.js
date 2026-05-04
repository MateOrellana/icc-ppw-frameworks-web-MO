'use strict';

//clave con la cual se guarda en local
const STORAGE_KEY = 'tareas';

//elementos del DOM
const input = document.querySelector("#input-tarea");
const btnAdd = document.querySelector("#btn-agregar");
const listado = document.querySelector("#lista-tareas");
const btnClear = document.querySelector("#btn-limpiar");

//memoria del listado
let tareas = [];

//FUNCIONES DE STORAGE
function loadStorage(){
    const datos = localStorage.getItem(STORAGE_KEY);

    return datos ? JSON.parse(datos): [];
}

function saveTareas(){
    loadStorage.setItem(STORAGE_KEY,JSON.stringify(tareas))
}

//FUNCIONES DE LOGICA
function agregarTarea(texto){
    if(!texto.trim()) return;

    const nuevaTarea = {
        id: Date.now(),
        texto: texto.trim(),
        completada: false
    };

    tareas.push(nuevaTarea);
    saveTareas();
    renderizar();
    input.value = '';
    input.focus();
}

function eliminarTarea(id){
    //const tarea = tareas.find(t => t.id === id);
    //if(tarea){
    //    tareas.remove(tarea);
    //}
    tareas = tareas.filter(t => t.id !== id);
    saveTareas();
    renderizar();
}

function toogleTarea(id){
    const tarea = tareas.find(t => t.id === id);
    if(tarea){
        tarea.completada = !tarea.completada;
    }
    saveTareas();
    renderizar();
}

function clearAll(){
    if(tareas.length ===0) return;

    if(confirm('Estas seguro?')){
        tareas = [];
        saveTareas();
        renderizar();
    }

function renderizar() {
  
    lista.innerHTML = '';

    if (tareas.length === 0) {
        const vacio = document.createElement('p');
        vacio.className = 'vacio';
        vacio.textContent = 'No hay tareas. ¡Agrega una!';
        lista.appendChild(vacio);
        btnLimpiar.disabled = true;
        return;
    }

    btnLimpiar.disabled = false;

    tareas.forEach(tarea => {
        const item = document.createElement('div');
        item.className = 'item-tarea';
        if (tarea.completada) {
            item.classList.add('completada');
        }

        const texto = document.createElement('span');
        texto.className = 'texto-tarea';
        texto.textContent = tarea.texto;
        texto.addEventListener('click', () => toggleTarea(tarea.id));

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn-eliminar';
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));

        item.appendChild(texto);
        item.appendChild(btnEliminar);
        lista.appendChild(item);
        });
    }

    btnAgregar.addEventListener('click', () => {
        agregarTarea(input.value);
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            agregarTarea(input.value);
        }
    });

    btnLimpiar.addEventListener('click', clearAll);

    // Cargar tareas guardadas al abrir la página
    tareas = loadStorage();
    renderizar();
    input.focus();
}
