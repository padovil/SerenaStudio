/*!
 * © 2026 Serena Studio. Todos los derechos reservados.
 * Invitación digital · Fulgencio & Diana · 5 de diciembre de 2026
 */
"use strict";

/* =========================================================
   DATOS DEL EVENTO — editar aquí
   ========================================================= */
const EVENTO = {
  titulo: "Boda de Fulgencio & Diana",
  inicioISO: "2026-12-05T15:00:00-05:00",   // ceremonia (cuenta regresiva)
  calInicioUTC: "20261205T190000Z",          // 2:00 p. m. llegada de invitados
  calFinUTC:    "20261206T020000Z",          // 9:00 p. m. fin de la fiesta
  anio: 2026, mes: 11, dia: 5,               // mes en base 0 (11 = diciembre)
  lugar: "Hacienda El Jardín Secreto",
  direccion: "Km 4 vía Tenjo - La Punta, Tenjo, Cundinamarca",
  mapsUrl: "https://maps.app.goo.gl/c9KUocV5WGahpNpf9",
  novios: "Fulgencio y Diana",
  maxPersonas: 6,                            // tope del selector si el link no trae ?cupos=
  /* Confirmaciones → hoja de Google (ver docs/rsvp-hoja-google.md).
     Pegar aquí la URL de la aplicación web de Apps Script (termina en /exec). */
  hojaUrl: "",                               // [PENDIENTE]
  /* Álbum compartido para el QR de fotos (lo crea el estudio). */
  albumUrl: "",                              // [PENDIENTE]
  hospedajeTel: "573124301798"
};

const $ = id => document.getElementById(id);
function avisar(t){
  const a = $("aviso"); a.textContent = t; a.hidden = false;
  clearTimeout(avisar.t); avisar.t = setTimeout(() => a.hidden = true, 2600);
}

/* ---------- Personalización: ?para=Familia%20Pérez&cupos=2 ---------- */
const Q = new URLSearchParams(location.search);
const PARA = (Q.get("para") || "").trim().slice(0, 60);
const CUPOS = Math.min(20, parseInt(Q.get("cupos"), 10) || 0);
(function(){
  /* "Querida familia Pérez", "Queridos Ana y Luis", "Para Laura" */
  const saludo = /^familia\b/i.test(PARA) ? "Querida " + PARA.replace(/^familia/i, "familia")
    : /\sy\s|&|,/.test(PARA) ? "Queridos " + PARA : "Para " + PARA;
  $("para-sobre").textContent = PARA ? saludo : "Una invitación para ti";
  if (CUPOS > 0) {
    const c = $("cupos-txt");
    c.textContent = CUPOS === 1 ? "Hemos reservado 1 lugar para ti." : "Hemos reservado " + CUPOS + " lugares para ustedes.";
    c.hidden = false;
  }
  if (PARA) $("f-nombre").value = PARA;
})();

/* ---------- Música de fondo ----------
   cancion.mp3 en esta carpeta. Empieza al tocar el sello (los celulares exigen un toque).
   Si el archivo no existe, el botón se oculta. */
const audio = $("audio");
const btnMusica = $("btn-musica");
let hayMusica = true;
audio.volume = 0.6;
audio.addEventListener("error", () => { hayMusica = false; btnMusica.hidden = true; });
function setMusica(on){
  btnMusica.classList.toggle("mudo", !on);
  btnMusica.setAttribute("aria-label", on ? "Pausar música" : "Reproducir música");
}
function sonar(){
  if (!hayMusica) return;
  audio.play().then(() => setMusica(true)).catch(() => setMusica(false));
}
let pausadaPorSistema = false;
document.addEventListener("visibilitychange", () => {
  if (document.hidden && !audio.paused) { audio.pause(); pausadaPorSistema = true; }
  else if (!document.hidden && pausadaPorSistema) { pausadaPorSistema = false; sonar(); }
});

/* ---------- Abrir el sobre ---------- */
$("sello").addEventListener("click", () => {
  const sobre = $("sobre"), principal = $("contenido");
  sobre.classList.add("abierto");
  setTimeout(() => sobre.hidden = true, 1200);   // fuera del todo cuando termina de subir
  document.body.classList.remove("cerrado");
  sobre.inert = true;
  principal.inert = false;
  btnMusica.inert = false;
  principal.focus({preventScroll:true});
  sonar();
});
btnMusica.addEventListener("click", () => {
  if (audio.paused) sonar(); else { audio.pause(); setMusica(false); }
});

/* ---------- Marco de cartela ----------
   Se dibuja un cuarto del contorno y se refleja para obtener la forma completa. */
(function(){
  const s = $("marco-encaje");
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
        <stop offset="0" stop-color="#F0E4D3"/><stop offset=".35" stop-color="#A28A74"/>
        <stop offset=".6" stop-color="#E3D3BD"/><stop offset="1" stop-color="#86705D"/>
      </linearGradient>
      <filter id="sombra" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#1E0A0E" flood-opacity=".45"/>
      </filter>
    </defs>
    <path d="${d}" transform="translate(150 200) scale(1.075) translate(-150 -200)" fill="#E7DCCD" filter="url(#sombra)"/>
    <path d="${d}" fill="#F4EFE7"/>
    <!-- ramitas de olivo arriba y abajo, muy suaves -->
    <g fill="none" stroke="#838A74" stroke-width="1.1" opacity=".5" stroke-linecap="round">
      <path d="M120 64c20-8 40-8 60 0"/>
      <path d="M134 60c-3-6-9-8-14-6 3 5 9 7 14 6zM150 57c0-6-4-10-9-10 0 6 4 9 9 10zM166 60c3-6 9-8 14-6-3 5-9 7-14 6z"/>
      <path d="M120 336c20 8 40 8 60 0"/>
      <path d="M134 340c-3 6-9 8-14 6 3-5 9-7 14-6zM150 343c0 6-4 10-9 10 0-6 4-9 9-10zM166 340c3 6 9 8 14 6-3-5-9-7-14-6z"/>
    </g>
    <path d="${d}" fill="none" stroke="url(#oro-marco)" stroke-width="3"/>`;
})();

/* ---------- Festón entre el panel oscuro y el siguiente ---------- */
(function(){
  let d = "M0 18V8";
  for (let x = 0; x < 400; x += 20) d += ` Q${x+10} -2 ${x+20} 8`;
  d += " V18Z";
  $("feston").setAttribute("d", d);
})();

/* ---------- Calendario del mes ---------- */
(function(){
  const dows = ["Lu","Ma","Mi","Ju","Vi","Sá","Do"];
  let h = dows.map(d => `<span class="dow">${d}</span>`).join("");
  const primero = new Date(EVENTO.anio, EVENTO.mes, 1);
  const desfase = (primero.getDay() + 6) % 7;            // lunes = 0
  const diasMes = new Date(EVENTO.anio, EVENTO.mes + 1, 0).getDate();
  const diasPrev = new Date(EVENTO.anio, EVENTO.mes, 0).getDate();
  for (let i = desfase; i > 0; i--) h += `<span class="fuera">${diasPrev - i + 1}</span>`;
  for (let d = 1; d <= diasMes; d++)
    h += d === EVENTO.dia ? `<span class="dia-boda">${d}</span>` : `<span>${d}</span>`;
  const total = desfase + diasMes, resto = (7 - total % 7) % 7;
  for (let d = 1; d <= resto; d++) h += `<span class="fuera">${d}</span>`;
  $("cal").innerHTML = h;
})();

/* ---------- Mapa y "Cómo llegar" ---------- */
(function(){
  const m = $("mapa"); m.classList.add("con-mapa");
  const f = document.createElement("iframe");
  f.title = "Mapa de " + EVENTO.lugar;
  f.loading = "lazy";
  f.referrerPolicy = "strict-origin-when-cross-origin";
  f.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox");
  f.src = "https://www.google.com/maps?q=" + encodeURIComponent(EVENTO.lugar + ", Tenjo, Cundinamarca") + "&z=14&output=embed";
  m.textContent = "";
  m.appendChild(f);
  $("btn-maps").href = EVENTO.mapsUrl;
})();

/* ---------- Cuenta regresiva ---------- */
(function(){
  const meta = new Date(EVENTO.inicioISO).getTime();
  const el = ["d","h","m","s"].map($);
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
  const lugar = EVENTO.lugar + ", " + EVENTO.direccion;
  const det = "Llegada 2:00 p. m. · Ceremonia 3:00 p. m. · Vestimenta formal.\nCómo llegar: " + EVENTO.mapsUrl;
  $("btn-gcal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(EVENTO.titulo) + "&dates=" + EVENTO.calInicioUTC + "/" + EVENTO.calFinUTC +
    "&details=" + encodeURIComponent(det) + "&location=" + encodeURIComponent(lugar);
  /* Texto seguro para .ics (norma iCalendar) */
  const esc = t => String(t).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n");
  $("btn-ics").addEventListener("click", () => {
    const ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Serena Studio//Boda//ES","CALSCALE:GREGORIAN","METHOD:PUBLISH","BEGIN:VEVENT",
      "UID:boda-fulgencio-diana-20261205@serenastudio",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g,"").split(".")[0] + "Z",
      "DTSTART:" + EVENTO.calInicioUTC, "DTEND:" + EVENTO.calFinUTC,
      "SUMMARY:" + esc(EVENTO.titulo), "LOCATION:" + esc(lugar),
      "DESCRIPTION:" + esc(det), "URL:" + EVENTO.mapsUrl,
      "BEGIN:VALARM","TRIGGER:-P1D","ACTION:DISPLAY","DESCRIPTION:" + esc("Mañana es la boda de Fulgencio & Diana"),"END:VALARM",
      "END:VEVENT","END:VCALENDAR"].join("\r\n");
    const esIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (esIOS) { location.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics); return; }
    const url = URL.createObjectURL(new Blob([ics], {type:"text/calendar;charset=utf-8"}));
    const a = document.createElement("a");
    a.href = url; a.download = "boda-fulgencio-diana.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  });
})();

/* ---------- Hospedaje ---------- */
(function(){
  $("btn-hospedaje-wa").href = "https://wa.me/" + EVENTO.hospedajeTel + "?text=" +
    encodeURIComponent("Hola Carlos, voy a la boda de " + EVENTO.novios + " el 5 de diciembre y quisiera información sobre el hospedaje.");
  $("btn-hospedaje-tel").href = "tel:+" + EVENTO.hospedajeTel;
})();

/* ---------- Álbum de fotos (QR) ---------- */
(function(){
  const b = $("btn-album");
  if (EVENTO.albumUrl) { b.href = EVENTO.albumUrl; return; }
  b.setAttribute("aria-disabled", "true");
  b.addEventListener("click", e => { e.preventDefault(); avisar("El álbum estará disponible muy pronto."); });
})();

/* ---------- Fotos: marcador si aún no están ---------- */
document.querySelectorAll(".foto img").forEach(img => {
  const marcar = () => img.parentElement.classList.add("sin-foto");
  if (img.complete && img.naturalWidth === 0) marcar();
  img.addEventListener("error", marcar);
});

/* ---------- Confirmación de asistencia → hoja de Google ---------- */
(function(){
  const form = $("form-rsvp"), err = $("form-error"), btn = $("btn-enviar");
  const sel = $("f-personas");
  const max = CUPOS > 0 ? CUPOS : EVENTO.maxPersonas;
  for (let i = 1; i <= max; i++) sel.add(new Option(String(i), String(i), i === max && CUPOS > 0, i === max && CUPOS > 0));
  if (!(CUPOS > 0)) sel.value = "1";

  const soloSi = form.querySelectorAll(".solo-si");
  function actualizar(){
    const va = form.querySelector('input[name="Asiste"]:checked').value === "Sí";
    soloSi.forEach(el => el.hidden = !va);
    $("campo-acomp").hidden = !va || sel.value === "1";
  }
  form.addEventListener("change", actualizar);
  actualizar();

  function mostrarError(t){ err.textContent = t; err.hidden = false; }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    err.hidden = true;
    const nombre = $("f-nombre").value.trim();
    if (!nombre) { mostrarError("Por favor escribe tu nombre."); $("f-nombre").focus(); return; }
    if (!EVENTO.hojaUrl) { mostrarError("El formulario aún se está configurando. Intenta de nuevo en unas horas."); return; }

    const datos = new URLSearchParams();
    const va = form.querySelector('input[name="Asiste"]:checked').value;
    datos.append("Nombre", nombre);
    datos.append("Asiste", va);
    datos.append("Número de personas", va === "Sí" ? sel.value : "0");
    datos.append("Acompañantes", va === "Sí" ? $("f-acomp").value.trim() : "");
    datos.append("Teléfono", $("f-tel").value.trim());
    datos.append("Alergias o restricciones", va === "Sí" ? $("f-alergias").value.trim() : "");
    datos.append("Canción", va === "Sí" ? $("f-cancion").value.trim() : "");
    datos.append("Mensaje para los novios", $("f-mensaje").value.trim());
    datos.append("Link", PARA ? "para=" + PARA + (CUPOS ? " · cupos=" + CUPOS : "") : "");
    datos.append("_hp", form.querySelector('input[name="_hp"]').value);

    btn.disabled = true; btn.setAttribute("aria-busy", "true");
    try {
      await fetch(EVENTO.hojaUrl, { method: "POST", mode: "no-cors", body: datos });
      form.hidden = true;
      const ok = $("rsvp-ok");
      $("rsvp-ok-t").textContent = va === "Sí" ? "¡Gracias, " + nombre.split(" ")[0] + "!" : "Gracias por avisarnos";
      $("rsvp-ok-txt").textContent = va === "Sí" ? "Recibimos tu confirmación. ¡Nos vemos el 5 de diciembre!" : "Te vamos a extrañar. Gracias por contarnos.";
      ok.hidden = false;
      ok.focus({preventScroll: true});
      ok.scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center"});
    } catch (_) {
      mostrarError("No pudimos enviar tu confirmación. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      btn.disabled = false; btn.removeAttribute("aria-busy");
    }
  });

  $("rsvp-otra").addEventListener("click", () => {
    form.reset(); $("f-nombre").value = ""; actualizar();
    $("rsvp-ok").hidden = true; form.hidden = false; $("f-nombre").focus();
  });
})();

/* ---------- Aparición suave al hacer scroll ---------- */
(function(){
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("anim");
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  }), {threshold:.1});
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
})();

/* ---------- Protección contra marcos (clickjacking) ---------- */
(function(){
  if (window.top !== window.self) {
    try { window.top.location.replace(window.self.location.href); }
    catch (e) { document.documentElement.style.display = "none"; }
  }
})();
