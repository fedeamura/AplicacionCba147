
import React, { Component } from "react";
import App from "Cordoba/src/UI/App";

export default class Rules_Init extends React.Component {
  constructor() {
    super();
  }

  static getInitData() {
    return new Promise((resolve, reject) => {
      let t = 0;

      setTimeout(() => {
        resolve(
          {
            General: {
              Style: {
                ColorAccent: 'green',
                ColorPrimary: 'green',
                ColorPrimaryDark: 'green',
                Toolbar_BackgroundColor: 'white',
                Toolbar_ThemeDark: true,
                Toolbar_BorderWidth: 2
              },
              Texto_DatoRequerido: 'Dato requerido',
              Texto_ErrorGenerico: 'Algo salió mal al procesar la solicitud. Por favor intente nuevamente'
            },
            IniciarSesion: {
              Texto_BotonIniciarSesion: 'Acceder',
              Texto_BotonIniciarSesionCargando: 'Iniciando sesión...',
              Texto_BotonRecuperarContraseña: '¿Olvidaste tu contraseña?',
              Texto_BotonNuevoUsuario: 'Crear nuevo usuario',
              Texto_TituloErrorIniciandoSesion: 'Error iniciando sesión',
              Url_ImagenLogo: 'https://lh3.googleusercontent.com/0oKhFnzCvEBACju9oJs5vaqpHcTPTrJUt0ZSx20J6VelB0GBlSKKYdjVJbAxT2z2TUeG=w300-rw',
              Url_ImagenFondo: 'https://servicios2.cordoba.gov.ar/CBA147/Resources/Imagenes/fondo_login_oscura.jpg'
            }
          })
      }, t);

    });
  }
}
