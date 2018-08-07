import React from "react";
import { View, Alert, Animated, StyleSheet, ScrollView, BackHandler, Keyboard } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Spinner } from "native-base";
import { Dialog, Text, Button as ButtonPeper, DialogActions, DialogContent } from "react-native-paper";
import _ from "lodash";
import autobind from "autobind-decorator";

//Mis componentes
import App from "@UI/App";
import MiStatusBar from "@Utils/MiStatusBar";
import MiToolbar from "@Utils/MiToolbar";
import Paso from "./Paso";
import PasoServicio from "@RequerimientoNuevoPasos/PasoServicio";
import PasoDescripcion from "@RequerimientoNuevoPasos/PasoDescripcion";
import PasoUbicacion from "@RequerimientoNuevoPasos/PasoUbicacion";
import PasoFoto from "@RequerimientoNuevoPasos/PasoFoto";
import PasoConfirmacion from "@RequerimientoNuevoPasos/PasoConfirmacion";
import Resultado from "./Resultado";

import Rules_Servicio from "@Rules/Rules_Servicio";
import Rules_Requerimiento from "@Rules/Rules_Requerimiento";

export default class RequerimientoNuevo extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    title: "Nuevo requerimiento",
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      cargando: true,
      pasoActual: 1,
      servicioNombre:undefined,
      motivoNombre:undefined,
      motivoId: undefined,
      descripcion: undefined,
      ubicacion: undefined,
      foto: undefined,
      mostrarPanelResultado: false,
      registrando: false,
      numero: undefined,
      paso1Cargando: false,
      paso4Cargando: false,
      dialogoConfirmarSalidaVisible: false
    };

    this.keyboardHeight = new Animated.Value(0);

    this._didFocusSubscription = props.navigation.addListener(
      "didFocus",
      function(payload) {
        BackHandler.addEventListener("hardwareBackPress", this.back);
      }.bind(this)
    );

    this._willBlurSubscription = props.navigation.addListener(
      "willBlur",
      function(payload) {
        BackHandler.removeEventListener("hardwareBackPress", this.back);
      }.bind(this)
    );
  }

  @autobind
  back() {
    //Se esta mostrando el panel de registracion
    if (this.state.mostrarPanelResultado == true) {
      //Registrando....
      if (this.state.registrando == true) {
        return true;
      }

      //Ya registre
      const { params } = this.props.navigation.state;
      if (params.callback != undefined) {
        params.callback();
      }
      return false;
    }

    //Si no registre aun pero el form tiene algo
    const formConDatos =
      this.state.motivoId != undefined ||
      this.state.descripcion != undefined ||
      this.state.foto != undefined ||
      this.state.ubicacion != undefined;

    if (formConDatos == true) {
      this.setState({ dialogoConfirmarSalidaVisible: true });
      return true;
    }

    return false;
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener("keyboardWillShow", this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener("keyboardWillHide", this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  componentDidMount() {
    Rules_Servicio.get()
      .then(
        function(data) {
          data = _.orderBy(data, "nombre");
          this.setState({ cargando: false, servicios: data });
        }.bind(this)
      )
      .catch(function() {
        Alert.alert("", "Error procesando la solicitud");
      });
  }

  @autobind
  registrar() {
    Keyboard.dismiss();

    this.setState(
      {
        mostrarPanelResultado: true,
        registrando: true
      },
      function() {
        let comando = { param: 1 };
        Rules_Requerimiento.insertar(comando)
          .then(
            function() {
              this.setState({
                numero: "QWSTGH/2018",
                registrando: false
              });
            }.bind(this)
          )
          .catch(
            function(error) {
              Alert.alert("", error);

              this.setState({
                mostrarPanelResultado: false,
                registrando: false
              });
            }.bind(this)
          );
      }
    );
  }

  @autobind
  keyboardWillShow(event) {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height
    }).start();
  }

  @autobind
  keyboardWillHide(event) {
    this.teclado = false;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0
    }).start();
  }

  @autobind
  mostrarPaso(paso) {
    Keyboard.dismiss();

    this.setState({
      pasoActual: paso
    });
  }

  @autobind
  onPasoClick(paso) {
    Keyboard.dismiss();

    if (this.state.pasoActual == paso) {
      this.mostrarPaso(-1);
      return;
    }

    let conMotivo = this.state.motivoId != undefined;
    let conDescripcion = this.state.descripcion != undefined && this.state.descripcion.trim() != "";
    let conUbicacion = this.state.ubicacion != undefined;

    let cumple = false;
    switch (paso) {
      case 1:
        {
          cumple = true;
        }
        break;
      case 2:
        {
          cumple = conMotivo;
        }
        break;
      case 3:
        {
          cumple = conMotivo && conDescripcion;
        }
        break;
      case 4:
        {
          cumple = conMotivo && conDescripcion && conUbicacion;
        }
        break;
      case 5:
        {
          cumple = conMotivo && conDescripcion && conUbicacion;
        }
        break;
    }

    if (!cumple) {
      Alert.alert("", "Debe completar los pasos anteriores");
      return;
    }

    this.mostrarPaso(paso);
  }

  @autobind
  onBtnVerDetalleClick(id) {
    App.goBack();

    setTimeout(
      function() {
        const { params } = this.props.navigation.state;

        if (params != undefined && "verDetalleRequerimiento" in params && params.verDetalleRequerimiento != undefined) {
          params.verDetalleRequerimiento(id);
        }
      }.bind(this),
      300
    );
  }

  @autobind
  onToolbarBack() {
    if (!this.back()) {
      App.goBack();
    }
  }

  @autobind
  onPaso1Cargando(cargando) {
    this.setState({ paso1Cargando: cargando });
  }

  @autobind
  onPaso4Cargando(cargando) {
    this.setState({ paso4Cargando: cargando });
  }

  @autobind
  onMotivo(data) {
    Alert.alert('', JSON.stringify(data));
    
    this.setState({
      servicioNombre: data.servicioNombre,
      motivoNombre: data.motivoNombre,
      motivoId: data.motivoId
    });
  }

  @autobind
  onPaso1Ready() {
    this.mostrarPaso(2);
  }

  @autobind
  onDescripcion(descripcion) {
    this.setState({ descripcion: descripcion });
  }

  @autobind
  onPaso2Ready() {
    this.mostrarPaso(3);
  }

  @autobind
  onUbicacion(ubicacion) {
    this.setState({
      ubicacion: ubicacion
    });
  }

  @autobind
  onPaso3Ready() {
    this.mostrarPaso(4);
  }

  @autobind
  onFoto(foto) {
    this.setState({
      foto: foto
    });
  }

  @autobind
  onPaso4Ready() {
    this.mostrarPaso(5);
  }

  render() {
    const initData = global.initData;

    let textoUbicacion = undefined;
    if (this.state.ubicacion != undefined) {
      textoUbicacion = this.state.ubicacion.direccion;
    }
    return (
      <View style={style.contenedor}>
        <MiStatusBar />

        {/* Toolbar */}
        <MiToolbar titulo={texto_Titulo} onBackPress={this.onToolbarBack} />

        {/* Contenido */}
        <View style={[style.contenido, { backgroundColor: initData.backgroundColor }]}>
          {this.state.cargando == true ? (
            <Spinner color={initData.colorExito} />
          ) : (
            <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ padding: 16 }}>
              {/* Paso 1 - Servicio motivo */}
              <Paso
                numero={1}
                cargando={this.state.paso1Cargando}
                titulo={texto_Titulo_Servicio}
                onPress={this.onPasoClick}
                expandido={this.state.pasoActual == 1 ? true : false}
                completado={this.state.motivoId != undefined}
              >
                <PasoServicio
                  servicios={this.state.servicios}
                  onCargando={this.onPaso1Cargando}
                  onMotivo={this.onMotivo}
                  onReady={this.onPaso1Ready}
                />
              </Paso>

              {/* Paso 2 */}
              <Paso
                numero={2}
                titulo={texto_Titulo_Descripcion}
                onPress={this.onPasoClick}
                expandido={this.state.pasoActual == 2}
                completado={this.state.descripcion != undefined && this.state.descripcion.trim() != ""}
              >
                <PasoDescripcion onDescripcion={this.onDescripcion} onReady={this.onPaso2Ready} />
              </Paso>

              {/* Paso 3 */}
              <Paso
                numero={3}
                titulo={texto_Titulo_Ubicacion}
                onPress={this.onPasoClick}
                expandido={this.state.pasoActual == 3}
                completado={this.state.ubicacion != undefined}
              >
                <PasoUbicacion onUbicacion={this.onUbicacion} onReady={this.onPaso3Ready} />
              </Paso>

              {/* Paso 4 - Foto */}
              <Paso
                numero={4}
                cargando={this.state.paso4Cargando}
                titulo={texto_Titulo_Foto}
                onPress={this.onPasoClick}
                expandido={this.state.pasoActual == 4}
                completado={this.state.foto != undefined}
              >
                <PasoFoto onFoto={this.onFoto} onCargando={this.onPaso4Cargando} onReady={this.onPaso4Ready} />
              </Paso>

              {/* Paso 5 */}
              <Paso
                numero={5}
                titulo={texto_Titulo_Confirmacion}
                onPress={this.onPasoClick}
                expandido={this.state.pasoActual == 5}
                completado={false}
              >
                <PasoConfirmacion
                  servicio={this.state.servicioNombre}
                  motivo={this.state.motivoNombre}
                  descripcion={this.state.descripcion}
                  ubicacion={textoUbicacion}
                  onReady={this.registrar}
                />
              </Paso>
            </ScrollView>
          )}

          {/* Sombra del toolbar */}
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
            backgroundColor="transparent"
            style={{ left: 0, top: 0, right: 0, height: 16, position: "absolute" }}
            pointerEvents="none"
          />
        </View>

        {/* Keyboard */}
        <Animated.View style={[{ height: "100%" }, { maxHeight: this.keyboardHeight }]} />

        {/* Resultado */}
        <Resultado
          numero={this.state.numero}
          visible={this.state.mostrarPanelResultado}
          cargando={this.state.registrando}
          onPressVerDetalle={this.onBtnVerDetalleClick}
        />

        {this.renderDialogoConfirmarSalida()}
      </View>
    );
  }

  @autobind
  ocultarDialogoConfirmarSalida() {
    this.setState({ dialogoConfirmarSalidaVisible: false });
  }

  @autobind
  onConfirmarSalida() {
    this.setState(
      {
        dialogoConfirmarSalidaVisible: false
      },
      function() {
        App.goBack();
      }
    );
  }

  renderDialogoConfirmarSalida() {
    return (
      <Dialog
        style={{ borderRadius: 16 }}
        visible={this.state.dialogoConfirmarSalidaVisible}
        onDismiss={this.ocultarDialogoConfirmarSalida}
      >
        <DialogContent>
          <ScrollView style={{ maxHeight: 300, maxWidth: 400 }}>
            <Text>{texto_DialogoCancelarFormulario}</Text>
          </ScrollView>
        </DialogContent>
        <DialogActions>
          <ButtonPeper onPress={this.ocultarDialogoConfirmarSalida}>No</ButtonPeper>
          <ButtonPeper onPress={this.onConfirmarSalida}>Si</ButtonPeper>
        </DialogActions>
      </Dialog>
    );
  }
}

const style = StyleSheet.create({
  contenedor: {
    width: "100%",
    height: "100%"
  },
  contenido: {
    flex: 1
  }
});

const texto_Titulo = "Nuevo requerimiento";
const texto_Titulo_Servicio = "Motivo del requerimiento";
const texto_Titulo_Descripcion = "Descripción";
const texto_Titulo_Ubicacion = "Ubicación";
const texto_Titulo_Foto = "Foto";
const texto_Titulo_Confirmacion = "Confirmación";
const texto_DialogoCancelarFormulario = "¿Esta seguro que desea cancelar la creación del requerimiento?";
