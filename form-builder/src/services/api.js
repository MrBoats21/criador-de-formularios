export const api = {
    baseURL: 'http://localhost:3001/api',
    async get(endpoint) {
      const response = await fetch(this.baseURL + endpoint);
      return response.json();
    },
    async post(endpoint, data) {
      const response = await fetch(this.baseURL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    async put(endpoint, data) {
      const response = await fetch(this.baseURL + endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    async delete(endpoint) {
      const response = await fetch(this.baseURL + endpoint, {
        method: 'DELETE'
      });
      return response.json();
    }
  };