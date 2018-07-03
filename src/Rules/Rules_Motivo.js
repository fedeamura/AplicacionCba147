import React from "react";

export default class Rules_Motivo extends React.Component {

  static get = (idServicio) => {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback([
          {
            Id: 1,
            Nombre: 'Motivo A'
          },
          {
            Id: 2,
            Nombre: 'Motivo B'
          },
          {
            Id: 3,
            Nombre: 'Motivo C'
          },
          {
            Id: 4,
            Nombre: 'Motivo D'
          },
          {
            Id: 5,
            Nombre: 'Motivo E'
          },
          {
            Id: 6,
            Nombre: 'Motivo F'
          },
          {
            Id: 7,
            Nombre: 'Motivo G'
          },
          {
            Id: 8,
            Nombre: 'Motivo H'
          }, {
            Id: 9,
            Nombre: 'Motivo I'
          }, {
            Id: 10,
            Nombre: 'Motivo J'
          },
        ])
      }, 500);
      // const url =
      //   "https://servicios.cordoba.gov.ar/WSSigo_Bridge/BridgeRequerimiento.asmx/GetAllServicios";

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
      //     if (!data.Ok) {
      //       callbackError(data.Error);
      //       return;
      //     }

      //     callback(data.Return);
      //   })
      //   .catch(error => {
      //     callbackError("Error procesando la solicitud");
      //   });
    });
  }

  static getParaBuscar = () => {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback([
          {
            Id: 1,
            Nombre: 'Motivo A',
            ServicioNombre: 'Servicio 1',
            ServicioId: 1
          },
          {
            Id: 2,
            Nombre: 'Motivo B',
            ServicioNombre: 'Servicio 2',
            ServicioId: 2
          },
          {
            Id: 3,
            Nombre: 'Motivo C',
            ServicioNombre: 'Servicio 3',
            ServicioId: 3
          },
          {
            Id: 4,
            Nombre: 'Motivo D',
            ServicioNombre: 'Servicio 4',
            ServicioId: 4
          },
          {
            Id: 5,
            Nombre: 'Motivo E',
            ServicioNombre: 'Servicio 5',
            ServicioId: 5
          },
          {
            Id: 6,
            Nombre: 'Motivo F',
            ServicioNombre: 'Servicio 6',
            ServicioId: 6
          },
          {
            Id: 7,
            Nombre: 'Motivo G',
            ServicioNombre: 'Servicio 7',
            ServicioId: 7
          },
          {
            Id: 8,
            Nombre: 'Motivo H',
            ServicioNombre: 'Servicio 8',
            ServicioId: 8
          },
          {
            Id: 9,
            Nombre: 'Motivo I',
            ServicioNombre: 'Servicio 9',
            ServicioId: 9
          },
          {
            Id: 10,
            Nombre: 'Motivo J',
            ServicioNombre: 'Servicio 10',
            ServicioId: 10
          },
        ])
      }, 500);
      // const url =
      //   "https://servicios.cordoba.gov.ar/WSSigo_Bridge/BridgeRequerimiento.asmx/GetAllServicios";

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
      //     if (!data.Ok) {
      //       callbackError(data.Error);
      //       return;
      //     }

      //     callback(data.Return);
      //   })
      //   .catch(error => {
      //     callbackError("Error procesando la solicitud");
      //   });
    });
  }
}
