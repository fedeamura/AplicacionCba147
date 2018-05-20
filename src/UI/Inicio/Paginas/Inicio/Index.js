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
import AppTheme from "@UI/AppTheme";
// import ServicioCardItem from "@Utils/Servicio/CardItem";
import MiListado from "@Utils/MiListado";
import ItemRequerimiento from "@Utils/Requerimiento/CardItem";
import Rules_Servicio from "@Rules/Rules_Servicio";
import Rules_Requerimiento from "../../../../Rules/Rules_Requerimiento";

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

    const styles = AppTheme.styles.inicio.requerimientos;
    const initData = global.initData.inicio.requerimientos;

    // const serviciosPrincipales = [];
    // const servicios = [];

    // if (!this.state.cargando) {
    //   for (let i = 0; i < this.state.servicios.length; i++) {
    //     let s = this.state.servicios[i];
    //     if ('principal' in s && s.principal == true) {
    //       serviciosPrincipales.push(s);
    //     } else {
    //       servicios.push(s);
    //     }
    //   }
    // }

    return (
      <View>

        <MiListado
          cargando={this.state.cargando}
          error={this.state.error}
          data={this.state.requerimientos}
          keyExtractor={(item) => { return item.id }}
          renderItem={(item) => {
            return <ItemRequerimiento estadoColor={item.item.estadoColor} estadoNombre={item.item.estadoNombre} />;
          }}
          renderEmpty={() => {
            return <View style={styles.contenedor_Empty} >
              <WebImage
                resizeMode={initData.imagenEmpty_ResizeMode}
                style={styles.imagenEmpty}
                source={{ uri: initData.imagenEmpty_Url }}
              />

              <Text style={styles.textoEmpty}>{initData.textoEmpty_Mensaje}</Text>

              <Button style={styles.botonEmpty}><Text style={{ color: initData.botonEmpty_TextoColor }}>{initData.botonEmpty_Texto}</Text></Button>
            </View>
          }}
          renderError={() => {
            return <View style={styles.contenedor_Error} >
              <WebImage
                resizeMode={initData.imagenError_ResizeMode}
                style={styles.imagenError}
                source={{ uri: initData.imagenError_Url }}
              />

              <Text style={styles.textoError}>{initData.textoError_Mensaje}</Text>

              <Button style={styles.botonError} onPress={() => {
                this.buscarRequerimientos();
              }}>
                <Text style={{ color: initData.botonError_TextoColor }}>{initData.botonError_Texto}</Text>
              </Button>
            </View>
          }}
        />
      </View >

      /* <ScrollView>

        <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 16 }}>
          {this.state.cargando && (<Text>Cargando</Text>)}
          {!this.state.cargando && (
            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>

              <Text style={{ fontSize: 32, marginTop: 16, marginBottom: 32 }}>Categorias principales</Text>

              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {serviciosPrincipales.map((servicio, index) => {
                  return <ServicioCardItem cols={2} onPress={() => { Alert.alert('holu') }}></ServicioCardItem>;
                })}
              </View>
            </View>

          )}
        </View>
      </ScrollView> */
      // </View>

    );
  }
}