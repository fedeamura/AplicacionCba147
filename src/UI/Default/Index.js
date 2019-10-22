import React from "react";
import {
  StyleSheet,
  View,
  Alert,
  Animated,
  Keyboard,
  WebView
} from "react-native";
import WebImage from "react-native-web-image";

//Mis componentes
import App from "Cordoba/src/UI/App";
import MiStatusBar from "@Utils/MiStatusBar";
import MiBoton from "@Utils/MiBoton";

import AppCargando from "../AppCargando";

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_Ajustes from "@Rules/Rules_Ajustes";
import Rules_Init from "@Rules/Rules_Init";

export default class Default extends React.Component {
  static navigationOptions = {
    title: "",
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.validarLogin();
  }

  validarLogin = async () => {
    try {
      await Rules_Init.actualizarApp();
      let initData = await Rules_Init.getInitData();
      global.initData = initData;
      App.replace("Login");
    } catch (ex) {
      alert(JSON.stringify(ex));
    }
  };

  render() {
    return <AppCargando visible={true} />;
  }
}
