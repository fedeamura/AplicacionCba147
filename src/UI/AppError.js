import React from "react";
import {
  Text,
  StatusBar,
  View,
} from "react-native";

export default class AppError extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

        <StatusBar backgroundColor="white" barStyle="dark-content" />

        <Text>{this.props.error}</Text>
      </View>
    );
  }
}
