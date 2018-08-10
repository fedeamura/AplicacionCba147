import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "native-base";
import { Card } from "react-native-paper";

//Mis compontentes
import { toTitleCase, stringDateToString } from "@Utils/Helpers";

export default class RequerimientoCardItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.onPress(this.props.data);
  }

  render() {
    const numero = this.props.data.numero || "XXXXXX";
    const año = this.props.data.año || "XX";
    const fecha = stringDateToString(this.props.data.fechaAlta);

    //Estado Color
    let estadoColor = "black";
    if (this.props.data.estadoPublicoColor != undefined) {
      estadoColor = "#" + this.props.data.estadoPublicoColor;
    } else {
      if (this.props.data.estadoColor != undefined) {
        estadoColor = "#" + this.props.data.estadoColor;
      }
    }

    //Estado nombre
    let estadoNombre = "Sin datos";
    if (this.props.data.estadoPublicoNombre != undefined) {
      estadoNombre = this.props.data.estadoPublicoNombre;
    } else {
      if (this.props.data.estadoNombre != undefined) {
        estadoNombre = this.props.data.estadoNombre;
      }
    }
    estadoNombre = toTitleCase(estadoNombre);

    //Datos
    const servicio = toTitleCase(this.props.data.servicioNombre || "Sin datos").trim();
    const motivo = toTitleCase(this.props.data.motivoNombre || "Sin datos").trim();
    const cpc = toTitleCase(
      (this.props.data.cpcNumero || "X") + " - " + (this.props.data.cpcNombre || "Sin datos")
    ).trim();
    const barrio = toTitleCase(this.props.data.barrioNombre || "Sin datos").trim();

    return (
      <Card style={styles.cardItem} onPress={this.onPress}>
        <View style={[styles.cardItemHeader]}>
          <View style={styles.contenedorNumero}>
            <Text numberOfLines={1} style={styles.textoNumero}>
              {" "}
              {numero + "/" + año}
            </Text>
            <View style={styles.contenedorEstado}>
              <View style={[styles.indicadorEstado, { backgroundColor: estadoColor }]} />
              <Text style={styles.textoEstado}>{estadoNombre}</Text>
            </View>
          </View>
          <Text style={styles.textoFecha}>{fecha}</Text>
        </View>

        <View style={[styles.divisorEstado, { backgroundColor: estadoColor }]} />
        <View style={styles.contenedorDatos}>
          <View style={styles.contenedorItem}>
            <Text numberOfLines={1} style={styles.texto_ItemTitulo}>
              Servicio:{" "}
            </Text>
            <Text numberOfLines={1} style={styles.texto_ItemDetalle}>
              {servicio}
            </Text>
          </View>
          <View style={styles.contenedorItem}>
            <Text numberOfLines={1} style={styles.texto_ItemTitulo}>
              Motivo:{" "}
            </Text>
            <Text numberOfLines={1} style={styles.texto_ItemDetalle}>
              {motivo}
            </Text>
          </View>
          <View style={styles.contenedorItem}>
            <Text numberOfLines={1} style={styles.texto_ItemTitulo}>
              CPC:{" "}
            </Text>
            <Text numberOfLines={1} style={styles.texto_ItemDetalle}>
              {cpc}
            </Text>
          </View>
          <View style={styles.contenedorItem}>
            <Text numberOfLines={1} style={styles.texto_ItemTitulo}>
              Barrio:{" "}
            </Text>
            <Text numberOfLines={1} style={styles.texto_ItemDetalle}>
              {barrio}
            </Text>
          </View>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  cardItem: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8
  },
  cardItemHeader: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    display: "flex",
    flexDirection: "row",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.025)"
  },
  contenedorNumero: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  contenedorFecha: {
    display: "flex",
    alignItems: "flex-end"
  },
  textoNumero: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 24,
    marginLeft: -4,
    color: "black"
  },
  contenedorEstado: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4
  },
  indicadorEstado: {
    width: 16,
    height: 16,
    borderRadius: 16,
    marginRight: 4
  },
  textoEstado: {
    backgroundColor: "transparent",
    color: "black"
  },
  divisorEstado: {
    width: "100%",
    height: 3,
    opacity: 0.4
  },
  textoFecha: {
    fontSize: 14,
    marginTop: 2,
    backgroundColor: "transparent",
    color: "black"
  },
  contenedorDatos: {
    padding: 16
  },
  contenedorItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start"
  },
  texto_ItemTitulo: {
    fontWeight: "bold",
    backgroundColor: "transparent",
    color: "black"
  },
  texto_ItemDetalle: {
    flex: 1,
    backgroundColor: "transparent",
    color: "black"
  }
});
