'use strict';

/* =========================
   COMPONENTES
========================= */

// 5.1 PostCard
function PostCard(post) {
  const article = document.createElement('article');
  article.className = 'post-card fade-in';
  article.dataset.id = post.id;

  const header = document.createElement('div');
  header.className = 'post-card-header';

  const title = document.createElement('h3');
  title.className = 'post-card-title';
  title.textContent = post.title;

  const badge = document.createElement('span');
  badge.className = 'post-card-id';
  badge.textContent = `#${post.id}`;

  header.appendChild(title);
  header.appendChild(badge);

  const body = document.createElement('p');
  body.className = 'post-card-body';
  body.textContent = post.body;

  const footer = document.createElement('div');
  footer.className = 'post-card-footer';

  const btnEditar = document.createElement('button');
  btnEditar.className = 'btn-editar';
  btnEditar.textContent = 'Editar';
  btnEditar.dataset.action = 'editar';
  btnEditar.dataset.id = post.id;

  const btnEliminar = document.createElement('button');
  btnEliminar.className = 'btn-eliminar';
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.dataset.action = 'eliminar';
  btnEliminar.dataset.id = post.id;

  footer.appendChild(btnEditar);
  footer.appendChild(btnEliminar);

  article.appendChild(header);
  article.appendChild(body);
  article.appendChild(footer);

  return article;
}

// 5.2 Spinner
function Spinner() {
  const container = document.createElement('div');     // 5.2.1
  container.className = 'loading';

  const spinner = document.createElement('div');       // 5.2.2
  spinner.className = 'spinner';

  const texto = document.createElement('p');           // 5.2.3
  texto.textContent = 'Cargando posts...';

  container.appendChild(spinner);                      // 5.2.4
  container.appendChild(texto);

  return container;                                    // 5.2.5
}

// 5.3 Mensajes
function MensajeError(mensaje) {
  const container = document.createElement('div');     // 5.3.1
  container.className = 'error';

  const titulo = document.createElement('strong');     // 5.3.2
  titulo.textContent = 'Error';

  const texto = document.createElement('p');           // 5.3.3
  texto.textContent = mensaje;

  container.appendChild(titulo);                       // 5.3.4
  container.appendChild(texto);

  return container;                                    // 5.3.5
}

function MensajeExito(mensaje) {
  const container = document.createElement('div');     // 5.3.6
  container.className = 'success';

  const texto = document.createElement('p');           // 5.3.7
  texto.textContent = mensaje;

  container.appendChild(texto);                        // 5.3.8
  return container;
}

function EstadoVacio() {
  const container = document.createElement('div');
  container.className = 'estado-vacio';

  const texto = document.createElement('p');
  texto.textContent = 'No hay posts para mostrar';

  container.appendChild(texto);
  return container;
}

// 5.4 Funciones de renderizado
function renderizarPosts(posts, contenedor) {
  contenedor.innerHTML = '';
  if (posts.length === 0) {
    contenedor.appendChild(EstadoVacio());
    return;
  }
  posts.forEach(post => {
    contenedor.appendChild(PostCard(post));
  });
}

function mostrarCargando(contenedor) {
  contenedor.innerHTML = '';
  contenedor.appendChild(Spinner());
}

function mostrarMensajeTemporal(contenedor, elemento, duracion = 3000) {
  contenedor.innerHTML = '';
  contenedor.appendChild(elemento);
  contenedor.classList.remove('oculto');
  if (duracion > 0) {
    setTimeout(() => {
      contenedor.classList.add('oculto');
    }, duracion);
  }
}