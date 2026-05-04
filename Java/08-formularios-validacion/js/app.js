'use strict';

/* =========================
   SELECCIÓN DE ELEMENTOS
========================= */
const form           = document.getElementById('form-registro');
const mensajeGlobal  = document.getElementById('mensaje-global');
const inputPassword  = document.getElementById('password');
const inputTelefono  = document.getElementById('telefono');
const STORAGE_KEY    = 'form_registro_borrador';

/* =========================
   FUNCIONALIDAD EXTRA 1:
   MÁSCARA DE TELÉFONO
========================= */
inputTelefono.addEventListener('input', () => {
  // Solo permite dígitos
  inputTelefono.value = inputTelefono.value.replace(/\D/g, '').slice(0, 10);
});

/* =========================
   FUNCIONALIDAD EXTRA 2:
   AUTOGUARDADO EN sessionStorage
========================= */
function autoguardar() {
  const datos = {
    nombre:          document.getElementById('nombre').value,
    email:           document.getElementById('email').value,
    telefono:        document.getElementById('telefono').value,
    fechaNacimiento: document.getElementById('fecha-nacimiento').value,
    genero:          document.getElementById('genero').value
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
}

function restaurarBorrador() {
  const guardado = sessionStorage.getItem(STORAGE_KEY);
  if (!guardado) return;

  const datos = JSON.parse(guardado);
  if (datos.nombre)          document.getElementById('nombre').value          = datos.nombre;
  if (datos.email)           document.getElementById('email').value           = datos.email;
  if (datos.telefono)        document.getElementById('telefono').value        = datos.telefono;
  if (datos.fechaNacimiento) document.getElementById('fecha-nacimiento').value = datos.fechaNacimiento;
  if (datos.genero)          document.getElementById('genero').value          = datos.genero;
}

/* =========================
   MOSTRAR OJO EN CONTRASEÑA
========================= */
document.querySelectorAll('.btn-toggle-pass').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input    = document.getElementById(targetId);
    if (input.type === 'password') {
      input.type    = 'text';
      btn.textContent = '🙈';
    } else {
      input.type    = 'password';
      btn.textContent = '👁';
    }
  });
});

/* =========================
   INDICADOR DE FUERZA
========================= */
inputPassword.addEventListener('input', () => {
  actualizarFuerza(inputPassword.value);
});

/* =========================
   VALIDACIÓN EN TIEMPO REAL
========================= */

// Validar al perder foco
form.addEventListener('focusout', (e) => {
  const campo = e.target;
  if (campo.tagName === 'INPUT' || campo.tagName === 'SELECT') {
    if (campo.type !== 'hidden') {
      validarCampo(campo);
    }
  }
});

// Limpiar error al empezar a escribir
form.addEventListener('input', (e) => {
  const campo = e.target;
  if (campo.tagName === 'INPUT' || campo.tagName === 'SELECT') {
    if (campo.type !== 'hidden' && campo.type !== 'checkbox') {
      limpiarErrorCampo(campo);
    }
    // Autoguardar al escribir
    autoguardar();
  }
});

// Limpiar error en select al cambiar
form.addEventListener('change', (e) => {
  const campo = e.target;
  if (campo.tagName === 'SELECT') {
    limpiarErrorCampo(campo);
    autoguardar();
  }
  // Validar checkbox inmediatamente al hacer clic
  if (campo.type === 'checkbox') {
    validarCampo(campo);
  }
});

/* =========================
   MOSTRAR MENSAJE GLOBAL
========================= */
function mostrarMensaje(texto, tipo) {
  mensajeGlobal.textContent = texto;
  mensajeGlobal.className   = `mensaje-global ${tipo}`;

  setTimeout(() => {
    mensajeGlobal.className = 'mensaje-global oculto';
  }, 5000);
}

/* =========================
   ENVÍO DEL FORMULARIO
========================= */
form.addEventListener('submit', (e) => {
  e.preventDefault();                              // Paso 5.1

  const esValido = validarFormulario(form);        // Paso 5.2

  if (!esValido) {
    mostrarMensaje('⚠️ Corrige los errores antes de continuar.', 'error');

    // Hacer scroll al primer campo inválido
    const primerError = form.querySelector('.invalido');
    if (primerError) primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Paso 5.3 - Recopilar datos con FormData
  const formData = new FormData(form);
  const datos    = Object.fromEntries(formData);

  // Manejar checkbox manualmente (FormData no lo incluye si no está marcado)
  datos.terminos = form.querySelector('[name="terminos"]').checked;

  // Eliminar campo sensible del log
  const datosLog = { ...datos };
  delete datosLog.password;
  delete datosLog.confirmarPassword;

  console.log('📋 Datos del formulario:', datosLog);

  // Paso 5.4 - Mostrar mensaje de éxito
  mostrarMensaje('✅ ¡Cuenta creada exitosamente! Bienvenido.', 'exito');

  // Paso 5.5 - Resetear formulario
  form.reset();
  actualizarFuerza('');

  // Limpiar estados visuales
  form.querySelectorAll('input, select').forEach(campo => {
    campo.classList.remove('valido', 'invalido');
  });
  form.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

  // Limpiar borrador
  sessionStorage.removeItem(STORAGE_KEY);

  // Scroll al mensaje
  mensajeGlobal.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

/* =========================
   INICIALIZACIÓN
========================= */
restaurarBorrador();