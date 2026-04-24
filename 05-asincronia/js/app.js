'use strict';

/* =========================
   SIMULADOR DE PETICIONES
========================= */
const log       = document.getElementById('log');
const resultados = document.getElementById('resultados');

let tiempoSecuencial = 0;
let tiempoParalelo   = 0;

// 4.2 Simular petición con promesa
function simularPeticion(nombre, tiempoMin = 500, tiempoMax = 2000, fallar = false) {
  return new Promise((resolve, reject) => {
    const tiempoDelay =
      Math.floor(Math.random() * (tiempoMax - tiempoMin + 1)) + tiempoMin;
    setTimeout(() => {
      if (fallar) {
        reject(new Error(`Error al cargar ${nombre}`));
      } else {
        resolve({ nombre, tiempo: tiempoDelay, timestamp: new Date().toLocaleTimeString() });
      }
    }, tiempoDelay);
  });
}

// 4.3 Helpers
function formatearTiempo(ms) {
  return `${(ms / 1000).toFixed(2)}s`;
}

function mostrarLog(mensaje, tipo = 'info') {
  const item = document.createElement('div');
  item.className = `log-item log-${tipo}`;
  item.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
  log.appendChild(item);
  log.scrollTop = log.scrollHeight;
}

/* =========================
   PASO 5 - CARGA SECUENCIAL Y PARALELA
========================= */

// 5.1 Carga secuencial
async function cargarSecuencial() {
  mostrarLog('Iniciando carga secuencial...', 'info');
  resultados.classList.remove('visible');

  const inicio = performance.now();
  try {
    // 5.1.1 Cargar uno por uno con await
    const usuario = await simularPeticion('Usuario', 500, 1000);
    mostrarLog(`✓ ${usuario.nombre} cargado en ${formatearTiempo(usuario.tiempo)}`, 'success');

    // 5.1.2
    const posts = await simularPeticion('Posts', 700, 1500);
    mostrarLog(`✓ ${posts.nombre} cargados en ${formatearTiempo(posts.tiempo)}`, 'success');

    // 5.1.3
    const comentarios = await simularPeticion('Comentarios', 600, 1200);
    mostrarLog(`✓ ${comentarios.nombre} cargados en ${formatearTiempo(comentarios.tiempo)}`, 'success');

    const fin   = performance.now();
    const total = fin - inicio;
    tiempoSecuencial = total;
    mostrarLog(`Secuencial completado en ${formatearTiempo(total)}`, 'success');
    mostrarComparativa();
  } catch (error) {
    mostrarLog(`Error: ${error.message}`, 'error');
  }
}

// 5.2 Carga paralela
async function cargarParalelo() {
  mostrarLog('Iniciando carga paralela...', 'info');
  resultados.classList.remove('visible');

  const inicio = performance.now();
  try {
    // 5.2.1 Crear array de promesas SIN await
    const promesas = [
      simularPeticion('Usuario',     500, 1000),
      simularPeticion('Posts',       700, 1500),
      simularPeticion('Comentarios', 600, 1200)
    ];

    // 5.2.2 Esperar a TODAS simultáneamente
    const resultadosPromesas = await Promise.all(promesas);

    // 5.2.3 Mostrar cada resultado
    resultadosPromesas.forEach((resultado) => {
      mostrarLog(`✓ ${resultado.nombre} cargado en ${formatearTiempo(resultado.tiempo)}`, 'success');
    });

    const fin   = performance.now();
    const total = fin - inicio;
    tiempoParalelo = total;
    mostrarLog(`Paralelo completado en ${formatearTiempo(total)}`, 'success');
    mostrarComparativa();
  } catch (error) {
    mostrarLog(`Error: ${error.message}`, 'error');
  }
}

// 5.3 Comparativa y limpiar
function mostrarComparativa() {
  if (tiempoSecuencial > 0 && tiempoParalelo > 0) {
    const diferencia  = tiempoSecuencial - tiempoParalelo;
    const porcentaje  = ((diferencia / tiempoSecuencial) * 100).toFixed(1);
    resultados.innerHTML = `
      <h3>Comparativa de Rendimiento</h3>
      <p><strong>Carga Secuencial:</strong> ${formatearTiempo(tiempoSecuencial)}</p>
      <p><strong>Carga Paralela:</strong> ${formatearTiempo(tiempoParalelo)}</p>
      <p><strong>Diferencia:</strong> ${formatearTiempo(diferencia)} (${porcentaje}% más rápido)</p>
    `;
    resultados.classList.add('visible');
  }
}

function limpiarLog() {
  log.innerHTML = '';
  resultados.classList.remove('visible');
  tiempoSecuencial = 0;
  tiempoParalelo   = 0;
}

// Eventos sección 1
document.getElementById('btn-secuencial').addEventListener('click', cargarSecuencial);
document.getElementById('btn-paralelo').addEventListener('click', cargarParalelo);
document.getElementById('btn-limpiar').addEventListener('click', limpiarLog);

/* =========================
   PASO 6 - TEMPORIZADOR
========================= */
const inputTiempo  = document.getElementById('input-tiempo');
const display      = document.getElementById('display');
const barraProgreso = document.getElementById('barra-progreso');
const btnIniciar   = document.getElementById('btn-iniciar');
const btnDetener   = document.getElementById('btn-detener');
const btnReiniciar = document.getElementById('btn-reiniciar');

let intervaloId    = null;
let tiempoRestante = 0;
let tiempoInicial  = 0;

// 6.2 Formatear MM:SS
function formatearTiempoDisplay(segundos) {
  const mins = Math.floor(segundos / 60).toString().padStart(2, '0');
  const segs = (segundos % 60).toString().padStart(2, '0');
  return `${mins}:${segs}`;
}

// 6.3 Actualizar display y barra
function actualizarDisplay() {
  // 6.3.1
  display.textContent = formatearTiempoDisplay(tiempoRestante);

  if (tiempoInicial > 0) {
    // 6.3.2
    const porcentaje = ((tiempoInicial - tiempoRestante) / tiempoInicial) * 100;
    barraProgreso.style.width = `${porcentaje}%`;

    // 6.3.3
    if (tiempoRestante <= 10 && tiempoRestante > 0) {
      display.classList.add('alerta');
      barraProgreso.classList.add('alerta');
    } else {
      display.classList.remove('alerta');
      barraProgreso.classList.remove('alerta');
    }
  }
}

// 6.4 Iniciar
function iniciar() {
  // 6.4.1
  if (intervaloId) return;

  // 6.4.2
  const tiempo = parseInt(inputTiempo.value);
  if (isNaN(tiempo) || tiempo <= 0) {
    alert('Ingresa un tiempo válido');
    return;
  }

  // 6.4.3
  tiempoRestante      = tiempo;
  tiempoInicial       = tiempo;
  btnIniciar.disabled = true;
  btnDetener.disabled = false;
  inputTiempo.disabled = true;

  // 6.4.4
  actualizarDisplay();

  // 6.4.5
  intervaloId = setInterval(() => {
    tiempoRestante--;
    actualizarDisplay();

    if (tiempoRestante <= 0) {
      detener();
      display.classList.add('alerta');
      alert('¡Tiempo terminado!');
    }
  }, 1000);
}

// 6.5 Detener y reiniciar
function detener() {
  // 6.5.1
  if (intervaloId) {
    clearInterval(intervaloId);
    intervaloId         = null;
    btnIniciar.disabled = false;
    btnDetener.disabled = true;
    inputTiempo.disabled = false;
  }
}

function reiniciar() {
  // 6.5.2
  detener();

  // 6.5.3
  tiempoRestante  = 0;
  tiempoInicial   = 0;
  display.textContent       = '00:00';
  barraProgreso.style.width = '0%';
  display.classList.remove('alerta');
  barraProgreso.classList.remove('alerta');
}

// Eventos sección 2
btnIniciar.addEventListener('click', iniciar);
btnDetener.addEventListener('click', detener);
btnReiniciar.addEventListener('click', reiniciar);
btnDetener.disabled = true;

/* =========================
   PASO 7 - MANEJO DE ERRORES
========================= */
const logErrores = document.getElementById('log-errores');

function mostrarLogError(mensaje, tipo = 'info') {
  const item = document.createElement('div');
  item.className = `log-item log-${tipo}`;
  item.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
  logErrores.appendChild(item);
  logErrores.scrollTop = logErrores.scrollHeight;
}

// 7.2 Simular error con try/catch
async function simularError() {
  mostrarLogError('Intentando operación que fallará...', 'info');
  try {
    // 7.2.1
    await simularPeticion('API', 500, 1000, true);
    mostrarLogError('✓ Operación exitosa', 'success');
  } catch (error) {
    // 7.2.2
    mostrarLogError(`Error capturado: ${error.message}`, 'error');
    mostrarLogError('El error fue manejado correctamente con try/catch', 'info');
  }
}

// 7.3 Reintentos con backoff exponencial
async function fetchConReintentos(nombre, intentos = 3) {
  mostrarLogError(`Iniciando ${intentos} intentos para cargar ${nombre}...`, 'info');

  // 7.3.1
  for (let i = 0; i < intentos; i++) {
    try {
      mostrarLogError(`Intento ${i + 1}/${intentos}...`, 'info');

      const resultado = await simularPeticion(nombre, 500, 1000, Math.random() > 0.5);
      mostrarLogError(`✓ Éxito en intento ${i + 1}: ${nombre} cargado`, 'success');
      return resultado;
    } catch (error) {
      mostrarLogError(`Intento ${i + 1} falló: ${error.message}`, 'error');

      // 7.3.2 Backoff exponencial si no es el último intento
      if (i < intentos - 1) {
        const espera = Math.pow(2, i) * 500;
        mostrarLogError(`Esperando ${espera}ms antes del siguiente intento...`, 'warning');
        await new Promise(resolve => setTimeout(resolve, espera));
      }
    }
  }

  // 7.3.3 Todos los intentos fallaron
  mostrarLogError(`Todos los intentos fallaron para ${nombre}`, 'error');
  throw new Error(`No se pudo cargar ${nombre} después de ${intentos} intentos`);
}

// Eventos sección 3
document.getElementById('btn-error').addEventListener('click', simularError);
document.getElementById('btn-reintentos').addEventListener('click', () => {
  fetchConReintentos('Recurso', 3).catch(() => {
    mostrarLogError('Proceso de reintentos completado', 'info');
  });
});