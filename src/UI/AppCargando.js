import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  StatusBar
} from "react-native";
import color from "color";
import WebImage from 'react-native-web-image'

export default class AppCargando extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <WebImage
          resizeMode="contain"
          style={{ width: '100%', height: '100%', margin: 72 }}
          source={require('@Resources/logo_muni.png')}
        />
      </View>
    );
  }
}
