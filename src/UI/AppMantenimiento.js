import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  StatusBar
} from "react-native";
import LottieView from 'lottie-react-native';

// const url_ImagenLogo = "https://lh3.googleusercontent.com/0oKhFnzCvEBACju9oJs5vaqpHcTPTrJUt0ZSx20J6VelB0GBlSKKYdjVJbAxT2z2TUeG=w300-rw";
const texto_AplicacionMantenimiento_Titulo = "Aplicación en mantenimiento";
const texto_AplicacionMantenimiento_Subtitulo = "Volveremos pronto";

export default class AppMantenimiento extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      animMostar: new Animated.Value(0),
      animMantenimiento: new Animated.Value(0)
    }
  }

  componentDidMount() {
    Animated.sequence([
      Animated.timing(this.state.animMostar, { toValue: 1, duration: 1000 }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(this.state.animMantenimiento, {
            toValue: 0.5,
            duration: 7000
          }),
          Animated.timing(this.state.animMantenimiento, {
            toValue: 0,
            duration: 7000
          })
        ]))
    ]).start();
  }

  render() {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: this.state.animMostar
        }}
      >

        {/* <WebImage
          resizeMode="cover"
          style={{ width: 100, height: 100 }}
          source={{ uri: url_ImagenLogo }}
        /> */}

        <View
          style={{
            width: 300,
            height: 250,
            alignSelf: 'center'
          }}>
          <LottieView
            style={{ width: '100%', height: '100%' }}
            resizeMode='contain'
            source={require('@Resources/animacion_construccion.json')}
            progress={this.state.animMantenimiento} />
        </View>

        <Text style={{ alignSelf: 'center', fontSize: 32, textAlign: 'center' }}>{texto_AplicacionMantenimiento_Titulo}</Text>
        <Text style={{ alignSelf: 'center', fontSize: 20, textAlign: 'center' }}>{texto_AplicacionMantenimiento_Subtitulo}</Text>
      </Animated.View>
    );
  }
}
