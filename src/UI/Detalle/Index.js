import React from "react";
import {
  View,
  Animated,
  Platform,
  StyleSheet,
  ScrollView,
  Dimensions
} from "react-native";
import { Text, Button, Icon } from "native-base";
import { Card, CardContent } from "react-native-paper";

export default class Detalle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
     
    };
  }

  static defaultProps = {
  
  };

  render() {
    return (
      <View
        style={[
          styles.contenedor
        ]}>
      
      </View >
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    position: "absolute",
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    zIndex: 10,
    elevation: 8
  }
});
