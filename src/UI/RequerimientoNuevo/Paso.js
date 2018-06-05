import React, { Component } from "react";
import {
  Platform,
  View,
  UIManager,
  Alert,
  Animated,
  StatusBar,
  ScrollView,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import {
  Container,
  Button,
  Text,
  Input,
  Content
} from "native-base";
import { Card, CardContent } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import WebImage from 'react-native-web-image'
import LinearGradient from 'react-native-linear-gradient';
import color from "color";
import IndicadorPaso from "./IndicadorPaso";

//Mis componentes
import App from "@UI/App";

export default class RequerimientoNuevo_Paso extends React.Component {
  constructor(props) {
    super(props);

    let expandido = props.expandido || false;
    this.state = {
      expandido: expandido,
      anim: new Animated.Value(expandido ? 1 : 0)
    };

  }

  componentWillReceiveProps(nextProps) {
    if (this.state.expandido == nextProps.expandido) return;

    if (nextProps.expandido == true) {
      this.expandir();
    } else {
      this.comprimir();
    }
  }

  expandir() {
    this.setState({ expandido: true }, () => {
      Animated.timing(this.state.anim, { duration: 300, toValue: 1 }).start();
    })
  }

  comprimir() {
    this.setState({ expandido: false }, () => {
      Animated.timing(this.state.anim, { duration: 300, toValue: 0 }).start();
    });
  }

  render() {

    return (
      <Card
        style={{
          padding: 16,
          backgroundColor: this.state.expandido == 1 ? 'white' : 'transparent',
          elevation: this.state.expandido == 1 ? 2 : 0
        }}>

        {/* Indicador */}
        <IndicadorPaso
          completado={this.props.completado}
          resaltado={this.state.expandido}
          numero={this.props.numero + 'º'}
          texto={this.props.titulo}
          colorFondoCirculo='white'
          colorFondoCirculoCompletado='green'
          colorTextoCirculo='green'
          colorTextoCirculoCompletado='white'
          onPress={() => this.props.onPress(this.props.numero)} />

        {/* Paso  */}
        <Animated.View style={{
          overflow: 'hidden',
          opacity: this.state.anim,
          maxHeight: this.state.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1000]
          })
        }} >
          {this.props.children}
        </Animated.View>
      </Card>
    );
  }
}