
export function validar(val, params) {
    if (params == undefined) params = {};
    if (!('mensajes' in params)) params.mensajes = {};
    if (!('tipo' in params)) params.tipo = 'libre';

    let min = 2;
    let max = 100;

    //Requerido
    if ('requerido' in params && params.requerido == true) {
        let mensajeRequerido = params.mensajes.requerido || "Dato requerido";
        if (val == undefined || val == "") return mensajeRequerido;
    }

    if (val != undefined && val != "") {

        let mensaje;

        //Tipo
        switch (params.tipo) {
            case 'libre': {

            } break;

            case 'nombre': {
                let m = params.mensajes.tipo || "Solo letras permitidas";
                if (!validarNombre(val)) {
                    mensaje = m;
                }
            } break;

            case 'numeroEntero': {
                let m = params.mensajes.tipo || "Solo números enteros permitidos";
                if (!validarNumeroEntero(val)) {
                    mensaje = m;
                }
            } break;

            case 'soloNumeroFlotante': {
                let m = params.mensajes.tipo || "Solo números enteros permitidos";
                if (val.indexOf(',') != -1) return "Solo números enteros permitidos";
                val = parseFloat(val);
                if (val == NaN) {
                    mensaje = m;
                }
            } break;

            case 'email': {
                let m = params.mensajes.tipo || 'Email inválido';
                if (!validarEmail(val)) {
                    mensaje = m;
                }
            } break;

            case 'username': {
                let m = params.mensajes.tipo || 'Nombre de usuario inválido';
                if (!validarUsername(val)) {
                    mensaje = m;
                }
            } break;
        }

        if (mensaje != undefined) {
            return mensaje;
        }
        
        //Min
        if ('minLength' in params) {
            let min = params.minLength;
            let mensaje = (params.mensajes.minLength != undefined && params.mensajes.minLength(max) != undefined) ? params.mensajes.minLength(max) : "Minimo " + min + " caracteres";
            if (val.length < min) return mensaje;
        }

        //Max
        if ('maxLength' in params) {
            let max = params.maxLength;
            let mensaje = (params.mensajes.maxLength && params.mensajes.maxLength(max) != undefined) ? params.mensajes.maxLength(max) : "Máximo " + max + " caracteres";
            if (val.length > max) return mensaje;
        }
    }

    return undefined;
}

function validarNombre(val) {
    return /^[\D\s]+$/.test(val);
}

function validarUsername(val) {
    return true;
    // let letrasPermitidas = "abcdefghijklmnñopqrstuvwxyz._-1234567890";

    // for (var i = 0; i < val.length; i++) {
    //     let letra = '' + val.charAt(i).toLowerCase();
    //     if (letrasPermitidas.indexOf(letra) == -1) return false;
    // }

    // return true;
}


function validarNumeroEntero(val) {
    if (val.indexOf(',') != -1) return false;
    if (val.indexOf('.') != -1) return false;
    if (!(/^\d+$/.test(val))) return false;
    return true;
}

function validarEmail(val) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(val);
}