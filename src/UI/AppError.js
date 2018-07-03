import React from "react";
import {
  Text,
  View,
} from "react-native";

export default class AppError extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Text>{this.props.error}</Text>
      </View>
    );
  }
}
