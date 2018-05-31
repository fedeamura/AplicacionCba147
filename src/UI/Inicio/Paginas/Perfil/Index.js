import React, { Component } from "react";
import {
  Platform,
  View,
  UIManager,
  Alert,
  Animated,
  StatusBar,
  ScrollView,
  Keyboard,
  Dimensions
} from "react-native";
import {
  Container,
  Button,
  Text,
  Input,
  Content
} from "native-base";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import WebImage from 'react-native-web-image'

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "@UI/App";

export default class PaginaPerfil extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cargando: true,
      error: undefined
    };
  }

  componentDidMount() {

  }

  render() {

    const initData = global.initData.inicio.paginas.perfil;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ width: '100%', padding: 16 }}>
            <WebImage
              style={{
                width: 200,
                height: 200,
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: (200/2),
                margin: 16,
                alignSelf:'center'
              }} />
            <Text style={{alignSelf:'center', fontSize:32, marginTop:16}}>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
            <Text>Federico Amura</Text>
          </View>

        </ScrollView>

      </View >
    );
  }
}