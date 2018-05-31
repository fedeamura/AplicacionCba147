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
import PaginaInicio from "@Paginas/Requerimientos/Index";
import PaginaPerfil from "@Paginas/Perfil/Index";
import PaginaAjustes from "@Paginas/Ajustes/Index";


//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "@UI/App";

export default class Login extends React.Component {
  static navigationOptions = {
    title: "Inicio",
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    const initData = global.initData.inicio;

    this.state = {
      expandido: false,
      opciones: [
        {
          titulo: initData.menu.requerimientos.titulo,
          tituloColor: initData.menu.requerimientos.tituloColor,
          tituloFontSize: 18,
          tituloFontSpace: 2,
          backgroundColor: initData.menu.requerimientos.backgroundColor,
          icono: initData.menu.requerimientos.icono,
          iconoFontSize: 48,
          iconoColor: initData.menu.requerimientos.iconoColor,
          iconoFontFamily: initData.menu.requerimientos.iconoFontFamily,
          valor: 0,
          contenido: (<PaginaInicio />)
        },
        {
          titulo: initData.menu.perfil.titulo,
          tituloColor: initData.menu.perfil.tituloColor,
          tituloFontSize: 18,
          tituloFontSpace: 2,
          backgroundColor: initData.menu.perfil.backgroundColor,
          icono: initData.menu.perfil.icono,
          iconoFontSize: 48,
          iconoColor: initData.menu.perfil.iconoColor,
          iconoFontFamily: initData.menu.perfil.iconoFontFamily,
          valor: 1,
          contenido: (<PaginaPerfil />)
        },
        {
          titulo: initData.menu.ajustes.titulo,
          tituloColor: initData.menu.ajustes.tituloColor,
          tituloFontSize: 18,
          tituloFontSpace: 2,
          backgroundColor: initData.menu.ajustes.backgroundColor,
          icono: initData.menu.ajustes.icono,
          iconoFontSize: 48,
          iconoColor: initData.menu.ajustes.iconoColor,
          iconoFontFamily: initData.menu.ajustes.iconoFontFamily,
          valor: 2,
          contenido: (<PaginaAjustes />)
        }
        // ,
        // {
        //   text: initData.menu.perfil.titulo,
        //   icon: initData.menu.perfil.icono,
        //   iconFontFamily: initData.menu.perfil.iconoFontFamily,
        //   value: 1,
        //   color: initData.menu.perfil.color,
        //   content: (<View style={{ backgroundColor: 'rgb(255, 96, 95)', width: '100%', height: '100%' }}><Text>Perfil</Text></View>)
        // },
        // {
        //   text: initData.menu.ajustes.titulo,
        //   icon: initData.menu.ajustes.icono,
        //   iconFontFamily: initData.menu.ajustes.iconoFontFamily,
        //   value: 2,
        //   color: initData.menu.ajustes.color,
        //   content: (<View style={{ backgroundColor: 'rgb(0, 168, 255)', width: '100%', height: '100%' }}><Text>Ajustes</Text></View>)
        // }
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
    const initData = global.initData.inicio;

    return (
      <MiToolbarMenu
        toolbarBackgroundColor="white"
        toolbarTituloColor="black"
        expandido={this.state.expandido}
        opciones={this.state.opciones}
        expandirAlHacerClick={initData.toolbarExpandirAlHacerClick}
        mostrarBotonCerrar={initData.toolbarMostrarBotonCerrar}
        iconoCerrar={initData.toolbarIconoCerrar}
        iconoCerrarColor={initData.toolbarIconoCerrarColor}
        iconoCerrarFontFamily={initData.toolbarIconoCerrarFontFamily}
        mostrarBotonIzquierda={initData.toolbarMostrarBotonIzquierda}
        iconoIzquierdaColor={initData.toolbarIconoIzquierdaColor}
        iconoIzquierda={initData.toolbarIconoIzquierda}
        iconoIzquierdaFontFamily={initData.toolbarIconoIzquierdaFontFamily}
        iconoIzquierdaOnPress={() => { this.setState({ expandido: true }) }}
      />
    );
  }
}