/*!
 * © 2026 Serena Studio. Todos los derechos reservados.
 * Invitación digital · Valentina & Tomás · 20 de marzo de 2027
 */
/* =========================================================
   DATOS DEL EVENTO — editar aquí para cada cliente
   ========================================================= */
"use strict";

const EVENTO = {
  titulo: "Boda de Valentina & Tomás",
  inicioISO: "2027-03-20T16:00:00-05:00",   // ceremonia, hora Colombia
  inicioUTC: "20270320T210000Z",
  finUTC:    "20270321T060000Z",            // 1:00 a. m.
  lugar: "Hacienda Los Almendros, Llanogrande, Rionegro",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Llanogrande%2C%20Rionegro%2C%20Antioquia", // [EJEMPLO] link real del lugar
  whatsapp: "573000000000",                 // [EJEMPLO] número de la pareja, con indicativo, sin +
  novios: "Valentina y Tomás"
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
    const saludo = /^familia\b/i.test(para) ? "Querida "
                 : /\sy\s|&|,/i.test(para) ? "Queridos " : "Para ";
    $("para").textContent = saludo + para;
    $("rsvp-nombre").value = para;
  }
  if (cupos > 0) {
    const c = $("cupos-txt");
    c.textContent = cupos === 1 ? "Hemos reservado 1 lugar para ti." : "Hemos reservado " + cupos + " lugares para ustedes.";
    c.hidden = false;
    const sel = $("rsvp-personas");
    [...sel.options].forEach(o => { if (+o.value > cupos) o.remove(); });
    sel.value = String(cupos);
  }
})();

/* ---------- Cuenta regresiva ---------- */
(function cuenta(){
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

/* ---------- Mapa y calendario ---------- */
$("btn-maps").href = EVENTO.mapsUrl;
$("btn-gcal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE"
  + "&text=" + encodeURIComponent(EVENTO.titulo)
  + "&dates=" + EVENTO.inicioUTC + "/" + EVENTO.finUTC
  + "&location=" + encodeURIComponent(EVENTO.lugar)
  + "&details=" + encodeURIComponent("Ceremonia 4:00 p. m. · Recepción 6:00 p. m.");

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
    const a = document.createElement("a"); a.href = url; a.download = "boda-valentina-tomas.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch (e) { aviso("Usa el botón de Google Calendar."); }
});

/* ---------- Copiar número de cuenta ---------- */
$("btn-copiar").addEventListener("click", () => {
  const txt = $("num-cuenta").textContent.replace(/\D/g, "");
  const seleccionar = () => {
    const r = document.createRange(); r.selectNodeContents($("num-cuenta"));
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    aviso("Número seleccionado. Cópialo desde el menú.");
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
  const bus = $("rsvp-bus").value === "si";
  const msg = si
    ? "Hola, soy " + nombre + " y confirmo mi asistencia a la boda de " + EVENTO.novios + ". Personas: " + n + "." + (bus ? " Quiero ir en el bus desde Medellín." : "")
    : "Hola, soy " + nombre + ". Lamentablemente no podré asistir a la boda de " + EVENTO.novios + ". Les deseo lo mejor.";
  const a = document.createElement("a");
  a.href = "https://wa.me/" + EVENTO.whatsapp + "?text=" + encodeURIComponent(msg);
  a.target = "_blank"; a.rel = "noopener";
  document.body.appendChild(a); a.click(); a.remove();
});


/* ---------- Música ----------
   Intenta sonar apenas carga la página. Los navegadores bloquean el sonido
   automático hasta que el invitado interactúa, así que si lo bloquean,
   arranca con el primer toque, scroll, clic o tecla en cualquier parte.
   El botón flotante la pausa o la reanuda. */
(function(){
  const au = $("audio"), b = $("btn-musica");
  if (!au || !b) return;
  const estado = on => { b.setAttribute("aria-pressed", on ? "true" : "false"); b.setAttribute("aria-label", on ? "Pausar música" : "Reproducir música"); };
  au.addEventListener("play", () => estado(true));
  au.addEventListener("pause", () => estado(false));
  let pausadaPorInvitado = false;
  const evs = ["pointerdown", "touchstart", "keydown", "wheel", "scroll"];
  const quitar = () => evs.forEach(ev => window.removeEventListener(ev, primerGesto, true));
  function primerGesto(e){
    if (e.target && e.target.closest && e.target.closest("#btn-musica")) return quitar();
    if (au.paused && !pausadaPorInvitado) au.play().then(quitar).catch(() => {});
    else quitar();
  }
  evs.forEach(ev => window.addEventListener(ev, primerGesto, {capture:true, passive:true}));
  au.play().catch(() => {});
  b.addEventListener("click", () => {
    if (au.paused) { pausadaPorInvitado = false; au.play().catch(() => aviso("Falta el archivo de la canción.")); }
    else { pausadaPorInvitado = true; au.pause(); }
  });
})();

/* ---------- Aparición suave al hacer scroll (respeta "reducir movimiento") ---------- */
(function aparecer(){
  const els = document.querySelectorAll(".rv");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.documentElement.classList.add("js");
  const io = new IntersectionObserver(entradas => {
    entradas.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  els.forEach(el => io.observe(el));
})();

/* ---------- Fotos: si una no carga, se muestra el marcador ---------- */
document.querySelectorAll(".foto img").forEach(img => {
  const falla = () => { img.dataset.falla = 1; };
  if (img.complete && img.naturalWidth === 0) falla();
  img.addEventListener("error", falla);
});

/* ---------- No permitir que otro sitio muestre la invitación dentro de un marco ---------- */
if (window.top !== window.self) {
  try { window.top.location.replace(window.self.location.href); }
  catch (e) { document.documentElement.hidden = true; }
}
