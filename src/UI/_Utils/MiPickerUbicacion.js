import React from "react";
import {
  View,
  Alert,
  StyleSheet,
  Animated,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import {
  Card
} from 'react-native-paper'
import {
  Button,
  Text,
  Input,
  Spinner
} from "native-base";

import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//Mis compontenes
import App from "@UI/App";

//Rules
import Rules_Domicilio from "@Rules/Rules_Domicilio";

export default class MiPickerUbicacion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      buscando: false,
      data: undefined,
      busqueda: undefined,
      initialRegion: {
        latitude: -31.420011,
        longitude: -64.188738,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      cargarMapa: false
    }

    this.animSugerencias = new Animated.Value(0);
    this.animCard = new Animated.Value(0);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        cargarMapa: true
      })
    }, 500);
  }

  // onRegionChange = (region) => {
  //   this.setState({ posicion: region });
  // }


  onContenedorBusquedaPress = () => {
    Keyboard.dismiss();

    if (this.state.cargando == true) {
      this.input._root.blur();
      return;
    }

    this.setState({ buscando: true })
    Animated.timing(this.animSugerencias, { toValue: 1, duration: 300 }).start();
  }

  onBtnCancelarBusquedaPress = () => {
    Keyboard.dismiss();

    if (this.state.cargando == true) {
      this.input._root.blur();
      return;
    }

    Animated.timing(this.animSugerencias, { toValue: 0, duration: 300 }).start();

    this.input._root.blur();
    this.setState({ buscando: false, busqueda: undefined });
  }


  onInputBusquedaChangeText = (text) => {
    this.setState({ busqueda: text });
  }

  buscar = () => {
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

  onMapaClick = (e) => {

    this.input._root.blur();
    let coordenadas = e.nativeEvent.coordinate;

    //Oculto la card del detalle
    Animated.spring(this.animCard, { toValue: 0 }).start();

    //Pongo cargando
    this.setState({
      cargando: true,
      data: undefined
    }, () => {
      Rules_Domicilio.validar(coordenadas.latitude, coordenadas.longitude)
        .then((data) => {

          data.Latitud = coordenadas.latitude;
          data.Longitud = coordenadas.longitude;

          this.setState({
            cargando: false,
            data: data
          }, () => {
            this.map.animateToRegion({
              latitude: coordenadas.latitude,
              longitude: coordenadas.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            })

            this.verDetalleMarcador();
          });
        })
        .catch((error) => {
          Alert.alert('', error);
          this.setState({ cargando: false });
        })
    });
  }

  verDetalleMarcador = () => {
    Animated.spring(this.animCard, { toValue: 1 }).start();
  }

  onBtnCancelarUbicacionClick = () => {
    Animated.spring(this.animCard, { toValue: 0 }).start();
    this.setState({
      data: undefined
    });
  }

  onBtnCancelarClick = () => {
    this.setState({
      cargarMapa: false
    }, () => {
      App.goBack();
    });
  }

  onBtnSeleccionarClick = () => {
    const { params } = this.props.navigation.state;

    this.setState({
      cargarMapa: false
    }, () => {
      if (params != undefined && params.onUbicacionSeleccionada != undefined) {
        params.onUbicacionSeleccionada(this.state.marcador);
        App.goBack();
      }
    });
  }
  render() {

    return (
      <View style={styles.contenedor}>

        <Card style={styles.contenedorBusqueda}>
          <Input ref={(ref) => { this.input = ref }}
            placeholder='Buscar...'
            value={this.state.busqueda}
            onChangeText={this.onInputBusquedaChangeText}
            style={styles.inputBusqueda}
            onFocus={this.onContenedorBusquedaPress} />


          <Animated.View
            pointerEvents={this.state.buscando == true ? 'auto' : 'none'}
            style={[
              styles.contenedorBtnCancelarBusqueda,
              {
                opacity: this.animSugerencias.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }]}>

            <Button
              transparent
              onPress={this.onBtnCancelarBusquedaPress}
              style={styles.btnCancelarBusqueda}>
              <Icon name="close" style={styles.btnCancelarBusquedaIcono} />
            </Button>
          </Animated.View>


          {this.state.cargando == true ? (
            <View style={{ position: 'absolute', right: 8, top: -12, zIndex: 20 }}>
              <Spinner color="green" />
            </View>
          ) : (<View />)}

        </Card>


        {this.state.cargarMapa ? (
          <View style={styles.contenedorMapa}>

            <MapView
              ref={map => { this.map = map }}
              style={styles.mapa}
              showsUserLocation={true}
              onPress={(e) => this.onMapaClick(e)}
              initialRegion={this.state.initialRegion}
            // onRegionChange={this.onRegionChange}
            >
              {this.state.data != undefined && (
                <Marker
                  // onPress={this.verDetalleMarcador}
                  onDragEnd={this.onMapaClick}
                  coordinate={{ latitude: this.state.data.Latitud, longitude: this.state.data.Longitud }}
                  title="Ubicacion seleccionada"
                />
              )}
            </MapView>
          </View>
        ) : (
            <View />
          )}

        {/* Button cancelar */}
        <Animated.View style={[styles.contenedorBotonCancelar, {
          transform: [
            {
              scale: this.animCard.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              })
            }
          ]
        }]}>

          <Button
            rounded
            style={styles.btnCancelar}
            onPress={this.onBtnCancelarClick}>
            <Icon name="close" style={{ fontSize: 24 }} />
          </Button>
        </Animated.View>



        {/* Card ubicacion */}
        <Animated.View
          pointerEvents={this.state.data == undefined ? 'none' : 'auto'}
          style={[styles.contenedorCard, {
            opacity: this.animCard,
            transform: [{
              translateY: this.animCard.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0]
              })
            }]
          }]}>

          <Card style={styles.card}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.05)', overflow: 'hidden', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
              <Text>Ubicación seleccionada</Text>
            </View>

            <View style={{ padding: 16 }}>

              <Text>CPC</Text>
              <Text>Nº 10 - Central</Text>
              <Text>Barrio</Text>
              <Text>Nueva Cordoba</Text>
            </View>

            <View style={{ padding: 16, paddingTop: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Button
                small
                bordered
                style={{ borderColor: 'rgba(100,100,100,1)', marginRight: 4 }}
                onPress={this.onBtnCancelarUbicacionClick}>
                <Text style={{ color: 'rgba(100,100,100,1)' }}>Cancelar</Text>
              </Button>
              <Button
                small
                style={{ marginLeft: 4, backgroundColor: 'green' }}
                onPress={this.onBtnSeleccionarClick}>
                <Text style={{ color: 'white' }}>Confirmar</Text>
              </Button>
            </View>

          </Card>
        </Animated.View>

        {/* Sugerencias */}
        <TouchableWithoutFeedback onPress={this.onBtnCancelarBusquedaPress}>
          <Animated.View
            pointerEvents={this.state.buscando == true ? 'auto' : 'none'}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: 'white',
              opacity: this.animSugerencias
            }}>
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'white' }}></View>
          </Animated.View>
        </TouchableWithoutFeedback>

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
  inputBusqueda: {
    marginRight: 48,
    marginLeft: 8,
  },
  contenedorBtnCancelarBusqueda: {
    position: 'absolute',
    right: 8,
    top: 8
  },
  btnCancelarBusqueda: {
    width: 32,
    height: 32,
    borderRadius: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnCancelarBusquedaIcono: {
    fontSize: 24,
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
  contenedorBotonCancelar: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  btnCancelar: {
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: 'rgba(100,100,100,1)',
    shadowRadius: 5,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 7 }
  },
  btnConfirmar: {
    margin: 8,
    backgroundColor: 'green'
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
  },
  contenedorCard: {
    margin: 16,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  card: {
    borderRadius: 16
  }
});

