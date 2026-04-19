'use strict';

// Información del estudiante
const estudiante = {
  nombre: 'Mateo Orellana',
  carrera: 'Ingeniería de Sistemas',
  semestre: 5
};

// Lista de elementos (elegir un dominio: tareas, productos, películas, etc.)
const elementos = [
  { id: 1, titulo: 'Proyecto Web',  descripcion: 'Terminar práctica JS',    categoria: 'Estudio',  prioridad: 'Alta',  activo: true  },
  { id: 2, titulo: 'Comprar comida',descripcion: 'Ir al supermercado',       categoria: 'Personal', prioridad: 'Media', activo: true  },
  { id: 3, titulo: 'Reunión',       descripcion: 'Equipo de trabajo',        categoria: 'Trabajo',  prioridad: 'Alta',  activo: false },
  { id: 4, titulo: 'Leer libro',    descripcion: 'Capítulo de JS',           categoria: 'Estudio',  prioridad: 'Baja',  activo: true  },
  { id: 5, titulo: 'Ejercicio',     descripcion: 'Salir a correr',           categoria: 'Personal', prioridad: 'Media', activo: false },
  { id: 6, titulo: 'Deploy',        descripcion: 'Subir proyecto a GitHub',  categoria: 'Trabajo',  prioridad: 'Alta',  activo: true  }
];

// Mostrar info del estudiante
function mostrarInfoEstudiante() {
  document.getElementById('estudiante-nombre').textContent = estudiante.nombre;
  document.getElementById('estudiante-carrera').textContent = estudiante.carrera;
  document.getElementById('estudiante-semestre').textContent = `${estudiante.semestre}° semestre`;
}

// Actualizar estadísticas
function actualizarEstadisticas() {
  const total   = elementos.length;
  const activos = elementos.filter(el => el.activo).length;
  document.getElementById('total-elementos').textContent  = total;
  document.getElementById('elementos-activos').textContent = activos;
}

// Eliminar elemento
function eliminarElemento(id) {
  const index = elementos.findIndex(el => el.id === id);
  if (index !== -1) {
    elementos.splice(index, 1);
    renderizarLista(elementos);
  }
}

function renderizarLista(datos) {
  const contenedor = document.getElementById('contenedor-lista');
  contenedor.innerHTML = '';

  const fragment = document.createDocumentFragment();

  datos.forEach(el => {
    
    const card = document.createElement('div');
    card.classList.add('card');

    const titulo = document.createElement('h3');
    titulo.textContent = el.titulo;

    const descripcion = document.createElement('p');
    descripcion.textContent = el.descripcion;

    const categoria = document.createElement('span');
    categoria.textContent = el.categoria;
    categoria.classList.add('badge', 'badge-categoria');

    const prioridad = document.createElement('span');
    prioridad.textContent = el.prioridad;
    prioridad.classList.add('badge');
    if      (el.prioridad === 'Alta')  prioridad.classList.add('prioridad-alta');
    else if (el.prioridad === 'Media') prioridad.classList.add('prioridad-media');
    else                               prioridad.classList.add('prioridad-baja');

    const estado = document.createElement('span');
    estado.textContent = el.activo ? 'Activo' : 'Inactivo';
    estado.classList.add('badge', el.activo ? 'estado-activo' : 'estado-inactivo');

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.classList.add('btn-eliminar');
    btnEliminar.addEventListener('click', () => eliminarElemento(el.id));

    // CONTENEDOR DE BADGES
    const badges = document.createElement('div');
    badges.classList.add('badges');
    badges.appendChild(categoria);
    badges.appendChild(prioridad);
    badges.appendChild(estado);

    // ACCIONES
    const acciones = document.createElement('div');
    acciones.classList.add('card-actions');
    acciones.appendChild(btnEliminar);

    // ENSAMBLE FINAL
    card.appendChild(titulo);
    card.appendChild(descripcion);
    card.appendChild(badges);
    card.appendChild(acciones);

    fragment.appendChild(card);
  });

  contenedor.appendChild(fragment);
  actualizarEstadisticas();
}

function inicializarFiltros() {
  const botones = document.querySelectorAll('.btn-filtro');
  botones.forEach(btn => {
    btn.addEventListener('click', () => {

      botones.forEach(b => b.classList.remove('btn-filtro-activo'));

      btn.classList.add('btn-filtro-activo');

      const categoria = btn.dataset.categoria;
      if (categoria === 'todas') {
        renderizarLista(elementos);
      } else {
        const filtrados = elementos.filter(e => e.categoria === categoria);
        renderizarLista(filtrados);
      }
    });
  });
}

// Inicializar aplicación
mostrarInfoEstudiante();
renderizarLista(elementos);
inicializarFiltros();