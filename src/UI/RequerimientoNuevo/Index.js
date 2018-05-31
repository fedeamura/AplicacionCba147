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
  Dimensions
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
      servicio: undefined,
      motivo: undefined,
      paso: "servicio"
    };

    this.animPaso = new Animated.Value(0);
  }

  componentDidMount() {
  }

  animarCambiarPaginaSiguiente(pagina) {
    Animated.timing(this.animPaso, {
      duration: 300,
      toValue: -1,
      useNativeDriver: true
    }).start(() => {
      this.setState({
        paso: pagina
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

  animarCambiarPaginaAnterior(pagina) {
    Animated.timing(this.animPaso, {
      duration: 300,
      toValue: 1,
      useNativeDriver: true
    }).start(() => {
      this.setState({
        paso: pagina
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

  getViewPaso() {
    switch (this.state.paso) {
      case 'servicio': {
        return <PasoServicio
          onSeleccion={(servicio) => {
            this.setState({
              servicio: servicio
            }, () => {
              this.animarCambiarPaginaSiguiente('motivo');
            });
          }} />
      } break;

      case 'motivo': {
        return <PasoMotivo servicioNombre={this.state.servicio.nombre}
          onEditarServicio={() => {
            this.animarCambiarPaginaAnterior('servicio');
          }}
          onSeleccion={() => {
            this.setState({
              paso: 'descripcion'
            });
          }} />
      } break;

      case 'descripcion': {
        return <PasoDescripcion onSiguiente={() => {
          this.setState({
            paso: 'ubicacion'
          });
        }} />
      } break;

      case 'ubicacion': {
        return <PasoUbicacion onSiguiente={() => {
          this.setState({
            paso: 'foto'
          });
        }} />
      } break;

      case 'foto': {
        return <PasoFoto onSiguiente={() => {
          this.setState({
            paso: 'confirmacion'
          });
        }} />
      } break;

      case 'confirmacion': {
        return <PasoConfirmacion onSiguiente={() => {
          App.goBack();
        }} />
      } break;
    }

    return undefined;
  }

  render() {

    const initData = global.initData.requerimientoNuevo;
    const viewPaso = this.getViewPaso();

    // const x = this.animPaso.interpolate({
    //   inputRange: [-1, 0, 1],
    //   outputRange: [-Dimensions.get("window").width, 0, Dimensions.get("window").width]
    // });

    const alpha = this.animPaso.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0, 1, 0]
    });
    return (
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
    );
  }
}