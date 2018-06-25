import React from "react";
import {
  View,
  Alert,
  Animated,
  StyleSheet,
  ScrollView,
  Keyboard,
  BackHandler
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';

//Mis componentes
import App from "@UI/App";
import MiStatusBar from "@Utils/MiStatusBar";
import MiToolbar from "@Utils/MiToolbar";
import Paso from "./Paso";
import PasoServicio from "@RequerimientoNuevoPasos/PasoServicio";
import PasoMotivo from "@RequerimientoNuevoPasos/PasoMotivo";
import PasoDescripcion from "@RequerimientoNuevoPasos/PasoDescripcion";
import PasoUbicacion from "@RequerimientoNuevoPasos/PasoUbicacion";
import PasoFoto from "@RequerimientoNuevoPasos/PasoFoto";
import PasoConfirmacion from "@RequerimientoNuevoPasos/PasoConfirmacion";
import Resultado from "./Resultado";

import Rules_Requerimiento from '@Rules/Rules_Requerimiento';

export default class RequerimientoNuevo extends React.Component {
  static navigationOptions = {
    title: "Nuevo requerimiento",
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      pasoActual: 1,
      servicio: undefined,
      motivo: undefined,
      descripcion: undefined,
      ubicacion: undefined,
      foto: undefined,
      mostrarPanelResultado: false,
      registrando: false,
      numero: undefined
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

  componentDidMount() {
    // BackHandler.addEventListener('hardwareBackPress', () => {
    //   if (this.state.registrando == true) return true;
    //   return false;
    // });
  }

  registrar = () => {
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
    this.setState({
      pasoActual: paso
    });
  }

  onPasoClick = (paso) => {
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
        cumple = conServicio;
      } break;
      case 3: {
        cumple = conServicio && conMotivo;
      } break;
      case 4: {
        cumple = conServicio && conMotivo && conDescripcion;
      } break;
      case 5: {
        cumple = conServicio && conMotivo && conDescripcion && conUbicacion;
      } break;
      case 6: {
        cumple = conServicio && conMotivo && conDescripcion && conUbicacion;
      } break;
    }

    if (!cumple) {
      Alert.alert('', 'Debe completar los pasos anteriores');
      return;
    }

    this.mostrarPaso(paso);
  }

  render() {
    const { params } = this.props.navigation.state;
    const initData = global.initData;

    return (
      <View style={style.contenedor}>

        <MiStatusBar />

        {/* Toolbar */}
        <MiToolbar titulo={texto_Titulo} onBackPress={() => { App.goBack(); }} />

        {/* Contenido */}
        <View style={[style.contenido, { backgroundColor: initData.backgroundColor }]} >

          <ScrollView contentContainerStyle={{ padding: 16 }}>

            {/* Paso 1 */}
            <Paso
              numero={1}
              titulo={texto_Titulo_Servicio}
              onPress={this.onPasoClick}
              expandido={this.state.pasoActual == 1 ? true : false}
              completado={this.state.servicio != undefined}
            >
              <PasoServicio
                servicios={this.state.servicios}
                onServicio={(servicio) => {
                  this.setState({
                    servicio: servicio,
                    motivo: undefined
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
              titulo={texto_Titulo_Motivo}
              onPress={this.onPasoClick}
              expandido={this.state.pasoActual == 2}
              completado={this.state.motivo != undefined}
            >
              <PasoMotivo
                servicio={this.state.servicio}
                onMotivo={(motivo) => {
                  this.setState({
                    motivo: motivo
                  });
                }}
                onReady={(motivo) => {
                  this.mostrarPaso(3);
                }}>
              </PasoMotivo>
            </Paso>

            {/* Paso 3 */}
            <Paso
              numero={3}
              titulo={texto_Titulo_Descripcion}
              onPress={this.onPasoClick}
              expandido={this.state.pasoActual == 3}
              completado={this.state.descripcion != undefined && this.state.descripcion.trim() != ""}
            >
              <PasoDescripcion
                onDescripcion={(descripcion) => {
                  this.setState({ descripcion: descripcion });
                }}
                onReady={() => {
                  this.mostrarPaso(4);
                }}>
              </PasoDescripcion>
            </Paso>

            {/* Paso 4 */}
            <Paso
              numero={4}
              titulo={texto_Titulo_Ubicacion}
              onPress={this.onPasoClick}
              expandido={this.state.pasoActual == 4}
              completado={this.state.ubicacion != undefined}
            >
              <PasoUbicacion
                onUbicacion={(ubicacion) => {
                  this.setState({
                    ubicacion: ubicacion
                  });
                }}
                onReady={() => {
                  this.mostrarPaso(5);
                }}>
              </PasoUbicacion>
            </Paso>

            {/* Paso 5 */}
            <Paso
              numero={5}
              titulo={texto_Titulo_Foto}
              onPress={this.onPasoClick}
              expandido={this.state.pasoActual == 5}
              completado={this.state.foto != undefined}
            >
              <PasoFoto
                onFoto={(foto) => {
                  this.setState({
                    foto: foto
                  });
                }}
                onReady={() => {
                  this.mostrarPaso(6);
                }}>
              </PasoFoto>
            </Paso>

            {/* Paso 6 */}
            <Paso
              numero={6}
              titulo={texto_Titulo_Confirmacion}
              onPress={this.onPasoClick}
              expandido={this.state.pasoActual == 6}
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
          onPressVerDetalle={(id) => {
            App.goBack();
            if (params != undefined && 'verDetalleRequerimiento' in params && params.verDetalleRequerimiento != undefined) {
              params.verDetalleRequerimiento(id);
            }
          }} />

      </View >

    );
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
const texto_Titulo_Servicio = 'Servicio';
const texto_Titulo_Motivo = 'Motivo';
const texto_Titulo_Descripcion = 'Descripción';
const texto_Titulo_Ubicacion = 'Ubicación';
const texto_Titulo_Foto = 'Foto';
const texto_Titulo_Confirmacion = 'Confirmación';

