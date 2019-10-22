import React from "react";
import { StyleSheet, View, Alert, Animated, ScrollView, Keyboard } from "react-native";
import { Text, Spinner } from "native-base";
import MiInputTextValidar from "@Utils/MiInputTextValidar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

//Mis componentes
import App from "Cordoba/src/UI/App";
import MiStatusBar from "@Utils/MiStatusBar";
import MiToolbar from "@Utils/MiToolbar";
import MiToolbarSombra from "@Utils/MiToolbarSombra";
import MiCardDetalle from "@Utils/MiCardDetalle";

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
      completado: false,
      error: true,
      cargando: false
    };

    this.keyboardHeight = new Animated.Value(0);
    this.animCargando = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener("keyboardWillShow", this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener("keyboardWillHide", this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height
    }).start();
  }

  keyboardWillHide = (event) => {
    this.teclado = false;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0
    }).start();
  }

  validarCampos = () => {
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

  recuperarCuenta = () => {
    if (this.state.username == undefined || this.state.username == "") {
      Alert.alert("", "Ingrese el CUIL o Nombre de Usuario", [
        {
          text: "Aceptar",
          onPress: () => {
            this.inputUsername._root.focus();
          }
        }
      ]);
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
      Alert.alert("", "Complete los datos personales");
      return;
    }

    if (this.state.error == true) {
      Alert.alert("", "Revise los datos ingresados");
      return;
    }

    Keyboard.dismiss();

    Animated.timing(this.animCargando, {
      toValue: 1,
      duration: 300
    }).start(() => {
      this.setState({
        cargando: true
      }, () => {
        Rules_Usuario.recuperarCuenta(this.state.username, this.state.email)
          .then((data) => {

            Alert.alert(
              "",
              texto_RecuperacionIniciada,
              [
                {
                  text: "Aceptar",
                  onPress: () => {
                    App.goBack();
                  }
                }
              ], { cancelable: false }
            );
          })
          .catch((error) => {
            Animated.timing(this.animCargando, {
              toValue: 0,
              duration: 300
            }).start();
            this.setState({ cargando: false }, () => {
              Alert.alert("", error);
            });
          });
      }
      );
    });
  }

  cerrar = () => {
    if (this.state.cargando == true) return;
    App.goBack();
  }

  onInputUsername = (ref) => {
    this.inputUsername = ref;
  }

  focusInputEmail = () => {
    if (this.inputEmail == undefined) return;
    this.inputEmail._root.focus();
  }

  onInputUsernameError = (error) => {
    this.setState({ usernameError: error }, this.validarCampos);
  }

  onInputUsernameChange = (val) => {
    this.setState({ username: val });
  }

  render() {
    const initData = global.initData;

    const botones = [];
    botones.push({
      disabled: this.state.cargando == true || this.state.username == undefined || this.state.username == "",
      texto: 'Recuperar cuenta',
      onPress: this.recuperarCuenta
    });

    return (
      <View style={styles.contenedor}>
        {/* StatusBar */}
        <MiStatusBar />

        {/* Toolbar */}
        <MiToolbar titulo={texto_Titulo} onBackPress={this.cerrar} />

        {/* Contenido */}
        <View style={[styles.contenedor_Contenido, { backgroundColor: initData.backgroundColor }]}>
          <ScrollView keyboardShouldPersistTaps="always">
            <View style={styles.scrollViewContent}>


              <View style={{ height: 32 }} />

              <MiCardDetalle backgroundColor={initData.colorNaranja}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Icon name="information-outline" style={{
                    fontSize: 28,
                    marginRight: 8,
                    color: initData.colorNaranjaTexto
                  }} />
                  <Text style={{ color: initData.colorNaranjaTexto, fontWeight: 'bold', flex: 1 }}>Ingrese su nombre de usuario o CUIL para que le enviemos un e-mail a su casilla de correo con las instrucciones para reiniciar su contraseña</Text>
                </View>

              </MiCardDetalle>

              <View style={{ height: 32 }} />

              <MiCardDetalle botones={botones}>

                {/* Username */}
                <MiInputTextValidar
                  onRef={this.onInputUsername}
                  placeholder={texto_HintUsername}
                  autoCapitalize="words"
                  returnKeyType="done"
                  autoCorrect={false}
                  onSubmitEditing={this.focusInputEmail}
                  keyboardType="default"
                  validaciones={{
                    requerido: true,
                    minLength: 2,
                    maxLength: 70
                  }}
                  onChange={this.onInputUsernameChange}
                  onError={this.onInputUsernameError}
                />

                {/* Cargando */}
                <Animated.View
                  pointerEvents={this.state.cargando ? "auto" : "none"}
                  style={[
                    styles.contenedor_Cargando,
                    {
                      opacity: this.animCargando
                    }
                  ]}
                >
                  <Spinner color={initData.colorExito} />
                </Animated.View>

              </MiCardDetalle>

            </View>
          </ScrollView>

          {/* Sombra del toolbar */}
          <MiToolbarSombra />
        </View>
      </View>
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
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 16
  },
  card: {
    margin: 8,
    borderRadius: 16,
    minHeight: 130
  },
  botonRecuperar: {
    alignSelf: "center",
    shadowRadius: 5,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 7 }
  }
});

const texto_Titulo = "Recuperar contraseña";
const texto_HintUsername = "CUIL o Nombre de usuario";
const texto_BotonRecuperar = "Recuperar contraseña";
const texto_RecuperacionIniciada = "Se le envió un e-mail a su casilla de correo con las instrucciones para recuperar su contraseña";