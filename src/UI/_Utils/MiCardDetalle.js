import React from "react";
import { View } from "react-native";
import { Text } from "native-base";
import { Card } from "react-native-paper";

import MiBoton from "@Utils/MiBoton";

export default class MiCardDetalle extends React.PureComponent {
  static defaultProps = {
    ...React.Component.defaultProps,
    botones: []
  };

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    elevation: 2,
    botones: [],
    padding: true
  };

  render() {
    const initData = global.initData;

    const padding = this.props.padding ? 16 : 0;
    const tieneBotones = this.props.botones.length != 0;

    return (
      <View style={this.props.style}>
        {/* Titulo */}
        {this.props.titulo != undefined && (
          <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>{this.props.titulo}</Text>
        )}

        {/* Card */}
        <Card
          style={{
            borderRadius: 16,
            margin: 8,
            backgroundColor: this.props.backgroundColor || "white",
            elevation: this.props.elevation
          }}
        >
          {/* Contenido */}
          <View
            style={{
              padding: padding,
              overflow: "hidden",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              borderBottomLeftRadius: tieneBotones ? 0 : 16,
              borderBottomRightRadius: tieneBotones ? 0 : 16
            }}
          >
            {this.props.children}
          </View>

          {/* Botones */}
          {this.props.botones.length != 0 ? (
            <View>
              <View style={{ width: "100%", height: 1, backgroundColor: "black", opacity: 0.2 }} />

              <View
                style={{
                  padding: 16,
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end"
                }}
              >
                {this.props.botones.map((data, index) => {
                  return (
                    <View key={index} style={{ marginRight: index == this.props.botones.length - 1 ? 0 : 8 }}>
                      <MiBoton
                        rounded
                        small
                        verde
                        onPress={data.onPress}
                        sombra
                        texto={data.texto || 'Sin datos'}
                      />
                     
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
              <View />
            )}
        </Card>
      </View>
    );
  }
}
