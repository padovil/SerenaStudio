/*! © 2026 Serena Studio · Invitación digital. Todos los derechos reservados. */
"use strict";
/* =========================================================
   DATOS DEL EVENTO — editar aquí para cada cliente
   ========================================================= */
const EVENTO = {
  titulo: "Boda de Mariana & Sebastián",
  inicioISO: "2027-06-12T16:30:00-05:00",   // hora Colombia
  inicioUTC: "20270612T213000Z",
  finUTC:    "20270613T070000Z",            // 2:00 a. m.
  lugar: "Parroquia Santa Lucía, Calle 12 # 10-40, Chía",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Ch%C3%ADa%2C%20Cundinamarca", // [EJEMPLO]
  whatsapp: "573000000000",                 // [EJEMPLO] número de la pareja, con indicativo, sin +
  novios: "Mariana y Sebastián"
};

const $ = id => document.getElementById(id);
function aviso(t){ const a=$("aviso"); a.textContent=t; a.hidden=false; clearTimeout(aviso.t); aviso.t=setTimeout(()=>a.hidden=true,2600); }

/* ---------- Personalización: ...?para=Familia%20López&cupos=2 ---------- */
(function(){
  const q = new URLSearchParams(location.search);
  const para = (q.get("para") || "").trim().slice(0, 60);
  const cupos = parseInt(q.get("cupos"), 10);
  if (para) $("para").textContent = (/familia|\sy\s|&|,/i.test(para) ? "Queridos " : "Querido(a) ") + para;
  if (cupos > 0) {
    $("cupos-txt").textContent = cupos === 1 ? "Hemos reservado 1 lugar para ti." : "Hemos reservado " + cupos + " lugares para ustedes.";
    $("cupos-txt").hidden = false;
  }
})();

/* ---------- Enlaces ---------- */
$("btn-maps").href = EVENTO.mapsUrl;
$("btn-gcal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE"
  + "&text=" + encodeURIComponent(EVENTO.titulo)
  + "&dates=" + EVENTO.inicioUTC + "/" + EVENTO.finUTC
  + "&location=" + encodeURIComponent(EVENTO.lugar);

/* ---------- Cuenta regresiva en casillas ---------- */
(function(){
  const meta = new Date(EVENTO.inicioISO).getTime();
  const pinta = (id, n, cifras) => {
    const s = String(n).padStart(cifras, "0").slice(-cifras);
    [...$(id).children].forEach((b, i) => b.textContent = s[i]);
  };
  function tick(){
    let s = Math.max(0, Math.floor((meta - Date.now()) / 1000));
    pinta("c-d", Math.min(999, Math.floor(s / 86400)), 3);
    pinta("c-h", Math.floor(s % 86400 / 3600), 2);
    pinta("c-m", Math.floor(s % 3600 / 60), 2);
  }
  tick(); setInterval(tick, 15000);
})();

/* ---------- Copiar cuenta ---------- */
$("btn-copiar").addEventListener("click", () => {
  const txt = $("num-cuenta").textContent.replace(/\D/g, "");
  const sel = () => { const r=document.createRange(); r.selectNodeContents($("num-cuenta")); const s=getSelection(); s.removeAllRanges(); s.addRange(r); aviso("Número seleccionado. Cópialo desde el menú."); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => aviso("Cuenta copiada"), sel);
  else sel();
});

/* ---------- Música ----------
   Intenta sonar apenas carga la página. Los navegadores bloquean el sonido
   automático hasta que el invitado interactúa, así que si lo bloquean,
   arranca con el primer toque, clic o tecla en cualquier parte. */
(function(){
  const au = $("audio"), b = $("btn-musica");
  au.preload = "metadata";  /* la canción se descarga solo al empezar a sonar */
  const estado = on => { b.setAttribute("aria-pressed", on ? "true" : "false"); b.setAttribute("aria-label", on ? "Pausar música" : "Reproducir música"); };
  au.addEventListener("play", () => estado(true));
  au.addEventListener("pause", () => estado(false));
  let pausadaPorInvitado = false;
  const intentar = () => au.play().catch(() => {});
  const primerGesto = e => {
    if (e.target.closest && e.target.closest("#btn-musica")) return quitar();
    if (au.paused && !pausadaPorInvitado) intentar();
    quitar();
  };
  const evs = ["pointerdown", "touchstart", "keydown"];
  const quitar = () => evs.forEach(ev => document.removeEventListener(ev, primerGesto, true));
  evs.forEach(ev => document.addEventListener(ev, primerGesto, {capture:true, passive:true}));
  document.addEventListener("DOMContentLoaded", intentar);
  if (document.readyState !== "loading") intentar();
  b.addEventListener("click", () => {
    if (au.paused) { pausadaPorInvitado = false; au.play().catch(() => aviso("Falta el archivo de la canción.")); }
    else { pausadaPorInvitado = true; au.pause(); }
  });
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

/* ---------- Aviso: la confirmación quedó lista ---------- */
function mostrarConfirmacion(waUrl, titulo, texto){
  const ok = document.getElementById("rsvp-ok");
  if (!ok) return;
  document.getElementById("rsvp-ok-t").textContent = titulo;
  document.getElementById("rsvp-ok-txt").innerHTML = "";
  document.getElementById("rsvp-ok-txt").append(texto, " Solo falta tocar ", Object.assign(document.createElement("b"), {textContent: "Enviar"}), " en WhatsApp.");
  document.getElementById("rsvp-ok-wa").href = waUrl;
  ok.hidden = false;
  ok.style.animation = "none"; void ok.offsetWidth; ok.style.animation = "";
  ok.focus({preventScroll: true});
  ok.scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center"});
}

/* ---------- Confirmar por WhatsApp ---------- */
(function(){
  const b = document.getElementById("btn-form");
  const para = (new URLSearchParams(location.search).get("para") || "").trim().slice(0, 60);
  const plural = /familia|\sy\s|&|,/i.test(para);
  const msg = para
    ? "Hola, " + (plural ? "somos " + para + " y confirmamos" : "soy " + para + " y confirmo") + " asistencia a la boda de " + EVENTO.novios + "."
    : "Hola, confirmo mi asistencia a la boda de " + EVENTO.novios + ". Mi nombre es: ";
  b.href = "https://wa.me/" + EVENTO.whatsapp + "?text=" + encodeURIComponent(msg);
  b.addEventListener("click", () => {
    setTimeout(() => mostrarConfirmacion(b.href, para ? "¡Gracias, " + para + "!" : "¡Gracias por confirmar!", "Tu confirmación ya está escrita."), 150);
  });
})();
