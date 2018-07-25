import React from "react";
import {
  View,
  StatusBar
} from "react-native";
import WebImage from 'react-native-web-image'

export default class AppCargando extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    }
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    descargando: true,
    progresoDescarga: 0
  }


  render() {
    return (
      <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>

        <StatusBar backgroundColor="white" barStyle="dark-content" />

        <WebImage
          resizeMode="contain"
          style={{ width: '100%', height: '100%', margin: 72 }}
          source={require('@Resources/logo_muni.png')}
        />
      </View>
    );
  }
}
