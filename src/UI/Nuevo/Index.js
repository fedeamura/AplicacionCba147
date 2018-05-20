import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Animated,
  LayoutAnimation,
  Image,
  Dimensions,
  UIManager,
  Keyboard,
  ScrollView
} from "react-native";
import {
  ToolbarContent,
  Button
} from "react-native-paper";
import LinearGradient from 'react-native-linear-gradient';

//Mios
import App from "@UI/App";
import AppTheme from "@UI/AppTheme";
import IndicadorCargando from "@Utils/IndicadorCargando";
import MiToolbar from "@Utils/MiToolbar";
import Paso1 from "Cordoba/src/UI/Nuevo/Paso1";
import Paso2 from "Cordoba/src/UI/Nuevo/Paso2";

var cantidad = 3;
export default class Home extends React.Component {
  static navigationOptions = {
    title: "Nuevo requerimiento"
  };

  constructor(props) {
    super(props);

    let pasoAnim = [];
    let pasoCompletado = [];
    for (let i = 0; i < cantidad; i++) {
      pasoAnim[i] = new Animated.Value(i === 0 ? 1 : 0);
      pasoCompletado[i] = false;
    }

    this.state = {
      paso: 0,
      animando: false,
      mostrarPasos: false,
      anim: new Animated.Value(0),
      pasoAnim: pasoAnim,
      pasoCompletado: pasoCompletado,
      completado: false,
      anim_BtnAnterior: new Animated.Value(0),
      anim_BtnSiguiente: new Animated.Value(1),
      anim_BtnRegistrar: new Animated.Value(0)
    };

    this.keyboardHeight = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);

    let t = Platform.OS != 'android' ? 100 : 0;
    setTimeout(() => {
      this.setState({
        mostrarPasos: true
      });
    }, t);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    this.teclado = true;

    console.log('show');
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
    }).start();
  }

  keyboardWillHide = (event) => {
    this.teclado = false;

    console.log('hide');

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start();
  }

  mover(paso) {
    Keyboard.dismiss();

    setTimeout(() => {
      App.animar();

      this.setState(
        {
          paso: paso,
          animando: true
        });

      Animated.spring(this.state.anim, {
        toValue: paso,
        useNativeDriver: true
      }).start(() => {
        this.setState({
          animando: false
        });
      });

      for (var i = 0; i < cantidad; i++) {
        Animated.spring(this.state.pasoAnim[i], {
          toValue: i === paso ? 1 : 0
        }).start();
      }

    }, this.teclado ? 500 : 0);

    this.animarBotones(paso);
  }

  getViewPaso(paso) {
    const anchoPantalla = Dimensions.get("window").width;

    let view;

    switch (paso) {
      case 0:
        {
          view = (
            <Paso1
              onCompletadoChange={completado => {
                let arrayCompletados = this.state.pasoCompletado;
                arrayCompletados[paso] = completado;

                let todoCompletado = true;
                arrayCompletados.forEach((element) => {
                  if (!element) {
                    todoCompletado = false;
                  }
                });

                this.setState({ pasoCompletado: arrayCompletados, completado: todoCompletado });
              }}
            />
          );
        }
        break;

      case 1:
        {
          view = (
            <Paso2
              onCompletadoChange={completado => {
                let arrayCompletados = this.state.pasoCompletado;
                arrayCompletados[paso] = completado;

                let todoCompletado = true;
                arrayCompletados.forEach((element) => {
                  if (!element) {
                    todoCompletado = false;
                  }
                });

                this.setState({ pasoCompletado: arrayCompletados, completado: todoCompletado });
              }}
            />
          );
        }
        break;
      case 2:
        {
          view = (
            <Paso2
              onCompletadoChange={completado => {
                let arrayCompletados = this.state.pasoCompletado;
                arrayCompletados[paso] = completado;

                let todoCompletado = true;
                arrayCompletados.forEach((element) => {
                  if (!element) {
                    todoCompletado = false;
                  }
                });

                this.setState({ pasoCompletado: arrayCompletados, completado: todoCompletado });
              }}
            />
          );
        }
        break;
      default: {
        return <View />;
      }
    }

    return (
      <View
        key={"" + paso}
        style={[
          styles.paso,
          {
            width: anchoPantalla,
            maxWidth: anchoPantalla,
            minWidth: anchoPantalla
          }
        ]}
      >
        <ScrollView style={{ width: '100%' }}>
          <View style={{ width: '100%' }}>
            <View style={{ height: 48, width: '100%' }} />
            {view}
            <View style={{ height: 72, width: '100%' }} />
          </View>

        </ScrollView>

      </View>
    );
  }

  getViewIndicador(i) {
    return (
      <Animated.View
        key={"" + i}
        style={[
          styles.indicador,
          {
            transform: [
              {
                scale: this.state.pasoAnim[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1]
                })
              }
            ],
            backgroundColor: this.state.pasoAnim[i].interpolate({
              inputRange: [0, 1],
              outputRange: ["rgba(0,0,0,0.3)", "green"]
            })
          }
        ]}
      >
        <Text
          style={[
            styles.textoIndicador,
            { opacity: this.state.paso === i ? 1 : 0 }
          ]}
        >
          {i + 1}
        </Text>
      </Animated.View>
    );
  }

  animarBotones(paso) {

    let btnAnteriorVisible = paso != 0;
    let btnSiguienteVisible = (paso != (cantidad - 1));
    let btnRegistrarVisible = paso == cantidad - 1;

    Animated.spring(this.state.anim_BtnAnterior, {
      duration: 300,
      toValue: btnAnteriorVisible ? 1 : 0
    }).start();
    Animated.spring(this.state.anim_BtnSiguiente, {
      duration: 300,
      toValue: btnSiguienteVisible ? 1 : 0
    }).start();
    Animated.spring(this.state.anim_BtnRegistrar, {
      duration: 300,
      toValue: btnRegistrarVisible ? 1 : 0
    }).start();
  }

  render() {
    const anchoPantalla = Dimensions.get("window").width;
    const anchoContenedor = anchoPantalla * cantidad;
    const altoPantalla = Dimensions.get("window").height;

    //Pasos
    const view_pasos = [];
    const view_indicadores = [];
    for (let i = 0; i < cantidad; i++) {
      view_pasos[i] = this.getViewPaso(i);
      view_indicadores[i] = this.getViewIndicador(i);
    }

    return (
      <View
        style={[styles.contenedor]}>
        <MiToolbar
          style={styles.contenedorToolbar}
          left={{
            icon: "arrow-back",
            onClick: () => {
              App.goBack();
            }
          }}
        >
          <ToolbarContent title="Nuevo requerimiento" />
        </MiToolbar>

        <View style={styles.content}>
          <Animated.View
            style={[
              styles.contenedorPasos,
              {
                width: anchoContenedor,
                transform: [
                  {
                    translateX: this.state.anim.interpolate({
                      inputRange: [0, cantidad],
                      outputRange: [0, -anchoContenedor]
                    })
                  }
                ]
              }
            ]}
          >
            {this.state.mostrarPasos ? view_pasos : <View />}
          </Animated.View>

          <LinearGradient colors={[AppTheme.colorFondo, AppTheme.colorFondo, '#00000000']} style={styles.fondoIndicadores} pointerEvents="none" />
          <View style={styles.contenedorIndicadores}>{view_indicadores}</View>

          {/* Pasos */}
          <LinearGradient colors={['#00000000', AppTheme.colorFondo, AppTheme.colorFondo]} style={styles.fondoBotonesPasos} pointerEvents="none" />

          <View style={styles.contenedorBotonesPasos}>

            <Animated.View style={{
              width: '100%',
              maxWidth: this.state.anim_BtnAnterior.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 150],
                extrapolateLeft: 'clamp'
              }),
              opacity: this.state.anim_BtnAnterior.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
              })
            }}>

              <Button
                raised
                style={{ width: '100%' }}
                pointerEvents="auto"
                style={styles.btnAnterior}
                onPress={() => {
                  var pos = this.state.paso - 1;
                  if (pos < 0) pos = 0;
                  this.mover(pos);
                }}
              >
                Volver
              </Button>
            </Animated.View>

            <Animated.View style={{
              width: '100%',
              maxWidth: this.state.anim_BtnSiguiente.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 150],
                extrapolateLeft: 'clamp'
              }),
              opacity: this.state.anim_BtnSiguiente.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
              })
            }}>

              <Button
                raised
                primary
                style={{ width: '100%' }}
                pointerEvents="auto"
                style={styles.btnSiguiente}
                disabled={!this.state.pasoCompletado[this.state.paso]}
                onPress={() => {
                  var pos = this.state.paso + 1;
                  if (pos >= cantidad) pos = cantidad - 1;
                  this.mover(pos);
                }}
              >
                Siguiente
            </Button>
            </Animated.View>

            <Animated.View
              style={{
                width: '100%',
                maxWidth: this.state.anim_BtnRegistrar.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 150],
                  extrapolateLeft: 'clamp'
                }),
                opacity: this.state.anim_BtnRegistrar.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })

              }}>

              <Button
                raised
                primary
                style={[{ width: '100%' }]}
                pointerEvents="auto"
                style={styles.btnSiguiente}
                disabled={!this.state.completado}
                onPress={() => {

                }}
              >
                Registrar
            </Button>
            </Animated.View>

          </View>
        </View>

        <Animated.View style={[styles.contenedorKeyboard, { maxHeight: this.keyboardHeight }]}></Animated.View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    overflow: 'hidden',
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: AppTheme.colorFondo
  },
  contenedorToolbar: {
    zIndex: 10
  },
  content: {
    position: 'relative',
    width: '100%',
    flex: 1
  },
  contenedorPasos: {
    left: 0,
    width: 200,
    height: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "row"
  },
  contenedorIndicadores: {
    position: 'absolute',
    top: 8,
    width: '100%',
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  fondoIndicadores: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 48
  },
  indicador: {
    backgroundColor: "white",
    width: 24,
    margin: 8,
    height: 24,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  textoIndicador: {
    color: "white"
  },
  contenedorBotonesPasos: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: "flex",
    padding: 8,
    justifyContent: "center",
    flexDirection: "row"
  },
  fondoBotonesPasos: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 72
  },
  paso: {
    height: "100%",
    flex: 1,
    maxHeight: "100%"
  },
  btnSiguiente: {
  },
  indicadorAnim: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: AppTheme.colorAccent,
    elevation: 20
  },
  contenedorKeyboard: {
    height: '100%'
  }
});
