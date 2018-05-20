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
  Icon,
  Content
} from "native-base";
import ExtraDimensions from 'react-native-extra-dimensions-android';
import MaterialsIcon from "react-native-vector-icons/MaterialIcons";

import MiToolbarMenu from "@Utils/MiToolbarMenu";
import PaginaInicio from "@Paginas/Inicio/Index";

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "@UI/App";
import AppTheme from "@UI/AppTheme";

export default class Login extends React.Component {
  static navigationOptions = {
    title: "Inicio",
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      expandido: false,
      opciones: [
        {
          text: 'Mis requerimientos',
          icon: 'insert-drive-file',
          value: 0,
          color: '#388E3C',
          content: (<PaginaInicio />)
        },
        {
          text: 'Mi perfil',
          icon: 'account-circle',
          value: 1,
          color: 'rgb(255, 96, 95)',
          content: (<View style={{ backgroundColor: 'rgb(255, 96, 95)', width: '100%', height: '100%' }}><Text>Perfil</Text></View>)
        },
        {
          text: 'Ajustes',
          icon: 'settings',
          value: 2,
          color: 'rgb(0, 168, 255)',
          content: (<View style={{ backgroundColor: 'rgb(0, 168, 255)', width: '100%', height: '100%' }}><Text>Ajustes</Text></View>)
        }
      ]
    };

    this.keyboardHeight = new Animated.Value(0);
  }

  // componentWillMount() {
  //   this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
  //   this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  // }

  // componentWillUnmount() {
  //   this.keyboardWillShowSub.remove();
  //   this.keyboardWillHideSub.remove();
  // }

  // keyboardWillShow = (event) => {
  //   this.teclado = true;

  //   Animated.timing(this.keyboardHeight, {
  //     duration: event.duration,
  //     toValue: event.endCoordinates.height + 100,
  //   }).start();
  // }

  // keyboardWillHide = (event) => {
  //   this.teclado = false;

  //   Animated.timing(this.keyboardHeight, {
  //     duration: event.duration,
  //     toValue: 0,
  //   }).start();
  // }


  render() {

    return (
      <MiToolbarMenu
        expandido={this.state.expandido}
        opciones={this.state.opciones}
        closeIcon={true}
        leftIcon="menu"
        leftIconOnClick={() => { this.setState({ expandido: true }) }}
      />
    );
  }
}