import React from "react";
import { View } from "react-native";

export default class ListadoItemSeparator extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <View key={this.props.index.toString()} ref={ref => (this.view = ref)} style={{ marginBottom: 4 }} />;
  }
}
