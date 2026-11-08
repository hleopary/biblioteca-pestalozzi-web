"use strict";

/**
 * Pruebas de integración sobre la API real.
 *
 * Levanta la aplicación de Express en un puerto efímero y usa una base SQLite
 * temporal, para no tocar la base de desarrollo ni la de producción.
 *
 * Cubren dos flujos: el ciclo completo Crear/Leer/Actualizar/Eliminar y la
 * lectura pública que refleja una escritura.
 */

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const dbPath = path.join(
  os.tmpdir(),
  `pestalozzi-test-${process.pid}-${Date.now()}.db`
);

// Deben definirse antes de requerir el servidor: db.js y el seeder los leen al importarse.
process.env.DB_PATH = dbPath;
process.env.JWT_SECRET = "secreto-solo-para-tests";
process.env.JWT_EXPIRES_IN = "1h";
process.env.ADMIN_USER = "betsabe";
process.env.ADMIN_PASS = "clave-de-prueba";
process.env.ADMIN_EMAIL = "pruebas@example.com";
process.env.NODE_ENV = "test";

let server;
let base;
let token;

function autorizacion() {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

before(async () => {
  const app = require("../server");
  server = app.listen(0);

  await new Promise((resolve) => {
    if (server.listening) return resolve();
    server.once("listening", resolve);
  });

  base = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));

  for (const archivo of [dbPath, `${dbPath}-journal`, `${dbPath}-wal`, `${dbPath}-shm`]) {
    try {
      fs.rmSync(archivo, { force: true });
    } catch {
      // La limpieza no debe hacer fallar la suite.
    }
  }
});

test("GET /api/health responde con estado activo", async () => {
  const respuesta = await fetch(`${base}/health`);
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 200);
  assert.equal(cuerpo.ok, true);
  assert.equal(cuerpo.estado, "activo");
});

test("POST /api/auth/login entrega un token con las credenciales del seed", async () => {
  const respuesta = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "betsabe", password: "clave-de-prueba" })
  });
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 200);
  assert.equal(cuerpo.ok, true);
  assert.equal(typeof cuerpo.token, "string");

  token = cuerpo.token;
});

test("POST /api/auth/login rechaza una contraseña incorrecta", async () => {
  const respuesta = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "betsabe", password: "incorrecta" })
  });

  assert.equal(respuesta.status, 401);
});

test("CRUD de novedades: crear, leer, actualizar y eliminar", async () => {
  const crear = await fetch(`${base}/novedades`, {
    method: "POST",
    headers: autorizacion(),
    body: JSON.stringify({
      categoria: "Prueba de integración",
      titulo: "Novedad creada por la suite",
      descripcion: "Contenido de prueba"
    })
  });
  const creada = await crear.json();

  assert.equal(crear.status, 201);
  assert.equal(creada.ok, true);
  assert.equal(creada.data.titulo, "Novedad creada por la suite");

  const id = creada.data.id;

  // Read: la novedad aparece en la lectura pública
  const publicas = await fetch(`${base}/novedades`).then((r) => r.json());
  assert.ok(
    publicas.data.some((novedad) => novedad.id === id),
    "la novedad recién creada debería aparecer en la lectura pública"
  );

  // Update
  const actualizar = await fetch(`${base}/novedades/${id}`, {
    method: "PUT",
    headers: autorizacion(),
    body: JSON.stringify({
      titulo: "Novedad actualizada por la suite",
      descripcion: "Contenido actualizado"
    })
  });
  const actualizada = await actualizar.json();

  assert.equal(actualizar.status, 200);
  assert.equal(actualizada.data.titulo, "Novedad actualizada por la suite");

  // Delete
  const eliminar = await fetch(`${base}/novedades/${id}`, {
    method: "DELETE",
    headers: autorizacion()
  });

  assert.equal(eliminar.status, 200);

  const despues = await fetch(`${base}/novedades`).then((r) => r.json());
  assert.ok(
    !despues.data.some((novedad) => novedad.id === id),
    "la novedad eliminada no debería aparecer en la lectura pública"
  );
});

test("La lectura pública de horarios refleja una escritura autenticada", async () => {
  const antes = await fetch(`${base}/horarios`).then((r) => r.json());
  assert.equal(antes.data.length, 7, "el seed carga los siete días");

  const martesAntes = antes.data.find((dia) => dia.dia_orden === 2);
  const nuevoHorario = "17:00 – 19:00";

  const escribir = await fetch(`${base}/horarios/2`, {
    method: "PATCH",
    headers: autorizacion(),
    body: JSON.stringify({ horario_texto: nuevoHorario, activo: 1 })
  });

  assert.equal(escribir.status, 200);

  const despues = await fetch(`${base}/horarios`).then((r) => r.json());
  const martesDespues = despues.data.find((dia) => dia.dia_orden === 2);

  assert.equal(martesDespues.horario_texto, nuevoHorario);
  assert.equal(martesDespues.activo, 1);

  // Restaurar el valor original para no alterar el resto de la suite
  await fetch(`${base}/horarios/2`, {
    method: "PATCH",
    headers: autorizacion(),
    body: JSON.stringify({
      horario_texto: martesAntes.horario_texto,
      activo: martesAntes.activo
    })
  });
});

test("POST /api/visitas rechaza una solicitud sin campos obligatorios", async () => {
  const respuesta = await fetch(`${base}/visitas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ institucion: "Escuela sin datos" })
  });
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 400);
  assert.equal(cuerpo.ok, false);
  assert.match(cuerpo.error, /obligatorios/);
});

test("POST /api/visitas rechaza un correo con formato inválido", async () => {
  const respuesta = await fetch(`${base}/visitas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      institucion: "Escuela Primaria N.° 12",
      responsable: "Mariana Gómez",
      telefono: "2214556677",
      email: "sin-arroba",
      nivel: "Primaria",
      alumnos_cant: 28,
      fecha_preferida: "2026-11-15",
      turno: "Mañana"
    })
  });
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 400);
  assert.match(cuerpo.error, /correo/i);
});

test("POST /api/contactos guarda una consulta y el panel la lista", async () => {
  const crear = await fetch(`${base}/contactos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: "Ana Pérez",
      email: "ana@example.com",
      telefono: "2214556677",
      mensaje: "Consulta de prueba desde la suite"
    })
  });
  const cuerpo = await crear.json();

  assert.equal(crear.status, 201);
  assert.equal(cuerpo.ok, true);

  const lista = await fetch(`${base}/contactos`, { headers: autorizacion() }).then((r) => r.json());
  assert.ok(lista.data.some((contacto) => contacto.id === cuerpo.data.id));

  const borrar = await fetch(`${base}/contactos/${cuerpo.data.id}`, {
    method: "DELETE",
    headers: autorizacion()
  });
  assert.equal(borrar.status, 200);
});

test("POST /api/contactos rechaza una consulta sin mensaje", async () => {
  const respuesta = await fetch(`${base}/contactos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: "Ana Pérez", email: "ana@example.com" })
  });

  assert.equal(respuesta.status, 400);
});

test("GET /api/catalogos/categorias devuelve categorías con sus materiales", async () => {
  const respuesta = await fetch(`${base}/catalogos/categorias`).then((r) => r.json());

  assert.equal(respuesta.ok, true);
  assert.ok(respuesta.data.length >= 2);
  assert.ok(respuesta.data.every((categoria) => Array.isArray(categoria.materiales)));
  assert.ok(respuesta.data.some((categoria) => categoria.materiales.length > 0));
});

test("El catálogo permite crear categoría y material, y protege la categoría con materiales", async () => {
  const crearCategoria = await fetch(`${base}/catalogos/categorias`, {
    method: "POST",
    headers: autorizacion(),
    body: JSON.stringify({ nombre: "Categoría de prueba", descripcion: "Temporal" })
  });
  const categoria = await crearCategoria.json();

  assert.equal(crearCategoria.status, 201);

  const crearMaterial = await fetch(`${base}/catalogos/materiales`, {
    method: "POST",
    headers: autorizacion(),
    body: JSON.stringify({
      titulo: "Material de prueba",
      autor: "Autora de prueba",
      id_categoria: categoria.data.id
    })
  });
  const material = await crearMaterial.json();

  assert.equal(crearMaterial.status, 201);

  // La categoría con materiales no se puede borrar
  const borrarCategoriaConMateriales = await fetch(`${base}/catalogos/categorias/${categoria.data.id}`, {
    method: "DELETE",
    headers: autorizacion()
  });
  assert.equal(borrarCategoriaConMateriales.status, 400);

  await fetch(`${base}/catalogos/materiales/${material.data.id}`, {
    method: "DELETE",
    headers: autorizacion()
  });

  const borrarCategoriaVacia = await fetch(`${base}/catalogos/categorias/${categoria.data.id}`, {
    method: "DELETE",
    headers: autorizacion()
  });
  assert.equal(borrarCategoriaVacia.status, 200);
});

test("POST /api/novedades rechaza un id_horario inexistente", async () => {
  const respuesta = await fetch(`${base}/novedades`, {
    method: "POST",
    headers: autorizacion(),
    body: JSON.stringify({
      categoria: "Prueba",
      titulo: "Novedad con horario inválido",
      descripcion: "Contenido",
      id_horario: 9999
    })
  });

  assert.equal(respuesta.status, 400);
});
