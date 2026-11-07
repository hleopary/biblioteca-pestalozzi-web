-- ============================================================================
-- Esquema de la base de datos — Biblioteca Popular Pestalozzi
--
-- Fuente única del esquema: lo aplican tanto el arranque del servidor
-- (backend/src/config/db.js) como el comando `npm run db:migrate`.
-- Todas las sentencias son idempotentes (CREATE TABLE IF NOT EXISTS).
-- ============================================================================

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS horarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dia_orden INTEGER NOT NULL,
  dia_nombre TEXT NOT NULL,
  horario_texto TEXT NOT NULL,
  activo INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visitas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  institucion TEXT NOT NULL,
  responsable TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  nivel TEXT NOT NULL,
  alumnos_cant INTEGER NOT NULL,
  fecha_preferida TEXT NOT NULL,
  turno TEXT NOT NULL,
  observaciones TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS novedades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orden INTEGER NOT NULL DEFAULT 1,
  categoria TEXT NOT NULL,
  categoria_color TEXT NOT NULL DEFAULT '#8b5e2b',
  fecha_texto TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  activa INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notas (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  contenido TEXT NOT NULL DEFAULT '',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
