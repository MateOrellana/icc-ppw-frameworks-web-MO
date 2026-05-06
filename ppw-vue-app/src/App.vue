<script setup lang="ts">
import { ref } from 'vue'

const saludo = ref<string>('Hola desde Vue 3')
const contador = ref<number>(0)
const nombreCurso = ref<string>('Programación y Plataformas Web')

function incrementar(): void {
  contador.value++
}

function decrementar(): void {
  if (contador.value > 0) contador.value--
}

function reiniciar(): void {
  contador.value = 0
}
</script>

<template>
  <div class="app">
    <header>
      <h1>PPW Vue App</h1>
      <p>Módulo 02 — Fundamentos</p>
    </header>

    <section class="seccion-info">
      <h2>Estado reactivo básico</h2>
      <p>Saludo: {{ saludo }}</p>
      <p>Contador: {{ contador }}</p>
      <p>Curso: {{ nombreCurso }}</p>

      <div class="controles">
        <button @click="decrementar">−</button>
        <span class="valor">{{ contador }}</span>
        <button @click="incrementar">+</button>
        <button @click="reiniciar">Reiniciar</button>
      </div>
    </section>

    <section class="seccion-expresiones">
      <h2>Expresiones en el template</h2>
      <p>Precio base: ${{ (29.99).toFixed(2) }}</p>
      <p>Con IVA (12%): ${{ (29.99 * 1.12).toFixed(2) }}</p>
      <p>El contador es {{ contador > 0 ? 'positivo' : 'cero' }}</p>
      <p>Curso en mayúsculas: {{ nombreCurso.toUpperCase() }}</p>
    </section>
  </div>
</template>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
}

header {
  border-bottom: 2px solid #42B883;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

h1 {
  color: #35495E;
}

.seccion-info {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 1.5rem;
}

.seccion-expresiones {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.controles {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.controles button {
  padding: 0.4rem 1rem;
  border: 1px solid #42B883;
  background: #42B883;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.controles button:hover {
  background: #35495E;
  border-color: #35495E;
}

.valor {
  font-size: 1.4rem;
  font-weight: bold;
  min-width: 2rem;
  text-align: center;
}
</style>