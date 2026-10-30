# ADR-0002: Despliegue en Plataformas de Hosting Estático de Costo Recurrente Cero ($0 ARS)

- **Estado**: Aceptado
- **Fecha**: 2026-10-02
- **Autor**: Grupo Clouds (Eduardo Moreno, Leandro Paryszewski, Marcelo Moreno, Melissa Galeano Ibañez)
- **Proyecto**: Sistema Web Institucional — Biblioteca Popular Pestalozzi (Berisso)

---

## Contexto

Tanto la cliente (Biblioteca Popular Pestalozzi) como el marco de la Práctica Profesionalizante exigen una solución real y operativa en producción, pero bajo una restricción estricta de presupuesto de $0.00 ARS en licencias, servidores dedicados y dominios comerciales.

## Decisión

Desplegar la aplicación web estática en plataformas de hosting gratuito con CI/CD automatizado, utilizando GitHub Pages (enlace directo desde el repositorio oficial `hleopary/biblioteca-pestalozzi-web`) y evaluando Vercel o Cloudflare Pages como alternativas.

## Consecuencias

### Positivas
- **Costo recurrente nulo**: Garantiza un costo operativo de $0.00 ARS para la biblioteca popular a perpetuidad.
- **Seguridad**: Provisión automática y gratuita de certificados de seguridad SSL/TLS (HTTPS).
- **Integración continua**: Despliegues automáticos ante cada actualización de la rama de publicación designada.

### Negativas / Limitaciones
- Sujeto a los términos, cuotas y límites de ancho de banda del plan gratuito (Community Free Tier) de la plataforma elegida (suficientes para el tráfico institucional previsto).
