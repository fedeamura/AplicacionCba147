import React from "react";
import {
  View,
  Animated,
} from "react-native";
import { Card } from 'react-native-paper';
import IndicadorPaso from "./IndicadorPaso";
import MiCardDetalle from "@Utils/MiCardDetalle";

export default class RequerimientoNuevo_Paso extends React.Component {
  constructor(props) {
    super(props);

    let expandido = props.expandido || false;
    this.state = {
      expandido: expandido,
    };

    this.anim = new Animated.Value(expandido ? 1 : 0);
    this.animCargando = new Animated.Value(props.cargando == true ? 0.5 : 1);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.expandido != nextProps.expandido) {
      if (nextProps.expandido == true) {
        this.expandir();
      } else {
        this.comprimir();
      }
    }

    //Animo el cargando
    Animated.timing(this.animCargando, { toValue: nextProps.cargando == true ? 0.5 : 1, duration: 300 }).start();
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
      <MiCardDetalle
        padding={false}
        backgroundColor={this.state.expandido == 1 ? 'white' : 'transparent'}
        elevation={this.state.expandido == 1 ? 2 : 0}
        style={{
          borderRadius: 16,
          padding: 16
        }}>

        {/* Indicador */}
        <IndicadorPaso
          completado={this.props.completado}
          cargando={this.props.cargando}
          resaltado={this.state.expandido}
          numero={this.props.numero + 'º'}
          texto={this.props.titulo}
          colorFondoCirculo='white'
          colorFondoCirculoCompletado='green'
          colorTextoCirculo='green'
          colorTextoCirculoCompletado='white'
          onPress={() => this.props.onPress(this.props.numero)} />

        {this.state.expandido == true && (
          <View style={{ height: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.1)' }} />

        )}

        {/* Paso  */}
        <Animated.View
          pointerEvents={this.props.cargando ? 'none' : 'auto'}
          style={{
            overflow: 'hidden',
            opacity: this.anim,
            maxHeight: this.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1000]
            })
          }} >
          <Animated.View style={{ opacity: this.animCargando }}>
            {this.props.children}
          </Animated.View>

        </Animated.View>
      </MiCardDetalle>
    );
  }
}