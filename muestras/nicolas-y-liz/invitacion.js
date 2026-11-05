/*!
 * © 2026 Serena Studio. Todos los derechos reservados.
 * Invitación digital · Nicolás & Liz · 7 de diciembre de 2026
 */
"use strict";

/* =========================================================
   DATOS DEL EVENTO — editar aquí para cada cliente
   ========================================================= */
const EVENTO = {
  titulo: "Boda de Nicolás & Liz",
  inicioISO: "2026-12-07T15:00:00-05:00",
  inicioUTC: "20261207T200000Z",
  finUTC:    "20261208T040000Z",   // asumido: 11:00 p. m.
  anio: 2026, mes: 11, dia: 7,     // mes en base 0 (11 = diciembre)
  lugar: "La Marqueza",
  direccion: "La Calera, Cundinamarca",   // confirmar con la pareja
  coordenadas: "4.7714794,-73.9799389",  // Hacienda Márquez (Google Maps)
  mapsUrl: "https://maps.app.goo.gl/EBWsDJNrXgrXSqiQ8",
  whatsapp: "573000000000",          // [EJEMPLO] número de la pareja, con indicativo, sin +
  novios: "Nicolás y Liz"
};

/* ---------- Personalización: ?para=Familia%20Pérez&cupos=2 ---------- */
(function(){
  const q = new URLSearchParams(location.search);
  const para = (q.get("para") || "").trim().slice(0, 60);
  const cupos = parseInt(q.get("cupos"), 10);
  const plural = /familia| y |&|,/i.test(para);
  document.getElementById("para-sobre").textContent = para ? (plural ? "Queridos " : "Para ") + para : "Una invitación para ti";
  if (cupos > 0) {
    const c = document.getElementById("cupos-txt");
    c.textContent = cupos === 1 ? "Hemos reservado 1 lugar para ti." : "Hemos reservado " + cupos + " lugares para ustedes.";
    c.hidden = false;
  }
})();

/* ---------- Música de fondo ----------
   Archivo: cancion.mp3 en la misma carpeta (solo con derechos de uso).
   Empieza al tocar el sello (los celulares exigen un toque para sonar)
   y sigue sonando mientras el invitado recorre la invitación. */
const audio = document.getElementById("audio");
const btnMusica = document.getElementById("btn-musica");
audio.volume = 0.6;
function setMusica(on){
  btnMusica.classList.toggle("mudo", !on);
  btnMusica.setAttribute("aria-label", on ? "Pausar música" : "Reproducir música");
}
function sonar(){
  audio.play().then(() => setMusica(true)).catch(() => setMusica(false));
}
/* Si el invitado cambia de app, la música se pausa; al volver, continúa */
let pausadaPorSistema = false;
document.addEventListener("visibilitychange", () => {
  if (document.hidden && !audio.paused) { audio.pause(); pausadaPorSistema = true; }
  else if (!document.hidden && pausadaPorSistema) { pausadaPorSistema = false; sonar(); }
});

/* ---------- Abrir el sobre ---------- */
document.getElementById("sello").addEventListener("click", () => {
  const sobre = document.getElementById("sobre"), principal = document.getElementById("contenido");
  sobre.classList.add("abierto");
  document.body.classList.remove("cerrado");
  /* El sobre deja de recibir foco y la invitación queda disponible para teclado y lectores de pantalla */
  sobre.inert = true;
  principal.inert = false;
  btnMusica.inert = false;
  principal.focus({preventScroll:true});
  sonar();
});
btnMusica.addEventListener("click", () => {
  if (audio.paused) sonar(); else { audio.pause(); setMusica(false); }
});

function avisar(t){
  const a = document.getElementById("aviso"); a.textContent = t; a.hidden = false;
  clearTimeout(avisar.t); avisar.t = setTimeout(() => a.hidden = true, 2200);
}

/* ---------- Marco de cartela (forma de la referencia) ----------
   Se dibuja un cuarto del contorno y se refleja para obtener la forma completa. */
(function(){
  const s = document.getElementById("marco-encaje");
  const cx = 150, cy = 200;
  const P0 = [150,18];
  const segs = [
    [[162,34],[182,44],[204,44]],
    [[216,44],[224,52],[226,62]],
    [[240,60],[252,68],[254,82]],
    [[272,88],[281,104],[279,126]],
    [[277,150],[263,170],[265,186]],
    [[269,192],[276,196],[283,200]]
  ];
  const bz = (a,b,c,d,t) => { const u = 1-t; return u*u*u*a + 3*u*u*t*b + 3*u*t*t*c + t*t*t*d; };
  const q = [P0]; let prev = P0;
  for (const [c1,c2,e] of segs){
    for (let i = 1; i <= 24; i++){ const t = i/24;
      q.push([bz(prev[0],c1[0],c2[0],e[0],t), bz(prev[1],c1[1],c2[1],e[1],t)]); }
    prev = e;
  }
  const abajo = q.slice(0,-1).reverse().map(([x,y]) => [x, 2*cy - y]);
  const derecha = q.concat(abajo);
  const izquierda = derecha.slice(1,-1).reverse().map(([x,y]) => [2*cx - x, y]);
  const pts = derecha.concat(izquierda);
  const d = "M" + pts.map(([x,y]) => x.toFixed(1) + " " + y.toFixed(1)).join("L") + "Z";
  s.innerHTML = `
    <defs>
      <linearGradient id="oro-marco" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#EBD18C"/><stop offset=".35" stop-color="#B08A3A"/>
        <stop offset=".6" stop-color="#E9CD86"/><stop offset="1" stop-color="#9C7A30"/>
      </linearGradient>
      <filter id="sombra" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#1E0A0E" flood-opacity=".45"/>
      </filter>
    </defs>
    <path d="${d}" transform="translate(150 200) scale(1.075) translate(-150 -200)" fill="#F2E7DA" filter="url(#sombra)"/>
    <path d="${d}" fill="#F5EDE3"/>
    <g fill="none" stroke="#B79E92" stroke-width="1" opacity=".45" stroke-linecap="round">
      <!-- rosa en línea, muy tenue -->
      <path d="M172 214c-10-12-30-10-34 4s8 28 22 26 22-14 16-26c-5-9-18-10-22-2s4 14 10 10"/>
      <path d="M150 234c-14 4-28 0-34-10M174 236c10 6 22 4 28-6"/>
      <path d="M160 246c-4 20-14 40-30 56M136 280c-12-8-26-6-32 2 8 8 22 8 32-2zM146 266c10-10 24-10 30-2-8 8-22 8-30 2z"/>
      <path d="M128 168c-8-14-6-30 6-38 4 14 2 28-6 38zM120 176c-16-4-28 2-32 12 14 2 26-2 32-12z"/>
      <path d="M182 150c10-10 26-10 32 0-10 8-24 8-32 0zM196 186c14-2 24 6 26 16-12 2-22-4-26-16z"/>
      <path d="M128 168c10 10 16 22 18 40"/>
    </g>
    <path d="${d}" fill="none" stroke="url(#oro-marco)" stroke-width="3"/>`;
})();

/* ---------- Festón entre panel oscuro y el siguiente ---------- */
(function(){
  let d = "M0 18V8";
  for (let x = 0; x < 400; x += 20) d += ` Q${x+10} -2 ${x+20} 8`;
  d += " V18Z";
  document.getElementById("festón").setAttribute("d", d);
})();

/* ---------- Calendario del mes ---------- */
(function(){
  const cal = document.getElementById("cal");
  const dows = ["Lu","Ma","Mi","Ju","Vi","Sá","Do"];
  let h = dows.map(d => `<span class="dow">${d}</span>`).join("");
  const primero = new Date(EVENTO.anio, EVENTO.mes, 1);
  const desfase = (primero.getDay() + 6) % 7;            // lunes = 0
  const diasMes = new Date(EVENTO.anio, EVENTO.mes + 1, 0).getDate();
  const diasPrev = new Date(EVENTO.anio, EVENTO.mes, 0).getDate();
  for (let i = desfase; i > 0; i--) h += `<span class="fuera">${diasPrev - i + 1}</span>`;
  for (let d = 1; d <= diasMes; d++)
    h += d === EVENTO.dia ? `<span class="dia-boda" aria-label="${d}, día de la boda">${d}</span>` : `<span>${d}</span>`;
  const total = desfase + diasMes, resto = (7 - total % 7) % 7;
  for (let d = 1; d <= resto; d++) h += `<span class="fuera">${d}</span>`;
  cal.innerHTML = h;
})();

/* ---------- Dirección, mapa y formulario ---------- */
(function(){
  if (EVENTO.direccion) {
    const d = document.getElementById("direccion-txt"); d.textContent = EVENTO.direccion; d.className = "";
    const m = document.getElementById("mapa"); m.classList.add("con-mapa");
    /* Mapa embebido de Google: único recurso externo (permitido en el CSP con frame-src) */
    const f = document.createElement("iframe");
    f.title = "Mapa de " + EVENTO.lugar;
    f.loading = "lazy";
    f.referrerPolicy = "strict-origin-when-cross-origin";
    f.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox");
    f.src = "https://www.google.com/maps?q=" + encodeURIComponent(EVENTO.coordenadas || (EVENTO.lugar + ", " + EVENTO.direccion)) + "&z=15&output=embed";
    m.textContent = "";
    m.appendChild(f);
  }
  document.getElementById("btn-maps").href = EVENTO.mapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(EVENTO.lugar + " " + EVENTO.direccion);
})();

/* ---------- Cuenta regresiva ---------- */
(function(){
  const meta = new Date(EVENTO.inicioISO).getTime();
  const el = ["d","h","m","s"].map(i => document.getElementById(i));
  const p = n => String(n).padStart(2,"0");
  function tick(){
    let t = Math.max(0, meta - Date.now()) / 1000;
    const d = Math.floor(t/86400); t -= d*86400;
    const h = Math.floor(t/3600); t -= h*3600;
    const m = Math.floor(t/60), s = Math.floor(t - m*60);
    el[0].textContent = p(d); el[1].textContent = p(h); el[2].textContent = p(m); el[3].textContent = p(s);
  }
  tick(); setInterval(tick, 1000);
})();

/* ---------- Agregar al calendario ---------- */
(function(){
  const lugar = EVENTO.lugar + (EVENTO.direccion ? ", " + EVENTO.direccion : "");
  const det = "Ceremonia 3:00 p. m. · Recepción 5:00 p. m. · Vestimenta formal.";
  document.getElementById("btn-gcal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(EVENTO.titulo) + "&dates=" + EVENTO.inicioUTC + "/" + EVENTO.finUTC +
    "&details=" + encodeURIComponent(det + (EVENTO.mapsUrl ? "\nCómo llegar: " + EVENTO.mapsUrl : "")) + "&location=" + encodeURIComponent(lugar);
  /* Texto seguro para .ics: escapa comas, punto y coma y barras (norma iCalendar) */
  const esc = t => String(t).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n");
  document.getElementById("btn-ics").addEventListener("click", () => {
    const ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Invitaciones//Boda//ES","CALSCALE:GREGORIAN","METHOD:PUBLISH","BEGIN:VEVENT",
      "UID:boda-nicolas-liz-20261207@invitacion",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g,"").split(".")[0] + "Z",
      "DTSTART:" + EVENTO.inicioUTC, "DTEND:" + EVENTO.finUTC,
      "SUMMARY:" + esc(EVENTO.titulo), "LOCATION:" + esc(lugar),
      "DESCRIPTION:" + esc(det + (EVENTO.mapsUrl ? "\nCómo llegar: " + EVENTO.mapsUrl : "")),
      ...(EVENTO.mapsUrl ? ["URL:" + EVENTO.mapsUrl] : []),
      "BEGIN:VALARM","TRIGGER:-P1D","ACTION:DISPLAY","DESCRIPTION:" + esc("Mañana es la boda de Nicolás & Liz"),"END:VALARM",
      "END:VEVENT","END:VCALENDAR"].join("\r\n");
    /* iPhone/iPad: abrir directo en la app Calendario. Resto: descargar el archivo. */
    const esIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (esIOS) { location.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics); return; }
    const url = URL.createObjectURL(new Blob([ics], {type:"text/calendar;charset=utf-8"}));
    const a = document.createElement("a");
    a.href = url; a.download = "boda-nicolas-liz.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  });
})();

/* ---------- Fotos: marcador si aún no están ---------- */
document.querySelectorAll(".foto img").forEach(img => {
  const marcar = () => img.parentElement.classList.add("sin-foto");
  if (img.complete && img.naturalWidth === 0) marcar();
  img.addEventListener("error", marcar);
});

/* ---------- Aparición suave al hacer scroll ---------- */
(function(){
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("anim");
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  }), {threshold:.1});
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
})();


/* ---------- Protección contra marcos (clickjacking) ----------
   GitHub Pages no permite enviar el encabezado frame-ancestors,
   así que si alguien incrusta la invitación en otro sitio, salimos del marco. */
(function(){
  if (window.top !== window.self) {
    try { window.top.location.replace(window.self.location.href); }
    catch (e) { document.documentElement.style.display = "none"; }
  }
})();

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
