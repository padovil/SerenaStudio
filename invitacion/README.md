# Invitaciones de clientes

Cada invitación real va en su propia carpeta dentro de `invitacion/`:

```
invitacion/laura-y-juan-7k2/
  index.html
  invitacion.js
  fuentes/
  fotos, cancion.mp3, og-imagen.jpg…
```

La invitación queda en `https://DOMINIO/invitacion/laura-y-juan-7k2/`.

## Pasos para una invitación nueva

1. **Copiar** la carpeta de la muestra que eligió la pareja (`muestras/<estilo>/`) a `invitacion/<nombres>-<3 caracteres al azar>/`.
   Los caracteres al azar evitan que alguien adivine el link cambiando los nombres.
2. **Cambiar los datos** en `index.html` y en el bloque `EVENTO` de `invitacion.js`.
3. **Privacidad (obligatorio):** en `index.html`
   - cambiar `<meta name="robots" content="index, follow, …">` por `<meta name="robots" content="noindex, nofollow, noarchive">`;
   - borrar el bloque `<script type="application/ld+json">` (datos del evento para Google);
   - quitar el párrafo `<p class="credito">…</p>` del final si la pareja no quiere el crédito de Serena Studio.
4. **Actualizar las URL** de `canonical`, `og:url`, `og:image` y `twitter:image` con la dirección nueva.
5. **No agregarla** a `sitemap.xml`.

Aunque se olvide el paso 3, `vercel.json` ya envía `X-Robots-Tag: noindex` para todo lo que está en `invitacion/`.
