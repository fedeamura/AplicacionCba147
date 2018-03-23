"use strict";
import { StyleSheet } from "react-native";
import color from "color";

let colorBase = 'green';
global.styles = {
  colorStatusBar: color(colorBase)
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

};

export default StyleSheet.create({
  toolbar: {
    backgroundColor: global.styles.colorPrimary,
    elevation: 8
  },
  fab: {
    margin:16
  }
});
