'use strict';

/* =========================
   API SERVICE
========================= */
const ApiService = {
  baseUrl: 'https://jsonplaceholder.typicode.com',

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      if (response.status === 204) return null;
      return await response.json();
    } catch (error) {
      console.error('Error en petición:', error);
      throw error;
    }
  },

  // 4.2 GET
  async getPosts(limit = 10) {
    return this.request(`/posts?_limit=${limit}`);           // 4.2.1
  },

  async getPostById(id) {
    return this.request(`/posts/${id}`);                     // 4.2.2
  },

  // 4.3 POST
  async createPost(postData) {
    return this.request('/posts', {                          // 4.3.1
      method: 'POST',
      body: JSON.stringify(postData)
    });
  },

  // 4.4 PUT y DELETE
  async updatePost(id, postData) {
    return this.request(`/posts/${id}`, {                   // 4.4.1
      method: 'PUT',
      body: JSON.stringify(postData)
    });
  },

  async deletePost(id) {
    return this.request(`/posts/${id}`, {                   // 4.4.2
      method: 'DELETE'
    });
  },

  async getPostsByUser(userId) {
    return this.request(`/posts?userId=${userId}`);
  }
};