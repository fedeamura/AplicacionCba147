import React from "react";
import { View, Alert } from "react-native";
import { Button, Text } from "native-base";
import WebImage from "react-native-web-image";
import LinearGradient from "react-native-linear-gradient";
import autobind from "autobind-decorator";

//Mis componentes
import App from "@UI/App";
import MiView from "@Utils/MiView";

export default class RequerimientoNuevo_PasoUbicacion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ubicacion: undefined,
      viewSeleccionarVisible: true,
      viewSeleccionadoVisible: false
    };
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    onReady: function() {},
    onUbicacion: function() {}
  };

  @autobind
  onUbicacion(ubicacion) {
    this.setState({ ubicacion: ubicacion, viewSeleccionarVisible: false }, function() {
      this.informarUbicacion();

      setTimeout(
        function() {
          this.setState({ viewSeleccionadoVisible: true });
        }.bind(this),
        300
      );
    });
  }

  @autobind
  cancelarUbicacion() {
    this.setState({ ubicacion: undefined, viewSeleccionadoVisible: false }, function() {
      this.informarUbicacion();

      setTimeout(
        function() {
          this.setState({ viewSeleccionarVisible: true });
        }.bind(this),
        300
      );
    });
  }

  @autobind
  seleccionarUbicacion() {
    App.navegar("PickerUbicacion", {
      onUbicacionSeleccionada: this.onUbicacion
    });
  }

  @autobind
  informarUbicacion() {
    this.props.onUbicacion(this.state.ubicacion);
  }

  @autobind
  informarReady() {
    this.props.onReady();
  }

  render() {
    return (
      <View style={{ minHeight: 100 }}>
        {this.renderViewSeleccionar()}
        {this.renderViewSeleccionado()}
      </View>
    );
  }

  renderViewSeleccionar() {
    return (
      <MiView visible={this.state.viewSeleccionarVisible}>
        <Button
          bordered
          rounded
          small
          onPress={this.seleccionarUbicacion}
          style={{
            borderColor: "green",
            alignSelf: "center",
            margin: 32
          }}
        >
          <Text style={{ color: "green" }}>{texto_BotonSeleccionar}</Text>
        </Button>
      </MiView>
    );
  }

  renderViewSeleccionado() {
    if (this.state.ubicacion == undefined) return null;

    const initData = global.initData;

    let url =
      "https://maps.googleapis.com/maps/api/staticmap?center=&zoom=13&scale=1&size=600x300&maptype=roadmap&format=png&visual_refresh=false&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C{lat},+{lng}";
    url = url.replace("{lat}", ("" + this.state.ubicacion.latitud).replace(",", "."));
    url = url.replace("{lng}", ("" + this.state.ubicacion.longitud).replace(",", "."));

    let textoDireccion =
      (this.state.ubicacion.sugerido == true ? "Aproximadamente en " : "") + this.state.ubicacion.direccion;
    let textoObservaciones = this.state.ubicacion.observaciones;
    let textoCpc = "Nº " + this.state.ubicacion.cpc.numero + " - " + this.state.ubicacion.barrio.nombre;
    let textoBarrio = this.state.ubicacion.barrio.nombre;

    return (
      <MiView visible={this.state.viewSeleccionadoVisible}>
        <View>
          <View>
            <WebImage
              resizeMode="cover"
              style={{
                width: "100%",
                height: 200
              }}
              source={{ uri: url }}
            />

            <View style={{}}>
              <View style={{ padding: 16 }}>
                <Text style={{ fontWeight: "bold" }}>Dirección</Text>
                <Text>{textoDireccion}</Text>
                <Text style={{ fontWeight: "bold", marginTop: 8 }}>Observaciones</Text>
                <Text>{textoObservaciones}</Text>
                <Text style={{ fontWeight: "bold", marginTop: 8 }}>CPC</Text>
                <Text>{textoCpc}</Text>
                <Text style={{ fontWeight: "bold", marginTop: 8 }}>Barrio</Text>
                <Text>{textoBarrio}</Text>
              </View>
            </View>
          </View>

          <Button
            small
            transparent
            rounded
            onPress={this.cancelarUbicacion}
            style={{ borderColor: initData.colorError }}
          >
            <Text style={{ color: initData.colorError, textDecorationLine: "underline" }}>Cancelar ubicacion</Text>
          </Button>
        </View>

        <View style={{ height: 16 }} />
        <View style={{ height: 1, width: "100%", backgroundColor: "rgba(0,0,0,0.1)" }} />

        <View style={{ padding: 16 }}>
          <Button
            small
            onPress={this.informarReady}
            rounded
            bordered
            style={{
              alignSelf: "flex-end",
              backgroundColor: initData.colorExito
            }}
          >
            <Text
              style={{
                color: "white"
              }}
            >
              Siguiente
            </Text>
          </Button>
        </View>
      </MiView>
    );
  }
}

const texto_BotonSeleccionar = "Seleccionar ubicacion";
