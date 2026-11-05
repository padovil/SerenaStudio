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
| `muestras/valentina-y-tomas/` | Estilo “Editorial” | Sí |
| `b/<pareja>-<código>/` | Invitaciones de clientes (instrucciones en `b/README.md`) | No |
| `vercel.json` | Encabezados de seguridad y `noindex` para `b/` | |
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

Funcionan igual en muestras y clientes: `…/b/laura-y-juan-7k2/?para=Familia%20Gómez&cupos=3`

## Licencia

© 2026 Serena Studio. Ver `LICENSE`. Las fuentes tienen licencia SIL Open Font License (ver `fuentes/`).
