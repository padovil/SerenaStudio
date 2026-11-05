/*! © 2026 Serena Studio. Formulario de datos para la invitación. */
"use strict";

/* WhatsApp del estudio que recibe las respuestas (con indicativo, sin +) */
const WHATSAPP_ESTUDIO = "573185088370";
const CLAVE = "serena-formulario-v1";

const $ = id => document.getElementById(id);
const form = $("form");

/* ---------- Paquetes y extras (precios en pesos) ---------- */
const PLANES = { esencial: 180000, clasica: 260000, medida: 400000, pdf: 130000 };
const INCLUYE = {
  esencial: ["Nombres, fecha, ceremonia y recepción", "Colores y tipografía a su elección", "“Cómo llegar” con Google Maps", "Cuenta regresiva y botón de calendario", "Confirmación de asistencia por WhatsApp", "Foto de portada", "Código de vestimenta", "Regalos o lluvia de sobres con botón “Copiar”", "Vista previa al compartir en WhatsApp", "1 ronda de ajustes", "En línea hasta 1 mes después de la boda"],
  clasica: ["Todo lo de Esencial", "Galería de fotos", "Música de fondo con su canción", "Cronograma del día", "Preguntas frecuentes", "Mapa dentro de la invitación", "Calendario del mes con su fecha marcada", "Contacto de su organizadora o wedding planner", "2 rondas de ajustes", "En línea hasta 6 meses después de la boda"],
  medida: ["Nombres, fecha, ceremonia y recepción", "3 rondas de ajustes", "En línea hasta 6 meses después de la boda"],
  pdf: ["Hasta 3 páginas", "Enlaces a ubicación, confirmación por WhatsApp y calendario", "Ceremonia, recepción, programa, vestimenta y regalos", "Colores y tipografía a su elección", "1 ronda de ajustes"]
};
/* A medida: lo incluido se puede desmarcar (id = sección que activa) */
const MEDIDA_OPCIONAL = [
  ["", "Colores y tipografía a su elección"], ["", "“Cómo llegar” con Google Maps"], ["", "Cuenta regresiva y botón de calendario"],
  ["", "Foto de portada"], ["", "Código de vestimenta"], ["", "Regalos o lluvia de sobres con botón “Copiar”"], ["", "Vista previa al compartir en WhatsApp"],
  ["", "Galería de fotos"], ["musica", "Música de fondo con su canción"], ["", "Cronograma del día"], ["faq", "Preguntas frecuentes"],
  ["", "Mapa dentro de la invitación"], ["", "Calendario del mes con su fecha marcada"], ["organizadora", "Contacto de su organizadora o wedding planner"],
  ["form", "Formulario de confirmación que llena un Excel (número de personas y alergias)"], ["links", "Link con el nombre y los cupos de cada invitado"],
  ["historia", "Nuestra historia"], ["hospedaje", "Hospedaje sugerido para sus invitados"], ["hashtag", "Hashtag de la boda"], ["", "Monograma con sus iniciales"],
  ["", "Sobre animado o portada ilustrada"], ["pdfv", "Versión PDF de la invitación"]
];
/* incl: paquetes donde ya viene incluido · precio: valor como extra por paquete */
const TODOS = p => ({ esencial: p, clasica: p, medida: p, pdf: p });
const ITEMS = [
  { id: "historia", nombre: "Nuestra historia", incl: ["medida"], precio: {} },
  { id: "hashtag", nombre: "Hashtag", incl: ["medida"], precio: {} },
  { id: "faq", nombre: "Preguntas frecuentes", incl: ["clasica", "medida"], precio: {} },
  { id: "organizadora", nombre: "Contacto de la organizadora", incl: ["clasica", "medida"], precio: {} },
  { id: "hospedaje", nombre: "Hospedaje sugerido", incl: ["medida"], precio: {} },
  { id: "musica",  nombre: "Música de fondo con su canción", incl: ["clasica", "medida"], precio: { esencial: 30000 } },
  { id: "form",    nombre: "Formulario de confirmación que llena un Excel (número de personas y alergias)", incl: ["medida"], precio: { esencial: 30000, clasica: 30000 } },
  { id: "links",   nombre: "Link con el nombre y los cupos de cada invitado", incl: ["medida"], precio: { esencial: 40000, clasica: 40000 } },
  { id: "pdfv",    nombre: "Versión PDF de la invitación", incl: ["medida"], precio: { esencial: 40000, clasica: 40000 } },
  { id: "qr",      nombre: "QR para que los invitados suban sus fotos", incl: [], precio: TODOS(40000) },
  { id: "estados", nombre: "Imagen para estados o “save the date”", incl: [], precio: TODOS(40000) },
  { id: "idioma",  nombre: "Otro idioma", incl: [], precio: TODOS(50000) },
  { id: "ronda",   nombre: "Ronda de ajustes adicional", incl: [], precio: TODOS(30000) },
  { id: "exp-mitad", grupo: "express", nombre: "Entrega express: primera versión en la mitad del tiempo", incl: [], precio: { esencial: 40000, clasica: 60000, medida: 90000, pdf: 30000 },
    dias: { esencial: 3, clasica: 4, medida: 5, pdf: 3 } },
  { id: "exp-hoy", grupo: "express", nombre: "Entrega express: primera versión el mismo día", incl: [], precio: { esencial: 70000, clasica: 110000, medida: 160000, pdf: 50000 } },
  { id: "dominio", nombre: "Dominio propio por un año", incl: [], precio: { esencial: 90000, clasica: 90000, medida: 90000 } }
];
/* Precio acordado para un cliente: ?paquete=medida&precio=340000 */
const URLP = new URLSearchParams(location.search);
const PRECIO_ESPECIAL = { plan: URLP.get("paquete"), precio: Number(URLP.get("precio")) || 0 };

const pesos = n => "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const planActual = () => { const r = form.querySelector('input[name="Paquete"]:checked'); return r ? r.dataset.plan : ""; };
const precioBase = plan => (PRECIO_ESPECIAL.precio && PRECIO_ESPECIAL.plan === plan) ? PRECIO_ESPECIAL.precio : PLANES[plan];
function tiene(id){
  const plan = planActual(); const it = ITEMS.find(i => i.id === id);
  if (!plan || !it) return false;
  if (plan === "medida") { const o = $("p_incluye").querySelector('input[data-inc="' + id + '"]'); if (o) return o.checked; }
  if (it.incl.includes(plan)) return true;
  const c = $("p_extras").querySelector('input[data-id="' + id + '"]');
  return !!(c && c.checked);
}

let planPintado = null;
function pintarPaquete(){
  const plan = planActual();
  $("p_detalle").hidden = !plan;
  if (!plan) { $("total_barra").hidden = true; return; }
  if (plan !== planPintado) {
    const antes = new Set([...$("p_extras").querySelectorAll("input:checked")].map(c => c.dataset.id));
    const inc = $("p_incluye"); inc.innerHTML = "";
    const b = document.createElement("b"); b.textContent = "Incluye:"; inc.append(b);
    const ul = document.createElement("ul");
    INCLUYE[plan].forEach(t => { const li = document.createElement("li"); li.textContent = t; ul.append(li); });
    inc.append(ul);
    if (plan === "medida") {
      const t = document.createElement("p"); t.className = "nota"; t.style.margin = ".8rem 0 .5rem";
      t.textContent = "Desmarquen lo que no quieran en su invitación:"; inc.append(t);
      const caja = document.createElement("div"); caja.className = "extras";
      MEDIDA_OPCIONAL.forEach(([id, txt]) => {
        const l = document.createElement("label"); l.className = "extra";
        const c = document.createElement("input"); c.type = "checkbox"; c.name = "Del paquete quieren"; c.value = txt; c.checked = true; c.dataset.omitir = "1";
        if (id) c.dataset.inc = id;
        const sp = document.createElement("span"); sp.textContent = txt;
        l.append(c, sp); caja.append(l);
      });
      inc.append(caja);
    }
    const ex = $("p_extras"); ex.innerHTML = "";
    ITEMS.filter(i => i.precio[plan] && !i.incl.includes(plan)).forEach(i => {
      const l = document.createElement("label"); l.className = "extra";
      const c = document.createElement("input"); c.type = "checkbox"; c.name = "Extras";
      if (i.grupo) c.dataset.grupo = i.grupo;
      const nom = i.dias ? i.nombre + " (" + i.dias[plan] + " días hábiles)" : i.nombre;
      c.value = nom + " (+" + pesos(i.precio[plan]) + ")"; c.dataset.id = i.id; c.dataset.precio = i.precio[plan]; c.checked = antes.has(i.id);
      const t = document.createElement("span"); t.textContent = nom;
      const pr = document.createElement("b"); pr.textContent = "+" + pesos(i.precio[plan]);
      l.append(c, t, pr); ex.append(l);
    });
    planPintado = plan;
  }
  let total = precioBase(plan);
  $("p_extras").querySelectorAll("input:checked").forEach(c => { total += Number(c.dataset.precio); });
  $("p_total").textContent = pesos(total);
  const especial = precioBase(plan) !== PLANES[plan] ? " (precio acordado " + pesos(precioBase(plan)) + " + extras)" : "";
  $("p_total_in").value = pesos(total) + especial;
  $("p_quitar").value = [...$("p_incluye").querySelectorAll("input:not(:checked)")].map(c => c.value).join(", ");
  $("total_barra").textContent = "Total estimado: " + pesos(total);
  $("total_barra").hidden = false;
}

/* ---------- Mostrar u ocultar bloques condicionales ---------- */
let conFormAntes = null;
function condicionales(){
  pintarPaquete();
  const plan = planActual();
  $("m_musica_box").hidden = !tiene("musica");
  ["historia", "hashtag", "faq", "organizadora"].forEach(id => { $("x_" + id + "_box").hidden = !tiene(id); });
  $("fs_qr").hidden = !tiene("qr");
  $("fs_hospedaje").hidden = !(plan === "medida" && tiene("hospedaje"));
  const conForm = tiene("form");
  $("r_hoja").closest("label").style.display = conForm ? "" : "none";
  if (!conForm && $("r_hoja").checked) $("r_wa").checked = true;
  if (conForm && conFormAntes === false) $("r_hoja").checked = true;
  conFormAntes = conForm;
  $("r_nota_wa").hidden = conForm || !(plan === "esencial" || plan === "clasica");
  $("re_otro").hidden = !$("re_mismo_no").checked;
  $("d_colores_box").hidden = !$("d_cambiar").checked;
  $("q_link_box").hidden = !$("q_tengo").checked;
  $("r_hoja_box").hidden = !$("r_hoja").checked;
  $("r_wa_box").hidden = !$("r_wa").checked;
  const op = $("d_muestra").selectedOptions[0];
  const hay = !!(op && op.dataset.img);
  $("d_vista").hidden = !hay;
  if (hay && !$("d_vista_img").src.endsWith(op.dataset.img)) {
    $("d_vista_img").src = "/img/pantallas/" + op.dataset.img;
    $("d_vista_img").alt = "Vista previa de la muestra " + op.value;
    $("d_vista_link").href = op.dataset.url;
  }
  /* numerar solo los bloques visibles */
  let n = 0;
  form.querySelectorAll("fieldset").forEach(fs => {
    const sp = fs.querySelector("legend span");
    if (!sp.dataset.t) sp.dataset.t = sp.textContent.replace(/^\d+\s·\s/, "");
    if (!fs.hidden) sp.textContent = (++n) + " · " + sp.dataset.t;
  });
}

/* ---------- Borrador en este celular ---------- */
function guardar(){
  const datos = {};
  form.querySelectorAll("input, select, textarea").forEach(el => {
    if (!el.id && el.type !== "checkbox" && el.type !== "radio") return;
    const k = el.type === "checkbox" || el.type === "radio" ? el.name + "|" + el.value : el.id;
    datos[k] = el.type === "checkbox" || el.type === "radio" ? el.checked : el.value;
  });
  try { localStorage.setItem(CLAVE, JSON.stringify(datos)); $("guardado").textContent = "Guardado en este celular."; } catch (e) {}
}
function cargar(){
  let datos = null;
  try { datos = JSON.parse(localStorage.getItem(CLAVE) || "null"); } catch (e) {}
  if (!datos) return;
  form.querySelectorAll("input, select, textarea").forEach(el => {
    const k = el.type === "checkbox" || el.type === "radio" ? el.name + "|" + el.value : el.id;
    if (!(k in datos)) return;
    if (el.type === "checkbox" || el.type === "radio") el.checked = !!datos[k]; else el.value = datos[k];
  });
}
/* Solo una opción de entrega express a la vez */
form.addEventListener("change", e => {
  const c = e.target;
  if (c.dataset && c.dataset.grupo && c.checked) form.querySelectorAll('input[data-grupo="' + c.dataset.grupo + '"]').forEach(x => { if (x !== c) x.checked = false; });
}, true);
let t;
form.addEventListener("input", () => { condicionales(); clearTimeout(t); t = setTimeout(guardar, 400); });
form.addEventListener("change", e => { if (e.target.value) e.target.removeAttribute("aria-invalid"); condicionales(); guardar(); });
cargar(); condicionales(); cargar(); condicionales();
if (PRECIO_ESPECIAL.precio && PLANES[PRECIO_ESPECIAL.plan]) {
  const r = form.querySelector('input[data-plan="' + PRECIO_ESPECIAL.plan + '"]');
  r.checked = true;
  form.querySelectorAll('input[name="Paquete"]').forEach(x => { if (x !== r) x.closest("label").style.display = "none"; });
  r.closest("label").querySelector(".plan-p").textContent = pesos(PRECIO_ESPECIAL.precio);
  r.closest("label").querySelector(".plan-d").textContent = "Precio acordado con Serena Studio.";
  condicionales();
}

/* ---------- Formato de fechas y horas en español ---------- */
const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const DIAS = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
function fecha(v){ if (!v) return ""; const [a, m, d] = v.split("-").map(Number); const f = new Date(a, m - 1, d); return DIAS[f.getDay()] + " " + d + " de " + MESES[m - 1] + " de " + a; }
function hora(v){ if (!v) return ""; let [h, mi] = v.split(":").map(Number); const pm = h >= 12; h = h % 12 || 12; return h + ":" + String(mi).padStart(2, "0") + (pm ? " p. m." : " a. m."); }

/* ---------- Validación ---------- */
function validar(){
  const faltan = [];
  form.querySelectorAll("[required]").forEach(el => {
    if (el.closest("[hidden]")) { el.removeAttribute("aria-invalid"); return; }
    const v = el.value.trim();
    const malo = !v || (el.type === "url" && !/^https?:\/\/\S+\.\S+/i.test(v));
    el.setAttribute("aria-invalid", malo ? "true" : "false");
    if (malo) faltan.push({el, nombre: (form.querySelector('label[for="' + el.id + '"]')?.textContent || el.name).replace("*", "").trim() + (v ? " (debe ser un link que empiece por https://)" : "")});
  });
  if (!planActual()) { const r = form.querySelector('input[name="Paquete"]'); faltan.unshift({el: r, nombre: "Paquete"}); }
  const caja = $("errores");
  if (faltan.length) {
    caja.innerHTML = "";
    caja.append("Falta completar:");
    const ul = document.createElement("ul");
    faltan.forEach(f => { const li = document.createElement("li"); li.textContent = f.nombre; ul.append(li); });
    caja.append(ul);
    caja.hidden = false;
    faltan[0].el.focus();
    caja.scrollIntoView({behavior: "smooth", block: "start"});
    return false;
  }
  caja.hidden = true;
  return true;
}

/* ---------- Resumen para WhatsApp ---------- */
function resumen(){
  const lineas = ["*Datos para la invitación · Serena Studio*", ""];
  form.querySelectorAll("fieldset").forEach(fs => {
    const titulo = fs.querySelector("legend span").textContent.trim();
    const items = [];
    const vistos = new Set();
    fs.querySelectorAll("input, select, textarea").forEach(el => {
      if (el.closest("[hidden]") || el.dataset.omitir) return;
      let v = "";
      if (el.type === "checkbox" || el.type === "radio") {
        if (vistos.has(el.name)) return; vistos.add(el.name);
        v = [...fs.querySelectorAll('input[name="' + el.name + '"]:checked')].map(x => x.value).join(", ");
      } else if (el.type === "date") v = fecha(el.value);
      else if (el.type === "time") v = hora(el.value);
      else v = el.value.trim();
      if (v) items.push((v.includes("\n") ? "• " + el.name + ":\n" + v : "• " + el.name + ": " + v));
    });
    if (items.length) { lineas.push("*" + titulo + "*", ...items, ""); }
  });
  return lineas.join("\n").trim();
}

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!validar()) return;
  guardar();
  const txt = resumen();
  $("resumen").textContent = txt;
  $("btn-wa").href = "https://wa.me/" + WHATSAPP_ESTUDIO + "?text=" + encodeURIComponent(txt);
  form.hidden = true;
  $("listo").hidden = false;
  $("listo").focus();
  window.scrollTo({top: $("listo").offsetTop - 20, behavior: "smooth"});
});

$("btn-editar").addEventListener("click", () => { $("listo").hidden = true; form.hidden = false; $("c_nombre").focus(); });

$("btn-copiar").addEventListener("click", () => {
  const txt = $("resumen").textContent;
  const ok = () => { $("copiado").textContent = "Copiado. Péguenlo en el chat de WhatsApp."; };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, seleccionar);
  else seleccionar();
  function seleccionar(){
    const r = document.createRange(); r.selectNodeContents($("resumen"));
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    $("copiado").textContent = "Texto seleccionado: cópienlo con el menú del celular.";
  }
});
