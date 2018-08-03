
//Rules
import Rules_Ajustes from "./Rules_Ajustes";

const metodos = {
  get: function () {
    return new Promise((resolve, reject) => {

      if (global.token == undefined) {
        reject('Debe iniciar sesion');
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Requerimiento?token={token}";
      url = url.replace('{token}', global.token);

      fetch(url, {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok == false) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject('Error procesando la solicitud');
        });
    });
  },

  insertar: function (comando) {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback();
      }, 5000);
    });
  },

  getDetalle: function (id) {
    return new Promise((callback, reject) => {
      setTimeout(() => {
        callback({});
      }, 500);
    })
  }
}

export default metodos;