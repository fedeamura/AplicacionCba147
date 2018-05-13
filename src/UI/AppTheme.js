"use strict";
import React, { Component } from "react";
import { StyleSheet } from "react-native";
import color from "color";
import { DefaultTheme } from "react-native-paper";

let colorBase = 'green';
let colorToolbar = 'white';

global.styles = {
  colorStatusBar: color(colorToolbar)
    .darken(0.2)
    .rgb()
    .string(),
  colorPrimary: colorBase,
  colorPrimaryDark: color(colorBase)
    .darken(0.2)
    .rgb()
    .string(),
  colorAccent: color(colorBase)
    .lighten(0.2)
    .rgb()
    .string(),
  colorAccentText: 'white',
  coloresFondoAnimado: [
    '#66BB6A',
    '#1B5E20'
  ],
  colorFondo: 'rgba(230,230,230,1)',
  colorFondo_0: 'rgba(230,230,230,0)',
  //Loading
  login_colorFondo: 'rgba(230,230,230,1)',
  //Toolbar
  colorToolbar: colorToolbar,
  colorTextoToolbar: 'black',
  toolbarDark: false
};

export default class AppTheme extends React.Component {
  constructor() {
    super();
  }

  static Styles = {};

  static ColorAccent = 'red';
  static ColorPrimary = 'red';
  static ColorPrimaryDark = 'red';

  static crear(initData) {

    this.ColorAccent = initData.General.Style.ColorAccent;
    this.ColorPrimary = initData.General.Style.ColorPrimary;
    this.ColorPrimaryDark = initData.General.Style.ColorPrimaryDark;

    this.Styles.Toolbar = {
      backgroundColor: initData.General.Style.Toolbar_BackgroundColor,
      elevation: 0,
      width: '100%',
      borderBottomColor: this.ColorAccent,
      borderBottomWidth: initData.General.Style.Toolbar_BorderWidth
    }

    this.Styles.Theme = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        accent: this.ColorAccent,
        primary: this.ColorPrimary,
        primaryDark: this.ColorPrimaryDark,
      }
    };
  }
}

