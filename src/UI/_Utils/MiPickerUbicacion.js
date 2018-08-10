import React, { Component } from "react";
import {
  DeviceEventEmitter,
  View,
  Platform,
  Alert,
  StyleSheet,
  Animated,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { Card, FAB } from "react-native-paper";
import { Button, Text, Input, Spinner, ListItem, Textarea } from "native-base";

import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

//Mis compontenes
import App from "@UI/App";
import MiListado from "@Utils/MiListado";
import MiDialogo from "@Utils/MiDialogo";
import MiBoton from "@Utils/MiBoton";

import { toTitleCase } from "@Utils/Helpers";

var { RNLocation: Location } = require("NativeModules");

//Rules
import Rules_Domicilio from "@Rules/Rules_Domicilio";

export default class MiPickerUbicacion extends React.Component {
  static navigationOptions = {
    title: "Selecciona una ubicación",
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      cargando: false,
      mostrarPanelBusqueda: false,
      data: undefined,
      busqueda: undefined,
      posicionInicial: {
        latitude: -31.416293,
        longitude: -64.190841,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      },
      posicionGPS: undefined
    };

    this.animSugerencias = new Animated.Value(0);
    this.animCard = new Animated.Value(0);
    this.animInicio = new Animated.Value(0);
    this.animGPS = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.spring(this.animInicio, { toValue: 1, delay: 300, duration: 300, useNativeDriver: true }).start(() => {
      this.setState({ cargarMapa: true }, () => { });
    });
  }

  getCurrentPosition = () => {
    try {
      if (Platform.OS == "ios") {
        Location.startUpdatingLocation();
      } else {
        Location.startUpdatingLocation({});
      }
      DeviceEventEmitter.addListener("locationUpdated", location => {
        Location.stopUpdatingLocation();

        this.setState({
          posicionGPS: {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }
        });

        Animated.spring(this.animGPS, { toValue: 1, useNativeDriver: true }).start();
      });
    } catch (e) {
      alert(e.message || "");
    }
  }

  onMapReady = () => {
    this.getCurrentPosition();
  }

  onContenedorBusquedaPress = () => {
    if (this.state.cargando == true) {
      this.input._root.blur();
      Keyboard.dismiss();
      return;
    }

    this.setState({ mostrarPanelBusqueda: true, sugerencias: undefined });
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
    this.setState({ mostrarPanelBusqueda: false, busqueda: undefined, sugerencias: undefined });
  }

  onInputBusquedaChangeText = (text) => {
    this.setState({ busqueda: text });
  }

  buscar = () => {
    Animated.spring(this.animCard, { toValue: 0 }).start();

    this.setState({
      cargando: true,
      data: undefined,
      sugerencias: undefined
    }, () => {
      Rules_Domicilio.buscarSugerencias(this.state.busqueda)
        .then((data) => {
          if (data.length == 1) {
            this.setState({ cargando: false }, () => {
              this.onSugerenciaClick(data[0]);
            });
          } else {
            this.setState({ cargando: false, sugerencias: data });
          }
        }
        )
        .catch((error) => {
          this.setState({ cargando: false });
          Alert.alert("", error);
        });
    }
    );
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
      //BUsco en mi API
      Rules_Domicilio.validar(coordenadas.latitude, coordenadas.longitude)
        .then(data => {
          this.setState({
            cargando: false,
            data: data
          }, () => {
            //Mando a ver el detalle
            this.verDetalleMarcador();
          });
        })
        .catch((error) => {
          Alert.alert("", error);
          this.setState({ cargando: false });
        });
    });
  }

  onSugerenciaClick = (sugerencia) => {
    if (sugerencia == undefined) return;
    this.onBtnCancelarBusquedaPress();

    //Pongo cargando
    this.setState({
      data: sugerencia
    }, () => {
      this.verDetalleMarcador();
    });
  }

  verDetalleMarcador = () => {
    try {
      //Muevo el mapa
      this.map.animateToRegion({
        latitude: parseFloat(this.state.data.latitud.replace(",", ".")),
        longitude: parseFloat(this.state.data.longitud.replace(",", ".")),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });

      Animated.spring(this.animCard, { toValue: 1 }).start();
    } catch (ex) {
      Alert.alert("", "Error procesando la solicitud");
    }
  }

  onBtnCancelarUbicacionClick = () => {
    Animated.spring(this.animCard, { toValue: 0 }).start();
    this.setState({
      data: undefined
    });
  }

  onBtnCancelarClick = () => {
    App.goBack();
  }

  onBtnSeleccionarClick = () => {
    if (this.state.data.observaciones == undefined || this.state.data.observaciones == "") {
      this.mostrarDialogoObservaciones();
      return;
    }

    this.onUbicacionReady();
  }

  onUbicacionReady = () => {
    const { params } = this.props.navigation.state;

    if (params != undefined && params.onUbicacionSeleccionada != undefined) {
      params.onUbicacionSeleccionada(this.state.data);
    }

    App.goBack();
  }

  onMapaRef = (ref) => {
    this.map = ref;
  }

  onMapaRegionChange = (region) => {
    this.setState({ region: region });
  }

  mostrarDialogoObservaciones = () => {
    if (this.state.data == undefined) return;
    this.setState({ dialogoObservacionesVisible: true }, () => {
      if (this.inputObservaciones != undefined) {
        this.inputObservaciones._root.focus();
      }
    });
  }

  ocultarDialogoObservaciones = () => {
    this.setState({ dialogoObservacionesVisible: false });
  }

  onDialogoObservacionesBotonAceptarPress = () => {
    if (this.state.data == undefined) return;
    if (this.state.data.observaciones == undefined || this.state.data.observaciones == "") return;
    this.ocultarDialogoObservaciones();
    this.onUbicacionReady();
  }

  onDialogoObservacionesBotonCancelarPress = () => {
    let data = this.state.data;
    if (data != undefined) {
      data.observaciones = undefined;
    }
    this.setState({ data: data });
    this.ocultarDialogoObservaciones();
  }

  onObservacionesChange = (val) => {
    let data = this.state.data;
    if (data == undefined) return;
    data.observaciones = val;
    this.setState({ data: data });
  }

  centrar = () => {
    if (this.state.posicionGPS == undefined) return;
    this.map.animateToRegion(this.state.posicionGPS);
  }

  onInputRef = (ref) => {
    this.input = ref;
  }


  render() {
    const initData = global.initData;

    return (
      <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>
        {/* Encabezado */}
        {this.renderEncabezado()}

        {/* mapa */}
        {this.renderMapa()}

        {/* Dialogo observaciones  */}
        {this.renderDialogoObservaciones()}

        {/* FAB */}
        {this.renderFAB()}

        {/* Card ubicacion */}
        {this.renderCard()}

        {/* Sugerencias */}
        {this.renderSugerencias()}
      </View>
    );
  }

  renderEncabezado() {
    let padding = Platform.OS == "ios" ? 36 : 16;
    return (
      <Animated.View
        style={{
          padding: 16,
          paddingTop: padding,
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          zIndex: 20,
          backgroundColor: "transparent",
          opacity: this.animInicio,
          transform: [
            {
              translateY: this.animInicio.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0]
              })
            }
          ]
        }}
      >
        <Card style={[styles.contenedorBusqueda]}>
          <Button transparent rounded style={styles.botonVolver} onPress={this.onBtnCancelarClick}>
            <Icon name="arrow-left" style={{ fontSize: 24 }} />
          </Button>
          <Input
            ref={this.onInputRef}
            placeholder="Buscar..."
            value={this.state.busqueda}
            returnKeyType="done"
            keyboardType="default"
            onSubmitEditing={this.buscar}
            onChangeText={this.onInputBusquedaChangeText}
            style={styles.inputBusqueda}
            onFocus={this.onContenedorBusquedaPress}
          />

          <Animated.View
            pointerEvents={this.state.mostrarPanelBusqueda == true ? "auto" : "none"}
            style={[
              styles.contenedorBtnCancelarBusqueda,
              {
                opacity: this.animSugerencias.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }
            ]}
          >
            {this.state.cargando == false && (
              <Button transparent onPress={this.onBtnCancelarBusquedaPress} style={styles.btnCancelarBusqueda}>
                <Icon name="close" style={styles.btnCancelarBusquedaIcono} />
              </Button>
            )}
          </Animated.View>

          {this.state.cargando == true ? (
            <View style={{ position: "absolute", right: 12, top: -14, zIndex: 20 }}>
              <Spinner color="green" />
            </View>
          ) : (
              <View />
            )}
        </Card>
      </Animated.View>
    );
  }

  renderMapa() {
    if (this.state.posicionInicial == undefined || this.state.cargarMapa != true) return null;

    return (
      <View style={styles.contenedorMapa}>
        <MapView
          ref={this.onMapaRef}
          style={styles.mapa}
          onMapReady={this.onMapReady}
          showsUserLocation={true}
          onPress={this.onMapaClick}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          initialRegion={this.state.posicionInicial}
        >
          {this.state.data != undefined && (
            <Marker
              // onPress={this.verDetalleMarcador}
              onDragEnd={this.onMapaClick}
              coordinate={{
                latitude: parseFloat(this.state.data.latitud.replace(",", ".")) || 0,
                longitude: parseFloat(this.state.data.longitud.replace(",", ".")) || 0
              }}
              title="Ubicacion seleccionada"
            />
          )}
        </MapView>
      </View>
    );
  }

  renderCard() {
    const initData = global.initData;

    let direccion = "";
    if (this.state.data != undefined && this.state.data.direccion != undefined && this.state.data.direccion != "") {
      direccion =
        (this.state.data.sugerido == true ? "Aprox. en " : "") + toTitleCase(this.state.data.direccion.trim());
    }

    let descripcion = "";
    if (
      this.state.data != undefined &&
      this.state.data.observaciones != undefined &&
      this.state.data.observaciones != ""
    ) {
      descripcion = this.state.data.observaciones.trim();
    }
    if (this.state.dialogoObservacionesVisible == true) {
      descripcion = "";
    }

    let cpcNombre = "";
    if (this.state.data != undefined && this.state.data.cpc != undefined) {
      cpcNombre = "Nº " + this.state.data.cpc.numero + " - " + toTitleCase(this.state.data.cpc.nombre).trim();
    }

    let barrioNombre = "";
    if (this.state.data != undefined && this.state.data.barrio != undefined) {
      barrioNombre = toTitleCase(this.state.data.barrio.nombre).trim();
    }

    return (
      <Animated.View
        pointerEvents={this.state.data == undefined ? "none" : "auto"}
        style={[
          styles.contenedorCard,
          {
            opacity: this.animCard,
            transform: [
              {
                translateY: this.animCard.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0]
                })
              }
            ]
          }
        ]}
      >
        <Card style={styles.card}>
          <View
            style={{
              overflow: "hidden",
              padding: 16,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              borderBottomColor: "rgba(0,0,0,0.1)",
              borderBottomWidth: 2,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16
            }}
          >
            <Icon name="map-marker" style={{ fontSize: 24, marginRight: 8 }} />
            <Text>Ubicación seleccionada</Text>
          </View>

          <View style={{ padding: 16 }}>
            {/* Direccion */}
            <Text style={{ fontWeight: "bold" }}>{texto_CardDireccion}</Text>
            <Text>{direccion}</Text>

            {/* Observaciones */}
            {descripcion != undefined &&
              descripcion != "" && (
                <View>
                  <Text style={{ fontWeight: "bold", marginTop: 8 }}>{texto_CardTitulo}</Text>
                  <Text>{descripcion}</Text>
                </View>
              )}

            {/* <View style={{ display: "flex", flexDirection:'row' }}>
              <View style={{flex:1}}>
                <Text style={{ fontWeight: "bold", marginTop: 8 }}>CPC</Text>
                <Text>{cpcNombre}</Text>
              </View>

              <View style={{flex:1}}>
                <Text style={{ fontWeight: "bold", marginTop: 8 }}>Barrio</Text>
                <Text>{barrioNombre}</Text>
              </View>
            </View> */}
          </View>

          <View style={{ height: 1, width: "100%", backgroundColor: "rgba(0,0,0,0.1)" }} />
          <View
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "flex-end"
            }}
          >

            <MiBoton
              rounded
              gris
              onPress={this.onBtnCancelarUbicacionClick}
              texto={texto_BotonCancelar}
              small
            />

            <View style={{ width: 8 }} />
            <MiBoton
              rounded
              verde
              sombra
              onPress={this.onBtnSeleccionarClick}
              texto={texto_BotonConfirmar}
              small
            />

          </View>
        </Card>
      </Animated.View>
    );
  }

  onInputObservacionesRef = (ref) => {
    this.inputObservaciones = ref;
  }

  ocultarTeclado = () => {
    Keyboard.dismiss();
  }

  renderDialogoObservaciones() {
    let val = "";
    if (this.state.data != undefined) {
      val = this.state.data.observaciones;
    }
    return (
      <MiDialogo
        titulo={texto_DialogoObservacionesTitulo}
        onDismiss={this.ocultarDialogoObservaciones}
        cancelable={false}
        botones={[
          {
            texto: "Cancelar",
            onPress: this.onDialogoObservacionesBotonCancelarPress
          },
          {
            texto: "Aceptar",
            onPress: this.onDialogoObservacionesBotonAceptarPress
          }
        ]}
        visible={this.state.dialogoObservacionesVisible}
      >
        <Textarea
          ref={this.onInputObservacionesRef}
          placeholder={texto_HintObservaciones}
          onSubmitEditing={this.ocultarTeclado}
          value={val}
          placeholderTextColor="rgba(150,150,150,1)"
          rowSpan={5}
          onChangeText={this.onObservacionesChange}
        />
      </MiDialogo>
    );
  }

  renderFAB() {
    const initData = global.initData;

    return (
      <Animated.View
        pointerEvents={this.state.posicionGPS == undefined ? "none" : "auto"}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          padding: 20,
          opacity: this.animGPS,
          transform: [{ scale: this.animGPS }]
        }}
      >
        <FAB icon="gps-fixed" style={{ backgroundColor: "white" }} color={initData.colorVerde} onPress={this.centrar} />
      </Animated.View>
    );
  }

  renderSugerenciaItem = (item) => {
    return <MiPickerUbicacionItem onPress={this.onSugerenciaClick} data={item.item} />;
  }

  renderSugerencias() {
    return (
      <TouchableWithoutFeedback onPress={this.onBtnCancelarBusquedaPress}>
        <Animated.View
          pointerEvents={this.state.mostrarPanelBusqueda == true ? "auto" : "none"}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: initData.backgroundColor,
            opacity: this.animSugerencias
          }}
        >
          <View style={{ position: "absolute", left: 0, right: 0, top: 104, bottom: 0 }}>
            {this.state.sugerencias != undefined && this.state.sugerencias.length == 0 && <Text>Sin resultado</Text>}

            {this.state.sugerencias != undefined &&
              this.state.sugerencias.length != 0 && (
                <MiListado
                  backgroundColor={initData.backgroundColor}
                  data={this.state.sugerencias}
                  renderItem={this.renderSugerenciaItem}
                />
              )}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

class MiPickerUbicacionItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  onPress = () => {
    if (this.props == undefined) return;
    this.props.onPress(this.props.data);
  }

  render() {
    let item = this.props.data;

    return (
      <ListItem style={{ paddingLeft: 8, paddingRight: 8 }} onPress={this.onPress}>
        <View style={{ display: "flex", width: "100%" }}>
          {item.observaciones != undefined &&
            item.observaciones != "" && (
              <Text style={{ alignSelf: "flex-start", fontWeight: "bold" }}>
                {toTitleCase(item.observaciones).trim()}
              </Text>
            )}
          <Text style={{ alignSelf: "flex-start" }}>{toTitleCase(item.direccion).trim()}</Text>
        </View>
      </ListItem>
    );
  }
}

const styles = StyleSheet.create({
  contenedorBusqueda: {
    borderRadius: 32,
    shadowColor: "rgba(100,100,100,1)",
    shadowRadius: 5,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 7 }
  },
  botonVolver: {
    position: "absolute",
    zIndex: 2,
    minWidth: 48,
    top: 2,
    width: 48,
    minHeight: 48,
    height: 48,
    display: "flex",
    justifyContent: "center"
  },
  inputBusqueda: {
    flex: 1,
    marginLeft: 48
  },
  contenedorBtnCancelarBusqueda: {
    position: "absolute",
    right: 16,
    top: 10
  },
  btnCancelarBusqueda: {
    width: 32,
    height: 32,
    borderRadius: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  btnCancelarBusquedaIcono: {
    fontSize: 24
  },
  contenedor: {
    height: "100%",
    width: "100%"
  },
  contenedorMapa: {
    width: "100%",
    height: "100%"
  },
  mapa: {
    flex: 1,
    width: "100%",
    ...StyleSheet.absoluteFillObject
  },
  contenedorBotonCancelar: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center"
  },
  btnCancelar: {
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "rgba(100,100,100,1)",
    shadowRadius: 5,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 7 }
  },
  btnConfirmar: {
    margin: 8,
    backgroundColor: "green"
  },
  contenedorSurgerencias: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%"
  },
  contenedorSugerencias_Card: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 80,
    height: 100
  },
  contenedorCard: {
    margin: 16,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  },
  card: {
    borderRadius: 16
  },
  contenedorBuscandoUbicacion: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    display: "flex",
    zIndex: 200,
    justifyContent: "center",
    alignItems: "center"
  }
});

const texto_BotonConfirmar = "Confirmar";
const texto_BotonCancelar = "Cancelar";
const texto_DialogoObservacionesTitulo = "Observaciones del domicilio";
const texto_HintObservaciones =
  "Indique información complementaria sobre el domicilio seleccionado. Ejemplo: 'Manzana J Casa 3' o bien 'Frente a un local comercial'";
const texto_BuscandoUbicacion = "Buscando su ubicación...";
const texto_CardTitulo = "Observaciones del domicilio";
const texto_CardDireccion = "Dirección";
