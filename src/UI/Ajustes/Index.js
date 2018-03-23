import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Animated,
  LayoutAnimation,
  NativeModules,
  UIManager,
  Image,
  StatusBar
} from "react-native";
import {
  ToolbarContent,
  Button
} from "react-native-paper";

//Anims
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis Compontentes
import App from "Cordoba/src/UI/App";
import AppStyles from "Cordoba/src/UI/Styles/default";
import IndicadorCargando from "Cordoba/src/UI/Utils/IndicadorCargando";
import MiToolbar from "Cordoba/src/UI/Utils/MiToolbar";

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

export default class Home extends React.Component {
  static navigationOptions = {
    title: "Ajustes",
    header: null
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.contenedor}>

        <MiToolbar
          left={{
            icon: "arrow-back",
            onClick: () => {
              goBack();
            }
          }}
        >
          <ToolbarContent title="Ajustes" />
        </MiToolbar>
        <View>
          <Button
            onPress={() => {
              Rules_Usuario.cerrarSesion(
                () => {
                  App.replace("Login");
                },
                () => { }
              );
            }}
            raised
          >
            Cerrar sesion
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    display: "flex",
    height: "100%",
    flexDirection: "column"
  }
});
