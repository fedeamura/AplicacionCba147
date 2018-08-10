
const metodos = {
  get: () => {
    return new Promise((resolve, reject) => {

      if (global.token == undefined) {
        reject('Debe iniciar sesion');
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Servicio/GetAll?token=" + global.token;
      fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error || 'Error procesando la solicitud');
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject('Error procesando la solicitud');
        })

    });
  }
}

export default metodos;