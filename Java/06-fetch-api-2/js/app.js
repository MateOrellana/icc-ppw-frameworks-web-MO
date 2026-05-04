'use strict';

/* =========================
   SELECCIÓN DE ELEMENTOS
========================= */
const formPost       = document.querySelector('#form-post');
const inputPostId    = document.querySelector('#post-id');
const inputTitulo    = document.querySelector('#titulo');
const inputContenido = document.querySelector('#contenido');
const btnSubmit      = document.querySelector('#btn-submit');
const btnCancelar    = document.querySelector('#btn-cancelar');
const inputBuscar    = document.querySelector('#input-buscar');
const btnBuscar      = document.querySelector('#btn-buscar');
const btnLimpiar     = document.querySelector('#btn-limpiar');
const listaPosts     = document.querySelector('#lista-posts');
const mensajeEstado  = document.querySelector('#mensaje-estado');
const contador       = document.querySelector('#contador strong');

/* =========================
   ESTADO GLOBAL
========================= */
let posts          = [];
let postsFiltrados = [];
let modoEdicion    = false;

/* =========================
   FUNCIONES PRINCIPALES
========================= */

// 6.2 Cargar posts
async function cargarPosts() {
  try {
    mostrarCargando(listaPosts);                          // 6.2.1
    posts          = await ApiService.getPosts(20);       // 6.2.2
    postsFiltrados = [...posts];                          // 6.2.3
    renderizarPosts(postsFiltrados, listaPosts);          // 6.2.4
    actualizarContador();                                 // 6.2.5
  } catch (error) {
    listaPosts.innerHTML = '';
    listaPosts.appendChild(
      MensajeError(`No se pudieron cargar los posts: ${error.message}`)
    );
  }
}

function actualizarContador() {
  contador.textContent = postsFiltrados.length;
}

// 6.3 Auxiliares del formulario
function limpiarFormulario() {
  formPost.reset();
  inputPostId.value         = '';
  modoEdicion               = false;
  btnSubmit.textContent     = 'Crear Post';
  btnCancelar.style.display = 'none';
}

function activarModoEdicion(post) {
  modoEdicion               = true;
  inputPostId.value         = post.id;
  inputTitulo.value         = post.title;
  inputContenido.value      = post.body;
  btnSubmit.textContent     = 'Actualizar Post';
  btnCancelar.style.display = 'inline-block';
  formPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
  inputTitulo.focus();
}

/* =========================
   CRUD
========================= */

// 7.1 Crear o actualizar
async function guardarPost(datosPost) {
  try {
    btnSubmit.disabled    = true;
    btnSubmit.textContent = modoEdicion ? 'Actualizando...' : 'Creando...';

    let resultado;

    if (modoEdicion) {
      const id  = parseInt(inputPostId.value);             // 7.1.1
      resultado = await ApiService.updatePost(id, datosPost); // 7.1.2

      const index = posts.findIndex(p => p.id === id);
      if (index !== -1) {
        posts[index] = { ...resultado, id };
      }
      mostrarMensajeTemporal(
        mensajeEstado,
        MensajeExito(`Post #${id} actualizado correctamente`),
        3000
      );
    } else {
      resultado = await ApiService.createPost(datosPost);  // 7.1.3
      posts.unshift(resultado);                            // 7.1.4
      mostrarMensajeTemporal(
        mensajeEstado,
        MensajeExito(`Post #${resultado.id} creado correctamente`),
        3000
      );
    }

    postsFiltrados = [...posts];
    renderizarPosts(postsFiltrados, listaPosts);
    actualizarContador();
    limpiarFormulario();

  } catch (error) {
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeError(`Error al guardar: ${error.message}`),
      5000
    );
  } finally {
    btnSubmit.disabled    = false;
    btnSubmit.textContent = modoEdicion ? 'Actualizar Post' : 'Crear Post';
  }
}

// 7.2 Eliminar
async function eliminarPost(id) {
  if (!confirm(`¿Eliminar el post #${id}?`)) return;      // 7.2.1

  try {
    await ApiService.deletePost(id);                      // 7.2.2
    posts          = posts.filter(p => p.id !== id);      // 7.2.3
    postsFiltrados = postsFiltrados.filter(p => p.id !== id); // 7.2.4

    renderizarPosts(postsFiltrados, listaPosts);
    actualizarContador();
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeExito(`Post #${id} eliminado correctamente`),
      3000
    );
  } catch (error) {
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeError(`Error al eliminar: ${error.message}`),
      5000
    );
  }
}

// 7.3 Búsqueda
function buscarPosts(termino) {
  const terminoLower = termino.toLowerCase().trim();

  if (terminoLower === '') {
    postsFiltrados = [...posts];                           // 7.3.1
  } else {
    postsFiltrados = posts.filter(post => {                // 7.3.2
      const tituloMatch = post.title.toLowerCase().includes(terminoLower);
      const bodyMatch   = post.body.toLowerCase().includes(terminoLower);
      return tituloMatch || bodyMatch;
    });
  }

  renderizarPosts(postsFiltrados, listaPosts);
  actualizarContador();
}

function limpiarBusqueda() {
  inputBuscar.value  = '';
  postsFiltrados     = [...posts];
  renderizarPosts(postsFiltrados, listaPosts);
  actualizarContador();
}

/* =========================
   EVENT LISTENERS
========================= */
formPost.addEventListener('submit', (e) => {
  e.preventDefault();
  guardarPost({
    title:  inputTitulo.value.trim(),
    body:   inputContenido.value.trim(),
    userId: 1
  });
});

btnCancelar.addEventListener('click', limpiarFormulario);

btnBuscar.addEventListener('click', () => buscarPosts(inputBuscar.value));

inputBuscar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') buscarPosts(inputBuscar.value);
});

btnLimpiar.addEventListener('click', limpiarBusqueda);

listaPosts.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  const id   = parseInt(e.target.dataset.id);
  const post = posts.find(p => p.id === id);

  if (action === 'editar' && post) activarModoEdicion(post);
  if (action === 'eliminar')      eliminarPost(id);
});

/* =========================
   INICIALIZACIÓN
========================= */
cargarPosts();