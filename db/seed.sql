-- ============================================================================
-- Contenido inicial — Biblioteca Popular Pestalozzi
--
-- Reproduce el contenido publicado en el sitio: la grilla de horarios, las
-- tres tarjetas de novedades y la nota vacía de la bibliotecaria.
--
-- Es idempotente: los INSERT OR IGNORE con identificadores fijos no duplican
-- filas si el seed se ejecuta más de una vez.
-- El usuario administrador no se incluye acá porque su contraseña se hashea
-- con bcrypt en el seeder (backend/src/config/seeder.js).
-- ============================================================================

INSERT OR IGNORE INTO horarios (id, dia_orden, dia_nombre, horario_texto, activo) VALUES
  (1, 1, 'Lunes',     'Cerrado',        0),
  (2, 2, 'Martes',    '16:00 – 18:00',  1),
  (3, 3, 'Miércoles', '10:00 – 12:00',  1),
  (4, 4, 'Jueves',    'Cerrado',        0),
  (5, 5, 'Viernes',   'Cerrado',        0),
  (6, 6, 'Sábado',    'Cerrado',        0),
  (7, 7, 'Domingo',   'Cerrado',        0);

INSERT OR IGNORE INTO novedades (id, orden, categoria, categoria_color, fecha_texto, titulo, descripcion, activa) VALUES
  (1, 1, 'Donación provincial', '#8b5e2b', 'Agosto 2025',
   '85 nuevos títulos de literatura argentina',
   'El Ministerio de Educación de la Provincia de Buenos Aires donó una colección de 85 libros de autores nacionales, incluyendo obras de narrativa, poesía y ensayo.',
   1),
  (2, 2, 'Recomendación de la semana', '#6b1d2b', 'Septiembre 2025',
   '“El Eternauta” – H.G. Oesterheld',
   'Clásico imprescindible de la historieta argentina. Disponible en nuestra sala de lectura para consulta en el local.',
   1),
  (3, 3, 'Donación de socios', '#3d5a3e', 'Octubre 2025',
   'Fondo de colectividades: 40 nuevas incorporaciones',
   'Gracias a la generosidad de familias de la comunidad italiana y española de Berisso, incorporamos nuevos materiales a la colección de colectividades de inmigrantes.',
   1);

INSERT OR IGNORE INTO notas (id, contenido) VALUES (1, '');
