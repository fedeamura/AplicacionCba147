import React from "react";
import { StatusBar, Animated } from "react-native";
import WebImage from "react-native-web-image";

export default class AppCargando extends React.PureComponent {
  constructor(props) {
    super(props);
    this.anim = new Animated.Value(props.visible == true ? 1 : 0);
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    visible: false
  };

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
          source={require("@Resources/logo_muni.png")}
        />
      </Animated.View>
    );
  }
}
