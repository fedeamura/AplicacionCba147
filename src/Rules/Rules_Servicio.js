
const metodos = {
  get: () => {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback([
          {
            Id: 1,
            Nombre: 'Alumbrado público',
            Icono: 'lightbulb-on-outline',
            Principal: true,
            Color: '#FBC02D'
          },
          {
            Id: 2,
            Nombre: 'Obras viales',
            Icono: 'sign-caution',
            Principal: true,
            Color: '#F57C00'
          },
          {
            Id: 3,
            Nombre: 'Espacios verdes',
            Icono: 'tree',
            Principal: true,
            Color: '#43A047'
          },
          {
            Id: 4,
            Nombre: 'Policia municipal',
            Icono: 'security-account',
            Principal: true,
            Color: '#3F51B5'
          },
          {
            Id: 5,
            Nombre: 'Fiscalización y control',
            Icono: 'security',
            Principal: true,
            Color: '#673AB7'
          },
          {
            Id: 6,
            Nombre: 'Transporte',
            Icono: 'bus-side',
            Principal: true,
            Color: '#009688'
          },
          {
            Id: 7,
            Nombre: 'Higiente urbana',
            Icono: 'delete-empty',
            Principal: true,
            Color: '#6D4C41'
          },
          {
            Id: 8,
            Nombre: 'Redes sanitarias',
            Icono: 'water-pump',
            Principal: true,
            Color: '#039BE5'
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

export default metodos;