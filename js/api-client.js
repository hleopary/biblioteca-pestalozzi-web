"use strict";

/**
 * Cliente HTTP modular para interactuar con la API REST de la Biblioteca Pestalozzi.
 * Determina dinámicamente el endpoint base según el entorno (mismo origen o puerto 3000).
 */
const PestalozziAPI = (function () {
  let baseUrl = "/api";

  // Si se abre vía file:// o un live-server en otro puerto (ej: 5500, 8080), apuntar al puerto 3000
  if (
    typeof window !== "undefined" &&
    (window.location.protocol === "file:" ||
      (window.location.port !== "3000" && window.location.port !== ""))
  ) {
    baseUrl = "http://localhost:3000/api";
  }

  async function request(endpoint, options = {}) {
    const url = `${baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (err) {
      console.warn(`[API Error] ${endpoint}:`, err.message);
      throw err;
    }
  }

  return {
    getBaseUrl: () => baseUrl,
    setBaseUrl: (url) => { baseUrl = url; },

    // Endpoints Públicos
    async getHorarios() {
      return request("/horarios", { method: "GET" });
    },

    async getNovedades() {
      return request("/novedades", { method: "GET" });
    },

    async enviarVisita(datos) {
      return request("/visitas", {
        method: "POST",
        body: JSON.stringify(datos)
      });
    },

    // Autenticación Admin
    async login(username, password) {
      return request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });
    },

    async verifyToken(token) {
      return request("/auth/verify", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
    },

    async updatePassword(token, currentPassword, newPassword) {
      return request("/auth/password", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword })
      });
    },

    // Administración de Horarios
    async updateHorarios(token, horarios) {
      return request("/horarios", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ horarios })
      });
    },

    // Administración de Visitas
    async getVisitasAdmin(token, estado = "") {
      const qs = estado ? `?estado=${encodeURIComponent(estado)}` : "";
      return request(`/visitas${qs}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
    },

    async updateVisitaEstado(token, id, estado) {
      return request(`/visitas/${id}/estado`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ estado })
      });
    },

    async deleteVisita(token, id) {
      return request(`/visitas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
    },

    // Administración de Novedades
    async getNovedadesAdmin(token) {
      return request("/novedades/admin", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
    },

    async crearNovedad(token, novedad) {
      return request("/novedades", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(novedad)
      });
    },

    async updateNovedad(token, id, novedad) {
      return request(`/novedades/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(novedad)
      });
    },

    async deleteNovedad(token, id) {
      return request(`/novedades/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = PestalozziAPI;
}
