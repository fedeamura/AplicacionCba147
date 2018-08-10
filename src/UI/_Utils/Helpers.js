export function dateToString(dateIn) {
  try {
    let año = "" + dateIn.getFullYear();

    let mes = parseInt(dateIn.getMonth() + 1);
    if (mes < 10) {
      mes = "0" + mes;
    } else {
      mes = "" + mes;
    }

    var dia = parseInt(dateIn.getDate());
    if (dia < 10) {
      dia = "0" + dia;
    } else {
      dia = "" + dia;
    }
    return dia + "/" + mes + "/" + año;
  } catch (ex) {
    return "Fecha inválida";
  }
}

export function stringDateToString(dateIn) {
  try {
    let partes = dateIn.split("-");
    let año = partes[0];
    let mes = partes[1];
    var dia = partes[2].split("T")[0];
    return dia + "/" + mes + "/" + año;
  } catch (ex) {
    return "Fecha inválida";
  }
}

export function toTitleCase(val) {
  try {
    let palabras = ["de", "y", "a", "e", "o", "con", "desde"];
    return val.replace(/\w\S*/g, function (txt) {
      txt = txt.toLowerCase();
      if (palabras.indexOf(txt) == -1) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }

      return txt.toLowerCase();
    });
  } catch (ex) {
    return "";
  }
}

export function quitarAcentos(val) {
  try {
    if (val == undefined) return undefined;
    val = val.replace("á", "a");
    val = val.replace("Á", "A");
    val = val.replace("é", "e");
    val = val.replace("É", "E");
    val = val.replace("í", "i");
    val = val.replace("Í", "I");
    val = val.replace("ó", "o");
    val = val.replace("Ó", "O");
    val = val.replace("ú", "u");
    val = val.replace("Ú", "U");
    return val;
  } catch (ex) {
    return "";
  }
}
