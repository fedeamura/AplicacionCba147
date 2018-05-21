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

const tAnim = 500;
const marginIcon = 16;
const zIndexFront = 20;
const hSolapamiento = 32;
const hToolbarDefault = 72;
const hSombra = 16;

export default class MiToolbarMenu extends React.Component {

  constructor(props) {
    super(props);

    //Init
    this.initOpciones(props);

    let index = undefined;
    for (let i = 0; i < this.props.opciones.length; i++) {
      let o = this.props.opciones[i];
      if (o.valor == props.opcion) {
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
    this.animsBackground = [];
    this.animsSombras = [];

    let expandido = props.expandido || false;

    _.each(props.opciones, (opcion) => {
      this.anims.push(new Animated.Value(expandido ? 1 : 0));
      this.animsBackground.push(new Animated.Value(expandido ? 1 : 0));
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
      if (o.valor == opcion) {
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

      _.each(this.animsBackground, (anim) => {
        animsPendientes.push(
          Animated.timing(anim, {
            duration: tAnim,
            toValue: 0
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

      _.each(this.animsBackground, (anim) => {
        animsPendientes.push(
          Animated.timing(anim, {
            duration: tAnim,
            toValue: 1
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
      if ((!this.state.expandido) && this.state.opcion == this.state.opciones[i].valor) {
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

  onPressOpcion(opcion, index) {
    if (this.state.opciones.length == 0) return;

    if (!this.state.expandido) {
      if (this.props.expandirAlHacerClick == true) {
        this.expandir();
      }
      return;
    }

    this.seleccionar(index);
  }

  render() {
    let content = undefined;
    if (this.state.opcion != undefined) {
      _.each(this.state.opciones, (opcion) => {
        if (opcion.valor == this.state.opcion) {
          content = opcion.contenido;
        }
      });
    }

    const toolbarColor = this.props.toolbarBackgroundColor || 'white';

    return (
      <View style={styles.contenedor}>



        <View style={[styles.encabezado_Opciones]}>

          {this.state.opciones.map((opcion, index) => {

            let zIndex = this.state.opciones.length - index;
            if ((!this.state.expandido || this.state.animandoExpandir) && this.state.opcion == opcion.valor) {
              zIndex = zIndexFront;
            }

            const yExpandido = this.state.hOpcion * index;
            let yTextoCollapse = (-(opcion.iconoFontSize + marginIcon) / 2) + ((this.state.hOpcion - this.state.hToolbar) / 2) - (25 / 2);
            if (Platform.OS === 'ios') {
              yTextoCollapse = yTextoCollapse + 10;
            }
            yTextoCollapse = 'icono' in opcion && opcion.icono != undefined ? yTextoCollapse : yTextoCollapse + ((opcion.iconoFontSize + marginIcon) / 2);

            const anim = this.anims[index];
            const animBackground = this.animsBackground[index];
            const animSombra = this.animsSombras[index];

            return (

              <Animated.View
                key={opcion.valor}
                style={
                  [
                    styles.encabezado_Opcion,
                    {
                      maxHeight: this.state.hOpcion,
                      zIndex: zIndex,
                      transform: [
                        {
                          translateY: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [this.yCollapse, yExpandido]
                          })
                        }
                      ]

                    }]}>
                <View style={styles.encabezado_Opcion}
                  pointerEvents={this.state.animando == true ? "none" : "auto"}
                >
                  <TouchableWithoutFeedback
                    onPress={() => { this.onPressOpcion(opcion, index); }}>
                    <Animated.View style={
                      [
                        styles.encabezado_OpcionInterior,
                        {
                          backgroundColor: this.props.toolbarBackgroundColor == undefined ? opcion.backgroundColor : animBackground.interpolate({
                            inputRange: [0, 1],
                            outputRange: [this.props.toolbarBackgroundColor, opcion.backgroundColor]
                          })
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

                      {('icono' in opcion && opcion.icono != undefined) && (

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
                          <Icon style={[styles.encabezado_OpcionIcono, { fontSize: opcion.iconoFontSize, marginBottom: marginIcon, color: opcion.iconoColor }]} type={opcion.iconoFontFamily} name={opcion.icono} />
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
                        <Animated.Text
                          style={
                            [
                              {
                                fontSize: opcion.tituloFontSize,
                                color: this.props.toolbarTituloColor == undefined ? opcion.tituloColor : animBackground.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [this.props.toolbarTituloColor, opcion.tituloColor]
                                })

                              }
                            ]}>
                          {opcion.titulo.toUpperCase()}
                        </Animated.Text>

                      </Animated.View>
                    </Animated.View>
                  </TouchableWithoutFeedback>

                </View>

              </Animated.View>

            );
          })}

        </View>

        {/* Boton Izquierda */}
        {this.props.mostrarBotonIzquierda != undefined && (
          <Animated.View
            pointerEvents={this.state.expandido || this.state.animando ? "none" : "auto"}
            style={
              [
                styles.btnLeft,
                {
                  opacity: this.anims[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0]
                  }),
                  transform: [{
                    translateY: this.state.opciones.length == 0 ? this.state.ySombraCollapse : this.anims[0].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, (this.state.hOpcion * (this.state.index || 0)) + (this.state.hOpcion / 2)]
                    })
                  }]
                }]}>
            <Button transparent onPress={() => {
              if (this.props.iconoIzquierdaOnPress != undefined) {
                this.props.iconoIzquierdaOnPress();
              }
            }}>
              <Icon
                type={this.props.iconoIzquierdaFontFamily}
                style={[
                  styles.btnLeftIcon, {
                    color: this.props.iconoIzquierdaColor
                  }]}
                name={this.props.iconoIzquierda} />
            </Button>
          </Animated.View>

        )}

        {/* Boton Cerrar */}
        {this.props.mostrarBotonCerrar == true && (
          <Animated.View
            pointerEvents={this.state.expandido && !this.state.animando ? "auto" : "none"}
            style={[
              styles.btnLeft,
              {
                color: this.props.iconoCerrarColor,
                opacity: this.anims[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }
            ]}>
            <Button transparent onPress={() => {
              this.seleccionar(this.state.opcion);
            }}>
              <Icon type={this.props.iconoCerrarFontFamily} style={styles.btnClose} name={this.props.iconoCerrar} />
            </Button>
          </Animated.View>

        )}

        <Animated.View style={[styles.sombra, {
          zIndex: 120,
          transform: [
            {
              translateY: this.anims[0].interpolate({
                inputRange: [0, 1],
                outputRange: [this.state.hToolbar, Dimensions.get('window').height]
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
              marginTop: this.state.hToolbar,
              zIndex: this.state.animando || this.state.expandido ? -1 : 100
            }]}
          key={this.state.opcion}>
          {content}
        </View>

      </View >
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: 'white',
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
  encabezado_OpcionIcono: {
    marginBottom: 8,
    color: 'white'
  },
  content: {
    flex: 1
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
    top: 20
  },
  btnLeftIcon: {
    color: 'white'
  },
  btnClose: {
    color: 'white'
  }
});