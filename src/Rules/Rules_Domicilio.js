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

  static buscarSugerencias = (busqueda) => {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback([{}]);
      }, 500);
    });
  }
}
