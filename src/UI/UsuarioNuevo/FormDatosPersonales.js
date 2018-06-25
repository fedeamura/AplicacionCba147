import React from "react";
import {
  StyleSheet,
  View,
  Alert,
  Animated,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import {
  Button,
  Text,
  Input,
  ListItem,
  Body,
  Spinner,
  CheckBox
} from "native-base";
import { Card, CardContent } from 'react-native-paper';
import MiInputTextValidar from '@Utils/MiInputTextValidar';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

//Mis componentes
import Rules_Usuario from "../../Rules/Rules_Usuario";

export default class NuevoUsuario_FormDatosPersonales extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      nombre: undefined,
      nombreError: undefined,
      apellido: undefined,
      apellidoError: undefined,
      dni: undefined,
      dniError: undefined,
      fechaNacimiento: undefined,
      fechaNacimientoError: undefined,
      sexoMasculino: true,
      datePickerFechaNacimientoVisible: false,

      cargando: false,
      completado: false,
      error: false
    };

    this.animCargando = new Animated.Value(0);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  validarCampos = () => {
    let tieneNombre = this.state.nombre != undefined && this.state.nombre != "";
    let tieneApellido = this.state.apellido != undefined && this.state.apellido != "";
    let tieneDni = this.state.dni != undefined && this.state.dni != "";
    let tieneFechaNacimiento = this.state.fechaNacimiento != undefined && this.state.fechaNacimiento != "";

    let completado = tieneNombre && tieneApellido && tieneDni && tieneFechaNacimiento;
    let tieneError = this.state.nombreError == true || this.state.apellidoError == true || this.state.dniError == true || this.state.fechaNacimientoError == true;
    this.setState({
      completado: completado,
      error: tieneError
    });


    if (this.props.onAlgoInsertado != undefined) {
      this.props.onAlgoInsertado(tieneNombre || tieneApellido || tieneDni || tieneFechaNacimiento);
    }
  }

  onNombreChange = (val) => {
    this.setState({
      nombre: val
    }, this.validarCampos);

    if (this.props.onChange != undefined) {
    }
  }

  onApellidoChange = (val) => {
    this.setState({
      apellido: val
    }, this.validarCampos);

    if (this.props.onChange != undefined) {
    }
  }

  onDniChange = (val) => {
    this.setState({
      dni: val
    }, this.validarCampos);

    if (this.props.onChange != undefined) {
    }
  }

  mostrarDatePickerFechaNacimiento = () => {
    this.setState({ datePickerFechaNacimientoVisible: true })
  };

  ocultarDatePickerFechaNacimiento = () => {
    this.setState({ datePickerFechaNacimientoVisible: false })
  };

  onFechaNacimiento = (val) => {
    this.setState({
      fechaNacimiento: val
    }, this.validarCampos);

    this.ocultarDatePickerFechaNacimiento();
  };

  onSexoMasculino = () => {
    this.setState({
      sexoMasculino: true
    }, this.validarCampos);
  }

  onSexoFemenino = () => {
    this.setState({
      sexoMasculino: false
    }, this.validarCampos);
  }

  validarDatos = () => {
    if (this.state.nombre == undefined || this.state.nombre == "") {
      Alert.alert('', texto_Error_IngreseNombre,
        [
          {
            text: 'Aceptar', onPress: () => {
              this.inputNombre._root.focus();
            }
          }
        ]
      );
      return;
    }

    if (this.state.apellido == undefined || this.state.apellido == "") {
      Alert.alert('', texto_Error_IngreseApellido,
        [
          {
            text: 'Aceptar', onPress: () => {
              this.inputApellido._root.focus();
            }
          }
        ]
      );
      return;
    }

    if (this.state.dni == undefined || this.state.dni == "") {
      Alert.alert('', texto_Error_IngreseDni,
        [
          {
            text: 'Aceptar', onPress: () => {
              this.inputDni._root.focus();
            }
          }
        ]
      );
      return;
    }

    if (this.state.fechaNacimiento == undefined || this.state.fechaNacimiento == "") {
      Alert.alert('', texto_Error_IngreseFechaNacimiento,
        [
          {
            text: 'Aceptar', onPress: () => {
              this.mostrarDatePickerFechaNacimiento();
            }
          }
        ]
      );
      return;
    }

    if (this.state.completado == false) {
      Alert.alert('', texto_Error_CompleteFormulario);
      return;
    }

    if (this.state.error == true) {
      Alert.alert('', texto_Error_ReviseFormulario);
      return;
    }


    let comando = {
      nombre: this.state.nombre,
      apellido: this.state.apellido,
      dni: this.state.dni,
      cuil: '2035476866',
      fechaNacimiento: this.state.fechaNacimiento,
      sexoMasculino: this.state.sexoMasculino,
      domicilioLegalFormateado: 'Independencia 710 4f, Cordoba, Cordoba, Argentina'
    };

    Animated.timing(this.animCargando, {
      toValue: 1,
      duration: 300
    }).start();
    this.setState({
      cargando: true
    }, () => {
      Rules_Usuario.validarDatos(comando)
        .then((data) => {
          if (this.props.onReady != undefined) {
            this.props.onReady(data);
          }
        })
        .catch((error) => {
          Alert.alert('', error);
          Animated.timing(this.animCargando, {
            toValue: 0,
            duration: 300
          }).start();
          this.setState({
            cargando: false
          });
        });

    });
  }

  render() {
    moment.locale('es');

    return (
      <View style={{}}>
        {/* Datos de acceso */}
        <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>{texto_TituloDatosPersonales}</Text>
        <Card style={styles.card}>
          <CardContent>

            {/* Nombre */}
            <MiInputTextValidar
              onRef={(ref) => { this.inputNombre = ref; }}
              placeholder={texto_HintNombre}
              autoCapitalize="words"
              returnKeyType="done"
              autoCorrect={false}
              onSubmitEditing={() => { this.inputApellido._root.focus() }}
              keyboardType="default"
              validaciones={{ requerido: true, minLength: 2, maxLength: 70, tipo: 'nombre' }}
              onChange={(val) => { this.onNombreChange(val); }}
              onError={(error) => { this.setState({ nombreError: error }, this.validarCampos) }}
            />

            {/* Apellido */}
            <MiInputTextValidar
              onRef={(ref) => { this.inputApellido = ref; }}
              placeholder={texto_HintApellido}
              autoCapitalize="words"
              returnKeyType="done"
              autoCorrect={false}
              keyboardType="default"
              onSubmitEditing={() => { this.inputDni._root.focus() }}
              validaciones={{ requerido: true, minLength: 2, maxLength: 70, tipo: 'nombre' }}
              onChange={(val) => { this.onApellidoChange(val); }}
              onError={(error) => { this.setState({ apellidoError: error }, this.validarCampos) }}
            />


            {/* Dni */}
            <MiInputTextValidar
              onRef={(ref) => { this.inputDni = ref; }}
              placeholder={texto_HintDni}
              keyboardType="numeric"
              returnKeyType="done"
              autoCorrect={false}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              validaciones={{ requerido: true, minLength: 7, maxLength: 8, tipo: 'numeroEntero' }}
              onChange={(val) => { this.onDniChange(val); }}
              onError={(error) => { this.setState({ dniError: error }, this.validarCampos) }}
            />

            {/* Fecha de nacimiento */}
            <TouchableWithoutFeedback
              style={{ backgroundColor: 'red', width: '100%', height: 48 }}
              onPress={this.mostrarDatePickerFechaNacimiento}
            >

              <View style={{ width: '100%' }}>
                <View pointerEvents='none' style={{ width: '100%', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' }}>

                  <Input
                    pointerEvents='none'
                    onPress={this.mostrarDatePickerFechaNacimiento}
                    placeholder={texto_HintFechaNacimiento}
                    value={this.state.fechaNacimiento == undefined ? "" : moment(this.state.fechaNacimiento).format("DD/MM/YYYY")}
                  />

                </View>

              </View>


            </TouchableWithoutFeedback>

            {/* Dialogo fecha de nacimiento */}
            <DateTimePicker
              titleIOS={texto_HintFechaNacimiento}
              confirmTextIOS="Confirmar"
              cancelTextIOS="Cancelar"
              isVisible={this.state.datePickerFechaNacimientoVisible}
              onConfirm={this.onFechaNacimiento}
              onCancel={this.ocultarDatePickerFechaNacimiento}
            />

            {/* Sexo */}
            <Text style={{ marginTop: 8, marginLeft: 8 }}>{texto_HintSexo}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', paddingLeft: 8, paddingRight: 8 }}>

              <ListItem noBorder style={{ flex: 1, minWidth: '50%', marginLeft: 0 }} onPress={this.onSexoMasculino}>
                <CheckBox checked={this.state.sexoMasculino} onPress={this.onSexoMasculino} color="green" />
                <Body>
                  <Text>{texto_HintSexo_Masculino}</Text>
                </Body>
              </ListItem>

              <ListItem noBorder style={{ flex: 1, minWidth: '50%', marginLeft: 0 }} onPress={this.onSexoFemenino}>
                <CheckBox checked={!this.state.sexoMasculino} onPress={this.onSexoFemenino} color="green" />
                <Body>
                  <Text>{texto_HintSexo_Femenino}</Text>
                </Body>
              </ListItem>
            </View>

            <Animated.View
              pointerEvents={this.state.cargando == true ? 'auto' : 'none'}
              style={{
                opacity: this.animCargando,
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Spinner color='green' />
              <Text>{texto_Validando}</Text>
            </Animated.View>
          </CardContent>
        </Card>

        {/* Boton Validar datos */}
        {
          this.state.cargando != true && (
            <View style={{ marginTop: 16 }}>
              <Button
                rounded
                style={styles.botonRegistrar} onPress={this.validarDatos}>
                <Text>{texto_BotonValidar}</Text>
              </Button>
            </View>
          )
        }

      </View >
    );
  }
}


const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    margin: 8
  },
  botonRegistrar: {
    shadowOpacity: 0.4,
    backgroundColor: 'green',
    alignSelf: 'center',
    shadowColor: 'green',
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 7 }
  }

});

const texto_TituloDatosPersonales = 'Datos personales';
const texto_HintNombre = 'Nombre';
const texto_HintApellido = 'Apellido';
const texto_HintDni = 'Nº de Documento';
const texto_HintFechaNacimiento = 'Fecha de nacimiento';
const texto_HintSexo = 'Sexo';
const texto_HintSexo_Masculino = 'Masculino';
const texto_HintSexo_Femenino = 'Femenino';
const texto_BotonValidar = 'Validar datos';

const texto_Validando = 'Validando datos personales';
const texto_Error_IngreseNombre = 'Ingrese el nombre';
const texto_Error_IngreseApellido = 'Ingrese el apellido';
const texto_Error_IngreseDni = 'Ingrese su numero de documento';
const texto_Error_IngreseFechaNacimiento = 'Ingrese la fecha de nacimiento';
const texto_Error_ReviseFormulario = 'Revise el formulario';
const texto_Error_CompleteFormulario = 'Complete el formulario';