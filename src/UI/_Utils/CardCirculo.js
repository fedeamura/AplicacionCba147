import React from "react";
import { View } from "react-native";
import { Text } from "native-base";
import { Card, CardContent } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import WebImage from "react-native-web-image";

export default class CardCirculo extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    if (this.props.onPress == undefined) return;
    this.props.onPress(this.props.data);
  }

  render() {
    return (
      <View
        style={[
          {
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          },
          this.props.style || {}
        ]}
      >
        <Card
          style={[
            {
              width: 72,
              height: 72,
              margin: 8,
              borderRadius: 200
            },
            this.props.cardStyle || {}
          ]}
          onPress={this.onPress}
        >
          <CardContent
            style={[
              {
                backgroundColor: this.props.cardColor || "white",
                borderRadius: 200,
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }
            ]}
          >
            {this.renderIcono()}
          </CardContent>
        </Card>
        {this.props.texto != undefined && (
          <Text
            numberOfLines={this.props.textoLines || 2}
            style={[
              {
                textAlign: "center",
                backgroundColor: "transparent",
                fontSize: 22,
                maxWidth: 72,
                marginTop: 4
              },
              this.props.textoStyle || {}
            ]}
          >
            {this.props.texto}
          </Text>
        )}
      </View>
    );
  }

  renderIcono() {
    let mostrarIcono = this.props.urlIcono == undefined;
    let icono = this.props.icono || "flash";
    let url = this.props.urlIcono || "";

    if (mostrarIcono == true) {
      return (
        <Icon
          name={this.props.icono}
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 24,
              backgroundColor: "transparent",
              color: "black"
            },
            this.props.iconoStyle
          ]}
        />
      );
    }

    return <WebImage source={{ uri: url }} style={{ width: "100%", height: "100%" }} />;
  }
}
