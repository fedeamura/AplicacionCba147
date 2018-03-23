import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  LayoutAnimation,
  UIManager,
  Alert,
  StatusBar
} from "react-native";
import {
  Container,
  Button,
  Text,
  Input,
  Item,
  Icon,
  Spinner
} from "native-base";
import MaterialsIcon from "react-native-vector-icons/MaterialIcons";
import { Kohana } from "react-native-textinput-effects";

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "Cordoba/src/UI/App";
import AppStyles from "Cordoba/src/UI/Styles/default";
import Landing from "Cordoba/src/UI/Login/Landing";
import IndicadorCargando from "Cordoba/src/UI/Utils/IndicadorCargando";

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

// Configuracion del Layout Anim
var ConfigAnim = {
  duration: 400,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 0.7
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7
  }
};

export default class Login extends React.Component {
  static navigationOptions = {
    title: "Iniciar Sesion",
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      escribioUsuario: false,
      usuario: "amura_f",
      escribioPassword: false,
      password: "federico",
      cargando: false,
      cargandoLogin: true,
      ocultarLanding: false
    };
  }

  consultarLogin(){
    Rules_Usuario.isLogin(login => {
      this.setState({
        login: login,
        ocultarLanding: true
      });
    });
  }
  
  login() {
    if (this.state.usuario == "") {
      App.animar();
      this.setState({ escribioUsuario: true, escribioPassword: true }, () => {
        this.refs.inputUsuario.focus();
      });
      return;
    }

    if (this.state.password == "") {
      App.animar();
      this.setState({ escribioUsuario: true, escribioPassword: true }, () => {
        this.refs.inputPassword.focus();
      });

      return;
    }

    App.animar();
    this.setState({ cargando: true }, () => {
      Rules_Usuario.login(
        this.state.usuario,
        this.state.password,
        () => {
          this.entrar();
        },
        error => {
          this.setState({
            cargando: false
          });
          Alert.alert(
            "Error iniciando sesión",
            error == undefined ? "" : error,
            [
              {
                text: "Aceptar",
                onPress: () => { }
              }
            ],
            { cancelable: true }
          );
        }
      );
    });
  }

  entrar() {
    App.replace('Home');
  }

  onUsuarioChange(text) {
    App.animar();
    this.setState({ usuario: text, escribioUsuario: true });
  }

  onPasswordChange(text) {
    App.animar();
    this.setState({ password: text, escribioPassword: true });
  }

  render() {
    var errorUsuarioVisible =
      this.state.usuario == "" && this.state.escribioUsuario;
    var errorPasswordVisible =
      this.state.password == "" && this.state.escribioPassword;

    if (this.state.cargandoLogin) {
      return <Landing
        salir={this.state.ocultarLanding}
        onEntrar={() => {
          this.consultarLogin();
        }}
        onSalir={(animar) => {
          console.log('fin anim');
          if (this.state.login) {
            this.entrar();
          } else {
            App.animar();
            this.setState({
              cargandoLogin: false
            });
          }
        }} />;
    }

    return (
      <Container style={styles.contenedorLogin}>
        <View style={styles.contenedorInput}>
          <Kohana
            ref="inputUsuario"
            onChangeText={val => { this.onUsuarioChange(val); }}
            value={this.state.usuario}
            style={styles.input}
            label={"Usuario"}
            iconClass={MaterialsIcon}
            iconName={"person"}
            iconColor={"black"}
            labelStyle={{ color: "black" }}
            inputStyle={{ color: "black", paddingLeft: 0 }}
            useNativeDriver
          />

          <Text
            style={{
              maxHeight: errorUsuarioVisible ? 20 : 0,
              color: "white",
              marginLeft: 16,
              marginTop: 4
            }}
          >
            * Dato requerido
              </Text>
        </View>

        <View style={styles.contenedorInput}>
          <Kohana
            ref="inputPassword"
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={val => { this.onPasswordChange(val); }}
            style={styles.input}
            label={"Conseña"}
            iconClass={MaterialsIcon}
            iconName={"vpn-key"}
            iconColor={"black"}
            labelStyle={{ color: "black" }}
            inputStyle={{ color: "black", paddingLeft: 0 }}
            useNativeDriver
          />

          <Text
            style={{
              height: errorPasswordVisible ? 20 : 0,
              color: "white",
              marginLeft: 16,
              marginTop: 4
            }}
          >
            * Dato requerido
              </Text>
        </View>

        <Button
          rounded
          light
          style={styles.btnAcceder}
          onPress={() => this.login()}
        >
          <Text>Acceder</Text>
        </Button>

        <IndicadorCargando visible={this.state.cargando} />

      </Container>

    );
  }
}

const styles = StyleSheet.create({
  contenedorInput: {
    shadowOpacity: 0.12,
    marginBottom: 16,
    shadowRadius: 2,
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 0 }
  },
  input: {
    width: "100%",
    maxWidth: 300,
    height: 50,
    maxHeight: 50,
    borderRadius: 50
  },
  contenedorLogin: {
    padding: 16,
    backgroundColor: global.styles.colorPrimary,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  inputUsuario: {
    backgroundColor: "rgba(255, 255, 255, 0.7)"
  },
  inputPassword: {
    marginTop: 16,
    backgroundColor: "rgba(255, 255, 255, 0.7)"
  },

  btnAcceder: {
    marginTop: 16,
    alignSelf: "center"
  },
  textoError: {
    height: 24,
    maxHeight: 24,
    marginLeft: 16,
    marginTop: 4,
    color: "white"
  },
  textoErrorLogin: {
    padding: 8,
    borderRadius: 32,
    minWidth: 100,
    borderWidth: 2,
    borderColor: "red",
    backgroundColor: "white"
  }
});
