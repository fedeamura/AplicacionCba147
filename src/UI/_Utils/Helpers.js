export function dateToString(dateIn) {
    let año = '' + dateIn.getFullYear();

    let mes = parseInt(dateIn.getMonth() + 1);
    if (mes < 10) {
        mes = '0' + mes;
    } else {
        mes = '' + mes;
    }

    var dia = parseInt(dateIn.getDate());
    if (dia < 10) {
        dia = '0' + dia;
    } else {
        dia = '' + dia;
    }
    return dia + '/' + mes + '/' + año;
}