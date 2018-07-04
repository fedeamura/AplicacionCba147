import React from "react";
import {
  View,
  Alert,
  Animated,
  StyleSheet,
  ScrollView,
  Keyboard
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { Spinner } from "native-base";
import {
  Dialog,
  Text,
  Button as ButtonPeper,
  DialogActions,
  DialogContent
} from 'react-native-paper';
import _ from 'lodash';
// import AndroidBackButton from "react-native-android-back-button"
import { BackHandler } from "react-native";

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
import Rules_Requerimiento from '@Rules/Rules_Requerimiento';


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
      servicio: undefined,
      motivo: undefined,
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

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload => {
      BackHandler.addEventListener('hardwareBackPress', this.back);
    });

    this._willBlurSubscription = props.navigation.addListener('willBlur', payload => {
      BackHandler.removeEventListener('hardwareBackPress', this.back);
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
    const formConDatos = this.state.servicio != undefined ||
      this.state.motivo ||
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
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  componentDidMount() {
    Rules_Servicio.get().then((data) => {
      data = _.orderBy(data, 'Nombre');
      this.setState({ cargando: false, servicios: data });
    }).catch(() => {
      Alert.alert('', 'Error procesando la solicitud');
    });
  }

  registrar = () => {
    Keyboard.dismiss();

    this.setState({
      mostrarPanelResultado: true,
      registrando: true
    }, () => {
      let comando = { param: 1 };
      Rules_Requerimiento.insertar(comando)
        .then(() => {
          this.setState({
            numero: 'QWSTGH/2018',
            registrando: false
          });
        })
        .catch((error) => {
          Alert.alert('', error);

          this.setState({
            mostrarPanelResultado: false,
            registrando: false
          })
        });

    });
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

    let conServicio = this.state.servicio != undefined;
    let conMotivo = this.state.motivo != undefined;
    let conDescripcion = this.state.descripcion != undefined && this.state.descripcion.trim() != "";
    let conUbicacion = this.state.ubicacion != undefined;

    let cumple = false;
    switch (paso) {
      case 1: {
        cumple = true;
      } break;
      case 2: {
        cumple = conServicio && conMotivo;
      } break;
      case 3: {
        cumple = conServicio && conMotivo && conDescripcion;
      } break;
      case 4: {
        cumple = conServicio && conMotivo && conDescripcion && conUbicacion;
      } break;
      case 5: {
        cumple = conServicio && conMotivo && conDescripcion && conUbicacion;
      } break;
    }

    if (!cumple) {
      Alert.alert('', 'Debe completar los pasos anteriores');
      return;
    }

    this.mostrarPaso(paso);
  }

  onBtnVerDetalleClick = (id) => {
    App.goBack();

    setTimeout(() => {
      const { params } = this.props.navigation.state;

      if (params != undefined && 'verDetalleRequerimiento' in params && params.verDetalleRequerimiento != undefined) {
        params.verDetalleRequerimiento(id);
      }
    }, 300);
  }

  render() {
    const initData = global.initData;

    return (
      <View style={style.contenedor}>

        <MiStatusBar />

        {/* Toolbar */}
        <MiToolbar titulo={texto_Titulo} onBackPress={() => {
          if (!this.back()) {
            App.goBack();
          }
        }} />

        {/* Contenido */}
        <View style={[style.contenido, { backgroundColor: initData.backgroundColor }]} >

          {this.state.cargando == true ? (
            <Spinner color="green" />
          ) : (<ScrollView
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ padding: 16 }}>

            {/* Paso 1 - Servicio motivo */}
            <Paso
              numero={1}
              cargando={this.state.paso1Cargando}
              titulo={texto_Titulo_Servicio}
              onPress={this.onPasoClick}
              expandido={this.state.pasoActual == 1 ? true : false}
              completado={this.state.servicio != undefined}
            >
              <PasoServicio
                servicios={this.state.servicios}


                onCargando={(cargando) => {
                  this.setState({ paso1Cargando: cargando })
                }}
                onMotivo={(servicio, motivo) => {
                  this.setState({
                    servicio: servicio,
                    motivo: motivo
                  });
                }}
                onReady={() => {
                  this.mostrarPaso(2);
                }}
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
              <PasoDescripcion
                onDescripcion={(descripcion) => {
                  this.setState({ descripcion: descripcion });
                }}
                onReady={() => {
                  this.mostrarPaso(3);
                }}>
              </PasoDescripcion>
            </Paso>

            {/* Paso 4 */}
            <Paso
              numero={3}
              titulo={texto_Titulo_Ubicacion}
              onPress={this.onPasoClick}
              expandido={this.state.pasoActual == 3}
              completado={this.state.ubicacion != undefined}
            >
              <PasoUbicacion
                onUbicacion={(ubicacion) => {
                  this.setState({
                    ubicacion: ubicacion
                  });
                }}
                onReady={() => {
                  this.mostrarPaso(4);
                }}>
              </PasoUbicacion>
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
              <PasoFoto
                onFoto={(foto) => {
                  this.setState({
                    foto: foto
                  });
                }}
                onCargando={(cargando) => {
                  this.setState({ paso4Cargando: cargando })
                }}
                onReady={() => {
                  this.mostrarPaso(5);
                }}>
              </PasoFoto>
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
                servicio={this.state.servicio}
                motivo={this.state.motivo}
                descripcion={this.state.descripcion}
                ubicacion={this.state.ubicacion}
                onReady={() => {
                  this.registrar();
                }}>
              </PasoConfirmacion>
            </Paso>

          </ScrollView>
            )}


          {/* Sombra del toolbar */}
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
            backgroundColor="transparent"
            style={{ left: 0, top: 0, right: 0, height: 16, position: 'absolute' }}
            pointerEvents="none" />
        </View>

        {/* Keyboard */}
        <Animated.View style={[{ height: '100%' }, { maxHeight: this.keyboardHeight }]}></Animated.View>

        {/* Resultado */}
        <Resultado
          numero={this.state.numero}
          visible={this.state.mostrarPanelResultado}
          cargando={this.state.registrando}
          onPressVerDetalle={this.onBtnVerDetalleClick} />

        {this.renderDialogoConfirmarSalida()}
      </View >

    );
  }

  renderDialogoConfirmarSalida() {
    return <Dialog
      style={{ borderRadius: 16 }}
      visible={this.state.dialogoConfirmarSalidaVisible}
      onDismiss={() => { this.setState({ dialogoConfirmarSalidaVisible: false }) }}
    >
      <DialogContent>
        <ScrollView style={{ maxHeight: 300, maxWidth: 400 }}>
          <Text>{texto_DialogoCancelarFormulario}</Text>
        </ScrollView>
      </DialogContent>
      <DialogActions>
        <ButtonPeper onPress={() => { this.setState({ dialogoConfirmarSalidaVisible: false }) }}>No</ButtonPeper>
        <ButtonPeper onPress={() => {
          this.setState({
            dialogoConfirmarSalidaVisible: false
          }, () => {
            App.goBack();
          })
        }}>Si</ButtonPeper>
      </DialogActions>
    </Dialog>
  }
}

const style = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%'
  },
  contenido: {
    flex: 1
  }
});

const texto_Titulo = 'Nuevo requerimiento';
const texto_Titulo_Servicio = 'Categoría';
const texto_Titulo_Descripcion = 'Descripción';
const texto_Titulo_Ubicacion = 'Ubicación';
const texto_Titulo_Foto = 'Foto';
const texto_Titulo_Confirmacion = 'Confirmación';
const texto_DialogoCancelarFormulario = '¿Esta seguro que desea cancelar la creación del requerimiento?';
