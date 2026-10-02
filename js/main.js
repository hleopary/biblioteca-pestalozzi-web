"use strict";

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

function initCurrentYear() {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

function validateField(field) {
  const wrapper = field.closest(".form-field");
  const error = wrapper ? wrapper.querySelector(".field-error") : null;
  let message = "";

  if (field.validity.valueMissing) {
    if (field.type === "text") {
      message = "Completa tu nombre.";
    } else if (field.tagName === "SELECT") {
      message = "Elige un motivo.";
    } else if (field.type === "email") {
      message = "Ingresa un correo valido.";
    } else {
      message = "Este campo es obligatorio.";
    }
  } else if (field.type === "email" && field.validity.typeMismatch) {
    message = "Ingresa un correo valido.";
  } else if (field.validity.tooShort) {
    message = "El mensaje debe tener al menos 10 caracteres.";
  }

  if (wrapper) {
    wrapper.classList.toggle("has-error", message !== "");
  }

  if (error) {
    error.hidden = message === "";
    error.textContent = message;
  }

  return message === "";
}

function initContactForm() {
  const form = document.getElementById("contacto-form");

  if (!form) {
    return;
  }

  const status = document.getElementById("form-status");
  const fields = Array.prototype.slice.call(form.querySelectorAll("input, select, textarea"));

  fields.forEach(function (field) {
    field.addEventListener("blur", function () {
      validateField(field);
    });

    field.addEventListener("input", function () {
      if (field.closest(".form-field").classList.contains("has-error")) {
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
      showStatus(status, "Revisa los campos marcados antes de enviar.", "is-error");
      return;
    }

    showStatus(status, "Mensaje enviado. Te contactamos dentro de las proximas 48 horas.", "is-success");
    form.reset();
  });
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

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initCurrentYear();
  initContactForm();
});