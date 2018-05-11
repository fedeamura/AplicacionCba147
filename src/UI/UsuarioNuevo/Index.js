import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
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
  Item,
  Icon,
  Spinner,
  Content
} from "native-base";
import {
  ToolbarContent
} from "react-native-paper";
import ExtraDimensions from 'react-native-extra-dimensions-android';
import MiToolbar from "@Utils/MiToolbar";
import MiListado from "@Utils/MiListado";
import MaterialsIcon from "react-native-vector-icons/MaterialIcons";
// import * as Animatable from 'react-native-animatable';

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "Cordoba/src/UI/App";

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

export default class Login extends React.Component {
  static navigationOptions = {
    title: "Nuevo Usuario",
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
    };

    this.keyboardHeight = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height + 100,
    }).start();
  }

  keyboardWillHide = (event) => {
    this.teclado = false;


    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start();
  }


  render() {

    return (
      <View
        style={styles.contenedor}>

        <MiToolbar
          left={{
            icon: "arrow-back",
            onClick: () => {
              App.goBack();
            }
          }}
        >
          <ToolbarContent title="Nuevo usuario" />
        </MiToolbar>

        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps={true}
          contentContainerStyle={styles.contentScrollView}
        >
          <View style={styles.contenidoScroll}>
          </View>
        </ScrollView>

        <Animated.View style={[styles.contenedorKeyboard, { maxHeight: this.keyboardHeight }]}></Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: global.styles.login_colorFondo,
  },
  scrollView: {
    flex:1,
    width: '100%'
  },
  contentScrollView: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  contenidoScroll: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32
  },
});
