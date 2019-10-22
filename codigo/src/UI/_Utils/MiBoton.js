import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Button, Text } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class MiBoton extends React.PureComponent {
  static defaultProps = {
    ...React.Component.defaultProps,
    icono: undefined,
    texto: undefined,
    border: false,
    full: false,
    style: {},
    iconoStyle: {},
    textoStyle: {},
    onPress: () => {},
    disabled: false
  };

  constructor(props) {
    super(props);
  }

  onPress = () => {
    if (this.props.disabled == true) return;
    this.props.onPress();
  };

  render() {
    const initData = global.initData;

    let color = "rgba(100,100,100,1)";
    let colorTexto = "white";

    if ("verde" in this.props && this.props.verde != false) {
      color = initData.colorVerde;
      colorTexto = "white";
    }
    if ("naranja" in this.props && this.props.naranja != false) {
      color = initData.colorNaranja;
      colorTexto = "white";
    }
    if ("rojo" in this.props && this.props.rojo != false) {
      color = initData.colorError;
      colorTexto = "white";
    }

    if ("color" in this.props && this.props.color != undefined) {
      color = this.props.color;
      colorTexto = this.props.colorTexto || "black";
    }
    let iconoDerecha =
      "iconoDerecha" in this.props && this.props.iconoDerecha != false;

    let bordered = "bordered" in this.props && this.props.bordered != false;
    let transparent =
      "transparent" in this.props && this.props.transparent != false;

    // let full = 'full' in this.props && this.props.full != false;
    let rounded = "rounded" in this.props && this.props.rounded != false;
    let small = "small" in this.props && this.props.small != false;
    let link = "link" in this.props && this.props.link != false;

    let centro = "centro" in this.props && this.props.centro != false;
    let derecha = "derecha" in this.props && this.props.derecha != false;
    let izquierda = "izquierda" in this.props && this.props.izquierda != false;

    let padding = this.props.padding || 0;
    let sombra = "sombra" in this.props && this.props.izquisombraerda != false;

    let miStyle = {};
    let miTextoStyle = {};

    let miIconoStyle = {};
    miIconoStyle.fontSize = 20;
    miIconoStyle.marginLeft = 8;

    if (bordered == true) {
      miStyle.borderColor = color;
      miTextoStyle.color = color;
      miIconoStyle.color = color;
    } else {
      if (transparent == false && link == false) {
        miStyle.backgroundColor = color;
        miTextoStyle.color = colorTexto;
        miIconoStyle.color = colorTexto;
      } else {
        miStyle.borderColor = color;
        miTextoStyle.color = color;
        miIconoStyle.color = color;
      }
    }

    if (link == true) {
      miTextoStyle.textDecorationLine = "underline";
      miTextoStyle.marginLeft = -16;
    }

    let styleContent = {};
    styleContent.justifyContent = "flex-start";
    styleContent.flexDirection = "row";

    if (this.props.disabled == true) {
      styleContent.opacity = 0.3;
    }

    if (centro == true) {
      styleContent.alignSelf = "center";
    } else {
      if (derecha == true) {
        styleContent.alignSelf = "flex-end";
      } else {
        styleContent.alignSelf = "flex-start";
      }
    }

    if (sombra == true) {
      miStyle.shadowColor = color;
      miStyle.shadowOpacity = 0.4;
      miStyle.shadowRadius = 5;
      miStyle.shadowOffset = { width: 0, height: 4 };
    }

    styleContent.padding = padding;

    return (
      <View style={[styleContent]}>
        <TouchableOpacity onPress={this.onPress}>
          <View pointerEvents="none">
            <Button
              bordered={bordered}
              rounded={rounded}
              transparent={transparent == true || link == true}
              small={small}
              style={[miStyle, this.props.style]}
            >
              {this.props.icono != undefined && iconoDerecha == false && (
                <Icon
                  name={this.props.icono}
                  style={[miIconoStyle, this.props.iconoStyle]}
                />
              )}
              <Text style={[miTextoStyle, this.props.textoStyle]}>
                {this.props.texto}
              </Text>
              {this.props.icono != undefined && iconoDerecha == true && (
                <Icon
                  name={this.props.icono}
                  style={[miIconoStyle, this.props.iconoStyle]}
                />
              )}
            </Button>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
