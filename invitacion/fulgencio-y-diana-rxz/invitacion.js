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
  direccion: "km 4 vía Tenjo - La Punta, Tenjo, Cundinamarca",
  mapsUrl: "https://maps.app.goo.gl/c9KUocV5WGahpNpf9",
  novios: "Fulgencio y Diana",
  maxPersonas: 6,                            // tope del selector si el link no trae ?cupos=
  /* Confirmaciones → hoja de Google (ver docs/rsvp-hoja-google.md).
     Pegar aquí la URL de la aplicación web de Apps Script (termina en /exec). */
  hojaUrl: "https://script.google.com/macros/s/AKfycbyVDkS45jm6eb2AXaP-B_Ou71Yk3o5O6AhZuk9vTD7GjkwTtrTUg3ac5BUzNOZj9ak2-Q/exec",
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

/* ---------- Cinta "nos casamos" de la portada (dos copias para que el movimiento sea continuo) ---------- */
(function(){
  const c = $("cinta");
  const una = Array.from({length: 6}, () => "<span>nos casamos</span><i>&#9679;</i>").join("");
  c.innerHTML = una + una;
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
})();

/* ---------- Hospedaje ---------- */
(function(){
  $("btn-hospedaje-wa").href = "https://wa.me/" + EVENTO.hospedajeTel + "?text=" +
    encodeURIComponent("Hola, Carlos. Voy a la boda de " + EVENTO.novios + " el 5 de diciembre y quisiera información sobre el hospedaje.");
})();

/* ---------- Álbum de fotos (QR) ---------- */
(function(){
  const b = $("btn-album");
  if (EVENTO.albumUrl) { b.href = EVENTO.albumUrl; return; }
  b.setAttribute("aria-disabled", "true");
  b.addEventListener("click", e => { e.preventDefault(); avisar("El álbum estará disponible muy pronto."); });
})();

/* ---------- Copiar el hashtag ---------- */
$("btn-hashtag").addEventListener("click", () => {
  const t = "#NuestroJardínSecreto";
  (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject())
    .then(() => avisar("Hashtag copiado"))
    .catch(() => avisar(t));
});

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
    datos.append("Mensaje para los novios", $("f-mensaje").value.trim());
    datos.append("Link", PARA ? "para=" + PARA + (CUPOS ? " · cupos=" + CUPOS : "") : "");
    datos.append("_hp", form.querySelector('input[name="_hp"]').value);

    /* Estado "Enviando…": el invitado ve que la confirmación está en camino */
    btn.disabled = true; btn.setAttribute("aria-busy", "true");
    btn.classList.add("enviando"); form.classList.add("enviando");
    avisar("Enviando tu confirmación…");
    const espera = new Promise(r => setTimeout(r, 900));   // mínimo visible, para que no parpadee
    try {
      await Promise.all([fetch(EVENTO.hojaUrl, { method: "POST", mode: "no-cors", body: datos }), espera]);
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
      btn.classList.remove("enviando"); form.classList.remove("enviando");
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
