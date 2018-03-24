import React, { Component } from "react";
import App from "Cordoba/src/UI/App";

export default class Rules_Requerimiento extends React.Component {
  static get(callback, callbackError) {
    return new Promise((resolve, reject) => {
      const url =
        "https://servicios.cordoba.gov.ar/WSSigo_Bridge/BridgeRequerimiento.asmx/ConsultarMisRequerimientos";

      console.log('Rules_Requerimiento - get');
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
