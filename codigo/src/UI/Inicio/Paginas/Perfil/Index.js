import React from "react";
import { View, WebView, Text } from "react-native";

export default class PaginaPerfil extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    let url = `https://servicios2.cordoba.gov.ar/MuniOnlinePerfil/#/?modoApp=true&token=${
      global.token
    }&modoCelu=true`;
    this.setState({
      url: url
    });
  }
  render() {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "red"
        }}
      >
        {this.state.url && (
          <WebView
            style={{ flex: 1, marginTop: 0, marginBottom: 0 }}
            source={{
              uri: this.state.url
            }}
          />
        )}
      </View>
    );
  }
  // render() {
  //   return (
  //     <View
  //       style={{
  //         backgroundColor: "red",
  //         flex: 1,
  //         justifyContent: "flex-start",
  //         alignItems: "stretch",
  //         height: "100%"
  //       }}
  //     >
  //       <Text>Hola</Text>
  //       {/* <WebView
  //         style={{ flex: 1, marginTop: 0, marginBottom: 0 }}
  //         source={{
  //           uri: `https://servicios2.cordoba.gov.ar/MuniOnlinePerfil/#/?token=${
  //             global.token
  //           }&modoCelu=true`
  //         }}
  //       /> */}
  //     </View>
  //   );
  // }
}
