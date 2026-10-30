"use strict";

const http = require("http");
const app = require("./server");

const server = http.createServer(app);
const PORT = 3055; // Puerto de prueba para no colisionar

server.listen(PORT, async () => {
  console.log(`\n=== INICIANDO SUITE DE PRUEBAS AUTOMATIZADAS (Puerto ${PORT}) ===\n`);
  const baseUrl = `http://localhost:${PORT}/api`;

  let failures = 0;
  let authToken = "";
  let testVisitaId = null;
  let testNovedadId = null;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✓ [PASS] ${name}`);
    } catch (err) {
      failures++;
      console.error(`✗ [FAIL] ${name}:`, err.message);
    }
  }

  // 1. Health check
  await test("GET /api/health responde 200 y status activo", async () => {
    const res = await fetch(`${baseUrl}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.ok || data.estado !== "activo") throw new Error("Respuesta inválida");
  });

  // 2. Horarios públicos
  await test("GET /api/horarios devuelve los 6 días de la semana", async () => {
    const res = await fetch(`${baseUrl}/horarios`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.ok || !Array.isArray(data.data) || data.data.length !== 6) {
      throw new Error(`Se esperaban 6 días, recibidos: ${data.data?.length}`);
    }
  });

  // 3. Novedades públicas
  await test("GET /api/novedades devuelve 3 novedades activas", async () => {
    const res = await fetch(`${baseUrl}/novedades`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.ok || !Array.isArray(data.data) || data.data.length !== 3) {
      throw new Error(`Se esperaban 3 novedades, recibidas: ${data.data?.length}`);
    }
  });

  // 4. Recepción de visitas escolares
  await test("POST /api/visitas guarda solicitud y retorna 201", async () => {
    const payload = {
      institucion: "Escuela Primaria N.° 12 de Berisso",
      responsable: "Mariana Gómez",
      email: "docente@escuela12.edu.ar",
      telefono: "2214556677",
      nivel: "4to grado",
      alumnos_cant: 28,
      fecha_preferida: "2026-11-15",
      turno: "Turno Mañana",
      observaciones: "Interés especial en colección de colectividades"
    };

    const res = await fetch(`${baseUrl}/visitas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.status !== 201) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.ok || !data.data || !data.data.id) throw new Error("No se devolvió ID de visita");
    testVisitaId = data.data.id;
  });

  // 5. Login inválido
  await test("POST /api/auth/login rechaza contraseña errónea con 401", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "betsabe", password: "clave_incorrecta" })
    });

    if (res.status !== 401) throw new Error(`Se esperaba HTTP 401, recibido ${res.status}`);
  });

  // 6. Login válido de Betsabé
  await test("POST /api/auth/login emite token JWT con credenciales válidas", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "betsabe", password: "pestalozzi2026" })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.ok || !data.token) throw new Error("No se emitió token");
    authToken = data.token;
  });

  // 7. Verificación de token
  await test("GET /api/auth/verify valida sesión protegida", async () => {
    const res = await fetch(`${baseUrl}/auth/verify`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.ok || data.usuario?.username !== "betsabe") throw new Error("Usuario inválido en token");
  });

  // 8. Actualización de estado de visita escolar
  await test("PATCH /api/visitas/:id/estado actualiza a 'confirmada'", async () => {
    const res = await fetch(`${baseUrl}/visitas/${testVisitaId}/estado`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ estado: "confirmada" })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.data?.estado !== "confirmada") throw new Error("Estado no coincide");
  });

  // 9. Actualización de horarios
  await test("PUT /api/horarios actualiza la grilla cuatrimestral", async () => {
    const nuevoHorario = [
      { dia_orden: 1, activo: 0, horario_texto: "Cerrado" },
      { dia_orden: 2, activo: 1, horario_texto: "16:00 – 18:00" },
      { dia_orden: 3, activo: 1, horario_texto: "10:00 – 12:00" },
      { dia_orden: 4, activo: 1, horario_texto: "14:00 – 17:00" }, // Nuevo turno de prueba
      { dia_orden: 5, activo: 0, horario_texto: "Cerrado" },
      { dia_orden: 6, activo: 0, horario_texto: "Cerrado" }
    ];

    const res = await fetch(`${baseUrl}/horarios`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ horarios: nuevoHorario })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const jueves = data.data.find(d => d.dia_orden === 4);
    if (!jueves || jueves.activo !== 1) throw new Error("Horario no actualizado correctamente");
  });

  // 10. CRUD de Novedades
  await test("POST /api/novedades crea nueva publicación y DELETE la elimina", async () => {
    const resCreate = await fetch(`${baseUrl}/novedades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        categoria: "Taller Infantil",
        categoria_color: "#3d5a3e",
        fecha_texto: "Noviembre 2026",
        titulo: "Taller de Cuentos y Títeres",
        descripcion: "Actividad comunitaria para niños y familias."
      })
    });

    if (resCreate.status !== 201) throw new Error(`HTTP ${resCreate.status}`);
    const dataCreate = await resCreate.json();
    testNovedadId = dataCreate.data.id;

    // Eliminar la de prueba
    const resDel = await fetch(`${baseUrl}/novedades/${testNovedadId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (!resDel.ok) throw new Error(`Error en DELETE HTTP ${resDel.status}`);
  });

  // 11. Bloc de Notas
  await test("PUT y GET /api/notas guardan y recuperan notas de Betsabé", async () => {
    const textoNota = "Llamar a la Escuela 12 el lunes a las 10hs para confirmar visita.";
    const resPut = await fetch(`${baseUrl}/notas`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ contenido: textoNota })
    });

    if (!resPut.ok) throw new Error(`Error en PUT /api/notas HTTP ${resPut.status}`);

    const resGet = await fetch(`${baseUrl}/notas`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (!resGet.ok) throw new Error(`Error en GET /api/notas HTTP ${resGet.status}`);
    const dataGet = await resGet.json();
    if (dataGet.data?.contenido !== textoNota) {
      throw new Error("El contenido de la nota no coincide.");
    }
  });

  await test("DELETE /api/notas/:id elimina una nota específica", async () => {
    const resDel = await fetch(`${baseUrl}/notas/${testNovedadId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (!resDel.ok) throw new Error(`Error en DELETE HTTP ${resDel.status}`);
  });

  console.log("\n-------------------------------------------------------");
  if (failures === 0) {
    console.log("✓ TODAS LAS PRUEBAS PASARON EXITOSAMENTE (12/12)");
  } else {
    console.error(`✗ FALLARON ${failures} PRUEBAS`);
  }
  console.log("-------------------------------------------------------\n");

  server.close(() => {
    process.exit(failures === 0 ? 0 : 1);
  });
});
