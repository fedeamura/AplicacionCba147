import React, { Component } from "react";
import App from "@UI/App";

export default class Rules_Servicio extends React.Component {

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

  static getPrincipales() {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback([
          {
            id: 1,
            nombre: 'Servicio 1',
            principal: true
          },
          {
            id: 2,
            nombre: 'Servicio 2',
            principal: true
          },
          {
            id: 3,
            nombre: 'Servicio 3',
            principal: true
          },
          {
            id: 4,
            nombre: 'Servicio 4',
            principal: true
          },
          {
            id: 5,
            nombre: 'Servicio 5',
            principal: true
          },
          {
            id: 6,
            nombre: 'Servicio 6',
            principal: true
          }
        ])
      }, 500);
    });
  }
}
