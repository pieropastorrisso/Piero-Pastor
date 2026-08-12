document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================
     NAVEGACIÓN
  ========================= */

  const vistas = [...document.querySelectorAll(".vista")];
  const menu = document.getElementById("menu");
  const menuToggle = document.getElementById("menu-toggle");

  function cerrarMenu() {
    if (!menu || !menuToggle) return;

    menu.classList.remove("menu-abierto");
    menuToggle.classList.remove("activo");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Abrir menú"
    );

    menuToggle.textContent = "☰";
  }

  function abrirCerrarMenu() {
    if (!menu || !menuToggle) return;

    const abierto =
      menu.classList.toggle("menu-abierto");

    menuToggle.classList.toggle(
      "activo",
      abierto
    );

    menuToggle.setAttribute(
      "aria-expanded",
      abierto ? "true" : "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      abierto
        ? "Cerrar menú"
        : "Abrir menú"
    );

    menuToggle.textContent =
      abierto ? "✕" : "☰";
  }

  function activarVista(
    id,
    actualizarHash = true
  ) {
    const destino =
      document.getElementById(id);

    if (
      !destino ||
      !destino.classList.contains("vista")
    ) {
      const inicio =
        document.getElementById("inicio");

      if (inicio) {
        vistas.forEach(v =>
          v.classList.remove(
            "vista-activa"
          )
        );

        inicio.classList.add(
          "vista-activa"
        );
      }

      cerrarMenu();
      return;
    }

    vistas.forEach(v =>
      v.classList.remove(
        "vista-activa"
      )
    );

    destino.classList.add(
      "vista-activa"
    );

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
        50
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

          if (!href || href === "#") {
            return;
          }

          const id =
            href.substring(1);

          const destino =
            document.getElementById(id);

          if (
            !destino ||
            !destino.classList.contains(
              "vista"
            )
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


  /* =========================
     EXPERIENCIAS / MODAL
  ========================= */

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


  /* =========================
     QR
  ========================= */

  const contenedorQR =
    document.getElementById(
      "rasca-qr"
    );


  if (
    contenedorQR &&
    typeof QRCode !== "undefined"
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


  /* =========================
     RASCA Y GANA
  ========================= */

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


    const CLAVE_CONTADOR =
      "pieroPastorRascaParticipantes";


    /* ==================================
       RASCA AL 85%
    ================================== */

    const UMBRAL_RASCADO =
      85;


    const PREMIO_ESPECIAL_CADA =
      40;


    /* ==================================
       9 PREMIOS NORMALES
       + 1 VALE ESPECIAL
    ================================== */

    const premios = [

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


    function obtenerParticipante() {

      let numero =
        Number(
          localStorage.getItem(
            CLAVE_CONTADOR
          ) || 0
        );


      if (
        !Number.isFinite(
          numero
        ) ||
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


    function obtenerPremio(
      numero
    ) {

      /* =========================
         CADA 40:
         VALE S/ 50
      ========================= */

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


      /* =========================
         RESTO DE PREMIOS
      ========================= */

      return {

        ...premios[
          (numero - 1) %
          premios.length
        ],

        especial:
          false

      };

    }


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


    let anchoCanvas =
      0;


    let altoCanvas =
      0;


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

        '<div class="rasca-premio-oculto">' +

        '<span>PIERO PASTOR</span>' +

        '<strong>PREMIO OCULTO</strong>' +

        '<small>RASCA PARA DESCUBRIR</small>' +

        "</div>";

    }


    function prepararCanvas() {

      if (!rascaCanvas) {
        return;
      }


      const rect =
        rascaCanvas.getBoundingClientRect();


      /* ==================================
         SI ESTÁ OCULTO NO LO PREPARAMOS
      ================================== */

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


      ctx.globalCompositeOperation =
        "source-over";


      rascaCanvas.style.opacity =
        "1";


      rascaCanvas.style.pointerEvents =
        "auto";


      const degradado =
        ctx.createLinearGradient(
          0,
          0,
          anchoCanvas,
          altoCanvas
        );


      degradado.addColorStop(
        0,
        "#777"
      );


      degradado.addColorStop(
        0.5,
        "#bdbdbd"
      );


      degradado.addColorStop(
        1,
        "#666"
      );


      ctx.fillStyle =
        degradado;


      ctx.fillRect(
        0,
        0,
        anchoCanvas,
        altoCanvas
      );


      ctx.fillStyle =
        "#fff";


      ctx.textAlign =
        "center";


      ctx.textBaseline =
        "middle";


      ctx.font =
        "900 30px Arial";


      ctx.fillText(
        "RASCA AQUÍ",
        anchoCanvas / 2,
        altoCanvas / 2 - 8
      );


      ctx.font =
        "700 14px Arial";


      ctx.fillText(
        "PIERO PASTOR",
        anchoCanvas / 2,
        altoCanvas / 2 + 35
      );

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


      rascaCanvas.style.opacity =
        "0";


      rascaCanvas.style.pointerEvents =
        "none";


      if (rascaEstado) {

        rascaEstado.textContent =
          premioActual.mensaje;

      }


      actualizarCabecera();

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


      ctx.globalCompositeOperation =
        "destination-out";


      ctx.beginPath();


      ctx.arc(

        posicion.x,

        posicion.y,

        Math.max(
          26,
          Math.min(
            38,
            anchoCanvas *
              0.035
          )
        ),

        0,

        Math.PI * 2

      );


      ctx.fill();


      ctx.globalCompositeOperation =
        "source-over";


      comprobarRascado();

    }


    function comprobarRascado() {

      /* =========================================
         CORRECCIÓN IMPORTANTE

         Antes se revisaba solamente una pequeña
         parte del canvas.

         Ahora revisamos TODA la tarjeta.
      ========================================= */


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

      } catch (error) {

        return;

      }


      let transparentes =
        0;


      let total =
        0;


      /* =========================================
         MUESTREO INTELIGENTE

         No revisamos absolutamente cada píxel
         porque en celulares sería pesado.

         Revisamos toda la superficie.
      ========================================= */


      const paso =
        Math.max(
          4,
          Math.floor(
            Math.min(
              ancho,
              alto
            ) / 180
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
            datos[indice] < 80
          ) {

            transparentes++;

          }

        }

      }


      const porcentaje =
        total
          ? (
              transparentes /
              total
            ) *
            100
          : 0;


      if (
        porcentaje >=
        UMBRAL_RASCADO
      ) {

        mostrarPremio();

      }

    }


    /* ==================================
       RASPAR CON MOUSE
       TOUCH
       CELULAR
       TABLET
       LAPIZ
    ================================== */


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


        try {

          rascaCanvas.setPointerCapture(
            evento.pointerId
          );

        } catch (_) {}


        borrar(
          evento
        );

      }
    );


    rascaCanvas.addEventListener(
      "pointermove",
      evento => {

        if (
          rascando
        ) {

          borrar(
            evento
          );

        }

      }
    );


    rascaCanvas.addEventListener(
      "pointerup",
      evento => {

        rascando =
          false;


        try {

          rascaCanvas.releasePointerCapture(
            evento.pointerId
          );

        } catch (_) {}

      }
    );


    rascaCanvas.addEventListener(
      "pointercancel",
      () => {

        rascando =
          false;

      }
    );


    /* ==================================
       NUEVA TARJETA
    ================================== */


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


      prepararPremioOculto();


      if (
        rascaEstado
      ) {

        rascaEstado.textContent =
          "Desliza el dedo o el mouse para descubrir tu premio.";

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


    /* ==================================
       PREPARAR RASCA SOLO CUANDO
       LA SECCIÓN ESTÁ VISIBLE
    ================================== */


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


    /* ==================================
       DETECTAR CUANDO ENTRAMOS
       A RASCA Y GANA
    ================================== */


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
            [
              "class"
            ]
        }
      );

    }


    prepararPremioOculto();

    actualizarCabecera();

    prepararRascaSiVisible();


    /* ==================================
       REDIMENSIONAR
    ================================== */


    let temporizadorResize;


    window.addEventListener(
      "resize",
      () => {

        clearTimeout(
          temporizadorResize
        );


        temporizadorResize =
          setTimeout(
            prepararRascaSiVisible,
            200
          );

      }
    );

  }


  /* =========================
     CONTADOR DE VISITAS
  ========================= */

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

      visitas =
        0;

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


  /* =========================
     FORMULARIO DE CORREO
     PRUEBA LOCAL
  ========================= */

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


        let correos =
          [];


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

            correos =
              [];

          }

        } catch (_) {

          correos =
            [];

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