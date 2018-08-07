import React from "react";
import { View } from "react-native";
import { Button, Text } from "native-base";
import autobind from "autobind-decorator";

//Mis componentes
import App from "@UI/App";
import MiItemDetalle from "@Utils/MiItemDetalle";

export default class RequerimientoNuevo_PasoConfirmacion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    onReady: () => {}
  };

  @autobind
  informarReady() {
    this.props.onReady();
  }

  render() {
    return (
      <View>
        <View style={{ padding: 16 }}>
          {this.props.servicio != undefined && (
            <MiItemDetalle titulo="Categoria" subtitulo={this.props.servicio} />
          )}
          {this.props.motivo != undefined && (
            <View>
              <View style={{ height: 8 }} />
              <MiItemDetalle titulo="Motivo" subtitulo={this.props.motivo} />
            </View>
          )}
          {this.props.descripcion != undefined && (
            <View>
              <View style={{ height: 8 }} />
              <MiItemDetalle titulo="Descripción" subtitulo={this.props.descripcion} />
            </View>
          )}
          {this.props.ubicacion != undefined && (
            <View>
              <View style={{ height: 8 }} />
              <MiItemDetalle titulo="Descripción" subtitulo={this.props.ubicacion} />
            </View>
          )}
        </View>

        <View style={{ height: 1, width: "100%", backgroundColor: "rgba(0,0,0,0.1)" }} />

        <View style={{ padding: 16 }}>
          <Button
            onPress={this.informarReady}
            rounded
            small
            bordered
            style={{
              alignSelf: "flex-end",
              borderColor: "green"
            }}
          >
            <Text style={{ color: "green" }}>Registrar</Text>
          </Button>
        </View>
      </View>
    );
  }
}
