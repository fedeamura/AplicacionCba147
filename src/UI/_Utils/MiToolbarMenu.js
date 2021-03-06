import React from "react";

import {
  Platform,
  StyleSheet,
  View,
  Animated,
  Easing,
  Keyboard,
  TouchableWithoutFeedback,
  BackHandler
} from "react-native";
import { Button } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import _ from "lodash";

const tAnim = 500;
const marginIcon = 16;
const zIndexFront = 20;
let hToolbarDefault;
const hSombra = 16;

export default class MiToolbarMenu extends React.Component {

  static defaultProps = {
    ...React.Component.defaultProps,
    toolbarHeight: 0,
    opciones: [],
    opcion: 0,
    expandido: false,
    onSeleccionChange: function () { },
    onExpandido: function () { }.isRequired,
    expandirAlHacerClick: false,
    toolbarBackgroundColor: 'white',
    toolbarTituloColor: 'black',
    mostrarBotonIzquierda: true,
    iconoIzquierdaColor: 'black',
    mostrarBotonCerrar: true,
    iconoIzquierda: 'flash',
    iconoCerrar: 'flash',
    iconoCerrarColor: 'white'
  };

  constructor(props) {
    super(props);

    if (props.expandido === 1) {
      let a = 1;
      alert.alert(a);
    }

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

    let expandido = this.props.expandido || false;

    //Estado inicial
    this.state = {
      opcion: props.opcion || 0,
      index: index || 0,
      expandido: false,
      animando: false,
      animandoExpandir: false,
      animandoSeleccionar: false,
      opciones: props.opciones || [],
      hScreen: 500,
      visible: false
    };

    this.animSombra = new Animated.Value(expandido ? 0 : 1);
    this.animInicio = new Animated.Value(0);
    this.animInicio2 = new Animated.Value(0);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.back);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.back);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.state) != JSON.stringify(nextState);
  }

  back = () => {
    if (this.state.expandido == true) {
      this.seleccionar(this.state.opcion);
      return true;
    }

    return false;
  }

  onLayout = (event) => {
    var { height } = event.nativeEvent.layout;

    this.setState({ hScreen: height }, () => {
      this.initDimens();
      this.setState({ visible: true });
    });

    Animated.sequence([
      Animated.timing(this.animInicio, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(this.animInicio2, { toValue: 1, duration: 500, useNativeDriver: true })
    ]).start();
  }

  initOpciones = (props) => {
    this.anims = [];
    this.animsBackground = [];
    this.animsSombras = [];
    this.animsPress = [];

    let expandido = props.expandido || false;

    _.each(
      props.opciones,
      function () {
        this.anims.push(new Animated.Value(expandido ? 1 : 0));
        this.animsBackground.push(new Animated.Value(expandido ? 1 : 0));
        this.animsSombras.push(new Animated.Value(expandido ? 1 : 0));
        this.animsPress.push(new Animated.Value(0));
      }.bind(this)
    );
  }

  initDimens = () => {
    //Calculo el tamaño de la opcion
    this.hOpcion = this.state.hScreen / this.state.opciones.length;
    // this.hOpcion = (Dimensions.get('window').height - ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT') + ExtraDimensions.get('STATUS_BAR_HEIGHT')) / props.opciones.length;

    //Calculo el tamaño del toolbar
    this.hToolbar = hToolbarDefault;
    if (this.hToolbar > this.hOpcion) {
      this.hToolbar = this.hOpcion;
    }
    if (Platform.OS == "ios") {
      this.hToolbar += 20;
    }

    //Calculo la posicion del toolbar minimizado
    this.yCollapse = -(this.hOpcion - this.hToolbar);
    if (Platform.OS == "ios") {
      this.yCollapse -= 20;
    }

    this.ySombraCollapse = this.hToolbar;
    this.ySombraExpandido = this.state.hScreen;
  }

  seleccionar = (opcion) => {
    let index = undefined;

    for (let i = 0; i < this.props.opciones.length; i++) {
      let o = this.props.opciones[i];
      if (o.valor == opcion) {
        index = i;
      }
    }

    //Informo
    this.props.onSeleccionChange(index, opcion);

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
          })
        );
      });

      _.each(this.animsBackground, (anim) => {
        animsPendientes.push(
          Animated.timing(anim, {
            duration: tAnim,
            toValue: 0
          })
        );
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

    //Informo
    this.props.onExpandido();

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
          })
        );
      });

      _.each(this.animsBackground, (anim) => {
        animsPendientes.push(
          Animated.timing(anim, {
            duration: tAnim,
            toValue: 1
          })
        );
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
      if (!this.state.expandido && this.state.opcion == this.state.opciones[i].valor) {
        front = true;
      }

      let mostrarSombra = i != 0 && !front;
      animsPendientes.push(
        Animated.spring(this.animsSombras[i], {
          toValue: mostrarSombra ? 1 : 0,
          useNativeDriver: true
        })
      );
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
    const initData = global.initData;

    return (
      <View
        onLayout={this.onLayout}
        style={[styles.contenedor, { overflow: "hidden", backgroundColor: initData.backgroundColor }]}
      >
        {this.state.visible == true && (
          <Animated.View
            style={[
              styles.contenedor,
              {
                transform: [
                  {
                    translateY: this.animInicio.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 0]
                    })
                  }
                ]
              }
            ]}
          >
            <View style={[styles.encabezado_Opciones]}>
              {this.state.renderOpciones}
              {/* Las opciones */}
              {this.state.opciones.map(
                function (opcion, index) {
                  return (
                    <MiToolbarMenuOpcion
                      key={index}
                      index={index}
                      expandido={this.state.expandido}
                      anim={this.anims[index]}
                      animBackground={this.animsBackground[index]}
                      animSombra={this.animsSombras[index]}
                      animPress={this.animsPress[index]}
                      animandoExpandir={this.state.animandoExpandir}
                      opcionSeleccionada={this.state.opcion}
                      opciones={this.state.opciones}
                      opcion={opcion}
                      hOpcion={this.hOpcion}
                      hToolbar={this.hToolbar}
                      yCollapse={this.yCollapse}
                      onPress={this.onPressOpcion}
                      toolbarBackgroundColor={this.props.toolbarBackgroundColor}
                      toolbarTituloColor={this.props.toolbarTituloColor}
                    />
                  );
                }.bind(this)
              )}
            </View>

            {/* Boton Izquierda */}
            {this.renderBotonIzquierda()}

            {/* Boton Cerrar */}
            {this.renderBotonCerrar()}

            {/* Botones derecha */}
            {this.renderBotonesDerecha()}

            {/* Sombra  */}
            {this.renderSombra()}

            {/* Content */}
            {this.renderContent()}
          </Animated.View>
        )}
      </View>
    );
  }

  renderBotonIzquierda() {
    if (this.props.mostrarBotonIzquierda == undefined || this.props.mostrarBotonIzquierda == false) return null;

    return (
      <Animated.View
        pointerEvents={this.state.expandido || this.state.animando ? "none" : "auto"}
        style={[
          styles.btnLeft,
          {
            opacity: this.anims[0].interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0]
            }),
            transform: [
              {
                translateY:
                  this.state.opciones.length == 0
                    ? this.ySombraCollapse
                    : this.anims[0].interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        Platform.OS == "ios" ? (this.hToolbar - 20) / 2 - 20 : -12,
                        this.hOpcion * (this.state.index || 0) + this.hOpcion / 2
                      ]
                    })
              }
            ]
          }
        ]}
      >
        <Button style={styles.btnLeftBtn} transparent onPress={this.expandir}>
          <Icon
            style={[
              styles.btnLeftIcon,
              {
                color: this.props.iconoIzquierdaColor || "black"
              }
            ]}
            name={this.props.iconoIzquierda}
          />
        </Button>
      </Animated.View>
    );
  }

  renderBotonCerrar() {
    if (this.props.mostrarBotonCerrar != true) return <View />;

    return (
      <Animated.View
        pointerEvents={this.state.expandido == true ? "auto" : "none"}
        style={[
          styles.btnLeft,
          {
            // color: this.props.iconoCerrarColor,
            opacity: this.anims[0].interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            }),
            transform: [
              {
                translateY: Platform.OS == "ios" ? (this.hToolbar - 20) / 2 - 20 : -12
              }
            ]
          }
        ]}
      >
        <Button style={styles.btnLeftBtn} transparent onPress={this.seleccionar.bind(this, this.state.opcion)}>
          <Icon style={styles.btnClose} name={this.props.iconoCerrar} color={this.props.iconoCerrarColor || "white"} />
        </Button>
      </Animated.View>
    );
  }

  renderBotonesDerecha() {
    // if (this.state.expandido == true) return null;

    return (
      <Animated.View
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 300,
          opacity: this.anims[0].interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
        }}
      >
        {this.state.opciones[this.state.opcion].botones}
      </Animated.View>
    );
  }

  renderSombra() {
    return (
      <Animated.View
        style={[
          styles.sombra,
          {
            zIndex: 120,
            transform: [
              {
                translateY: this.anims[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: [this.hToolbar, this.state.hScreen]
                })
              }
            ]
          }
        ]}
      >
        <LinearGradient colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]} style={styles.sombra} />
      </Animated.View>
    );
  }

  renderContent() {
    const initData = global.initData;

    let content = undefined;
    if (this.state.opcion != undefined) {
      _.each(
        this.state.opciones,
        function (opcion) {
          if (opcion.valor == this.state.opcion) {
            content = opcion.contenido;
          }
        }.bind(this)
      );
    }

    return (
      <View
        style={[
          styles.content,
          {
            backgroundColor: initData.backgroundColor,
            marginTop: this.hToolbar,
            zIndex: this.state.animandoSeleccionar == false && this.state.expandido == false ? 100 : -1
          }
        ]}
        key={this.state.opcion}
      >
        <Animated.View
          style={{
            opacity: this.animInicio2
          }}
        >
          {content}
        </Animated.View>
      </View>
    );
  }
}

class MiToolbarMenuOpcion extends React.PureComponent {
  constructor(props) {
    super(props);
  }


  onPressIn = () => {
    Animated.timing(this.props.animPress, { toValue: 1, duration: 300 }).start();
  }

  onPressOut = () => {
    Animated.timing(this.props.animPress, { toValue: 0, duration: 300 }).start();
  }

  onPress = () => {
    this.onPressOut();
    this.props.onPress(this.props.opcion, this.props.index);
  }

  render() {
    let opcion = this.props.opcion;
    let opcionSeleccionada = this.props.opcionSeleccionada;
    let index = this.props.index;
    let opciones = this.props.opciones;
    let expandido = this.props.expandido;
    let animandoExpandir = this.props.animandoExpandir;
    let hOpcion = this.props.hOpcion;
    let hToolbar = this.props.hToolbar;
    let yCollapse = this.props.yCollapse;
    let toolbarBackgroundColor = this.props.toolbarBackgroundColor;
    let toolbarTituloColor = this.props.toolbarTituloColor;

    let zIndex = opciones.length - index;
    if ((!expandido || animandoExpandir) && opcionSeleccionada == opcion.valor) {
      zIndex = zIndexFront;
    }

    let yExpandido = hOpcion * index;
    if (Platform.OS == "ios") {
      yExpandido -= 20;
    }
    let solapamiento = 0;
    yExpandido -= solapamiento;

    let yTextoCollapse = -(opcion.iconoFontSize + marginIcon) / 2 + (hOpcion - hToolbar) / 2 - 25 / 2;
    if (Platform.OS === "ios") {
      yTextoCollapse = yTextoCollapse + 10;
    }
    yTextoCollapse =
      "icono" in opcion && opcion.icono != undefined
        ? yTextoCollapse
        : yTextoCollapse + (opcion.iconoFontSize + marginIcon) / 2;
    if (Platform.OS == "ios") {
      // yTextoCollapse-=20;
    }

    let anim = this.props.anim;
    let animSombra = this.props.animSombra;
    let animPress = this.props.animPress;
    let animBackground = this.props.animBackground;

    return (
      <Animated.View
        pointerEvents={expandido == false ? "none" : "auto"}
        key={opcion.valor}
        style={[
          styles.encabezado_Opcion,
          {
            maxHeight: hOpcion + (index == opciones.length - 1 ? opciones.length * solapamiento : 0),
            zIndex: zIndex,
            transform: [
              {
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [yCollapse, yExpandido]
                })
              }
            ]
          }
        ]}
      >
        <View
          style={[
            styles.encabezado_Opcion,
            {
              backgroundColor: opcion.backgroundColor
            }
          ]}
        >
          <TouchableWithoutFeedback
            style={{ width: "100%" }}
            onPressIn={this.onPressIn}
            onPressOut={this.onPressOut}
            onPress={this.onPress}
          >
            <Animated.View
              style={[
                styles.encabezado_OpcionInterior,
                {
                  backgroundColor:
                    toolbarBackgroundColor == undefined
                      ? opcion.backgroundColor
                      : animBackground.interpolate({
                        inputRange: [0, 1],
                        outputRange: [toolbarBackgroundColor || opcion.backgroundColor, opcion.backgroundColor]
                      })
                }
              ]}
            >
              {/* Sombra */}
              <Animated.View
                style={[
                  styles.sombra,
                  {
                    opacity: animSombra.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1]
                    })
                  }
                ]}
              >
                <LinearGradient colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]} style={styles.sombra} />
              </Animated.View>

              {/* Fondo para click*/}
              <Animated.View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "black",
                  opacity: animPress.interpolate({ inputRange: [0, 1], outputRange: [0, 0.2] })
                }}
              />

              {/* Icono */}
              {"icono" in opcion &&
                opcion.icono != undefined && (
                  <Animated.View
                    style={{
                      opacity: anim.interpolate({
                        inputRange: [0, 0.7, 1],
                        outputRange: [0, 0, 1]
                      }),
                      backgroundColor: "transparent",
                      transform: [
                        {
                          scale: anim.interpolate({
                            inputRange: [0, 0.7, 1],
                            outputRange: [0, 0, 1]
                          })
                        }
                      ]
                    }}
                  >
                    <Icon
                      style={[
                        styles.encabezado_OpcionIcono,
                        { fontSize: opcion.iconoFontSize, marginBottom: marginIcon, color: opcion.iconoColor }
                      ]}
                      type={"MaterialCommunityIcons"}
                      name={opcion.icono}
                    />
                  </Animated.View>
                )}

              {/* Texto */}
              <Animated.View
                style={{
                  backgroundColor: "transparent",
                  transform: [
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [yTextoCollapse, 0]
                      })
                    }
                  ]
                }}
              >
                <Animated.Text
                  style={[
                    {
                      fontSize: opcion.tituloFontSize,
                      color:
                        toolbarTituloColor == undefined
                          ? opcion.tituloColor
                          : animBackground.interpolate({
                            inputRange: [0, 1],
                            outputRange: [toolbarTituloColor, opcion.tituloColor]
                          })
                    }
                  ]}
                >
                  {opcion.titulo.toUpperCase()}
                </Animated.Text>
              </Animated.View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "white"
  },
  encabezado_Opciones: {
    height: "100%",
    width: "100%",
    position: "absolute",
    flexDirection: "column",
    top: Platform.select({
      ios: 20,
      android: 0
    }),
    display: "flex"
  },
  encabezado_Opcion: {
    height: "100%",
    overflow: "hidden",
    position: "absolute",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 1
  },
  encabezado_OpcionInterior: {
    height: "100%",
    overflow: "hidden",
    width: "100%",
    paddingTop: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  encabezado_OpcionIcono: {
    marginBottom: 8,
    color: "white"
  },
  content: {
    flex: 1
  },
  sombra: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: hSombra
  },
  btnLeft: {
    position: "absolute",
    left: 8,
    width: 48,
    height: 48,
    zIndex: 100,
    borderRadius: 48,
    overflow: "hidden",
    top: 16
  },
  btnLeftBtn: {
    borderRadius: 48,
    display: "flex",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
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
