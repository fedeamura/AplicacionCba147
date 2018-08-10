import React from "react";
import { View } from "react-native";
import WebImage from "react-native-web-image";

//Mis componentes
import App from "@UI/App";
import MiView from "@Utils/MiView";
import MiItemDetalle from "@Utils/MiItemDetalle";
import MiBoton from "@Utils/MiBoton";
import { toTitleCase } from "@Utils/Helpers";

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
    onReady: function () { },
    onUbicacion: function () { }
  };

  onUbicacion = (ubicacion) => {
    this.setState({
      ubicacion: ubicacion,
      viewSeleccionarVisible: false
    }, () => {
      this.informarUbicacion();

      setTimeout(() => {
        this.setState({
          viewSeleccionadoVisible: true
        });
      }, 300);
    });
  }

  cancelarUbicacion = () => {
    this.setState({
      ubicacion: undefined,
      viewSeleccionadoVisible: false
    }, () => {
      this.informarUbicacion();

      setTimeout(() => {
        this.setState({
          viewSeleccionarVisible: true
        });
      }, 300);
    });
  }

  seleccionarUbicacion = () => {
    App.navegar("PickerUbicacion", {
      onUbicacionSeleccionada: this.onUbicacion
    });
  }

  informarUbicacion = () => {
    this.props.onUbicacion(this.state.ubicacion);
  }

  informarReady = () => {
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
        <View style={{ padding: 16 }}>

          <MiBoton
            padding={16}
            verde
            sombra
            centro
            rounded
            small
            texto={texto_BotonSeleccionar}
            onPress={this.seleccionarUbicacion}
          />
        </View>

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

    let textoDireccion = 'Sin datos';
    if (this.state.ubicacion.direccion != undefined) {
      textoDireccion = (this.state.ubicacion.sugerido == true ? "Aproximadamente en " : "") + this.state.ubicacion.direccion.trim();
    }
    let textoObservaciones = 'Sin datos';
    if (this.state.ubicacion.observaciones != undefined) {
      textoObservaciones = this.state.ubicacion.observaciones.trim();
    }
    let textoCpc;
    if (this.state.ubicacion.cpc != undefined) {
      textoCpc = "Nº " + this.state.ubicacion.cpc.numero + " - " + toTitleCase(this.state.ubicacion.barrio.nombre);
    } else {
      textoCpc = "Sin datos";
    }
    let textoBarrio;
    if (this.state.ubicacion.barrio != undefined) {
      textoBarrio = toTitleCase(this.state.ubicacion.barrio.nombre);
    } else {
      textoBarrio = toTitleCase("Sin datos");
    }

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
                <MiItemDetalle titulo={texto_Direccion} subtitulo={textoDireccion} />
                <View style={{ height: 8 }} />
                <MiItemDetalle titulo={texto_Observaciones} subtitulo={textoObservaciones} />
                <View style={{ height: 8 }} />
                <MiItemDetalle titulo={texto_Barrio} subtitulo={textoBarrio} />
                <View style={{ height: 8 }} />
                <MiItemDetalle titulo={texto_Cpc} subtitulo={textoCpc} />

                <View style={{ height: 8 }} />

                <MiBoton
                  small
                  link
                  rojo
                  onPress={this.cancelarUbicacion}
                  texto={texto_BotonCancelar}
                />
              </View>
            </View>
          </View>


        </View>

        <View style={{ height: 16 }} />
        <View style={{ height: 1, width: "100%", backgroundColor: "rgba(0,0,0,0.1)" }} />

        <MiBoton
          texto={texto_BotonSiguiente}
          padding={16}
          sombra
          verde
          rounded
          small
          onPress={this.informarReady}
          derecha
        />
      </MiView>
    );
  }
}

const texto_BotonSeleccionar = "Seleccionar ubicación";
const texto_Direccion = "Dirección";
const texto_Observaciones = "Observaciones del domicilio";
const texto_Barrio = "Barrio";
const texto_Cpc = "CPC";
const texto_BotonCancelar = "Cancelar ubicación";
const texto_BotonSiguiente = "Siguiente";
