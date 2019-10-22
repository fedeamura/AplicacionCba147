import React from "react";
import { StatusBar, Animated, Text } from "react-native";
import WebImage from "react-native-web-image";

//Rules
import Rules_Ajustes from "@Rules/Rules_Ajustes";

export default class AppCargando extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      versionApp: ''
    };

    this.anim = new Animated.Value(props.visible == true ? 1 : 0);
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    visible: false
  };

  componentDidMount() {
    Rules_Ajustes.getVersionApp().then((version) => {
      this.setState({ versionApp: version });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible == this.props.visible) return;
    Animated.timing(this.anim, { toValue: nextProps.visible ? 1 : 0, duration: 300 }).start();
  }

  render() {
    return (
      <Animated.View
        pointerEvents={this.props.visible == true ? "auto" : "none"}
        style={{
          position: "absolute",
          backgroundColor: "white",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          opacity: this.anim,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <StatusBar backgroundColor="white" barStyle="dark-content" />

        <WebImage
          resizeMode="contain"
          style={{ width: "100%", height: "100%", margin: 72 }}
          source={{uri:urlLogo}}
        />

        <Text style={{ position: 'absolute', bottom: 16, alignSelf: 'center' }}>Versión {this.state.versionApp}</Text>
      </Animated.View>
    );
  }
}
const urlLogo = 'https://i.imgur.com/dIclr5hm.png';
