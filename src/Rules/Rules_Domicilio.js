
const metodos = {
  validar: function (x, y) {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback({});
      }, 500);
    })
  },

  buscarSugerencias: function (busqueda) {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback([{}]);
      }, 500);
    });
  }
}

export default metodos;