"use strict";

const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function notificarNuevaVisita(visita) {
  const destinatario = process.env.ADMIN_EMAIL || "bibliotecapestalozzi.berisso@gmail.com";
  const remitente = process.env.EMAIL_FROM || '"Biblioteca Pestalozzi" <noreply@pestalozzi.org.ar>';

  const asunto = `Nueva Solicitud de Visita Escolar: ${visita.institucion}`;
  const texto = `
Se ha recibido una nueva solicitud de visita escolar:

- Institución: ${visita.institucion}
- Responsable: ${visita.responsable}
- Teléfono: ${visita.telefono}
- Email: ${visita.email}
- Nivel / Grado: ${visita.nivel}
- Cantidad de Alumnos: ${visita.alumnos_cant}
- Fecha Preferida: ${visita.fecha_preferida}
- Turno: ${visita.turno}
- Observaciones: ${visita.observaciones || "Ninguna"}

Puede gestionar esta solicitud desde el panel de administración.
`;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: remitente,
        to: destinatario,
        subject: asunto,
        text: texto
      });
      console.log(`✓ Notificación por correo enviada a ${destinatario}`);
    } catch (err) {
      console.error("Error al enviar correo vía SMTP:", err.message);
    }
  } else {
    console.log("-------------------------------------------------------");
    console.log(`[SIMULACIÓN DE EMAIL] Para: ${destinatario}`);
    console.log(`Asunto: ${asunto}`);
    console.log(texto);
    console.log("-------------------------------------------------------");
  }
}

module.exports = {
  notificarNuevaVisita
};
