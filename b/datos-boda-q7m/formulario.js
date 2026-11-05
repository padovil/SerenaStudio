/*! © 2026 Serena Studio. Formulario de datos para la invitación. */
"use strict";

/* WhatsApp del estudio que recibe las respuestas (con indicativo, sin +) */
const WHATSAPP_ESTUDIO = "573185088370";
const CLAVE = "serena-formulario-v1";

const $ = id => document.getElementById(id);
const form = $("form");

/* ---------- Mostrar u ocultar bloques condicionales ---------- */
function condicionales(){
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
let t;
form.addEventListener("input", () => { condicionales(); clearTimeout(t); t = setTimeout(guardar, 400); });
form.addEventListener("change", e => { if (e.target.value) e.target.removeAttribute("aria-invalid"); condicionales(); guardar(); });
cargar(); condicionales();

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
    const vacio = !el.value.trim();
    el.setAttribute("aria-invalid", vacio ? "true" : "false");
    if (vacio) faltan.push({el, nombre: (form.querySelector('label[for="' + el.id + '"]')?.textContent || el.name).replace("*", "").trim()});
  });
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
      if (el.closest("[hidden]")) return;
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
