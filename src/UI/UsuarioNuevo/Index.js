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
import MiToolbarMenu from "@Utils/MiToolbarMenu";

import MaterialsIcon from "react-native-vector-icons/MaterialIcons";
import { Kohana, Hideo } from "react-native-textinput-effects";

// import * as Animatable from 'react-native-animatable';

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "Cordoba/src/UI/App";
import AppTheme from "@UI/AppTheme";

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
      expandido:false,
      opciones: [
        {
          text: 'Requerimientos',
          icon: 'insert-drive-file',
          value: 0,
          color: '#388E3C',
          content: (<View style={{ width: '100%', height: '100%' }}><Text>Requerimientos</Text></View>)
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
      <MiToolbarMenu
        expandido={this.state.expandido}
        opciones={this.state.opciones}
        leftIcon="menu"
        leftIconOnClick={() => { this.setState({ expandido: true }) }}
      />
      // <View
      //   style={styles.contenedor}>

      //   <MiToolbar
      //     left={{
      //       icon: "arrow-back",
      //       onClick: () => {
      //         App.goBack();
      //       }
      //     }}
      //   >
      //     <ToolbarContent title="Nuevo usuario" />
      //   </MiToolbar>

      //   <ScrollView
      //     style={styles.scrollView}
      //     keyboardShouldPersistTaps={true}
      //     contentContainerStyle={styles.contentScrollView}
      //   >
      //     <View style={styles.contenidoScroll}>
      //       <Hideo
      //         iconClass={MaterialsIcon}
      //         iconName={"person"}
      //         onChangeText={val => { this.setState({ nombre: val }) }}
      //         value={this.state.nombre}
      //         iconColor={"white"}
      //         placeholder="Nombre"
      //         style={styles.input}
      //         iconBackgroundColor={AppTheme.ColorAccent}
      //         inputStyle={{ color: '#464949' }}
      //       />

      //       <Hideo
      //         iconClass={MaterialsIcon}
      //         iconName={"person"}
      //         onChangeText={val => { this.setState({ apellido: val }) }}
      //         value={this.state.apellido}
      //         iconColor={"white"}
      //         placeholder="Apellido"
      //         style={styles.input}
      //         iconBackgroundColor={AppTheme.ColorAccent}
      //         inputStyle={{ color: '#464949' }}
      //       />

      //       <Hideo
      //         iconClass={MaterialsIcon}
      //         iconName={"person"}
      //         onChangeText={val => { this.setState({ sexo: val }) }}
      //         value={this.state.sexo}
      //         iconColor={"white"}
      //         placeholder="Sexo"
      //         style={styles.input}
      //         iconBackgroundColor={AppTheme.ColorAccent}
      //         inputStyle={{ color: '#464949' }}
      //       />
      //     </View>
      //   </ScrollView>

      //   <Animated.View style={[styles.contenedorKeyboard, { maxHeight: this.keyboardHeight }]}></Animated.View>
      // </View>
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
    flex: 1,
    width: '100%'
  },
  contentScrollView: {
    flexGrow: 1
  },
  contenidoScroll: {
    width: '100%'
  },
  input: {
    margin: 8
  }
});
