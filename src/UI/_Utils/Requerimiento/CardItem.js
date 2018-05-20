import React, { Component } from "react";
import { View, Animated, Dimensions } from "react-native";

//Mis compontentes
import App from "@UI/App";
import AppTheme from "@UI/AppTheme";
import { Text } from "native-base";
import { Card, CardContent } from "react-native-paper";
import ExtraDimensions from 'react-native-extra-dimensions-android';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import color from "color";

export default class ServicioCardItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    const style = AppTheme.style.inicio.requerimientos;

    let color_inicio = color(this.props.estadoColor).lighten(0.3).hex();
    let color_fin = color(this.props.estadoColor).lighten(0.1).hex();
    let radius = 16;
    let padding = 16;
    let margin = 16;

    return (
      <Card
        style={style.cardItem}
        onPress={() => {
          if (this.props.onPress != undefined) {
            this.props.onPress();
          }
        }}>

        <View style={style.cardItemContent}>
          <LinearGradient colors={[color_inicio, color_fin]} style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderTopLeftRadius: radius, borderTopRightRadius: radius, overflow:'hidden' }} pointerEvents="none" />

          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold", fontSize: 24, backgroundColor: 'transparent', color: 'white' }}>{this.props.numero + '/' + this.props.año}</Text>
          </View>
          <View style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Text style={{ fontWeight: "bold", backgroundColor: 'transparent', color: 'white' }}>{this.props.estadoNombre}</Text>
            <Text style={{ fontSize: 14, backgroundColor: 'transparent', color: 'white' }}>{this.props.fechaAlta}</Text>
          </View>

        </View>

        <View style={{ padding: padding }}>
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
            <Text style={{ backgroundColor: 'transparent', color: 'white' }}>Nº 10 - Central</Text>
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

