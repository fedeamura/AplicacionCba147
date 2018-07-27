import React from "react";
import {
  StyleSheet,
  View,
  Alert,
  Animated,
  ScrollView,
  Keyboard,
  Dimensions
} from "react-native";
import {
  Button,
  Text
} from "native-base";
import ExtraDimensions from 'react-native-extra-dimensions-android';
import WebImage from 'react-native-web-image'
import MaterialsIcon from "react-native-vector-icons/MaterialIcons";
import { Kohana } from "react-native-textinput-effects";

//Mis componentes
import App from "Cordoba/src/UI/App";
import MiStatusBar from "@Utils/MiStatusBar";

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_Ajustes from "@Rules/Rules_Ajustes";

export default class Login extends React.Component {
  static navigationOptions = {
    title: texto_Titulo,
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      username: undefined,
      usernameError: 'Dato requerido',
      password: undefined,
      passwordError: 'Dato requerido',
      cargando: false
    };

    this.anim_Logo = new Animated.Value(0);
    this.anim_Form = new Animated.Value(0);
    this.anim_ErrorUsername = new Animated.Value(0);
    this.anim_ErrorPassword = new Animated.Value(0);
    this.keyboardHeight = new Animated.Value(0);

    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
    this.animarInicio = this.animarInicio.bind(this);
    this.consultarLogin = this.consultarLogin.bind(this);
    this.mostrarFormulario = this.mostrarFormulario.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.login = this.login.bind(this);
    this.nuevoUsuario = this.nuevoUsuario.bind(this);
    this.recuperarCuenta = this.recuperarCuenta.bind(this);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow(event) {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
    }).start();
  }

  keyboardWillHide(event) {
    this.teclado = false;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start();
  }

  animarInicio() {
    Animated.spring(this.anim_Logo, {
      toValue: 1
    }).start(this.consultarLogin);
  }

  consultarLogin() {
    Rules_Ajustes.esIntroVista()
      .then(function (vista) {
        if (vista == false) {
          App.navegar('Introduccion', {
            callback: function () {
              this.consultarLogin();
            }.bind(this)
          });
        } else {
          Rules_Usuario.isLogin()
            .then(function (login) {
              if (login) {
                Animated.spring(this.anim_Logo, { toValue: 0 }).start(function () { App.replace('Inicio') }.bind(this));
                return;
              }

              Animated.spring(this.anim_Form, {
                toValue: 1
              }).start();

            }.bind(this))
            .catch(function (error) {
              Alert.alert('', error, [{ text: 'Reintentar', onPress: this.consultarLogin }]);
            }.bind(this));
        }
      }.bind(this))
      .catch(function () {

      }.bind(this));
  }

  mostrarFormulario() {
    Animated.timing(this.anim_Form, {
      duration: 500,
      toValue: 1
    }).start();
  }

  onUsernameChange(text) {
    this.setState({ username: text });
    Animated.timing(this.anim_ErrorUsername, { toValue: 0, duration: 300 }).start();
  }

  onPasswordChange(text) {
    this.setState({ password: text });
    Animated.timing(this.anim_ErrorPassword, { toValue: 0, duration: 300 }).start();
  }

  login() {

    //Valido el form
    let tieneUsername = this.state.username != undefined && this.state.username != "";
    let tienePassword = this.state.password != undefined && this.state.password != "";
    Animated.timing(this.anim_ErrorUsername, { toValue: tieneUsername ? 0 : 1, duration: 300 }).start();
    Animated.timing(this.anim_ErrorPassword, { toValue: tienePassword ? 0 : 1, duration: 300 }).start();

    //Si es invalido cierro
    if (tieneUsername == false || tienePassword == false) return;

    //Cierro keyboard y empiezo a animar
    Keyboard.dismiss();
    setTimeout(function () {
      //Achico el formulario
      Animated.spring(this.anim_Form, { toValue: 0 }).start(function () {
        this.setState({
          cargando: true
        }, function () {
          Rules_Usuario.login(this.state.username, this.state.password)
            .then(function () {
              Animated.spring(this.anim_Logo, { toValue: 0 })
                .start(function () {
                  App.replace('Inicio');
                }.bind(this));
            }.bind(this))
            .catch(function (error) {

              this.setState({
                cargando: false
              });

              Animated.spring(this.anim_Form, { toValue: 1 }).start();

              //Muestro el error
              Alert.alert('', error || texto_ErrorGenerico,
                [
                  {
                    text: "Aceptar",
                    onPress: function () { }
                  }
                ],
                { cancelable: true }
              );
            }.bind(this));
        }.bind(this))
      }.bind(this));
    }.bind(this), 300);
  }

  nuevoUsuario() {
    App.navegar('UsuarioNuevo');
  }

  recuperarCuenta() {
    App.navegar('RecuperarCuenta');
  }

  render() {

    return (
      <View
        style={styles.contenedor}
        onLayout={this.animarInicio}>

        <MiStatusBar />

        <WebImage
          resizeMode="cover"
          style={styles.imagenFondo}
          source={{ uri: url_ImagenFondo }}
        />

        <View style={styles.imagenFondo_Dim}></View>

        <ScrollView
          style={styles.contenedor_ScrollView}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={[styles.contenedor_ScrollViewContent, {
            minHeight: Dimensions.get('window').height - ExtraDimensions.get('STATUS_BAR_HEIGHT') - ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT')
          }]}
        >
          <View style={styles.contenedor_ScrollViewContenido}>
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
                resizeMode="cover"
                style={styles.imagenLogo}
                source={{ uri: url_ImagenLogo }}
              />

            </Animated.View>

            <Animated.View style={
              [
                styles.contenedorFormulario,
                {
                  maxHeight: this.anim_Form.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 400]
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
                  editable={!this.state.cargandoLogin}
                  onChangeText={this.onUsernameChange}
                  value={this.state.username}
                  style={styles.input}
                  label={texto_Usuario}
                  iconClass={MaterialsIcon}
                  iconName="person"
                  iconColor="black"
                  labelStyle={styles.inputLabelStyle}
                  inputStyle={styles.inputStyle}
                  useNativeDriver
                />

                <Animated.View
                  style={{
                    overflow: 'hidden',
                    opacity: this.anim_ErrorUsername,
                    maxHeight: this.anim_ErrorUsername.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 50]
                    })
                  }}>
                  <Text
                    style={styles.inputTextoError}>
                    {this.state.usernameError}
                  </Text>
                </Animated.View>

              </View>

              <View style={styles.contenedorInput}>
                <Kohana
                  ref="inputPassword"
                  editable={!this.state.cargandoLogin}
                  secureTextEntry={true}
                  value={this.state.password}
                  onChangeText={this.onPasswordChange}
                  style={styles.input}
                  label={texto_Password}
                  iconClass={MaterialsIcon}
                  iconName="vpn-key"
                  iconColor="black"
                  labelStyle={styles.inputLabelStyle}
                  inputStyle={styles.inputStyle}
                  useNativeDriver
                />

                <Animated.View
                  style={{
                    overflow: 'hidden',
                    opacity: this.anim_ErrorPassword,
                    maxHeight: this.anim_ErrorPassword.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 50]
                    })
                  }}>
                  <Text
                    style={styles.inputTextoError}>
                    {this.state.passwordError}
                  </Text>
                </Animated.View>

              </View>

              <View style={styles.contenedorBotones}>

                <View style={{ height: 16 }} />

                <Button
                  full={true}
                  rounded={true}
                  disabled={this.state.cargandoLogin}
                  style={styles.botonAcceder}
                  onPress={this.login}
                >
                  <Text style={styles.botonAccederTexto}>{texto_BotonAcceder}</Text>
                </Button>

                <Button
                  full={true}
                  transparent={true}
                  disabled={this.state.cargandoLogin}
                  onPress={this.recuperarCuenta}
                  style={styles.botonRecuperarCuenta}
                >
                  <Text style={styles.botonAccederTexto}>{texto_BotonOlvidoContraseña}</Text>
                </Button>

                <View style={{ height: 32 }} />

                <Button
                  full={false}
                  rounded={true}
                  disabled={this.state.cargandoLogin}
                  style={styles.botonNuevoUsuario}
                  onPress={this.nuevoUsuario}
                >
                  <Text style={styles.botonNuevoUsuarioTexto}>{texto_BotonCrearUsuario}</Text>
                </Button>

                <View style={{ height: 16 }} />

              </View>

            </Animated.View>
          </View>
        </ScrollView>

        <Animated.View style={[{ height: '100%' }, { maxHeight: this.keyboardHeight }]}></Animated.View>

      </View >

    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: "center",
    backgroundColor: "white",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    width: "100%"
  },
  imagenFondo: {
    height: "100%",
    position: "absolute",
    width: "100%"
  },
  imagenFondo_Dim: {
    backgroundColor: "#000000",
    height: "100%",
    opacity: 0.5,
    position: "absolute",
    width: "100%"
  },
  imagenLogo: {
    height: 104,
    marginBottom: 64,
    width: 104
  },
  botonAcceder: {
    alignSelf: "center",
    backgroundColor: "green",
    minHeight: 48,
    width: "100%"
  },
  botonAccederTexto: {
    color: "white"
  },
  botonNuevoUsuario: {
    alignSelf: "center",
    backgroundColor: "rgba(100,100,100,1)",
    minHeight: 48
  },
  botonNuevoUsuarioTexto: {
    color: "white"
  },
  botonRecuperarCuenta: {
    alignSelf: "center",
    minHeight: 48,
    width: "auto"
  },
  botonRecuperarCuentaTexto: {
    color: "white"
  },

  contenedorBotones: {
    display: "flex",
    flexDirection: "column",
    minWidth: "100%",
    width: "100%"
  },
  contenedorFormulario: {
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
    maxWidth: 300,
    width: "100%"
  },
  contenedorInput: {
    marginBottom: 16
  },
  contenedor_ScrollView: {
    width: "100%"
  },
  contenedor_ScrollViewContenido: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 32,
    paddingTop: 32,
    width: "100%"
  },
  contenedor_ScrollViewContent: {
    flexGrow: 1,
    justifyContent: "center"
  },
  input: {
    borderRadius: 50,
    height: 50,
    maxHeight: 50,
    width: "100%"
  },
  inputLabelStyle: {
    color: "black"
  },
  inputStyle: {
    color: "black",
    paddingLeft: 0
  },
  inputTextoError: {
    backgroundColor: "transparent",
    color: "red",
    marginLeft: 16,
    marginTop: 4
  }
});

const texto_Titulo = "Iniciar sesión";
const url_ImagenFondo = "https://i.imgur.com/ggQxfwB.jpg";
const url_ImagenLogo = "https://i.imgur.com/GAMvKv8.png";
const texto_Usuario = "Usuario";
const texto_UsuarioRequerido = "DatoRequerido";
const texto_Password = "Contraseña";
const texto_PasswordRequerida = "Dato requerido";
const texto_Accediendo = "Cargando...";
const texto_BotonAcceder = "Acceder";
const texto_BotonOlvidoContraseña = "¿Olvidaste tu contraseña?";
const texto_BotonCrearUsuario = "Crear usuario";
const texto_ErrorGenerico = "Error procesando la solicitud";
