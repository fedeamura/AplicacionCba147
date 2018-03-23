import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  LayoutAnimation,
  UIManager,
  Animated,
  StatusBar,
  Image,
  Text
} from "react-native";
import {
  Button
} from "react-native-paper";
import WebImage from 'react-native-web-image'

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "Cordoba/src/UI/App";
import AppStyles from "Cordoba/src/UI/Styles/default";

export default class Landing extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      animandoEntrada: true,
      animandoSalida: false
    }
    this.animEntrada = new Animated.Value(0);
    this.animSalida = new Animated.Value(0);
  }

  componentDidMount() {
    this.animarEntrada();
  }

  animarEntrada() {
    Animated.spring(this.animEntrada, {
      toValue: 1
    }).start(() => {
      this.setState({
        animandoEntrada: false
      });
      this.props.onEntrar();
    });
  }

  animarSalida() {
    this.setState({
      animandoSalida: true
    }, () => {
      Animated.spring(this.animSalida, {
        toValue: 1
      }).start(() => {
        this.props.onSalir(true);
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.salir) {
      this.animarSalida();
    }
  }

  render() {

    const imageUri = 'https://lh3.googleusercontent.com/0oKhFnzCvEBACju9oJs5vaqpHcTPTrJUt0ZSx20J6VelB0GBlSKKYdjVJbAxT2z2TUeG=w300-rw'
    return (
      <View style={styles.contenedor}>
        <Animated.View style={{
          transform: [{
            scale:
              this.state.animandoEntrada ?
                this.animEntrada.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
                :
                this.animSalida.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 10],
                  extrapolateRight: 'clamp'
                })
          }],
          opacity:
            this.state.animandoEntrada ?
              this.animEntrada.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolateRight: 'clamp'
              })
              :
              this.animSalida.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 1, 0],
                extrapolateRight: 'clamp'
              })
        }}>
          <WebImage style={styles.img} source={{ uri: imageUri }} />
        </Animated.View>
      </ View >
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: global.styles.colorPrimary,
    alignItems: 'center'
  },
  img: {
    width: 100,
    height: 100
  }
});
