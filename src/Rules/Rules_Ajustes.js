import React, { Component } from "react";
import App from "Cordoba/src/UI/App";
import DB from "Cordoba/src/DAO/DB";

export default class Rules_Ajustes extends React.Component {
  constructor() {
    super();
  }

  static setIntroVista = () => {
    DB.setItem("introVista", 'true').then(() => {

    }).catch((error) => {

    });
  }

  static esIntroVista = () => {
    return new Promise((resolve, reject) => {
      DB.getItem("introVista").then((val) => {
        if (val == undefined) {
          val = 'false';
        }
        resolve(val == 'true');
      }).catch((error) => {
        reject('Error procesando la solicitud');
      });
    });
  }

  static setBetaTester = (tester) => {
    return DB.setItem("betaTester", '' + tester);
  }

  static isBetaTester = (tester) => {
    return new Promise((resolve, reject) => {
      DB.getItem("betaTester").then((val) => {
        if (val == undefined) {
          val = 'false';
        }
        resolve(val == 'true');
      }).catch((error) => {
        reject('Error procesando la solicitud');
      });
    });
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
