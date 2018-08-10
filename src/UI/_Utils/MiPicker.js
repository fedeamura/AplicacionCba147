import React from "react";
import { View, StyleSheet, Animated, Keyboard, TextInput } from "react-native";
import { ListItem, Text } from "native-base";

//Mis compontenes
import App from "@UI/App";
import MiToolbar from "@Utils/MiToolbar";
import MiToolbarSombra from "@Utils/MiToolbarSombra";
import MiListado from "@Utils/MiListado";

export default class MiPicker extends React.Component {
  constructor(props) {
    super(props);

    let { params } = this.props.navigation.state || {};
    if (params == undefined) params = {};

    if (!("busqueda" in params)) {
      params.busqueda = false;
    }

    if (!("cumpleBusqueda" in params)) {
      params.cumpleBusqueda = () => {
        return true;
      };
    }

    this.state = {
      busqueda: undefined
    };

    this.keyboardHeight = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener("keyboardWillShow", this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener("keyboardWillHide", this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height
    }).start();
  }

  keyboardWillHide = (event) => {
    this.teclado = false;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0
    }).start();
  }

  onChangeBusqueda = (text) => {
    let { params } = this.props.navigation.state || {};
    if (params == undefined) params = {};

    this.setState({
      busqueda: text,
      dataFiltrada: params.data.filter(element => params.cumpleBusqueda(element, text))
    });
  }

  goBack = () => {
    App.goBack();
  }

  renderEmpty = () => {
    let { params } = this.props.navigation.state || {};
    if (params == undefined) params = {};

    return <Text>{params.textoEmpty || "No encontrado"}</Text>;
  }

  onPress = (item) => {
    let { params } = this.props.navigation.state || {};
    if (params == undefined) params = {};

    params.onPress(item);
    App.goBack();
  }

  renderItem = (data) => {
    let { params } = this.props.navigation.state || {};
    if (params == undefined) params = {};

    let content = undefined;
    if (params.renderItem != undefined) {
      content = <View style={{ width: "100%" }}>{params.renderItem(data.item)}</View>;
    } else {
      content = <Text>{params.title(data.item)}</Text>;
    }
    return <MiPickerItem data={data.item} content={content} onPress={this.onPress} />;
  }

  render() {
    let { params } = this.props.navigation.state || {};
    if (params == undefined) params = {};

    const colorFondo = params.backgroundColor || "white";

    return (
      <View style={[styles.contenedor, { backgroundColor: colorFondo }]}>
        {/* Toolbar */}
        <MiToolbar customContent onBackPress={this.goBack}>
          {params.busqueda == true && (
            <TextInput
              onChangeText={this.onChangeBusqueda}
              placeholder={params.placeholderBusqueda}
              underlineColorAndroid="rgba(0,0,0,0)"
              style={[styles.inputBusqueda]}
            />
          )}
        </MiToolbar>

        {/* Content */}
        <View style={styles.contenido}>
          <MiListado
            backgroundColor={colorFondo}
            data={this.state.busqueda != undefined && this.state.busqueda != "" ? this.state.dataFiltrada : params.data}
            keyExtractor={params.keyExtractor}
            renderEmpty={this.renderEmpty}
            renderItem={this.renderItem}
          />

          <MiToolbarSombra />
        </View>

        <Animated.View
          style={[
            { height: "100%" },
            {
              maxHeight: this.keyboardHeight
            }
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    height: "100%",
    width: "100%"
  },
  contenedorBusqueda: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  inputBusqueda: {
    marginLeft: 16,
    width: "100%",
    fontSize: 20
  },
  contenido: {
    flex: 1
  }
});

class MiPickerItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.onPress(this.props.data);
  }

  render() {
    return (
      <ListItem onPress={this.onPress}>
        {this.props.content}
      </ListItem>
    );
  }
}
