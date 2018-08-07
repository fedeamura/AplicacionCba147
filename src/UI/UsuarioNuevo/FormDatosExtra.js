import React from "react";
import { StyleSheet, View, Keyboard, Alert } from "react-native";
import { Button, Text } from "native-base";
import { Card, CardContent } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import autobind from "autobind-decorator";

//Mis componentes
import MiInputTextValidar from "@Utils/MiInputTextValidar";

export default class NuevoUsuario_FormDatosExtra extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      completado: false,
      error: false,
      //Acceso
      username: undefined,
      usernameError: undefined,
      contraseña: undefined,
      contraseñaError: false,
      repetirContraseña: undefined,
      repetirContraseñaError: false,
      //Contracto
      email: undefined,
      emailError: false,
      telefonoFijoCaracteristica: undefined,
      telefonoFijoCaracteristicaError: false,
      telefonoFijoNumero: undefined,
      telefonoFijoNumeroError: false,
      telefonoCelularCaracteristica: undefined,
      telefonoCelularCaracteristicaError: false,
      telefonoCelularNumero: undefined,
      telefonoCelularNumeroError: false
    };
  }

  @autobind
  validarCampos() {
    let tieneContraseña = this.state.contraseña != undefined && this.state.contraseña != "";
    let tieneRepetirContraseña = this.state.repetirContraseña != undefined && this.state.repetirContraseña != "";
    let tieneEmail = this.state.email != undefined && this.state.email != "";

    let completado = tieneEmail && tieneContraseña && tieneRepetirContraseña;
    let tieneError =
      this.state.usernameError == true ||
      this.state.contraseñaError == true ||
      this.state.repetirContraseñaError == true ||
      this.state.emailError == true ||
      this.state.telefonoFijoCaracteristicaError == true ||
      this.state.telefonoFijoNumeroError == true ||
      this.state.telefonoCelularCaracteristicaError == true ||
      this.state.telefonoCelularNumeroError == true;

    this.setState({
      completado: completado,
      error: tieneError
    });
  }

  @autobind
  onUsernameChange(val) {
    this.setState(
      {
        username: val
      },
      this.validarCampos
    );
  }

  @autobind
  onContraseñaChange(val) {
    this.setState(
      {
        contraseña: val
      },
      this.validarCampos
    );
  }

  @autobind
  onRepetirContraseñaChange(val) {
    this.setState(
      {
        repetirContraseña: val
      },
      this.validarCampos
    );
  }

  @autobind
  onEmailChange(val) {
    this.setState(
      {
        email: val
      },
      this.validarCampos
    );
  }

  @autobind
  onTelefonoFijoCaracteristicaChange(val) {
    this.setState(
      {
        telefonoFijoCaracteristica: val
      },
      this.validarCampos
    );
  }

  @autobind
  onTelefonoFijoNumeroChange(val) {
    this.setState(
      {
        telefonoFijoNumero: val
      },
      this.validarCampos
    );
  }

  @autobind
  onTelefonoCelularCaracteristicaChange(val) {
    this.setState(
      {
        telefonoCelularCaracteristica: val
      },
      this.validarCampos
    );
  }

  @autobind
  onTelefonoCelularNumeroChange(val) {
    this.setState(
      {
        telefonoCelularNumero: val
      },
      this.validarCampos
    );
  }

  @autobind
  registrar() {
    Keyboard.dismiss();

    //Valido password
    if (this.state.contraseña == undefined || this.state.contraseña == "") {
      Alert.alert("", texto_Error_IngreseContraseña, [
        {
          text: "Aceptar",
          onPress: function() {
            this.inputContraseña._root.focus();
          }.bind(this)
        }
      ]);
      return;
    }

    //Valido repetir passowrd
    if (this.state.repetirContraseña == undefined || this.state.repetirContraseña == "") {
      Alert.alert("", texto_Error_IngreseRepetirContraseña, [
        {
          text: "Aceptar",
          onPress: function() {
            this.inputRepetirContraseña._root.focus();
          }.bind(this)
        }
      ]);
      return;
    }

    //Valido que coincidan las pass
    if (this.state.contraseña != this.state.repetirContraseña) {
      Alert.alert("", texto_Error_ContraseñasNoCoinciden, [
        {
          text: "Aceptar",
          onPress: function() {
            this.inputRepetirContraseña._root.focus();
          }.bind(this)
        }
      ]);
      return;
    }

    //Valido email
    if (this.state.email == undefined || this.state.email == "") {
      Alert.alert("", texto_Error_IngreseEmail, [
        {
          text: "Aceptar",
          onPress: function() {
            this.inputEmail._root.focus();
          }.bind(this)
        }
      ]);
      return;
    }

    //Valido que esten ambos campos de telefono celular si es que ingreso algunio
    let tieneTelefonoCelularCaracteristica =
      this.state.telefonoCelularCaracteristica != undefined && this.state.telefonoCelularCaracteristica != "";
    let tieneTelefonoCelularNumero =
      this.state.telefonoCelularNumero != undefined && this.state.telefonoCelularNumero != "";
    if (tieneTelefonoFijoCaracteristica == true || tieneTelefonoCelularNumero == true) {
      if ((tieneTelefonoCelularCaracteristica == true) != (tieneTelefonoCelularNumero == true)) {
        let mensaje;
        let input;
        if (tieneTelefonoCelularCaracteristica == false) {
          mensaje = texto_Error_IngreseTelefonoCelularCaracteristica;
          input = this.inputTelefonoCelularCaracteristica._root;
        } else {
          mensaje = texto_Error_IngreseTelefonoCelularNumero;
          input = this.inputTelefonoCelularNumero._root;
        }

        Alert.alert("", mensaje, [
          {
            text: "Aceptar",
            onPress: function() {
              input.focus();
            }.bind(this)
          }
        ]);
        return;
      }
    }

    //Valido que esten ambos campos de telefono fijo si es que ingreso algunio
    let tieneTelefonoFijoCaracteristica =
      this.state.telefonoFijoCaracteristica != undefined && this.state.telefonoFijoCaracteristica != "";
    let tieneTelefonoFijoNumero = this.state.telefonoFijoNumero != undefined && this.state.telefonoFijoNumero != "";
    if (tieneTelefonoFijoCaracteristica == true || tieneTelefonoFijoNumero == true) {
      if ((tieneTelefonoFijoCaracteristica == true) != (tieneTelefonoFijoNumero == true)) {
        let mensaje;
        let input;
        if (tieneTelefonoFijoCaracteristica == false) {
          mensaje = texto_Error_IngreseTelefonoFijoCaracteristica;
          input = this.inputTelefonoFijoCaracteristica._root;
        } else {
          mensaje = texto_Error_IngreseTelefonoFijoNumero;
          input = this.inputTelefonoFijoNumero._root;
        }

        Alert.alert("", mensaje, [
          {
            text: "Aceptar",
            onPress: function() {
              input.focus();
            }
          }.bind(this)
        ]);
        return;
      }
    }

    if (tieneTelefonoCelularNumero == false && tieneTelefonoFijoNumero == false) {
      Alert.alert("", texto_Error_IngreseAlgunTelefono);
      return;
    }

    if (this.state.completado == false) {
      Alert.alert("", texto_Error_CompleteElFormulario);
      return;
    }

    if (this.state.error == true) {
      Alert.alert("", texto_Error_ReviseElFormulario);
      return;
    }

    let telFijo = undefined;
    if (tieneTelefonoFijoCaracteristica == true) {
      telFijo = this.state.telefonoFijoCaracteristica + "-" + this.state.telefonoFijoNumero;
    }

    let telCel = undefined;
    if (tieneTelefonoCelularCaracteristica == true) {
      telFijo = this.state.telefonoCelularCaracteristica + "-" + this.state.telefonoCelularNumero;
    }

    if (this.props.onReady != undefined) {
      this.props.onReady({
        username: this.state.username,
        password: this.state.contraseña,
        email: this.state.email,
        telefonoFijo: telFijo,
        telefonoCelular: telCel
      });
    }
  }

  @autobind
  onInputUsernameRef(ref) {
    this.inputUsername = ref;
  }

  @autobind
  onInputUsernameError(error) {
    this.setState({ usernameError: error });
  }

  @autobind
  onInputPasswordRef(ref) {
    this.inputContraseña = ref;
  }

  @autobind
  onInputPasswordError(error) {
    this.setState({ contraseñaError: error });
  }

  @autobind
  onInputRepetirPasswordRef(ref) {
    this.inputRepetirContraseña = ref;
  }

  @autobind
  onInputRepetirPasswordError(error) {
    this.setState({ repetirContraseñaError: error });
  }

  @autobind
  onInputEmailRef(ref) {
    this.inputEmail = ref;
  }

  @autobind
  onInputEmailError(error) {
    this.emailError = error;
  }

  @autobind
  onInputTelefonoCelularCaracteristicaRef(ref) {
    this.inputTelefonoCelularCaracteristica = ref;
  }

  @autobind
  onInputTelefonoCelularCaracteristicaError(error) {
    this.setState({ telefonoCelularCaracteristicaError: error });
  }

  @autobind
  onInputTelefonoCelularNumeroRef(ref) {
    this.inputTelefonoCelularNumero = ref;
  }

  @autobind
  onInputTelefonoCelularNumeroError(error) {
    this.setState({ telefonoCelularNumeroError: error });
  }

  @autobind
  onInputTelefonoFijoCaracteristicaRef(ref) {
    this.inputTelefonoFijoCaracteristica = ref;
  }

  @autobind
  onInputTelefonoFijoCaracteristicaError(error) {
    this.setState({ telefonoFijoCaracteristicaError: error });
  }

  @autobind
  onInputTelefonoFijoNumeroRef(ref) {
    this.inputTelefonoFijoNumero = ref;
  }

  @autobind
  onInputTelefonoFijoNumeroError(error) {
    this.setState({ telefonoFijoNumeroError: error });
  }

  @autobind
  focusInputPassword() {
    if (this.state.contraseña == undefined || this.state.contraseña == "") {
      if (this.inputContraseña == undefined) return;
      this.inputContraseña._root.focus();
    } else {
      Keyboard.dismiss();
    }
  }

  @autobind
  focusInputRepetirPassword() {
    if (this.state.repetirContraseña == undefined || this.state.repetirContraseña == "") {
      if (this.inputRepetirContraseña == undefined) return;
      this.inputRepetirContraseña._root.focus();
    } else {
      Keyboard.dismiss();
    }
  }

  @autobind
  focusInputTelefonoCelularCaracteristica() {
    if (this.state.telefonoCelularCaracteristica == undefined || this.state.telefonoCelularCaracteristica == "") {
      if (this.inputTelefonoCelularCaracteristica == undefined) return;
      this.inputTelefonoCelularCaracteristica._root.focus();
    } else {
      Keyboard.dismiss();
    }
  }

  @autobind
  focusTelefonoCelularNumero() {
    if (this.state.telefonoCelularNumero == undefined || this.state.telefonoCelularNumero == "") {
      if (this.inputTelefonoCelularNumero == undefined) return;
      this.inputTelefonoCelularNumero._root.focus();
    } else {
      Keyboard.dismiss();
    }
  }

  @autobind
  focusTelefonoFijoCaracteristica() {
    if (this.state.telefonoFijoCaracteristica == undefined || this.state.telefonoFijoCaracteristica == "") {
      if (this.inputTelefonoFijoCaracteristica == undefined) return;
      this.inputTelefonoFijoCaracteristica._root.focus();
    } else {
      Keyboard.dismiss();
    }
  }

  @autobind
  focusTelefonoFijoNumero() {
    if (this.state.telefonoFijoNumero == undefined || this.state.telefonoFijoNumero == "") {
      if (this.inputTelefonoFijoNumero == undefined) return;
      this.inputTelefonoFijoNumero._root.focus();
    } else {
      Keyboard.dismiss();
    }
  }

  render() {
    const initData = global.initData;
    
    return (
      <View style={{}}>
        <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>{texto_TituloDatosAcceso}</Text>
        <Card style={styles.card}>
          <CardContent>
            <Text style={{ marginLeft: 4, fontWeight: "bold" }}>{texto_TituloUsername}</Text>
            <MiInputTextValidar
              onRef={this.onInputUsernameRef}
              placeholder={texto_TituloUsername}
              returnKeyType="done"
              autoCorrect={false}
              onSubmitEditing={this.focusInputPassword}
              keyboardType="default"
              validaciones={{ minLength: 8, maxLength: 20, tipo: "username" }}
              onChange={this.onUsernameChange}
              onError={this.onInputUsernameError}
            />

            <View style={{ display: "flex", flexDirection: "row", marginTop: 8, marginRight: 16 }}>
              <Icon
                name="information-outline"
                style={{ marginRight: 8, fontSize: 26, marginLeft: 8, color: "#f68a1e" }}
              />
              <Text style={{ fontSize: 14, flex: 1 }}>{texto_HelpUsername}</Text>
            </View>

            <View style={{ marginTop: 16 }} />
            <MiInputTextValidar
              onRef={this.onInputPasswordRef}
              placeholder={texto_HintPassword}
              returnKeyType="done"
              autoCorrect={false}
              onSubmitEditing={this.focusInputRepetirPassword}
              keyboardType="default"
              secureTextEntry={true}
              validaciones={{ requerido: true, minLength: 8, maxLength: 20 }}
              onChange={this.onContraseñaChange}
              onError={this.onInputPasswordError}
            />

            <MiInputTextValidar
              onRef={this.onInputRepetirPasswordRef}
              placeholder={texto_HintRepetirPassword}
              returnKeyType="done"
              autoCorrect={false}
              keyboardType="default"
              secureTextEntry={true}
              validaciones={{ requerido: true, minLength: 8, maxLength: 20 }}
              onChange={this.onRepetirContraseñaChange}
              onError={this.onInputRepetirPasswordError}
            />
          </CardContent>
        </Card>

        <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>{texto_TituloDatosContacto}</Text>
        <Card style={styles.card}>
          <CardContent>
            <MiInputTextValidar
              onRef={this.onInputEmailRef}
              placeholder={texto_HintEmail}
              returnKeyType="done"
              autoCorrect={false}
              onSubmitEditing={this.focusInputTelefonoCelularCaracteristica}
              keyboardType="default"
              validaciones={{ requerido: true, tipo: "email" }}
              onChange={this.onEmailChange}
              onError={this.onInputEmailError}
            />

            {/* Telefono celular */}
            <Text style={{ marginTop: 16, marginLeft: 4 }}>{texto_TituloTelefonoCelular}</Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ marginLeft: 8, marginTop: 16 }}>0</Text>
              <MiInputTextValidar
                style={{ flex: 1, marginRight: 16 }}
                onRef={this.onInputTelefonoCelularCaracteristicaRef}
                placeholder={texto_HintTelefonoCelular_Caracteristica}
                returnKeyType="done"
                autoCorrect={false}
                onSubmitEditing={this.focusTelefonoCelularNumero}
                keyboardType="numeric"
                validaciones={{
                  requerido: false,
                  minLength: 2,
                  maxLength: 5,
                  tipo: "numeroEntero",
                  mensajes: {
                    minLength: function(val) {
                      return "*";
                    }.bind(this),
                    maxLength: function(val) {
                      return "*";
                    }.bind(this),
                    tipo: "*"
                  }
                }}
                onChange={this.onTelefonoCelularCaracteristicaChange}
                onError={this.onInputTelefonoCelularCaracteristicaError}
              />
              <Text style={{ marginLeft: 8, marginTop: 16 }}>15</Text>

              <MiInputTextValidar
                style={{ flex: 3 }}
                onRef={this.onInputTelefonoCelularNumeroRef}
                placeholder={texto_hintTelefonoCelular_Numero}
                returnKeyType="done"
                autoCorrect={false}
                onSubmitEditing={this.focusTelefonoFijoCaracteristica}
                keyboardType="numeric"
                validaciones={{ requerido: false, minLength: 5, maxLength: 12, tipo: "numeroEntero" }}
                onChange={this.onTelefonoCelularNumeroChange}
                onError={this.onInputTelefonoCelularNumeroError}
              />
            </View>

            {/* Telefono Fijo */}
            <Text style={{ marginTop: 16, marginLeft: 4 }}>{texto_TituloTelefonoFijo}</Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ marginLeft: 8, marginTop: 16 }}>0</Text>
              <MiInputTextValidar
                style={{ flex: 1, marginRight: 16 }}
                onRef={this.onInputTelefonoFijoCaracteristicaRef}
                placeholder={texto_HintTelefonoFijo_Caracteristica}
                returnKeyType="done"
                autoCorrect={false}
                onSubmitEditing={this.focusTelefonoFijoNumero}
                keyboardType="numeric"
                validaciones={{
                  requerido: false,
                  minLength: 2,
                  maxLength: 5,
                  tipo: "numeroEntero",
                  mensajes: {
                    minLength: function(val) {
                      return "*";
                    }.bind(this),
                    maxLength: function(val) {
                      return "*";
                    }.bind(this),
                    tipo: "*"
                  }
                }}
                onChange={this.onTelefonoFijoCaracteristicaChange}
                onError={this.onInputTelefonoFijoCaracteristicaError}
              />

              <MiInputTextValidar
                style={{ flex: 3 }}
                onRef={this.onInputTelefonoFijoNumeroRef}
                placeholder={texto_hintTelefonoFijo_Numero}
                returnKeyType="done"
                autoCorrect={false}
                keyboardType="numeric"
                validaciones={{ requerido: false, minLength: 5, maxLength: 12, tipo: "numeroEntero" }}
                onChange={this.onTelefonoFijoNumeroChange}
                onError={this.onInputTelefonoFijoNumeroError}
              />
            </View>
          </CardContent>
        </Card>

        {/* Boton Registrar */}
        <View style={{ marginTop: 32 }}>
          <Button
            rounded
            style={[
              styles.botonRegistrar,
              {
                backgroundColor: initData.colorExito,
                shadowColor: initData.colorExito
              }
            ]}
            onPress={this.registrar}
          >
            <Text>{texto_BotonRegistrar}</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    margin: 8
  },
  botonRegistrar: {
    alignSelf: "center",
    borderRadius: 32,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 7 }
  }
});

const texto_TituloDatosAcceso = "Datos de acceso";
const texto_TituloUsername = "Nombre de Usuario";
const texto_HelpUsername =
  "Si desea puede agregar un nombre de usuario. Tenga en cuenta que ademas siempre podra acceder a su usuario con su número de CUIL";
const texto_HintPassword = "Contraseña";
const texto_HintRepetirPassword = "Repita su contraseña";

const texto_TituloDatosContacto = "Datos de contacto";
const texto_HintEmail = "E-Mail";
const texto_TituloTelefonoFijo = "Telefono Fijo";
const texto_HintTelefonoFijo_Caracteristica = "Area";
const texto_hintTelefonoFijo_Numero = "Número";
const texto_TituloTelefonoCelular = "Telefono Célular";
const texto_HintTelefonoCelular_Caracteristica = "Area";
const texto_hintTelefonoCelular_Numero = "Número";

const texto_BotonRegistrar = "Registrar";

const texto_Error_IngreseContraseña = "Ingrese la contraseña";
const texto_Error_IngreseRepetirContraseña = "Ingrese la confirmación de la contraseña";
const texto_Error_ContraseñasNoCoinciden = "Las contraseñas ingresadas no coinciden";
const texto_Error_IngreseEmail = "Ingrese el e-mail";
const texto_Error_IngreseTelefonoFijoCaracteristica = "Ingrese la característica de su teléfono fijo";
const texto_Error_IngreseTelefonoFijoNumero = "Ingrese su número fijo";
const texto_Error_IngreseTelefonoCelularCaracteristica = "Ingrese la característica de su teléfono celular";
const texto_Error_IngreseTelefonoCelularNumero = "Ingrese su número de celular";
const texto_Error_IngreseAlgunTelefono = "Ingrese al menos un teléfono de contacto";
const texto_Error_CompleteElFormulario = "Complete el formulario";
const texto_Error_ReviseElFormulario = "Revise el formulario";
