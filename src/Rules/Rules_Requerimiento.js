const metodos = {
  get: () => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject("Debe iniciar sesion");
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Requerimiento?token={token}";
      url = url.replace("{token}", global.token);

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
          reject("Error procesando la solicitud");
        });
    });
  },

  insertar: (comando) => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject("Debe iniciar sesion");
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Requerimiento?token={token}";
      url = url.replace("{token}", global.token);

      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comando)
      })
        .then(response => response.json())
        .then(data => {
          if (data == undefined) {
            reject("Error procesando la solicitud");
            return;
          }

          if (data.ok != true) {
            reject(data.error || "Error procesando la solicitud");
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },

  getDetalle: (id) => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject("Debe iniciar sesion");
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Requerimiento/Detalle?token={token}&id={id}";
      url = url.replace("{token}", global.token);
      url = url.replace("{id}", id);

      fetch(url, {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          if (data == undefined) {
            reject("Error procesando la solicitud");
            return;
          }

          if (data.ok != true) {
            reject(data.error || "Error procesando la solicitud");
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },

  cancelar: (id) => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject("Debe iniciar sesion");
        return;
      }

      let url =
        "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Requerimiento/Cancelar?token={token}&idRequerimiento={id}";
      url = url.replace("{token}", global.token);
      url = url.replace("{id}", id);

      fetch(url, {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          if (data == undefined) {
            reject("Error procesando la solicitud");
            return;
          }

          if (data.ok != true) {
            reject(data.error || "Error procesando la solicitud");
            return;
          }

          resolve();
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },

  enviarComprobante: (id) => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject("Debe iniciar sesion");
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Requerimiento/EnviarEmailComprobante?token={token}&idRequerimiento={id}";
      url = url.replace("{token}", global.token);
      url = url.replace("{id}", id);

      fetch(url, {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          if (data == undefined) {
            reject("Error procesando la solicitud");
            return;
          }

          if (data.ok != true) {
            reject(data.error || "Error procesando la solicitud");
            return;
          }

          resolve();
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  }
};

export default metodos;
