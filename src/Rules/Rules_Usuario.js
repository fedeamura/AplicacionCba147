import React, { Component } from "react";
import App from "Cordoba/src/UI/App";
import DB from "Cordoba/src/DAO/DB";

export default class Rules_Usuario extends React.Component {
  constructor() {
    super();
    this.key_token = "token";
  }

  static login(user, pass) {
    return new Promise((resolve, reject) => {
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
            console.log('Error');
            console.log(data.Error);
            
            reject(data.Error);
            return;
          }
          var token = data.Return;

          DB.setItem("token", token).then(() => {
            App.Variables.Token = token;
            resolve();
          }).catch((error) => {
            console.log('Error');
            console.log(error);

            reject('Error procesando la solicitud');
          });
        })
        .catch(error => {
          console.log('Error');
          console.log(error);

          reject('Error procesando la solicitud');
        });
    });
  }

  static isLogin() {
    return new Promise((resolve, reject) => {

      console.log('Rules_Usuario - Is Login');

      DB.getItem("token")
        .then(response => {
          if (response == undefined) {
            console.log('Error');
            console.log('Sin token');

            App.Variables.Token = undefined;
            resolve(false);
            return;
          }

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

              if (!data.Ok) {
                console.log('Error');
                console.log(data.Error);

                App.Variables.Token = undefined;
                reject(data.Error);
                return;
              }

              if (!data.Return) {
                console.log('No es login');

                App.Variables.Token = undefined;
                resolve(false);
                return;
              }

              App.Variables.Token = response;
              resolve(true);
            })
            .catch(error => {
              console.log('Error');
              console.log(error);

              App.Variables.Token = undefined;
              reject('Error procesando la solicitud');
            });

        }).catch((error) => {
          console.log('Error');
          console.log(error);

          App.Variables.Token = undefined;
          reject('Error procesando la solicitud');
        });
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

  static getDatosUsuario(){
    return new Promise((resolve, reject) => {
      console.log('Rules_Usuario - Get Datos Usuario');
      const url =
        "https://servicios.cordoba.gov.ar/WSSigo_Bridge/BridgeUsuario.asmx/GetDatosUsuario";

      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: App.Variables.Token
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          var data = responseJson.d;

          console.log(data);
          if (!data.Ok) {
            console.log('Error');
            console.log(data.Error);
            
            reject(data.Error);
            return;
          }

          resolve(data.Return);
        })
        .catch(error => {
          console.log('Error');
          console.log(error);

          reject('Error procesando la solicitud');
        });
    });
  }
}
