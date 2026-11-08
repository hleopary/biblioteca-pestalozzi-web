-- ============================================================================
-- Contenido inicial — Biblioteca Popular Pestalozzi
--
-- Reproduce el contenido publicado en el sitio con el modelo del DER:
-- horarios, categorías de colección, materiales, novedades y la nota vacía.
-- El usuario administrador se crea aparte, con bcrypt, en el seeder.
--
-- Los materiales son ejemplos de demostración: la biblioteca cargará su
-- catálogo real desde el panel o con un nuevo seed.
-- Es idempotente: INSERT OR IGNORE con identificadores fijos.
-- ============================================================================

INSERT OR IGNORE INTO horarios (id_horario, dias_atencion, rango_horario, cuatrimestre, dia_orden) VALUES
  (1, 'Lunes',     'Cerrado',         '2026-2', 1),
  (2, 'Martes',    '16:00 – 18:00',   '2026-2', 2),
  (3, 'Miércoles', '10:00 – 12:00',   '2026-2', 3),
  (4, 'Jueves',    'Cerrado',         '2026-2', 4),
  (5, 'Viernes',   'Cerrado',         '2026-2', 5),
  (6, 'Sábado',    'Cerrado',         '2026-2', 6),
  (7, 'Domingo',   'Cerrado',         '2026-2', 7);

INSERT OR IGNORE INTO categorias_coleccion (id_categoria, nombre, descripcion) VALUES
  (1, 'Berisso y La Plata', 'Fondo local y literatura argentina'),
  (2, 'Colectividades de inmigrantes', 'Materiales de las colectividades italiana y española');

INSERT OR IGNORE INTO materiales_bibliograficos (id_material, titulo, autor, link_koha, link_greenstone, id_categoria) VALUES
  (1, 'El Eternauta', 'H. G. Oesterheld', '', '', 1),
  (2, 'Bestiario', 'Julio Cortázar', '', '', 1),
  (3, 'El túnel', 'Ernesto Sabato', '', '', 1),
  (4, 'Cocina italiana tradicional', '', '', '', 2),
  (5, 'Cocina española de siempre', '', '', '', 2),
  (6, 'Memorias de la inmigración en Berisso', '', '', '', 2);

INSERT OR IGNORE INTO novedades_donaciones
  (id_novedad, titulo, contenido, fecha_publicacion, id_horario, orden, categoria, categoria_color, activa) VALUES
  (1, '85 nuevos títulos de literatura argentina',
   'El Ministerio de Educación de la Provincia de Buenos Aires donó una colección de 85 libros de autores nacionales, incluyendo obras de narrativa, poesía y ensayo.',
   'Agosto 2025', NULL, 1, 'Donación provincial', '#8b5e2b', 1),
  (2, '“El Eternauta” – H.G. Oesterheld',
   'Clásico imprescindible de la historieta argentina. Disponible en nuestra sala de lectura para consulta en el local.',
   'Septiembre 2025', NULL, 2, 'Recomendación de la semana', '#6b1d2b', 1),
  (3, 'Fondo de colectividades: 40 nuevas incorporaciones',
   'Gracias a la generosidad de familias de la comunidad italiana y española de Berisso, incorporamos nuevos materiales a la colección de colectividades de inmigrantes.',
   'Octubre 2025', NULL, 3, 'Donación de socios', '#3d5a3e', 1);

INSERT OR IGNORE INTO notas (id, contenido) VALUES (1, '');
