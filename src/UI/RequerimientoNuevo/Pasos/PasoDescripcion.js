import React, { Component } from "react";
import { View, Alert } from "react-native";
import { Button, Text, Textarea } from "native-base";
import autobind from "autobind-decorator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class RequerimientoNuevo_PasoDescripcion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      descripcion: ""
    };
  }

  @autobind
  onDescripcionChange(text) {
    this.setState({ descripcion: text }, function() {
      this.informarDescripcion();
    });
  }

  @autobind
  informarDescripcion() {
    if (this.props.onDescripcion == undefined) return;
    this.props.onDescripcion(this.state.descripcion);
  }

  @autobind
  informarReady() {
    if (this.state.descripcion == undefined || this.state.descripcion.trim() == "") {
      Alert.alert("", texto_CompleteLosDatos);
      return;
    }

    if (this.props.onReady == undefined) return;
    this.props.onReady();
  }

  render() {
    const initData = global.initData;
    const botonSiguienteDeshabilitado = this.state.descripcion == undefined || this.state.descripcion.trim() == "";

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

        <View style={{ height: 1, width: "100%", backgroundColor: "rgba(0,0,0,0.1)" }} />

        {/* Boton siguiente  */}
        <View style={{ padding: 16 }}>
          <Button
            small
            onPress={this.informarReady}
            rounded
            style={{
              alignSelf: "flex-end",
              backgroundColor: botonSiguienteDeshabilitado ? "rgba(150,150,150,1)" : initData.colorExito
            }}
          >
            <Text
              style={{
                color: "white"
              }}
            >
              {texto_BotonSiguiente}
            </Text>
          </Button>
        </View>
      </View>
    );
  }
}

const texto_Hint = "Indique de la forma más detallada posible toda la información asociada al requerimiento...";
const texto_BotonSiguiente = "Siguiente";
const texto_CompleteLosDatos = "Ingrese la descripción";
