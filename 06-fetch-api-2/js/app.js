'use strict';

/* =========================
   API SERVICE
========================= */

const ApiService = {
  baseUrl: 'https://jsonplaceholder.typicode.com',

  /**
   * Método genérico para hacer peticiones HTTP
   * @param {string} endpoint - Ruta del endpoint (ej: '/posts')
   * @param {object} options - Opciones de fetch (method, body, headers)
   * @returns {Promise} - Promesa con los datos parseados
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    // Configuración por defecto
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);

      // fetch NO lanza error en 4xx/5xx - debemos verificar response.ok
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      // Si es 204 No Content, no hay body que parsear
      if (response.status === 204) {
        return null;
      }

      return await response.json();

    } catch (error) {
      console.error('Error en petición:', error);
      throw error;
    }
  },

    /**
   * GET - Obtener todos los posts (con límite opcional)
   */
  async getPosts(limit = 10) {
    // TODO 4.2.1: Retornar el resultado de llamar a this.request() con el endpoint correcto
    //   return this.request(`/posts?_limit=${limit}`);
  },

  /**
   * GET - Obtener un post por ID
   */
  async getPostById(id) {
    // TODO 4.2.2: Retornar el resultado de llamar a this.request() con /posts/{id}
    //   return this.request(`/posts/${id}`);
  },

    /**
   * POST - Crear un nuevo post
   */
  async createPost(postData) {
    // TODO 4.3.1: Retornar el resultado de llamar a this.request() con:
    //   - endpoint: '/posts'
    //   - options: { method: 'POST', body: JSON.stringify(postData) }
    //   return this.request('/posts', {
    //     method: 'POST',
    //     body: JSON.stringify(postData)
    //   });
  },

    /**
   * PUT - Actualizar un post completo
   */
  async updatePost(id, postData) {
    // TODO 4.4.1: Retornar el resultado de llamar a this.request() con:
    //   - endpoint: `/posts/${id}`
    //   - options: { method: 'PUT', body: JSON.stringify(postData) }
    //   return this.request(`/posts/${id}`, {
    //     method: 'PUT',
    //     body: JSON.stringify(postData)
    //   });
  },

  /**
   * DELETE - Eliminar un post
   */
  async deletePost(id) {
    // TODO 4.4.2: Retornar el resultado de llamar a this.request() con:
    //   - endpoint: `/posts/${id}`
    //   - options: { method: 'DELETE' }
    //   return this.request(`/posts/${id}`, {
    //     method: 'DELETE'
    //   });
  },

  /**
   * GET - Buscar posts por userId
   */
  async getPostsByUser(userId) {
    return this.request(`/posts?userId=${userId}`);
  }
};

