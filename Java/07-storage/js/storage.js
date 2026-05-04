'use strict';

/* =========================
   SERVICIO DE STORAGE
========================= */
const TareaStorage = {
  CLAVE: 'tareas_lista',

  // Leer todas
  getAll() {
    try {
      const datos = localStorage.getItem(this.CLAVE);
      if (!datos) return [];
      return JSON.parse(datos);
    } catch (error) {
      console.error('Error al leer tareas:', error);
      return [];
    }
  },

  // Guardar array completo
  guardar(tareas) {
    try {
      localStorage.setItem(this.CLAVE, JSON.stringify(tareas));
    } catch (error) {
      console.error('Error al guardar tareas:', error);
    }
  },

  // 4.2.1 Crear nueva tarea
  crear(texto) {
    const tareas = this.getAll();                    // 4.2.1.1

    const nueva = {                                  // 4.2.1.2
      id:         Date.now(),
      texto:      texto.trim(),
      completada: false
    };

    tareas.push(nueva);                              // 4.2.1.3
    this.guardar(tareas);                            // 4.2.1.4
    return nueva;                                    // 4.2.1.5
  },

  // 4.2.2 Alternar completada
  toggleCompletada(id) {
    const tareas = this.getAll();                    // 4.2.2.1
    const tarea  = tareas.find(t => t.id === id);   // 4.2.2.2
    if (tarea) {
      tarea.completada = !tarea.completada;          // 4.2.2.3
    }
    this.guardar(tareas);                            // 4.2.2.4
  },

  // 4.2.3 Eliminar tarea
  eliminar(id) {
    const tareas   = this.getAll();                  // 4.2.3.1
    const filtradas = tareas.filter(t => t.id !== id); // 4.2.3.2
    this.guardar(filtradas);                         // 4.2.3.3
  },

  // 4.2.4 Limpiar todo
  limpiarTodo() {
    localStorage.removeItem(this.CLAVE);             // 4.2.4.1
  }
};

/* =========================
   SERVICIO DE TEMA
========================= */
const TemaStorage = {
  CLAVE: 'tema_app',

  getTema() {
    return localStorage.getItem(this.CLAVE) || 'claro';
  },

  setTema(tema) {
    localStorage.setItem(this.CLAVE, tema);
  }
};