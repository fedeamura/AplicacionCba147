
const metodos = {

  validar: (latitud, longitud) => {
    return new Promise((resolve, reject) => {

      if (global.token == undefined) {
        reject('Debe iniciar sesion');
        return;
      }

      latitud = (latitud + '').replace(',', '.');
      longitud = (longitud + '').replace(',', '.');

      let url = 'https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Domicilio/Buscar?token={token}&latitud={lat}&longitud={lng}';
      url = url.replace('{token}', global.token);
      url = url.replace('{lat}', latitud);
      url = url.replace('{lng}', longitud);

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
    })
  },

  buscarSugerencias: (busqueda) => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject('Debe iniciar sesion');
        return;
      }

      let url = 'https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Domicilio/Sugerir?token={token}&busqueda={busqueda}';
      url = url.replace('{token}', global.token);
      url = url.replace('{busqueda}', busqueda);

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