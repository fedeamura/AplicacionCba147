import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  Animated,
  StatusBar,
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


//Mis componentes
import App from "Cordoba/src/UI/App";
import MiStatusBar from '@Utils/MiStatusBar';
import MiToolbar from '@Utils/MiToolbar';

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

export default class Index extends React.Component {
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
      email: undefined,
      emailError: undefined,
      completado: false,
      error: true,
      cargando: false
    };

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

  validarCampos = () => {
    let tieneUsername = this.state.username != undefined && this.state.username != "";
    let tieneEmail = this.state.email != undefined && this.state.email != "";

    let completado = tieneUsername == true && tieneEmail == true;
    let tieneError = this.state.usernameError == true || this.state.emailError == true;

    this.setState({
      completado: completado,
      error: tieneError
    });
  }

  onUsernameChange = (val) => {
    this.setState({ username: val }, this.validarCampos);
  }

  onEmailChange = (val) => {
    this.setState({ email: val }, this.validarCampos);
  }

  recuperarCuenta = () => {
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

    if (this.state.email == undefined || this.state.email == "") {
      Alert.alert('', 'Ingrese el e-mail',
        [
          {
            text: 'Aceptar', onPress: () => {
              this.inputEmail._root.focus();
            }
          }
        ]
      );
      return;
    }

    if (this.state.completado == false) {
      Alert.alert('', 'Complete los datos personales');
      return;
    }

    if (this.state.error == true) {
      Alert.alert('', 'Revise los datos ingresados');
      return;
    }


    this.setState({
      cargando: true
    }, () => {
      Rules_Usuario.recuperarCuenta(this.state.username, this.state.email)
        .then((data) => {
          Alert.alert('', 'Se envió un e-mail a ' + this.state.email + ' con las instrucciones para recuperar tu contraseña', [
            { texto: 'Aceptar', onPress: () => { App.goBack(); } }
          ]);
        })
        .catch((error) => {
          this.setState({ cargando: false }, () => {
            Alert.alert('', error);
          });
        })
    });

  }

  cerrar = () => {
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
                    onRef={(ref) => { this.inputUsername = ref; }}
                    placeholder='CUIL o Nombre de Usuario'
                    autoCapitalize="words"
                    returnKeyType="done"
                    autoCorrect={false}
                    onSubmitEditing={() => { this.inputEmail._root.focus() }}
                    keyboardType="default"
                    validaciones={{ requerido: true, minLength: 2, maxLength: 70 }}
                    onChange={(val) => { this.onUsernameChange(val); }}
                    onError={(error) => {
                      this.setState({ usernameError: error }, this.validarCampos)
                    }}
                  />

                  {/* Email */}
                  <MiInputTextValidar
                    onRef={(ref) => { this.inputEmail = ref; }}
                    placeholder='E-Mail'
                    autoCapitalize="words"
                    returnKeyType="done"
                    autoCorrect={false}
                    onSubmitEditing={() => { }}
                    keyboardType="default"
                    validaciones={{ requerido: true, minLength: 2, maxLength: 70, tipo: 'email' }}
                    onChange={(val) => { this.onEmailChange(val); }}
                    onError={(error) => {
                      this.setState({ emailError: error }, this.validarCampos)
                    }}
                  />

                  {this.state.cargando == true && (
                    <View style={styles.contenedor_Cargando}>
                      <Spinner color="green" />
                      <Text>Cargando</Text>
                    </View>
                  )}

                </CardContent>

              </Card>

              {/* Boton Validar datos */}
              {this.state.cargando != true && (
                <View style={{ marginTop: 16 }}>
                  <Button
                    rounded
                    style={styles.botonRecuperar} onPress={this.recuperarCuenta}>
                    <Text>Recuperar contraseña</Text>
                  </Button>
                </View>
              )}

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
    padding: 16
  },
  card: {
    margin: 8,
    borderRadius: 16
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
