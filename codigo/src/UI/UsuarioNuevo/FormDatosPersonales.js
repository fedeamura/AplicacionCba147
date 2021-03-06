import React from "react";
import { StyleSheet, View, Alert, Animated, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Text, Input, ListItem, Body, Spinner, CheckBox } from "native-base";
import { Card, CardContent } from "react-native-paper";
import DateTimePicker from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

//Mis componentes
import { dateToString } from "@Utils/Helpers";
import MiInputTextValidar from "@Utils/MiInputTextValidar";
import MiCardDetalle from "@Utils/MiCardDetalle";

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import MiBoton from "../_Utils/MiBoton";

export default class NuevoUsuario_FormDatosPersonales extends React.Component {
  static defaultProps = {
    ...React.Component.defaultProps,
    onCargando: function () { },
    onReady: function () { },
    noValidar: false,
    datosIniciales: undefined,
    mostrarInfo: true,
    customInfo: undefined
  };

  constructor(props) {
    super(props);

    let fecha = undefined;
    if (props.datosIniciales != undefined && props.datosIniciales.fechaNacimiento != undefined) {
      try {
        fecha = new Date(
          props.datosIniciales.fechaNacimiento.split("-")[0],
          props.datosIniciales.fechaNacimiento.split("-")[1] - 1,
          props.datosIniciales.fechaNacimiento.split("-")[2].split("T")[0]
        );
      } catch (ex) { }
    }

    this.state = {
      mostrarInfo: props.mostrarInfo,
      noValidar: props.noValidar,
      nombre: props.datosIniciales != undefined ? props.datosIniciales.nombre : undefined,
      nombreError: undefined,
      apellido: props.datosIniciales != undefined ? props.datosIniciales.apellido : undefined,
      apellidoError: undefined,
      dni: props.datosIniciales != undefined ? props.datosIniciales.dni : undefined,
      dniError: undefined,
      fechaNacimiento: fecha,
      fechaNacimientoError: undefined,
      sexoMasculino: props.datosIniciales != undefined ? props.datosIniciales.sexoMasculino : true,
      datePickerFechaNacimientoVisible: false,
      cargando: false,
      completado: false,
      error: false
    };

    setTimeout(() => {
      this.validarCampos();
    }, 100);

    this.animCargando = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps) {
    if ("cargando" in nextProps) {
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

  validarCampos = () => {
    let tieneNombre = this.state.nombre != undefined && this.state.nombre != "";
    let tieneApellido = this.state.apellido != undefined && this.state.apellido != "";
    let tieneDni = this.state.dni != undefined && this.state.dni != "";
    let tieneFechaNacimiento = this.state.fechaNacimiento != undefined && this.state.fechaNacimiento != "";

    let completado = tieneNombre && tieneApellido && tieneDni && tieneFechaNacimiento;
    let tieneError =
      this.state.nombreError == true ||
      this.state.apellidoError == true ||
      this.state.dniError == true ||
      this.state.fechaNacimientoError == true;
    this.setState({
      completado: completado,
      error: tieneError
    });

    if (this.props.onAlgoInsertado != undefined) {
      this.props.onAlgoInsertado(tieneNombre || tieneApellido || tieneDni || tieneFechaNacimiento);
    }
  }

  onNombreChange = (val) => {
    this.setState(
      {
        nombre: val
      },
      this.validarCampos
    );
  }

  onApellidoChange = (val) => {
    this.setState(
      {
        apellido: val
      },
      this.validarCampos
    );
  }

  onDniChange = (val) => {
    this.setState(
      {
        dni: val
      },
      this.validarCampos
    );
  }

  mostrarDatePickerFechaNacimiento = () => {
    Keyboard.dismiss();
    this.setState({ datePickerFechaNacimientoVisible: true });
  }

  ocultarDatePickerFechaNacimiento = () => {
    Keyboard.dismiss();
    this.setState({ datePickerFechaNacimientoVisible: false });
  }

  onFechaNacimiento = (val) => {
    this.setState(
      {
        fechaNacimiento: val
      },
      this.validarCampos
    );

    this.ocultarDatePickerFechaNacimiento();
  }

  onSexoMasculino = () => {
    this.setState(
      {
        sexoMasculino: true
      },
      this.validarCampos
    );
  }

  onSexoFemenino = () => {
    this.setState(
      {
        sexoMasculino: false
      },
      this.validarCampos
    );
  }

  mostrarCargando = () => {
    Animated.timing(this.animCargando, {
      toValue: 1,
      duration: 300
    }).start();

    this.setState({
      cargando: true
    });

    this.props.onCargando(true);
  }

  ocultarCargando = () => {
    Animated.timing(this.animCargando, {
      toValue: 0,
      duration: 300
    }).start();

    this.setState({
      cargando: false
    });

    this.props.onCargando(false);
  }

  validarDatos = () => {
    Keyboard.dismiss();

    if (this.state.nombre == undefined || this.state.nombre == "") {
      Alert.alert("", texto_Error_IngreseNombre, [
        {
          text: "Aceptar",
          onPress: () => {
            this.inputNombre._root.focus();
          }
        }
      ]);
      return;
    }

    if (this.state.apellido == undefined || this.state.apellido == "") {
      Alert.alert("", texto_Error_IngreseApellido, [
        {
          text: "Aceptar",
          onPress: () => {
            this.inputApellido._root.focus();
          }
        }
      ]);
      return;
    }

    if (this.state.dni == undefined || this.state.dni == "") {
      Alert.alert("", texto_Error_IngreseDni, [
        {
          text: "Aceptar",
          onPress: () => {
            this.inputDni._root.focus();
          }
        }
      ]);
      return;
    }

    if (this.state.fechaNacimiento == undefined || this.state.fechaNacimiento == "") {
      Alert.alert("", texto_Error_IngreseFechaNacimiento, [
        {
          text: "Aceptar",
          onPress: () => {
            this.mostrarDatePickerFechaNacimiento();
          }
        }
      ]);
      return;
    }

    if (this.state.completado == false) {
      Alert.alert("", texto_Error_CompleteFormulario);
      return;
    }

    if (this.state.error == true) {
      Alert.alert("", texto_Error_ReviseFormulario);
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

    Animated.timing(this.animCargando, {
      toValue: 1,
      duration: 300
    }).start(() => {
      this.setState({
        cargando: true
      }, () => {
        Rules_Usuario.validarDatos(comando)
          .then((data) => {
            this.props.onReady(data);
          })
          .catch((error) => {
            Alert.alert("", error);

            Animated.timing(this.animCargando, {
              toValue: 0,
              duration: 300
            }).start();

            this.setState({
              cargando: false
            });
          });
      });
    });
  }

  onInputNombreRef = (ref) => {
    this.inputNombre = ref;
  }

  onInputNombreError = (error) => {
    this.setState({ nombreError: error }, this.validarCampos);
  }

  onInputApellidoRef = (ref) => {
    this.inputApellido = ref;
  }

  onInputApellidoError = (error) => {
    this.setState({ apellidoError: error }, this.validarCampos);
  }

  onInputDniRef = (ref) => {
    this.inputDni = ref;
  }

  onInputDniError = (error) => {
    this.setState({ dniError: error }, this.validarCampos);
  }

  focusInputApellido = () => {
    if (this.state.apellido == undefined || this.state.apellido == "") {
      if (this.inputApellido == undefined) return;
      this.inputApellido._root.focus();
    } else {
      Keyboard.dismiss();
    }
  }

  focusInputDni = () => {
    if (this.state.dni == undefined || this.state.dni == "") {
      if (this.inputDni == undefined) return;
      this.inputDni._root.focus();
    } else {
      Keyboard.dismiss();
    }
  }

  focusInputFechaNacimiento = () => {
    if (this.state.fechaNacimiento == undefined) {
      this.mostrarDatePickerFechaNacimiento();
    } else {
      Keyboard.dismiss();
    }
  }

  render() {
    const initData = global.initData;

    let textoInfo = texto_InfoValida;
    if (this.props.customInfo != undefined) {
      textoInfo = this.props.customInfo;
    }

    const botones = [];
    botones.push({
      disabled: this.state.cargando == true,
      texto: texto_BotonValidar,
      onPress: this.validarDatos
    });

    return (
      <View style={{}}>
        {/* Info */}
        {this.state.mostrarInfo == true && (
          <Card style={[styles.card, { backgroundColor: initData.colorNaranja, marginTop: 32 }]}>
            <CardContent style={{ display: "flex", flexDirection: "row" }}>
              <Icon style={{ fontSize: 36, marginRight: 8, color: "white" }} name="information-outline" />
              <Text style={{ fontSize: 16, flex: 1, fontWeight: "bold", color: "white" }}>{textoInfo}</Text>
            </CardContent>
          </Card>
        )}

        {/* <Button
            rounded
            style={[styles.botonRegistrar, { backgroundColor: initData.colorExito, shadowColor: initData.colorExito }]}
            onPress={this.validarDatos}
          >
            <Text>{texto_BotonValidar}</Text>
          </Button> */}

        {/* Datos de acceso */}
        <MiCardDetalle titulo={texto_TituloDatosPersonales} botones={botones}>
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
            validaciones={{ requerido: true, minLength: 2, maxLength: 70, tipo: "nombre" }}
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
            validaciones={{ requerido: true, minLength: 2, maxLength: 70, tipo: "nombre" }}
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
            onSubmitEditing={this.focusInputFechaNacimiento}
            validaciones={{ requerido: true, minLength: 7, maxLength: 8, tipo: "numeroEntero" }}
            onChange={this.onDniChange}
            onError={this.onInputDniError}
          />

          {/* Fecha de nacimiento */}
          <TouchableWithoutFeedback
            style={{ backgroundColor: "red", width: "100%", height: 48 }}
            onPress={this.mostrarDatePickerFechaNacimiento}
          >
            <View style={{ width: "100%" }}>
              <View
                pointerEvents="none"
                style={{ width: "100%", borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.1)" }}
              >
                <Input
                  pointerEvents="none"
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
            value={this.state.fechaNacimiento}
            isVisible={this.state.datePickerFechaNacimientoVisible}
            onConfirm={this.onFechaNacimiento}
            onCancel={this.ocultarDatePickerFechaNacimiento}
          />

          {/* Sexo */}
          <Text style={{ marginTop: 8, marginLeft: 8 }}>{texto_HintSexo}</Text>
          <View style={{ display: "flex", flexDirection: "column", width: "100%", paddingLeft: 8, paddingRight: 8 }}>
            <ListItem noBorder style={{ flex: 1, minWidth: "50%" }} onPress={this.onSexoMasculino}>
              <CheckBox
                checked={this.state.sexoMasculino == true}
                onPress={this.onSexoMasculino}
                color={initData.colorExito}
              />
              <Body>
                <Text>{texto_HintSexo_Masculino}</Text>
              </Body>
            </ListItem>

            <ListItem noBorder style={{ flex: 1, minWidth: "50%" }} onPress={this.onSexoFemenino}>
              <CheckBox
                checked={this.state.sexoMasculino == false}
                onPress={this.onSexoFemenino}
                color={initData.colorExito}
              />
              <Body>
                <Text>{texto_HintSexo_Femenino}</Text>
              </Body>
            </ListItem>
          </View>

          <Animated.View
            pointerEvents={this.state.cargando == true ? "auto" : "none"}
            style={{
              opacity: this.animCargando,
              position: "absolute",
              borderRadius: 16,
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Spinner color={initData.colorExito} />
            <Text>{texto_Validando}</Text>
          </Animated.View>
        </MiCardDetalle>
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
    shadowOpacity: 0.4,
    alignSelf: "center",
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 7 }
  }
});

const texto_TituloDatosPersonales = "Datos personales";
const texto_HintNombre = "Nombre";
const texto_HintApellido = "Apellido";
const texto_HintDni = "Nº de Documento";
const texto_HintFechaNacimiento = "Fecha de nacimiento";
const texto_HintSexo = "Sexo";
const texto_HintSexo_Masculino = "Masculino";
const texto_HintSexo_Femenino = "Femenino";
const texto_BotonValidar = "Validar datos";

const texto_InfoValida =
  "Para crear un nuevo usuario se debe completar el siguiente formulario con su información personal, la cual será validada mediante el Registro Nacional de Personas.";
const texto_Validando = "Validando datos personales";
const texto_Error_IngreseNombre = "Ingrese el nombre";
const texto_Error_IngreseApellido = "Ingrese el apellido";
const texto_Error_IngreseDni = "Ingrese su numero de documento";
const texto_Error_IngreseFechaNacimiento = "Ingrese la fecha de nacimiento";
const texto_Error_ReviseFormulario = "Revise el formulario";
const texto_Error_CompleteFormulario = "Complete el formulario";
