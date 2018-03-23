import React, { Component } from "react";
import App from "Cordoba/src/UI/App";
import DB from "Cordoba/src/DAO/DB";

export default class Rules_Usuario extends React.Component {
  constructor() {
    super();
    this.key_token = "token";
  }

  static login(user, pass, callback, callbackError) {
    console.log('Rules_Usuario - Login');
    const url =
      "https://servicios.cordoba.gov.ar/WSSigo_Bridge/BridgeUsuario.asmx/IniciarSesion";

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: user,
        pass: pass
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        var data = responseJson.d;

        console.log(data);
        if (!data.Ok) {
          callbackError(data.Error);
          return;
        }

        var token = data.Return;

        DB.setItem("token", token).then(() => {
          App.Variables.Token = token;
          callback();
        })
          .catch(() => {
            callbackError("Error procesando la solicitud");
          });
      })
      .catch(error => {
        console.log(error);
        callbackError(error);
      });
  }

  static isLogin(callback) {
    console.log('Rules_Usuario - IsLogin');

    DB.getItem("token")
      .then(response => {
        if (response == undefined) {
          console.log('No hay token');
          callback(false);
          App.Variables.Token = undefined;
          return;
        }

        console.log(response);

        const url =
          "https://servicios.cordoba.gov.ar/WSSigo_Bridge/BridgeUsuario.asmx/ValidarToken";

        fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: response
          })
        })
          .then(response => response.json())
          .then(responseJson => {
            var data = responseJson.d;
            console.log(data);

            if (!data.Ok) {
              callback(false);
              App.Variables.Token = undefined;
              return;
            }

            if (!data.Return) {
              callback(false);
              App.Variables.Token = undefined;
              return;
            }

            App.Variables.Token = response;
            callback(true);
          })
          .catch(error => {
            callback(false);
            App.Variables.Token = undefined;
          });

      }).catch((error) => {
        console.log('Error');
        console.log(error);
        callback(false);
        App.Variables.Token = undefined;
      });
  }

  static cerrarSesion() {
    return new Promise((resolve, reject) => {
      console.log('Rules_Usuario - CerrarSesion');

      try {
        DB.removeItem("token");
        console.log("borrado");
        App.Variables.Token = undefined;
        resolve();
      } catch (error) {
        reject('Error procesando la solicitud');
      }
    });
  }
}
