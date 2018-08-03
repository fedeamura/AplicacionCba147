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
import DateTimePicker from 'react-native-modal-datetime-picker';
import autobind from 'autobind-decorator'
import Icon from 'react-native-vector-icons/MaterialIcons';


//Mis componentes
import { dateToString } from '@Utils/Helpers'
import MiInputTextValidar from '@Utils/MiInputTextValidar';

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

export default class NuevoUsuario_FormDatosPersonales extends React.Component {

  static defaultProps = {
    ...React.Component.defaultProps,
    onCargando: function () { },
    onReady: function () { },
    noValidar: false,
    datosIniciales: undefined
  }

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
      noValidar: props.noValidar,
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

  @autobind
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

  @autobind
  onNombreChange(val) {
    this.setState({
      nombre: val
    }, this.validarCampos);
  }

  @autobind
  onApellidoChange(val) {
    this.setState({
      apellido: val
    }, this.validarCampos);
  }

  @autobind
  onDniChange(val) {
    this.setState({
      dni: val
    }, this.validarCampos);
  }

  @autobind
  mostrarDatePickerFechaNacimiento() {
    Keyboard.dismiss();
    this.setState({ datePickerFechaNacimientoVisible: true })
  };

  @autobind
  ocultarDatePickerFechaNacimiento() {
    Keyboard.dismiss();
    this.setState({ datePickerFechaNacimientoVisible: false })
  };

  @autobind
  onFechaNacimiento(val) {
    this.setState({
      fechaNacimiento: val
    }, this.validarCampos);

    this.ocultarDatePickerFechaNacimiento();
  };

  @autobind
  onSexoMasculino() {
    this.setState({
      sexoMasculino: true
    }, this.validarCampos);
  }

  @autobind
  onSexoFemenino() {
    this.setState({
      sexoMasculino: false
    }, this.validarCampos);
  }

  @autobind
  mostrarCargando() {
    Animated.timing(this.animCargando, {
      toValue: 1,
      duration: 300
    }).start();

    this.setState({
      cargando: true
    });

    this.props.onCargando(true);
  }

  @autobind
  ocultarCargando() {
    Animated.timing(this.animCargando, {
      toValue: 0,
      duration: 300
    }).start();

    this.setState({
      cargando: false
    });

    this.props.onCargando(false);
  }

  @autobind
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

    let comando = {
      nombre: this.state.nombre,
      apellido: this.state.apellido,
      dni: this.state.dni,
      fechaNacimiento: dateToString(this.state.fechaNacimiento),
      sexoMasculino: this.state.sexoMasculino
    };

    if (this.state.noValidar == true) {
      if (this.props.onReady != undefined) {
        this.props.onReady(comando);
      }
      return;
    }

    Keyboard.dismiss();

    Animated.timing(this.animCargando, {
      toValue: 1,
      duration: 300
    }).start(function () {
      this.setState({
        cargando: true
      }, function () {

        Rules_Usuario.validarDatos(comando)
          .then(function (data) {
            this.props.onReady(data);
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
      });
    }.bind(this));
  }


  @autobind
  onInputNombreRef(ref) {
    this.inputNombre = ref;
  }

  @autobind
  focusInputApellido() {
    if (this.inputApellido == undefined) return;
    this.inputApellido._root.focus()
  }

  @autobind
  onInputNombreError(error) {
    this.setState({ nombreError: error }, this.validarCampos)
  }

  @autobind
  onInputApellidoRef(ref) {
    this.inputApellido = ref;
  }

  @autobind
  focusInputDni() {
    if (this.inputDni == undefined) return;
    this.inputDni._root.focus()
  }

  @autobind
  onInputApellidoError(error) {
    this.setState({ apellidoError: error }, this.validarCampos)
  }

  @autobind
  onInputDniRef(ref) {
    this.inputDni = ref;
  }

  @autobind
  onInputDniError(error) {
    this.setState({ dniError: error }, this.validarCampos)
  }

  render() {

    return (
      <View style={{}}>
        <Card style={[styles.card, { backgroundColor: '#FFFDE7', marginTop: 32 }]}>
          <CardContent style={{ display: 'flex', alignItems: 'center' }}>
            <Icon style={{ fontSize: 36, marginBottom: 8 }} name="info-outline"></Icon>
            <Text style={{ fontSize: 16, flex: 1, textAlign: 'justify' }}>{texto_InfoValida}</Text>
          </CardContent>

        </Card>

        {/* Datos de acceso */}
        <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>{texto_TituloDatosPersonales}</Text>
        <Card style={styles.card}>
          <CardContent>

            {/* Nombre */}
            <MiInputTextValidar
              onRef={this.onInputNombreRef}
              valorInicial={this.state.nombre}
              placeholder={texto_HintNombre}
              autoCapitalize="words"
              returnKeyType="done"
              autoCorrect={false}
              onSubmitEditing={this.focusInputApellido}
              keyboardType="default"
              validaciones={{ requerido: true, minLength: 2, maxLength: 70, tipo: 'nombre' }}
              onChange={this.onNombreChange}
              onError={this.onInputNombreError}
            />

            {/* Apellido */}
            <MiInputTextValidar
              onRef={this.onInputApellidoRef}
              valorInicial={this.state.apellido}
              placeholder={texto_HintApellido}
              autoCapitalize="words"
              returnKeyType="done"
              autoCorrect={false}
              keyboardType="default"
              onSubmitEditing={this.focusInputDni}
              validaciones={{ requerido: true, minLength: 2, maxLength: 70, tipo: 'nombre' }}
              onChange={this.onApellidoChange}
              onError={this.onInputApellidoError}
            />


            {/* Dni */}
            <MiInputTextValidar
              onRef={this.onInputDniRef}
              valorInicial={this.state.dni}
              placeholder={texto_HintDni}
              keyboardType="numeric"
              returnKeyType="done"
              autoCorrect={false}
              onSubmitEditing={this.mostrarDatePickerFechaNacimiento}
              validaciones={{ requerido: true, minLength: 7, maxLength: 8, tipo: 'numeroEntero' }}
              onChange={this.onDniChange}
              onError={this.onInputDniError}
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
                style={{ flex: 1, minWidth: '50%' }}
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
                borderRadius: 16,
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
            style={styles.botonRegistrar} onPress={this.validarDatos}>
            <Text>{texto_BotonValidar}</Text>
          </Button>
        </Animated.View>

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

const texto_InfoValida = "Para crearte un usuario primero tenés que validar tus datos con el registro nacional de personas. Para hacerlo completá el formulario y apreta en 'Validar datos'";
const texto_Validando = 'Validando datos personales';
const texto_Error_IngreseNombre = 'Ingrese el nombre';
const texto_Error_IngreseApellido = 'Ingrese el apellido';
const texto_Error_IngreseDni = 'Ingrese su numero de documento';
const texto_Error_IngreseFechaNacimiento = 'Ingrese la fecha de nacimiento';
const texto_Error_ReviseFormulario = 'Revise el formulario';
const texto_Error_CompleteFormulario = 'Complete el formulario';