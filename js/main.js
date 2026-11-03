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
   Validación del formulario de visita escolar
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
  const fields = Array.prototype.slice.call(
    form.querySelectorAll("input, textarea")
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

  form.addEventListener("submit", function (event) {
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

    showStatus(
      status,
      "Solicitud enviada. La bibliotecaria te confirma la disponibilidad dentro de las próximas 48 horas.",
      "is-success"
    );
    form.reset();
  });
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
}



document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initCurrentYear();
  initVisitaForm();
  initDatosContacto();
});
