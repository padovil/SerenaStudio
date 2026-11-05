# Serena Studio

Sitio de Serena Studio: página del estudio, muestras de invitaciones y las invitaciones de clientes, todo en un solo proyecto.

Dominio provisional: https://serenastudio-peach.vercel.app

## Estructura

| Ruta | Qué es | ¿Aparece en Google? |
|---|---|---|
| `index.html` | Página del estudio: muestras, paquetes, cómo funciona y contacto | Sí |
| `muestras/nicolas-y-liz/` | Estilo “Sobre de terciopelo” | Sí |
| `muestras/mariana-y-sebastian/` | Estilo “Bosque” | Sí |
| `muestras/camila-y-andres/` | Estilo “Cereza” | Sí |
| `muestras/valentina-y-tomas/` | Estilo “Bolillo” (encaje) | Sí |
| `muestras/isabella-y-martin/` | Tarjeta en PDF | Sí |
| `formulario/` | Formulario de datos para clientes: paquete, extras, total y datos de la boda (llega por WhatsApp) | No |
| `formulario/v1/` | El mismo formulario con los paquetes y precios anteriores | No |
| `invitacion/<pareja>-<código>/` | Invitaciones de clientes (instrucciones en `invitacion/README.md`) | No |
| `descargas/` | Brochure de precios en PDF | |
| `docs/` | Documentos internos (no se publican) | |
| `vercel.json` | Encabezados de seguridad, `noindex` para `formulario/` e `invitacion/` y redirecciones | |
| `robots.txt`, `sitemap.xml` | Indicaciones para buscadores | |
| `404.html` | Página para links que no existen | |

Cada carpeta de invitación es **independiente**: tiene sus propias fuentes, fotos, música y JavaScript.
Así, cambiar una invitación nunca afecta a otra.

## Publicar en Vercel

1. En vercel.com: **Add New → Project**, importar este repositorio.
2. Framework: **Other**. Sin comando de build. Directorio de salida: la raíz.
3. Proyecto publicado como `serenastudio` en `serenastudio-peach.vercel.app`.

Cada `git push` a `main` publica el sitio completo en un par de minutos.

## Cambiar al dominio propio

1. Comprar el dominio y agregarlo en Vercel: **Project → Settings → Domains**.
2. Cambiar todas las URL del proyecto con:

   ```
   python3 cambiar-dominio.py https://serenastudio.co
   ```

3. Hacer commit y push.
4. En Google Search Console, agregar el dominio y enviar `https://DOMINIO/sitemap.xml`.

## Links personalizados por invitado

Funcionan igual en muestras y clientes: `…/invitacion/laura-y-juan-7k2/?para=Familia%20Gómez&cupos=3`

## Formulario para clientes

`https://serenastudio-peach.vercel.app/formulario/`

- Para un cliente con precio acordado: `…/formulario/?paquete=medida&precio=340000` (paquetes: `esencial`, `clasica`, `medida`, `pdf`).
- Precios, extras y qué trae cada paquete están al inicio de `formulario/formulario.js` y deben coincidir con la tabla de `index.html`.
- El número que recibe las respuestas es `WHATSAPP_ESTUDIO` en el mismo archivo.

### Formulario con los paquetes anteriores

`https://serenastudio-peach.vercel.app/formulario/v1/` — para clientes que compraron con los precios iniciales (Esencial $180.000, Completa $260.000, A medida $340.000, Solo PDF $130.000, primera versión en 3 días). Es una copia de `formulario/` con su propio catálogo en `formulario/v1/formulario.js`; en A medida incluye de cortesía el formulario a Excel y el hospedaje.

## Licencia

© 2026 Serena Studio. Ver `LICENSE`. Las fuentes tienen licencia SIL Open Font License (ver `fuentes/`).
