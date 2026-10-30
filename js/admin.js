"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const tokenKey = "pestalozzi_token";
  const localNotasKey = "pestalozzi_notas_backup";
  let authToken = localStorage.getItem(tokenKey);
  let currentUser = null;
  let allVisitas = []; // Almacena visitas para filtrado y búsqueda local

  // Elementos DOM
  const alertBox = document.getElementById("admin-alert");
  const loginSection = document.getElementById("login-section");
  const dashboardSection = document.getElementById("dashboard-section");
  const btnLogout = document.getElementById("btn-logout");
  const btnPerfil = document.getElementById("btn-perfil");
  const loginForm = document.getElementById("login-form");
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  // Modales
  const modalPerfil = document.getElementById("modal-perfil");
  const btnCloseModalPerfil = document.getElementById("btn-close-modal-perfil");
  const btnCancelarPerfil = document.getElementById("btn-cancelar-perfil");
  const modalVisita = document.getElementById("modal-visita-detalle");
  const btnCloseModalVisita = document.getElementById("btn-close-modal-visita");
  const btnCerrarDetalle = document.getElementById("btn-cerrar-detalle");

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
      const res = await PestalozziAPI.verifyToken(authToken);
      currentUser = res.usuario;
      showDashboard();
    } catch (err) {
      logout();
    }
  }

  function showLogin() {
    loginSection.style.display = "block";
    dashboardSection.style.display = "none";
    btnLogout.style.display = "none";
    if (btnPerfil) btnPerfil.style.display = "none";
  }

  function showDashboard() {
    loginSection.style.display = "none";
    dashboardSection.style.display = "block";
    btnLogout.style.display = "inline-flex";
    if (btnPerfil) btnPerfil.style.display = "inline-flex";

    loadHorarios();
    loadVisitas();
    loadNovedades();
    loadNotas();
  }

  function logout() {
    localStorage.removeItem(tokenKey);
    authToken = null;
    currentUser = null;
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
      currentUser = res.usuario;
      localStorage.setItem(tokenKey, authToken);
      showAlert("Bienvenida Betsabé. Sesión iniciada.");
      loginForm.reset();
      showDashboard();
    } catch (err) {
      showAlert(err.message || "Usuario o contraseña incorrectos.", true);
    }
  });

  /* ------------------------------------------------------------------------
     Modal de Perfil y Cambio de Contraseña (desde el Navbar)
     ------------------------------------------------------------------------ */
  function openModalPerfil() {
    if (!modalPerfil) return;
    if (currentUser) {
      const uEl = document.getElementById("perfil-usuario");
      const nEl = document.getElementById("perfil-nombre");
      const eEl = document.getElementById("perfil-email");
      if (uEl) uEl.textContent = currentUser.username || "betsabe";
      if (nEl) nEl.textContent = currentUser.nombre || "Betsabé Cruz";
      if (eEl) eEl.textContent = currentUser.email || "bibliotecapestalozzi.berisso@gmail.com";
    }
    modalPerfil.classList.add("is-open");
  }

  function closeModalPerfil() {
    if (!modalPerfil) return;
    modalPerfil.classList.remove("is-open");
    const form = document.getElementById("password-form");
    if (form) form.reset();
  }

  if (btnPerfil) btnPerfil.addEventListener("click", openModalPerfil);
  if (btnCloseModalPerfil) btnCloseModalPerfil.addEventListener("click", closeModalPerfil);
  if (btnCancelarPerfil) btnCancelarPerfil.addEventListener("click", closeModalPerfil);
  if (modalPerfil) {
    modalPerfil.addEventListener("click", (e) => {
      if (e.target === modalPerfil) closeModalPerfil();
    });
  }

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
        closeModalPerfil();
      } catch (err) {
        showAlert("Error al cambiar contraseña: " + err.message, true);
      }
    });
  }

  /* ------------------------------------------------------------------------
     1. Pestaña Horarios Cuatrimestrales
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
     2. Pestaña Visitas Escolares (Optimizada y Espaciosa)
     ------------------------------------------------------------------------ */
  const visitasTableBody = document.getElementById("visitas-table-body");
  const filtroVisitas = document.getElementById("filtro-estado-visitas");
  const busquedaVisitas = document.getElementById("busqueda-visitas");
  const badgeCountVisitas = document.getElementById("count-visitas-badge");

  async function loadVisitas() {
    if (!visitasTableBody) return;

    try {
      const res = await PestalozziAPI.getVisitasAdmin(authToken);
      allVisitas = res.data || [];

      if (badgeCountVisitas) {
        badgeCountVisitas.textContent = allVisitas.length;
      }

      renderVisitas();
    } catch (err) {
      visitasTableBody.innerHTML = `<tr><td colspan="8" style="color: red; text-align: center; padding: 2rem;">Error al cargar visitas.</td></tr>`;
    }
  }

  function renderVisitas() {
    if (!visitasTableBody) return;
    const estadoFiltro = filtroVisitas ? filtroVisitas.value : "";
    const textoBusqueda = busquedaVisitas ? busquedaVisitas.value.trim().toLowerCase() : "";

    const filtradas = allVisitas.filter((v) => {
      const matchEstado = !estadoFiltro || v.estado === estadoFiltro;
      const matchTexto =
        !textoBusqueda ||
        (v.institucion && v.institucion.toLowerCase().includes(textoBusqueda)) ||
        (v.responsable && v.responsable.toLowerCase().includes(textoBusqueda)) ||
        (v.email && v.email.toLowerCase().includes(textoBusqueda));
      return matchEstado && matchTexto;
    });

    if (filtradas.length === 0) {
      visitasTableBody.innerHTML = `
        <tr><td colspan="6" style="text-align: center; color: var(--color-text-muted); padding: 2.5rem;">
          No se encontraron solicitudes con los filtros aplicados.
        </td></tr>
      `;
      return;
    }

    visitasTableBody.innerHTML = "";

    filtradas.forEach((v) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="col-fecha">
          <span class="fecha-main">${v.fecha_preferida}</span>
          <span class="badge-turno">${v.turno}</span>
        </td>
        <td>
          <div class="inst-title">${v.institucion}</div>
          <span class="inst-sub">Nivel: ${v.nivel}</span>
        </td>
        <td>
          <div class="doc-name">${v.responsable}</div>
          <div style="margin-top: 0.25rem;">
            <a href="mailto:${v.email}" class="contact-link">${v.email}</a>
            <span class="contact-tel">📞 ${v.telefono}</span>
          </div>
        </td>
        <td style="text-align: center;">
          <span class="alumnos-badge">${v.alumnos_cant}</span>
        </td>
        <td>
          <span class="badge badge-${v.estado}">${v.estado.toUpperCase()}</span>
        </td>
        <td>
          <div class="actions-group">
            <select class="select-estado" data-id="${v.id}" title="Cambiar estado">
              <option value="pendiente" ${v.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
              <option value="confirmada" ${v.estado === "confirmada" ? "selected" : ""}>Confirmar</option>
              <option value="realizada" ${v.estado === "realizada" ? "selected" : ""}>Realizada</option>
              <option value="rechazada" ${v.estado === "rechazada" ? "selected" : ""}>Rechazar</option>
            </select>
            <button class="btn-ver-obs" data-id="${v.id}" title="Ver observaciones y datos completos">👁️</button>
            <button class="btn-ver-obs btn-del-visita" data-id="${v.id}" title="Eliminar solicitud" style="color: var(--color-error);">🗑️</button>
          </div>
        </td>
      `;

      // Evento de cambio de estado
      const selectEstado = tr.querySelector(".select-estado");
      selectEstado.addEventListener("change", async (e) => {
        const nuevoEstado = e.target.value;
        try {
          await PestalozziAPI.updateVisitaEstado(authToken, v.id, nuevoEstado);
          showAlert(`Estado actualizado a '${nuevoEstado}'.`);
          v.estado = nuevoEstado;
          renderVisitas();
        } catch (err) {
          showAlert("Error al actualizar estado: " + err.message, true);
        }
      });

      // Evento de ver detalle
      const btnDetalle = tr.querySelector(".btn-ver-obs");
      btnDetalle.addEventListener("click", () => {
        abrirModalDetalleVisita(v);
      });

      // Evento de eliminar visita
      const btnDel = tr.querySelector(".btn-del-visita");
      btnDel.addEventListener("click", async () => {
        if (confirm(`¿Seguro que deseás eliminar la solicitud de "${v.institucion}"?`)) {
          try {
            await PestalozziAPI.deleteVisita(authToken, v.id);
            showAlert("Solicitud eliminada correctamente.");
            allVisitas = allVisitas.filter(item => item.id !== v.id);
            if (badgeCountVisitas) badgeCountVisitas.textContent = allVisitas.length;
            renderVisitas();
          } catch (err) {
            showAlert("Error al eliminar solicitud: " + err.message, true);
          }
        }
      });

      visitasTableBody.appendChild(tr);
    });
  }

  function abrirModalDetalleVisita(v) {
    if (!modalVisita) return;
    const body = document.getElementById("modal-visita-body");
    if (body) {
      body.innerHTML = `
        <div style="background: var(--color-bg-alt); padding: 1rem; border-radius: var(--radius); margin-bottom: 1rem;">
          <h4 style="color: var(--color-primary); font-size: 1.15rem; margin-bottom: 0.3rem;">${v.institucion}</h4>
          <p><strong>Nivel / Grado:</strong> ${v.nivel} &middot; <strong>Alumnos:</strong> ${v.alumnos_cant}</p>
          <p><strong>Fecha solicitada:</strong> ${v.fecha_preferida} &middot; <strong>Turno:</strong> ${v.turno}</p>
          <p><strong>Estado actual:</strong> <span class="badge badge-${v.estado}">${v.estado}</span></p>
        </div>

        <div style="margin-bottom: 1rem;">
          <h5 style="color: var(--color-text); font-size: 0.95rem; margin-bottom: 0.25rem;">Contacto del Docente:</h5>
          <p><strong>Responsable:</strong> ${v.responsable}</p>
          <p><strong>Email:</strong> <a href="mailto:${v.email}">${v.email}</a></p>
          <p><strong>Teléfono / WhatsApp:</strong> <a href="https://wa.me/${v.telefono.replace(/\D/g, '')}" target="_blank">${v.telefono}</a></p>
        </div>

        <div>
          <h5 style="color: var(--color-text); font-size: 0.95rem; margin-bottom: 0.25rem;">Comentarios / Observaciones:</h5>
          <p style="background: #fff; border: 1px solid var(--color-line); border-radius: var(--radius); padding: 0.75rem; white-space: pre-wrap; font-style: ${v.observaciones ? 'normal' : 'italic'}; color: ${v.observaciones ? 'inherit' : 'var(--color-text-muted)'};">
            ${v.observaciones ? v.observaciones : "No se registraron comentarios adicionales."}
          </p>
        </div>
      `;
    }
    modalVisita.classList.add("is-open");
  }

  function cerrarModalDetalleVisita() {
    if (!modalVisita) return;
    modalVisita.classList.remove("is-open");
  }

  if (btnCloseModalVisita) btnCloseModalVisita.addEventListener("click", cerrarModalDetalleVisita);
  if (btnCerrarDetalle) btnCerrarDetalle.addEventListener("click", cerrarModalDetalleVisita);
  if (modalVisita) {
    modalVisita.addEventListener("click", (e) => {
      if (e.target === modalVisita) cerrarModalDetalleVisita();
    });
  }

  if (filtroVisitas) filtroVisitas.addEventListener("change", renderVisitas);
  if (busquedaVisitas) busquedaVisitas.addEventListener("input", renderVisitas);

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
     4. Bloc de Notas Lateral de Betsabé (Drawer Flotante por arriba)
     ------------------------------------------------------------------------ */
  const notasTextarea = document.getElementById("admin-notas-textarea");
  const btnLimpiarNotas = document.getElementById("btn-limpiar-notas");
  const notasStatusPill = document.getElementById("notas-status-pill");
  const notasMiniSync = document.getElementById("notas-mini-sync");
  const notasLastSaved = document.getElementById("notas-last-saved");
  const btnToggleNotas = document.getElementById("btn-toggle-notas");
  const btnCloseNotas = document.getElementById("btn-close-notas");
  const drawerNotas = document.getElementById("drawer-notas");
  const drawerOverlay = document.getElementById("drawer-notas-overlay");
  let autoSaveTimeout = null;

  function abrirDrawerNotas() {
    if (drawerNotas && drawerOverlay) {
      drawerNotas.classList.add("is-open");
      drawerOverlay.classList.add("is-open");
      if (notasTextarea) {
        setTimeout(() => notasTextarea.focus(), 150);
      }
    }
  }

  function cerrarDrawerNotas() {
    if (drawerNotas && drawerOverlay) {
      drawerNotas.classList.remove("is-open");
      drawerOverlay.classList.remove("is-open");
    }
  }

  if (btnToggleNotas) {
    btnToggleNotas.addEventListener("click", abrirDrawerNotas);
  }
  if (btnCloseNotas) {
    btnCloseNotas.addEventListener("click", cerrarDrawerNotas);
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", cerrarDrawerNotas);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawerNotas && drawerNotas.classList.contains("is-open")) {
      cerrarDrawerNotas();
    }
  });

  function actualizarBadgesNotas(texto, clase = "") {
    if (notasStatusPill) {
      notasStatusPill.textContent = texto;
      notasStatusPill.className = "notas-status-pill " + clase;
    }
    if (notasMiniSync) {
      notasMiniSync.textContent = texto;
      if (clase === "saving") {
        notasMiniSync.style.backgroundColor = "#fff3e0";
        notasMiniSync.style.color = "#e65100";
      } else {
        notasMiniSync.style.backgroundColor = "#e8f5e9";
        notasMiniSync.style.color = "#2e7d32";
      }
    }
  }

  async function loadNotas() {
    if (!notasTextarea) return;

    // Cargar primero de localStorage por inmediatez
    const backup = localStorage.getItem(localNotasKey);
    if (backup) {
      notasTextarea.value = backup;
    }

    try {
      const res = await PestalozziAPI.getNotas(authToken);
      if (res.ok && res.data && typeof res.data.contenido === "string") {
        notasTextarea.value = res.data.contenido;
        localStorage.setItem(localNotasKey, res.data.contenido);
        if (res.data.updated_at) {
          const date = new Date(res.data.updated_at);
          notasLastSaved.textContent = `Guardado: ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
      }
    } catch (err) {
      console.info("Notas cargadas desde almacenamiento local.");
    }
  }

  async function guardarNotas(showFeedback = true) {
    if (!notasTextarea) return;
    const contenido = notasTextarea.value;
    localStorage.setItem(localNotasKey, contenido);

    actualizarBadgesNotas("Guardando...", "saving");

    try {
      await PestalozziAPI.updateNotas(authToken, contenido);
      actualizarBadgesNotas("Sincronizado");
      if (notasLastSaved) {
        const date = new Date();
        notasLastSaved.textContent = `Guardado: ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      if (showFeedback) {
        showAlert("Notas guardadas.");
      }
    } catch (err) {
      actualizarBadgesNotas("Guardado local");
    }
  }

  if (notasTextarea) {
    notasTextarea.addEventListener("input", () => {
      actualizarBadgesNotas("Modificado...", "saving");
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        guardarNotas(false);
      }, 900);
    });
  }

  if (btnLimpiarNotas) {
    btnLimpiarNotas.addEventListener("click", async () => {
      if (confirm("¿Querés borrar todo el contenido del bloc de notas?")) {
        try {
          await PestalozziAPI.deleteNotaById(authToken, 1);
          notasTextarea.value = "";
          localStorage.removeItem(localNotasKey);
          actualizarBadgesNotas("Limpio");
          if (notasLastSaved) {
            notasLastSaved.textContent = "Notas eliminadas";
          }
          showAlert("Notas eliminadas correctamente.");
        } catch (err) {
          showAlert("Error al eliminar notas: " + err.message, true);
        }
      }
    });
  }

  // Comprobación inicial
  checkAuth();
});
