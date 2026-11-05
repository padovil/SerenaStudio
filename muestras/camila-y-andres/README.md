# Invitación "Cereza" · Camila & Andrés

© 2026 Serena Studio. Todos los derechos reservados (ver `LICENSE`).

Muestra de portafolio de invitación digital de boda. Datos de la pareja, lugares y cuenta bancaria son de ejemplo.
Publicada en https://serenastudio-peach.vercel.app/muestras/camila-y-andres/

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La invitación: estructura, estilos, metadatos SEO/Open Graph y datos estructurados (JSON-LD). |
| `invitacion.js` | Toda la lógica: cuenta regresiva, saludo personalizado, mapas, calendario, copiar cuenta, RSVP por WhatsApp, música, fotos que fallan y protección contra marcos. |
| `fotos/portada-bn.jpg`, `fotos/ramo-bn.jpg`, `fotos/baile-bn.jpg` | Fotos de la invitación. |
| `og-imagen-bn.jpg` | Vista previa de 1200 × 630 para WhatsApp y redes. |
| `cancion.mp3` | Música de fondo. |
| `fuentes/*.woff2` | Cormorant Garamond, Hanken Grotesk e Italianno (subconjunto latin), servidas desde el propio sitio. |
| `fuentes/LICENCIA-FUENTES-OFL.txt` | Copyright y licencia OFL 1.1 de las fuentes. |
| `robots.txt`, `sitemap.xml` | Indexación en buscadores (solo para portafolio). |
| `vercel.json` | Cabeceras de seguridad del servidor en Vercel. |
| `LICENSE` | Derechos reservados de Serena Studio y aclaración de contenido de terceros. |

## Personalizar el link por invitado

`https://serenastudio-peach.vercel.app/muestras/camila-y-andres/?para=Familia%20Gómez&cupos=3`

- `para`: nombre del saludo (máx. 60 caracteres; se muestra como texto plano).
- `cupos`: número de lugares reservados (se convierte a número; limita el selector de personas).

## Medidas de seguridad aplicadas

- **Sin código en línea:** todo el JavaScript está en `invitacion.js` (con `"use strict"`, cargado con `defer`). El único `<script>` en línea es el JSON-LD, que es dato y no se ejecuta. No hay `onclick`, `onerror` ni similares.
- **Content-Security-Policy** (meta en el `<head>`): solo se cargan scripts, fuentes, imágenes y audio del propio sitio; sin conexiones de red desde el script, sin `<object>`, sin `<base>` y sin envío de formularios a otros sitios. No se necesitó ningún dominio externo: los enlaces a Google Maps, Google Calendar y WhatsApp son navegaciones normales y la CSP no las restringe.
- **Cabeceras en Vercel** (`vercel.json`): `frame-ancestors 'none'` y `X-Frame-Options: DENY` (impiden meter la invitación en un iframe; esto no se puede hacer con una etiqueta meta), `nosniff`, política de referencia y `Permissions-Policy` sin cámara, micrófono, ubicación ni pagos.
- **Protección contra marcos en JS** como respaldo: si la página está dentro de un iframe intenta abrirse sola y, si no puede, se oculta.
- **Referrer** `strict-origin-when-cross-origin` y todos los `target="_blank"` con `rel="noopener noreferrer"`.
- **Datos del invitado:** `?para=` y `?cupos=` se escriben solo con `textContent`/`value`, nunca con `innerHTML`. Nombre recortado a 60 caracteres y cupos convertidos con `parseInt`.
- **Fuentes propias:** sin Google Fonts, así ningún tercero recibe la IP de los invitados al abrir la invitación.
- **`format-detection: telephone=no`:** el celular no convierte el número de cuenta en enlace de llamada.
- Sin bloqueo de clic derecho ni ofuscación (no protegen y empeoran la experiencia).

## Lista de verificación antes de publicar

- [ ] **Tipo de invitación.** Muestra de portafolio: dejar como está. Cliente real: `robots` a `noindex, nofollow` en `index.html`, `robots.txt` con `Disallow: /`, borrar `sitemap.xml` y el bloque JSON-LD.
- [ ] **URL final** en `canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD, `robots.txt` y `sitemap.xml`.
- [ ] **Datos del evento** en el bloque `EVENTO` de `invitacion.js`: fecha y hora (con `-05:00`), links reales de Google Maps y número de WhatsApp de la pareja.
- [ ] **Día de la semana** corresponde a la fecha (25/09/2027 es sábado).
- [ ] **Datos bancarios:** mostrar solo los últimos dígitos o usar llave Bre-B / Nequi. Publicar el número completo solo con autorización explícita de la pareja.
- [ ] **Permisos:** autorización por escrito para usar las fotos y licencia de la canción.
- [ ] **Vista previa:** `og-imagen.jpg` actualizada (1200 × 630, menos de 300 KB). Probar el link en WhatsApp después de publicar.
- [ ] **Repositorio privado** en GitHub si contiene datos reales de la pareja.
- [ ] Probar en celular: cuenta regresiva, "Cómo llegar", calendario, copiar cuenta, RSVP por WhatsApp y música.
