import React from "react";
import { View, Alert, Animated, StyleSheet, ScrollView, BackHandler, Keyboard } from "react-native";
import { Spinner } from "native-base";
import { Dialog, Text, Button as ButtonPeper, DialogActions, DialogContent } from "react-native-paper";
import _ from "lodash";

//Mis componentes
import App from "@UI/App";
import MiStatusBar from "@Utils/MiStatusBar";
import MiToolbar from "@Utils/MiToolbar";
import MiToolbarSombra from '@Utils/MiToolbarSombra';
import Paso from "./Paso";
import { toTitleCase } from "@Utils/Helpers";
import MiBoton from "@Utils/MiBoton";
import MiDialogo from "@Utils/MiDialogo"

import PasoServicio from "@RequerimientoNuevoPasos/PasoServicio";
import PasoUbicacion from "@RequerimientoNuevoPasos/PasoUbicacion";
import PasoConfirmacion from "@RequerimientoNuevoPasos/PasoConfirmacion";

import PasoFoto from "@RequerimientoNuevoPasos/PasoFoto";
import Resultado from "./Resultado";

//Mis rules
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
      servicioNombre: undefined,
      motivoNombre: undefined,
      motivoId: undefined,
      descripcion: undefined,
      ubicacion: undefined,
      foto: undefined,
      mostrarPanelResultado: false,
      registrando: false,
      numero: undefined,
      paso1Cargando: false,
      paso3Cargando: false,
      dialogoConfirmarSalidaVisible: false,
      dialogoConfirmacionVisible: false
    };

    this.keyboardHeight = new Animated.Value(0);

    this._didFocusSubscription = props.navigation.addListener(
      "didFocus", (payload) => {
        BackHandler.addEventListener("hardwareBackPress", this.back);
      }
    );

    this._willBlurSubscription = props.navigation.addListener(
      "willBlur", (payload) => {
        BackHandler.removeEventListener("hardwareBackPress", this.back);
      }
    );
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
    if (global.servicios != undefined) {
      this.onServicios(global.servicios);
      return;
    }

    Rules_Servicio.get()
      .then(
        function (data) {
          this.onServicios(data);
        }.bind(this)
      )
      .catch(function () {
        Alert.alert("", "Error procesando la solicitud");
      });
  }

  back = () => {
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

  onServicios = (data) => {
    global.servicios = data;
    data = _.orderBy(data, "nombre");
    this.setState({
      cargando: false,
      servicios: data
    });
  }

  registrar = () => {
    const initData = global.initData;

    Keyboard.dismiss();

    this.setState({
      mostrarPanelResultado: true,
      registrando: true
    }, () => {
      let comando = {
        autenticacion: {
          keyValidacionReCaptcha: initData.keyValidacionReCaptcha,
          origenAlias: initData.origenAlias,
          origenKey: initData.origenKey
        },
        idMotivo: this.state.motivoId,
        descripcion: this.state.descripcion,
        domicilio: {
          direccion: this.state.ubicacion.direccion,
          observaciones: this.state.ubicacion.observaciones,
          latitud: parseFloat(this.state.ubicacion.latitud.replace(",", ".")),
          longitud: parseFloat(this.state.ubicacion.longitud.replace(",", "."))
        },
        imagen: this.state.foto
      };

      Rules_Requerimiento.insertar(comando)
        .then((data) => {

          Rules_Requerimiento.enviarComprobante(data.id)
            .then(() => {

            })
            .catch(() => {

            });

          this.setState({
            id: data.id,
            numero: data.numero + "/" + data.año,
            registrando: false
          });
        })
        .catch((error) => {
          Alert.alert("", error);

          this.setState({
            mostrarPanelResultado: false,
            registrando: false
          });
        });
    });
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

  mostrarPaso = (paso) => {
    Keyboard.dismiss();

    this.setState({
      pasoActual: paso
    });
  }

  onPasoClick = (paso) => {
    Keyboard.dismiss();

    if (this.state.pasoActual == paso) {
      this.mostrarPaso(-1);
      return;
    }

    let conMotivo = this.state.motivoId != undefined;
    let conDescripcion = this.state.descripcion != undefined && this.state.descripcion.trim().length >= 20;
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
          cumple = conMotivo && conDescripcion;
        }
        break;
      case 3:
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

  onBtnVerDetalleClick = () => {
    App.goBack();

    setTimeout(() => {
      const { params } = this.props.navigation.state;

      if (params != undefined && "verDetalleRequerimiento" in params && params.verDetalleRequerimiento != undefined) {
        params.verDetalleRequerimiento({ id: this.state.id });
      }
    }, 300);
  }

  onBtnVolverClick = () => {
    App.goBack();
  }

  onToolbarBack = () => {
    if (!this.back()) {
      App.goBack();
    }
  }

  onPaso1Cargando = (cargando) => {
    this.setState({ paso1Cargando: cargando });
  }

  onPaso3Cargando = (cargando) => {
    this.setState({ paso3Cargando: cargando });
  }

  onMotivo = (data) => {
    this.setState({
      servicioNombre: data.servicioNombre,
      motivoNombre: data.motivoNombre,
      motivoId: data.motivoId,
      descripcion: data.descripcion
    });
  }

  onMotivoReady = () => {
    this.mostrarPaso(2);
  }

  onUbicacion = (ubicacion) => {
    this.setState({
      ubicacion: ubicacion
    });
  }

  onUbicacionReady = () => {
    this.mostrarPaso(3);
  }

  onFoto = (foto) => {
    this.setState({
      foto: foto
    });
  }

  onFotoReady = () => {
    // this.mostrarPaso(4);
  }

  onBotonRegistrarPress = () => {
    const puedeRegistrar = this.state.motivoId != undefined && this.state.descripcion != undefined && this.state.descripcion.length >= 20 && this.state.ubicacion != undefined;
    if (puedeRegistrar == false) {
      Alert.alert('', 'Debe completar los pasos indicados para registrar el requerimiento');
      return;
    }

    this.mostrarDialogoConfimacion();
  }

  mostrarDialogoConfimacion = () => {
    this.setState({ dialogoConfirmacionVisible: true });
  }

  ocultarDialogoConfirmacion = () => {
    this.setState({ dialogoConfirmacionVisible: false });
  }

  render() {
    const initData = global.initData;
    const puedeRegistrar = this.state.motivoId != undefined && this.state.descripcion != undefined && this.state.descripcion.length >= 20 && this.state.ubicacion != undefined;

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
              <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ padding: 16, display: "flex" }}>
                <View style={{ maxWidth: 400, alignSelf: "center", width: "100%" }}>
                  {/* Paso 1 - Servicio motivo */}
                  <Paso
                    numero={1}
                    cargando={this.state.paso1Cargando}
                    titulo={texto_Titulo_Servicio}
                    onPress={this.onPasoClick}
                    expandido={this.state.pasoActual == 1 ? true : false}
                    completado={this.state.motivoId != undefined && this.state.descripcion != undefined && this.state.descripcion.length >= 20}
                  >
                    <PasoServicio
                      servicios={this.state.servicios}
                      onCargando={this.onPaso1Cargando}
                      onMotivo={this.onMotivo}
                      onReady={this.onMotivoReady}
                    />
                  </Paso>

                  {/* Paso 2 - Ubicacion */}
                  <Paso
                    numero={2}
                    titulo={texto_Titulo_Ubicacion}
                    onPress={this.onPasoClick}
                    expandido={this.state.pasoActual == 2}
                    completado={this.state.ubicacion != undefined}
                  >
                    <PasoUbicacion onUbicacion={this.onUbicacion} onReady={this.onUbicacionReady} />
                  </Paso>

                  {/* Paso 3 - Foto */}
                  <Paso
                    numero={3}
                    cargando={this.state.paso3Cargando}
                    titulo={texto_Titulo_Foto}
                    onPress={this.onPasoClick}
                    expandido={this.state.pasoActual == 3}
                    completado={this.state.foto != undefined}
                  >
                    <PasoFoto onFoto={this.onFoto} onCargando={this.onPaso3Cargando} onReady={this.onFotoReady} />
                  </Paso>

                  {/* Boton registrar */}

                  <View>
                    <View style={{ height: 32 }} />
                    <MiBoton
                      centro
                      color={puedeRegistrar ? initData.colorVerde : 'rgba(130,130,130,1)'}
                      colorTexto='white'
                      onPress={this.onBotonRegistrarPress}
                      sombra
                      rounded
                      texto="Finalizar" />
                  </View>

                </View>
              </ScrollView>
            )}

          {/* Sombra del toolbar */}
          <MiToolbarSombra />

        </View>

        {/* Keyboard */}
        <Animated.View style={[{ height: "100%" }, { maxHeight: this.keyboardHeight }]} />

        {/* Resultado */}
        <Resultado
          numero={this.state.numero}
          visible={this.state.mostrarPanelResultado}
          cargando={this.state.registrando}
          onPressVerDetalle={this.onBtnVerDetalleClick}
          onPressVolver={this.onBtnVolverClick}
        />

        {this.renderDialogoConfirmacion()}
        {this.renderDialogoConfirmarSalida()}
      </View>
    );
  }

  onDialogoConfirmarBotonConfimarPress = () => {
    this.ocultarDialogoConfirmacion();
    this.registrar();
  }

  renderDialogoConfirmacion() {
    const initData = global.initData;

    let textoUbicacion = undefined;
    if (this.state.ubicacion != undefined) {
      textoUbicacion = this.state.ubicacion.direccion;
      if (this.state.ubicacion.sugerido == true) {
        textoUbicacion = "Aproximadamente en " + toTitleCase(textoUbicacion);
      }
    }


    return <MiDialogo
      titulo="Confirmar nuevo requerimiento"
      onDismiss={this.ocultarDialogoConfirmacion}
      visible={this.state.dialogoConfirmacionVisible == true}
      botones={[
        {
          texto: 'Cancelar',
          onPress: this.ocultarDialogoConfirmacion
        },
        {
          texto: 'Registrar',
          color: initData.colorVerde,
          onPress: this.onDialogoConfirmarBotonConfimarPress
        }
      ]}
    >

      <PasoConfirmacion
        servicio={this.state.servicioNombre}
        motivo={this.state.motivoNombre}
        descripcion={this.state.descripcion}
        ubicacion={textoUbicacion}
      />

    </MiDialogo>
  }

  ocultarDialogoConfirmarSalida = () => {
    this.setState({ dialogoConfirmarSalidaVisible: false });
  }

  onConfirmarSalida = () => {
    this.setState({
      dialogoConfirmarSalidaVisible: false
    }, () => {
      App.goBack();
    });
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
const texto_Titulo_Foto = "Imagen (Opcional)";
const texto_Titulo_Confirmacion = "Confirmación";
const texto_DialogoCancelarFormulario = "¿Esta seguro que desea cancelar la creación del requerimiento?";
