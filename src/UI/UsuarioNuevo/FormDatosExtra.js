import React from "react";
import {
  StyleSheet,
  View,
  Alert
} from "react-native";
import {
  Button,
  Text,
  Input,
  Item,
} from "native-base";
import { Card, CardContent } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MiInputTextValidar from '@Utils/MiInputTextValidar';

export default class NuevoUsuario_FormDatosExtra extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      completado: false,
      error: false,
      //Acceso
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

  validarCampos = () => {
    let tieneContraseña = this.state.contraseña != undefined && this.state.contraseña != "";
    let tieneRepetirContraseña = this.state.repetirContraseña != undefined && this.state.repetirContraseña != "";
    let tieneEmail = this.state.email != undefined && this.state.email != "";

    let completado = tieneEmail && tieneContraseña && tieneRepetirContraseña;
    let tieneError =
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

  onContraseñaChange = (val) => {
    this.setState({
      contraseña: val
    }, this.validarCampos);
  }

  onRepetirContraseñaChange = (val) => {
    this.setState({
      repetirContraseña: val
    }, this.validarCampos);
  }

  onEmailChange = (val) => {
    this.setState({
      email: val
    }, this.validarCampos);
  }

  onTelefonoFijoCaracteristicaChange = (val) => {
    this.setState({
      telefonoFijoCaracteristica: val
    }, this.validarCampos);
  }

  onTelefonoFijoNumeroChange = (val) => {
    this.setState({
      telefonoFijoNumero: val
    }, this.validarCampos);
  }

  onTelefonoCelularCaracteristicaChange = (val) => {
    this.setState({
      telefonoCelularCaracteristica: val
    }, this.validarCampos);
  }

  onTelefonoCelularNumeroChange = (val) => {
    this.setState({
      telefonoCelularNumero: val
    }, this.validarCampos);
  }

  registrar = () => {
    //Valido password
    if (this.state.contraseña == undefined || this.state.contraseña == "") {
      Alert.alert('', texto_Error_IngreseContraseña, [{
        text: 'Aceptar', onPress: () => {
          this.inputContraseña._root.focus();
        }
      }]);
      return;
    }

    //Valido repetir passowrd
    if (this.state.repetirContraseña == undefined || this.state.repetirContraseña == "") {
      Alert.alert('', texto_Error_IngreseRepetirContraseña, [{
        text: 'Aceptar', onPress: () => {
          this.inputRepetirContraseña._root.focus();
        }
      }]);
      return;
    }

    //Valido que coincidan las pass
    if (this.state.contraseña != this.state.repetirContraseña) {
      Alert.alert('', texto_Error_ContraseñasNoCoinciden, [{
        text: 'Aceptar', onPress: () => {
          this.inputRepetirContraseña._root.focus();
        }
      }]);
      return;
    }

    //Valido email
    if (this.state.email == undefined || this.state.email == "") {
      Alert.alert('', texto_Error_IngreseEmail, [{
        text: 'Aceptar', onPress: () => {
          this.inputEmail._root.focus();
        }
      }]);
      return;
    }



    //Valido que esten ambos campos de telefono celular si es que ingreso algunio
    let tieneTelefonoCelularCaracteristica = this.state.telefonoCelularCaracteristica != undefined && this.state.telefonoCelularCaracteristica != "";
    let tieneTelefonoCelularNumero = this.state.telefonoCelularNumero != undefined && this.state.telefonoCelularNumero != "";
    if (tieneTelefonoFijoCaracteristica == true || tieneTelefonoCelularNumero == true) {
      if ((tieneTelefonoCelularCaracteristica == true) != (tieneTelefonoCelularNumero == true)) {
        let mensaje;
        let input;
        if (tieneTelefonoCelularCaracteristica == false) {
          mensaje = texto_Error_IngreseTelefonoCelularCaracteristica;
          input = this.inputTelefonoCelularCaracteristica._root;
        } else {
          mensaje = texto_Error_IngreseTelefonoCelularNumero
          input = this.inputTelefonoCelularNumero._root;
        }

        Alert.alert('', mensaje, [{
          text: 'Aceptar', onPress: () => {
            input.focus();
          }
        }]);
        return;
      }
    }

    //Valido que esten ambos campos de telefono fijo si es que ingreso algunio
    let tieneTelefonoFijoCaracteristica = this.state.telefonoFijoCaracteristica != undefined && this.state.telefonoFijoCaracteristica != "";
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

        Alert.alert('', mensaje, [{
          text: 'Aceptar', onPress: () => {
            input.focus();
          }
        }]);
        return;
      }
    }

    if (tieneTelefonoCelularNumero == false && tieneTelefonoFijoNumero == false) {
      Alert.alert('', texto_Error_IngreseAlgunTelefono);
      return;
    }

    if (this.state.completado == false) {
      Alert.alert('', texto_Error_CompleteElFormulario);
      return;
    }

    if (this.state.error == true) {
      Alert.alert('', texto_Error_ReviseElFormulario);
      return;
    }

    if (this.props.onReady != undefined) {
      this.props.onReady({
        password: this.state.contraseña,
        email: this.state.email,
        telefonoFijo: this.state.telefonoFijoCaracteristica + '' + this.state.telefonoFijoNumero,
        telefonoCelular: this.state.telefonoCelularCaracteristica + '' + this.state.telefonoCelularNumero,
      });
    }
  }

  render() {

    return (
      <View style={{}}>
        <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>{texto_TituloDatosAcceso}</Text>
        <Card style={styles.card}>
          <CardContent>
            <Text style={{ marginLeft: 4, fontWeight: 'bold' }}>{texto_TituloUsername}</Text>
            <Item><Input value={this.props.cuil || 'Sin datos'} disabled={true} /></Item>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 8, marginRight: 16 }}>
              <Icon name="info-outline" style={{ marginRight: 8, fontSize: 20 }} />
              <Text style={{ fontSize: 14 }}>{texto_HelpUsername}</Text>
            </View>

            <View style={{ marginTop: 16 }}></View>
            <MiInputTextValidar
              onRef={(ref) => { this.inputContraseña = ref; }}
              placeholder={texto_HintPassword}
              returnKeyType="done"
              autoCorrect={false}
              onSubmitEditing={() => { this.inputRepetirContraseña._root.focus() }}
              keyboardType="default"
              secureTextEntry={true}
              validaciones={{ requerido: true, minLength: 8, maxLength: 20 }}
              onChange={this.onContraseñaChange}
              onError={(error) => { this.setState({ contraseñaError: error }) }}
            />

            <MiInputTextValidar
              onRef={(ref) => { this.inputRepetirContraseña = ref; }}
              placeholder={texto_HintRepetirPassword}
              returnKeyType="done"
              autoCorrect={false}
              onSubmitEditing={() => { }}
              keyboardType="default"
              secureTextEntry={true}
              validaciones={{ requerido: true, minLength: 8, maxLength: 20 }}
              onChange={this.onRepetirContraseñaChange}
              onError={(error) => { this.setState({ repetirContraseñaError: error }, this.validar) }}
            />

          </CardContent>
        </Card>

        <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>{texto_TituloDatosContacto}</Text>
        <Card style={styles.card}>
          <CardContent>

            <MiInputTextValidar
              onRef={(ref) => { this.inputEmail = ref; }}
              placeholder={texto_HintEmail}
              returnKeyType="done"
              autoCorrect={false}
              onSubmitEditing={() => { this.inputTelefonoFijoCaracteristica._root.focus() }}
              keyboardType="default"
              validaciones={{ requerido: true, tipo: 'email' }}
              onChange={this.onEmailChange}
              onError={(error) => { this.setState({ emailError: error }, this.validarCampos) }}
            />

            {/* Telefono celular */}
            <Text style={{ marginTop: 16, marginLeft: 4 }}>{texto_TituloTelefonoCelular}</Text>
            <View style={{ display: 'flex', flexDirection: 'row' }}>

              <Text style={{ marginLeft: 8, marginTop: 16 }}>0</Text>
              <MiInputTextValidar
                style={{ flex: 1, marginRight: 16 }}
                onRef={(ref) => { this.inputTelefonoCelularCaracteristica = ref; }}
                placeholder={texto_HintTelefonoCelular_Caracteristica}
                returnKeyType="done"
                autoCorrect={false}
                onSubmitEditing={() => { this.inputTelefonoCelularNumero._root.focus() }}
                keyboardType="numeric"
                validaciones={{ requerido: false, minLength: 2, maxLength: 5, tipo: 'numeroEntero', mensajes: { minLength: (val) => { return '2 caracteres' } } }}
                onChange={this.onTelefonoCelularCaracteristicaChange}
                onError={(error) => { this.setState({ telefonoCelularCaracteristicaError: error }, this.validarCampos) }}
              />
              <Text style={{ marginLeft: 8, marginTop: 16 }}>15</Text>

              <MiInputTextValidar
                style={{ flex: 3 }}
                onRef={(ref) => { this.inputTelefonoCelularNumero = ref; }}
                placeholder={texto_hintTelefonoCelular_Numero}
                returnKeyType="done"
                autoCorrect={false}
                onSubmitEditing={() => { }}
                keyboardType="numeric"
                validaciones={{ requerido: false, minLength: 5, maxLength: 12, tipo: 'numeroEntero' }}
                onChange={this.onTelefonoCelularNumeroChange}
                onError={(error) => { this.setState({ telefonoCelularNumeroError: error }, this.validarCampos) }}
              />

            </View>

            {/* Telefono Fijo */}
            <Text style={{ marginTop: 16, marginLeft: 4 }}>{texto_TituloTelefonoFijo}</Text>
            <View style={{ display: 'flex', flexDirection: 'row' }}>

              <Text style={{ marginLeft: 8, marginTop: 16 }}>0</Text>
              <MiInputTextValidar
                style={{ flex: 1, marginRight: 16 }}
                onRef={(ref) => { this.inputTelefonoFijoCaracteristica = ref; }}
                placeholder={texto_HintTelefonoFijo_Caracteristica}
                returnKeyType="done"
                autoCorrect={false}
                onSubmitEditing={() => { this.inputTelefonoFijoNumero._root.focus() }}
                keyboardType="numeric"
                validaciones={{ requerido: false, minLength: 2, maxLength: 5, tipo: 'numeroEntero', mensajes: { minLength: (val) => { return '2 caracteres' } } }}
                onChange={this.onTelefonoFijoCaracteristicaChange}
                onError={(error) => { this.setState({ telefonoFijoCaracteristicaError: error }, this.validarCampos) }}
              />

              <MiInputTextValidar
                style={{ flex: 3 }}
                onRef={(ref) => { this.inputTelefonoFijoNumero = ref; }}
                placeholder={texto_hintTelefonoFijo_Numero}
                returnKeyType="done"
                autoCorrect={false}
                onSubmitEditing={() => { this.inputTelefonoCelularCaracteristica._root.focus() }}
                keyboardType="numeric"
                validaciones={{ requerido: false, minLength: 5, maxLength: 12, tipo: 'numeroEntero' }}
                onChange={this.onTelefonoFijoNumeroChange}
                onError={(error) => { this.setState({ telefonoFijoNumeroError: error }, this.validarCampos) }}
              />

            </View>

          </CardContent>
        </Card>

        {/* Boton Registrar */}
        <View style={{ marginTop: 32 }}>
          <Button rounded style={styles.botonRegistrar} onPress={this.registrar}>
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
    backgroundColor: "green",
    borderRadius: 32,
    shadowOpacity: 0.4,
    shadowColor: 'green',
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 7 }
  }
});

const texto_TituloDatosAcceso = 'Datos de acceso';
const texto_TituloUsername = 'Nombre de Usuario';
const texto_HelpUsername = 'Su nombre de usuario es su número de CUIL';
const texto_HintPassword = 'Contraseña';
const texto_HintRepetirPassword = 'Repita su contraseña';

const texto_TituloDatosContacto = 'Datos de contacto';
const texto_HintEmail = 'E-Mail';
const texto_TituloTelefonoFijo = 'Telefono Fijo';
const texto_HintTelefonoFijo_Caracteristica = 'Àrea';
const texto_hintTelefonoFijo_Numero = 'Número';
const texto_TituloTelefonoCelular = 'Telefono Célular';
const texto_HintTelefonoCelular_Caracteristica = 'Àrea';
const texto_hintTelefonoCelular_Numero = 'Número';

const texto_BotonRegistrar = 'Registrar';

const texto_Error_IngreseContraseña = 'Ingrese la contraseña';
const texto_Error_IngreseRepetirContraseña = 'Ingrese la confirmación de la contraseña';
const texto_Error_ContraseñasNoCoinciden = 'Las contraseñas ingresadas no coinciden';
const texto_Error_IngreseEmail = 'Ingrese el e-mail';
const texto_Error_IngreseTelefonoFijoCaracteristica = 'Ingrese la característica de su teléfono fijo';
const texto_Error_IngreseTelefonoFijoNumero = 'Ingrese su número fijo';
const texto_Error_IngreseTelefonoCelularCaracteristica = 'Ingrese la característica de su teléfono celular';
const texto_Error_IngreseTelefonoCelularNumero = 'Ingrese su número de celular';
const texto_Error_IngreseAlgunTelefono = 'Ingrese al menos un teléfono de contacto';
const texto_Error_CompleteElFormulario = 'Complete el formulario';
const texto_Error_ReviseElFormulario = 'Revise el formulario';


