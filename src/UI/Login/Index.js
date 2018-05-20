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
import AppTheme from "@UI/AppTheme";

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_Init from "@Rules/Rules_Init";

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
            global.initData.login.error_IniciandoSesion,
            error == undefined ? global.initData.general.error_Generico : error,
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
      App.replace('Inicio');
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
    const initData = global.initData.login;

    return (
      <View
        style={initData.styles.contenedor}
        onLayout={() => {
          this.animarLogo();
        }}>

        <StatusBar backgroundColor={initData.statusBar_BackgroundColor} barStyle={initData.statusBar_Style} />

        <WebImage
          resizeMode={initData.imagenFondo_ResizeMode}
          style={initData.styles.imagenFondo}
          source={{ uri: initData.imagenFondo_Url }}
        />

        <View style={initData.styles.imagenFondo_Dim}></View>

        <ScrollView
          style={initData.styles.contenedor_ScrollView}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={[initData.styles.contenedor_ScrollViewContent, {
            minHeight: Dimensions.get('window').height - ExtraDimensions.get('STATUS_BAR_HEIGHT') - ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT')
          }]}
        >
          <View style={initData.styles.contenedor_ScrollViewContenido}>
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
                resizeMode={initData.imagenLogo_ResizeMode}
                style={initData.styles.imagenLogo}
                source={{ uri: initData.imagenLogo_Url }}
              />

            </Animated.View>

            <Animated.View style={
              [
                initData.styles.contenedorFormulario,
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
              <View style={initData.styles.contenedorInput}>
                <Kohana
                  ref="inputUsuario"
                  editable={!this.state.cargandoLogin}
                  onChangeText={val => { this.onUsuarioChange(val); }}
                  value={this.state.usuario}
                  style={initData.styles.input}
                  label={initData.inputUsuario_Texto}
                  iconClass={MaterialsIcon}
                  iconName={initData.inputUsuario_Icono}
                  iconColor={initData.inputUsuario_IconoColor}
                  labelStyle={initData.styles.inputLabelStyle}
                  inputStyle={initData.styles.inputStyle}
                  useNativeDriver
                />

                <Text
                  style={[initData.styles.inputTextoError, { maxHeight: errorUsuarioVisible ? 20 : 0 }]}>{initData.error_UsuarioRequerido}
                </Text>
              </View>

              <View style={initData.styles.contenedorInput}>
                <Kohana
                  ref="inputPassword"
                  editable={!this.state.cargandoLogin}
                  secureTextEntry={true}
                  value={this.state.password}
                  onChangeText={val => { this.onPasswordChange(val); }}
                  style={initData.styles.input}
                  label={initData.inputPassword_Texto}
                  iconClass={MaterialsIcon}
                  iconName={initData.inputPassword_Icono}
                  iconColor={initData.inputPassword_IconoColor}
                  labelStyle={initData.styles.inputLabelStyle}
                  inputStyle={initData.styles.inputStyle}
                  useNativeDriver
                />

                <Text
                  style={[initData.styles.inputTextoError, { maxHeight: errorPasswordVisible ? 20 : 0 }]}>{initData.error_ContraseñaRequerida}
                </Text>

              </View>

              <View style={initData.styles.contenedorBotones}>

                <View style={{ height: 16 }} />

                <Button
                  full
                  rounded={initData.botonAcceder_Redondeado}
                  disabled={this.state.cargandoLogin}
                  style={initData.styles.botonAcceder}
                  onPress={() => this.login()}
                >
                  {this.state.cargandoLogin && (
                    <Spinner color={initData.botonAcceder_ColorCargando} />
                  )}

                  <Text style={initData.styles.botonAccederTexto}>{this.state.cargandoLogin ? initData.botonAcceder_TextoCargando : initData.botonAcceder_Texto}</Text>
                </Button>

                <Button
                  full
                  rounded={initData.botonRecuperarCuenta_Redondeado}
                  disabled={this.state.cargandoLogin}
                  style={initData.styles.botonRecuperarCuenta}
                >
                  <Text style={initData.styles.botonAccederTexto}>{initData.botonRecuperarCuenta_Texto}</Text>
                </Button>

                <View style={{ height: 32 }} />

                <Button
                  full
                  rounded={initData.botonNuevoUsuario_Redondeado}
                  disabled={this.state.cargandoLogin}
                  style={initData.styles.botonNuevoUsuario}
                  onPress={() => this.nuevoUsuario()}
                >
                  <Text style={initData.styles.botonNuevoUsuarioTexto}>{initData.botonNuevoUsuario_Texto}</Text>
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