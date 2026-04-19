# Práctica 3 - Eventos y Manipulación del DOM

**Asignatura:** Programación y plataformas web
**Estudiante:** Mateo Orellana  
**Carrera:** Computación  
**Semestre:** 5° ciclo 
**Fecha:** 21 de Abril 2026  

---

## 1. Descripción de la solución

Esta práctica implementa una aplicación web interactiva con dos secciones
principales, desarrollada con HTML, CSS y JavaScript.

La primera sección es un **formulario de contacto** con validación en tiempo
real: cada campo se valida al perder el foco (`blur`), los errores se limpian
automáticamente al escribir (`input`/`change`), y el envío con `submit` verifica
todos los campos antes de procesar. Incluye un contador de caracteres para el
área de mensaje y un atajo de teclado (`Ctrl+Enter`) para enviar sin usar el ratón.

La segunda sección es un **sistema de tareas** que utiliza event delegation:
un único listener en el contenedor padre maneja todos los eventos de la lista,
permitiendo marcar tareas como completadas o eliminarlas. Las tareas se pueden
agregar con el botón o presionando `Enter`.

---

## 2. Estructura del proyecto

practica-03/
├── index.html              → Estructura HTML completa
├── css/
│   └── styles.css          → Estilos y diseño visual
├── js/
│   └── app.js              → Lógica de formulario, tareas y eventos
├── assets/
│   ├── 01-validacion.png
│   ├── 02-formulario-enviado.png
│   ├── 03-delegacion.png
│   ├── 04-contador.png
│   └── 05-completadas.png
└── README.md

---

## 3. Código destacado

### 3.1 Validación de formulario con `preventDefault()`

El evento `submit` intercepta el envío nativo del formulario con `preventDefault()`,
luego valida todos los campos y solo procesa si todos son correctos. Si hay errores,
hace `focus()` en el primer campo inválido para guiar al usuario.

```javascript
formulario.addEventListener('submit', (e) => {
  e.preventDefault(); // Evita recargar la página

  const nombreValido  = validarNombre();
  const emailValido   = validarEmail();
  const asuntoValido  = validarAsunto();
  const mensajeValido = validarMensaje();

  if (nombreValido && emailValido && asuntoValido && mensajeValido) {
    mostrarResultado();
    resetearFormulario();
    return;
  }

  // Focus en el primer campo inválido
  if (!nombreValido)  { inputNombre.focus();  return; }
  if (!emailValido)   { inputEmail.focus();   return; }
  if (!asuntoValido)  { selectAsunto.focus(); return; }
  textMensaje.focus();
});
```

La función `validarCampo()` centraliza la lógica visual de todos los validadores,
evitando repetir código. Agrega o quita clases `error` y `visible` según el resultado:

```javascript
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
```

---

### 3.2 Event delegation en la lista de tareas

En lugar de agregar un listener a cada botón individualmente, se coloca
**un único listener** en el `<ul>` padre. Cuando el usuario hace clic, se
identifica la acción con `dataset.action` y el elemento con `closest('li')`.
Esto es más eficiente y funciona también con tarjetas agregadas dinámicamente.

```javascript
listaTareas.addEventListener('click', (e) => {
  const action = e.target.dataset.action;

  if (!action) return; // No es un elemento interactivo

  const item = e.target.closest('li'); // Encuentra el <li> padre
  if (!item || !item.dataset.id) return;

  const id = Number(item.dataset.id);

  if (action === 'eliminar') {
    tareas = tareas.filter(t => t.id !== id);
    renderizarTareas();
    return;
  }

  if (action === 'toggle') {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
      tarea.completada = !tarea.completada; // Invierte el estado
      renderizarTareas();
    }
  }
});
```

---

### 3.3 Atajo de teclado con Ctrl+Enter

Se escucha el evento `keydown` en el `document` completo para capturar
cualquier combinación de teclas. La condición `e.ctrlKey && e.key === 'Enter'`
detecta la combinación exacta. Se usa `requestSubmit()` en lugar de `submit()`
porque este último no dispara los event listeners registrados.

```javascript
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    formulario.requestSubmit(); // Dispara el evento submit con sus listeners
  }
});
```

---

### 3.4 Contador de caracteres en tiempo real

El evento `input` del textarea actualiza el contador en cada pulsación.
Cuando se supera el 90% del límite (270/300 caracteres), el color cambia
a rojo como advertencia visual usando un operador ternario.

```javascript
function actualizarContador(e) {
  const longitud = e.target.value.length;
  charCount.textContent = longitud;
  charCount.style.color = longitud > 270 ? '#e74c3c' : '#999';
}

textMensaje.addEventListener('input', actualizarContador);
```

---

## 4. Capturas de pantalla

### 4.1 Validación en acción

Al intentar enviar el formulario con campos vacíos o incorrectos, se muestran
los mensajes de error en rojo debajo de cada campo.

![Validación en acción](assets/01-validacion.png)

---

### 4.2 Formulario procesado exitosamente

Cuando todos los campos son válidos, aparece un cuadro verde con los datos
ingresados y el formulario se limpia automáticamente.

![Formulario enviado](assets/02-formulario-enviado.png)

---

### 4.3 Event delegation en la lista de tareas

La lista muestra las tareas con sus botones de acción. Un único listener
en el contenedor maneja tanto el toggle como la eliminación de cualquier tarea.

![Event delegation](assets/03-delegacion.png)

---

### 4.4 Contador de tareas actualizado

El contador debajo de la lista se recalcula automáticamente al agregar,
eliminar o completar tareas, mostrando siempre las pendientes en tiempo real.

![Contador de tareas](assets/04-contador.png)

---

### 4.5 Tareas completadas

Al hacer clic sobre el texto de una tarea, su estado se invierte. Las tareas
completadas se muestran con texto tachado y color gris para diferenciarlas.

![Tareas completadas](assets/05-completadas.png)

---

## 5. Conclusiones

- El uso de `preventDefault()` en el evento `submit` permite controlar
  completamente el proceso de envío sin recargar la página.
- La función `validarCampo()` reutilizable elimina la duplicación de código
  en los cuatro validadores del formulario.
- El event delegation con un solo listener en el padre es más eficiente que
  agregar listeners individuales a cada elemento dinámico.
- `requestSubmit()` es preferible a `submit()` porque respeta los event
  listeners registrados, permitiendo que la validación funcione correctamente.
- El uso de `data-action` y `closest()` simplifica la identificación de
  elementos en estructuras de lista dinámicas.