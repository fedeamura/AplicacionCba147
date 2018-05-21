import React, { Component } from "react";
import {
  View,
  Animated,
  StyleSheet
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
      animando: false
    };

    this.anim = new Animated.Value(0);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.mostrar();
    } else {
      this.ocultar();
    }
  }

  componentDidMount() {
    if (this.props.visible) {
      this.mostrar();
    } else {
      this.ocultar();
    }
  }
  mostrar() {
    this.setState({
      animando: true,
      visible: true
    }, () => {
      Animated.timing(
        this.anim,
        {
          toValue: 1
        }
      ).start(() => {
        this.setState({
          animando: false
        });
      });
    });
  }

  ocultar() {
    this.setState(
      {
        animando: true,
        visible: false
      }, () => {
        Animated.timing(
          // Animate over time
          this.anim, // The animated value to drive
          {
            toValue: 0 // Animate to opacity: 1 (opaque)
          }
        ).start(() => {
          this.setState({
            animando: false
          });
        });
      });
  }

  render() {


    return (
      <Animated.View
        pointerEvents={this.state.visible ? "auto" : "none"}
        style={[
          styles.indicadorCargando,
          this.props.style || {},
          {
            opacity: this.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            })
          }
        ]}
      >
        <Spinner color={this.props.color || 'black'} />
        <Text style={{ color: this.props.color || 'black' }}>{this.props.texto || "Cargando"}</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  indicadorCargando: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    display: "flex", zIndex: 100
  }
});
