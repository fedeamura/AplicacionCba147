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
  Spinner,
  ListItem
} from "native-base";

import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import autobind from 'autobind-decorator'

//Mis compontenes
import App from "@UI/App";
import MiListado from "@Utils/MiListado";
import MiDialogo from "@Utils/MiDialogo";
import { toTitleCase } from "@Utils/Helpers";

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

  @autobind
  onContenedorBusquedaPress() {

    if (this.state.cargando == true) {
      this.input._root.blur();
      Keyboard.dismiss();
      return;
    }

    this.setState({ mostrarPanelBusqueda: true, sugerencias: undefined })
    Animated.timing(this.animSugerencias, { toValue: 1, duration: 300 }).start();
  }

  @autobind
  onBtnCancelarBusquedaPress() {
    Keyboard.dismiss();

    if (this.state.cargando == true) {
      this.input._root.blur();
      return;
    }

    Animated.timing(this.animSugerencias, { toValue: 0, duration: 300 }).start();

    this.input._root.blur();
    this.setState({ mostrarPanelBusqueda: false, busqueda: undefined, sugerencias: undefined });
  }

  @autobind
  onInputBusquedaChangeText(text) {
    this.setState({ busqueda: text });
  }

  @autobind
  buscar() {
    Animated.spring(this.animCard, { toValue: 0 }).start();

    this.setState({
      cargando: true,
      data: undefined,
      sugerencias: undefined
    }, function () {
      Rules_Domicilio.buscarSugerencias(this.state.busqueda)
        .then(function (data) {

          if (data.length == 1) {
            this.setState({ cargando: false }, function () {
              this.onSugerenciaClick(data[0]);
            }.bind(this));
          } else {
            this.setState({ cargando: false, sugerencias: data });
          }
        }.bind(this))
        .catch(function (error) {
          this.setState({ cargando: false });
          Alert.alert('', error);
        }.bind(this))
    }.bind(this));
  }

  @autobind
  onMapaClick(e) {

    this.input._root.blur();
    let coordenadas = e.nativeEvent.coordinate;

    //Oculto la card del detalle
    Animated.spring(this.animCard, { toValue: 0 }).start();

    //Pongo cargando
    this.setState({
      cargando: true,
      data: undefined
    }, function () {
      //BUsco en mi API
      Rules_Domicilio.validar(coordenadas.latitude, coordenadas.longitude)
        .then((data) => {

          this.setState({
            cargando: false,
            data: data
          }, function () {
            if (data.observaciones == undefined || data.observaciones.trim() == "") {
              this.mostrarDialogoObservaciones();
            } else {

              //Mando a ver el detalle
              this.verDetalleMarcador();
            }
          }.bind(this));
        })
        .catch(function (error) {
          Alert.alert('', error);
          this.setState({ cargando: false });
        }.bind(this))
    }.bind(this));
  }

  @autobind
  onSugerenciaClick(sugerencia) {
    if (sugerencia == undefined) return;
    this.onBtnCancelarBusquedaPress();

    //Pongo cargando
    this.setState({
      data: sugerencia
    }, function () {
      if (sugerencia.observaciones == undefined || sugerencia.observaciones.trim() == "") {
        this.mostrarDialogoObservaciones();
      } else {
        //Oculto la card del detalle
        this.verDetalleMarcador();
      }
    }.bind(this));
  }

  @autobind
  verDetalleMarcador() {
    //Muevo el mapa
    this.map.animateToRegion({
      latitude: parseFloat(this.state.data.latitud.replace(',', '.')),
      longitude: parseFloat(this.state.data.longitud.replace(',', '.')),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    Animated.spring(this.animCard, { toValue: 1 }).start();
  }

  @autobind
  onBtnCancelarUbicacionClick() {
    Animated.spring(this.animCard, { toValue: 0 }).start();
    this.setState({
      data: undefined
    });
  }

  @autobind
  onBtnCancelarClick() {
    this.setState({
      cargarMapa: false
    }, function () {
      App.goBack();
    }.bind(this));
  }

  @autobind
  onBtnSeleccionarClick() {
    const { params } = this.props.navigation.state;

    this.setState({
      cargarMapa: false
    }, function () {
      if (params != undefined && params.onUbicacionSeleccionada != undefined) {
        params.onUbicacionSeleccionada(this.state.data);
        App.goBack();
      }
    }.bind(this));
  }

  @autobind
  onMapaRef(ref) {
    this.map = ref
  }

  @autobind
  mostrarDialogoObservaciones() {
    if (this.state.data == undefined) return;
    this.setState({ dialogoObservacionesVisible: true });
  }

  @autobind
  ocultarDialogoObservaciones() {
    this.setState({ dialogoObservacionesVisible: false });
  }

  @autobind
  onDialogoObservacionesBotonAceptarPress() {
    if (this.state.data == undefined) return;
    if (this.state.data.observaciones == undefined || this.state.data.observaciones == "") return;
    this.ocultarDialogoObservaciones();
    this.verDetalleMarcador();
  }

  @autobind
  onObservacionesChange(val) {
    let data = this.state.data;
    if (data == undefined) return;
    data.observaciones = val;
    this.setState({ data: data });
  }


  render() {

    const initData = global.initData;

    return (
      <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>

        <Card style={[styles.contenedorBusqueda]}>
          <Input ref={(ref) => { this.input = ref }}
            placeholder='Buscar...'
            value={this.state.busqueda}
            returnKeyType="done"
            keyboardType="default"
            onSubmitEditing={this.buscar}
            onChangeText={this.onInputBusquedaChangeText}
            style={styles.inputBusqueda}
            onFocus={this.onContenedorBusquedaPress} />


          <Animated.View
            pointerEvents={this.state.mostrarPanelBusqueda == true ? 'auto' : 'none'}
            style={[
              styles.contenedorBtnCancelarBusqueda,
              {
                opacity: this.animSugerencias.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }]}>

            {this.state.cargando == false && (
              <Button
                transparent
                onPress={this.onBtnCancelarBusquedaPress}
                style={styles.btnCancelarBusqueda}>
                <Icon name="close" style={styles.btnCancelarBusquedaIcono} />
              </Button>
            )}
          </Animated.View>


          {this.state.cargando == true ? (
            <View style={{ position: 'absolute', right: 12, top: -14, zIndex: 20 }}>
              <Spinner color="green" />
            </View>
          ) : (<View />)}

        </Card>


        {this.state.cargarMapa ? (
          <View style={styles.contenedorMapa}>

            <MapView
              ref={this.onMapaRef}
              style={styles.mapa}
              showsUserLocation={true}
              onPress={this.onMapaClick}
              initialRegion={this.state.initialRegion}
            // onRegionChange={this.onRegionChange}
            >
              {this.state.data != undefined && (
                <Marker
                  // onPress={this.verDetalleMarcador}
                  onDragEnd={this.onMapaClick}
                  coordinate={{
                    latitude: parseFloat(this.state.data.latitud.replace(',', '.')) || 0,
                    longitude: parseFloat(this.state.data.longitud.replace(',', '.')) || 0
                  }}
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
        {this.renderCard()}

        {/* Sugerencias */}
        {this.renderSugerencias()}

        {/* Dialogo observaciones  */}
        {this.renderDialogoObservaciones()}
      </View >
    );
  }

  renderCard() {
    let direccion = '';
    if (this.state.data != undefined && this.state.data.direccion != undefined && this.state.data.direccion != "") {
      direccion = (this.state.data.sugerido == true ? 'Aproximadamente en ' : '') + toTitleCase(this.state.data.direccion.trim());
    }

    let descripcion = '';
    if (this.state.data != undefined && this.state.data.observaciones != undefined && this.state.data.observaciones != "") {
      descripcion = this.state.data.observaciones.trim();
    }

    let cpcNombre = '';
    if (this.state.data != undefined && this.state.data.cpc != undefined) {
      cpcNombre = 'Nº ' + this.state.data.cpc.numero + ' - ' + toTitleCase(this.state.data.cpc.nombre).trim();
    }

    let barrioNombre = '';
    if (this.state.data != undefined && this.state.data.barrio != undefined) {
      barrioNombre = toTitleCase(this.state.data.barrio.nombre).trim();
    }
    return <Animated.View
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
        {/* <View style={{ backgroundColor: 'rgba(0,0,0,0.05)', overflow: 'hidden', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <Text>Ubicación seleccionada</Text>
        </View> */}

        <View style={{ padding: 16 }}>

          {/* Direccion */}
          <Text style={{ fontWeight: 'bold' }}>Dirección</Text>
          <Text>{direccion}</Text>

          {/* Cpc */}
          <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Descripción</Text>
          <Text>{descripcion}</Text>

          {/* Cpc */}
          {/* <Text style={{ fontWeight: 'bold', marginTop: 8 }}>CPC</Text>
          <Text>{cpcNombre}</Text> */}

          {/* Barrio */}
          {/* <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Barrio</Text>
          <Text>{barrioNombre}</Text> */}
        </View>

        <View style={{ height: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.1)' }} />
        <View style={{ padding: 16, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          <Button
            small
            bordered
            rounded
            style={{ borderColor: 'rgba(100,100,100,1)', marginRight: 4 }}
            onPress={this.onBtnCancelarUbicacionClick}>
            <Text style={{ color: 'rgba(100,100,100,1)' }}>Cancelar</Text>
          </Button>
          <Button
            small
            bordered
            rounded
            style={{ marginLeft: 4, borderColor: 'green' }}
            onPress={this.onBtnSeleccionarClick}>
            <Text style={{ color: 'green' }}>Confirmar</Text>
          </Button>
        </View>

      </Card>
    </Animated.View>
  }

  renderDialogoObservaciones() {
    let val = '';
    if (this.state.data != undefined) {
      val = this.state.data.observaciones;
    }
    return <MiDialogo
      titulo="Describa su ubicación"
      onDismiss={this.ocultarDialogoObservaciones}
      cancelable={false}
      botones={[
        {
          texto: 'Aceptar',
          onPress: () => {
            this.onDialogoObservacionesBotonAceptarPress()
          }
        }
      ]}
      visible={this.state.dialogoObservacionesVisible}>
      <Input placeholder="Ingrese su descripción..." value={val} onChangeText={this.onObservacionesChange}></Input>
    </MiDialogo>
  }

  renderSugerencias() {
    return <TouchableWithoutFeedback onPress={this.onBtnCancelarBusquedaPress}>
      <Animated.View
        pointerEvents={this.state.mostrarPanelBusqueda == true ? 'auto' : 'none'}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: initData.backgroundColor,
          opacity: this.animSugerencias
        }}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 104, bottom: 0 }}>

          {(this.state.sugerencias != undefined && this.state.sugerencias.length == 0) && (
            <Text>Sin resultado</Text>
          )}

          {(this.state.sugerencias != undefined && this.state.sugerencias.length != 0) && (
            <MiListado
              backgroundColor={initData.backgroundColor}
              data={this.state.sugerencias}
              renderItem={(item) => {
                return (<ListItem
                  style={{ paddingLeft: 8, paddingRight: 8 }}
                  onPress={() => { this.onSugerenciaClick(item.item) }}>

                  <View style={{ display: 'flex', width: '100%' }}>
                    {item.item.observaciones != undefined && item.item.observaciones != "" && (
                      <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold' }}>{toTitleCase(item.item.observaciones).trim()}</Text>
                    )}
                    <Text style={{ alignSelf: 'flex-start' }}>{toTitleCase(item.item.direccion).trim()}</Text>
                  </View>

                </ListItem>);
              }}
            />
          )}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  }
}

const styles = StyleSheet.create({
  contenedorBusqueda: {
    position: 'absolute',
    borderRadius: 32,
    paddingLeft: 16,
    left: 16,
    right: 16,
    top: 32,
    zIndex: 10,
    shadowColor: 'rgba(100,100,100,1)',
    shadowRadius: 5,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 7 }
  },
  inputBusqueda: {
    marginRight: 48,
    marginLeft: 8,
  },
  contenedorBtnCancelarBusqueda: {
    position: 'absolute',
    right: 16,
    top: 10
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

