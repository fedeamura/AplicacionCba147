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
import { dateToString } from '@Utils/Helpers'

//Mis componentes
import Rules_Usuario from "../../Rules/Rules_Usuario";

export default class NuevoUsuario_FormDatosPersonales extends React.Component {

  constructor(props) {
    super(props);

    let fecha = undefined;
    if (props.datosIniciales != undefined) {

      fecha = new Date(
        props.datosIniciales.FechaNacimiento.split('/')[2],
        props.datosIniciales.FechaNacimiento.split('/')[1] - 1,
        props.datosIniciales.FechaNacimiento.split('/')[0]
      );
    }

    this.state = {
      noValidar: props.noValidar || false,
      nombre: props.datosIniciales != undefined ? props.datosIniciales.Nombre : undefined,
      nombreError: undefined,
      apellido: props.datosIniciales != undefined ? props.datosIniciales.Apellido : undefined,
      apellidoError: undefined,
      dni: props.datosIniciales != undefined ? props.datosIniciales.Dni : undefined,
      dniError: undefined,
      fechaNacimiento: fecha,
      fechaNacimientoError: undefined,
      sexoMasculino: props.datosIniciales != undefined ? props.datosIniciales.SexoMasculino : true,
      datePickerFechaNacimientoVisible: false,
      cargando: false,
      completado: false,
      error: false
    };


    setTimeout(function () {
      this.validarCampos();
    }.bind(this), 100);

    this.animCargando = new Animated.Value(0);

    this.validarCampos = this.validarCampos.bind(this);
    this.onNombreChange = this.onNombreChange.bind(this);
    this.onApellidoChange = this.onApellidoChange.bind(this);
    this.onDniChange = this.onDniChange.bind(this);
    this.mostrarDatePickerFechaNacimiento = this.mostrarDatePickerFechaNacimiento.bind(this);
    this.ocultarDatePickerFechaNacimiento = this.ocultarDatePickerFechaNacimiento.bind(this);
    this.onFechaNacimiento = this.onFechaNacimiento.bind(this);
    this.onSexoMasculino = this.onSexoMasculino.bind(this);
    this.onSexoFemenino = this.onSexoFemenino.bind(this);
    this.mostrarCargando = this.mostrarCargando.bind(this);
    this.ocultarCargando = this.ocultarCargando.bind(this);
    this.validarDatos = this.validarDatos.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ('cargando' in nextProps) {
      if (nextProps.cargando == true) {
        this.mostrarCargando();
      } else {
        this.ocultarCargando();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) != JSON.stringify(this.state);
  }

  validarCampos() {
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

  onNombreChange(val) {
    this.setState({
      nombre: val
    }, this.validarCampos);
  }

  onApellidoChange(val) {
    this.setState({
      apellido: val
    }, this.validarCampos);
  }

  onDniChange(val) {
    this.setState({
      dni: val
    }, this.validarCampos);
  }

  mostrarDatePickerFechaNacimiento() {
    this.setState({ datePickerFechaNacimientoVisible: true })
  };

  ocultarDatePickerFechaNacimiento() {
    this.setState({ datePickerFechaNacimientoVisible: false })
  };

  onFechaNacimiento(val) {
    this.setState({
      fechaNacimiento: val
    }, this.validarCampos);

    this.ocultarDatePickerFechaNacimiento();
  };

  onSexoMasculino() {
    this.setState({
      sexoMasculino: true
    }, this.validarCampos);
  }

  onSexoFemenino() {
    this.setState({
      sexoMasculino: false
    }, this.validarCampos);
  }

  mostrarCargando() {
    Animated.timing(this.animCargando, {
      toValue: 1,
      duration: 300
    }).start();

    this.setState({
      cargando: true
    });
  }

  ocultarCargando() {
    Animated.timing(this.animCargando, {
      toValue: 0,
      duration: 300
    }).start();

    this.setState({
      cargando: false
    });
  }

  validarDatos() {
    if (this.state.nombre == undefined || this.state.nombre == "") {
      Alert.alert('', texto_Error_IngreseNombre,
        [
          {
            text: 'Aceptar',
            onPress: function () {
              this.inputNombre._root.focus();
            }.bind(this)
          }
        ]
      );
      return;
    }

    if (this.state.apellido == undefined || this.state.apellido == "") {
      Alert.alert('', texto_Error_IngreseApellido,
        [
          {
            text: 'Aceptar',
            onPress: function () {
              this.inputApellido._root.focus();
            }.bind(this)
          }
        ]
      );
      return;
    }

    if (this.state.dni == undefined || this.state.dni == "") {
      Alert.alert('', texto_Error_IngreseDni,
        [
          {
            text: 'Aceptar',
            onPress: function () {
              this.inputDni._root.focus();
            }.bind(this)
          }
        ]
      );
      return;
    }

    if (this.state.fechaNacimiento == undefined || this.state.fechaNacimiento == "") {
      Alert.alert('', texto_Error_IngreseFechaNacimiento,
        [
          {
            text: 'Aceptar',
            onPress: function () {
              this.mostrarDatePickerFechaNacimiento();
            }.bind(this)
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


    let data = {
      Nombre: this.state.nombre,
      Apellido: this.state.apellido,
      Dni: this.state.dni,
      SexoMasculino: this.state.sexoMasculino,
      fechaNacimiento: this.state.fechaNacimiento
    };

    if (this.state.noValidar == true) {
      if (this.props.onReady != undefined) {
        this.props.onReady(data);
      }
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

    Keyboard.dismiss();

    Animated.timing(this.animCargando, {
      toValue: 1,
      duration: 300
    }).start();

    this.setState({
      cargando: true
    }, function () {
      Rules_Usuario.validarDatos(comando)
        .then(function (data) {
          if (this.props.onReady != undefined) {
            this.props.onReady(data);
          }
        }.bind(this))
        .catch(function (error) {
          Alert.alert('', error);

          Animated.timing(this.animCargando, {
            toValue: 0,
            duration: 300
          }).start();

          this.setState({
            cargando: false
          });
        }.bind(this));

    }.bind(this));
  }


  render() {

    return (
      <View style={{}}>
        {/* Datos de acceso */}
        <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>{texto_TituloDatosPersonales}</Text>
        <Card style={styles.card}>
          <CardContent>

            {/* Nombre */}
            <MiInputTextValidar
              onRef={function (ref) { this.inputNombre = ref; }.bind(this)}
              valorInicial={this.state.nombre}
              placeholder={texto_HintNombre}
              autoCapitalize="words"
              returnKeyType="done"
              autoCorrect={false}
              onSubmitEditing={function () { this.inputApellido._root.focus() }.bind(this)}
              keyboardType="default"
              validaciones={{ requerido: true, minLength: 2, maxLength: 70, tipo: 'nombre' }}
              onChange={this.onNombreChange}
              onError={function (error) { this.setState({ nombreError: error }, this.validarCampos) }.bind(this)}
            />

            {/* Apellido */}
            <MiInputTextValidar
              onRef={function (ref) { this.inputApellido = ref; }.bind(this)}
              valorInicial={this.state.apellido}
              placeholder={texto_HintApellido}
              autoCapitalize="words"
              returnKeyType="done"
              autoCorrect={false}
              keyboardType="default"
              onSubmitEditing={function () { this.inputDni._root.focus() }.bind(this)}
              validaciones={{ requerido: true, minLength: 2, maxLength: 70, tipo: 'nombre' }}
              onChange={this.onApellidoChange}
              onError={function (error) { this.setState({ apellidoError: error }, this.validarCampos) }.bind(this)}
            />


            {/* Dni */}
            <MiInputTextValidar
              onRef={function (ref) { this.inputDni = ref; }.bind(this)}
              valorInicial={this.state.dni}
              placeholder={texto_HintDni}
              keyboardType="numeric"
              returnKeyType="done"
              autoCorrect={false}
              onSubmitEditing={function () {
                Keyboard.dismiss();
              }.bind(this)}
              validaciones={{ requerido: true, minLength: 7, maxLength: 8, tipo: 'numeroEntero' }}
              onChange={this.onDniChange}
              onError={function (error) { this.setState({ dniError: error }, this.validarCampos) }.bind(this)}
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
                    value={this.state.fechaNacimiento == undefined ? "" : dateToString(this.state.fechaNacimiento)}
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
            <View style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingLeft: 8, paddingRight: 8 }}>

              <ListItem
                noBorder
                style={{ flex: 1, minWidth: '50%'}}
                onPress={this.onSexoMasculino}>
                <CheckBox checked={this.state.sexoMasculino == true} onPress={this.onSexoMasculino} color="green" />
                <Body>
                  <Text>{texto_HintSexo_Masculino}</Text>
                </Body>
              </ListItem>

              <ListItem
                noBorder
                style={{ flex: 1, minWidth: '50%' }}
                onPress={this.onSexoFemenino}>
                <CheckBox checked={this.state.sexoMasculino == false} onPress={this.onSexoFemenino} color="green" />
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