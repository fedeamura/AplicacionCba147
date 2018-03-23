import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  LayoutAnimation,
  UIManager,
  Alert,
  Animated,
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
import WebImage from 'react-native-web-image'
import MaterialsIcon from "react-native-vector-icons/MaterialIcons";
import { Kohana } from "react-native-textinput-effects";

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "Cordoba/src/UI/App";
import AppStyles from "Cordoba/src/UI/Styles/default";
import IndicadorCargando from "Cordoba/src/UI/Utils/IndicadorCargando";

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

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
      cargando: false
    };

    this.anim_Logo = new Animated.Value(0);
    this.anim_Form = new Animated.Value(0);
  }

  animarLogo() {
    Animated.spring(this.anim_Logo, {
      toValue: 1
    }).start(() => {
      this.consultarLogin();
    });
  }

  consultarLogin() {
    Rules_Usuario.isLogin(login => {
      if (login) {
        this.entrar();
        return;
      }

      Animated.spring(this.anim_Form, {
        toValue: 1
      }).start();
    });
  }

  mostrarFormulario() {
    this.setState({
      cargandoLogin: false
    }, () => {
      Animated.timing(this.anim_Form, {
        duration: 500,
        toValue: 1
      }).start();
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

    this.setState({
      cargando: true
    }, () => {
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

  onUsuarioChange(text) {
    App.animar();
    this.setState({ usuario: text, escribioUsuario: true });
  }

  onPasswordChange(text) {
    App.animar();
    this.setState({ password: text, escribioPassword: true });
  }

  render() {
    const imageUri = 'https://lh3.googleusercontent.com/0oKhFnzCvEBACju9oJs5vaqpHcTPTrJUt0ZSx20J6VelB0GBlSKKYdjVJbAxT2z2TUeG=w300-rw'

    var errorUsuarioVisible =
      this.state.usuario == "" && this.state.escribioUsuario;
    var errorPasswordVisible =
      this.state.password == "" && this.state.escribioPassword;

    return (
      <View
        style={styles.contenedor}
        onLayout={() => {
          this.animarLogo();
        }}>
        <Container style={styles.contenedorLogin}>

          <Animated.View
            style={{
              transform: [{
                scale:
                  this.anim_Logo.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                  })
              }],
              opacity:
                this.anim_Logo.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                  extrapolateRight: 'clamp'
                })
            }}>
            <WebImage
              style={styles.img}
              source={{ uri: imageUri }} />

          </Animated.View>


          <Animated.View style={
            [
              styles.contenedorFormulario
              ,
              {
                maxHeight: this.anim_Form.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 350]
                }),
                transform: [{
                  translateY:
                    this.anim_Form.interpolate({
                      inputRange: [0, 1],
                      outputRange: [200, 0]
                    })
                }],
                opacity:
                  this.anim_Form.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                    extrapolateRight: 'clamp'
                  })
              }
            ]}>
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
                  color: "red",
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
                label={"Contraseña"}
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
                  color: "red",
                  marginLeft: 16,
                  marginTop: 4
                }}
              >
                * Dato requerido
              </Text>
            </View>

            <View style={styles.contenedorBotones}>
              <Button
                rounded
                style={styles.btnAcceder}
                onPress={() => this.login()}
              >
                <Text>Acceder</Text>
              </Button>
              <Button
                transparent
                color="black"
                style={styles.btnRecuperarCuenta}
              >
                <Text style={{ color: 'black' }}>¿Olvidaste tu contraseña?</Text>
              </Button>


              <Button
                rounded
                style={styles.btnNuevoUsuario}
              >
                <Text>Crear nuevo usuario</Text>
              </Button>


            </View>

          </Animated.View>

          <IndicadorCargando visible={this.state.cargando} />

        </Container>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: global.styles.login_colorFondo,
  },
  contenedorLogin: {
    maxWidth: 300,
    width: '100%',
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  contenedorFormulario: {
    maxWidth: 300,
    width: '100%',
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  contenedorInput: {
    shadowOpacity: 0.12,
    marginBottom: 16,
    shadowRadius: 2,
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 0 }
  },
  input: {
    width: "100%",
    height: 50,
    maxHeight: 50,
    borderRadius: 50
  },
  inputUsuario: {
    backgroundColor: "rgba(255, 255, 255, 0.7)"
  },
  inputPassword: {
    marginTop: 16,
    backgroundColor: "rgba(255, 255, 255, 0.7)"
  },
  contenedorBotones: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column'
  },
  btnAcceder: {
    marginTop: 16,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: global.styles.colorAccent
  },
  btnRecuperarCuenta: {
    alignSelf: 'center'
  },
  btnNuevoUsuario: {
    alignSelf: 'center',
    marginTop: 32
  },
  textoError: {
    height: 24,
    maxHeight: 24,
    marginLeft: 16,
    marginTop: 4,
    color: "red"
  },
  textoErrorLogin: {
    padding: 8,
    borderRadius: 32,
    minWidth: 100,
    borderWidth: 2,
    borderColor: "red",
    backgroundColor: "white"
  },
  img: {
    width: 104,
    height: 104,
    marginBottom: 32
  }
});
