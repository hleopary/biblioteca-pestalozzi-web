"use strict";

/* --------------------------------------------------------------------------
   Menú de navegación (móvil)
   -------------------------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  const srText = toggle ? toggle.querySelector(".sr-only") : null;

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));

    // Actualiza el nombre accesible para lectores de pantalla
    if (srText) {
      srText.textContent = isOpen
        ? "Cerrar menú de navegación"
        : "Abrir menú de navegación";
    }
  });

  nav.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");

      // Restaura el texto accesible cuando se cierra por navegación
      if (srText) {
        srText.textContent = "Abrir menú de navegación";
      }
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


// ============================================================================
// CONFIGURACIÓN CENTRALIZADA DE CATÁLOGOS EXTERNOS (Feat #3)
// Nota: Pendiente de recepción de URLs definitivas por parte de la biblioteca.
// ============================================================================
// ============================================================================
// CONFIGURACION DE ENVIO DE FORMULARIOS (Feat #4)
// Buzon unico para el formulario de consulta general. Al conectar la API
// propia, basta con apuntar endpointConsulta a /api/consultas.
// ============================================================================
const CONFIG_ENVIO = {
  endpointConsulta: "https://formspree.io/f/xeaawadr"
};

const DATOS_CATALOGOS = {
  kohaUrl: "",         // Reemplazar por la URL real del OPAC de Koha
  greenstoneUrl: "" // Reemplazar por la URL real de Greenstone
};

function initCatalogosExternos() {
  const kohaEl = document.querySelector('[data-catalog="koha"]');
  if (kohaEl) {
    if (DATOS_CATALOGOS.kohaUrl) {
      kohaEl.href = DATOS_CATALOGOS.kohaUrl;
      kohaEl.target = "_blank";
      kohaEl.rel = "noopener noreferrer";
    } else {
      kohaEl.href = "#";
      kohaEl.addEventListener("click", (e) => {
        e.preventDefault();
        alert("El catálogo físico Koha estará disponible próximamente con el enlace oficial de la biblioteca.");
      });
    }
  }

  const greenstoneEl = document.querySelector('[data-catalog="greenstone"]');
  if (greenstoneEl) {
    if (DATOS_CATALOGOS.greenstoneUrl) {
      greenstoneEl.href = DATOS_CATALOGOS.greenstoneUrl;
      greenstoneEl.target = "_blank";
      greenstoneEl.rel = "noopener noreferrer";
    } else {
      greenstoneEl.href = "#";
      greenstoneEl.addEventListener("click", (e) => {
        e.preventDefault();
        alert("El repositorio digital Greenstone estará disponible próximamente con el enlace oficial de la biblioteca.");
      });
    }
  }
}

// ============================================================================
// CONFIGURACIÓN CENTRALIZADA DE TRÁMITES Y ASOCIACIÓN (Feat #5)
// Nota: Pendiente de recepción de links definitivos por parte de la biblioteca
// ============================================================================
const DATOS_TRAMITES = {
  asociacionUrl: "", // Pendiente la Ruta al PDF de la planilla o sección presencial
  pedirPrestamoUrl: "", // Pendiente Enlace al formulario o canal de solicitud
  renovarPrestamoUrl: "", // Pendiente Enlace al formulario de renovación
};

function initTramites() {
  // 1. Botón de Formulario / Trámite de Asociación
  const asociacionEl = document.querySelector('[data-tramite="asociacion"]');
  if (asociacionEl) {
    if (DATOS_TRAMITES.asociacionUrl) {
      asociacionEl.href = DATOS_TRAMITES.asociacionUrl;
      asociacionEl.target = "_blank";
      asociacionEl.rel = "noopener noreferrer";
    } else {
      asociacionEl.href = "#";
      asociacionEl.addEventListener("click", (e) => {
        e.preventDefault();
        alert("El formulario para asociarse a la biblioteca estará disponible próximamente con el enlace oficial de la biblioteca.");
      });
    }
  }


  // 2. Botón para Pedir Préstamo
  const pedirPrestamoEl = document.querySelector('[data-tramite="pedir-prestamo"]');
  if (pedirPrestamoEl) {
    if (DATOS_TRAMITES.pedirPrestamoUrl) {
      pedirPrestamoEl.href = DATOS_TRAMITES.pedirPrestamoUrl;
      pedirPrestamoEl.target = "_blank";
      pedirPrestamoEl.rel = "noopener noreferrer";
    } else {
      pedirPrestamoEl.href = "#";
      pedirPrestamoEl.addEventListener("click", (e) => {
        e.preventDefault();
        alert("El formulario para solicitar un préstamo mensual estará disponible próximamente con el enlace oficial de la biblioteca.");
      });
    }
  }

  // 3. Botón para Renovar Préstamo
  const renovarEl = document.querySelector('[data-tramite="renovar-prestamo"]');
  if (renovarEl) {
    if (DATOS_TRAMITES.renovarPrestamoUrl) {
      renovarEl.href = DATOS_TRAMITES.renovarPrestamoUrl;
      renovarEl.target = "_blank";
      renovarEl.rel = "noopener noreferrer";
    } else {
      renovarEl.href = "#";
      renovarEl.addEventListener("click", (e) => {
        e.preventDefault();
        alert("El formulario para renovar su préstamo estará disponible próximamente con el enlace oficial de la biblioteca.");
      });
    }
  }
}

function initConsultaForm() {
  const form = document.getElementById("consulta-form");
  const status = document.getElementById("consulta-status");
  if (!form || !status) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let isValid = true;
    const nombre = form.querySelector("#consulta-nombre");
    const email = form.querySelector("#consulta-email");
    const mensaje = form.querySelector("#consulta-mensaje");

    // Limpiar errores previos
    form.querySelectorAll(".field-error").forEach((el) => (el.hidden = true));
    form.querySelectorAll(".form-field").forEach((el) => el.classList.remove("has-error"));
    status.hidden = true;

    // Validación Nombre
    if (!nombre.value.trim()) {
      showFieldError(nombre, "Ingresá tu nombre.");
      isValid = false;
    }

    // Validación Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      showFieldError(email, "Ingresá un correo electrónico válido.");
      isValid = false;
    }

    // Validación Mensaje
    if (!mensaje.value.trim()) {
      showFieldError(mensaje, "Ingresá el detalle de tu consulta.");
      isValid = false;
    }

    if (!isValid) return;

    // Enviar consulta
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando consulta...";

    try {
      // Endpoint centralizado (Formspree o backend propio, ver CONFIG_ENVIO)
      const response = await fetch(CONFIG_ENVIO.endpointConsulta, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          nombre: nombre.value.trim(),
          email: email.value.trim(),
          telefono: form.querySelector("#consulta-telefono").value.trim(),
          mensaje: mensaje.value.trim()
        })
      });

      if (response.ok) {
        status.textContent = "Consulta enviada con éxito. Te responderemos a la brevedad.";
        status.className = "form-status is-success";
        status.hidden = false;
        form.reset();
      } else {
        throw new Error("Respuesta no satisfactoria del servidor");
      }
    } catch (err) {
      status.textContent = "Ocurrió un error al enviar la consulta. Podés contactarnos directamente por WhatsApp.";
      status.className = "form-status is-error";
      status.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar consulta";
    }
  });

  function showFieldError(input, message) {
    const parent = input.closest(".form-field");
    if (!parent) return;
    parent.classList.add("has-error");
    const err = parent.querySelector(".field-error");
    if (err) {
      err.textContent = message;
      err.hidden = false;
    }
  }
}

// ============================================================================
// CONFIGURACIÓN CENTRALIZADA DE DATOS DE CONTACTO (Feat #6)
// Cambiar un valor aquí actualiza automáticamente el Footer y todos los CTA.
// ============================================================================
const DATOS_CONTACTO = {
  direccionTexto: "Calle 8 N° 3656 (entre 158 y 159), Berisso, Buenos Aires",
  direccionMapaUrl: "https://maps.google.com/?q=Biblioteca+Popular+Pestalozzi+Berisso",
  telefonoVisible: "(0221) 461-1851",
  telefonoHref: "tel:+542214611851",
  whatsappNumero: "5492210000000",
  whatsappMensaje: "Hola Biblioteca Pestalozzi, quería realizar una consulta desde el sitio web.",
  email: "bibliotecapestalozziberisso@gmail.com",
  redes: {
    instagram: "https://www.instagram.com/bibliopestalozzi/",
    facebook: "https://www.facebook.com/bibliotecapopularpestalozzi/"
  }
};

/**
 * Inyecta los datos de contacto centralizados en los CTA de WhatsApp,
 * enlaces del footer y redes sociales.
 */
function initDatosContacto() {
  const whatsappUrl = `https://wa.me/${DATOS_CONTACTO.whatsappNumero}?text=${encodeURIComponent(DATOS_CONTACTO.whatsappMensaje)}`;

  // 1. Actualizar TODOS los botones/enlaces de WhatsApp (Horarios, Visitas y Footer)
  document.querySelectorAll('[data-contact="whatsapp"]').forEach((el) => {
    el.href = whatsappUrl;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });

  // 2. Actualizar Dirección en el Footer (con enlace a Google Maps)
  const dirEl = document.querySelector('[data-contact="direccion"]');
  if (dirEl) {
    dirEl.textContent = DATOS_CONTACTO.direccionTexto;
    if (dirEl.tagName === "A") {
      dirEl.href = DATOS_CONTACTO.direccionMapaUrl;
      dirEl.target = "_blank";
      dirEl.rel = "noopener noreferrer";
    }
  }

  // 3. Actualizar Teléfono en el Footer (enlace tel:)
  const telEl = document.querySelector('[data-contact="telefono"]');
  if (telEl) {
    telEl.textContent = DATOS_CONTACTO.telefonoVisible;
    telEl.href = DATOS_CONTACTO.telefonoHref;
  }

  // 4. Actualizar Email en el Footer (enlace mailto:)
  const emailEl = document.querySelector('[data-contact="email"]');
  if (emailEl) {
    emailEl.textContent = DATOS_CONTACTO.email;
    emailEl.href = `mailto:${DATOS_CONTACTO.email}`;
  }

  // 5. Actualizar Redes Sociales (Instagram y Facebook)
  const igEl = document.querySelector('[data-contact="instagram"]');
  if (igEl && DATOS_CONTACTO.redes.instagram) {
    igEl.href = DATOS_CONTACTO.redes.instagram;
    igEl.target = "_blank";
    igEl.rel = "noopener noreferrer";
  }

  const fbEl = document.querySelector('[data-contact="facebook"]');
  if (fbEl && DATOS_CONTACTO.redes.facebook) {
    fbEl.href = DATOS_CONTACTO.redes.facebook;
    fbEl.target = "_blank";
    fbEl.rel = "noopener noreferrer";
  }



  const correoBtn = document.querySelector('[data-contact="correo-consulta"]');
  if (correoBtn && DATOS_CONTACTO.email) {
    correoBtn.href = `mailto:${DATOS_CONTACTO.email}?subject=${encodeURIComponent("Consulta general - Biblioteca Pestalozzi")}`;
  }

}



document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initCurrentYear();
  initVisitaForm();
  loadDynamicHorarios();
  loadDynamicNovedades();

  initCatalogosExternos();
  initTramites();
  initConsultaForm();
  initDatosContacto();

});

