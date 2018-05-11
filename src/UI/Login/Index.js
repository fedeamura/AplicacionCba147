import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  UIManager,
  Alert,
  Animated,
  StatusBar,
  ScrollView,
  Keyboard,
  Dimensions
} from "react-native";
import {
  Container,
  Button,
  Text,
  Input,
  Item,
  Icon,
  Spinner,
  Content
} from "native-base";
import ExtraDimensions from 'react-native-extra-dimensions-android';
import WebImage from 'react-native-web-image'
import MaterialsIcon from "react-native-vector-icons/MaterialIcons";
import { Kohana } from "react-native-textinput-effects";

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "Cordoba/src/UI/App";
import { AppTheme } from "@UI/AppTheme";

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";
import Rules_Init from "../../Rules/Rules_Init";

export default class Login extends React.Component {
  static navigationOptions = {
    title: "Iniciar Sesion",
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      escribioUsuario: false,
      usuario: "",
      escribioPassword: false,
      password: "",
      cargandoLogin: false
    };

    this.anim_Logo = new Animated.Value(0);
    this.anim_Form = new Animated.Value(0);
    this.keyboardHeight = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }


  keyboardWillShow = (event) => {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
    }).start();
  }

  keyboardWillHide = (event) => {
    this.teclado = false;


    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start();
  }

  animarLogo() {
    Animated.spring(this.anim_Logo, {
      toValue: 1
    }).start(() => {
      this.consultarLogin();
    });
  }

  consultarLogin() {
    this.setState({
      error: undefined
    }, () => {
      Rules_Usuario.isLogin()
        .then((login) => {
          if (login) {
            this.entrar();
            return;
          }

          Animated.spring(this.anim_Form, {
            toValue: 1
          }).start();
        })
        .catch((error) => {
          this.setState({
            error: 'Oops... algo salió mal al intentar iniciar sesión'
          });
        });
    });
  }

  mostrarFormulario() {
    Animated.timing(this.anim_Form, {
      duration: 500,
      toValue: 1
    }).start();
  }

  login() {
    this.setState({
      error: undefined
    });

    if (this.state.usuario == "") {
      App.animar();
      this.setState({
        escribioUsuario: true,
        escribioPassword: true
      }, () => {
        // this.refs.inputUsuario.bounce(800);
        this.refs.inputUsuario.focus();
      });
      return;
    }

    if (this.state.password == "") {
      App.animar();
      this.setState({
        escribioUsuario: true,
        escribioPassword: true
      }, () => {
        this.refs.inputPassword.focus();
      });

      return;
    }


    //Logeo
    App.animar();
    this.setState({
      cargandoLogin: true
    }, () => {
      Rules_Usuario.login(
        this.state.usuario,
        this.state.password
      )
        .then(() => {
          this.entrar();
        })
        .catch((error) => {

          App.animar();
          this.setState({
            cargandoLogin: false
          });

          //Muestro el error
          Alert.alert(
            global.InitData.IniciarSesion.Texto_TituloErrorIniciandoSesion,
            error == undefined ? global.InitData.General.Texto_ErrorGenerico : error,
            [
              {
                text: "Aceptar",
                onPress: () => { }
              }
            ],
            { cancelable: true }
          );
        });
    });

  }

  entrar() {
    Animated.sequence([
      Animated.spring(this.anim_Form, {
        toValue: 0
      }),
      Animated.spring(this.anim_Logo, {
        toValue: 0
      })
    ]).start(() => {
      App.replace('Home');
    });
  }

  nuevoUsuario() {
    App.navegar('UsuarioNuevo');
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

    var errorUsuarioVisible = this.state.usuario == "" && this.state.escribioUsuario;
    var errorPasswordVisible = this.state.password == "" && this.state.escribioPassword;

    return (
      <View
        style={styles.contenedor}
        onLayout={() => {
          this.animarLogo();
        }}>

        <WebImage
          resizeMode="cover"
          style={styles.imagenFondo}
          source={{ uri: global.InitData.IniciarSesion.Url_ImagenFondo }}
        />

        <View style={styles.imageFondo_Dim}></View>

        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps={true}
          contentContainerStyle={styles.contentScrollView}
        >
          <View style={styles.contenidoScroll}>
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
                source={{ uri: global.InitData.IniciarSesion.Url_ImagenLogo }}
              />


            </Animated.View>

            <Animated.View style={
              [
                styles.contenedorFormulario,
                {
                  maxHeight: this.anim_Form.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 370]
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
                    backgroundColor: 'transparent',
                    marginTop: 4
                  }}>{global.InitData.General.Texto_DatoRequerido}</Text>
              </View>

              <View style={styles.contenedorInput}>
                <Kohana
                  ref="inputPassword"
                  editable={!this.state.cargandoLogin}
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
                    backgroundColor: 'transparent',
                    marginTop: 4
                  }}>{global.InitData.General.Texto_DatoRequerido}</Text>
              </View>

              <View style={styles.contenedorBotones}>

                <View style={{ height: 16 }} />

                <Button
                  full
                  rounded
                  disabled={this.state.cargandoLogin}
                  style={styles.btnAcceder}
                  onPress={() => this.login()}
                >
                  {this.state.cargandoLogin && (
                    <Spinner color="white" />
                  )}

                  <Text>{this.state.cargandoLogin ? global.InitData.IniciarSesion.Texto_BotonIniciarSesionCargando : global.InitData.IniciarSesion.Texto_BotonIniciarSesion}</Text>
                </Button>

                <Button
                  transparent
                  disabled={this.state.cargandoLogin}
                  color="black"
                  style={styles.btnRecuperarCuenta}
                >
                  <Text style={{ color: 'white' }}>{global.InitData.IniciarSesion.Texto_BotonRecuperarContraseña}</Text>
                </Button>


                <View style={{ height: 32 }} />
                <Button
                  rounded
                  disabled={this.state.cargandoLogin}
                  style={styles.btnNuevoUsuario}
                  onPress={() => this.nuevoUsuario()}
                >
                  <Text>{global.InitData.IniciarSesion.Texto_BotonNuevoUsuario}</Text>
                </Button>


              </View>

            </Animated.View>
          </View>
        </ScrollView>

        <Animated.View style={[styles.contenedorKeyboard, { maxHeight: this.keyboardHeight }]}></Animated.View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  imagenFondo: {
    position: "absolute",
    width: '100%',
    height: '100%'
  },
  imageFondo_Dim: {
    position: "absolute",
    width: '100%',
    height: '100%',
    opacity: 0.5,
    backgroundColor: '#000000'
  },
  contenedor: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: global.styles.login_colorFondo,
  },
  scrollView: {
    width: '100%'
  },
  contentScrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: Dimensions.get('window').height - ExtraDimensions.get('STATUS_BAR_HEIGHT') - ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT')
  },
  contenidoScroll: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32
  },
  contenedorInterior: {
    flexDirection: "column",
    alignItems: "center"
  },
  contenedorFormulario: {
    height: '100%',
    width: '100%',
    maxWidth: 300,
    flexDirection: "column",
    alignItems: "center"
  },

  contenedorInput: {
    marginBottom: 16
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
    minWidth: '100%',
    flexDirection: 'column'
  },
  btnAcceder: {
    minHeight: 48,
    backgroundColor: global.styles.colorAccent
  },
  btnRecuperarCuenta: {
    alignSelf: 'center'
  },
  btnNuevoUsuario: {
    minHeight: 48,
    alignSelf: 'center'
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
  },
  contenedorKeyboard: {
    height: '100%'
  },
  contenedorError: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoMensajeError: {
    textAlign: 'center'
  },
  btnReintentar: {
    marginTop: 16,
    alignSelf: 'center',
    backgroundColor: global.styles.colorAccent
  }
});
