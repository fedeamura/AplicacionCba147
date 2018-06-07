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
import { Card, CardContent, Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import WebImage from 'react-native-web-image'
import LinearGradient from 'react-native-linear-gradient';
import color from "color";
import LottieView from 'lottie-react-native';

//Mis componentes
import App from "@UI/App";

import Paso from "./Paso";
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
            duration: 1500
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
    });
  }

  onPasoClick(paso) {
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
    const initData = global.initData.requerimientoNuevo;

    return (
      <View style={{ flex: 1 }}>


        <Toolbar style={{ backgroundColor: 'white', elevation: 0 }} elevation={0} dark={false}>
          <ToolbarBackAction
            onPress={() => {
              App.goBack();
            }}
          />
          <ToolbarContent title="Nuevo requerimiento" />
        </Toolbar>

        <View style={{
          flex: 1, backgroundColor: "rgba(230,230,230,1)",
        }}>

          <ScrollView contentContainerStyle={{ padding: 16 }}>

            {/* Paso 1 */}
            <Paso
              numero={1}
              titulo="Servicio"
              onPress={(paso) => {
                this.onPasoClick(paso);
              }}
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
              titulo="Motivo"
              onPress={(paso) => {
                this.onPasoClick(paso);
              }}
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
              titulo="Descripción"
              onPress={(paso) => {
                this.onPasoClick(paso);
              }}
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
              titulo="Ubicación"
              onPress={(paso) => {
                this.onPasoClick(paso);
              }}
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
              titulo="Foto"
              onPress={(paso) => {
                this.onPasoClick(paso);
              }}
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
              titulo="Confirmación"
              onPress={(paso) => {
                this.onPasoClick(paso);
              }}
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