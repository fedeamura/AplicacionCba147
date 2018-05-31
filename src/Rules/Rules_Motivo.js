import React, { Component } from "react";
import App from "Cordoba/src/UI/App";

export default class Rules_Motivo extends React.Component {
  static get() {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback([
          {
            id: 1,
            nombre: 'Alumbrado',
            principal: true
          },
          {
            id: 2,
            nombre: 'Higiene urbana',
            principal: true
          },
          {
            id: 2,
            nombre: 'Higiene urbana',
            principal: true
          },
          {
            id: 2,
            nombre: 'Higiene urbana',
            principal: true
          },
          {
            id: 2,
            nombre: 'Higiene urbana',
            principal: true
          },
          {
            id: 2,
            nombre: 'Higiene urbana',
            principal: true
          },
          {
            id: 2,
            nombre: 'Higiene urbana',
            principal: true
          },
          {
            id: 2,
            nombre: 'Higiene urbana',
            principal: true
          },
          {
            id: 2,
            nombre: 'Higiene urbana'
          },
          {
            id: 2,
            nombre: 'Higiene urbana'
          },
          {
            id: 2,
            nombre: 'Higiene urbana'
          }

        ])
      }, 500);
      // const url =
      //   "https://servicios.cordoba.gov.ar/WSSigo_Bridge/BridgeRequerimiento.asmx/GetAllServicios";

      // fetch(url, {
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     token: App.Variables.Token
      //   })
      // })
      //   .then(response => response.json())
      //   .then(responseJson => {
      //     var data = responseJson.d;
      //     if (!data.Ok) {
      //       callbackError(data.Error);
      //       return;
      //     }

      //     callback(data.Return);
      //   })
      //   .catch(error => {
      //     callbackError("Error procesando la solicitud");
      //   });
    });
  }
}
