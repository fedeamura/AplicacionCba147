import DB from "Cordoba/src/DAO/DB";

const metodos = {
  setLogin: async token => {
    global.token = token;
    await DB.setItem("token", token);
    return true;
  },
  login: (user, pass) => {
    let url =
      "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/IniciarSesion?username={user}&password={pass}&keyVencimiento={key}";
    url = url.replace("{user}", user);
    url = url.replace("{pass}", pass);
    url = url.replace("{key}", "KEYVENCIMIENTO");

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error || "Error procesando la solicitud");
            return;
          }

          var token = data.return;

          DB.setItem("token", token)
            .then(() => {
              global.token = token;
              resolve();
            })
            .catch(error => {
              reject("Error procesando la solicitud");
            });
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  isLogin: async () => {
    try {
      //Busco el token
      let token = await DB.getItem("token");
      if (token == undefined || token == null) return false;

      //Valido el token
      let url =
        "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/ValidarToken?token={token}";
      url = url.replace("{token}", token);
      let response = await fetch(url, { method: "GET" });
      let data = await response.json();

      if (data.ok != true || data.return == false) {
        global.token = undefined;
        return false;
      }

      global.token = token;
      return true;
    } catch (ex) {
      global.token = undefined;
      return false;
    }
  },

  cerrarSesion: () => {
    return new Promise((resolve, reject) => {
      try {
        if (global.token == undefined) {
          reject("Debe iniciar sesion");
          return;
        }

        let url =
          "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/CerrarSesion?token={token}&fcmToken={fcmToken}";
        url = url.replace("{token}", global.token);
        url = url.replace("{fcmToken}", global.fcmToken || "Sin token");

        fetch(url, {
          method: "GET"
        })
          .then(response => response.json())
          .then(data => {
            if (data.ok != true) {
              reject(data.error || "Error procesando la solicitud");
              return;
            }

            DB.removeItem("token");
            global.token = undefined;
            global.fcmToken = undefined;
            resolve();
          })
          .catch(error => {
            reject("Error procesando la solicitud");
          });
      } catch (error) {
        reject("Error procesando la solicitud");
      }
    });
  },

  getDatos: () => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject("Debe iniciar sesion");
        return;
      }

      let url =
        "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario?token={token}";
      url = url.replace("{token}", global.token);

      fetch(url, {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
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

  esUsuarioValidadoRenaper: () => {
    return new Promise((callback, reject) => {
      if (global.token == undefined) {
        reject("Debe iniciar sesion");
        return;
      }

      let url =
        "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/EsValidadoRenaper?token={token}";
      url = url.replace("{token}", global.token);

      fetch(url, {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error || "Error procesando la solicitud");
            return;
          }

          callback(data.return == true);
        });
    });
  },

  validarDatos: comando => {
    return new Promise((resolve, reject) => {
      let url =
        "https://servicios2.cordoba.gov.ar/WSVecinoVirtual_Bridge/v1/Usuario/ValidarRenaper";
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(comando),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error || "Error procesando la solicitud");
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud. " + JSON.stringify(error));
        });
    });
  },

  actualizarDatosPersonales: comando => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject("Debe iniciar sesion");
        return;
      }

      let url =
        "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/ActualizarDatosPersonales?token={token}";
      url = url.replace("{token}", global.token);

      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comando)
      })
        .then(response => response.json())
        .then(data => {
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

  actualizarDatosContacto: comando => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject("Debe iniciar sesion");
        return;
      }

      let url =
        "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/ActualizarDatosContacto?token={token}";
      url = url.replace("{token}", global.token);

      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comando)
      })
        .then(response => response.json())
        .then(data => {
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

  crearUsuario: comando => {
    return new Promise((resolve, reject) => {
      let url =
        "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario?passwordDefault=false&urlRetorno=cba147app://abrir";

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

  recuperarCuenta: username => {
    return new Promise((resolve, reject) => {
      let url =
        "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/RecuperarCuenta?username={user}&urlRetorno={urlRetorno}";
      url = url.replace("{user}", username);
      url = url.replace("{urlRetorno}", "cba147app://abrir");

      fetch(url, { method: "PUT" })
        .then(response => response.json())
        .then(data => {
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

  cambiarUsername: username => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject("Debe iniciar sesion");
        return;
      }

      let url =
        "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/CambiarUsername?token={token}&username={username}";
      url = url.replace("{token}", global.token);
      url = url.replace("{username}", username);

      fetch(url, {
        method: "PUT"
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
          reject("Error procesando la solicitud");
        });
    });
  },

  cambiarPassword: (passwordAnterior, passwordNueva) => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject("Debe iniciar sesion");
        return;
      }

      let url =
        "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/CambiarPassword?token={token}&passwordAnterior={passAnterior}&passwordNuevo={passNueva}";
      url = url.replace("{token}", global.token);
      url = url.replace("{passAnterior}", passwordAnterior);
      url = url.replace("{passNueva}", passwordNueva);

      fetch(url, {
        method: "PUT"
      })
        .then(response => response.json())
        .then(data => {
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

  cambiarFoto: foto => {
    return new Promise((resolve, reject) => {
      if (global.token == undefined) {
        reject("Debe iniciar sesion");
        return;
      }

      let url =
        "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/ActualizarFotoPersonal?token={token}";
      url = url.replace("{token}", global.token);

      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: foto })
      })
        .then(response => response.json())
        .then(data => {
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

  validarUsuarioActivado: (username, password) => {
    return new Promise((resolve, reject) => {
      let url =
        "https://servicios2.cordoba.gov.ar/WSCBA147_Bridge/v1/Usuario/ValidarUsuarioActivado?username={username}&password={password}";
      url = url.replace("{username}", username);
      url = url.replace("{password}", password);

      fetch(url, {
        method: "GET"
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error || "Error procesando la solicitud");
            return;
          }

          resolve(data.return == true);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },

  solicitarEmailActivacion: (username, password) => {
    return new Promise((resolve, reject) => {
      let url =
        "https://servicios2.cordoba.gov.ar/WSVecinoVirtual_Bridge/v1/Usuario/ActivacionCuenta/Iniciar";

      let comando = {
        username: username,
        password: password,
        urlServidor:
          "https://servicios2.cordoba.gov.ar/vecinovirtualutils_internet/ProcesarActivarUsuario",
        urlRetorno: "cba147app://abrir"
      };

      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comando)
      })
        .then(response => response.json())
        .then(data => {
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
  }
};

export default metodos;
