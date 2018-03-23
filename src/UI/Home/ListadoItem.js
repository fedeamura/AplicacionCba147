import React from "react";
import {
  View,
  Platform,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from "react-native";
import { Text } from "native-base";
import {
  Paper,
  TouchableRipple,
  Card,
  CardContent
} from "react-native-paper";

//Mis compontentes
import AppStyles from "Cordoba/src/UI/Styles/default";

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
    return (
      <Animated.View style={this.props.animStyle}>

        <View ref={ref => (this.view = ref)} style={[styles.item, {
          paddingBottom: (this.props.conFab && this.props.index == this.props.count - 1) ? (72 + 16) : 0
        }]}>
          <Card
            style={
              [
                styles.card,
                {
                  borderColor: "#" + this.props.data.Estado.Estado.Color,
                  borderLeftWidth: 8
                },
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
            <CardContent>
              <View style={styles.contenedorEncabezado}>
                <Text style={styles.textoNumero}>
                  {this.props.data.Numero}/{this.props.data.Año}
                </Text>
              </View>
              <Text>Servicio: {this.props.data.ServicioNombre}</Text>
              <Text>Motivo: {this.props.data.MotivoNombre}</Text>

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
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginTop: 8
  },
  textoNumero: {
    fontSize: 24,
    flex: 1
  },
  textoFecha: { marginTop: 8, fontSize: 14 },
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
  }
});
