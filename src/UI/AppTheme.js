"use strict";
import React, { Component } from "react";
import { StyleSheet, Dimensions } from "react-native";
import ExtraDimensions from 'react-native-extra-dimensions-android';
import color from "color";
import { DefaultTheme } from "react-native-paper";

export default class AppTheme {

  static colorAccent = 'red';
  static colorPrimary = 'red';
  static colorPrimaryDark = 'red';
  static colorFondo = 'white';
  static styles = {};

  static crear(initData) {

    this.colorAccent = initData.general.colorAccent;
    this.colorPrimary = initData.general.colorPrimary;
    this.colorPrimaryDark = initData.general.colorPrimaryDark;
    this.colorFondo = initData.general.colorFondo;

    this.styles.toolbar = {
      backgroundColor: this.styles.toolbar_BackgroundColor,
      elevation: 0,
      width: '100%',
      borderBottomColor: this.colorAccent,
      borderBottomWidth: this.toolbar_BorderWidth
    }

    this.styles.theme = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        accent: this.colorAccent,
        primary: this.colorPrimary,
        primaryDark: this.colorPrimaryDark,
      }
    };

    this.initLogin(initData);
    this.initInicio(initData);
  }

  static initLogin(initData) {
    const style = {};

    //Contenedor
    style.contenedor = {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: AppTheme.colorFondo,
    };
    style.contenedor_ScrollView = {
      width: '100%'
    };
    style.contenedor_ScrollViewContent = {
      flexGrow: 1,
      justifyContent: 'center',
    };
    style.contenedor_ScrollViewContenido = {
     
    };
    style.contenedorFormulario = {
    
    };


    //Fondo
    style.imagenFondo = {
      position: "absolute",
      width: '100%',
      height: '100%'
    };
    style.imagenFondo_Dim = {
      position: "absolute",
      width: '100%',
      height: '100%',
      opacity: 0.5,
      backgroundColor: '#000000'
    };


    //Logo
    style.imagenLogo = {
      width: 104,
      height: 104,
      marginBottom: 32
    };

    //Inputs
    style.contenedorInput = {
      marginBottom: 16
    };
    style.input = {
     
    };

    style.textoError = {
   
    };

    //Botones
    style.contenedorBotones = {
     
    };

    style.btnAcceder = {
     
    };

    style.btnRecuperarCuenta = {
    
    };

    style.btnNuevoUsuario = {
   
    };


    this.styles.login = style;
  }

  static initInicio(initData) {
    let style = {};
    this.styles.inicio = style;

    this.initInicioRequerimientos(initData);
  }

  static initInicioRequerimientos(initData) {
    let style = {};

    //Empty
    style.contenedor_Empty = {
      position: 'absolute',
      backgroundColor: initData.inicio.requerimientos.empty.backgroundColor,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };

    style.imagenEmpty = {
      backgroundColor: initData.inicio.requerimientos.empty.imagen.backgroundColor,
      width: initData.inicio.requerimientos.empty.imagen.width,
      height: initData.inicio.requerimientos.empty.imagen.height
    };

    style.textoEmpty = {
      fontSize: initData.inicio.requerimientos.empty.texto.fontSize,
      color: initData.inicio.requerimientos.empty.texto.color,
      textAlign: 'center',
      marginTop: initData.inicio.requerimientos.empty.texto.marginTop,
      marginBottom: initData.inicio.requerimientos.empty.texto.marginBottom,
      marginLeft: initData.inicio.requerimientos.empty.texto.marginLeft,
      marginRight: initData.inicio.requerimientos.empty.texto.marginRight
    };

    style.botonEmpty = {
      alignSelf: 'center',
      backgroundColor: initData.inicio.requerimientos.empty.boton.backgroundColor,
      marginTop: initData.inicio.requerimientos.empty.boton.marginTop,
      marginBottom: initData.inicio.requerimientos.empty.boton.marginBottom,
      marginLeft: initData.inicio.requerimientos.empty.boton.marginLeft,
      marginRight: initData.inicio.requerimientos.empty.boton.marginRight
    };

    //Error
    style.contenedor_Error = {
      position: 'absolute',
      backgroundColor: initData.inicio.requerimientos.error.backgroundColor,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };

    style.imagenError = {
      backgroundColor: initData.inicio.requerimientos.error.imagen.backgroundColor,
      width: initData.inicio.requerimientos.error.imagen.width,
      height: initData.inicio.requerimientos.error.imagen.height
    };

    style.textoError = {
      fontSize: initData.inicio.requerimientos.error.texto.fontSize,
      color: initData.inicio.requerimientos.error.texto.color,
      textAlign: 'center',
      marginTop: initData.inicio.requerimientos.error.texto.marginTop,
      marginBottom: initData.inicio.requerimientos.error.texto.marginBottom,
      marginLeft: initData.inicio.requerimientos.error.texto.marginLeft,
      marginRight: initData.inicio.requerimientos.error.texto.marginRight
    };

    style.botonError = {
      alignSelf: 'center',
      backgroundColor: initData.inicio.requerimientos.error.boton.backgroundColor,
      marginTop: initData.inicio.requerimientos.error.boton.marginTop,
      marginBottom: initData.inicio.requerimientos.error.boton.marginBottom,
      marginLeft: initData.inicio.requerimientos.error.boton.marginLeft,
      marginRight: initData.inicio.requerimientos.error.boton.marginRight
    };


    //Requerimiento
    style.cardItem = {
      padding: 0,
      borderTopLeftRadius: initData.inicio.requerimientos.cardItem.borderTopLeftRadius,
      borderTopRightRadius: initData.inicio.requerimientos.cardItem.borderTopRightRadius,
      borderBottomRightRadius: initData.inicio.requerimientos.cardItem.borderBottomRightRadius,
      borderBottomLeftRadius: initData.inicio.requerimientos.cardItem.borderBottomLeftRadius,
      marginTop: initData.inicio.requerimientos.cardItem.marginTop,
      marginBottom: initData.inicio.requerimientos.cardItem.marginBottom,
      marginLeft: initData.inicio.requerimientos.cardItem.marginLeft,
      marginRight: initData.inicio.requerimientos.cardItem.marginRight
    };

    style.cardItemContent = {
      borderTopLeftRadius: initData.inicio.requerimientos.cardItem.borderTopLeftRadius,
      borderTopRightRadius: initData.inicio.requerimientos.cardItem.borderTopRightRadius,
      borderBottomRightRadius: initData.inicio.requerimientos.cardItem.borderBottomRightRadius,
      borderBottomLeftRadius: initData.inicio.requerimientos.cardItem.borderBottomLeftRadius,
      padding: initData.inicio.requerimientos.cardItem.padding,
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden'
    }

    this.styles.inicio.requerimientos = style;
  }
}

