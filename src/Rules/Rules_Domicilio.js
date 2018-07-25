
const metodos = {
  validar: (x, y) => {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback({});
      }, 500);
    })
  },

  buscarSugerencias: (busqueda) => {
    return new Promise((callback, callbackError) => {
      setTimeout(() => {
        callback([{}]);
      }, 500);
    });
  }
}

export default metodos;