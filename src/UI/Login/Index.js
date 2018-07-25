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

  animarInicio = () => {
    Animated.spring(this.anim_Logo, {
      toValue: 1
    }).start(this.consultarLogin);
  }

  consultarLogin = () => {
    Rules_Ajustes.esIntroVista().then((vista) => {
      if (vista == false) {
        App.navegar('Introduccion', {
          callback: () => {
            this.consultarLogin();
          }
        });
      } else {
        Rules_Usuario.isLogin()
          .then((login) => {
            if (login) {
              Animated.spring(this.anim_Logo, { toValue: 0 }).start(() => App.replace('Inicio'));
              return;
            }

            Animated.spring(this.anim_Form, {
              toValue: 1
            }).start();
          })
          .catch((error) => {
            Alert.alert('', error, [{ text: 'Reintentar', onPress: this.consultarLogin }]);
          });
      }
    }).catch(() => {

    });





  }

  mostrarFormulario = () => {
    Animated.timing(this.anim_Form, {
      duration: 500,
      toValue: 1
    }).start();
  }

  onUsernameChange = (text) => {
    this.setState({ username: text });
    Animated.timing(this.anim_ErrorUsername, { toValue: 0, duration: 300 }).start();
  }

  onPasswordChange = (text) => {
    this.setState({ password: text });
    Animated.timing(this.anim_ErrorPassword, { toValue: 0, duration: 300 }).start();
  }

  login = () => {

    //Valido el form
    let tieneUsername = this.state.username != undefined && this.state.username != "";
    let tienePassword = this.state.password != undefined && this.state.password != "";
    Animated.timing(this.anim_ErrorUsername, { toValue: tieneUsername ? 0 : 1, duration: 300 }).start();
    Animated.timing(this.anim_ErrorPassword, { toValue: tienePassword ? 0 : 1, duration: 300 }).start();

    //Si es invalido cierro
    if (tieneUsername == false || tienePassword == false) return;

    //Cierro keyboard y empiezo a animar
    Keyboard.dismiss();
    setTimeout(() => {
      //Achico el formulario
      Animated.spring(this.anim_Form, { toValue: 0 }).start((() => {
        this.setState({
          cargando: true
        }, () => {
          Rules_Usuario.login(this.state.username, this.state.password)
            .then(() => {
              Animated.spring(this.anim_Logo, { toValue: 0 }).start(() => {
                App.replace('Inicio');
              });
            })
            .catch((error) => {

              this.setState({
                cargando: false
              });

              Animated.spring(this.anim_Form, { toValue: 1 }).start();

              //Muestro el error
              Alert.alert('', error || texto_ErrorGenerico,
                [
                  {
                    text: "Aceptar",
                    onPress: () => { }
                  }
                ],
                { cancelable: true }
              );
            });
        })
      }));
    }, 300);
  }

  nuevoUsuario = () => {
    App.navegar('UsuarioNuevo');
  }

  recuperarCuenta = () => {
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
          source={require('@Resources/imagen_fondo_login.jpg')}
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
                  onChangeText={val => { this.onPasswordChange(val); }}
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
const url_ImagenFondo = "http://www.regioncentronoticias.com/wp-content/uploads/2017/08/ARCHI_3643091200x771.jpgg";
const url_ImagenLogo = "https://lh3.googleusercontent.com/0oKhFnzCvEBACju9oJs5vaqpHcTPTrJUt0ZSx20J6VelB0GBlSKKYdjVJbAxT2z2TUeG=w300-rw";
const texto_Usuario = "Usuario";
const texto_UsuarioRequerido = "DatoRequerido";
const texto_Password = "Contraseña";
const texto_PasswordRequerida = "Dato requerido";
const texto_Accediendo = "Cargando...";
const texto_BotonAcceder = "Acceder";
const texto_BotonOlvidoContraseña = "¿Olvidaste tu contraseña?";
const texto_BotonCrearUsuario = "Crear usuario";
const texto_ErrorGenerico = "Error procesando la solicitud";
