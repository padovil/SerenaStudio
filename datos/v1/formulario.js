/*! © 2026 Serena Studio · Formulario de datos con los paquetes anteriores (/datos/v1/) */
"use strict";

/* =====================================================================
   1. CONFIGURACIÓN
   ===================================================================== */

/* WhatsApp del estudio que recibe las respuestas (con indicativo, sin +) */
const WHATSAPP_ESTUDIO = "573185088370";
/* Clave del borrador guardado en el dispositivo */
const CLAVE_BORRADOR = "serena-formulario-anterior";


/* =====================================================================
   2. CATÁLOGO — PAQUETES ANTERIORES (para clientes que compraron con esos precios)
   Esencial $180.000 · Completa $260.000 · A medida $340.000 · Solo PDF $130.000
   ===================================================================== */

const E = "esencial", C = "completa", M = "medida", P = "pdf";

/* Precio base de cada paquete, en pesos */
const PLANES = { esencial: 180000, completa: 260000, medida: 340000, pdf: 130000 };

/* Lista "Incluye:" que se muestra al elegir el paquete */
const INCLUYE = {
  esencial: ["Nombres, fecha, ceremonia y recepción", "Uno de nuestros diseños con sus datos y colores", "“Cómo llegar” con Google Maps",
    "Cuenta regresiva y botón de calendario", "Confirmación de asistencia por WhatsApp", "1 ronda de ajustes", "Primera versión en 3 días"],
  completa: ["Todo lo de Esencial", "Foto de portada y galería", "Música de fondo con botón de play", "Regalos o lluvia de sobres con botón “Copiar”",
    "Cronograma y código de vestimenta", "Vista previa al compartir en WhatsApp", "Link con el nombre de cada invitado", "2 rondas de ajustes",
    "Primera versión en 3 días"],
  medida: ["Nombres, fecha, ceremonia y recepción", "Estilo, paleta y tipografía exclusivos", "3 rondas de ajustes", "Primera versión en 3 días"],
  pdf: ["Tarjeta en PDF", "Enlaces a la ubicación y a la confirmación por WhatsApp", "Primera versión en 3 días"]
};

/* Ítems que trae cada paquete. El id también activa las preguntas con data-si="id" en el HTML */
const INCL = {
  comoLlegar: [E, C, M, P], cuenta: [E, C, M], portada: [C, M], galeria: [C, M], musica: [C, M], regalos: [C, M],
  cronograma: [C, M], vestimenta: [C, M], vista: [C, M], links: [C, M], monograma: [M], sobre: [M], pdfv: [M],
  form: [M], hospedaje: [M]
};

/* En A medida, lo incluido se puede desmarcar: [id, texto] */
const MEDIDA_OPCIONAL = [
  ["comoLlegar", "“Cómo llegar” con Google Maps"],
  ["cuenta", "Cuenta regresiva y botón de calendario"],
  ["portada", "Foto de portada"],
  ["galeria", "Galería de fotos"],
  ["musica", "Música de fondo con botón de play"],
  ["regalos", "Regalos o lluvia de sobres con botón “Copiar”"],
  ["cronograma", "Cronograma del día"],
  ["vestimenta", "Código de vestimenta"],
  ["vista", "Vista previa al compartir en WhatsApp"],
  ["links", "Link con el nombre de cada invitado"],
  ["monograma", "Monograma con sus iniciales"],
  ["sobre", "Sobre animado o portada ilustrada"],
  ["pdfv", "Versión PDF de la invitación"],
  ["form", "Formulario de confirmación que llena un Excel (cortesía)"],
  ["hospedaje", "Hospedaje sugerido para sus invitados (cortesía)"]
];

/* Extras: precio por paquete (si un paquete no aparece, el extra no se ofrece en él).
   grupo: solo se puede marcar uno del mismo grupo · dias: días que se muestran */
const TODOS = valor => ({ esencial: valor, completa: valor, medida: valor, pdf: valor });
const EXTRAS = [
  { id: "links", nombre: "Link con el nombre de cada invitado", precio: { esencial: 50000 } },
  { id: "pdfv", nombre: "Versión PDF de la invitación", precio: { esencial: 40000, completa: 40000 } },
  { id: "form", nombre: "Formulario de confirmación que llena un Excel (número de personas y alergias)", precio: { esencial: 30000, completa: 30000 } },
  { id: "qr", nombre: "QR para que sus invitados suban las fotos de la boda", precio: TODOS(40000) },
  { id: "estados", nombre: "Imagen para estados o “save the date”", precio: TODOS(40000) },
  { id: "idioma", nombre: "Versión en otro idioma", precio: TODOS(50000) },
  { id: "ronda", nombre: "Ronda adicional de ajustes", precio: TODOS(30000) },
  { id: "exp-hoy", grupo: "express", nombre: "Entrega express: primera versión el mismo día",
    precio: { esencial: 70000, completa: 110000, medida: 160000, pdf: 50000 } },
  { id: "dominio", nombre: "Dominio propio por un año", precio: { esencial: 90000, completa: 90000, medida: 90000 } }
];

/* Precio acordado para un cliente puntual: /datos/v1/?paquete=medida&precio=300000 */
const URL_PARAMS = new URLSearchParams(location.search);
const PRECIO_ESPECIAL = { plan: URL_PARAMS.get("paquete"), precio: Number(URL_PARAMS.get("precio")) || 0 };


/* =====================================================================
   3. UTILIDADES
   ===================================================================== */

const $ = id => document.getElementById(id);
const form = $("form");
const crear = (tag, props = {}) => Object.assign(document.createElement(tag), props);
const pesos = n => "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
function fechaLarga(v){
  if (!v) return "";
  const [a, m, d] = v.split("-").map(Number);
  return DIAS[new Date(a, m - 1, d).getDay()] + " " + d + " de " + MESES[m - 1] + " de " + a;
}
function horaLarga(v){
  if (!v) return "";
  let [h, mi] = v.split(":").map(Number);
  const pm = h >= 12; h = h % 12 || 12;
  return h + ":" + String(mi).padStart(2, "0") + (pm ? " p. m." : " a. m.");
}
function hoyISO(){
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}


/* =====================================================================
   4. PAQUETE, EXTRAS Y TOTAL
   ===================================================================== */

const planActual = () => form.querySelector('input[name="Paquete"]:checked')?.dataset.plan || "";
const precioBase = plan => (PRECIO_ESPECIAL.precio && PRECIO_ESPECIAL.plan === plan) ? PRECIO_ESPECIAL.precio : PLANES[plan];

/* ¿La invitación tendrá este ítem? (por paquete, por lo que dejaron marcado en A medida o por extra) */
function tiene(id){
  const plan = planActual();
  if (!plan) return false;
  if (plan === M) {
    const opcional = $("p_incluye").querySelector('input[data-inc="' + id + '"]');
    if (opcional) return opcional.checked;
  }
  if ((INCL[id] || []).includes(plan)) return true;
  return !!$("p_extras").querySelector('input[data-id="' + id + '"]:checked');
}

function casilla(nombre, valor, texto, precio){
  const label = crear("label", { className: "extra" });
  const input = crear("input", { type: "checkbox", name: nombre, value: valor });
  label.append(input, crear("span", { textContent: texto }));
  if (precio) label.append(crear("b", { textContent: precio }));
  return { label, input };
}

/* Dibuja "Incluye" y los extras del paquete elegido (solo cuando cambia el paquete) */
let planDibujado = null;
function dibujarPaquete(plan){
  const marcadosAntes = new Set([...$("p_extras").querySelectorAll("input:checked")].map(c => c.dataset.id));

  const incluye = $("p_incluye");
  incluye.replaceChildren(crear("b", { textContent: "Incluye:" }));
  const ul = crear("ul");
  INCLUYE[plan].forEach(t => ul.append(crear("li", { textContent: t })));
  incluye.append(ul);

  if (plan === M) {
    incluye.append(crear("p", { className: "nota", textContent: "Desmarquen lo que no quieran en su invitación:" }));
    const lista = crear("div", { className: "extras" });
    MEDIDA_OPCIONAL.forEach(([id, texto]) => {
      const { label, input } = casilla("Del paquete quieren", texto, texto);
      input.checked = true;
      input.dataset.inc = id;
      input.dataset.omitir = "1";          /* no va al resumen: se resume en "No quieren del paquete" */
      lista.append(label);
    });
    incluye.append(lista);
  }

  const extras = $("p_extras");
  extras.replaceChildren();
  EXTRAS.filter(x => x.precio[plan] && !(INCL[x.id] || []).includes(plan)).forEach(x => {
    const nombre = x.dias ? x.nombre + " (" + x.dias[plan] + " días hábiles)" : x.nombre;
    const { label, input } = casilla("Extras", nombre + " (+" + pesos(x.precio[plan]) + ")", nombre, "+" + pesos(x.precio[plan]));
    input.dataset.id = x.id;
    input.dataset.precio = x.precio[plan];
    if (x.grupo) input.dataset.grupo = x.grupo;
    input.checked = marcadosAntes.has(x.id);
    extras.append(label);
  });

  planDibujado = plan;
}

function actualizarPaquete(){
  const plan = planActual();
  $("p_detalle").hidden = !plan;
  $("total_barra").hidden = !plan;
  if (!plan) return;
  if (plan !== planDibujado) dibujarPaquete(plan);

  let total = precioBase(plan);
  $("p_extras").querySelectorAll("input:checked").forEach(c => { total += Number(c.dataset.precio); });
  const acordado = precioBase(plan) !== PLANES[plan] ? " (precio acordado " + pesos(precioBase(plan)) + " + extras)" : "";

  $("p_total").textContent = pesos(total);
  $("p_total_in").value = pesos(total) + acordado;
  $("p_quitar").value = [...$("p_incluye").querySelectorAll("input:not(:checked)")].map(c => c.value).join(", ");
  $("total_barra").textContent = "Total estimado: " + pesos(total);
}

/* ?paquete=… deja ese paquete elegido (por ejemplo, desde los botones "Elegir" de la página).
   Con &precio=… además deja solo ese paquete con el precio acordado */
function aplicarPrecioEspecial(){
  if (!PLANES[PRECIO_ESPECIAL.plan]) return;
  const radio = form.querySelector('input[data-plan="' + PRECIO_ESPECIAL.plan + '"]');
  radio.checked = true;
  if (!PRECIO_ESPECIAL.precio) return;
  form.querySelectorAll('input[name="Paquete"]').forEach(r => { r.closest("label").hidden = r !== radio; });
  const tarjeta = radio.closest("label");
  tarjeta.querySelector(".plan-p").textContent = pesos(PRECIO_ESPECIAL.precio);
  tarjeta.querySelector(".plan-d").textContent = "Precio acordado con Serena Studio.";
}


/* =====================================================================
   5. MOSTRAR SOLO LO QUE APLICA
   ===================================================================== */

let teniaFormulario = null;

function actualizarVista(){
  actualizarPaquete();
  const plan = planActual();

  /* Preguntas ligadas a ítems del paquete: data-si="id1 id2" */
  document.querySelectorAll("[data-si]").forEach(el => { el.hidden = !el.dataset.si.split(" ").some(tiene); });

  /* Título del bloque de fotos y música */
  const fotos = ["portada", "galeria", "historia"].some(tiene), musica = tiene("musica");
  $("m_titulo").textContent = fotos && musica ? "Fotos y canción en link" : fotos ? "Fotos en link" : "Canción en link";
  $("m_titulo").previousElementSibling.dataset.t = fotos && musica ? "Fotos y música" : fotos ? "Fotos" : "Música";

  /* Recepción y regalos */
  $("re_otro").hidden = !$("re_mismo_no").checked;
  $("g_trans").hidden = !form.querySelector('input[name="Regalos"][value="Transferencia"]').checked;
  $("g_mesa_box").hidden = !form.querySelector('input[name="Regalos"][value="Mesa de regalos"]').checked;

  /* Confirmación: formulario a Excel (A medida o extra) o WhatsApp */
  const conFormulario = tiene("form");
  if (!conFormulario && $("r_hoja").checked) $("r_wa").checked = true;
  if (conFormulario && teniaFormulario === false) $("r_hoja").checked = true;
  teniaFormulario = conFormulario;
  $("r_metodo").hidden = !conFormulario;
  $("r_hoja_box").hidden = !$("r_hoja").checked;
  $("r_wa_box").hidden = !$("r_wa").checked;
  $("r_nota_wa").hidden = conFormulario || !plan;
  $("r_nota_wa").textContent = "Sus invitados confirman por WhatsApp con un mensaje ya escrito." +
    (plan === E || plan === C ? " Si prefieren un formulario que llene un Excel, lo pueden sumar como extra por $30.000 en el bloque de su paquete (viene incluido en A medida)." : "");

  actualizarMuestra(plan);
  $("q_link_box").hidden = !$("q_tengo").checked;
  numerarBloques();
}

/* Muestras: Solo PDF ve la tarjeta en PDF; los demás, las web; A medida puede pedir un diseño nuevo */
function actualizarMuestra(plan){
  const sel = $("d_muestra");
  [...sel.options].forEach(o => {
    if (!o.dataset.tipo) return;
    const ok = o.dataset.tipo === "nuevo" ? plan === M : (!plan || (plan === P) === (o.dataset.tipo === "pdf"));
    o.hidden = !ok;
    o.disabled = !ok;
  });
  if (sel.selectedOptions[0]?.disabled) sel.value = "";

  const medida = plan === M;
  sel.required = !medida;
  $("d_req").hidden = medida;
  $("d_label").textContent = medida ? "Muestra de partida (opcional)" : "Muestra";
  $("d_ayuda").textContent = medida
    ? "Su invitación se diseña desde cero. Si alguna de nuestras muestras les gusta como punto de partida, elíjanla; si no, elijan “Un diseño nuevo” y cuéntennos su idea en referencias."
    : "Partimos de una de nuestras muestras y la adaptamos a ustedes. Elijan la que más les guste y luego cuéntennos qué quieren cambiar.";

  const nuevo = sel.value.startsWith("Un diseño nuevo");
  $("d_colores_radio").hidden = nuevo;
  $("d_colores_box").hidden = !(nuevo || $("d_cambiar").checked);

  const op = sel.selectedOptions[0];
  const conImagen = !!op?.dataset.img;
  $("d_vista").hidden = !conImagen;
  if (conImagen && !$("d_vista_img").src.endsWith(op.dataset.img)) {
    $("d_vista_img").src = "/img/pantallas/" + op.dataset.img;
    $("d_vista_img").alt = "Vista previa de la muestra " + op.value;
    $("d_vista_link").href = op.dataset.url;
  }
}

/* Numera solo los bloques visibles */
function numerarBloques(){
  let n = 0;
  form.querySelectorAll("fieldset").forEach(fs => {
    const etiqueta = fs.querySelector("legend span");
    if (!etiqueta.dataset.t) etiqueta.dataset.t = etiqueta.textContent.replace(/^\d+\s·\s/, "");
    if (!fs.hidden) etiqueta.textContent = (++n) + " · " + etiqueta.dataset.t;
  });
}


/* =====================================================================
   6. BORRADOR EN EL DISPOSITIVO
   ===================================================================== */

const claveDe = el => (el.type === "checkbox" || el.type === "radio") ? el.name + "|" + el.value : el.id;

function guardarBorrador(){
  const datos = {};
  form.querySelectorAll("input, select, textarea").forEach(el => {
    const k = claveDe(el);
    if (k) datos[k] = (el.type === "checkbox" || el.type === "radio") ? el.checked : el.value;
  });
  try {
    localStorage.setItem(CLAVE_BORRADOR, JSON.stringify(datos));
    $("guardado").textContent = "Guardado en este dispositivo.";
  } catch (e) { /* sin almacenamiento: el formulario sigue funcionando */ }
}

function cargarBorrador(){
  let datos = null;
  try { datos = JSON.parse(localStorage.getItem(CLAVE_BORRADOR) || "null"); } catch (e) { return; }
  if (!datos) return;
  form.querySelectorAll("input, select, textarea").forEach(el => {
    const k = claveDe(el);
    if (!k || !(k in datos)) return;
    if (el.type === "checkbox" || el.type === "radio") el.checked = !!datos[k];
    else el.value = datos[k];
  });
}


/* =====================================================================
   7. VALIDACIÓN
   ===================================================================== */

const RE_CORREO = /^[^\s@,;]+@[^\s@,;]+\.[a-z]{2,}$/i;
const SITIOS = {
  m_fotos: "Google Drive o Google Fotos", q_link: "Google Fotos o Google Drive",
  m_cancion: "YouTube o Google Drive", ce_maps: "Google Maps", re_maps: "Google Maps"
};

function telefonoValido(v){
  const d = v.replace(/[\s().-]/g, "");
  return /^3\d{9}$/.test(d)            /* celular colombiano */
    || /^(\+?57)3\d{9}$/.test(d)       /* con indicativo */
    || /^\+\d{8,15}$/.test(d);         /* otro país, con + */
}
function dominioDe(v){
  try { return new URL(v).hostname.replace(/^www\./, "").toLowerCase(); } catch (e) { return ""; }
}

/* Mensaje de error del campo, o "" si está bien */
function errorDe(el){
  if (el.closest("[hidden]") || el.disabled) return "";
  const v = (el.value || "").trim();
  if (!v) return el.required ? "Este dato es obligatorio." : "";
  if (el.minLength > 0 && v.length < el.minLength) return "Escriban al menos " + el.minLength + " caracteres.";

  if (el.type === "tel" && !telefonoValido(v))
    return "Escriban un celular válido de 10 dígitos, ej. 300 123 4567 (si es de otro país, con + e indicativo).";

  if (el.type === "email") {
    const lista = el.multiple ? v.split(",").map(x => x.trim()).filter(Boolean) : [v];
    const malo = lista.find(x => !RE_CORREO.test(x));
    if (malo) return "«" + malo + "» no es un correo válido." + (el.multiple ? " Si son varios, sepárenlos con comas." : "");
  }

  if (el.type === "url") {
    if (!/^https?:\/\/\S+\.\S+$/i.test(v)) return "Debe ser un link completo que empiece por https://";
    if (el.dataset.dominios) {
      const host = dominioDe(v);
      const ok = el.dataset.dominios.split(" ").some(d => host === d || host.endsWith("." + d));
      if (!ok) return "Este link debe ser de " + (SITIOS[el.id] || "el sitio indicado") + ".";
    }
  }

  if (el.type === "date") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Elijan una fecha válida.";
    if ("futuro" in el.dataset && v <= hoyISO()) return "La fecha debe ser posterior a hoy.";
    const limite = el.dataset.antes && $(el.dataset.antes).value;
    if (limite && v >= limite) return "Debe ser antes de la fecha de la boda.";
  }

  const tipo = el.dataset.tipo;
  if (tipo === "persona" && !/^[\p{L}][\p{L}\s.'&-]*$/u.test(v)) return "Usen solo letras.";
  if (tipo === "hashtag" && !/^#[\p{L}\p{N}_]+$/u.test(v)) return "Un hashtag va sin espacios ni signos, ej. #LauraYFelipe2026.";
  if (tipo === "dominio" && !/^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(v.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "")))
    return "Escriban un dominio como lauryfelipe.com";
  return "";
}

/* Muestra u oculta el mensaje debajo del campo */
function marcar(el, mensaje){
  const id = "err-" + el.id;
  let p = $(id);
  if (!mensaje) {
    p?.remove();
    el.removeAttribute("aria-invalid");
    return;
  }
  if (!p) {
    p = crear("p", { className: "err", id });
    (el.closest(".campo") || el.parentElement).append(p);
    el.setAttribute("aria-describedby", ((el.getAttribute("aria-describedby") || "") + " " + id).trim());
  }
  p.textContent = mensaje;
  el.setAttribute("aria-invalid", "true");
}

/* Arreglos automáticos al salir de un campo */
function corregir(el){
  const v = el.value.trim();
  if (el.dataset.tipo === "hashtag" && v && !v.startsWith("#")) el.value = "#" + v.replace(/\s+/g, "");
  else if (el.type === "url" && /^([a-z0-9-]+\.)+[a-z]{2,}(\/|$)/i.test(v)) el.value = "https://" + v;
  else if (el.tagName !== "TEXTAREA" && v !== el.value) el.value = v;
}

const camposConDatos = () =>
  [...form.querySelectorAll("input:not([type=hidden]):not([type=radio]):not([type=checkbox]), select, textarea")].filter(el => el.id);

function validarTodo(){
  const malos = [];
  if (!planActual()) malos.push({ el: form.querySelector('input[name="Paquete"]'), nombre: "Paquete", mensaje: "Elijan un paquete." });
  camposConDatos().forEach(el => {
    const mensaje = errorDe(el);
    marcar(el, mensaje);
    if (mensaje) {
      const etiqueta = form.querySelector('label[for="' + el.id + '"]')?.textContent || el.name;
      malos.push({ el, nombre: etiqueta.replace("*", "").replace(/\s+/g, " ").trim(), mensaje });
    }
  });

  const caja = $("errores");
  caja.hidden = !malos.length;
  if (!malos.length) return true;

  const ul = crear("ul");
  malos.forEach(m => ul.append(crear("li", { textContent: m.nombre + ": " + m.mensaje })));
  caja.replaceChildren("Revisen estos datos:", ul);
  caja.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => malos[0].el.focus({ preventScroll: true }), 400);
  return false;
}


/* =====================================================================
   8. RESUMEN Y ENVÍO POR WHATSAPP
   ===================================================================== */

function armarResumen(){
  const lineas = ["*Datos para la invitación · Serena Studio*", ""];
  form.querySelectorAll("fieldset").forEach(fs => {
    const items = [];
    const gruposVistos = new Set();
    fs.querySelectorAll("input, select, textarea").forEach(el => {
      if (el.closest("[hidden]") || el.dataset.omitir) return;
      let v;
      if (el.type === "checkbox" || el.type === "radio") {
        if (gruposVistos.has(el.name)) return;
        gruposVistos.add(el.name);
        v = [...fs.querySelectorAll('input[name="' + el.name + '"]:checked')].map(x => x.value).join(", ");
      } else if (el.type === "date") v = fechaLarga(el.value);
      else if (el.type === "time") v = horaLarga(el.value);
      else v = el.value.trim();
      if (v) items.push("• " + el.name + (v.includes("\n") ? ":\n" : ": ") + v);
    });
    if (items.length) lineas.push("*" + fs.querySelector("legend span").textContent.trim() + "*", ...items, "");
  });
  return lineas.join("\n").trim();
}

function mostrarListo(){
  const texto = armarResumen();
  $("resumen").textContent = texto;
  $("btn-wa").href = "https://wa.me/" + WHATSAPP_ESTUDIO + "?text=" + encodeURIComponent(texto);
  const nombres = $("p_nombres").value.trim();
  $("listo-nombres").textContent = nombres ? ", " + nombres : "";
  form.hidden = true;
  $("listo").hidden = false;
  $("listo").focus();
  window.scrollTo({ top: $("listo").offsetTop - 20, behavior: "smooth" });
}

function copiarResumen(){
  const aviso = $("copiado");
  const seleccionar = () => {
    const rango = document.createRange();
    rango.selectNodeContents($("resumen"));
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(rango);
    aviso.textContent = "Texto seleccionado: cópienlo con el menú del dispositivo.";
  };
  if (!navigator.clipboard?.writeText) return seleccionar();
  navigator.clipboard.writeText($("resumen").textContent)
    .then(() => { aviso.textContent = "Copiado. Péguenlo en el chat de WhatsApp."; }, seleccionar);
}


/* =====================================================================
   9. EVENTOS Y ARRANQUE
   ===================================================================== */

/* Solo una opción por grupo (entrega express) */
form.addEventListener("change", e => {
  const c = e.target;
  if (!c.dataset?.grupo || !c.checked) return;
  form.querySelectorAll('input[data-grupo="' + c.dataset.grupo + '"]').forEach(x => { if (x !== c) x.checked = false; });
}, true);

let esperaGuardado;
form.addEventListener("input", e => {
  const el = e.target;
  if (el.getAttribute?.("aria-invalid") === "true" && !errorDe(el)) marcar(el, "");   /* quita el error apenas se corrige */
  actualizarVista();
  clearTimeout(esperaGuardado);
  esperaGuardado = setTimeout(guardarBorrador, 400);
});
form.addEventListener("change", () => { actualizarVista(); guardarBorrador(); });

form.addEventListener("focusout", e => {
  const el = e.target;
  if (!el.id || !("value" in el) || el.type === "checkbox" || el.type === "radio") return;
  corregir(el);
  marcar(el, errorDe(el));
  if (el.id === "f_fecha" && $("r_limite").value) marcar($("r_limite"), errorDe($("r_limite")));
});

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!validarTodo()) return;
  guardarBorrador();
  mostrarListo();
});

$("btn-editar").addEventListener("click", () => { $("listo").hidden = true; form.hidden = false; $("c_nombre").focus(); });
$("btn-copiar").addEventListener("click", copiarResumen);

/* El borrador se carga dos veces: la segunda recupera los extras, que se dibujan según el paquete */
cargarBorrador(); actualizarVista();
cargarBorrador(); aplicarPrecioEspecial(); actualizarVista();
