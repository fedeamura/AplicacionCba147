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

export default class PaginaAjustes extends React.Component {

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

    const initData = global.initData.inicio.paginas.ajustes;

    return (
      <View style={{ flex: 1 }}>


      </View >
    );
  }
}