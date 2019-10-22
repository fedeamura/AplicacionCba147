import React from "react";

import {
  View,
  Animated,
  StyleSheet,
  ScrollView,
  Keyboard,
  Alert
} from "react-native";
import { Text, Textarea } from "native-base";

import App from "@UI/App";
import MiStatusBar from "@Utils/MiStatusBar";
import MiToolbar from "@Utils/MiToolbar";
import MiToolbarSombra from "@Utils/MiToolbarSombra";
import MiCardDetalle from "@Utils/MiCardDetalle";

export default class UbicacionDescripcion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      descripcion: ""
    };

    this.keyboardHeight = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardWillShow
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      "keyboardWillHide",
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = event => {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height
    }).start();
  };

  keyboardWillHide = event => {
    this.teclado = false;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0
    }).start();
  };

  render() {
    const initData = global.initData;

    return (
      <View style={style.contenedor}>
        <MiStatusBar />

        <MiToolbar
          titulo={"Descripción de su ubicación"}
          onBackPress={this.goBack}
        />

        <View
          style={[
            style.contenido,
            { backgroundColor: initData.backgroundColor }
          ]}
        >
          {/* Contenido */}
          {this.renderContent()}
          {/* Sombra del toolbar */}
          <MiToolbarSombra />
        </View>

        {/* Keyboard */}
        <Animated.View
          style={[{ height: "100%" }, { maxHeight: this.keyboardHeight }]}
        />
      </View>
    );
  }

  onInputRef = ref => {
    this.input = ref;
    if (ref) {
      ref._root.focus();
    }
  };

  onDescripcionChange = val => {
    this.setState({ descripcion: val });
  };

  onBotonAceptar = () => {
    const { descripcion } = this.state;
    if (descripcion.trim() == "") return;

    const { params } = this.props.navigation.state;
    if (
      params != undefined &&
      "callback" in params &&
      params.callback != undefined
    ) {
      params.callback(this.state.descripcion);
    }
    this.goBack();
  };

  goBack = () => {
    App.goBack();
  };

  renderContent() {
    return (
      <ScrollView>
        <MiCardDetalle
          style={{ margin: 16 }}
          botones={[
            {
              texto: "Aceptar",
              onPress: this.onBotonAceptar
            }
          ]}
        >
          <Text>Ingrese una descripción para la ubicación seleccionada</Text>
          <Text>Ej: "Al frente de su kiosko"</Text>
          <Text>Ej: "Al lado del poste de luz"</Text>

          <Textarea
            ref={this.onInputRef}
            onChangeText={this.onDescripcionChange}
            value={this.state.descripcion}
            rowSpan={3}
            style={{
              borderColor: "rgba(0,0,0,0.3)",
              marginTop: 16,
              borderRadius: 8,
              borderWidth: 1
            }}
            onSubmitEditing={this.ocultarTeclado}
            placeholderTextColor="rgba(150,150,150,1)"
            placeholder={"Ingrese una descripción..."}
          />
        </MiCardDetalle>
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  contenedor: {
    width: "100%",
    height: "100%",
    backgroundColor: "red"
  },
  contenido: {
    flex: 1,
    backgroundColor: "blue"
  },
  card: {
    margin: 8,
    borderRadius: 16
  }
});
