import React from "react";
import App from "Cordoba/src/UI/App";

export default class Rules_Domicilio extends React.Component {
  static validar = (x, y) => {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback({});
      }, 500);
    })
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
          if (responseJson.status != "OK") {
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
