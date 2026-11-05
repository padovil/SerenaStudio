# Confirmación con formulario → Hoja de Google (Excel)

Para invitaciones donde la pareja quiere que cada confirmación quede en una hoja de cálculo en lugar de llegar por WhatsApp. Sin costo, sin servidores: Google Sheets + Apps Script.

## 1. Crear la hoja (5 minutos, una vez por boda)

1. Con la cuenta de Google del estudio, crear una hoja nueva: `Confirmaciones · <Nombres> · <fecha>`.
2. Menú **Extensiones → Apps Script**. Borrar lo que haya y pegar el código de abajo. Guardar.
3. **Implementar → Nueva implementación** → tipo **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier persona**.
4. Autorizar (Google muestra "app no verificada": Configuración avanzada → Ir al proyecto).
5. Copiar la **URL de la aplicación web** (termina en `/exec`). Esa URL va en la invitación (`EVENTO.hojaUrl`).
6. **Compartir** la hoja con el Gmail de la pareja como *Lector* (o *Editor* si quieren marcar cosas). La pueden descargar en Excel desde *Archivo → Descargar → .xlsx*.

Las columnas se crean solas con las preguntas del formulario de la invitación; la primera es la fecha y hora de la respuesta.

## 2. Código de Apps Script

```javascript
/* Serena Studio · Confirmaciones de asistencia */
const HOJA = "Confirmaciones";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    if (p._hp) return salida({ ok: true });           // trampa anti-spam
    const libro = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = libro.getSheetByName(HOJA) || libro.insertSheet(HOJA);
    let enc = hoja.getLastRow() ? hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0] : [];
    if (!enc.length) { enc = ["Fecha"]; hoja.getRange(1, 1).setValue("Fecha").setFontWeight("bold"); hoja.setFrozenRows(1); }
    Object.keys(p).filter(k => k !== "_hp").slice(0, 20).forEach(k => {
      if (!enc.includes(k)) { enc.push(k); hoja.getRange(1, enc.length).setValue(k).setFontWeight("bold"); }
    });
    hoja.appendRow(enc.map(h => h === "Fecha" ? new Date() : limpiar(p[h])));
    return salida({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/* Evita que un texto se convierta en fórmula y corta textos larguísimos */
function limpiar(v) {
  v = String(v == null ? "" : v).slice(0, 500);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function salida(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
```

## 3. En la invitación

- `EVENTO.hojaUrl = "https://script.google.com/macros/s/…/exec"`.
- El envío usa `fetch(hojaUrl, { method: "POST", mode: "no-cors", body: new URLSearchParams(datos) })`. Con `no-cors` no se puede leer la respuesta: si `fetch` no lanza error, se muestra el aviso de "¡Confirmación recibida!".
- La política de seguridad (CSP) de la invitación debe permitirlo:
  `connect-src https://script.google.com https://script.googleusercontent.com`
- Incluir un campo oculto `_hp` (honeypot) que las personas no ven.
- Los nombres de los campos (`name`) son los títulos de las columnas: escribirlos en español claro ("Nombre", "Asiste", "Número de personas", "Alergias"…).

## 4. Antes de entregar

- Enviar 2 confirmaciones de prueba desde el celular y verificar que aparecen en la hoja.
- Borrar las filas de prueba.
- Si se cambia el código de Apps Script: **Implementar → Administrar implementaciones → Editar → Versión nueva** (la URL se mantiene).
