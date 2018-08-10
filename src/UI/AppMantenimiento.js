import React from "react";
import { Text, View, Animated, StatusBar } from "react-native";
import LottieView from "lottie-react-native";


export default class AppMantenimiento extends React.PureComponent {
  constructor(props) {
    super(props);

    this.anim = new Animated.Value(props.visible == true ? 1 : 0);
    this.animMantenimiento = new Animated.Value(0);

    if (props.visible == true) {
      this.animar();
    }
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    visible: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible == this.props.visible) return;
    Animated.timing(this.anim, { toValue: nextProps.visible ? 1 : 0, duration: 300 }).start();

    if (nextProps.visible == true) {
      this.animar();
    } else {
      this.pausar();
    }
  }

  animar = () => {
    this.animacionActual = Animated.loop(
      Animated.sequence([
        Animated.timing(this.animMantenimiento, {
          toValue: 0.5,
          duration: 7000
        }),
        Animated.timing(this.animMantenimiento, {
          toValue: 0,
          duration: 7000
        })
      ])
    ).start();
  }

  pausar = () => {
    if (this.animacionActual != undefined) {
      this.animacionActual.stop();
    }
  }

  render() {
    return (
      <Animated.View
        pointerEvents={this.props.visible == true ? "auto" : "none"}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: this.anim
        }}
      >
        <StatusBar backgroundColor="white" barStyle="dark-content" />

        <View
          style={{
            width: 300,
            height: 250,
            alignSelf: "center"
          }}
        >
          <LottieView
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
            source={require("@Resources/animacion_construccion.json")}
            progress={this.animMantenimiento}
          />
        </View>

        <Text style={{ alignSelf: "center", fontSize: 32, textAlign: "center" }}>
          {texto_AplicacionMantenimiento_Titulo}
        </Text>
        <Text style={{ alignSelf: "center", fontSize: 20, textAlign: "center" }}>
          {texto_AplicacionMantenimiento_Subtitulo}
        </Text>
      </Animated.View>
    );
  }
}

const texto_AplicacionMantenimiento_Titulo = "Aplicación en mantenimiento";
const texto_AplicacionMantenimiento_Subtitulo = "Volveremos pronto";
