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

export default class PaginaInicio extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cargando: true,
      error: undefined,
      requerimientos: []
    };
  }

  componentDidMount() {
    this.buscarRequerimientos();
  }

  buscarRequerimientos() {
    this.setState({
      error: undefined,
      requerimientos: [],
      cargando: true
    }, () => {

      Rules_Requerimiento.get()
        .then((requerimientos) => {
          this.setState({
            cargando: false,
            requerimientos: requerimientos
          });

        }).catch((error) => {
          this.setState({
            cargando: false,
            requerimientos: [],
            error: error
          });
        })
    });

  }
  render() {

    const initData = global.initData.inicio.paginas.requerimientos;

    return (
      <View style={{ flex: 1 }}>
        <MiListado
          style={{ padding: 16, width: '100%' }}
          cargando={this.state.cargando}
          error={this.state.error}
          data={this.state.requerimientos}
          keyExtractor={(item) => { return item.id }}
          renderItem={(item) => {
            return <ItemRequerimiento
              numero={item.item.numero}
              año={item.item.año}
              estadoColor={item.item.estadoColor}
              estadoNombre={item.item.estadoNombre}
              fechaAlta={item.item.fechaAlta}
            />;
          }}
          renderEmpty={() => {
            return <View style={initData.styles.contenedor_Empty} >
              <WebImage
                resizeMode={initData.imagenEmpty_ResizeMode}
                style={initData.styles.imagenEmpty}
                source={{ uri: initData.imagenEmpty_Url }}
              />

              <Text style={initData.styles.textoEmpty}>{initData.textoEmpty_Mensaje}</Text>

              <Button
                full={initData.botonEmpty_FullWidth}
                transparent={initData.botonEmpty_Transparente}
                rounded={initData.botonEmpty_Redondeado}
                style={initData.styles.botonEmpty}>
                <Text style={initData.styles.botonEmptyTexto}>{initData.botonEmpty_Texto}
                </Text>
              </Button>
            </View>
          }}
          renderError={() => {
            return <View style={initData.styles.contenedor_Error} >
              <WebImage
                resizeMode={initData.imagenError_ResizeMode}
                style={initData.styles.imagenError}
                source={{ uri: initData.imagenError_Url }}
              />

              <Text style={initData.styles.textoError}>{initData.textoError_Mensaje}</Text>

              <Button
                full={initData.botonError_FullWidth}
                transparent={initData.botonError_Transparente}
                rounded={initData.botonError_Redondeado}
                style={initData.styles.botonError}
                onPress={() => {
                  this.buscarRequerimientos();
                }}>
                <Text style={initData.styles.botonErrorTexto}>{initData.botonError_Texto}</Text>
              </Button>
            </View>
          }}
        />

      </View >
    );
  }
}