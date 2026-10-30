"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const tokenKey = "pestalozzi_token";
  let authToken = localStorage.getItem(tokenKey);

  // Elementos DOM
  const alertBox = document.getElementById("admin-alert");
  const loginSection = document.getElementById("login-section");
  const dashboardSection = document.getElementById("dashboard-section");
  const btnLogout = document.getElementById("btn-logout");
  const loginForm = document.getElementById("login-form");
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  function showAlert(message, isError = false) {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = "alert " + (isError ? "alert-error" : "alert-success");
    alertBox.style.display = "block";
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 4500);
  }

  // Comprobar sesión
  async function checkAuth() {
    if (!authToken) {
      showLogin();
      return;
    }

    try {
      await PestalozziAPI.verifyToken(authToken);
      showDashboard();
    } catch (err) {
      logout();
    }
  }

  function showLogin() {
    loginSection.style.display = "block";
    dashboardSection.style.display = "none";
    btnLogout.style.display = "none";
  }

  function showDashboard() {
    loginSection.style.display = "none";
    dashboardSection.style.display = "block";
    btnLogout.style.display = "inline-flex";

    loadHorarios();
    loadVisitas();
    loadNovedades();
  }

  function logout() {
    localStorage.removeItem(tokenKey);
    authToken = null;
    showLogin();
    showAlert("Sesión cerrada.");
  }

  btnLogout.addEventListener("click", logout);

  // Manejo de Tabs
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const targetId = btn.getAttribute("data-tab");
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add("active");
    });
  });

  // Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;

    try {
      const res = await PestalozziAPI.login(user, pass);
      authToken = res.token;
      localStorage.setItem(tokenKey, authToken);
      showAlert("Bienvenida Betsabé. Sesión iniciada.");
      loginForm.reset();
      showDashboard();
    } catch (err) {
      showAlert(err.message || "Usuario o contraseña incorrectos.", true);
    }
  });

  /* ------------------------------------------------------------------------
     1. Pestaña Horarios
     ------------------------------------------------------------------------ */
  const horariosContainer = document.getElementById("horarios-editor-container");
  const horariosForm = document.getElementById("horarios-form");

  async function loadHorarios() {
    if (!horariosContainer) return;
    try {
      const res = await PestalozziAPI.getHorarios();
      const horarios = res.data || [];
      horariosContainer.innerHTML = "";

      horarios.forEach((h) => {
        const row = document.createElement("div");
        row.className = "dia-row";
        row.innerHTML = `
          <div class="dia-nombre">${h.dia_nombre}</div>
          <label class="dia-switch">
            <input type="checkbox" name="activo_${h.dia_orden}" ${h.activo ? "checked" : ""}>
            <span>${h.activo ? "Abierto" : "Cerrado"}</span>
          </label>
          <div>
            <input type="text"
                   name="horario_${h.dia_orden}"
                   class="form-control"
                   placeholder="Ej: 16:00 – 18:00 hs"
                   value="${h.horario_texto || ""}"
                   ${!h.activo ? "disabled" : ""}>
          </div>
        `;

        const checkbox = row.querySelector(`input[name="activo_${h.dia_orden}"]`);
        const textInput = row.querySelector(`input[name="horario_${h.dia_orden}"]`);
        const statusSpan = row.querySelector(".dia-switch span");

        checkbox.addEventListener("change", () => {
          textInput.disabled = !checkbox.checked;
          statusSpan.textContent = checkbox.checked ? "Abierto" : "Cerrado";
          if (checkbox.checked && !textInput.value) {
            textInput.value = "16:00 – 18:00";
          }
        });

        horariosContainer.appendChild(row);
      });
    } catch (err) {
      horariosContainer.innerHTML = "<p style='color: red;'>Error al cargar horarios.</p>";
    }
  }

  horariosForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const rows = horariosContainer.querySelectorAll(".dia-row");
    const payload = [];

    rows.forEach((row, index) => {
      const diaOrden = index + 1;
      const checkbox = row.querySelector(`input[name="activo_${diaOrden}"]`);
      const textInput = row.querySelector(`input[name="horario_${diaOrden}"]`);

      payload.push({
        dia_orden: diaOrden,
        activo: checkbox.checked ? 1 : 0,
        horario_texto: checkbox.checked ? textInput.value.trim() : "Cerrado"
      });
    });

    try {
      await PestalozziAPI.updateHorarios(authToken, payload);
      showAlert("Cartelera de horarios guardada exitosamente.");
    } catch (err) {
      showAlert("Error al guardar horarios: " + err.message, true);
    }
  });

  /* ------------------------------------------------------------------------
     2. Pestaña Visitas Escolares
     ------------------------------------------------------------------------ */
  const visitasTableBody = document.getElementById("visitas-table-body");
  const filtroVisitas = document.getElementById("filtro-estado-visitas");
  const badgeCountVisitas = document.getElementById("count-visitas-badge");

  async function loadVisitas() {
    if (!visitasTableBody) return;
    const estado = filtroVisitas ? filtroVisitas.value : "";

    try {
      const res = await PestalozziAPI.getVisitasAdmin(authToken, estado);
      const visitas = res.data || [];

      if (badgeCountVisitas) {
        badgeCountVisitas.textContent = visitas.length;
      }

      if (visitas.length === 0) {
        visitasTableBody.innerHTML = `
          <tr><td colspan="8" style="text-align: center; color: var(--color-text-muted); padding: 2rem;">No hay solicitudes de visitas escolares registradas.</td></tr>
        `;
        return;
      }

      visitasTableBody.innerHTML = "";

      visitas.forEach((v) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${v.fecha_preferida}</strong></td>
          <td>${v.institucion}</td>
          <td>${v.responsable} (${v.nivel})</td>
          <td>
            <a href="mailto:${v.email}">${v.email}</a><br>
            <small>${v.telefono}</small>
          </td>
          <td>${v.alumnos_cant}</td>
          <td>${v.turno}</td>
          <td>
            <span class="badge badge-${v.estado}">${v.estado}</span>
          </td>
          <td>
            <select class="form-control change-estado" data-id="${v.id}" style="padding: 0.25rem 0.4rem; font-size: 0.8rem;">
              <option value="pendiente" ${v.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
              <option value="confirmada" ${v.estado === "confirmada" ? "selected" : ""}>Confirmar</option>
              <option value="realizada" ${v.estado === "realizada" ? "selected" : ""}>Realizada</option>
              <option value="rechazada" ${v.estado === "rechazada" ? "selected" : ""}>Rechazar</option>
            </select>
          </td>
        `;

        const selectEstado = tr.querySelector(".change-estado");
        selectEstado.addEventListener("change", async (e) => {
          const nuevoEstado = e.target.value;
          try {
            await PestalozziAPI.updateVisitaEstado(authToken, v.id, nuevoEstado);
            showAlert(`Visita de "${v.institucion}" marcada como ${nuevoEstado}.`);
            loadVisitas();
          } catch (err) {
            showAlert("Error al actualizar estado: " + err.message, true);
          }
        });

        visitasTableBody.appendChild(tr);
      });
    } catch (err) {
      visitasTableBody.innerHTML = `<tr><td colspan="8" style="color: red;">Error al cargar visitas.</td></tr>`;
    }
  }

  if (filtroVisitas) {
    filtroVisitas.addEventListener("change", loadVisitas);
  }

  /* ------------------------------------------------------------------------
     3. Pestaña Novedades
     ------------------------------------------------------------------------ */
  const novedadForm = document.getElementById("novedad-form");
  const novedadesContainer = document.getElementById("novedades-list-container");

  async function loadNovedades() {
    if (!novedadesContainer) return;
    try {
      const res = await PestalozziAPI.getNovedadesAdmin(authToken);
      const novedades = res.data || [];

      if (novedades.length === 0) {
        novedadesContainer.innerHTML = "<p>No hay novedades registradas.</p>";
        return;
      }

      novedadesContainer.innerHTML = "";

      novedades.forEach((n) => {
        const item = document.createElement("div");
        item.className = "novedad-item";
        item.innerHTML = `
          <div>
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.35rem;">
              <span class="badge" style="background-color: ${n.categoria_color}; color: #fff;">${n.categoria}</span>
              <small style="color: var(--color-text-muted);">${n.fecha_texto}</small>
            </div>
            <h4 style="font-size: 1.05rem; color: var(--color-primary);">${n.titulo}</h4>
            <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-top: 0.25rem;">${n.descripcion}</p>
          </div>
          <div>
            <button class="btn btn-danger btn-sm btn-del-novedad" data-id="${n.id}">Eliminar</button>
          </div>
        `;

        item.querySelector(".btn-del-novedad").addEventListener("click", async () => {
          if (confirm(`¿Seguro que deseás eliminar "${n.titulo}"?`)) {
            try {
              await PestalozziAPI.deleteNovedad(authToken, n.id);
              showAlert("Novedad eliminada.");
              loadNovedades();
            } catch (err) {
              showAlert("Error al eliminar novedad: " + err.message, true);
            }
          }
        });

        novedadesContainer.appendChild(item);
      });
    } catch (err) {
      novedadesContainer.innerHTML = "<p style='color: red;'>Error al cargar novedades.</p>";
    }
  }

  if (novedadForm) {
    novedadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        categoria: document.getElementById("nov-categoria").value.trim(),
        categoria_color: document.getElementById("nov-color").value,
        fecha_texto: document.getElementById("nov-fecha").value.trim(),
        titulo: document.getElementById("nov-titulo").value.trim(),
        descripcion: document.getElementById("nov-desc").value.trim()
      };

      try {
        await PestalozziAPI.crearNovedad(authToken, payload);
        showAlert("¡Novedad agregada exitosamente!");
        novedadForm.reset();
        loadNovedades();
      } catch (err) {
        showAlert("Error al crear novedad: " + err.message, true);
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. Pestaña Seguridad
     ------------------------------------------------------------------------ */
  const passwordForm = document.getElementById("password-form");

  if (passwordForm) {
    passwordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const actual = document.getElementById("pass-actual").value;
      const nueva = document.getElementById("pass-nueva").value;
      const confirmar = document.getElementById("pass-confirmar").value;

      if (nueva !== confirmar) {
        showAlert("Las contraseñas nuevas no coinciden.", true);
        return;
      }

      try {
        await PestalozziAPI.updatePassword(authToken, actual, nueva);
        showAlert("Contraseña cambiada exitosamente.");
        passwordForm.reset();
      } catch (err) {
        showAlert("Error al cambiar contraseña: " + err.message, true);
      }
    });
  }

  // Comprobación inicial de token
  checkAuth();
});
