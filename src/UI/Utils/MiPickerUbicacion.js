import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Alert
} from "react-native";
import { Text } from "native-base";
import {
  Toolbar,
  ToolbarContent,
  ToolbarAction,
  Button,
  SearchBar
} from "react-native-paper";
// import MapView from 'react-native-maps';
// import { Marker } from 'react-native-maps';

//Mis compontenes
import AppStyles from "Cordoba/src/UI/Styles/default";
import MiToolbar from "Cordoba/src/UI/Utils/MiToolbar";

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
      }
    }
  }

  componentDidMount() {

  }

  onRegionChange(region) {
    this.setState({ posicion: region });
  }

  buscar() {
    if (this.state.busqueda == undefined || this.state.busqueda == "") return;

    // try {
    //   RNGooglePlaces.getAutocompletePredictions(this.state.busqueda, {
    //     type: 'address',
    //     country: 'AR'
    //   })
    //     .then((results) => { console.log(results); })
    //     .catch((error) => console.log(error.message));
    // } catch (e) {
    //   console.log(e);
    //   Alert.alert("Error procesando la solicitud. Por favor intente nuevamente.");
    // }
  }

  onMapaClick(coordenadas) {
    this.setState({ marcador: coordenadas })
  }

  render() {
    const { goBack } = this.props.navigation;
    const { params } = this.props.navigation.state;

    return (
      <View style={styles.contenedor}>

        <SearchBar
          style={styles.contenedorBusqueda}
          placeholder="Buscar..."
          onChangeText={query => { this.setState({ busqueda: query }, () => { this.buscar(); }); }}
          value={this.state.busqueda}
        />

        {/* <MapView
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
        </MapView> */}

        {this.state.marcador != undefined && (
          < Button onPress={() => {
            if (params != undefined && 'onUbicacionSeleccionada' in params) {
              params.onUbicacionSeleccionada(this.state.marcador);
            }
            goBack();
          }}
            raised style={styles.btnConfirmar}>Confirmar ubicación</Button>
        )}

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
  mapa: {
    flex: 1,
    width: '100%',
    ...StyleSheet.absoluteFillObject
  },
  btnConfirmar: {
    position: 'absolute',
    bottom: 16,
    left: 32, right: 32
  }
});
