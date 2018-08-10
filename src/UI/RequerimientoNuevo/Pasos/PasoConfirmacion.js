import React from "react";
import { View } from "react-native";

//Mis componentes
import MiItemDetalle from "@Utils/MiItemDetalle";
import MiBoton from "@Utils/MiBoton";

import { toTitleCase } from "@Utils/Helpers";

export default class RequerimientoNuevo_PasoConfirmacion extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    ...React.Component.defaultProps
  };

  render() {
    const initData = global.initData;

    return (
      <View>
        <View style={{ padding: 0 }}>
          {this.props.servicio != undefined && (
            <MiItemDetalle titulo={texto_Servicio} subtitulo={toTitleCase(this.props.servicio)} />
          )}
          {this.props.motivo != undefined && (
            <View>
              <View style={{ height: 8 }} />
              <MiItemDetalle titulo={texto_Motivo} subtitulo={toTitleCase(this.props.motivo)} />
            </View>
          )}
          {this.props.descripcion != undefined && (
            <View>
              <View style={{ height: 8 }} />
              <MiItemDetalle titulo={texto_Descripcion} subtitulo={this.props.descripcion} />
            </View>
          )}
          {this.props.ubicacion != undefined && (
            <View>
              <View style={{ height: 8 }} />
              <MiItemDetalle titulo={texto_Ubicacion} subtitulo={this.props.ubicacion} />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const texto_Servicio = "Servicio";
const texto_Motivo = "Motivo";
const texto_Descripcion = "Descripción";
const texto_Ubicacion = "Ubicación";
const texto_BotonRegistrar = "Registrar";