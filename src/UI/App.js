import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  BackHandler,
  Animated,
  Easing,
  StatusBar
} from "react-native";
import {
  StackNavigator,
  DrawerNavigator,
  NavigationActions
} from "react-navigation";
import color from "color";
import {
  Provider as PaperProvider,
  Button
} from "react-native-paper";

//Mis Componentes
import AppTheme from "@UI/AppTheme";
import Login from "Cordoba/src/UI/Login/Index";
import UsuarioNuevo from "Cordoba/src/UI/UsuarioNuevo/IndexTest";
import Home from "Cordoba/src/UI/Home/Index";
import Nuevo from "Cordoba/src/UI/Nuevo/Index";
import Ajustes from "Cordoba/src/UI/Ajustes/Index";
import Detalle from "Cordoba/src/UI/Detalle/Index";
import MiPicker from "@Utils/MiPicker";
import MiPickerUbicacion from "@Utils/MiPickerUbicacion";

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";
import Rules_Init from "../Rules/Rules_Init";





const RootStack = StackNavigator(
  {
    Login: {
      screen: Login
    },
    UsuarioNuevo: {
      screen: UsuarioNuevo
    },
    Home: {
      screen: Home
    },
    Nuevo: {
      screen: Nuevo
    },
    Detalle: {
      screen: Detalle
    },
    Ajustes: {
      screen: Ajustes
    },
    MiPicker: {
      screen: MiPicker
    },
    MiPickerUbicacion: {
      screen: MiPickerUbicacion
    }
  },
  {
    headerMode: "none",
    initialRouteName: "UsuarioNuevo",
    cardStyle: {
      shadowOpacity: 1
    }
  }
);

global.InitData = undefined;

export default class App extends React.Component {
  static Variables = {
    Debug: true,
    TodoCompletadoEnNuevo: false,
    Token: undefined,
    DatosUsuario: undefined,
    KeyGoogleMaps: "AIzaSyDNZ3qqO-CJVnLrC8YJcNF6iOXFooAiW3M"
  };

  constructor(props) {
    super(props);
    console.disableYellowBox = true;

    this.state = {
      InitData: undefined
    };

  }

  static Navigation;

  static replace(pagina) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: pagina })]
    });
    global.Navigator._navigation.dispatch(resetAction);
  }

  static goBack() {
    const { goBack } = global.Navigator._navigation;
    goBack(null);
  }

  static navegar(pagina) {
    const { navigate } = global.Navigator._navigation;
    navigate(pagina);
  }

  static getNavigator() {
    return global.Navigator._navigation;
  }

  static animar(callback) {
    if (Platform.OS != 'android') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring, callback);
    } else {
      if (callback != undefined) {
        callback();
      }
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      // if(callback!=undefined){
      //   setTimeout(()=>{
      //     callback();
      //   }, 300);
      // }
    }
  }

  componentDidMount() {
    Rules_Init.getInitData().then((initData) => {
      global.InitData = initData;
      AppTheme.crear(initData);
      this.setState({
        InitData: initData
      });
    });
  }

  render() {
    if (this.state.InitData == undefined) return null;
    return (
      <PaperProvider theme={AppTheme.Styles.Theme}>
        <View
          keyboardShouldPersistTaps='always'
          style={{ height: '100%', width: '100%' }}>
          <StatusBar backgroundColor={global.styles.colorStatusBar} barStyle="dark-content" />
          <RootStack ref={(ref) => { global.Navigator = ref; }} />
        </View>
      </PaperProvider>
    );
  }
}
