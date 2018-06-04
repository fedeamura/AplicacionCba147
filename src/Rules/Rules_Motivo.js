import React, { Component } from "react";
import App from "Cordoba/src/UI/App";

export default class Rules_Motivo extends React.Component {
  static get(idServicio) {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback([
          {
            id: 1,
            nombre: 'Motivo 1',
            principal: true
          },
          {
            id: 2,
            nombre: 'Motivo 2',
            principal: true
          },
          {
            id: 3,
            nombre: 'Motivo 3',
            principal: true
          },
          {
            id: 4,
            nombre: 'Motivo 4',
            principal: true
          },
          {
            id: 5,
            nombre: 'Motivo 5',
            principal: true
          },
          {
            id: 6,
            nombre: 'Motivo 6',
            principal: true
          },
          {
            id: 7,
            nombre: 'Motivo 7',
            principal: false
          }, {
            id: 8,
            nombre: 'Motivo 8',
            principal: false
          }, {
            id: 9,
            nombre: 'Motivo 9',
            principal: false
          }, {
            id: 10,
            nombre: 'Motivo 10',
            principal: false
          },
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
