const metodos = {
  get: (idServicio) => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject('Debe iniciar sesion');
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Motivo/GetByIdServicio?token={token}&id={id}";
      url = url.replace('{token}', global.token);
      url = url.replace('{id}', idServicio);

      fetch(url, {
        method: 'GET'
      })
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
  },

  getParaBuscar: () => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject('Debe iniciar sesion');
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Motivo/GetParaBusqueda?token={token}";
      url = url.replace('{token}', global.token);

      fetch(url, {
        method: 'GET'
      })
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