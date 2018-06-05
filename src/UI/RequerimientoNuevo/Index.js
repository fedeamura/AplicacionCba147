import React, { Component } from "react";
import {
  Platform,
  View,
  UIManager,
  Alert,
  Animated,
  Easing,
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
import { Card, CardContent } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import WebImage from 'react-native-web-image'
import LinearGradient from 'react-native-linear-gradient';
import color from "color";
import LottieView from 'lottie-react-native';

//Mis componentes
import App from "@UI/App";

import PasoServicio from "@RequerimientoNuevoPasos/PasoServicio";
import PasoMotivo from "@RequerimientoNuevoPasos/PasoMotivo";
import PasoDescripcion from "@RequerimientoNuevoPasos/PasoDescripcion";
import PasoUbicacion from "@RequerimientoNuevoPasos/PasoUbicacion";
import PasoFoto from "@RequerimientoNuevoPasos/PasoFoto";
import PasoConfirmacion from "@RequerimientoNuevoPasos/PasoConfirmacion";
import IndicadorPaso from "./IndicadorPaso";

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
      registrando: false,
      registrado: false,
      errorRegistrando: undefined,
      animRegistrado: new Animated.Value(0)
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

  registrar() {
    this.setState({
      errorRegistrando: undefined,
      registrando: true
    }, () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(this.state.animRegistrado, {
            toValue: 0.5,
            duration: 1000
          }),
          Animated.timing(this.state.animRegistrado, {
            toValue: 0,
            duration: 1000
          })
        ])).start();

      let comando = { param: 1 };
      Rules_Requerimiento.insertar(comando)
        .then(() => {
          Animated.timing(this.state.animRegistrado, {
            toValue: 1,
            duration: 500
          }).start();

          this.setState({
            registrado: true
          });
        })
        .catch((error) => {
          this.setState({
            errorRegistrando: error
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

          <ScrollView contentContainerStyle={{ padding: 16 }}>

            <View style={{
              shadowColor: 'rgba(0,0,0,0.1)',
              shadowRadius: 5,
              shadowOpacity: 1,
              position: 'absolute', left: 56, width: 16, top: 56, bottom: 56, backgroundColor: 'white'
            }}></View>

            {/* Paso 1 */}
            <Card
              style={{ backgroundColor: this.state.pasoActual == 1 ? 'white' : 'transparent', elevation: this.state.pasoActual == 1 ? 2 : 0 }}>
              <CardContent style={{ overflow: 'hidden' }}>

                {/* Indicador */}
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

                {/* Paso  */}
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
              </CardContent>

            </Card>

            {/* Paso 2 */}
            <Card style={{ backgroundColor: this.state.pasoActual == 2 ? 'white' : 'transparent', elevation: this.state.pasoActual == 2 ? 2 : 0 }}>
              <CardContent style={{ overflow: 'hidden' }}>

                {/* Indicador */}
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
                {/* Paso */}
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
              </CardContent>
            </Card>

            {/* Paso 3 */}
            <Card style={{ backgroundColor: this.state.pasoActual == 3 ? 'white' : 'transparent', elevation: this.state.pasoActual == 3 ? 2 : 0 }}>
              <CardContent style={{ overflow: 'hidden' }}>
                {/* Indicador*/}
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
                      if (
                        this.state.servicio != undefined &&
                        this.state.motivo != undefined) {
                        this.mostrarPaso(3);
                      } else {
                        Alert.alert('', 'Debe completar los pasos anteriores');
                      }
                    }
                  }} />
                {/* Paso */}
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
              </CardContent>
            </Card>

            {/* Paso 4 */}
            <Card style={{ backgroundColor: this.state.pasoActual == 4 ? 'white' : 'transparent', elevation: this.state.pasoActual == 4 ? 2 : 0 }}>
              <CardContent style={{ overflow: 'hidden' }}>

                {/* Indicador */}
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
                      if (this.state.servicio != undefined &&
                        this.state.motivo != undefined &&
                        this.state.descripcion != undefined &&
                        this.state.descripcion.trim() != "") {
                        this.mostrarPaso(4);
                      } else {
                        Alert.alert('', 'Debe completar los pasos anteriores');
                      }
                    }
                  }} />
                {/* Contenido */}
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
              </CardContent>
            </Card>

            {/* Paso 5 */}
            <Card style={{ backgroundColor: this.state.pasoActual == 5 ? 'white' : 'transparent', elevation: this.state.pasoActual == 5 ? 2 : 0 }}>
              <CardContent style={{ overflow: 'hidden' }}>

                {/* Indicador */}
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
                        this.state.motivo != undefined &&
                        this.state.descripcion != undefined && this.state.descripcion.trim() != "" &&
                        this.state.ubicacion != undefined) {
                        this.mostrarPaso(5);
                      } else {
                        Alert.alert('', 'Debe completar los pasos anteriores');
                      }
                    }
                  }} />
                {/* Contenido */}
                <Animated.View style={{
                  overflow: 'hidden',
                  opacity: this.animPaso5,
                  maxHeight: this.animPaso5.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1000]
                  })
                }} >
                  <PasoFoto
                    onFoto={(foto) => {
                      this.setState({ foto: foto });
                    }}
                    onReady={() => {
                      this.mostrarPaso(6);
                    }}>
                  </PasoFoto>
                </Animated.View>
              </CardContent>
            </Card>

            {/* Paso 6 */}
            <Card style={{ backgroundColor: this.state.pasoActual == 6 ? 'white' : 'transparent', elevation: this.state.pasoActual == 6 ? 2 : 0 }}>
              <CardContent style={{ overflow: 'hidden' }}>

                {/* Indicador */}
                <IndicadorPaso
                  completado={false}
                  resaltado={this.state.pasoActual == 6}
                  numero="6º"
                  texto="Confirmación"
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
                        this.state.motivo != undefined &&
                        this.state.descripcion != undefined && this.state.descripcion.trim() != "" &&
                        this.state.ubicacion != undefined) {
                        this.mostrarPaso(6);
                      } else {
                        Alert.alert('', 'Debe completar los pasos anteriores');
                      }
                    }


                  }} />

                {/* Contenido */}
                <Animated.View style={{
                  overflow: 'hidden',
                  opacity: this.animPaso6,
                  maxHeight: this.animPaso6.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1000]
                  })
                }} >
                  <PasoConfirmacion
                    servicio={this.state.servicio}
                    motivo={this.state.motivo}
                    descripcion={this.state.descripcion}
                    ubicacion={this.state.ubicacion}
                    onReady={() => {
                      this.registrar();
                    }}>
                  </PasoConfirmacion>
                </Animated.View>
              </CardContent>
            </Card>
          </ScrollView>


          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
            backgroundColor="transparent"
            style={{ left: 0, top: 0, right: 0, height: 16, position: 'absolute' }}
            pointerEvents="none" />
        </View>

        <Animated.View style={[{ height: '100%' }, { maxHeight: this.keyboardHeight }]}></Animated.View>

        {this.state.registrando && (
          <View style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <View style={{ width: 200, height: 200, alignSelf: 'center' }}>
              <LottieView
                style={{ width: '100%', height: '100%' }}
                resizeMode='contain'
                source={require('@Resources/animacion_exito.json')}
                progress={this.state.animRegistrado} />

            </View>

            {this.state.registrado == false && (
              <Text style={{ fontSize: 24, textAlign: 'center', maxWidth: 300, alignSelf: 'center' }}>Registrando su requerimiento...</Text>
            )}

            {this.state.registrado == true && (
              <View>
                <Text style={{ fontSize: 24, textAlign: 'center', alignSelf: 'center', maxWidth: 300 }}>Su requerimiento se ha registrado correctamente</Text>
                <Text style={{ fontSize: 20, textAlign: 'center', alignSelf: 'center', marginTop: 32 }}>Requerimiento número:</Text>
                <Text style={{ fontSize: 32, alignSelf: 'center' }}>XWSQWS/2017</Text>

                <View style={{ marginTop: 16 }}>

                  <Button
                    bordered
                    rounded
                    style={{ alignSelf: 'center', borderColor: 'green' }}
                    onPress={() => {

                    }}><Text style={{ color: 'green' }}>Ver detalle</Text></Button>

                </View>



              </View>

            )}

            {this.state.registrando == true && this.state.registrado && (
              <Button
                transparent
                onPress={() => {
                  App.goBack();
                }}
                style={{ paddingLeft: 8, paddingRight: 8, position: 'absolute', top: 20 + 16, left: 16 }}
              ><Icon name="close" style="MaterialCommunityIcons" style={{ fontSize: 32 }}></Icon></Button>

            )}

          </View>
        )}

      </View >

    );
  }
}