import React from "react";
import LinearGradient from "react-native-linear-gradient";

export default class MiToolbarSombra extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LinearGradient
        colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
        backgroundColor="transparent"
        style={{ left: 0, top: 0, right: 0, height: 16, position: "absolute" }}
        pointerEvents="none"
      />
    );
  }
}
