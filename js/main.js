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

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initCurrentYear();
  initVisitaForm();
});
