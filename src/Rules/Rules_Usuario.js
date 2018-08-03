import { Alert } from "react-native";

//Data
import DB from "Cordoba/src/DAO/DB";

const metodos = {

  login: function (user, pass) {

    let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/IniciarSesion?username={user}&password={pass}&keyVencimiento={key}"
    url = url.replace('{user}', user);
    url = url.replace('{pass}', pass);
    url = url.replace('{key}', "ERYNW;Duiucnsw_s72!22*");


    return new Promise((resolve, reject) => {

      fetch(url, {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error || 'Error procesando la solicitud');
            return;
          }

          var token = data.return;

          DB.setItem("token", token).then(() => {
            global.token = token;
            resolve();
          }).catch((error) => {
            reject('Error procesando la solicitud');
          });
        })
        .catch(error => {
          reject('Error procesando la solicitud');
        });
    });
  },

  isLogin: function () {
    return new Promise((resolve, reject) => {

      DB.getItem("token")
        .then(response => {

          if (response == undefined) {
            global.token = undefined;
            resolve(false);
            return;
          }

          //Valido el token en vecino virtual
          let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/ValidarToken?token={token}";
          url = url.replace('{token}', response);
          fetch(url, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
              if (data.ok != true || data.return == false) {
                global.token = undefined;
                resolve(false);
                return;
              }

              global.token = response;
              resolve(true);
            })
            .catch(error => {
              resolve(false);
            });
        }).catch((error) => {
          global.token = undefined;
          resolve(false);
        });
    });
  },

  cerrarSesion: function () {
    return new Promise((resolve, reject) => {
      try {

        if (global.token == undefined) {
          reject('Debe iniciar sesion');
          return;
        }

        let url = 'https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/CerrarSesion?token={token}&fcmToken={fcmToken}';
        url = url.replace('{token}', global.token);
        url = url.replace('{fcmToken}', global.fcmToken || 'Sin token');

        fetch(url, {
          method: 'GET'
        })
          .then(response => response.json())
          .then(data => {
            if (data.ok != true) {
              reject(data.error || 'Error procesando la solicitud');
              return;
            }

            DB.removeItem("token");
            global.token = undefined;
            global.fcmToken = undefined;
            resolve();
          })
          .catch(error => {
            reject('Error procesando la solicitud');
          });
      } catch (error) {
        reject('Error procesando la solicitud');
      }
    });
  },

  getDatos: function () {
    return new Promise((resolve, reject) => {

      if (global.token == undefined) {
        reject('Debe iniciar sesion');
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario?token={token}";
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
  },

  esUsuarioValidadoRenaper: function () {
    return new Promise((callback, reject) => {

      if (global.token == undefined) {
        reject('Debe iniciar sesion');
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/EsValidadoRenaper?token={token}";
      url = url.replace("{token}", global.token);

      fetch(url, {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error || 'Error procesando la solicitud');
            return;
          }

          callback(data.return == true);
        });
    });
  },

  validarDatos: function (comando) {
    return new Promise((resolve, reject) => {

      let url = "https://servicios2.cordoba.gov.ar/WSVecinoVirtual_Bridge/v1/Usuario/ValidarRenaper";
      fetch(url, {
        method: 'PUT',
        body: JSON.stringify(comando),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
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
          reject('Error procesando la solicitud. ' + JSON.stringify(error));
        });

    });
  },

  actualizarDatosPersonales: function (comando) {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        global.validado = true;
        callback(comando);
        // callbackError('El usuario ya existe');
      }, 1000);
    });
  },

  actualizarDatosContacto: function (comando) {
    return new Promise((resolve, reject) => {

      if (global.token == undefined) {
        reject('Debe iniciar sesion');
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/ActualizarDatosContacto?token={token}";
      url = url.replace('{token}', global.token);

      fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comando)
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error || 'Error procesando la solicitud');
            return;
          }

          resolve();
        })
        .catch(error => {
          reject('Error procesando la solicitud');
        })

    });
  },

  crearUsuario: function (comando) {
    return new Promise((resolve, reject) => {

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario?passwordDefault=false&urlRetorno=cba147app://abrir";

      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comando)
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error || 'Error procesando la solicitud');
            return;
          }

          resolve();
        })
        .catch(error => {
          reject('Error procesando la solicitud');
        })

    });
  },

  recuperarCuenta: function (username) {
    return new Promise((resolve, reject) => {

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/RecuperarCuenta?username={user}&urlRetorno={urlRetorno}";
      url = url.replace('{user}', username);
      url = url.replace('{urlRetorno}', 'cba147app://abrir');

      fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error || 'Error procesando la solicitud');
            return;
          }

          resolve();
        })
        .catch(error => {
          reject('Error procesando la solicitud');
        })
    });
  },

  cambiarUsername: function (username) {
    return new Promise((resolve, reject) => {

      if (global.token == undefined) {
        reject('Debe iniciar sesion');
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/CambiarUsername?token={token}&username={username}";
      url = url.replace('{token}', global.token);
      url = url.replace('{username}', username);

      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve();
        })
        .catch(error => {
          reject('Error procesando la solicitud');
        })

    });
  },

  cambiarPassword: function (passwordAnterior, passwordNueva) {
    return new Promise((resolve, reject) => {

      if (global.token == undefined) {
        reject('Debe iniciar sesion');
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/CambiarPassword?token={token}&passwordAnterior={passAnterior}&passwordNuevo={passNueva}";
      url = url.replace('{token}', global.token);
      url = url.replace('{passAnterior}', passwordAnterior);
      url = url.replace('{passNueva}', passwordNueva);

      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error || 'Error procesando la solicitud');
            return;
          }

          resolve();
        })
        .catch(error => {
          reject('Error procesando la solicitud');
        })

    });
  },

  cambiarFoto: function (foto) {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject('Debe iniciar sesion');
        return;
      }

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/ActualizarFotoPersonal?token={token}";
      url = url.replace('{token}', global.token);

      fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: foto })
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

  validarUsuarioActivado: function (username, password) {
    return new Promise((resolve, reject) => {

      let url = "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/ValidarUsuarioActivado?username={username}&password={password}";
      url = url.replace('{username}', username);
      url = url.replace('{password}', password);

      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error || 'Error procesando la solicitud');
            return;
          }

          resolve(data.return == true);
        })
        .catch(error => {
          reject('Error procesando la solicitud');
        })
    });
  },
  solicitarEmailActivacion: function (username, password) {
    return new Promise((resolve, reject) => {

      let url = "https://servicios2.cordoba.gov.ar/WSVecinoVirtual_Bridge/v1/Usuario/ActivacionCuenta/Iniciar";

      let comando = {
        username: username,
        password: password,
        urlServidor: 'https://servicios2.cordoba.gov.ar/vecinovirtualutils_internet/ProcesarActivarUsuario',
        urlRetorno: 'cba147app://abrir'
      };

      fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comando)
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

};

export default metodos;
