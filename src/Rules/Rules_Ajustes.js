import React, { Component } from "react";
import App from "Cordoba/src/UI/App";
import DB from "Cordoba/src/DAO/DB";

export default class Rules_Ajustes extends React.Component {
  constructor() {
    super();
  }

  static setListadoRequerimientoInterfaz = (tipo) => {
    return new Promise((resolve, reject) => {
      DB.setItem("listadoRequerimientoInterfaz", tipo + '').then(() => {
        resolve();
      }).catch((error) => {
        reject('Error procesando la solicitud');
      });
    });
  }

  static getListadoRequerimientoInterfaz = () => {
    return new Promise((resolve, reject) => {

      DB.getItem("listadoRequerimientoInterfaz").then((val) => {
        if (val == undefined) {
          val = '2';
        }
        resolve(parseInt(val));
      }).catch((error) => {
        reject('Error procesando la solicitud');
      });
    });
  }
}
