import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  FlatList,
  Animated,
  LayoutAnimation,
  NativeModules,
  UIManager,
  Image,
  Dimensions,
  StatusBar,
  BackHandler,
  Alert,
  ScrollView
} from "react-native";
import { Spinner } from "native-base";
import {
  Button,
  ToolbarContent
} from "react-native-paper";
const { StatusBarManager } = NativeModules;
import Interactable from 'react-native-interactable';
import ExtraDimensions from 'react-native-extra-dimensions-android';

//Mios
import App from "@UI/App";
import AppTheme from "@UI/AppTheme";
import ListadoItem from "Cordoba/src/UI/Home/ListadoItem";
import ListadoItemSeparator from "Cordoba/src/UI/Home/ListadoItemSeparator";
import IndicadorCargando from "@Utils/IndicadorCargando";
import MiToolbar from "@Utils/MiToolbar";
import MiListado from "@Utils/MiListado";
import MiFAB from "@Utils/MiFAB";

//Rules
import Rules_Requerimiento from "Cordoba/src/Rules/Rules_Requerimiento";
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

const PANEL_DETALLE_REQUERIMIENTO_HEADER_H = 48;
const PANEL_DETALLE_REQUERIMIENTO_MARGIN_TOP = 32;

const PANEL_DETALLE_REQUERIMIENTO_H = Screen.height - ExtraDimensions.get('STATUS_BAR_HEIGHT') - PANEL_DETALLE_REQUERIMIENTO_HEADER_H - PANEL_DETALLE_REQUERIMIENTO_MARGIN_TOP;

const refListado = "listado";

export default class Inicio extends React.Component {
  static navigationOptions = {
    title: "Mis requerimientos",
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      listado: {
        data: [],
        index: 0,
        error: undefined,
        loading: false
      },
      viendoDetalle: false
    };

    this._deltaY = new Animated.Value(Screen.height);
  }

  handleBackButtonClick() {
    if (this.state.viendoDetalle) {
      this.setState({
        viendoDetalle: false
      }, () => {
        this.refs['animNuevo'].snapTo({ index: 1 });
      })
      return true;
    }

    return false;
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
    this.actualizar();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
  }

  actualizar() {
    this.setState(
      {
        listado: {
          ...this.state.listado,
          error: undefined,
          loading: true
        }
      }, () => {

        Rules_Requerimiento.get()
          .then((data) => {
            if (this.listado != undefined) {
              this.listado.scrollToOffset({ y: 0, animated: false });
            }

            let items = data.sort(function (a, b) {
              return b.Id - a.Id;
            })

            this.setState({
              listado: {
                ...this.state.listado,
                loading: false,
                data: items
              }
            });
          })
          .catch((error) => {
            this.setState({
              listado: {
                ...this.state.listado,
                loading: false,
                error: error
              }
            });
          });
      });
  }

  abrirNuevo() {
    App.navegar("Nuevo");
  }

  abrirDetalle(id) {
    App.navegar("Detalle");
  }

  cerrarSesion() {
    Rules_Usuario.cerrarSesion()
      .then(() => {
        App.replace('Login');
      }).catch(() => {
        Alert.alert('Error procesando la solicitud');
      });
  }

  onPanelDetalleSnap(e) {
    const snapPointId = e.nativeEvent.id;
    if (snapPointId == "cerrado") {
      this.setState({
        viendoDetalle: false
      });
    }
  }

  render() {
    return (
      <View
        style={styles.contenedor}
        onLayout={() => {
          this.refs['animNuevo'].snapTo({ index: 1 });
        }}
        pointerEvents={this.state.animando ? "none" : "auto"}
      >
        <MiToolbar
          left={{
            icon: "menu",
            onClick: () => {
              App.navegar('Ajustes');
            }
          }}
          right={[
            {
              icon: "sort",
              onClick: () => {
                // Alert.alert('Ordenar listado', "",  [
                //   {text: 'Fecha Creacion', onPress: () => console.log('Ask me later pressed')},
                //   {text: 'Numero', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                // ]);
              }
            },
            {
              icon: "refresh",
              onClick: () => {
                this.actualizar();
              }
            }
          ]}
        >
          <ToolbarContent title="Mis requerimientos" />
        </MiToolbar>

        <View style={styles.mainContent}>

          <View style={styles.contentListado}>
            <MiListado
              refListado={(ref) => {
                this.listado = ref;
              }}
              style={[styles.listado]}
              data={this.state.listado.data}
              cargando={this.state.listado.loading}
              keyExtractor={item => item.Id.toString()}
              renderItem={({ item, index }) => (
                <ListadoItem
                  data={item}
                  index={index}
                  conFab={true}
                  count={this.state.listado.data.length}
                  onClick={(data, dimensions, index) => {
                    this.setState({
                      viendoDetalle: true
                    }, () => {
                      this.refs['animNuevo'].snapTo({ index: 0 });
                    });
                  }}
                />
              )}
            />

            <MiFAB
              visible={!this.state.listado.loading}
              icon="add"
              onPress={() => {
                this.abrirNuevo();
              }}
            />

          </View>

          {/* Error */}
          {this.state.listado.error != undefined && (
            <Text>{this.state.listado.error}</Text>
          )}
        </View>

        <View style={styles.contenedor_Panel_DetalleRequerimiento} pointerEvents={'box-none'}>
          <Animated.View
            pointerEvents={'box-none'}
            style={[styles.contenedor_Panel_DetalleRequerimiento_Sombra, {
              opacity: this._deltaY.interpolate({
                inputRange: [0, Screen.height],
                outputRange: [0.5, 0],
                extrapolateRight: 'clamp'
              })
            }]} />
          <Interactable.View
            ref='animNuevo'
            verticalOnly={true}
            snapPoints={[{ y: 0, id: 'abierto' }, { y: Screen.height, id: 'cerrado' }]}
            boundaries={{ top: -300 }}
            initialPosition={{ y: Screen.height }}
            onSnap={(e) => this.onPanelDetalleSnap(e)}
            animatedValueY={this._deltaY}
          >
            <View style={styles.contenedor_Panel_DetalleRequerimiento_Contenido}>
              <View style={styles.contenedor_Panel_DetalleRequerimiento_Contenido_Header}>
                <View style={styles.contenedor_Panel_DetalleRequerimiento_Contenido_Header_Handle} />
              </View>
              <View style={styles.contenedor_Panel_DetalleRequerimiento_Contenido_ContenedorScroll}>
                <ScrollView style={styles.contenedor_Panel_DetalleRequerimiento_Contenido_ContenedorScroll_Scroll}>
                  <View style={styles.contenedor_Panel_DetalleRequerimiento_Contenido_ContenedorScroll_Scroll_Contenido}>
                    <Text style={styles.panelTitle}>San Francisco Airport</Text>
                    <Text style={styles.panelSubtitle}>International Airport - 40 miles away</Text>
                    <Text>Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola </Text>
                  </View>

                </ScrollView>
              </View>

            </View>
          </Interactable.View>
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    display: "flex",
    height: "100%",
    flexDirection: "column"
  },
  mainContent: {
    position: 'relative',
    width: '100%',
    flex: 1
  },
  contentListado: {
    width: '100%',
    height: '100%'
  },
  listado: {
    backgroundColor: global.styles.colorFondo
  },
  indicadorCargando: {
    position: 'absolute',
    left: 0,
    backgroundColor: global.styles.colorFondo,
    width: '100%',
    height: '100%',
    top: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contenedor_Panel_DetalleRequerimiento: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 16
  },
  contenedor_Panel_DetalleRequerimiento_Sombra: {
    position: 'absolute',
    backgroundColor: 'black',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  contenedor_Panel_DetalleRequerimiento_Contenido: {
    marginTop: PANEL_DETALLE_REQUERIMIENTO_MARGIN_TOP,
    height: Screen.height + Screen.height,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.4,
    zIndex: 10
  },
  contenedor_Panel_DetalleRequerimiento_Contenido_ContenedorScroll: {
    height: PANEL_DETALLE_REQUERIMIENTO_H
  },
  contenedor_Panel_DetalleRequerimiento_Contenido_ContenedorScroll_Scroll: {

  },
  contenedor_Panel_DetalleRequerimiento_Contenido_ContenedorScroll_Scroll_Contenido: {
    margin: 16
  },
  contenedor_Panel_DetalleRequerimiento_Contenido_Header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: PANEL_DETALLE_REQUERIMIENTO_HEADER_H,
  },
  contenedor_Panel_DetalleRequerimiento_Contenido_Header_Handle: {
    width: 48,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040'
  },
  panelTitle: {
    fontSize: 27,
    height: 35
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#318bfb',
    alignItems: 'center',
    marginVertical: 10
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white'
  },
  photo: {
    width: Screen.width - 40,
    height: 225,
    marginTop: 30
  },
  map: {
    height: Screen.height,
    width: Screen.width
  }
});
