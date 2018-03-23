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
import App from "Cordoba/src/UI/App";
import AppStyles from "Cordoba/src/UI/Styles/default";
import ListadoItem from "Cordoba/src/UI/Home/ListadoItem";
import ListadoItemSeparator from "Cordoba/src/UI/Home/ListadoItemSeparator";
import IndicadorCargando from "Cordoba/src/UI/Utils/IndicadorCargando";
import MiToolbar from "Cordoba/src/UI/Utils/MiToolbar";
import MiListado from "Cordoba/src/UI/Utils/MiListado";
import MiFAB from "Cordoba/src/UI/Utils/MiFAB";

//Rules
import Rules_Requerimiento from "Cordoba/src/Rules/Rules_Requerimiento";
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

const H_Panel = Screen.height - ExtraDimensions.get('STATUS_BAR_HEIGHT') - 48;

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
    App.animar(() => {
      Rules_Requerimiento.get(
        data => {

          App.animar();
          this.setState({
            listado: {
              ...this.state.listado,
              loading: false,
              data: data
            }
          });
        },
        error => {
          App.animar();
          this.setState({
            listado: {
              ...this.state.listado,
              loading: false,
              error: error
            }
          });
        }
      );
    })
    this.setState(
      {
        listado: {
          ...this.state.listado,
          error: undefined,
          loading: true
        }
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
        pointerEvents={this.state.animando ? "none" : "auto"}
      >
        <MiToolbar
          left={{
            icon: "menu",
            onClick: () => {
              this.cerrarSesion();
            }
          }}
          right={[
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

        <View style={styles.contenedor_Panel} pointerEvents={'box-none'}>
          <Animated.View
            pointerEvents={'box-none'}
            style={[styles.sombra_Panel, {
              backgroundColor: 'black',
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
            <View style={styles.contenido_Panel}>
              <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
              </View>
              <View style={styles.contenedor_Scroll}>
                <ScrollView style={styles.nuevo_Scroll}>
                  <View style={styles.nuevo_ScrollContenido}>
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
  listado:{
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
  contenedor_Panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 16
  },
  sombra_Panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  contenido_Panel: {
    height: Screen.height + Screen.height,
    // backgroundColor: '#f7f5eee8',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.4,
    zIndex: 10
  },
  contenedor_Scroll: {
    height: H_Panel
  },
  nuevo_Scroll: {
  },
  nuevo_ScrollContenido: {
    margin: 16
  },
  panelHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  panelHandle: {
    width: 40,
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
