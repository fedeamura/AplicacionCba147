import React from "react";
import { View, TouchableOpacity } from "react-native";
import WebImage from "react-native-web-image";

export default class RequerimientoDetalle_ItemFoto extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.onPress(this.props.identificador, this.props.index);
  }

  render() {
    const initData = global.initData;
    let urlFinal = initData.urlCordobaFiles + "/" + this.props.identificador + "/3";

    return (
      <TouchableOpacity
        key={this.props.identificador}
        onPress={this.onPress}
        style={{
          width: 104,
          height: 104,
          borderRadius: 16,
          overflow: "hidden",
          margin: 8
        }}
      >
        <View
          style={{
            width: 104,
            height: 104,
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: "#ccc"
          }}
        >
          <WebImage
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%"
            }}
            source={{ uri: urlFinal }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
