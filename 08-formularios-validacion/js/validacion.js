'use strict';

/* =========================
   EXPRESIONES REGULARES
========================= */
const REGEX = {
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefono: /^\d{10}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  nombre:   /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/
};

/* =========================
   VALIDAR CAMPO INDIVIDUAL
========================= */
function validarCampo(campo) {
  const id    = campo.id;
  const valor = campo.value.trim();
  let error   = '';

  switch (id) {

    case 'nombre':
      if (!valor) {
        error = 'El nombre es obligatorio.';
      } else if (valor.length < 3) {
        error = 'El nombre debe tener al menos 3 caracteres.';
      } else if (!REGEX.nombre.test(valor)) {
        error = 'El nombre solo puede contener letras y espacios.';
      }
      break;

    case 'email':
      if (!valor) {
        error = 'El correo electrónico es obligatorio.';
      } else if (!REGEX.email.test(valor)) {
        error = 'Ingresa un correo electrónico válido (ej: tu@email.com).';
      }
      break;

    case 'telefono':
      if (!valor) {
        error = 'El teléfono es obligatorio.';
      } else if (!REGEX.telefono.test(valor)) {
        error = 'El teléfono debe tener exactamente 10 dígitos numéricos.';
      }
      break;

    case 'fecha-nacimiento':
      if (!valor) {
        error = 'La fecha de nacimiento es obligatoria.';
      } else {
        const hoy      = new Date();
        const nacido   = new Date(valor);
        const edad     = hoy.getFullYear() - nacido.getFullYear();
        const cumple   = new Date(hoy.getFullYear(), nacido.getMonth(), nacido.getDate());
        const edadReal = cumple <= hoy ? edad : edad - 1;
        if (edadReal < 18) {
          error = 'Debes ser mayor de 18 años para registrarte.';
        }
      }
      break;

    case 'genero':
      if (!valor) {
        error = 'Selecciona una opción de género.';
      }
      break;

    case 'password':
      if (!valor) {
        error = 'La contraseña es obligatoria.';
      } else if (valor.length < 8) {
        error = 'La contraseña debe tener al menos 8 caracteres.';
      } else if (!/[A-Z]/.test(valor)) {
        error = 'La contraseña debe contener al menos una letra mayúscula.';
      } else if (!/[a-z]/.test(valor)) {
        error = 'La contraseña debe contener al menos una letra minúscula.';
      } else if (!/\d/.test(valor)) {
        error = 'La contraseña debe contener al menos un número.';
      }
      break;

    case 'confirmar-password': {
      const pass = document.getElementById('password').value;
      if (!valor) {
        error = 'Debes confirmar tu contraseña.';
      } else if (valor !== pass) {
        error = 'Las contraseñas no coinciden.';
      }
      break;
    }

    case 'terminos':
      if (!campo.checked) {
        error = 'Debes aceptar los términos y condiciones.';
      }
      break;
  }

  // Aplicar estado visual
  mostrarEstadoCampo(campo, error);
  return error === '';
}

/* =========================
   MOSTRAR ESTADO VISUAL
========================= */
function mostrarEstadoCampo(campo, error) {
  const errorEl = document.getElementById(`error-${campo.id}`);

  if (error) {
    campo.classList.remove('valido');
    campo.classList.add('invalido');
    if (errorEl) errorEl.textContent = error;
  } else {
    campo.classList.remove('invalido');
    // No marcar verde el checkbox
    if (campo.type !== 'checkbox') campo.classList.add('valido');
    if (errorEl) errorEl.textContent = '';
  }
}

/* =========================
   LIMPIAR ERROR DE CAMPO
========================= */
function limpiarErrorCampo(campo) {
  campo.classList.remove('invalido', 'valido');
  const errorEl = document.getElementById(`error-${campo.id}`);
  if (errorEl) errorEl.textContent = '';
}

/* =========================
   VALIDAR FORMULARIO COMPLETO
========================= */
function validarFormulario(form) {
  const campos = form.querySelectorAll('input, select');
  let esValido = true;

  campos.forEach(campo => {
    // Saltar campos ocultos
    if (campo.type === 'hidden') return;
    const resultado = validarCampo(campo);
    if (!resultado) esValido = false;
  });

  return esValido;
}

/* =========================
   INDICADOR DE FUERZA
========================= */
function calcularFuerza(password) {
  let puntos = 0;

  if (password.length >= 8)              puntos++;
  if (password.length >= 12)             puntos++;
  if (/[A-Z]/.test(password))           puntos++;
  if (/[a-z]/.test(password))           puntos++;
  if (/\d/.test(password))              puntos++;
  if (/[^a-zA-Z0-9]/.test(password))   puntos++;

  if (puntos <= 1) return { nivel: 'debil',   texto: 'Muy débil',  clase: 'debil'   };
  if (puntos <= 3) return { nivel: 'regular', texto: 'Regular',    clase: 'regular' };
  if (puntos <= 4) return { nivel: 'buena',   texto: 'Buena',      clase: 'buena'   };
  return            { nivel: 'fuerte',  texto: 'Fuerte',     clase: 'fuerte'  };
}

function actualizarFuerza(password) {
  const fill  = document.getElementById('fuerza-fill');
  const texto = document.getElementById('fuerza-texto');

  if (!password) {
    fill.className      = 'fuerza-fill';
    fill.style.width    = '0%';
    texto.textContent   = 'Sin contraseña';
    texto.className     = 'fuerza-texto';
    return;
  }

  const { clase, texto: label } = calcularFuerza(password);
  fill.className    = `fuerza-fill ${clase}`;
  texto.textContent = label;
  texto.className   = `fuerza-texto ${clase}`;
}