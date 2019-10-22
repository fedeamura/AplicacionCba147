import React from "react";
import { View, Alert } from "react-native";
import { Textarea } from "native-base";

//Mis componentes
import MiBoton from "@Utils/MiBoton";

export default class RequerimientoNuevo_PasoDescripcion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      descripcion: ""
    };
  }

  onDescripcionChange = (text) => {
    this.setState({
      descripcion: text
    }, () => {
      this.informarDescripcion();
    });
  }

  informarDescripcion = () => {
    if (this.props.onDescripcion == undefined) return;
    this.props.onDescripcion(this.state.descripcion);
  }

  informarReady = () => {
    if (this.state.descripcion == undefined || this.state.descripcion.trim().length < largoMinimo) {
      Alert.alert("", texto_CompleteLosDatos);
      return;
    }

    if (this.props.onReady == undefined) return;
    this.props.onReady();
  }

  render() {
    const initData = global.initData;
    const botonSiguienteDeshabilitado =
      this.state.descripcion == undefined || this.state.descripcion.trim().length < largoMinimo;

    return (
      <View>
        <View
          style={{
            padding: 16
          }}
        >
          <Textarea
            onChangeText={this.onDescripcionChange}
            style={{ fontSize: 18 }}
            rowSpan={5}
            placeholder={texto_Hint}
          />
        </View>

        {this.renderContador()}
        <View style={{ height: 1, width: "100%", backgroundColor: "rgba(0,0,0,0.1)" }} />

        {/* Boton siguiente  */}
        <MiBoton
          rounded
          small
          sombra
          padding={16}
          color={botonSiguienteDeshabilitado ? "rgba(150,150,150,1)" : initData.colorExito}
          colorTexto='white'
          onPress={this.informarReady}
          texto={texto_BotonSiguiente}
          derecha />
      </View>
    );
  }

  renderContador() {
    return null;
    // let cantidad = this.state.descripcion.length;
    // return <Text style={{ marginLeft: 16 , marginBottom:16}}>{cantidad}/{largoMinimo}</Text>;
  }
}

const texto_Hint = "Indique de la forma más detallada posible toda la información asociada al requerimiento...";
const texto_BotonSiguiente = "Siguiente";
const largoMinimo = 20;
const texto_CompleteLosDatos = "Ingrese una descripción de al menos " + largoMinimo + " caracteres";
