import React, { Component } from "react";
import {
  Platform,
  View,
  UIManager,
  Alert,
  Animated,
  StatusBar,
  ScrollView,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import {
  Container,
  Button,
  Text,
  Input,
  Content
} from "native-base";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import WebImage from 'react-native-web-image'
import LinearGradient from 'react-native-linear-gradient';
import color from "color";

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "@UI/App";
import MiListado from "@Utils/MiListado";
import ItemRequerimiento from "@Utils/Requerimiento/CardItem";
import Rules_Servicio from "@Rules/Rules_Servicio";
import Rules_Requerimiento from "@Rules/Rules_Requerimiento";

import PasoServicio from "@RequerimientoNuevoPasos/PasoServicio";
import PasoMotivo from "@RequerimientoNuevoPasos/PasoMotivo";
import PasoDescripcion from "@RequerimientoNuevoPasos/PasoDescripcion";
import PasoUbicacion from "@RequerimientoNuevoPasos/PasoUbicacion";
import PasoFoto from "@RequerimientoNuevoPasos/PasoFoto";
import PasoConfirmacion from "@RequerimientoNuevoPasos/PasoConfirmacion";
import IndicadorPaso from "./IndicadorPaso";


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
      foto: undefined
    };

    this.animPaso1 = new Animated.Value(1);
    this.animPaso2 = new Animated.Value(0);
    this.animPaso3 = new Animated.Value(0);
    this.animPaso4 = new Animated.Value(0);
    this.animPaso5 = new Animated.Value(0);
    this.animPaso6 = new Animated.Value(0);

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

  mostrarPaso(paso) {
    this.setState({
      pasoActual: paso
    }, () => {
      let anim1 = Animated.timing(this.animPaso1, { toValue: paso == 1 ? 1 : 0, duration: 300 });
      let anim2 = Animated.timing(this.animPaso2, { toValue: paso == 2 ? 1 : 0, duration: 300 });
      let anim3 = Animated.timing(this.animPaso3, { toValue: paso == 3 ? 1 : 0, duration: 300 });
      let anim4 = Animated.timing(this.animPaso4, { toValue: paso == 4 ? 1 : 0, duration: 300 });
      let anim5 = Animated.timing(this.animPaso5, { toValue: paso == 5 ? 1 : 0, duration: 300 });
      let anim6 = Animated.timing(this.animPaso6, { toValue: paso == 6 ? 1 : 0, duration: 300 });

      Animated.parallel([anim1, anim2, anim3, anim4, anim5, anim6]).start();
    });
  }

  render() {
    const initData = global.initData.requerimientoNuevo;

    return (
      <View style={{ flex: 1 }}>

        <View style={{ padding: 16, paddingTop: 16 + 20, width: '100%', alignItems: 'center', backgroundColor: 'white' }}>
          <Button
            onPress={() => {
              App.goBack();
            }}
            transparent
            style={{ position: 'absolute', left: 16, top: 10 + 20 }}><Icon name="close" style={{ fontSize: 24 }} />
          </Button>
          <Text style={{ fontSize: 24 }}>Nuevo requerimiento</Text>
        </View>
        <View style={{ flex: 1 }}>

          <ScrollView contentContainerStyle={{ padding: 32 }}>

            {/* Indicador 1 */}
            <IndicadorPaso
              completado={this.state.servicio != undefined}
              resaltado={this.state.pasoActual == 1}
              numero="1º"
              texto="Seleccione un servicio"
              colorFondoCirculo='white'
              colorFondoCirculoCompletado='green'
              colorTextoCirculo='green'
              colorTextoCirculoCompletado='white'
              onPress={() => {
                if (this.state.pasoActual == 1) {
                  this.mostrarPaso(-1);
                } else {
                  this.mostrarPaso(1);
                }
              }} />

            {/* Paso 1  */}
            <Animated.View style={{
              overflow: 'hidden',
              opacity: this.animPaso1,
              maxHeight: this.animPaso1.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1000]
              })
            }} >
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
            </Animated.View>


            {/* Indicador 2 */}
            <IndicadorPaso
              completado={this.state.motivo != undefined}
              resaltado={this.state.pasoActual == 2}
              numero="2º"
              texto="Seleccione un motivo"
              colorFondoCirculo='white'
              colorFondoCirculoCompletado='green'
              colorTextoCirculo='green'
              colorTextoCirculoCompletado='white'
              onPress={() => {
                if (this.state.pasoActual == 2) {
                  this.mostrarPaso(-1);
                } else {
                  if (this.state.servicio != undefined) {
                    this.mostrarPaso(2);
                  } else {
                    Alert.alert('', 'Debe completar los pasos anteriores');
                  }
                }

              }} />
            {/* Paso 2  */}
            <Animated.View style={{
              overflow: 'hidden',
              opacity: this.animPaso2,
              maxHeight: this.animPaso2.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1000]
              })
            }} >
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

            </Animated.View>


            {/* Indicador 3 */}
            <IndicadorPaso
              completado={this.state.descripcion != undefined && this.state.descripcion.trim() != ""}
              resaltado={this.state.pasoActual == 3}
              numero="3º"
              texto="Descripción"
              colorFondoCirculo='white'
              colorFondoCirculoCompletado='green'
              colorTextoCirculo='green'
              colorTextoCirculoCompletado='white'
              onPress={() => {
                if (this.state.pasoActual == 3) {
                  this.mostrarPaso(-1);
                } else {
                  if (this.state.servicio != undefined && this.state.servicio != undefined) {
                    this.mostrarPaso(3);
                  } else {
                    Alert.alert('', 'Debe completar los pasos anteriores');
                  }
                }
              }} />
            {/* Paso 3  */}
            <Animated.View style={{
              overflow: 'hidden',
              opacity: this.animPaso3,
              maxHeight: this.animPaso3.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1000]
              })
            }} >
              <PasoDescripcion
                onDescripcion={(descripcion) => {
                  this.setState({ descripcion: descripcion });
                }}
                onReady={() => {
                  this.mostrarPaso(4);
                }}>
              </PasoDescripcion>

            </Animated.View>


            {/* Indicador 4 */}
            <IndicadorPaso
              completado={this.state.ubicacion != undefined}
              resaltado={this.state.pasoActual == 4}
              numero="4º"
              texto="Ubicación"
              colorFondoCirculo='white'
              colorFondoCirculoCompletado='green'
              colorTextoCirculo='green'
              colorTextoCirculoCompletado='white'
              onPress={() => {
                if (this.state.pasoActual == 4) {
                  this.mostrarPaso(-1);
                } else {
                  if (this.state.servicio != undefined && this.state.servicio != undefined && this.state.descripcion != undefined && this.state.descripcion.trim() != "") {
                    this.mostrarPaso(4);
                  } else {
                    Alert.alert('', 'Debe completar los pasos anteriores');
                  }
                }
              }} />
            {/* Paso 4 */}
            <Animated.View style={{
              overflow: 'hidden',
              opacity: this.animPaso4,
              maxHeight: this.animPaso4.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1000]
              })
            }} >
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
            </Animated.View>

            {/* Indicador 5 */}
            <IndicadorPaso
              completado={this.state.foto != undefined}
              resaltado={this.state.pasoActual == 5}
              numero="5º"
              texto="Foto"
              colorFondoCirculo='white'
              colorFondoCirculoCompletado='green'
              colorTextoCirculo='green'
              colorTextoCirculoCompletado='white'
              onPress={() => {
                if (this.state.pasoActual == 5) {
                  this.mostrarPaso(-1);
                } else {
                  if (
                    this.state.servicio != undefined &&
                    this.state.servicio != undefined &&
                    this.state.descripcion != undefined && this.state.descripcion.trim() != "" &&
                    this.state.ubicacion != undefined) {
                    this.mostrarPaso(5);
                  } else {
                    Alert.alert('', 'Debe completar los pasos anteriores');
                  }
                }
              }} />
            {/* Paso 5 */}
            <Animated.View style={{
              overflow: 'hidden',
              opacity: this.animPaso5,
              maxHeight: this.animPaso5.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1000]
              })
            }} >
              <PasoFoto
                onReady={(foto) => {
                  this.setState({
                    foto: foto
                  }, () => {
                    this.mostrarPaso(6);
                  });
                }}>
              </PasoFoto>
            </Animated.View>


            {/* Indicador 6 */}
            <IndicadorPaso
              completado={false}
              resaltado={this.state.pasoActual == 6}
              numero="6º"
              texto="Confirmacón"
              colorFondoCirculo='white'
              colorFondoCirculoCompletado='green'
              colorTextoCirculo='green'
              colorTextoCirculoCompletado='white'
              onPress={() => {
                if (this.state.pasoActual == 6) {
                  this.mostrarPaso(-1);
                } else {
                  if (
                    this.state.servicio != undefined &&
                    this.state.servicio != undefined &&
                    this.state.descripcion != undefined && this.state.descripcion.trim() != "" &&
                    this.state.ubicacion != undefined) {
                    this.mostrarPaso(6);
                  } else {
                    Alert.alert('', 'Debe completar los pasos anteriores');
                  }
                }


              }} />
            <Animated.View style={{
              overflow: 'hidden',
              opacity: this.animPaso6,
              maxHeight: this.animPaso6.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1000]
              })
            }} >
              <PasoConfirmacion
                onReady={() => {
                }}>
              </PasoConfirmacion>
            </Animated.View>
          </ScrollView>


          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
            backgroundColor="transparent"
            style={{ left: 0, top: 0, right: 0, height: 16, position: 'absolute' }}
            pointerEvents="none" />
        </View>



        <Animated.View style={[{ height: '100%' }, { maxHeight: this.keyboardHeight }]}></Animated.View>

      </View >

    );
  }
}