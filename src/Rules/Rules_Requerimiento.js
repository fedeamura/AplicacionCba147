import React from "react";

export default class Rules_Requerimiento extends React.Component {

  static get = () => {
    return new Promise((resolve, reject) => {
      let rqs = [];
      rqs.push({ id: 1, estadoKeyValue: 1, estadoColor: '#E53935', estadoNombre: 'Nuevo', numero: "QAZWSX", año: 2017, fechaAlta: '10/10/2018' });
      rqs.push({ id: 2, estadoKeyValue: 2, estadoColor: '#000000', estadoNombre: 'Cancelado', numero: "THYWDC", año: 2018, fechaAlta: '10/10/2018' })
      rqs.push({ id: 3, estadoKeyValue: 2, estadoColor: '#000000', estadoNombre: 'Cancelado', numero: "THYWDC", año: 2018, fechaAlta: '10/10/2018' })
      rqs.push({ id: 4, estadoKeyValue: 2, estadoColor: '#000000', estadoNombre: 'Cancelado', numero: "THYWDC", año: 2018, fechaAlta: '10/10/2018' })
      rqs.push({ id: 5, estadoKeyValue: 2, estadoColor: '#000000', estadoNombre: 'Cancelado', numero: "THYWDC", año: 2018, fechaAlta: '10/10/2018' })

      setTimeout(() => {
        // reject('ouchilas');
        resolve(rqs);
      }, 500);
      // const url =
      //   "https://servicios.cordoba.gov.ar/WSSigo_Bridge/BridgeRequerimiento.asmx/ConsultarMisRequerimientos";

      // console.log('Rules_Requerimiento - get');
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
      //     console.log(data);

      //     if (!data.Ok) {
      //       console.log('Error');
      //       console.log(data.Error);

      //       reject(data.Error);
      //       return;
      //     }

      //     resolve(data.Return);
      //   })
      //   .catch(error => {
      //     console.log('Error');
      //     console.log(error);
      //     reject('Error procesando la solicitud');
      // });
    });

  }

  static insertar = (comando) => {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback();
      }, 5000);
    });
  }

  static getDetalle = (id) => {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback({});
      }, 500);
    });
  }

  
}
