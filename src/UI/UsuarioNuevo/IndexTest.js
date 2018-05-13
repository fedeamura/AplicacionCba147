import React, {
  Component
} from "react";
import {
  Platform,
  StyleSheet,
  View,
  UIManager,
  Alert,
  Animated,
  Easing,
  StatusBar,
  ScrollView,
  Keyboard,
  Dimensions,
  NativeModules,
  TouchableWithoutFeedback
} from "react-native";
import {
  Container,
  Button,
  Text,
  Input,
  Item,
  Icon,
  Spinner,
  Content
} from "native-base";
const { StatusBarManager } = NativeModules;
import ExtraDimensions from 'react-native-extra-dimensions-android';
import MaterialsIcon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import MyText from 'react-native-letter-spacing';

import * as Animatable from 'react-native-animatable';

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "Cordoba/src/UI/App";
import AppTheme from "@UI/AppTheme";

const tAnim = 500;

export default class IndexTest extends React.Component {
  static navigationOptions = {
    title: "Nuevo Usuario",
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      opcion: 0,
      expandido: false,
      animando: false,
      animandoExpandir: false
    };

    this.keyboardHeight = new Animated.Value(0);
    this.opciones = [
      {
        text: 'Opcion 1',
        icon: 'home',
        value: 0,
        color: 'rgb(208, 102, 250)',
        content: (<View style={{ backgroundColor: 'rgb(208, 102, 250)', width: '100%', height: '100%' }}></View>)
      },
      {
        text: 'Opcion 2',
        icon: 'home',
        value: 1,
        color: 'rgb(255, 96, 95)',
        content: (<View style={{ backgroundColor: 'rgb(255, 96, 95)', width: '100%', height: '100%' }}></View>)
      },
      {
        text: 'Opcion 3',
        icon: 'home',
        value: 2,
        color: 'rgb(0, 168, 255)',
        content: (<View style={{ backgroundColor: 'rgb(0, 168, 255)', width: '100%', height: '100%' }}></View>)
      },
      {
        text: 'Opcion 4',
        icon: 'home',
        value: 3,
        color: 'rgb(150, 209, 0)',
        content: (<View style={{ backgroundColor: 'rgb(150, 209, 0)', width: '100%', height: '100%' }}></View>)
      }
    ]

    _.each(this.opciones, (opcion) => {
      opcion.anim = new Animated.Value(0);
      opcion.animSombra = new Animated.Value(0);
    });
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
    }).start();
  }

  keyboardWillHide = (event) => {
    this.teclado = false;


    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start();
  }

  seleccionar(opcion) {
    this.setState({
      animando: true,
      opcion: opcion,
      expandido: false
    }, () => {

      this.actualizarSombras();

      let anims = [];
      for (let i = 0; i < this.opciones.length; i++) {
        anims.push(
          Animated.timing(
            this.opciones[i].anim,
            {
              duration: tAnim,
              toValue: 0,
              easing: Easing.bezier(0.645, 0.045, 0.355, 1),
              useNativeDriver: true
            }));
      }

      Animated.parallel(anims).start(() => {
        this.setState({
          animando: false
        });
      });
    });
  }

  expandir() {
    this.setState({
      animando: true,
      animandoExpandir: true,
      expandido: true
    }, () => {

      this.actualizarSombras();

      let anims = [];
      for (let i = 0; i < this.opciones.length; i++) {
        anims.push(
          Animated.timing(
            this.opciones[i].anim,
            {
              duration: tAnim,
              toValue: 1,
              easing: Easing.bezier(0.645, 0.045, 0.355, 1),
              useNativeDriver: true
            }));
      }

      Animated.parallel(anims).start(() => {
        this.setState({
          animando: false,
          animandoExpandir: false
        });
      });
    });
  }

  actualizarSombras() {
    let anims = [];

    for (let i = 0; i < this.opciones.length; i++) {
      let front = false;
      if ((!this.state.expandido) && this.state.opcion == this.opciones[i].value) {
        front = true;
      }

      let mostrarSombra = i != 0 && !front;
      anims.push(Animated.spring(this.opciones[i].animSombra, {
        toValue: mostrarSombra ? 1 : 0
      }))
    }

    Animated.parallel(anims).start();
  }

  render() {

    let expandido = this.state.expandido;
    let opcionSeleccionada = this.state.opcion;
    let componente = this;
    let state = this.state;
    let opciones = this.opciones;

    const hOpcion = (Dimensions.get('window').height - ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT') +  ExtraDimensions.get('STATUS_BAR_HEIGHT')) / opciones.length;
    let hToolbar = 72;
    if (hToolbar > hOpcion) hToolbar = hOpcion;
    const fontSizeIcon = 48;
    const marginIcon = 16;
    const fontSizeTexto = 20;
    const zIndexFront = 20;


    const yCollapse = -(hOpcion - hToolbar);
    const hSolapamiento = 32;


    let content = undefined;
    if (this.state.opcion != undefined) {
      _.each(this.opciones, (opcion) => {
        if (opcion.value == this.state.opcion) {
          content = opcion.content;
        }
      });
    }

    return (
      <View style={styles.contenedor} >

        <View style={styles.encabezado}>

          <View style={styles.encabezado_Opciones}>

            {opciones.map(function (opcion, index) {

              let zIndex = opciones.length - index;
              if ((!state.expandido || state.animandoExpandir) && state.opcion == opcion.value) {
                zIndex = zIndexFront;
              }

              const yExpandido = hOpcion * index;
              let yTextoCollapse = (-(fontSizeIcon + marginIcon) / 2) + ((hOpcion - hToolbar) / 2) - (25 / 2);
              if (Platform.OS === 'ios') {
                yTextoCollapse = yTextoCollapse +10;
              }
              yTextoCollapse = 'icon' in opcion && opcion.icon != undefined ? yTextoCollapse : yTextoCollapse + ((fontSizeIcon + marginIcon) / 2);
              return (

                <Animated.View
                  key={opcion.value}
                  style={
                    [
                      styles.encabezado_Opcion,
                      {
                        maxHeight: hOpcion,
                        zIndex: zIndex,
                        transform: [
                          {
                            translateY: opcion.anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [yCollapse, yExpandido]
                            })
                          }
                        ]

                      }]}>
                  <View style={styles.encabezado_Opcion}>
                    <TouchableWithoutFeedback
                      style={
                        {
                          width: '100%', height: '100%', backgroundColor: 'white'
                        }
                      }
                      onPress={() => {
                        if (!state.expandido) {
                          componente.expandir();
                          return;
                        }
                        componente.seleccionar(index);
                      }}>
                      <Animated.View style={
                        [
                          styles.encabezado_OpcionInterior,
                          {
                            backgroundColor: opcion.color
                          }
                        ]}>
                        <Animated.View style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 32,
                          opacity: opcion.animSombra.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1]
                          })
                        }}>
                          <LinearGradient
                            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 16
                            }}></LinearGradient>

                        </Animated.View>

                        {('icon' in opcion && opcion.icon != undefined) && (

                          <Animated.View style={{
                            opacity: opcion.anim.interpolate({
                              inputRange: [0, 0.7, 1],
                              outputRange: [0, 0, 1]
                            }),
                            transform: [
                              {
                                scale: opcion.anim.interpolate({
                                  inputRange: [0, 0.7, 1],
                                  outputRange: [0, 0, 1]
                                })
                              }
                            ]
                          }}>
                            <Icon style={[styles.encabezado_OpcionIcono, { fontSize: fontSizeIcon, marginBottom: marginIcon }]} type="MaterialIcons" name={opcion.icon} />
                          </Animated.View>
                        )}

                        <Animated.View
                          style={{
                            transform: [
                              {
                                translateY: opcion.anim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [yTextoCollapse, 0]
                                })
                              }
                            ]
                          }
                          }
                        >
                          <MyText
                            letterSpacing={4}
                            style={
                              [
                                styles.encabezado_OpcionTexto,
                                {
                                  fontSize: fontSizeTexto
                                }
                              ]}>
                            {opcion.text.toUpperCase()}
                          </MyText>

                        </Animated.View>
                      </Animated.View>
                    </TouchableWithoutFeedback>

                  </View>

                </Animated.View>

              );
            })}

            <Animated.View
              style={[
                {
                  zIndex: 100,
                  transform: [
                    {
                      translateY: opciones[0].anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [hToolbar, Dimensions.get('window').height]
                      })
                    }
                  ]
                }
              ]}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']}
                style={{
                  width: '100%',
                  height: 16
                }}></LinearGradient>

            </Animated.View>
          </View>

        </View>
        <View style={styles.content} >
          {content}
        </View>
        <Animated.View style={
          [
            styles.contenedorKeyboard,
            {
              maxHeight: this.keyboardHeight
            }
          ]
        }>
        </Animated.View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: global.styles.login_colorFondo,
  },
  encabezado: {
    height: '100%',
    width: '100%',
    left: 0,
    top: 0,
    zIndex: 2,
    maxHeight: '100%',
    position: 'absolute'
  },
  encabezado_Opciones: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    flexDirection: 'column',
    display: 'flex'
  },
  encabezado_Opcion: {
    height: '100%',
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1
  },
  encabezado_OpcionInterior: {
    height: '100%',
    overflow: 'hidden',
    width: '100%',
    paddingTop: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  encabezado_OpcionTexto: {
    fontSize: 20,
    color: 'white'
  },
  encabezado_OpcionIcono: {
    fontSize: 48,
    marginBottom: 8,
    color: 'white'
  },
  content: {
    backgroundColor: 'white',
    flex: 1
  }
});