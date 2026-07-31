window.addEventListener("scroll", function () {

    let elementos = document.querySelectorAll(".animar");

    elementos.forEach(function(el){

        let posicion = el.getBoundingClientRect().top;
        let pantalla = window.innerHeight;

        if(posicion < pantalla - 100){
            el.classList.add("mostrar");
        }

    });

});

const numeros = document.querySelectorAll(".numero h3");

let iniciado = false;

window.addEventListener("scroll", function(){

    const seccion = document.querySelector("#estadisticas");

    if(!seccion || iniciado) return;

    const posicion = seccion.getBoundingClientRect().top;

    if(posicion < window.innerHeight - 100){

        iniciado = true;

        numeros.forEach(numero => {

            const objetivo = +numero.dataset.numero;
            let contador = 0;

            const aumentar = () => {

                const incremento = Math.ceil(objetivo / 100);

                contador += incremento;

                if(contador < objetivo){
                    numero.innerText = contador.toLocaleString();
                    requestAnimationFrame(aumentar);
                }else{
                    numero.innerText = objetivo.toLocaleString() + "+";
                }

            };

            aumentar();

        });

    }

});