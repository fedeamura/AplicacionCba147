import React, { Component } from "react";
import App from "Cordoba/src/UI/App";

export default class Rules_Domicilio extends React.Component {
  static validarDomicilio(x, y, callback, callbackError) {
    const url =
      "https://servicios.cordoba.gov.ar/WSSigo_Bridge/BridgeDomicilio.asmx/ValidarDomicilio";

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: App.Variables.Token,
        domicilio: {
          porBarrio: true,
          XGoogle: x,
          YGoogle: y
        }
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

        callback(data.Return);
      })
      .catch(error => {
        console.log(error);
        callbackError("Error procesando la solicitud");
      });
  }

  static buscarCoordenada(busqueda) {
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + busqueda + '&key=' + App.Variables.KeyGoogleMaps;

    return new Promise((callback, callbackError) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(responseJson => {
          if(responseJson.status!="OK"){
            callbackError('Error procesando la solicitud');
            return;
          }

          callback(responseJson.results);
        })
        .catch(error => {
        });
    });
  }
}
