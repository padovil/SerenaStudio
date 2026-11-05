/* © 2026 Serena Studio. Todos los derechos reservados.
   Invitación "Cereza" · Camila & Andrés
   Se carga con <script src="invitacion.js" defer>: el DOM ya está listo al ejecutarse. */
"use strict";

/* =========================================================
   DATOS DEL EVENTO — editar aquí para cada cliente
   ========================================================= */
const EVENTO = {
  titulo: "Boda de Camila & Andrés",
  inicioISO: "2027-09-25T16:00:00-05:00",   // ceremonia, hora Colombia (sábado)
  inicioUTC: "20270925T210000Z",
  finUTC:    "20270926T053000Z",            // 12:30 a. m.
  lugar: "Capilla Santa Inés, Calle 72 # 5-30, Bogotá",
  mapsCeremonia: "https://www.google.com/maps/search/?api=1&query=Calle%2072%20%23%205-30%2C%20Bogot%C3%A1", // [EJEMPLO]
  mapsRecepcion: "https://www.google.com/maps/search/?api=1&query=Calle%2070A%20%23%204-41%2C%20Bogot%C3%A1", // [EJEMPLO]
  whatsapp: "573000000000",                 // [EJEMPLO] número de la pareja, con indicativo, sin +
  novios: "Camila y Andrés"
};

const $ = id => document.getElementById(id);
function aviso(txt){
  const a = $("aviso"); a.textContent = txt; a.hidden = false;
  clearTimeout(aviso.t); aviso.t = setTimeout(() => a.hidden = true, 2600);
}

/* ---------- Personalización por invitado ----------
   Link de ejemplo:  ...?para=Familia%20Gómez&cupos=3       */
(function personalizar(){
  const q = new URLSearchParams(location.search);
  const para = (q.get("para") || "").trim().slice(0, 60);
  const cupos = parseInt(q.get("cupos"), 10);
  if (para) {
    const plural = /familia|\sy\s|&|,/i.test(para);
    $("para").textContent = (plural ? "Queridos " : "Para ") + para;
    $("rsvp-nombre").value = para;
  }
  if (cupos > 0) {
    const c = $("cupos-txt");
    c.textContent = cupos === 1 ? "Reservamos 1 lugar para ti." : "Reservamos " + cupos + " lugares para ustedes.";
    c.hidden = false;
    const sel = $("rsvp-personas");
    [...sel.options].forEach(o => { if (+o.value > cupos) o.remove(); });
    sel.value = String(Math.min(cupos, 4));
  }
})();

/* ---------- Cuenta regresiva ---------- */
(function(){
  const meta = new Date(EVENTO.inicioISO).getTime();
  const pad = n => String(n).padStart(2, "0");
  function tick(){
    let s = Math.max(0, Math.floor((meta - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    $("c-dias").textContent = d; $("c-horas").textContent = pad(h);
    $("c-min").textContent = pad(m); $("c-seg").textContent = pad(s);
  }
  tick(); setInterval(tick, 1000);
})();

/* ---------- Mapas y calendario ---------- */
$("btn-maps-ceremonia").href = EVENTO.mapsCeremonia;
$("btn-maps-recepcion").href = EVENTO.mapsRecepcion;
$("btn-gcal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE"
  + "&text=" + encodeURIComponent(EVENTO.titulo)
  + "&dates=" + EVENTO.inicioUTC + "/" + EVENTO.finUTC
  + "&location=" + encodeURIComponent(EVENTO.lugar)
  + "&details=" + encodeURIComponent("Ceremonia 4:00 p. m. en la Capilla Santa Inés · Recepción 5:30 p. m. en Casa Lumen");

$("btn-ics").addEventListener("click", () => {
  const ics = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Invitacion//ES","BEGIN:VEVENT",
    "UID:" + EVENTO.inicioUTC + "@invitacion",
    "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
    "DTSTART:" + EVENTO.inicioUTC, "DTEND:" + EVENTO.finUTC,
    "SUMMARY:" + EVENTO.titulo, "LOCATION:" + EVENTO.lugar,
    "END:VEVENT","END:VCALENDAR"
  ].join("\r\n");
  try {
    const url = URL.createObjectURL(new Blob([ics], {type:"text/calendar"}));
    const a = document.createElement("a"); a.href = url; a.download = "boda-camila-andres.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch (e) { aviso("Usen el botón de Google Calendar."); }
});

/* ---------- Copiar número de cuenta ---------- */
$("btn-copiar").addEventListener("click", () => {
  const txt = $("num-cuenta").textContent.replace(/\D/g, "");
  const seleccionar = () => {
    const r = document.createRange(); r.selectNodeContents($("num-cuenta"));
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    aviso("Número seleccionado. Cópienlo desde el menú.");
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(() => aviso("Número copiado"), seleccionar);
  } else { seleccionar(); }
});

/* ---------- RSVP por WhatsApp ---------- */
$("form-rsvp").addEventListener("submit", e => {
  e.preventDefault();
  const nombre = $("rsvp-nombre").value.trim();
  if (!nombre) { $("rsvp-error").hidden = false; $("rsvp-nombre").setAttribute("aria-invalid", "true"); $("rsvp-nombre").focus(); return; }
  $("rsvp-error").hidden = true; $("rsvp-nombre").removeAttribute("aria-invalid");
  const si = $("rsvp-si").checked;
  const n = $("rsvp-personas").value;
  const nota = $("rsvp-nota").value.trim();
  const msg = si
    ? "Hola, soy " + nombre + " y confirmo mi asistencia a la boda de " + EVENTO.novios + ". Personas: " + n + "." + (nota ? " Restricciones: " + nota + "." : "")
    : "Hola, soy " + nombre + ". Lamentablemente no podré asistir a la boda de " + EVENTO.novios + ". Les deseo lo mejor.";
  const a = document.createElement("a");
  a.href = "https://wa.me/" + EVENTO.whatsapp + "?text=" + encodeURIComponent(msg);
  a.target = "_blank"; a.rel = "noopener noreferrer";
  document.body.appendChild(a); a.click(); a.remove();
});

/* ---------- Música ----------
   Intenta sonar apenas carga la página. Los navegadores bloquean el sonido
   automático hasta que el invitado interactúa, así que si lo bloquean,
   arranca con el primer toque, scroll, clic o tecla en cualquier parte. */
(function(){
  const au = $("audio"), b = $("btn-musica");
  const estado = on => { b.setAttribute("aria-pressed", on ? "true" : "false"); b.setAttribute("aria-label", on ? "Pausar música" : "Reproducir música"); };
  au.addEventListener("play", () => estado(true));
  au.addEventListener("pause", () => estado(false));
  let pausadaPorInvitado = false;
  const intentar = () => au.play().catch(() => {});
  const evs = ["pointerdown", "touchstart", "keydown", "wheel", "scroll"];
  const quitar = () => evs.forEach(ev => window.removeEventListener(ev, primerGesto, true));
  function primerGesto(e){
    if (e.target && e.target.closest && e.target.closest("#btn-musica")) return quitar();
    if (au.paused && !pausadaPorInvitado) au.play().then(quitar).catch(() => {});
    else quitar();
  }
  evs.forEach(ev => window.addEventListener(ev, primerGesto, {capture:true, passive:true}));
  intentar();
  b.addEventListener("click", () => {
    if (au.paused) { pausadaPorInvitado = false; au.play().catch(() => aviso("Falta el archivo de la canción.")); }
    else { pausadaPorInvitado = true; au.pause(); }
  });
})();

/* ---------- Fotos que no cargan ----------
   Si una foto falla, se oculta y queda visible el marcador con el nombre
   del archivo esperado (reemplaza los antiguos onerror en línea). */
document.querySelectorAll(".foto img").forEach(img => {
  const marcar = () => { img.dataset.falla = "1"; };
  if (img.complete && img.naturalWidth === 0) marcar();
  img.addEventListener("error", marcar);
});

/* ---------- Protección contra marcos ----------
   Si alguien mete la invitación dentro de otra página (iframe),
   se intenta abrirla sola; si el navegador no lo permite, se oculta. */
if (window.top !== window.self) {
  try { window.top.location.replace(window.self.location.href); }
  catch (e) { document.documentElement.style.display = "none"; }
}
