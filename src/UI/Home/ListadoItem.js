import React from "react";
import {
  View,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";
import { Text } from "native-base";
import {
  Paper,
  TouchableRipple,
  Card,
  CardContent
} from "react-native-paper";
import LinearGradient from 'react-native-linear-gradient';
import color from "color";

//Mis compontentes
import App from "@UI/App";
import AppTheme from "@UI/AppTheme";

export default class ListadoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: undefined
    };

    if (!('conFab' in props)) {
      props.conFab = false;
    }

  }

  saveLayout(callback) {
    this.view.measureInWindow((x, y, width, height) => {
      var dimensions = {
        x: x,
        y: y,
        width: width,
        height: height
      };
      callback(dimensions);
    });
  }

  render() {
    const colorBase = "#" + this.props.data.Estado.Estado.Color;
    const colorBaseOscuro = color(colorBase)
      .darken(0.4)
      .rgb()
      .string();

    return (
      <View ref={ref => (this.view = ref)} style={
        [
          styles.item,
          {
            paddingBottom: (this.props.conFab && this.props.index == this.props.count - 1) ? (72 + 16) : 0
          }
        ]
      }>
        <Card
          style={
            [
              styles.card,
              {
                marginTop: this.props.index == 0 ? 16 : 8
              }
            ]
          }
          onPress={() => {
            if (this.props.onClick != undefined) {
              this.saveLayout(dimen => {
                this.props.onClick(this.props.data, dimen, this.props.index);
              });
            }
          }}
        >
          <LinearGradient colors={[colorBase, colorBaseOscuro]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 }}></LinearGradient>
          <CardContent style={styles.cardContent}>


            <View style={styles.contenedorEncabezado}>
              <Text style={styles.textoNumero}>
                {this.props.data.Numero}/{this.props.data.Año}
              </Text>
            </View>
            <Text style={styles.texto}>Servicio: {this.props.data.ServicioNombre}</Text>
            <Text style={styles.texto}>Motivo: {this.props.data.MotivoNombre}</Text>

            {/*
            <View style={styles.contenedorEstado}>
              <View style={[styles.indicadorEstado, {backgroundColor: '#' + this.props.data.Estado.Estado.Color}]} />
              <Text>{this.props.data.Estado.Estado.Nombre}</Text>
            </View>
            */}

            <Text style={styles.textoFecha}>
              {this.props.data.FechaAltaString}
            </Text>
          </CardContent>

        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
  },
  cardContent: {
    margin: 0
  },
  textoNumero: {
    fontSize: 24,
    flex: 1,
    color: 'white',
    backgroundColor: 'transparent'
  },
  textoFecha: {
    marginTop: 8,
    fontSize: 14,
    color: 'white',
    backgroundColor: 'transparent'
  },
  contenedorEstado: {
    marginTop: 4,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  indicadorEstado: {
    width: 16,
    marginRight: 4,
    height: 16,
    borderRadius: 50,
    backgroundColor: "red"
  },
  texto: {
    color: 'white',
    backgroundColor: 'transparent'
  },
  contenedorEncabezado: {
    marginTop: 16
  }
});
