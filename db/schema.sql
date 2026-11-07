-- ============================================================================
-- Esquema de la base de datos — Biblioteca Popular Pestalozzi
--
-- Fuente única del esquema: lo aplican tanto el arranque del servidor
-- (backend/src/config/db.js) como el comando `npm run db:migrate`.
-- Todas las sentencias son idempotentes (CREATE TABLE IF NOT EXISTS).
--
-- Modelo del DER de Etapa 2:
--   HORARIOS, CATEGORIAS_COLECCION, MATERIALES_BIBLIOGRAFICOS,
--   SOLICITUDES_VISITA, CONTACTOS y NOVEDADES_DONACIONES.
-- Entidades agregadas por la Etapa 3 (documentadas en ADR-0013):
--   USUARIOS (autenticación del panel) y NOTAS (bloc de la bibliotecaria).
-- ============================================================================

PRAGMA foreign_keys = ON;

-- Autenticación del panel (entidad agregada por la Etapa 3)
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- DER: HORARIOS
-- dia_orden es una columna de implementación para ordenar el tablón;
-- el estado abierto/cerrado se deriva de rango_horario.
CREATE TABLE IF NOT EXISTS horarios (
  id_horario INTEGER PRIMARY KEY AUTOINCREMENT,
  dias_atencion TEXT NOT NULL,
  rango_horario TEXT NOT NULL,
  cuatrimestre TEXT NOT NULL,
  dia_orden INTEGER NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- DER: SOLICITUDES_VISITA
-- Conserva los campos extra que pide el formulario público.
CREATE TABLE IF NOT EXISTS solicitudes_visita (
  id_solicitud INTEGER PRIMARY KEY AUTOINCREMENT,
  escuela TEXT NOT NULL,
  docente TEXT NOT NULL,
  email TEXT NOT NULL,
  fecha_visita TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  telefono TEXT NOT NULL,
  nivel TEXT NOT NULL,
  alumnos_cant INTEGER NOT NULL,
  turno TEXT NOT NULL,
  observaciones TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- DER: CONTACTOS
CREATE TABLE IF NOT EXISTS contactos (
  id_contacto INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
  telefono TEXT
);

-- DER: CATEGORIAS_COLECCION
CREATE TABLE IF NOT EXISTS categorias_coleccion (
  id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT
);

-- DER: MATERIALES_BIBLIOGRAFICOS
CREATE TABLE IF NOT EXISTS materiales_bibliograficos (
  id_material INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  autor TEXT,
  link_koha TEXT,
  link_greenstone TEXT,
  id_categoria INTEGER NOT NULL,
  FOREIGN KEY (id_categoria) REFERENCES categorias_coleccion (id_categoria)
);

-- DER: NOVEDADES_DONACIONES
-- id_horario es opcional: una novedad puede referirse a un día de atención.
CREATE TABLE IF NOT EXISTS novedades_donaciones (
  id_novedad INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  fecha_publicacion TEXT NOT NULL,
  id_horario INTEGER,
  orden INTEGER NOT NULL DEFAULT 1,
  categoria TEXT NOT NULL,
  categoria_color TEXT NOT NULL DEFAULT '#8b5e2b',
  activa INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_horario) REFERENCES horarios (id_horario)
);

-- Bloc de notas de la bibliotecaria (entidad agregada por la Etapa 3)
CREATE TABLE IF NOT EXISTS notas (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  contenido TEXT NOT NULL DEFAULT '',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
