import React from "react";
import {
  Animated,
} from "react-native";
import { Card } from 'react-native-paper';
import IndicadorPaso from "./IndicadorPaso";

export default class RequerimientoNuevo_Paso extends React.Component {
  constructor(props) {
    super(props);

    let expandido = props.expandido || false;
    this.state = {
      expandido: expandido,
    };

    this.anim = new Animated.Value(expandido ? 1 : 0);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.expandido == nextProps.expandido) return;

    if (nextProps.expandido == true) {
      this.expandir();
    } else {
      this.comprimir();
    }
  }

  expandir = () => {
    this.setState({ expandido: true }, () => {
      Animated.timing(this.anim, { duration: 300, toValue: 1 }).start();
    })
  }

  comprimir = () => {
    this.setState({ expandido: false }, () => {
      Animated.timing(this.anim, { duration: 300, toValue: 0 }).start();
    });
  }

  render() {

    return (
      <Card
        style={{
          borderRadius: 16,
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
          opacity: this.anim,
          maxHeight: this.anim.interpolate({
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