import React, { Component } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Dimensions
} from "react-native";
import {
  Spinner,
  Text
} from "native-base";

export default class indicadorCargando extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      animando: false,
      anim: new Animated.Value(0)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.mostrar();
    } else {
      this.ocultar();
    }
  }

  mostrar() {
    this.setState(
      {
        animando: true,
        visible: true
      },
      function () {
        Animated.timing(
          // Animate over time
          this.state.anim, // The animated value to drive
          {
            toValue: 1 // Animate to opacity: 1 (opaque)
          }
        ).start(
          function () {
            this.setState({
              animando: false
            });
          }.bind(this)
        );
      }.bind(this)
    );
  }

  ocultar() {
    this.setState(
      {
        animando: true,
        visible: false
      },
      function () {
        Animated.timing(
          // Animate over time
          this.state.anim, // The animated value to drive
          {
            toValue: 0 // Animate to opacity: 1 (opaque)
          }
        ).start(
          function () {
            this.setState({
              animando: false
            });
          }.bind(this)
        );
      }.bind(this)
    );
  }

  render() {
    let w = Dimensions.get("window").width + 200;
    let h = Dimensions.get("window").height + 200;

    return (
      <Animated.View
        pointerEvents={this.state.visible ? "auto" : "none"}
        style={[
          styles.indicadorCargando,
          {
            opacity: this.state.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            }),
            width: w,
            height: h
          }
        ]}
      >
        <Spinner color="white" />
        <Text style={{ color: "white" }}>Cargando</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  indicadorCargando: {
    position: "absolute",
    left: -100,
    top: -100,
    width: 10,
    height: 10,
    justifyContent: "center",
    borderTopWidth: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    flexDirection: "column",
    display: "flex",
    zIndex: 10,
    elevation: 10
  }
});
