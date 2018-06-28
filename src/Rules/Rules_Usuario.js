import React from "react";
import DB from "Cordoba/src/DAO/DB";

export default class Rules_Usuario extends React.Component {

  constructor() {
    super();
    this.key_token = "token";
  }

  static login = (user, pass) => {
    return new Promise((resolve, reject) => {
      let token = "test";
      DB.setItem("token", token).then(() => {
        global.token = token;
        resolve();
      }).catch((error) => {
        reject('Error procesando la solicitud');
      });

      // reject('Error procesando la solicitud');
      // const url =
      //   "https://servicios.cordoba.gov.ar/WSSigo_Bridge/BridgeUsuario.asmx/IniciarSesion";

      // fetch(url, {
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     user: user,
      //     pass: pass
      //   })
      // })
      //   .then(response => response.json())
      //   .then(responseJson => {
      //     var data = responseJson.d;

      //     console.log(data);
      //     if (!data.Ok) {
      //       console.log('Error');
      //       console.log(data.Error);

      //       reject(data.Error);
      //       return;
      //     }
      //     var token = data.Return;

      //     DB.setItem("token", token).then(() => {
      //       App.Variables.Token = token;
      //       resolve();
      //     }).catch((error) => {
      //       console.log('Error');
      //       console.log(error);

      //       reject('Error procesando la solicitud');
      //     });
      //   })
      //   .catch(error => {
      //     console.log('Error');
      //     console.log(error);

      //     reject('Error procesando la solicitud');
      //   });
    });
  }

  static isLogin = () => {
    return new Promise((resolve, reject) => {
      DB.getItem("token")
        .then(response => {
          if (response == undefined) {
            global.token = undefined;
            resolve(false);
            return;
          }

          global.token = response;
          resolve(true);
        }).catch((error) => {
          global.token = undefined;
          resolve(false);
        });;


      // DB.getItem("token")
      //   .then(response => {
      //     if (response == undefined) {
      //       console.log('Error');
      //       console.log('Sin token');

      //       App.Variables.Token = undefined;
      //       resolve(false);
      //       return;
      //     }

      // const url =
      //   "https://servicios.cordoba.gov.ar/WSSigo_Bridge/BridgeUsuario.asmx/ValidarToken";

      // fetch(url, {
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     token: response
      //   })
      // })
      //   .then(response => response.json())
      //   .then(responseJson => {

      //     if(responseJson==undefined || responseJson.d==undefined){
      //       console.log('Sin datos');
      //       App.Variables.Token = undefined;
      //       resolve(false);
      //       return;
      //     }

      //     var data = responseJson.d;


      //     if (!data.Ok) {
      //       console.log('Error');
      //       console.log(data.Error);

      //       App.Variables.Token = undefined;
      //       resolve(false);
      //       return;
      //     }

      //     if (!data.Return) {
      //       console.log('No es login');

      //       App.Variables.Token = undefined;
      //       resolve(false);
      //       return;
      //     }

      //     App.Variables.Token = response;
      //     resolve(true);
      //   })
      //   .catch(error => {
      //     console.log('Error');
      //     console.log(error);

      //     App.Variables.Token = undefined;
      //     resolve(false);
      //   });


      // }).catch((error) => {
      //   console.log('Error');
      //   console.log(error);

      //   App.Variables.Token = undefined;
      //   resolve(false);
      // });
    });
  }

  static cerrarSesion = () => {
    return new Promise((resolve, reject) => {
      try {
        DB.removeItem("token");
        global.token = undefined;
        resolve();
      } catch (error) {
        reject('Error procesando la solicitud');
      }
    });
  }

  static getDatos = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          Nombre: 'Federico',
          Apellido: 'Amura',
          Dni: 35476866,
          Cuil: '20354768667',
          SexoMasculino: false,
          FechaNacimiento: '01/05/1991',
          DomicilioLegal: '27 de abril 464 13B, Cordoba, Argentina',
          Email: 'fede.amura@gmail.com',
          TelefonoCelular: '351-7449132',
          TelefonoFijo: '351-4226236',
          ValidadoEmail: true,
          ValidadoRenaper: false
        });
      }, 500);
    });
  }

  static esUsuarioValidadoRenaper = () => {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback(global.validado || false);
      }, 100);
    });
  }

  static validarDatos = (usuario) => {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback(usuario);
        // callbackError('El usuario ya existe');
      }, 1000);
    });
  }

  static actualizarDatosPersonales = (comando) => {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        global.validado = true;
        callback(comando);
        // callbackError('El usuario ya existe');
      }, 1000);
    });
  }

  static crearUsuario = (usuario) => {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback();
        // callbackError('Error procesando la solicitud');
      }, 2000);
    });
  }

  static recuperarCuenta = (username, email) => {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback();
      }, 2000);
    });
  }
}
