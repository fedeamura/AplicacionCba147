import React, { Component } from "react";
import {
  View,
  UIManager,
  StyleSheet,
  Animated,
  Alert
} from "react-native";
import { Text } from "native-base";
import {
  Toolbar,
  ToolbarContent,
  ToolbarAction,
  Button,
  SearchBar,
  Card,
  CardContent
} from "react-native-paper";

import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

//Mis compontenes
import App from "@UI/App";
import MiToolbar from "@Utils/MiToolbar";
import Rules_Domicilio from "../../Rules/Rules_Domicilio";

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class MiPickerUbicacion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      busqueda: undefined,
      posicion: {
        latitude: -31.420011,
        longitude: -64.188738,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      cargarMapa: false
    }

    this.animSugerencias = new Animated.Value(0);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        cargarMapa: true
      })
    }, 500);
  }

  onRegionChange(region) {
    this.setState({ posicion: region });
  }

  buscar() {
    // if (this.state.busqueda == undefined || this.state.busqueda == "") {
    //   this.setState({
    //     errorSurgerencias: undefined,
    //     buscandoSugerencias: false,
    //     sugerencias: []
    //   });

    //   Animated.spring(this.animSugerencias, {
    //     toValue: 0
    //   }).start();

    //   return;
    // }

    // Animated.spring(this.animSugerencias, {
    //   toValue: 1
    // }).start();

    // this.setState({
    //   buscandoSugerencias: true
    // }, () => {
    //   Rules_Domicilio.buscarCoordenada(this.state.busqueda)
    //     .then((results) => {
    //       this.setState({
    //         errorSurgerencias: undefined,
    //         buscandoSugerencias: false,
    //         sugerencias: results
    //       });
    //     })
    //     .catch((error) => {
    //       this.setState({
    //         buscandoSugerencias: false,
    //         errorSurgerencias: 'Error buscando',
    //         sugerencias: []
    //       });
    //     });
    // });

  }

  onMapaClick(coordenadas) {

  }

  render() {
    const { params } = this.props.navigation.state;

    return (
      <View style={styles.contenedor}>

        <SearchBar
          style={styles.contenedorBusqueda}
          placeholder="Buscar..."
          onChangeText={query => { this.setState({ busqueda: query }, () => { this.buscar(); }); }}
          value={this.state.busqueda}
        />

        {this.state.cargarMapa ? (
          <View style={styles.contenedorMapa}>

            <MapView
              style={styles.mapa}
              showsUserLocation={true}
              onPress={(e) => {
                this.setState({ marcador: e.nativeEvent.coordinate });
              }}
              region={this.state.posicion}
              onRegionChange={() => { this.onRegionChange() }}
            >
              {this.state.marcador != undefined && (
                <Marker draggable
                  onDragEnd={(e) => {
                    this.onMapaClick(e.nativeEvent.coordinate);
                  }}
                  coordinate={this.state.marcador}
                  title="Ubicacion seleccionada"
                />
              )}
            </MapView>

            <View style={styles.contenedorBotones}>

              <Button
                onPress={() => {
                  this.setState({
                    cargarMapa: false
                  }, () => {
                    App.goBack();
                  });
                }}

                raised >Cancelar</Button>

              {this.state.marcador != undefined && (
                <Button onPress={() => {
                  this.setState({
                    cargarMapa: false
                  }, () => {
                    if (params != undefined && params.onUbicacionSeleccionada != undefined) {
                      params.onUbicacionSeleccionada(this.state.marcador);
                      App.goBack();
                    }
                  });
                }}
                  raised color="green" style={styles.btnConfirmar}>Confirmar ubicación</Button>
              )}
            </View>
          </View>
        ) : (
            <View />
          )}


        {/* <Animated.View style={[styles.contenedorSurgerencias, {
          opacity: this.animSugerencias.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateRight: 'clamp',
            extrapolateLeft: 'clamp'

          }),
        }]}>

          <Card style={styles.contenedorSugerencias_Card}>

            <CardContent>

              <View >

              </View>
            </CardContent>

          </Card>

        </Animated.View> */}

      </View >
    );
  }
}

const styles = StyleSheet.create({
  contenedorBusqueda: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 32,
    zIndex: 10
  },
  contenedor: {
    height: "100%",
    width: "100%"
  },
  contenedorMapa: {
    width: '100%',
    height: '100%'
  },
  mapa: {
    flex: 1,
    width: '100%',
    ...StyleSheet.absoluteFillObject
  },
  contenedorBotones: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  btnConfirmar: {

  },
  contenedorSurgerencias: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  },
  contenedorSugerencias_Card: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 80,
    height: 100
  }
});

