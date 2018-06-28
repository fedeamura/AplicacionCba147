import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  Animated,
  Easing,
  Keyboard,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import {
  Button,
} from "native-base";
import ExtraDimensions from 'react-native-extra-dimensions-android';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';

const tAnim = 500;
const marginIcon = 16;
const zIndexFront = 20;
let hToolbarDefault;
const hSombra = 16;

export default class MiToolbarMenu extends React.Component {

  constructor(props) {
    super(props);

    hToolbarDefault = this.props.toolbarHeight || 72;

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
      animandoSeleccionar: false,
      opciones: props.opciones || [],
      hOpcion: this.hOpcion,
      hToolbar: this.hToolbar,
      yCollapse: this.yCollapse,
      ySombraCollapse: this.hToolbar,
      ySombraExpandido: Dimensions.get('window').height
    };
  }

  initOpciones = (props) => {
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
    if (Platform.OS == 'ios') {
      this.hToolbar += 20;
    }

    //Calculo la posicion del toolbar minimizado
    this.yCollapse = -(this.hOpcion - this.hToolbar);
    if (Platform.OS == 'ios') {
      this.yCollapse -= 20;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expandido) {
      this.expandir();
    } else {
      this.seleccionar(this.state.opcion);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.state) != JSON.stringify(nextState)
  }

  keyboardWillShow = (event) => {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
    }).start();
  }

  seleccionar = (opcion) => {
    let index = undefined;

    for (let i = 0; i < this.props.opciones.length; i++) {
      let o = this.props.opciones[i];
      if (o.valor == opcion) {
        index = i;
      }
    }

    this.setState({
      animando: true,
      animandoSeleccionar: true,
      animandoExpandir: false,
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
          animandoSeleccionar: false,
          animando: false
        });
      });
    });
  }

  expandir = () => {

    Keyboard.dismiss();

    this.setState({
      animando: true,
      animandoSeleccionar: false,
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

  actualizarSombras = () => {
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

  onPressOpcion = (opcion, index) => {
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

    return (
      <View style={styles.contenedor}>



        <View style={[styles.encabezado_Opciones]}>

          {this.state.opciones.map((opcion, index) => {

            let zIndex = this.state.opciones.length - index;
            if ((!this.state.expandido || this.state.animandoExpandir) && this.state.opcion == opcion.valor) {
              zIndex = zIndexFront;
            }

            let yExpandido = this.state.hOpcion * index;
            if (Platform.OS == 'ios') {
              yExpandido -= 20;
            }
            let solapamiento = 0;
            yExpandido -= solapamiento;

            let yTextoCollapse = (-(opcion.iconoFontSize + marginIcon) / 2) + ((this.state.hOpcion - this.state.hToolbar) / 2) - (25 / 2);
            if (Platform.OS === 'ios') {
              yTextoCollapse = yTextoCollapse + 10;
            }
            yTextoCollapse = 'icono' in opcion && opcion.icono != undefined ? yTextoCollapse : yTextoCollapse + ((opcion.iconoFontSize + marginIcon) / 2);
            if (Platform.OS == 'ios') {
              // yTextoCollapse-=20;
            }

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
                      maxHeight: this.state.hOpcion + (index == this.state.opciones.length - 1 ? this.state.opciones.length * solapamiento : 0),
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
                <View style={[styles.encabezado_Opcion, { backgroundColor: opcion.backgroundColor }]}>
                  <TouchableOpacity
                    style={{ width: '100%' }}
                    onPress={() => { this.onPressOpcion(opcion, index); }}>
                    <Animated.View style={
                      [
                        styles.encabezado_OpcionInterior,
                        {
                          backgroundColor: this.props.toolbarBackgroundColor == undefined ? opcion.backgroundColor : animBackground.interpolate({
                            inputRange: [0, 1],
                            outputRange: [this.props.toolbarBackgroundColor || opcion.backgroundColor, opcion.backgroundColor]
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
                          <Icon style={[styles.encabezado_OpcionIcono, { fontSize: opcion.iconoFontSize, marginBottom: marginIcon, color: opcion.iconoColor }]} type={'MaterialCommunityIcons'} name={opcion.icono} />
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
                  </TouchableOpacity>

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
                      outputRange: [Platform.OS == 'ios' ? ((this.hToolbar - 20) / 2) - 20 : -12, (this.state.hOpcion * (this.state.index || 0)) + (this.state.hOpcion / 2)]
                    })
                  }]
                }]}>
            <Button
              style={styles.btnLeftBtn}
              transparent onPress={() => {
                if (this.props.iconoIzquierdaOnPress != undefined) {
                  this.props.iconoIzquierdaOnPress();
                }
              }}>
              <Icon
                style={[
                  styles.btnLeftIcon, {
                    color: this.props.iconoIzquierdaColor || 'black'
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
                }),
                transform: [{
                  translateY: Platform.OS == 'ios' ? ((this.hToolbar - 20) / 2) - 20 : -12
                }]
              }
            ]}>
            <Button style={styles.btnLeftBtn} transparent onPress={() => {
              this.seleccionar(this.state.opcion);
            }}>
              <Icon style={styles.btnClose} name={this.props.iconoCerrar} color={this.props.iconoCerrarColor || 'white'} />
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
              zIndex: this.state.animandoSeleccionar == false && this.state.expandido == false ? 100 : -1
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
    top: Platform.select({
      ios: 20,
      android: 0
    }),
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
    width: 48,
    height: 48,
    zIndex: 100,
    borderRadius: 48,
    overflow: 'hidden',
    top: 16
  },
  btnLeftBtn: {
    borderRadius: 48,
    display: 'flex',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48
  },
  btnLeftIcon: {
    fontSize: 24
  },
  btnClose: {
    fontSize: 24
  }
});