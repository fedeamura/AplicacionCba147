import React, { Component } from "react";
import { View, Animated, Dimensions, Alert } from "react-native";

//Mis compontentes
import App from "@UI/App";
import { Text } from "native-base";
import { Card, CardContent } from "react-native-paper";
import ExtraDimensions from 'react-native-extra-dimensions-android';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import color from "color";

import Rules_Ajustes from "@Rules/Rules_Ajustes";

export default class ServicioCardItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tipo: undefined
    };

  }

  componentDidMount() {
    Rules_Ajustes.getListadoRequerimientoInterfaz().then((result) => {
      this.setState({
        tipo: result
      });
    });
  }

  render() {
    if (this.state.tipo == undefined) return null;
    const initData = global.initData.inicio.paginas.requerimientos;

    return (
      <Card
        style={initData.styles.cardItem}
        onPress={() => {
          if (this.props.onPress != undefined) {
            this.props.onPress();
          }
        }}>

        <View style={[initData.styles.cardItemHeader, { backgroundColor: this.props.estadoColor }]}>
          {this.state.tipo == 1 && (
            <LinearGradient
              colors={["rgba(255,255,255,0.5)", "rgba(255,255,255,0)"]}
              backgroundColor="transparent"
              style={initData.styles.cardItemHeaderGradiente}
              pointerEvents="none" />
          )}

          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold", fontSize: 24, backgroundColor: 'transparent', color: 'white' }}>{this.props.numero + '/' + this.props.año}</Text>
          </View>
          <View style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Text style={{ fontWeight: "bold", backgroundColor: 'transparent', color: 'white' }}>{this.props.estadoNombre}</Text>
            <Text style={{ fontSize: 14, backgroundColor: 'transparent', color: 'white' }}>{this.props.fechaAlta}</Text>
          </View>

        </View>

        <View style={{ padding: 16 }}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontWeight: "bold", backgroundColor: 'transparent', color: 'black' }}>Servicio: </Text>
            <Text style={{ backgroundColor: 'transparent', color: 'black' }}>Alumbrado</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontWeight: "bold", backgroundColor: 'transparent', color: 'black' }}>Motivo: </Text>
            <Text style={{ backgroundColor: 'transparent', color: 'black' }}>Foco Roto</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontWeight: "bold", backgroundColor: 'transparent', color: 'black' }}>CPC: </Text>
            <Text style={{ backgroundColor: 'transparent', color: 'black' }}>Nº 10 - Central</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontWeight: "bold", backgroundColor: 'transparent', color: 'black' }}>Barrio: </Text>
            <Text style={{ backgroundColor: 'transparent', color: 'black' }}>Centro</Text>
          </View>
        </View>

      </Card>
    );
  }
}

