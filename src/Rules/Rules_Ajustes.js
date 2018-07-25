
import App from "Cordoba/src/UI/App";
import DB from "Cordoba/src/DAO/DB";

const metodos = {
  //Intro vista
  setIntroVista: () => {
    DB.setItem("introVista", 'true').then(() => {

    }).catch((error) => {

    });
  },

  esIntroVista: () => {
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
  setBetaTester: (tester) => {
    return DB.setItem("betaTester", '' + tester);
  },

  isBetaTester: () => {
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
  setAjustesParaDesarrolladorVisible: (visible) => {
    return DB.setItem("ajustesDesarrolladorVisible", '' + visible);
  },

  esAjustesParaDesarrolladorVisible: () => {
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
  setListadoRequerimientoInterfaz: (tipo) => {
    return new Promise((resolve, reject) => {
      DB.setItem("listadoRequerimientoInterfaz", tipo + '').then(() => {
        resolve();
      }).catch((error) => {
        reject('Error procesando la solicitud');
      });
    });
  },

  getListadoRequerimientoInterfaz: () => {
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
  validarConeccion: () => {
    return new Promise((callback, reject) => {
      callback();
    });
  }
}

export default metodos;