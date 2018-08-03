import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  Animated,
  ScrollView,
  Keyboard,
} from "react-native";
import {
  Button,
  Text,
  Spinner
} from "native-base";
import {
  Card,
  CardContent
} from "react-native-paper";
import MiInputTextValidar from '@Utils/MiInputTextValidar';
import LinearGradient from 'react-native-linear-gradient';
import autobind from 'autobind-decorator'


//Mis componentes
import App from "Cordoba/src/UI/App";
import MiStatusBar from '@Utils/MiStatusBar';
import MiToolbar from '@Utils/MiToolbar';

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

export default class UsuarioRecuperarPassword extends React.Component {
  static navigationOptions = {
    title: "Recuperar cuenta",
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      username: undefined,
      usernameError: undefined,
      // email: undefined,
      // emailError: undefined,
      completado: false,
      error: true,
      cargando: false
    };

    this.keyboardHeight = new Animated.Value(0);
    this.animCargando = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  @autobind
  keyboardWillShow(event) {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
    }).start();
  }

  @autobind
  keyboardWillHide(event) {
    this.teclado = false;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start();
  }

  @autobind
  validarCampos() {
    let tieneUsername = this.state.username != undefined && this.state.username != "";
    // let tieneEmail = this.state.email != undefined && this.state.email != "";

    // let completado = tieneUsername == true && tieneEmail == true;
    let completado = tieneUsername;
    // let tieneError = this.state.usernameError == true || this.state.emailError == true;
    let tieneError = this.state.usernameError == true;

    this.setState({
      completado: completado,
      error: tieneError
    });
  }

  // @autobind
  // onUsernameChange(val) {
  //   this.setState({ username: val }, this.validarCampos);
  // }

  // @autobind
  // onEmailChange(val) {
  //   this.setState({ email: val }, this.validarCampos);
  // }

  @autobind
  recuperarCuenta() {
    if (this.state.username == undefined || this.state.username == "") {
      Alert.alert('', 'Ingrese el CUIL o Nombre de Usuario',
        [
          {
            text: 'Aceptar', onPress: () => {
              this.inputUsername._root.focus();
            }
          }
        ]
      );
      return;
    }

    // if (this.state.email == undefined || this.state.email == "") {
    //   Alert.alert('', 'Ingrese el e-mail',
    //     [
    //       {
    //         text: 'Aceptar', onPress: () => {
    //           this.inputEmail._root.focus();
    //         }
    //       }
    //     ]
    //   );
    //   return;
    // }

    if (this.state.completado == false) {
      Alert.alert('', 'Complete los datos personales');
      return;
    }

    if (this.state.error == true) {
      Alert.alert('', 'Revise los datos ingresados');
      return;
    }

    Keyboard.dismiss();

    Animated.timing(this.animCargando, { toValue: 1, duration: 300 }).start(function () {
      this.setState({
        cargando: true
      },
        function () {
          Rules_Usuario.recuperarCuenta(this.state.username, this.state.email)
            .then(function (data) {
              Animated.timing(this.animCargando, { toValue: 0, duration: 300 }).start();
              Alert.alert('', 'Se le envió un e-mail a su casilla de correo con las instrucciones para recuperar su contraseña', [
                { texto: 'Aceptar', onPress: () => { App.goBack(); } }
              ]);
            }.bind(this))
            .catch(function (error) {
              Animated.timing(this.animCargando, { toValue: 0, duration: 300 }).start();
              this.setState({ cargando: false }, () => {
                Alert.alert('', error);
              });
            }.bind(this));
        });
    }.bind(this));
  }

  @autobind
  cerrar() {
    if (this.state.cargando == true) return;

    let preguntarCerrar = (this.state.email != undefined && this.state.email != "") || (this.state.username != undefined && this.state.username != "");
    if (preguntarCerrar) {
      Alert.alert('', '¿Desea cancelar la recuperación de su contraseña?', [
        { text: 'Si', onPress: () => App.goBack() },
        { text: 'No', onPress: () => { } }
      ]);
      return
    }

    App.goBack();
  }

  @autobind
  onInputUsername(ref) {
    this.inputUsername = ref;
  }

  @autobind
  focusInputEmail() {
    if (this.inputEmail == undefined) return;
    this.inputEmail._root.focus()
  }

  @autobind
  onInputUsernameError(error) {
    this.setState({ usernameError: error }, this.validarCampos)
  }

  @autobind
  onInputUsernameChange(val) {
    this.setState({ username: val });
  }

  // @autobind
  // onInputEmailRef(ref) {
  //   this.inputEmail = ref;
  // }

  // @autobind
  // onInputEmailError(error) {
  //   this.setState({ emailError: error }, this.validarCampos)
  // }

  // @autobind
  // onInputEmailChange(val) {
  //   this.setState({ email: val });
  // }

  render() {
    const initData = global.initData;

    return (
      <View style={styles.contenedor}>

        {/* StatusBar */}
        <MiStatusBar />

        {/* Toolbar */}
        <MiToolbar titulo='Recuperar cuenta' onBackPress={this.cerrar} />

        {/* Contenido */}
        <View style={[styles.contenedor_Contenido, { backgroundColor: initData.backgroundColor }]}>
          <ScrollView keyboardShouldPersistTaps="always">
            <View style={styles.scrollViewContent}>
              <Card style={styles.card}>
                <CardContent>

                  {/* Username */}
                  <MiInputTextValidar
                    onRef={this.onInputUsername}
                    placeholder='CUIL o Nombre de Usuario'
                    autoCapitalize="words"
                    returnKeyType="done"
                    autoCorrect={false}
                    onSubmitEditing={this.focusInputEmail}
                    keyboardType="default"
                    validaciones={{ requerido: true, minLength: 2, maxLength: 70 }}
                    onChange={this.onInputUsernameChange}
                    onError={this.onInputUsernameError}
                  />

                  {/* Email */}
                  {/* <MiInputTextValidar
                    onRef={this.onInputEmailRef}
                    placeholder='E-Mail'
                    autoCapitalize="words"
                    returnKeyType="done"
                    autoCorrect={false}
                    keyboardType="default"
                    validaciones={{ requerido: true, minLength: 2, maxLength: 70, tipo: 'email' }}
                    onChange={this.onInputEmailChange}
                    onError={this.onInputEmailError}
                  /> */}

                  {/* Cargando */}
                  <Animated.View
                    pointerEvents={this.state.cargando ? 'auto' : 'none'}
                    style={[styles.contenedor_Cargando, {
                      opacity: this.animCargando
                    }]}>
                    <Spinner color="green" />
                    <Text>Cargando</Text>
                  </Animated.View>

                </CardContent>

              </Card>

              {/* Boton Validar datos */}
              <Animated.View
                pointerEvents={this.state.cargando ? 'none' : 'auto'}
                style={[{ marginTop: 16 }, {
                  opacity: this.animCargando.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0]
                  })
                }]}>
                <Button
                  rounded
                  style={styles.botonRecuperar} onPress={this.recuperarCuenta}>
                  <Text>Recuperar contraseña</Text>
                </Button>
              </Animated.View>

            </View>
          </ScrollView>

          {/* Sombra del toolbar */}
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
            backgroundColor="transparent"
            style={{ left: 0, top: 0, right: 0, height: 16, position: 'absolute' }}
            pointerEvents="none" />
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  contenedor_Contenido: {
    flex: 1
  },
  scrollViewContent: {
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16
  },
  contenedor_Cargando: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  card: {
    margin: 8,
    borderRadius: 16,
    minHeight: 130
  },
  botonRecuperar: {
    alignSelf: 'center',
    shadowColor: 'green',
    shadowRadius: 5,
    shadowOpacity: 0.4,
    backgroundColor: 'green',
    shadowOffset: { width: 0, height: 7 }
  }
});
