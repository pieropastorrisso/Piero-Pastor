document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =====================================================
     NAVEGACIÓN
  ===================================================== */

  const vistas = [...document.querySelectorAll(".vista")];
  const menu = document.getElementById("menu");
  const menuToggle = document.getElementById("menu-toggle");

  function cerrarMenu() {
    if (!menu || !menuToggle) return;

    menu.classList.remove("menu-abierto");
    menuToggle.classList.remove("activo");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");

    menuToggle.textContent = "☰";
  }

  function abrirCerrarMenu() {
    if (!menu || !menuToggle) return;

    const abierto = menu.classList.toggle("menu-abierto");

    menuToggle.classList.toggle("activo", abierto);

    menuToggle.setAttribute(
      "aria-expanded",
      abierto ? "true" : "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      abierto ? "Cerrar menú" : "Abrir menú"
    );

    menuToggle.textContent = abierto ? "✕" : "☰";
  }

  function activarVista(id, actualizarHash = true) {
    const destino = document.getElementById(id);

    if (!destino || !destino.classList.contains("vista")) {
      const inicio = document.getElementById("inicio");

      if (inicio) {
        vistas.forEach(v =>
          v.classList.remove("vista-activa")
        );

        inicio.classList.add("vista-activa");
      }

      cerrarMenu();
      return;
    }

    vistas.forEach(v =>
      v.classList.remove("vista-activa")
    );

    destino.classList.add("vista-activa");

    cerrarMenu();

    if (actualizarHash) {
      history.replaceState(
        null,
        "",
        "#" + id
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    if (id === "rasca-gana") {
      setTimeout(
        prepararRascaSiVisible,
        100
      );
    }

    if (id === "ruleta") {
      setTimeout(
        prepararRuleta,
        100
      );
    }
  }

  function activarVistaDesdeHash() {
    const id =
      window.location.hash
        .replace(/^#/, "")
        .trim();

    activarVista(
      id || "inicio",
      false
    );
  }

  if (menuToggle) {
    menuToggle.addEventListener(
      "click",
      e => {
        e.stopPropagation();
        abrirCerrarMenu();
      }
    );
  }

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(enlace => {

      enlace.addEventListener(
        "click",
        e => {

          const href =
            enlace.getAttribute("href");

          if (
            !href ||
            href === "#"
          ) {
            return;
          }

          const id =
            href.substring(1);

          const destino =
            document.getElementById(id);

          if (
            !destino ||
            !destino.classList.contains("vista")
          ) {
            return;
          }

          e.preventDefault();

          activarVista(
            id,
            true
          );
        }
      );
    });

  document.addEventListener(
    "click",
    e => {

      if (
        menu &&
        menuToggle &&
        !menu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        cerrarMenu();
      }
    }
  );

  document.addEventListener(
    "keydown",
    e => {

      if (e.key === "Escape") {
        cerrarMenu();
      }
    }
  );

  window.addEventListener(
    "hashchange",
    activarVistaDesdeHash
  );

  activarVistaDesdeHash();


  /* =====================================================
     EXPERIENCIAS / MODAL
  ===================================================== */

  const experiencias = {

    1: {
      titulo:
        'Con Brayan Kamus "Cantante"',
      descripcion:
        "Presentación y experiencia profesional en Clínica del Corazón.",
      imagen:
        "img/galeria/foto1.jpeg",
      video: ""
    },

    2: {
      titulo:
        "Evento en Monalisa Club Ica",
      descripcion:
        "Animación y conducción en Monalisa Club Ica.",
      imagen:
        "img/galeria/foto2.jpeg",
      video: ""
    },

    3: {
      titulo:
        "Graduación Contabilidad USJB",
      descripcion:
        "Maestro de ceremonias en una graduación realizada en Chincha.",
      imagen:
        "img/galeria/foto3.jpeg",
      video: ""
    },

    4: {
      titulo:
        'Con Deisy Araujo "Vedette"',
      descripcion:
        "Participación en la inauguración de Clínica del Corazón.",
      imagen:
        "img/galeria/foto4.jpeg",
      video: ""
    },

    5: {
      titulo:
        'Artista Invitada: "Anna Paz"',
      descripcion:
        "Presentación y participación en evento realizado en Clínica.",
      imagen:
        "img/galeria/foto5.jpeg",
      video: ""
    },

    6: {
      titulo:
        "Celebración Familiar",
      descripcion:
        "Animación y participación en la celebración del 50 aniversario de Raúl Pastor.",
      imagen:
        "img/galeria/foto6.jpeg",
      video: ""
    }
  };

  const modal =
    document.getElementById(
      "modal-experiencia"
    );

  const modalImagen =
    document.getElementById(
      "modal-imagen"
    );

  const modalTitulo =
    document.getElementById(
      "modal-titulo"
    );

  const modalDescripcion =
    document.getElementById(
      "modal-descripcion"
    );

  const modalVideoLink =
    document.getElementById(
      "modal-video-link"
    );

  const modalCerrar =
    document.getElementById(
      "modal-cerrar"
    );

  const modalOverlay =
    document.querySelector(
      ".modal-overlay"
    );

  function cerrarExperiencia() {

    if (!modal) return;

    modal.classList.remove(
      "activo"
    );

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow =
      "";
  }

  function abrirExperiencia(id) {

    const experiencia =
      experiencias[id];

    if (
      !modal ||
      !experiencia
    ) {
      return;
    }

    if (modalImagen) {
      modalImagen.src =
        experiencia.imagen;

      modalImagen.alt =
        experiencia.titulo;
    }

    if (modalTitulo) {
      modalTitulo.textContent =
        experiencia.titulo;
    }

    if (modalDescripcion) {
      modalDescripcion.textContent =
        experiencia.descripcion;
    }

    if (modalVideoLink) {

      if (experiencia.video) {

        modalVideoLink.hidden =
          false;

        modalVideoLink.href =
          experiencia.video;

      } else {

        modalVideoLink.hidden =
          true;

        modalVideoLink.removeAttribute(
          "href"
        );
      }
    }

    modal.classList.add(
      "activo"
    );

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";
  }

  document
    .querySelectorAll(
      ".experiencia-card"
    )
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          abrirExperiencia(
            card.dataset.experiencia
          );
        }
      );
    });

  if (modalCerrar) {

    modalCerrar.addEventListener(
      "click",
      cerrarExperiencia
    );
  }

  if (modalOverlay) {

    modalOverlay.addEventListener(
      "click",
      cerrarExperiencia
    );
  }

  document.addEventListener(
    "keydown",
    e => {

      if (
        e.key === "Escape" &&
        modal &&
        modal.classList.contains(
          "activo"
        )
      ) {
        cerrarExperiencia();
      }
    }
  );


  /* =====================================================
     PREMIOS COMPARTIDOS
     RASCA + RULETA
  ===================================================== */

  const premios = [

    {
      titulo: "1 CERVEZA",
      mensaje:
        "¡Te tocó 1 cerveza!",
      imagen:
        "rasca/cerveza.jpg"
    },

    {
      titulo: "1 AGUA",
      mensaje:
        "¡Te tocó 1 agua!",
      imagen:
        "rasca/agua.jpg"
    },

    {
      titulo: "1 POLO",
      mensaje:
        "¡Te tocó 1 polo!",
      imagen:
        "rasca/polo.jpg"
    },

    {
      titulo: "1 GORRO",
      mensaje:
        "¡Te tocó 1 gorro!",
      imagen:
        "rasca/gorro.jpg"
    },

    {
      titulo: "1 VOLT",
      mensaje:
        "¡Te tocó 1 Volt!",
      imagen:
        "rasca/volt.jpg"
    },

    {
      titulo: "CASTIGO",
      mensaje:
        "¡Te tocó castigo!",
      imagen:
        "rasca/castigo.jpg"
    },

    {
      titulo: "SIGUE INTENTANDO",
      mensaje:
        "¡Sigue intentando!",
      imagen:
        "rasca/sigue-intentando.jpg"
    },

    {
      titulo:
        "2 PEDIDOS MUSICALES",
      mensaje:
        "¡Ganaste 2 pedidos musicales!",
      imagen:
        "rasca/musical.jpg"
    },

    {
      titulo:
        "1 BESO DEL ANIMADOR",
      mensaje:
        "¡Te tocó 1 beso del animador!",
      imagen:
        "rasca/beso.jpg"
    }
  ];


  /* =====================================================
     CONTADOR GENERAL DE PARTICIPANTES
  ===================================================== */

  const CLAVE_CONTADOR =
    "pieroPastorRascaParticipantes";

  const PREMIO_ESPECIAL_CADA =
    120;

  function obtenerParticipante() {

    let numero =
      Number(
        localStorage.getItem(
          CLAVE_CONTADOR
        ) || 0
      );

    if (
      !Number.isFinite(numero) ||
      numero < 0
    ) {
      numero = 0;
    }

    numero++;

    localStorage.setItem(
      CLAVE_CONTADOR,
      String(numero)
    );

    return numero;
  }

  function obtenerPremio(numero) {

    if (
      numero %
        PREMIO_ESPECIAL_CADA ===
      0
    ) {

      return {

        titulo:
          "VALE S/ 50",

        mensaje:
          "¡FELICIDADES! Ganaste un Vale de S/ 50.",

        imagen:
          "rasca/vale-50.jpg",

        especial:
          true
      };
    }

    return {

      ...premios[
        (numero - 1) %
        premios.length
      ],

      especial:
        false
    };
  }


  /* =====================================================
     QR
  ===================================================== */

  const contenedorQR =
    document.getElementById(
      "rasca-qr"
    );

  if (
    contenedorQR &&
    typeof QRCode !==
      "undefined"
  ) {

    contenedorQR.innerHTML =
      "";

    const urlQR =
      window.location.origin +
      window.location.pathname +
      "#rasca-gana";

    new QRCode(
      contenedorQR,
      {
        text: urlQR,

        width: 150,

        height: 150,

        colorDark:
          "#000000",

        colorLight:
          "#ffffff",

        correctLevel:
          QRCode.CorrectLevel.H
      }
    );
  }


  /* =====================================================
     RASCA Y GANA
  ===================================================== */

  const rascaCanvas =
    document.getElementById(
      "rasca-canvas"
    );

  const rascaPremio =
    document.getElementById(
      "rasca-premio"
    );

  const rascaNumero =
    document.getElementById(
      "rasca-numero"
    );

  const rascaEstado =
    document.getElementById(
      "rasca-estado"
    );

  const rascaEstadoCabecera =
    document.getElementById(
      "rasca-estado-cabecera"
    );

  const rascaReset =
    document.getElementById(
      "rasca-reset"
    );


  if (
    rascaCanvas &&
    rascaPremio
  ) {

    const ctx =
      rascaCanvas.getContext(
        "2d",
        {
          willReadFrequently:
            true
        }
      );

    const UMBRAL_RASCADO =
      85;

    const BRUSH_MIN =
      20;

    const BRUSH_MAX =
      36;

    const CHECK_INTERVAL =
      120;

    let participante =
      obtenerParticipante();

    let premioActual =
      obtenerPremio(
        participante
      );

    let rascando =
      false;

    let tarjetaTerminada =
      false;

    let anchoCanvas = 0;

    let altoCanvas = 0;

    let ultimoPunto = null;

    let ultimoChequeo = 0;

    let porcentajeActual = 0;

    let sonidoContexto = null;

    let ultimoSonido = 0;


    function actualizarCabecera() {

      if (rascaNumero) {

        rascaNumero.textContent =
          "#" +
          String(
            participante
          ).padStart(
            4,
            "0"
          );
      }

      if (
        rascaEstadoCabecera
      ) {

        rascaEstadoCabecera.textContent =
          tarjetaTerminada
            ? (
                premioActual.especial
                  ? "PREMIO"
                  : "DESCUBIERTO"
              )
            : "LISTO";
      }
    }


    function prepararPremioOculto() {

      rascaPremio.className =
        "rasca-premio";

      rascaPremio.innerHTML =
        `
        <div class="rasca-premio-oculto">

          <span>
            PIERO PASTOR
          </span>

          <strong>
            PREMIO OCULTO
          </strong>

          <small>
            RASCA PARA DESCUBRIR
          </small>

        </div>
        `;
    }


    function crearTexturaMetalica() {

      ctx.globalCompositeOperation =
        "source-over";


      const base =
        ctx.createLinearGradient(
          0,
          0,
          anchoCanvas,
          altoCanvas
        );

      base.addColorStop(
        0,
        "#4b4b4b"
      );

      base.addColorStop(
        0.12,
        "#d7d7d7"
      );

      base.addColorStop(
        0.28,
        "#777"
      );

      base.addColorStop(
        0.43,
        "#eeeeee"
      );

      base.addColorStop(
        0.58,
        "#777"
      );

      base.addColorStop(
        0.75,
        "#cfcfcf"
      );

      base.addColorStop(
        0.9,
        "#666"
      );

      base.addColorStop(
        1,
        "#3c3c3c"
      );

      ctx.fillStyle =
        base;

      ctx.fillRect(
        0,
        0,
        anchoCanvas,
        altoCanvas
      );


      const brillo =
        ctx.createLinearGradient(
          -anchoCanvas * .3,
          altoCanvas,
          anchoCanvas * 1.3,
          -altoCanvas
        );

      brillo.addColorStop(
        0,
        "rgba(255,255,255,0)"
      );

      brillo.addColorStop(
        .43,
        "rgba(255,255,255,.08)"
      );

      brillo.addColorStop(
        .5,
        "rgba(255,255,255,.32)"
      );

      brillo.addColorStop(
        .57,
        "rgba(255,255,255,.08)"
      );

      brillo.addColorStop(
        1,
        "rgba(255,255,255,0)"
      );

      ctx.fillStyle =
        brillo;

      ctx.fillRect(
        0,
        0,
        anchoCanvas,
        altoCanvas
      );


      const cantidad =
        Math.min(
          10000,
          Math.floor(
            anchoCanvas *
            altoCanvas /
            30
          )
        );


      for (
        let i = 0;
        i < cantidad;
        i++
      ) {

        const x =
          Math.random() *
          anchoCanvas;

        const y =
          Math.random() *
          altoCanvas;

        const radio =
          Math.random() *
          1.1 +
          .15;

        const claro =
          Math.random() >
          .5;

        ctx.fillStyle =
          claro
            ? `rgba(255,255,255,${
                Math.random() * .12
              })`
            : `rgba(0,0,0,${
                Math.random() * .14
              })`;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          radio,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }


      ctx.strokeStyle =
        "rgba(255,255,255,.32)";

      ctx.lineWidth = 1;

      ctx.strokeRect(
        10,
        10,
        anchoCanvas - 20,
        altoCanvas - 20
      );


      ctx.textAlign =
        "center";

      ctx.textBaseline =
        "middle";

      ctx.shadowColor =
        "rgba(0,0,0,.5)";

      ctx.shadowBlur = 5;

      ctx.shadowOffsetY = 2;

      ctx.fillStyle =
        "#ffffff";

      ctx.font =
        "900 30px Arial";

      ctx.fillText(
        "RASCA AQUÍ",
        anchoCanvas / 2,
        altoCanvas / 2 - 12
      );

      ctx.font =
        "800 14px Arial";

      ctx.fillText(
        "PIERO PASTOR",
        anchoCanvas / 2,
        altoCanvas / 2 + 25
      );

      ctx.shadowColor =
        "transparent";

      ctx.shadowBlur = 0;

      ctx.shadowOffsetY = 0;
    }


    function prepararCanvas() {

      if (!rascaCanvas)
        return;

      const rect =
        rascaCanvas.getBoundingClientRect();

      if (
        rect.width < 20 ||
        rect.height < 20
      ) {
        return;
      }

      anchoCanvas =
        rect.width;

      altoCanvas =
        rect.height;

      const escala =
        Math.min(
          window.devicePixelRatio ||
            1,
          2
        );

      rascaCanvas.width =
        Math.floor(
          anchoCanvas *
          escala
        );

      rascaCanvas.height =
        Math.floor(
          altoCanvas *
          escala
        );

      ctx.setTransform(
        escala,
        0,
        0,
        escala,
        0,
        0
      );

      rascaCanvas.style.opacity =
        "1";

      rascaCanvas.style.pointerEvents =
        "auto";

      crearTexturaMetalica();

      ultimoPunto =
        null;

      porcentajeActual =
        0;
    }


    function obtenerPosicion(
      evento
    ) {

      const rect =
        rascaCanvas.getBoundingClientRect();

      return {

        x:
          evento.clientX -
          rect.left,

        y:
          evento.clientY -
          rect.top
      };
    }


    function distancia(
      a,
      b
    ) {

      return Math.hypot(
        a.x - b.x,
        a.y - b.y
      );
    }


    function dibujarSegmento(
      inicio,
      fin,
      radio
    ) {

      const distanciaTotal =
        distancia(
          inicio,
          fin
        );

      const pasos =
        Math.max(
          1,
          Math.ceil(
            distanciaTotal /
            Math.max(
              4,
              radio * .35
            )
          )
        );

      ctx.globalCompositeOperation =
        "destination-out";


      for (
        let i = 0;
        i <= pasos;
        i++
      ) {

        const t =
          i / pasos;

        const x =
          inicio.x +
          (
            fin.x -
            inicio.x
          ) *
          t;

        const y =
          inicio.y +
          (
            fin.y -
            inicio.y
          ) *
          t;

        const pincel =
          ctx.createRadialGradient(
            x,
            y,
            radio * .05,
            x,
            y,
            radio
          );

        pincel.addColorStop(
          0,
          "rgba(0,0,0,1)"
        );

        pincel.addColorStop(
          .68,
          "rgba(0,0,0,.95)"
        );

        pincel.addColorStop(
          .9,
          "rgba(0,0,0,.55)"
        );

        pincel.addColorStop(
          1,
          "rgba(0,0,0,0)"
        );

        ctx.fillStyle =
          pincel;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          radio,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      ctx.globalCompositeOperation =
        "source-over";
    }


    function crearParticulas(
      x,
      y
    ) {

      const tarjeta =
        rascaCanvas.closest(
          ".rasca-tarjeta"
        );

      if (!tarjeta)
        return;

      for (
        let i = 0;
        i < 2;
        i++
      ) {

        const particula =
          document.createElement(
            "span"
          );

        particula.className =
          "rasca-particula";

        particula.style.left =
          `${x}px`;

        particula.style.top =
          `${y}px`;

        particula.style.setProperty(
          "--dx",
          `${(Math.random() - .5) * 30}px`
        );

        particula.style.setProperty(
          "--dy",
          `${-Math.random() * 25 - 5}px`
        );

        tarjeta.appendChild(
          particula
        );

        setTimeout(
          () =>
            particula.remove(),
          650
        );
      }
    }


    function sonidoRaspado() {

      const ahora =
        performance.now();

      if (
        ahora -
        ultimoSonido <
        75
      ) {
        return;
      }

      ultimoSonido =
        ahora;

      try {

        if (!sonidoContexto) {

          sonidoContexto =
            new (
              window.AudioContext ||
              window.webkitAudioContext
            )();
        }

        if (
          sonidoContexto.state ===
          "suspended"
        ) {

          sonidoContexto.resume();
        }

        const duracion =
          .035;

        const buffer =
          sonidoContexto.createBuffer(
            1,
            Math.floor(
              sonidoContexto.sampleRate *
              duracion
            ),
            sonidoContexto.sampleRate
          );

        const data =
          buffer.getChannelData(
            0
          );

        for (
          let i = 0;
          i < data.length;
          i++
        ) {

          data[i] =
            (
              Math.random() * 2 -
              1
            ) *
            (
              1 -
              i / data.length
            );
        }

        const fuente =
          sonidoContexto
            .createBufferSource();

        const filtro =
          sonidoContexto
            .createBiquadFilter();

        const ganancia =
          sonidoContexto
            .createGain();

        fuente.buffer =
          buffer;

        filtro.type =
          "bandpass";

        filtro.frequency.value =
          1800 +
          Math.random() *
          1000;

        ganancia.gain.setValueAtTime(
          .018,
          sonidoContexto.currentTime
        );

        ganancia.gain.exponentialRampToValueAtTime(
          .001,
          sonidoContexto.currentTime +
          duracion
        );

        fuente.connect(
          filtro
        );

        filtro.connect(
          ganancia
        );

        ganancia.connect(
          sonidoContexto.destination
        );

        fuente.start();

      } catch (_) {}
    }


    function vibrar() {

      try {

        if (
          "vibrate" in navigator
        ) {

          navigator.vibrate(
            7
          );
        }

      } catch (_) {}
    }


    function borrar(
      evento
    ) {

      if (
        !rascando ||
        tarjetaTerminada
      ) {
        return;
      }

      if (
        evento.cancelable
      ) {
        evento.preventDefault();
      }

      const posicion =
        obtenerPosicion(
          evento
        );

      const radio =
        Math.max(
          BRUSH_MIN,
          Math.min(
            BRUSH_MAX,
            Math.min(
              anchoCanvas,
              altoCanvas
            ) * .035
          )
        );

      if (
        !ultimoPunto
      ) {

        ultimoPunto =
          posicion;
      }

      dibujarSegmento(
        ultimoPunto,
        posicion,
        radio
      );

      ultimoPunto =
        posicion;

      crearParticulas(
        posicion.x,
        posicion.y
      );

      sonidoRaspado();

      if (
        evento.pointerType ===
        "touch"
      ) {

        vibrar();
      }

      const ahora =
        performance.now();

      if (
        ahora -
        ultimoChequeo >=
        CHECK_INTERVAL
      ) {

        ultimoChequeo =
          ahora;

        comprobarRascado();
      }
    }


    function comprobarRascado() {

      if (
        tarjetaTerminada
      ) {
        return;
      }

      const ancho =
        rascaCanvas.width;

      const alto =
        rascaCanvas.height;

      let datos;

      try {

        datos =
          ctx.getImageData(
            0,
            0,
            ancho,
            alto
          ).data;

      } catch (_) {

        return;
      }

      let transparentes =
        0;

      let total =
        0;

      const paso =
        Math.max(
          8,
          Math.floor(
            Math.min(
              ancho,
              alto
            ) / 150
          )
        );

      for (
        let y = 0;
        y < alto;
        y += paso
      ) {

        for (
          let x = 0;
          x < ancho;
          x += paso
        ) {

          const indice =
            (
              (
                y * ancho
              ) +
              x
            ) *
            4 +
            3;

          total++;

          if (
            datos[indice] <
            80
          ) {

            transparentes++;
          }
        }
      }

      porcentajeActual =
        total
          ? (
              transparentes /
              total
            ) *
            100
          : 0;

      if (
        porcentajeActual >=
        UMBRAL_RASCADO
      ) {

        mostrarPremio();
      }
    }


    function crearConfeti() {

      const tarjeta =
        rascaCanvas.closest(
          ".rasca-tarjeta"
        );

      if (!tarjeta)
        return;

      for (
        let i = 0;
        i < 36;
        i++
      ) {

        const pieza =
          document.createElement(
            "span"
          );

        pieza.className =
          "rasca-confeti";

        pieza.style.left =
          "50%";

        pieza.style.top =
          "45%";

        pieza.style.setProperty(
          "--dx",
          `${(Math.random() - .5) * 420}px`
        );

        pieza.style.setProperty(
          "--dy",
          `${(Math.random() - .5) * 300}px`
        );

        tarjeta.appendChild(
          pieza
        );

        setTimeout(
          () =>
            pieza.remove(),
          1500
        );
      }
    }


    function mostrarPremio() {

      if (
        tarjetaTerminada
      ) {
        return;
      }

      tarjetaTerminada =
        true;

      rascando =
        false;

      ultimoPunto =
        null;

      rascaCanvas.classList.remove(
        "rascando"
      );

      rascaCanvas.style.opacity =
        "0";

      rascaCanvas.style.pointerEvents =
        "none";

      rascaPremio.className =
        "rasca-premio " +
        (
          premioActual.especial
            ? "premio-especial"
            : ""
        );

      rascaPremio.innerHTML =
        "";

      const resultado =
        document.createElement(
          "div"
        );

      resultado.className =
        "resultado-premio";

      const imagen =
        document.createElement(
          "img"
        );

      imagen.className =
        "imagen-premio-rasca";

      imagen.src =
        premioActual.imagen;

      imagen.alt =
        premioActual.titulo;

      const titulo =
        document.createElement(
          "div"
        );

      titulo.className =
        "titulo-premio-rasca";

      titulo.textContent =
        premioActual.titulo;

      const mensaje =
        document.createElement(
          "p"
        );

      mensaje.className =
        "mensaje-premio-rasca";

      mensaje.textContent =
        premioActual.mensaje;

      const codigo =
        document.createElement(
          "div"
        );

      codigo.className =
        "codigo-premio-rasca";

      codigo.textContent =
        "Código PP-" +
        String(
          participante
        ).padStart(
          4,
          "0"
        );

      resultado.append(
        imagen,
        titulo,
        mensaje,
        codigo
      );

      rascaPremio.appendChild(
        resultado
      );

      if (
        rascaEstado
      ) {

        rascaEstado.textContent =
          premioActual.especial
            ? "🎉 ¡Premio especial! Presenta tu código para reclamarlo."
            : premioActual.mensaje;
      }

      actualizarCabecera();

      crearConfeti();

      vibrar();
    }


    rascaCanvas.addEventListener(
      "pointerdown",
      evento => {

        if (
          tarjetaTerminada
        ) {
          return;
        }

        rascando =
          true;

        ultimoPunto =
          null;

        rascaCanvas.classList.add(
          "rascando"
        );

        try {

          rascaCanvas.setPointerCapture(
            evento.pointerId
          );

        } catch (_) {}

        borrar(evento);
      }
    );


    rascaCanvas.addEventListener(
      "pointermove",
      evento => {

        if (rascando) {
          borrar(evento);
        }
      }
    );


    function terminarRaspado(
      evento
    ) {

      rascando =
        false;

      ultimoPunto =
        null;

      rascaCanvas.classList.remove(
        "rascando"
      );

      try {

        rascaCanvas.releasePointerCapture(
          evento.pointerId
        );

      } catch (_) {}

      comprobarRascado();
    }


    rascaCanvas.addEventListener(
      "pointerup",
      terminarRaspado
    );

    rascaCanvas.addEventListener(
      "pointercancel",
      () => {

        rascando =
          false;

        ultimoPunto =
          null;

        rascaCanvas.classList.remove(
          "rascando"
        );
      }
    );


    function nuevaTarjeta() {

      participante =
        obtenerParticipante();

      premioActual =
        obtenerPremio(
          participante
        );

      tarjetaTerminada =
        false;

      rascando =
        false;

      ultimoPunto =
        null;

      porcentajeActual =
        0;

      prepararPremioOculto();

      if (
        rascaEstado
      ) {

        rascaEstado.textContent =
          "Raspa la superficie con el dedo o el mouse para descubrir tu premio.";
      }

      actualizarCabecera();

      prepararRascaSiVisible();
    }


    if (
      rascaReset
    ) {

      rascaReset.addEventListener(
        "click",
        nuevaTarjeta
      );
    }


    function prepararRascaSiVisible() {

      const seccionRasca =
        document.getElementById(
          "rasca-gana"
        );

      if (
        !seccionRasca
      ) {
        return;
      }

      if (
        !seccionRasca.classList.contains(
          "vista-activa"
        )
      ) {
        return;
      }

      requestAnimationFrame(
        () => {

          requestAnimationFrame(
            () => {

              if (
                !tarjetaTerminada
              ) {

                prepararCanvas();
              }
            }
          );
        }
      );
    }


    const observadorRasca =
      new MutationObserver(
        () => {

          prepararRascaSiVisible();
        }
      );


    const seccionRasca =
      document.getElementById(
        "rasca-gana"
      );

    if (
      seccionRasca
    ) {

      observadorRasca.observe(
        seccionRasca,
        {
          attributes:
            true,

          attributeFilter:
            ["class"]
        }
      );
    }


    prepararPremioOculto();

    actualizarCabecera();

    prepararRascaSiVisible();


    let temporizadorResize;

    window.addEventListener(
      "resize",
      () => {

        clearTimeout(
          temporizadorResize
        );

        temporizadorResize =
          setTimeout(
            () => {

              if (
                !tarjetaTerminada
              ) {

                prepararRascaSiVisible();
              }

            },
            250
          );
      }
    );
  }


  /* =====================================================
     RULETA
  ===================================================== */

  const ruletaCanvas =
    document.getElementById(
      "ruleta-canvas"
    );

  const ruletaGirar =
    document.getElementById(
      "ruleta-girar"
    );

  const ruletaResultado =
    document.getElementById(
      "ruleta-resultado"
    );

  const ruletaNumero =
    document.getElementById(
      "ruleta-numero"
    );


  if (
    ruletaCanvas &&
    ruletaGirar
  ) {

    const rctx =
      ruletaCanvas.getContext(
        "2d"
      );

    let ruletaAngulo =
      0;

    let ruletaGirando =
      false;

    let ruletaParticipante =
      obtenerParticipante();


    function prepararRuleta() {

      const rect =
        ruletaCanvas.getBoundingClientRect();

      const lado =
        Math.min(
          rect.width || 420,
          520
        );

      const escala =
        Math.min(
          window.devicePixelRatio ||
            1,
          2
        );

      ruletaCanvas.width =
        lado * escala;

      ruletaCanvas.height =
        lado * escala;

      rctx.setTransform(
        escala,
        0,
        0,
        escala,
        0,
        0
      );

      dibujarRuleta(
        lado / 2,
        lado / 2,
        lado * .46
      );
    }


    function dibujarRuleta(
      centroX,
      centroY,
      radio
    ) {

      const cantidad =
        premios.length;

      const segmento =
        (
          Math.PI * 2
        ) /
        cantidad;


      rctx.clearRect(
        0,
        0,
        centroX * 2,
        centroY * 2
      );


      /* BORDE EXTERIOR */

      rctx.beginPath();

      rctx.arc(
        centroX,
        centroY,
        radio + 10,
        0,
        Math.PI * 2
      );

      rctx.fillStyle =
        "#111";

      rctx.fill();

      rctx.strokeStyle =
        "#FFD700";

      rctx.lineWidth =
        5;

      rctx.stroke();


      /* SEGMENTOS */

      for (
        let i = 0;
        i < cantidad;
        i++
      ) {

        const inicio =
          ruletaAngulo +
          i * segmento;

        const fin =
          inicio +
          segmento;


        rctx.beginPath();

        rctx.moveTo(
          centroX,
          centroY
        );

        rctx.arc(
          centroX,
          centroY,
          radio,
          inicio,
          fin
        );

        rctx.closePath();


        rctx.fillStyle =
          i % 2 === 0
            ? "#151515"
            : "#292929";

        rctx.fill();


        rctx.strokeStyle =
          "rgba(255,215,0,.7)";

        rctx.lineWidth =
          2;

        rctx.stroke();


        /* TEXTO */

        const anguloTexto =
          inicio +
          segmento / 2;

        const textoRadio =
          radio * .69;

        const tx =
          centroX +
          Math.cos(
            anguloTexto
          ) *
          textoRadio;

        const ty =
          centroY +
          Math.sin(
            anguloTexto
          ) *
          textoRadio;


        rctx.save();

        rctx.translate(
          tx,
          ty
        );

        rctx.rotate(
          anguloTexto +
          Math.PI / 2
        );


        rctx.fillStyle =
          "#ffffff";

        rctx.font =
          "800 11px Arial";

        rctx.textAlign =
          "center";

        rctx.textBaseline =
          "middle";


        let texto =
          premios[i].titulo;


        if (
          texto.length >
          19
        ) {

          texto =
            texto.substring(
              0,
              18
            ) +
            "…";
        }


        rctx.fillText(
          texto,
          0,
          0
        );

        rctx.restore();
      }


      /* CENTRO */

      rctx.beginPath();

      rctx.arc(
        centroX,
        centroY,
        radio * .17,
        0,
        Math.PI * 2
      );

      rctx.fillStyle =
        "#000";

      rctx.fill();

      rctx.strokeStyle =
        "#FFD700";

      rctx.lineWidth =
        4;

      rctx.stroke();


      rctx.fillStyle =
        "#FFD700";

      rctx.font =
        "900 12px Arial";

      rctx.textAlign =
        "center";

      rctx.textBaseline =
        "middle";

      rctx.fillText(
        "PIERO",
        centroX,
        centroY - 7
      );

      rctx.fillText(
        "PASTOR",
        centroX,
        centroY + 8
      );
    }


    function obtenerPremioRuleta() {

      const cantidad =
        premios.length;

      const segmento =
        (
          Math.PI * 2
        ) /
        cantidad;


      /*
        El puntero está arriba.
        Calculamos qué segmento queda
        exactamente debajo del puntero.
      */

      let angulo =
        (
          -
            Math.PI / 2 -
            ruletaAngulo
        ) %
        (
          Math.PI * 2
        );


      if (
        angulo < 0
      ) {
        angulo +=
          Math.PI * 2;
      }


      const indice =
        Math.floor(
          angulo /
          segmento
        );


      return premios[
        indice
      ];
    }


    function mostrarResultadoRuleta(
      premio
    ) {

      if (
        !ruletaResultado
      ) {
        return;
      }


      ruletaResultado.innerHTML =
        `
        <div class="ruleta-premio-resultado">

          <img
            src="${premio.imagen}"
            alt="${premio.titulo}"
          >

          <strong>
            ${premio.titulo}
          </strong>

          <span>
            ${premio.mensaje}
          </span>

        </div>
        `;
    }


    function girarRuleta() {

      if (
        ruletaGirando
      ) {
        return;
      }


      ruletaGirando =
        true;

      ruletaGirar.disabled =
        true;


      ruletaParticipante =
        obtenerParticipante();


      if (
        ruletaNumero
      ) {

        ruletaNumero.textContent =
          "#" +
          String(
            ruletaParticipante
          ).padStart(
            4,
            "0"
          );
      }


      /*
        Para la ruleta usamos los mismos
        premios del Rasca.

        Cada 120 participantes:
        Vale de S/50.
      */

      const premioEspecial =
        ruletaParticipante %
          PREMIO_ESPECIAL_CADA ===
        0;


      const cantidad =
        premios.length;

      const segmento =
        (
          Math.PI * 2
        ) /
        cantidad;


      let indiceObjetivo;


      if (
        premioEspecial
      ) {

        /*
          El Vale S/50 no es un segmento
          físico de la ruleta porque
          actualmente la ruleta representa
          los mismos 9 premios.

          Después de caer en un premio,
          el sistema puede convertirlo
          en Vale S/50 en el participante 120.
        */

        indiceObjetivo =
          Math.floor(
            Math.random() *
            cantidad
          );

      } else {

        indiceObjetivo =
          Math.floor(
            Math.random() *
            cantidad
          );
      }


      const vueltas =
        6 +
        Math.floor(
          Math.random() * 3
        );


      const centroSegmento =
        indiceObjetivo *
        segmento +
        segmento / 2;


      const anguloObjetivo =
        -
          Math.PI / 2 -
          centroSegmento;


      const actual =
        ruletaAngulo;


      const dosPi =
        Math.PI * 2;


      let diferencia =
        (
          anguloObjetivo -
          actual
        ) %
        dosPi;


      if (
        diferencia < 0
      ) {

        diferencia +=
          dosPi;
      }


      const destino =
        actual +
        vueltas * dosPi +
        diferencia;


      const duracion =
        5200;


      const inicio =
        performance.now();


      function animar(
        tiempo
      ) {

        const progreso =
          Math.min(
            1,
            (
              tiempo -
              inicio
            ) /
            duracion
          );


        /*
          Ease out cúbico
        */

        const suavizado =
          1 -
          Math.pow(
            1 - progreso,
            4
          );


        ruletaAngulo =
          actual +
          (
            destino -
            actual
          ) *
          suavizado;


        dibujarRuleta(
          ruletaCanvas.clientWidth / 2,
          ruletaCanvas.clientHeight / 2,
          Math.min(
            ruletaCanvas.clientWidth,
            ruletaCanvas.clientHeight
          ) * .46
        );


        if (
          progreso <
          1
        ) {

          requestAnimationFrame(
            animar
          );

        } else {

          ruletaAngulo =
            destino;

          ruletaGirando =
            false;

          ruletaGirar.disabled =
            false;


          let premio =
            obtenerPremioRuleta();


          /*
            Premio especial cada 120.
          */

          if (
            premioEspecial
          ) {

            premio = {

              titulo:
                "VALE S/ 50",

              mensaje:
                "¡FELICIDADES! Ganaste un Vale de S/ 50.",

              imagen:
                "rasca/vale-50.jpg",

              especial:
                true
            };
          }


          mostrarResultadoRuleta(
            premio
          );


          try {

            if (
              "vibrate" in
              navigator
            ) {

              navigator.vibrate(
                [40, 60, 40]
              );
            }

          } catch (_) {}
        }
      }


      requestAnimationFrame(
        animar
      );
    }


    ruletaGirar.addEventListener(
      "click",
      girarRuleta
    );


    window.addEventListener(
      "resize",
      () => {

        if (
          document.getElementById(
            "ruleta"
          )?.classList.contains(
            "vista-activa"
          )
        ) {

          prepararRuleta();
        }
      }
    );


    prepararRuleta();
  }


  /* =====================================================
     CONTADOR DE VISITAS
  ===================================================== */

  const contadorVisitas =
    document.getElementById(
      "contador-visitas"
    );


  if (
    contadorVisitas
  ) {

    const CLAVE_VISITAS =
      "pieroPastorVisitas";


    let visitas =
      Number(
        localStorage.getItem(
          CLAVE_VISITAS
        ) || 0
      );


    if (
      !Number.isFinite(
        visitas
      ) ||
      visitas < 0
    ) {

      visitas = 0;
    }


    visitas++;


    localStorage.setItem(
      CLAVE_VISITAS,
      String(visitas)
    );


    contadorVisitas.textContent =
      visitas.toLocaleString(
        "es-PE"
      );
  }


  /* =====================================================
     FORMULARIO DE CORREO
  ===================================================== */

  const formularioCorreo =
    document.getElementById(
      "form-correo"
    );

  const campoCorreo =
    document.getElementById(
      "correo"
    );

  const aceptaCorreo =
    document.getElementById(
      "acepto-correo"
    );

  const mensajeCorreo =
    document.getElementById(
      "mensaje-correo"
    );


  if (
    formularioCorreo
  ) {

    formularioCorreo.addEventListener(
      "submit",
      evento => {

        evento.preventDefault();


        if (
          !campoCorreo ||
          !aceptaCorreo
        ) {
          return;
        }


        if (
          !campoCorreo.checkValidity() ||
          !aceptaCorreo.checked
        ) {
          return;
        }


        const CLAVE_CORREOS =
          "pieroPastorCorreos";


        let correos = [];


        try {

          correos =
            JSON.parse(
              localStorage.getItem(
                CLAVE_CORREOS
              ) || "[]"
            );


          if (
            !Array.isArray(
              correos
            )
          ) {

            correos = [];
          }

        } catch (_) {

          correos = [];
        }


        const correo =
          campoCorreo.value
            .trim()
            .toLowerCase();


        if (
          !correos.includes(
            correo
          )
        ) {

          correos.push(
            correo
          );
        }


        localStorage.setItem(
          CLAVE_CORREOS,
          JSON.stringify(
            correos
          )
        );


        if (
          mensajeCorreo
        ) {

          mensajeCorreo.textContent =
            "Gracias. Tu correo fue registrado.";
        }


        formularioCorreo.reset();
      }
    );
  }

});