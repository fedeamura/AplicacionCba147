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
const fontSizeIcon = 48;
const marginIcon = 16;
const fontSizeTexto = 20;
const zIndexFront = 20;
const hSolapamiento = 32;
const hToolbarDefault = 72;
const hSombra = 16;

export default class MiToolbarMenu extends React.Component {
  static navigationOptions = {
    title: "Nuevo Usuario",
    header: null
  };

  constructor(props) {
    super(props);

    //Init
    this.initOpciones(props);

    let index = undefined;
    for (let i = 0; i < this.props.opciones.length; i++) {
      let o = this.props.opciones[i];
      if (o.value == props.opcion) {
        index = i;
      }
    }

    //Estado inicial
    this.state = {
      opcion: props.opcion || 0,
      index: index || 0,
      expandido: this.props.expandido || false,
      animando: false,
      animandoExpandir: false,
      toolbarTrigger: false,
      closeIcon: props.closeIcon || false,
      leftIcon: props.leftIcon,
      leftIconOnClick: props.leftIconOnClick,
      rightIcon: props.rightIcon,
      rightIconOnClick: props.rightIconOnClick,
      opciones: props.opciones || [],
      hOpcion: this.hOpcion,
      hToolbar: props.toolbar_height || this.hToolbar,
      yCollapse: this.yCollapse,
      ySombraCollapse: this.hToolbar,
      ySombraExpandido: Dimensions.get('window').height
    };
  }

  initOpciones(props) {
    this.anims = [];
    this.animsSombras = [];

    let expandido = props.expandido || false;

    _.each(props.opciones, (opcion) => {
      this.anims.push(new Animated.Value(expandido ? 1 : 0));
      this.animsSombras.push(new Animated.Value(expandido ? 1 : 0));
    });

    this.animSombra = new Animated.Value(expandido ? 0 : 1);

    //Calculo el tamaño de la opcion
    this.hOpcion = (Dimensions.get('window').height - ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT') + ExtraDimensions.get('STATUS_BAR_HEIGHT')) / props.opciones.length;

    //Calculo el tamaño del toolbar
    this.hToolbar = hToolbarDefault;
    if (this.hToolbar > this.hOpcion) {
      this.hToolbar = this.hOpcion;
    }

    //Calculo la posicion del toolbar minimizado
    this.yCollapse = -(this.hOpcion - this.hToolbar);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expandido) {
      this.expandir();
    } else {
      this.seleccionar(this.state.opcion);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.state) != JSON.stringify(this.nextState)
  }


  keyboardWillShow = (event) => {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
    }).start();
  }

  seleccionar(opcion) {
    let index = undefined;

    for (let i = 0; i < this.props.opciones.length; i++) {
      let o = this.props.opciones[i];
      if (o.value == opcion) {
        index = i;
      }
    }

    this.setState({
      animando: true,
      opcion: opcion,
      index: index,
      expandido: false
    }, () => {

      this.actualizarSombras();

      let animsPendientes = [];
      _.each(this.anims, (anim) => {
        animsPendientes.push(
          Animated.timing(anim, {
            duration: tAnim,
            toValue: 0,
            easing: Easing.bezier(0.645, 0.045, 0.355, 1),
            useNativeDriver: true
          }));
      });

      Animated.parallel(animsPendientes).start(() => {
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

      let animsPendientes = [];
      _.each(this.anims, (anim) => {
        animsPendientes.push(
          Animated.timing(anim, {
            duration: tAnim,
            toValue: 1,
            easing: Easing.bezier(0.645, 0.045, 0.355, 1),
            useNativeDriver: true
          }));
      });

      Animated.parallel(animsPendientes).start(() => {
        this.setState({
          animando: false,
          animandoExpandir: false
        });
      });
    });
  }

  actualizarSombras() {
    let animsPendientes = [];

    for (let i = 0; i < this.state.opciones.length; i++) {
      let front = false;
      if ((!this.state.expandido) && this.state.opcion == this.state.opciones[i].value) {
        front = true;
      }

      let mostrarSombra = i != 0 && !front;
      animsPendientes.push(Animated.spring(this.animsSombras[i], {
        toValue: mostrarSombra ? 1 : 0,
        useNativeDriver: true
      }))
    }


    Animated.parallel(animsPendientes).start();
  }

  render() {
    const componente = this;
    const state = this.state;

    let content = undefined;
    if (this.state.opcion != undefined) {
      _.each(this.state.opciones, (opcion) => {
        if (opcion.value == state.opcion) {
          content = opcion.content;
        }
      });
    }

    return (
      <View style={styles.contenedor}>



        <View style={[styles.encabezado_Opciones]}>

          {state.opciones.map(function (opcion, index) {

            let zIndex = state.opciones.length - index;
            if ((!state.expandido || state.animandoExpandir) && state.opcion == opcion.value) {
              zIndex = zIndexFront;
            }

            const yExpandido = state.hOpcion * index;
            let yTextoCollapse = (-(fontSizeIcon + marginIcon) / 2) + ((state.hOpcion - state.hToolbar) / 2) - (25 / 2);
            if (Platform.OS === 'ios') {
              yTextoCollapse = yTextoCollapse + 10;
            }
            yTextoCollapse = 'icon' in opcion && opcion.icon != undefined ? yTextoCollapse : yTextoCollapse + ((fontSizeIcon + marginIcon) / 2);

            let anim = componente.anims[index];
            let animSombra = componente.animsSombras[index];

            return (

              <Animated.View
                key={opcion.value}
                style={
                  [
                    styles.encabezado_Opcion,
                    {
                      maxHeight: state.hOpcion,
                      zIndex: zIndex,
                      transform: [
                        {
                          translateY: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [componente.yCollapse, yExpandido]
                          })
                        }
                      ]

                    }]}>
                <View style={styles.encabezado_Opcion}
                  pointerEvents={state.animando == true ? "none" : "auto"}
                >
                  <TouchableWithoutFeedback
                    style={styles.encabezado_Opcion}
                    onPress={() => {
                      if (state.opciones.length == 0) return;

                      if (!state.expandido) {
                        if (state.toolbarTrigger == true) {
                          componente.expandir();
                        }
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
                      <Animated.View style={[styles.sombra, {
                        opacity: animSombra.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1]
                        })
                      }]}>
                        <LinearGradient
                          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']}
                          style={styles.sombra}></LinearGradient>

                      </Animated.View>

                      {('icon' in opcion && opcion.icon != undefined) && (

                        <Animated.View style={{
                          opacity: anim.interpolate({
                            inputRange: [0, 0.7, 1],
                            outputRange: [0, 0, 1]
                          }),
                          transform: [
                            {
                              scale: anim.interpolate({
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
                              translateY: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [yTextoCollapse, 0]
                              })
                            }
                          ]
                        }
                        }
                      >
                        <MyText
                          letterSpacing={2}
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

        </View>

        {/* Boton left */}
        {state.leftIcon != undefined && (
          <Animated.View
            pointerEvents={this.state.expandido || this.state.animando ? "none" : "auto"}
            style={
              [
                styles.btnLeft,
                {
                  opacity: componente.anims[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0]
                  }),
                  transform: [{
                    translateY: state.opciones.length == 0 ? state.ySombraCollapse : this.anims[0].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, (state.hOpcion * (state.index || 0)) + (state.hOpcion / 2)]
                    })
                  }]
                }]}>
            <Button transparent onPress={() => {
              if (state.leftIconOnClick != undefined) {
                state.leftIconOnClick();
              }
            }}>
              <Icon type="MaterialIcons" style={styles.btnLeftIcon} name={state.leftIcon} />
            </Button>
          </Animated.View>

        )}

        {/* Boton right */}
        {state.rightIcon != undefined && (
          <Animated.View
            pointerEvents={this.state.expandido || this.state.animando ? "none" : "auto"}
            style={
              [
                styles.btnRight,
                {
                  opacity: componente.anims[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0]
                  }),
                  transform: [{
                    translateY: state.opciones.length == 0 ? state.ySombraCollapse : this.anims[0].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, state.hOpcion / 2]
                    })
                  }]
                }]}>
            <Button transparent onPress={() => {
              if (state.rightIconOnClick != undefined) {
                state.rightIconOnClick();
              }
            }}>
              <Icon type="MaterialIcons" style={styles.btnRightIcon} name={state.rightIcon} />
            </Button>
          </Animated.View>

        )}

        {/* Boton Close */}
        {state.toolbarTrigger == false && (
          <Animated.View
            pointerEvents={this.state.expandido && !this.state.animando ? "auto" : "none"}
            style={[
              styles.btnLeft,
              {
                opacity: componente.anims[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }
            ]}>
            <Button transparent onPress={() => {
              this.seleccionar(state.opcion);
            }}>
              <Icon type="MaterialIcons" style={styles.btnClose} name={'clear'} />
            </Button>
          </Animated.View>

        )}

        <Animated.View style={[styles.sombra, {
          zIndex: 120,
          transform: [
            {
              translateY: this.anims[0].interpolate({
                inputRange: [0, 1],
                outputRange: [state.hToolbar, Dimensions.get('window').height]
              })
            }
          ]
        }]}>

          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']}
            style={styles.sombra}></LinearGradient>

        </Animated.View>


        {/* Content */}
        <View
          style={[
            styles.content,
            {
              marginTop: state.hToolbar,
              zIndex: this.state.animando || this.state.expandido ? -1 : 100
            }]}
          key={state.opcion}>
          {content}
        </View>

      </View >
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: AppTheme.colorFondo,
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
    flex: 1,
    height: 100
  },
  sombra: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: hSombra
  },
  btnLeft: {
    position: 'absolute',
    left: 8,
    top: 16
  },
  btnLeftIcon: {
    color: 'white'
  },
  btnClose: {
    color: 'white'
  }
});