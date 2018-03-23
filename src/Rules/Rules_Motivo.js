import React, { Component } from "react";
import App from "Cordoba/src/UI/App";

export default class Rules_Motivo extends React.Component {
  static get(idServicio, callback, callbackError) {
    const url =
      "https://servicios.cordoba.gov.ar/WSSigo_Bridge/BridgeRequerimiento.asmx/GetAllMotivos";

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: App.Variables.Token,
        idServicio: idServicio
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
        callbackError("Error procesando la solicitud");
      });
  }
}
