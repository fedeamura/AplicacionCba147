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


export default class RequerimientoNuevo extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pasos: [
        {
          nombre: 'servicio',
          completado: false,
          data: undefined
        },
        {
          nombre: 'motivo',
          completado: false,
          data: undefined
        },
        {
          nombre: 'descripcion',
          completado: false,
          data: undefined
        },
        {
          nombre: 'foto',
          completado: false,
          data: undefined
        },
        {
          nombre: 'confirmacion',
          completado: false,
          data: undefined
        }],
      indexPaso: 0
    };

    this.animPaso = new Animated.Value(0);
    this.keyboardHeight = new Animated.Value(0);
  }

  componentDidMount() {

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

  animarCambiarPaginaSiguiente() {
    let indexNuevo = this.state.indexPaso + 1;
    if (indexNuevo >= this.state.pasos.length) return

    Animated.timing(this.animPaso, {
      duration: 300,
      toValue: -1,
      useNativeDriver: true
    }).start(() => {
      this.setState({
        indexPaso: indexNuevo
      }, () => {
        Animated.timing(this.animPaso, {
          duration: 0,
          toValue: 1,
          useNativeDriver: true
        }).start(() => {
          Animated.timing(this.animPaso, {
            duration: 300,
            toValue: 0,
            useNativeDriver: true
          }).start();
        });
      });

    });
  }

  animarCambiarPaginaAnterior() {
    let indexNuevo = this.state.indexPaso - 1;
    if (indexNuevo < 0) return

    Animated.timing(this.animPaso, {
      duration: 300,
      toValue: 1,
      useNativeDriver: true
    }).start(() => {
      this.setState({
        indexPaso: indexNuevo
      }, () => {
        Animated.timing(this.animPaso, {
          duration: 0,
          toValue: -1,
          useNativeDriver: true
        }).start(() => {
          Animated.timing(this.animPaso, {
            duration: 300,
            toValue: 0,
            useNativeDriver: true
          }).start();
        });
      });

    });
  }

  getViewPaso(index) {
    switch (index) {
      case 0: {
        return <PasoServicio
          key={0}
          onSeleccion={(servicio) => {
            let pasos = this.state.pasos;
            pasos[0].data = servicio;
            pasos[0].completado = true;

            this.setState({
              pasos: pasos
            }, () => {
              this.animarCambiarPaginaSiguiente();
            });
          }} />
      } break;

      case 1: {
        return <PasoMotivo
          key={1}
          servicioNombre={this.state.pasos[0].data.nombre}
          servicioId={this.state.pasos[0].data.id}
          onSeleccion={(motivo) => {
            let pasos = this.state.pasos;
            pasos[1].data = motivo;
            pasos[1].completado = true;

            this.setState({
              pasos: pasos
            }, () => {
              this.animarCambiarPaginaSiguiente();
            });
          }} />
      } break;

      case 2: {
        return <PasoDescripcion
          key={2}
          onDescripcionLista={(descripcion) => {
            let pasos = this.state.pasos;
            pasos[2].data = descripcion;
            pasos[2].completado = true;

            this.setState({
              pasos: pasos
            }, () => {
              this.animarCambiarPaginaSiguiente();
            });
          }} />
      } break;

      case 3: {
        return <PasoUbicacion
          key={3}
          onUbicacion={(ubicacion) => {
            let pasos = this.state.pasos;
            pasos[3].data = ubicacion;
            pasos[3].completado = true;

            this.setState({
              pasos: pasos
            }, () => {
              this.animarCambiarPaginaSiguiente();
            });
          }} />
      } break;

      case 4: {
        return <PasoFoto
          key={4}
          onSiguiente={(foto) => {
            let pasos = this.state.pasos;
            pasos[4].data = foto;
            pasos[4].completado = true;

            this.setState({
              pasos: pasos
            }, () => {
              this.animarCambiarPaginaSiguiente();
            });
          }} />
      } break;

      case 5: {
        return <PasoConfirmacion
          key={5}
          onConfirmado={() => {

          }} />
      } break;
    }

    return undefined;
  }

  render() {

    const initData = global.initData.requerimientoNuevo;
    const viewPaso = this.getViewPaso(this.state.indexPaso);

    // const x = this.animPaso.interpolate({
    //   inputRange: [-1, 0, 1],
    //   outputRange: [-Dimensions.get("window").width, 0, Dimensions.get("window").width]
    // });

    const alpha = this.animPaso.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0, 1, 0]
    });
    return (
      <View style={{ flex: 1 }}>

        <Animated.View
          style={{
            flex: 1,
            opacity: alpha,
            // transform: [
            //   {
            //     translateX: x
            //   }
            // ]
          }}>
          {viewPaso}
        </Animated.View >

        <View style={{ display: 'flex', flexDirection: 'row', width: '100%', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
          {this.state.pasos.map((paso, index) => {

            let esActual = this.state.indexPaso == index;
            let esCompletado = index <= this.state.indexPaso;

            let color;
            if (esActual) {
              color = 'white';
            } else {
              if (esCompletado) {
                color = 'green';
              } else {
                color = 'rgba(100,100,100,1)';
              }
            }

            let colorBorde;
            if (esActual) {
              colorBorde = 'green';
            } else {
              if (esCompletado) {
                colorBorde = 'green';
              } else {
                colorBorde = 'rgba(100,100,100,1)';
              }
            }

            return <TouchableWithoutFeedback onPress={() => {
            }}>
              <View
                style={{
                  borderRadius: 100,
                  borderColor: colorBorde,
                  borderWidth: 2,
                  width: index == this.state.indexPaso ? 24 : 16,
                  height: index == this.state.indexPaso ? 24 : 16,
                  backgroundColor: color,
                  margin: 8
                }}></View>
            </TouchableWithoutFeedback>;

          })}
        </View>

                <Animated.View style={[{ height: '100%' }, { maxHeight: this.keyboardHeight }]}></Animated.View>

      </View >

    );
  }
}