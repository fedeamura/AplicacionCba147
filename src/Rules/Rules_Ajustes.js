
import App from "Cordoba/src/UI/App";
import DB from "Cordoba/src/DAO/DB";

const metodos = {

  //Intro vista
  setIntroVista: function () {
    DB.setItem("introVista", 'true').then(() => {

    }).catch((error) => {

    });
  },

  esIntroVista: function () {
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
  },

  //Beta tester
  setBetaTester: function (tester) {
    return DB.setItem("betaTester", '' + tester);
  },

  isBetaTester: function () {
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
  },

  //Ajustes para desarrollador
  setAjustesParaDesarrolladorVisible: function (visible) {
    return DB.setItem("ajustesDesarrolladorVisible", '' + visible);
  },

  esAjustesParaDesarrolladorVisible: function () {
    return new Promise((resolve, reject) => {
      DB.getItem("ajustesDesarrolladorVisible").then((val) => {
        if (val == undefined) {
          val = 'false';
        }
        resolve(val == 'true');
      }).catch((error) => {
        reject('Error procesando la solicitud');
      });
    });
  },

  //Tipo de UI para el listado de requerimientos
  setListadoRequerimientoInterfaz: function (tipo) {
    return new Promise((resolve, reject) => {
      DB.setItem("listadoRequerimientoInterfaz", tipo + '').then(() => {
        resolve();
      }).catch((error) => {
        reject('Error procesando la solicitud');
      });
    });
  },

  getListadoRequerimientoInterfaz: function () {
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
  },

  //Validar coneccion
  validarConeccion: function () {
    return new Promise((callback, reject) => {
      callback();
    });
  }
}

export default metodos;