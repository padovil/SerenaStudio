# Invitación Mariana & Sebastián

Muestra de portafolio de **Serena Studio**. Datos ficticios.

Sitio: https://serena-studio.vercel.app/muestras/mariana-y-sebastian/

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La invitación (estructura y estilos) |
| `invitacion.js` | Funciones: cuenta regresiva, música, enlaces, copiar cuenta |
| `FOTO_*.jpg` | Fotos de la pareja |
| `og-imagen.jpg` | Imagen al compartir el link (1200 × 630) |
| `cancion.mp3` | Música de fondo |
| `fuentes/` | Tipografías alojadas en el mismo sitio |

## Seguridad

- **Política de seguridad (CSP)** en `index.html`: solo se cargan archivos de este
  mismo sitio. No hay scripts en línea, formularios ni conexiones a terceros.
  Si se agrega un recurso externo (por ejemplo, un mapa), hay que permitirlo en esa etiqueta.
- **Sin dependencias externas**: las fuentes están en `fuentes/`, así no se carga nada de Google.
- **Parámetros del link** (`?para=` y `?cupos=`): se muestran como texto plano, nunca como HTML.
- **Enlaces externos** con `rel="noopener noreferrer"`.
- **Protección contra marcos**: si otro sitio intenta mostrar la invitación dentro de un
  `iframe`, la página se sale del marco.

## Antes de publicar la invitación de un cliente real

- Cambiar `robots` a `noindex, nofollow` para que no aparezca en Google.
- No publicar el número de cuenta completo si la pareja no lo autoriza.
- Usar un repositorio privado (Netlify o Cloudflare Pages lo publican gratis).
- Confirmar que la pareja tiene derecho a usar la canción y las fotos.
