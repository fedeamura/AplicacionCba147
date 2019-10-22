import React from "react";
import { StatusBar, View, StyleSheet, Animated } from "react-native";
import { Button, Text } from "native-base";

export default class AppError extends React.PureComponent {
  static defaultProps = {
    ...React.Component.defaultProps,
    visible: false,
    error: "",
    mostrarBoton: false,
    botonTexto: "Reintentar",
    onBotonPress: function () { }
  };

  constructor(props) {
    super(props);
    this.anim = new Animated.Value(props.visible == true ? 1 : 0);
  }

  getDerivedStateFromProps(nextProps) {
    if (nextProps.visible == this.props.visible) return;
    Animated.timing(this.anim, { toValue: nextProps.visible ? 1 : 0, duration: 300 }).start();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible == this.props.visible) return;
    Animated.timing(this.anim, { toValue: nextProps.visible ? 1 : 0, duration: 300 }).start();
  }


  render() {
    return (
      <Animated.View
        pointerEvents={this.props.visible == true ? "auto" : "none"}
        style={[styles.contenedor, { opacity: this.anim }]}
      >
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <Text style={styles.texto}>{this.props.error}</Text>

        {this.props.mostrarBoton == true && (
          <View style={{ marginTop: 32 }}>
            <Button rounded style={styles.boton} onPress={this.props.onBotonPress}>
              <Text>{this.props.botonTexto}</Text>
            </Button>
          </View>
        )}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  texto: {
    fontSize: 24,
    maxWidth: 300,
    textAlign: "center"
  },
  boton: {
    backgroundColor: "#01a15a",
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowColor: "#01a15a",
    shadowOffset: { width: 0, height: 7 },
    alignSelf: "center"
  }
});
