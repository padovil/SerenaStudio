# Invitación · Nicolás & Liz

Muestra de portafolio de **Serena Studio**: invitación web para la boda del lunes 7 de diciembre de 2026 en La Marqueza (La Calera, Cundinamarca).

URL publicada: https://serena-studio.vercel.app/muestras/nicolas-y-liz/
Link personalizado por invitado: `https://serena-studio.vercel.app/muestras/nicolas-y-liz/?para=Familia%20Pérez&cupos=2`

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura, estilos y contenido de la invitación. |
| `invitacion.js` | Toda la lógica: sobre, música, cuenta regresiva, calendario, mapa, saludo personalizado. |
| `fuentes/` | Playfair Display SC, Playfair Display y Mulish en `.woff2` (latin), con su licencia OFL. |
| `foto-1.jpg`, `foto-2.jpg`, `foto-3.jpg` | Galería "Nosotros". |
| `og-imagen.jpg` | Vista previa al compartir el link (1200 × 630). |
| `favicon.svg` | Ícono de la pestaña (sello N·L). |
| `cancion.mp3` | Música de fondo (empieza al tocar el sello). |
| `robots.txt`, `sitemap.xml` | Indexación en buscadores (muestra de portafolio). |
| `LICENSE` | Derechos reservados de Serena Studio y titularidad de terceros. |

## Medidas de seguridad aplicadas

- **Sin JavaScript en línea**: todo el código está en `invitacion.js` (con `"use strict"`), cargado con `defer`. El único script en línea es el JSON-LD, que no se ejecuta.
- **Sin manejadores en línea** (`onclick`, `onerror`…): todo usa `addEventListener`.
- **Content Security Policy** en el `<head>`: solo se cargan recursos del propio sitio. Única excepción: `frame-src https://www.google.com`, necesaria para el mapa embebido de la sección Ubicación.
- **Fuentes alojadas en el sitio**: sin Google Fonts, así que no se comparte la IP de los invitados con terceros al abrir la invitación.
- **Referrer** `strict-origin-when-cross-origin` y todos los enlaces `target="_blank"` con `rel="noopener noreferrer"`.
- **Mapa en `iframe` con `sandbox`** y política de referer estricta.
- **Protección contra marcos**: si otro sitio incrusta la invitación, el script sale del marco o la oculta (GitHub Pages no permite el encabezado `frame-ancestors`).
- **Datos del link** (`?para=`, `?cupos=`): se muestran solo con `textContent`; el nombre se limita a 60 caracteres y los cupos pasan por `parseInt`.
- **`format-detection: telephone=no`** para que el celular no convierta números en enlaces.
- No hay datos bancarios: los regalos son lluvia de sobres.
- Sin bloqueo de clic derecho ni ofuscación.

## Lista de verificación antes de publicar

- [ ] Link del formulario de confirmación en `EVENTO.formularioUrl` (`invitacion.js`).
- [ ] Nombre del lugar confirmado: "La Marqueza" o "Hacienda Márquez".
- [ ] Ciudad confirmada (La Calera) y hora de fin (11:00 p. m. asumida).
- [ ] Derechos de uso de las fotos y de la canción confirmados por la pareja.
- [ ] GitHub Pages activo (Settings → Pages → rama `main`, carpeta raíz).
- [ ] Abrir el link en WhatsApp y comprobar que aparece `og-imagen.jpg`.
- [ ] Probar en iPhone y Android: sello, música, calendario, mapa y "Cómo llegar".
- [ ] Si deja de ser muestra y pasa a cliente real: `robots` a `noindex, nofollow`, `robots.txt` con `Disallow: /`, quitar `sitemap.xml` y el JSON-LD.
