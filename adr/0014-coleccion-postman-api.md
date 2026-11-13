# ADR-0014: Colección de Postman para la API REST

- **Estado**: Aceptado
- **Fecha**: 2026-11-13
- **Autor/Proyecto**: Biblioteca Popular Pestalozzi

## Contexto

La API REST del backend cuenta con endpoints públicos y protegidos para autenticación, horarios, visitas, novedades, notas, contactos y catálogos. Las pruebas existentes cubren una parte del contrato, pero no ofrecen un recurso importable para probar manualmente todos los módulos.

## Decisión

Se incorpora una colección compatible con Postman Collection v2.1 en `backend/docs/postman/collection/`. La colección centraliza la URL base, credenciales de desarrollo, token JWT e identificadores generados. El login guarda automáticamente el token y las operaciones de alta guardan los IDs necesarios para las operaciones posteriores.

## Consecuencias

- El equipo puede importar y ejecutar la colección sin configurar cada request manualmente.
- Las operaciones protegidas requieren ejecutar primero `Auth > Iniciar sesión`.
- Los ejemplos de creación y actualización modifican la base de datos configurada por el backend; deben ejecutarse sobre un entorno de desarrollo o pruebas.
