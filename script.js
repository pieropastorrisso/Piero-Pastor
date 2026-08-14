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
        vistas.forEach(v => v.classList.remove("vista-activa"));
        inicio.classList.add("vista-activa");
      }

      cerrarMenu();
      return;
    }

    /*
       JUEGA Y GANA
       Rasca y Gana y Ruleta requieren
       un registro previo.
    */
    if (
      (id === "rasca-gana" || id === "ruleta") &&
      !hayRegistroJuego()
    ) {
      vistas.forEach(v => v.classList.remove("vista-activa"));

      const juegaGana =
        document.getElementById("juega-gana");

      if (juegaGana) {
        juegaGana.classList.add("vista-activa");
      }

      cerrarMenu();

      if (actualizarHash) {
        history.replaceState(
          null,
          "",
          "#juega-gana"
        );
      }

      mostrarErrorRegistro(
        "Primero registra tu correo electrónico y DNI para participar."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      return;
    }

    vistas.forEach(v => v.classList.remove("vista-activa"));
    destino.classList.add("vista-activa");

    cerrarMenu();

    if (actualizarHash) {
      history.replaceState(null, "", "#" + id);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    if (id === "rasca-gana") {
      setTimeout(prepararRascaSiVisible, 100);
    }
  }

  /* =====================================================
     JUEGA Y GANA — REGISTRO ÚNICO
  ===================================================== */

  const CLAVE_REGISTRO_JUEGO =
    "pieroPastorRegistroJuego";

  const CLAVE_PARTICIPANTE_JUEGO =
    "pieroPastorParticipanteJuego";

  const formularioJuegaGana =
    document.getElementById(
      "form-juega-gana"
    );

  const campoJuegaCorreo =
    document.getElementById(
      "juega-correo"
    );

  const campoJuegaDni =
    document.getElementById(
      "juega-dni"
    );

  const juegoRegistro =
    document.getElementById(
      "juego-registro"
    );

  const juegosEleccion =
    document.getElementById(
      "juegos-eleccion"
    );

  const juegoRegistroError =
    document.getElementById(
      "juego-registro-error"
    );

  function obtenerRegistroJuego() {
    try {
      const registro =
        JSON.parse(
          localStorage.getItem(
            CLAVE_REGISTRO_JUEGO
          ) || "null"
        );

      if (
        !registro ||
        typeof registro !== "object"
      ) {
        return null;
      }

      if (
        typeof registro.correo !== "string" ||
        typeof registro.dni !== "string"
      ) {
        return null;
      }

      return registro;
    } catch (_) {
      return null;
    }
  }

  function hayRegistroJuego() {
    const registro =
      obtenerRegistroJuego();

    return Boolean(
      registro &&
      registro.correo &&
      /^\d{8}$/.test(registro.dni)
    );
  }

  function mostrarErrorRegistro(mensaje) {
    if (!juegoRegistroError) return;

    juegoRegistroError.textContent =
      mensaje || "";

    if (mensaje) {
      juegoRegistroError.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }

  function actualizarInterfazJuegaGana() {
    const registrado =
      hayRegistroJuego();

    if (juegoRegistro) {
      juegoRegistro.hidden =
        registrado;
    }

    if (juegosEleccion) {
      juegosEleccion.hidden =
        !registrado;
    }
  }

  function obtenerParticipanteJuego() {

    const registro = obtenerRegistroJuego();

    if (!registro) {
      return 0;
    }

    const participanteGuardado =
      Number(registro.participante);

    if (
      Number.isInteger(participanteGuardado) &&
      participanteGuardado > 0
    ) {
      return participanteGuardado;
    }

    let numero =
      Number(
        localStorage.getItem(
          CLAVE_PARTICIPANTE_JUEGO
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
      CLAVE_PARTICIPANTE_JUEGO,
      String(numero)
    );

    registro.participante = numero;

    localStorage.setItem(
      CLAVE_REGISTRO_JUEGO,
      JSON.stringify(registro)
    );

    return numero;
  }

  function guardarRegistroJuego(
    correo,
    dni
  ) {

    const registro = {
      correo,
      dni,
      fecha: new Date().toISOString(),
      participante: 0
    };

    localStorage.setItem(
      CLAVE_REGISTRO_JUEGO,
      JSON.stringify(registro)
    );

    return obtenerParticipanteJuego();
  }

  if (formularioJuegaGana) {
    formularioJuegaGana.addEventListener(
      "submit",
      evento => {
        evento.preventDefault();

        if (
          !campoJuegaCorreo ||
          !campoJuegaDni
        ) {
          return;
        }

        const correo =
          campoJuegaCorreo.value
            .trim()
            .toLowerCase();

        const dni =
          campoJuegaDni.value
            .replace(/\D/g, "")
            .slice(0, 8);

        campoJuegaDni.value =
          dni;

        if (!correo) {
          mostrarErrorRegistro(
            "Ingresa tu correo electrónico."
          );
          campoJuegaCorreo.focus();
          return;
        }

        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            correo
          )
        ) {
          mostrarErrorRegistro(
            "Ingresa un correo electrónico válido."
          );
          campoJuegaCorreo.focus();
          return;
        }

        if (!/^\d{8}$/.test(dni)) {
          mostrarErrorRegistro(
            "El DNI debe tener exactamente 8 dígitos."
          );
          campoJuegaDni.focus();
          return;
        }

        guardarRegistroJuego(
          correo,
          dni
        );

        mostrarErrorRegistro("");

        actualizarInterfazJuegaGana();
      }
    );
  }

  if (campoJuegaDni) {
    campoJuegaDni.addEventListener(
      "input",
      () => {
        campoJuegaDni.value =
          campoJuegaDni.value
            .replace(/\D/g, "")
            .slice(0, 8);
      }
    );
  }

  document
    .querySelectorAll(
      ".juego-opcion[data-juego]"
    )
    .forEach(boton => {
      boton.addEventListener(
        "click",
        () => {
          const juego =
            boton.getAttribute(
              "data-juego"
            );

          if (
            !juego ||
            !hayRegistroJuego()
          ) {
            activarVista(
              "juega-gana",
              true
            );
            return;
          }

          sessionStorage.setItem(
            "pieroPastorJuegoSeleccionado",
            juego
          );

          activarVista(
            juego,
            true
          );
        }
      );
    });

  actualizarInterfazJuegaGana();


  function activarVistaDesdeHash() {
    const id = window.location.hash
      .replace(/^#/, "")
      .trim();

    activarVista(id || "inicio", false);
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", e => {
      e.stopPropagation();
      abrirCerrarMenu();
    });
  }

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(enlace => {
      enlace.addEventListener("click", e => {
        const href = enlace.getAttribute("href");

        if (!href || href === "#") return;

        const id = href.substring(1);
        const destino = document.getElementById(id);

        if (
          !destino ||
          !destino.classList.contains("vista")
        ) {
          return;
        }

        e.preventDefault();
        activarVista(id, true);
      });
    });

  document.addEventListener("click", e => {
    if (
      menu &&
      menuToggle &&
      !menu.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      cerrarMenu();
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      cerrarMenu();
    }
  });

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
      titulo: 'Con Brayan Kamus "Cantante"',
      descripcion:
        "Presentación y experiencia profesional en Clínica del Corazón.",
      imagen: "img/galeria/foto1.jpeg",
      video: ""
    },

    2: {
      titulo: "Evento en Monalisa Club Ica",
      descripcion:
        "Animación y conducción en Monalisa Club Ica.",
      imagen: "img/galeria/foto2.jpeg",
      video: ""
    },

    3: {
      titulo: "Graduación Contabilidad USJB",
      descripcion:
        "Maestro de ceremonias en una graduación realizada en Chincha.",
      imagen: "img/galeria/foto3.jpeg",
      video: ""
    },

    4: {
      titulo: 'Con Deisy Araujo "Vedette"',
      descripcion:
        "Participación en la inauguración de Clínica del Corazón.",
      imagen: "img/galeria/foto4.jpeg",
      video: ""
    },

    5: {
      titulo: 'Artista Invitada: "Anna Paz"',
      descripcion:
        "Presentación y participación en evento realizado en Clínica.",
      imagen: "img/galeria/foto5.jpeg",
      video: ""
    },

    6: {
      titulo: "Celebración Familiar",
      descripcion:
        "Animación y participación en la celebración del 50 aniversario de Raúl Pastor.",
      imagen: "img/galeria/foto6.jpeg",
      video: ""
    }
  };

  const modal =
    document.getElementById("modal-experiencia");

  const modalImagen =
    document.getElementById("modal-imagen");

  const modalTitulo =
    document.getElementById("modal-titulo");

  const modalDescripcion =
    document.getElementById("modal-descripcion");

  const modalVideoLink =
    document.getElementById("modal-video-link");

  const modalCerrar =
    document.getElementById("modal-cerrar");

  const modalOverlay =
    document.querySelector(".modal-overlay");

  function cerrarExperiencia() {
    if (!modal) return;

    modal.classList.remove("activo");

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";
  }

  function abrirExperiencia(id) {
    const experiencia = experiencias[id];

    if (!modal || !experiencia) return;

    if (modalImagen) {
      modalImagen.src = experiencia.imagen;
      modalImagen.alt = experiencia.titulo;
    }

    if (modalTitulo) {
      modalTitulo.textContent = experiencia.titulo;
    }

    if (modalDescripcion) {
      modalDescripcion.textContent =
        experiencia.descripcion;
    }

    if (modalVideoLink) {
      if (experiencia.video) {
        modalVideoLink.hidden = false;
        modalVideoLink.href = experiencia.video;
      } else {
        modalVideoLink.hidden = true;
        modalVideoLink.removeAttribute("href");
      }
    }

    modal.classList.add("activo");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow = "hidden";
  }

  document
    .querySelectorAll(".experiencia-card")
    .forEach(card => {
      card.addEventListener("click", () => {
        abrirExperiencia(
          card.dataset.experiencia
        );
      });
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

  document.addEventListener("keydown", e => {
    if (
      e.key === "Escape" &&
      modal &&
      modal.classList.contains("activo")
    ) {
      cerrarExperiencia();
    }
  });


  /* =====================================================
     QR
  ===================================================== */

  const contenedorQR =
    document.getElementById("rasca-qr");

  if (
    contenedorQR &&
    typeof QRCode !== "undefined"
  ) {
    contenedorQR.innerHTML = "";

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
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel:
          QRCode.CorrectLevel.H
      }
    );
  }


  /* =====================================================
     RASCA Y GANA — SISTEMA MEJORADO
  ===================================================== */

  const rascaCanvas =
    document.getElementById("rasca-canvas");

  const rascaPremio =
    document.getElementById("rasca-premio");

  const rascaNumero =
    document.getElementById("rasca-numero");

  const rascaEstado =
    document.getElementById("rasca-estado");

  const rascaEstadoCabecera =
    document.getElementById(
      "rasca-estado-cabecera"
    );

  const rascaReset =
    document.getElementById("rasca-reset");


  if (
    rascaCanvas &&
    rascaPremio
  ) {

    const ctx =
      rascaCanvas.getContext(
        "2d",
        {
          willReadFrequently: true
        }
      );


    const UMBRAL_RASCADO = 85;

    const PREMIO_ESPECIAL_CADA = 120;

    const BRUSH_MIN = 20;

    const BRUSH_MAX = 36;

    const CHECK_INTERVAL = 120;


    /* =================================================
       PREMIOS
    ================================================= */

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
        titulo: "2 PEDIDOS MUSICALES",
        mensaje:
          "¡Ganaste 2 pedidos musicales!",
        imagen:
          "rasca/musical.jpg"
      },

      {
        titulo: "1 BESO DEL ANIMADOR",
        mensaje:
          "¡Te tocó 1 beso del animador!",
        imagen:
          "rasca/beso.jpg"
      }

    ];


    /* =================================================
       PARTICIPANTES
    ================================================= */


    /* =================================================
       PREMIO
    ================================================= */

    function obtenerPremio(numero) {

      if (
        numero %
          PREMIO_ESPECIAL_CADA ===
        0
      ) {

        return {
          titulo: "VALE S/ 50",

          mensaje:
            "¡FELICIDADES! Ganaste un Vale de S/ 50.",

          imagen:
            "rasca/vale-50.jpg",

          especial: true
        };
      }

      return {
        ...premios[
          (numero - 1) %
          premios.length
        ],

        especial: false
      };
    }


    let participante =
      obtenerParticipanteJuego();

    let premioActual =
      obtenerPremio(
        participante
      );

    let rascando = false;

    let tarjetaTerminada = false;

    let anchoCanvas = 0;

    let altoCanvas = 0;

    let ultimoPunto = null;

    let ultimoChequeo = 0;

    let porcentajeActual = 0;

    let sonidoContexto = null;

    let ultimoSonido = 0;


    /* =================================================
       CABECERA
    ================================================= */

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


    /* =================================================
       PREMIO OCULTO
    ================================================= */

    function prepararPremioOculto() {

      rascaPremio.className =
        "rasca-premio";

      rascaPremio.innerHTML =
        `
        <div class="rasca-premio-oculto">
          <span>PIERO PASTOR</span>
          <strong>PREMIO OCULTO</strong>
          <small>RASCA PARA DESCUBRIR</small>
        </div>
        `;
    }


    /* =================================================
       TEXTURA METÁLICA
    ================================================= */

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
          -anchoCanvas * 0.3,
          altoCanvas,
          anchoCanvas * 1.3,
          -altoCanvas
        );


      brillo.addColorStop(
        0,
        "rgba(255,255,255,0)"
      );

      brillo.addColorStop(
        0.43,
        "rgba(255,255,255,.08)"
      );

      brillo.addColorStop(
        0.5,
        "rgba(255,255,255,.32)"
      );

      brillo.addColorStop(
        0.57,
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
          0.15;

        const claro =
          Math.random() >
          0.5;


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


      ctx.strokeStyle =
        "rgba(0,0,0,.3)";

      ctx.lineWidth = 2;


      ctx.strokeRect(
        5,
        5,
        anchoCanvas - 10,
        altoCanvas - 10
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


      ctx.fillStyle =
        "rgba(0,0,0,.35)";


      ctx.font =
        "700 10px Arial";


      ctx.fillText(
        "DESCUBRE TU PREMIO",
        anchoCanvas / 2,
        altoCanvas / 2 + 57
      );
    }


    /* =================================================
       PREPARAR CANVAS
    ================================================= */

    function prepararCanvas() {

      if (!rascaCanvas) return;


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
          window.devicePixelRatio || 1,
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


      if (
        rascaEstado
      ) {

        rascaEstado.classList.remove(
          "progreso"
        );


        rascaEstado.textContent =
          "Raspa la superficie con el dedo o el mouse para descubrir tu premio.";
      }
    }


    /* =================================================
       POSICIÓN DEL PUNTERO
    ================================================= */

    function obtenerPosicion(evento) {

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


    /* =================================================
       DISTANCIA
    ================================================= */

    function distancia(a, b) {

      return Math.hypot(
        a.x - b.x,
        a.y - b.y
      );
    }


    /* =================================================
       RASPADO CONTINUO
    ================================================= */

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
              radio * 0.35
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
            radio * 0.05,
            x,
            y,
            radio
          );


        pincel.addColorStop(
          0,
          "rgba(0,0,0,1)"
        );

        pincel.addColorStop(
          0.68,
          "rgba(0,0,0,.95)"
        );

        pincel.addColorStop(
          0.9,
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


    /* =================================================
       PARTÍCULAS
    ================================================= */

    function crearParticulas(
      x,
      y
    ) {

      const tarjeta =
        rascaCanvas.closest(
          ".rasca-tarjeta"
        );


      if (!tarjeta) return;


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
          () => particula.remove(),
          650
        );
      }
    }


    /* =================================================
       SONIDO DE RASPADO
    ================================================= */

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

        if (
          !sonidoContexto
        ) {

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
          0.035;


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
              Math.random() *
              2 -
              1
            ) *
            (
              1 -
              i /
              data.length
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


        filtro.Q.value =
          0.7;


        ganancia.gain.setValueAtTime(
          0.018,
          sonidoContexto.currentTime
        );


        ganancia.gain.exponentialRampToValueAtTime(
          0.001,
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

      } catch (_) {

        /* Sonido opcional */

      }
    }


    /* =================================================
       VIBRACIÓN
    ================================================= */

    function vibrar() {

      try {

        if (
          "vibrate" in
          navigator
        ) {

          navigator.vibrate(
            7
          );
        }

      } catch (_) {}

    }


    /* =================================================
       RASPAR
    ================================================= */

    function borrar(evento) {

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
            ) *
            0.035
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
        /* =================================================
       COMPROBAR PORCENTAJE
    ================================================= */

    function comprobarRascado() {

      if (tarjetaTerminada) {
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


      let transparentes = 0;

      let total = 0;


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
        rascaEstado &&
        porcentajeActual > 1
      ) {

        rascaEstado.classList.add(
          "progreso"
        );


        rascaEstado.textContent =
          `Rascado: ${
            Math.min(
              100,
              Math.round(
                porcentajeActual
              )
            )
          }% · Sigue raspando para descubrir tu premio.`;
      }


      if (
        porcentajeActual >=
        UMBRAL_RASCADO
      ) {

        mostrarPremio();
      }
    }


    /* =================================================
       CONFETI
    ================================================= */

    function crearConfeti() {

      const tarjeta =
        rascaCanvas.closest(
          ".rasca-tarjeta"
        );

      if (!tarjeta) return;


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


        pieza.style.animationDelay =
          `${Math.random() * .2}s`;


        tarjeta.appendChild(
          pieza
        );


        setTimeout(
          () => pieza.remove(),
          1500
        );
      }
    }


    /* =================================================
       MOSTRAR PREMIO
    ================================================= */

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


      imagen.loading =
        "eager";


      imagen.onerror =
        () => {

          console.warn(
            "No se encontró:",
            premioActual.imagen
          );
        };


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


      if (rascaEstado) {

        rascaEstado.classList.remove(
          "progreso"
        );


        rascaEstado.textContent =
          premioActual.especial
            ? "🎉 ¡Premio especial! Presenta tu código para reclamarlo."
            : premioActual.mensaje;
      }


      actualizarCabecera();

      crearConfeti();

      vibrar();
    }


    /* =================================================
       POINTER DOWN
    ================================================= */

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


    /* =================================================
       POINTER MOVE
    ================================================= */

    rascaCanvas.addEventListener(
      "pointermove",
      evento => {

        if (rascando) {

          borrar(evento);
        }
      }
    );


    /* =================================================
       POINTER UP
    ================================================= */

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


    /* =================================================
       NUEVA TARJETA
    ================================================= */

    function nuevaTarjeta() {

      participante =
        obtenerParticipanteJuego();


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


      if (rascaEstado) {

        rascaEstado.classList.remove(
          "progreso"
        );


        rascaEstado.textContent =
          "Raspa la superficie con el dedo o el mouse para descubrir tu premio.";
      }


      actualizarCabecera();

      prepararRascaSiVisible();
    }


    if (rascaReset) {

      rascaReset.addEventListener(
        "click",
        nuevaTarjeta
      );
    }


    /* =================================================
       PREPARAR RASCA
    ================================================= */

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


    /* =================================================
       OBSERVADOR
    ================================================= */

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
          attributes: true,
          attributeFilter: [
            "class"
          ]
        }
      );
    }


    /* =================================================
       INICIALIZAR
    ================================================= */

    prepararPremioOculto();

    actualizarCabecera();

    prepararRascaSiVisible();


    /* =================================================
       REDIMENSIONAR
    ================================================= */

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
     RULETA INTERACTIVA
  ===================================================== */

  const ruletaCanvas =
    document.getElementById("ruleta-canvas");

  const ruletaGirar =
    document.getElementById("ruleta-girar");

  const ruletaReset =
    document.getElementById("ruleta-reset");

  const ruletaNumero =
    document.getElementById("ruleta-numero");

  const ruletaEstadoCabecera =
    document.getElementById("ruleta-estado-cabecera");

  const ruletaEstado =
    document.getElementById("ruleta-estado");

  const ruletaResultadoImagen =
    document.getElementById("ruleta-premio-imagen");

  const ruletaResultadoTitulo =
    document.getElementById("ruleta-premio-titulo");

  const ruletaResultadoMensaje =
    document.getElementById("ruleta-premio-mensaje");


  if (
    ruletaCanvas &&
    ruletaGirar
  ) {

    const ruletaCtx =
      ruletaCanvas.getContext("2d");

    const INTERVALO_VALE_RULETA =
      120;


    /* =================================================
       PREMIOS
    ================================================= */

    const premiosRuleta = [

      {
        titulo:
          "1 CERVEZA",

        mensaje:
          "¡Te tocó 1 cerveza!",

        imagen:
          "rasca/cerveza.jpg"
      },

      {
        titulo:
          "1 AGUA",

        mensaje:
          "¡Te tocó 1 agua!",

        imagen:
          "rasca/agua.jpg"
      },

      {
        titulo:
          "1 POLO",

        mensaje:
          "¡Te tocó 1 polo!",

        imagen:
          "rasca/polo.jpg"
      },

      {
        titulo:
          "1 GORRO",

        mensaje:
          "¡Te tocó 1 gorro!",

        imagen:
          "rasca/gorro.jpg"
      },

      {
        titulo:
          "1 VOLT",

        mensaje:
          "¡Te tocó 1 Volt!",

        imagen:
          "rasca/volt.jpg"
      },

      {
        titulo:
          "CASTIGO",

        mensaje:
          "¡Te tocó castigo!",

        imagen:
          "rasca/castigo.jpg"
      },

      {
        titulo:
          "SIGUE INTENTANDO",

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


    /* =================================================
       CARGAR IMÁGENES
    ================================================= */

    const imagenesRuleta =
      premiosRuleta.map(
        premio => {

          const imagen =
            new Image();

          imagen.src =
            premio.imagen;

          return imagen;
        }
      );


    let ruletaAngulo =
      0;

    let ruletaGirando =
      false;

    let ruletaParticipante =
      obtenerParticipanteJuego();


    /* =================================================
       PARTICIPANTE ÚNICO
       La Ruleta utiliza el mismo participante
       registrado en Juega y Gana.
    ================================================= */


    /* =================================================
       CABECERA
    ================================================= */

    function actualizarRuletaCabecera() {

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


      if (
        ruletaEstadoCabecera
      ) {

        ruletaEstadoCabecera.textContent =
          ruletaGirando
            ? "GIRANDO"
            : "LISTO";
      }
    }


    /* =================================================
       TEXTO DE PREMIOS
    ================================================= */

    function abreviarPremio(
      titulo
    ) {

      const mapa = {

        "1 CERVEZA":
          "CERVEZA",

        "1 AGUA":
          "AGUA",

        "1 POLO":
          "POLO",

        "1 GORRO":
          "GORRO",

        "1 VOLT":
          "VOLT",

        "CASTIGO":
          "CASTIGO",

        "SIGUE INTENTANDO":
          "SIGUE\nINTENTANDO",

        "2 PEDIDOS MUSICALES":
          "2 PEDIDOS\nMUSICALES",

        "1 BESO DEL ANIMADOR":
          "BESO\nDEL ANIMADOR"

      };


      return (
        mapa[titulo] ||
        titulo
      );
    }


    /* =================================================
       DIBUJAR RULETA
    ================================================= */

    function dibujarRuleta() {

      const w =
        ruletaCanvas.width;

      const h =
        ruletaCanvas.height;

      const cx =
        w / 2;

      const cy =
        h / 2;

      const radio =
        Math.min(
          w,
          h
        ) / 2 -
        12;

      const cantidad =
        premiosRuleta.length;

      const paso =
        (
          Math.PI * 2
        ) /
        cantidad;


      const colores = [

        "#161719",
        "#27230f",
        "#111214",
        "#332b0d",
        "#18191b",
        "#29230f",
        "#121315",
        "#362d0b",
        "#1b1c1e"

      ];


      ruletaCtx.clearRect(
        0,
        0,
        w,
        h
      );


      ruletaCtx.save();


      ruletaCtx.translate(
        cx,
        cy
      );


      ruletaCtx.rotate(
        -Math.PI / 2
      );


      premiosRuleta.forEach(
        (
          premio,
          indice
        ) => {

          const inicio =
            indice *
            paso;

          const fin =
            inicio +
            paso;

          const medio =
            inicio +
            paso / 2;


          const gradiente =
            ruletaCtx.createRadialGradient(
              0,
              0,
              radio * .1,
              0,
              0,
              radio
            );


          gradiente.addColorStop(
            0,
            "#45410e"
          );


          gradiente.addColorStop(
            .45,
            colores[indice]
          );


          gradiente.addColorStop(
            1,
            "#070707"
          );


          ruletaCtx.beginPath();


          ruletaCtx.moveTo(
            0,
            0
          );


          ruletaCtx.arc(
            0,
            0,
            radio,
            inicio,
            fin
          );


          ruletaCtx.closePath();


          ruletaCtx.fillStyle =
            gradiente;


          ruletaCtx.fill();


          ruletaCtx.strokeStyle =
            "rgba(255,212,0,.75)";


          ruletaCtx.lineWidth =
            3;


          ruletaCtx.stroke();


          /* ==========================================
             IMAGEN
          ========================================== */

          const ix =
            Math.cos(medio) *
            radio *
            .57;


          const iy =
            Math.sin(medio) *
            radio *
            .57;


          const imagen =
            imagenesRuleta[
              indice
            ];


          if (
            imagen.complete &&
            imagen.naturalWidth > 0
          ) {

            ruletaCtx.save();


            ruletaCtx.beginPath();


            ruletaCtx.arc(
              ix,
              iy,
              42,
              0,
              Math.PI * 2
            );


            ruletaCtx.clip();


            ruletaCtx.drawImage(
              imagen,
              ix - 42,
              iy - 42,
              84,
              84
            );


            ruletaCtx.restore();


            ruletaCtx.beginPath();


            ruletaCtx.arc(
              ix,
              iy,
              42,
              0,
              Math.PI * 2
            );


            ruletaCtx.strokeStyle =
              "#ffd400";


            ruletaCtx.lineWidth =
              3;


            ruletaCtx.stroke();

          }


          /* ==========================================
             TEXTO
          ========================================== */

          ruletaCtx.save();


          ruletaCtx.translate(
            Math.cos(medio) *
              radio *
              .84,

            Math.sin(medio) *
              radio *
              .84
          );


          ruletaCtx.rotate(
            medio +
            Math.PI / 2
          );


          ruletaCtx.fillStyle =
            "#fff";


          ruletaCtx.font =
            "900 13px Arial";


          ruletaCtx.textAlign =
            "center";


          ruletaCtx.textBaseline =
            "middle";


          const lineas =
            abreviarPremio(
              premio.titulo
            ).split("\n");


          lineas.forEach(
            (
              linea,
              i
            ) => {

              ruletaCtx.fillText(
                linea,
                0,
                (
                  i -
                  (
                    lineas.length -
                    1
                  ) /
                  2
                ) *
                15
              );

            }
          );


          ruletaCtx.restore();

        }
      );


      ruletaCtx.restore();


      /* ==========================================
         BORDE
      ========================================== */

      ruletaCtx.beginPath();


      ruletaCtx.arc(
        cx,
        cy,
        radio,
        0,
        Math.PI * 2
      );


      ruletaCtx.strokeStyle =
        "#ffd400";


      ruletaCtx.lineWidth =
        10;


      ruletaCtx.stroke();
    }


    /* =================================================
       CARGAR IMÁGENES
    ================================================= */

    imagenesRuleta.forEach(
      imagen => {

        imagen.addEventListener(
          "load",
          dibujarRuleta,
          {
            once: true
          }
        );

      }
    );


    dibujarRuleta();


    /* =================================================
       SELECCIONAR PREMIO
    ================================================= */

    function seleccionarPremio(
      numero
    ) {

      if (
        numero %
          INTERVALO_VALE_RULETA ===
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
            true,

          indice:
            Math.floor(
              Math.random() *
              premiosRuleta.length
            )

        };

      }


      const indice =
        Math.floor(
          Math.random() *
          premiosRuleta.length
        );


      return {

        ...premiosRuleta[
          indice
        ],

        especial:
          false,

        indice

      };
    }


    /* =================================================
       MOSTRAR RESULTADO
    ================================================= */

    function mostrarResultadoRuleta(
      premio
    ) {

      if (
        ruletaResultadoImagen
      ) {

        ruletaResultadoImagen.src =
          premio.imagen;


        ruletaResultadoImagen.alt =
          premio.titulo;


        ruletaResultadoImagen.hidden =
          false;
      }


      if (
        ruletaResultadoTitulo
      ) {

        ruletaResultadoTitulo.textContent =
          premio.titulo;
      }


      if (
        ruletaResultadoMensaje
      ) {

        ruletaResultadoMensaje.textContent =
          premio.mensaje;
      }


      if (
        ruletaEstado
      ) {

        ruletaEstado.textContent =
          premio.especial

            ? "🎉 ¡Premio especial! Presenta tu código para reclamarlo."

            : premio.mensaje;
      }
    }


    /* =================================================
       GIRAR RULETA
    ================================================= */

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


      ruletaEstado.textContent =
        "La ruleta está girando...";


      actualizarRuletaCabecera();


      ruletaParticipante =
        obtenerParticipanteJuego();


      const premio =
        seleccionarPremio(
          ruletaParticipante
        );


      const cantidad =
        premiosRuleta.length;
              const paso =
        360 /
        cantidad;


      const centro =
        premio.indice *
        paso +
        paso / 2;


      const destinoLocal =
        (
          360 -
          centro +
          360
        ) %
        360;


      const vueltas =
        5 +
        Math.floor(
          Math.random() * 3
        );


      const destino =
        ruletaAngulo +
        vueltas * 360 +
        destinoLocal;


      ruletaAngulo =
        destino;


      ruletaCanvas.style.transform =
        `rotate(${destino}deg)`;


      setTimeout(
        () => {

          ruletaGirando =
            false;


          ruletaGirar.disabled =
            false;


          actualizarRuletaCabecera();


          mostrarResultadoRuleta(
            premio
          );


          if (
            "vibrate" in navigator
          ) {

            try {

              navigator.vibrate(
                [40, 30, 70]
              );

            } catch (_) {}

          }

        },
        5300
      );
    }


    /* =================================================
       BOTÓN GIRAR
    ================================================= */

    ruletaGirar.addEventListener(
      "click",
      girarRuleta
    );


    /* =================================================
       REINICIAR RULETA
    ================================================= */

    if (
      ruletaReset
    ) {

      ruletaReset.addEventListener(
        "click",
        () => {

          ruletaParticipante =
            obtenerParticipanteJuego();


          ruletaGirando =
            false;


          ruletaGirar.disabled =
            false;


          ruletaCanvas.style.transition =
            "none";


          ruletaCanvas.style.transform =
            "rotate(0deg)";


          ruletaAngulo =
            0;


          void ruletaCanvas.offsetWidth;


          ruletaCanvas.style.transition =
            "transform 5.2s cubic-bezier(.12,.76,.13,1)";


          if (
            ruletaResultadoImagen
          ) {

            ruletaResultadoImagen.hidden =
              true;
          }


          if (
            ruletaResultadoTitulo
          ) {

            ruletaResultadoTitulo.textContent =
              "LISTO PARA GIRAR";
          }


          if (
            ruletaResultadoMensaje
          ) {

            ruletaResultadoMensaje.textContent =
              "Tu premio aparecerá aquí.";
          }


          if (
            ruletaEstado
          ) {

            ruletaEstado.textContent =
              'Presiona "GIRAR RULETA" para participar.';
          }


          actualizarRuletaCabecera();

        }
      );
    }


    actualizarRuletaCabecera();

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
     PRUEBA LOCAL
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
