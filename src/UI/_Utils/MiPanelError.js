import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "native-base";
import WebImage from "react-native-web-image";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class MiPanelError extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    mostrarBoton: false,
    mostrarImagen: false,
    urlImagen: undefined,
    icono: undefined,
    colorBoton: undefined,
    backgroundColor: undefined
  };

  render() {
    const initData = global.initData;
    const colorFondo = this.props.backgroundColor || global.initData.backgroundColor;
    const colorBoton = this.props.colorBoton || initData.colorVerde;

    return (
      <View style={[styles.contenedor, { backgroundColor: colorFondo }, this.props.style]}>
        <View style={styles.content}>
          {this.renderImagen()}
          {this.renderIcono()}

          {/* Titulo */}
          <Text style={styles.textoTitulo}>{this.props.titulo || "Error procesando la solicitud"}</Text>

          {/* Detalle */}
          {this.props.detalle != undefined && <Text style={styles.textoDetalle}>{this.props.detalle}</Text>}

          {/* Separador */}
          <View style={{ height: 16 }} />

          {/* Boton */}
          {this.props.mostrarBoton == true && (
            <Button
              rounded
              onPress={this.props.onBotonPress}
              style={{
                shadowOpacity: 0.4,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 7 },
                backgroundColor: colorBoton,
                alignSelf: "center",
                shadowColor: colorBoton
              }}
            >
              <Text style={{ color: "white" }}>{this.props.textoBoton}</Text>
            </Button>
          )}
        </View>
      </View>
    );
  }

  renderImagen() {
    if (this.props.urlImagen == undefined) return null;

    return <WebImage resizeMode="cover" style={styles.imagen} source={{ uri: this.props.urlImagen }} />;
  }

  renderIcono() {
    if (this.props.icono == undefined) return null;
    return <Icon name={this.props.icono} style={styles.icono} />;
  }
}

const styles = StyleSheet.create({
  contenedor: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex"
  },
  content: {
    maxWidth: 300,
    justifyContent: "center",
    alignItems: "center",
    display: "flex"
  },
  imagen: {
    backgroundColor: "transparent",
    width: 250,
    height: 250,
    alignSelf: "center"
  },
  icono: {
    fontSize: 72,
    color: "rgba(0,0,0,0.6)"
  },
  textoTitulo: {
    alignSelf: "center",
    textAlign: "center",
    marginTop: 8,
    fontSize: 20
  },
  textoDetalle: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 16
  }
});
