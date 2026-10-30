# ADR-0003: Procesamiento Serverless para Formularios de Contacto y Visitas Escolares

- **Estado**: Aceptado
- **Fecha**: 2026-10-14
- **Autor**: Grupo Clouds (Eduardo Moreno, Leandro Paryszewski, Marcelo Moreno, Melissa Galeano Ibañez)
- **Proyecto**: Sistema Web Institucional — Biblioteca Popular Pestalozzi (Berisso)

---

## Contexto

El portal web requiere recibir solicitudes de visitas guiadas de escuelas primarias y consultas generales de la comunidad sin necesidad de desplegar, asegurar y mantener un servidor backend tradicional (como Node.js/Express) encendido 24/7.

## Decisión

Utilizar servicios de API Serverless (como Formspree o FormSubmit) para la recepción, procesamiento y retransmisión automática de los datos cargados en los formularios directamente al correo electrónico de la bibliotecaria. Toda la validación previa de campos obligatorios se resuelve del lado del cliente mediante la Constraint Validation API nativa de HTML5 y JavaScript.

## Consecuencias

### Positivas
- **Cero administración de servidores**: Elimina la necesidad de administrar instancias backend, parches del sistema operativo o bases de datos complejas para formularios.
- **Capacidad adecuada**: El nivel gratuito cubre hasta 500 envíos mensuales, volumen más que suficiente para la demanda de la biblioteca.
- **Recepción directa**: Las solicitudes llegan directamente a la bandeja de entrada habitual de la bibliotecaria sin requerir paneles de control extras.

### Negativas / Limitaciones
- Dependencia de la disponibilidad y tiempo de respuesta de servicios de terceros para el enrutamiento de correos electrónicos.
