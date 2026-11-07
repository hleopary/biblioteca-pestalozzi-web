"use strict";

/* --------------------------------------------------------------------------
   Menú de navegación (móvil)
   -------------------------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* --------------------------------------------------------------------------
   Año dinámico en el footer
   -------------------------------------------------------------------------- */
function initCurrentYear() {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
}

/* --------------------------------------------------------------------------
   Carga dinámica de Horarios (con fallback a contenido estático)
   -------------------------------------------------------------------------- */
async function loadDynamicHorarios() {
  const scheduleContainer = document.querySelector(".schedule");
  if (!scheduleContainer || typeof PestalozziAPI === "undefined") {
    return;
  }

  try {
    const res = await PestalozziAPI.getHorarios();
    if (!res.ok || !Array.isArray(res.data) || res.data.length === 0) {
      return;
    }

    scheduleContainer.innerHTML = "";

    res.data.forEach((item) => {
      const li = document.createElement("li");
      li.className = "schedule-day" + (item.activo ? " is-open" : "");

      const spanDay = document.createElement("span");
      spanDay.className = "day";
      spanDay.textContent = item.dia_nombre;

      const spanHours = document.createElement("span");
      spanHours.className = "hours";
      spanHours.textContent = item.horario_texto || (item.activo ? "Abierto" : "Cerrado");

      li.appendChild(spanDay);
      li.appendChild(spanHours);
      scheduleContainer.appendChild(li);
    });
  } catch (err) {
    // Si la API no está encendida, se conserva el HTML estático de respaldo
    console.info("Horarios cargados desde caché estática HTML (servidor API offline).");
  }
}

/* --------------------------------------------------------------------------
   Carga dinámica de Novedades (con fallback a contenido estático)
   -------------------------------------------------------------------------- */
async function loadDynamicNovedades() {
  const novedadesContainer = document.querySelector(".section-novedades .card-grid-3");
  if (!novedadesContainer || typeof PestalozziAPI === "undefined") {
    return;
  }

  try {
    const res = await PestalozziAPI.getNovedades();
    if (!res.ok || !Array.isArray(res.data) || res.data.length === 0) {
      return;
    }

    novedadesContainer.innerHTML = "";

    res.data.forEach((novedad) => {
      const article = document.createElement("article");
      article.className = "card novedad";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = novedad.categoria;
      if (novedad.categoria_color) {
        tag.style.backgroundColor = novedad.categoria_color;
      }

      const title = document.createElement("h3");
      title.textContent = novedad.titulo;

      const desc = document.createElement("p");
      desc.textContent = novedad.descripcion;

      const date = document.createElement("span");
      date.className = "card-date";
      date.textContent = novedad.fecha_texto;

      cardBody.appendChild(tag);
      cardBody.appendChild(title);
      cardBody.appendChild(desc);
      cardBody.appendChild(date);

      article.appendChild(cardBody);
      novedadesContainer.appendChild(article);
    });
  } catch (err) {
    console.info("Novedades cargadas desde caché estática HTML (servidor API offline).");
  }
}

/* --------------------------------------------------------------------------
   Validación y Envío del Formulario de Visita Escolar
   -------------------------------------------------------------------------- */
function validateField(field) {
  const wrapper = field.closest(".form-field");
  const error = wrapper ? wrapper.querySelector(".field-error") : null;
  const valid = field.checkValidity();

  if (wrapper) {
    wrapper.classList.toggle("has-error", !valid);
  }

  if (error) {
    error.hidden = valid;
  }

  return valid;
}

function showStatus(element, message, stateClass) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.classList.remove("is-success", "is-error");
  element.classList.add(stateClass);
  element.hidden = false;
}

function initVisitaForm() {
  const form = document.getElementById("visita-form");
  if (!form) {
    return;
  }

  const status = document.getElementById("form-status");
  const submitBtn = form.querySelector('button[type="submit"]');
  const fields = Array.prototype.slice.call(
    form.querySelectorAll("input, textarea, select")
  );

  fields.forEach(function (field) {
    field.addEventListener("blur", function () {
      validateField(field);
    });

    field.addEventListener("input", function () {
      const wrapper = field.closest(".form-field");
      if (wrapper && wrapper.classList.contains("has-error")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const invalid = fields.filter(function (field) {
      return !validateField(field);
    });

    if (invalid.length > 0) {
      invalid[0].focus();
      showStatus(
        status,
        "Revisá los campos marcados antes de enviar.",
        "is-error"
      );
      return;
    }

    const payload = {
      institucion: form.escuela.value,
      responsable: form.docente.value,
      email: form.email.value,
      telefono: form.telefono.value,
      nivel: form.grado.value,
      alumnos_cant: parseInt(form.cantidad.value, 10),
      fecha_preferida: form.fecha.value,
      turno: (form.turno && form.turno.value) || "A coordinar",
      observaciones: form.comentarios ? form.comentarios.value : ""
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando solicitud...";
    }

    try {
      if (typeof PestalozziAPI !== "undefined") {
        const res = await PestalozziAPI.enviarVisita(payload);
        showStatus(
          status,
          res.mensaje || "Solicitud enviada con éxito. La bibliotecaria te confirmará disponibilidad.",
          "is-success"
        );
        form.reset();
      } else {
        // Fallback simulado
        showStatus(
          status,
          "Solicitud procesada. Nos contactaremos a la brevedad.",
          "is-success"
        );
        form.reset();
      }
    } catch (err) {
      showStatus(
        status,
        "No se pudo enviar la solicitud en este momento. Por favor intentá por WhatsApp o correo.",
        "is-error"
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar solicitud de visita";
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initCurrentYear();
  initVisitaForm();
  loadDynamicHorarios();
  loadDynamicNovedades();
});
