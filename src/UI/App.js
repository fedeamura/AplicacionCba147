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
import Login from "@UI/Login/Index";
import UsuarioNuevo from "@UI/UsuarioNuevo/Index";
import RecuperarCuenta from "@UI/RecuperarCuenta/Index";
import Inicio from "@UI/Inicio/Index";
import Nuevo from "@UI/Nuevo/Index";
import Ajustes from "@UI/Ajustes/Index";
import MiPicker from "@Utils/MiPicker";
import MiPickerUbicacion from "@Utils/MiPickerUbicacion";

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_Init from "@Rules/Rules_Init";

//Defino el las screens de la app
const RootStack = StackNavigator(
  {
    Login: {
      screen: Login
    },
    UsuarioNuevo: {
      screen: UsuarioNuevo
    },
    RecuperarCuenta: {
      screen: RecuperarCuenta
    },
    Inicio: {
      screen: Inicio
    },
    Nuevo: {
      screen: Nuevo
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
    initialRouteName: "Login",
    cardStyle: {
      shadowOpacity: 1
    }
  }
);

//Init data por default nada
global.initData = undefined;

export default class App extends React.Component {
  // static Variables = {
  //   Debug: true,
  //   TodoCompletadoEnNuevo: false,
  //   Token: undefined,
  //   DatosUsuario: undefined,
  //   KeyGoogleMaps: "AIzaSyDNZ3qqO-CJVnLrC8YJcNF6iOXFooAiW3M"
  // };

  constructor(props) {
    super(props);
    console.disableYellowBox = true;

    this.state = {
      initData: undefined,
      error: undefined
    };

  }

  static Navigation;

  static replace(pagina) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: pagina })]
    });
    global.navigator._navigation.dispatch(resetAction);
  }

  static goBack() {
    const { goBack } = global.navigator._navigation;
    goBack(null);
  }

  static navegar(pagina) {
    const { navigate } = global.navigator._navigation;
    navigate(pagina);
  }

  static getNavigator() {
    return global.navigator._navigation;
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

    //Busco la data inicial
    Rules_Init.getInitData()
      .then((initData) => {
        global.initData = initData;

        this.setState({
          initData: initData,
          error: undefined
        });

      })
      .catch((error) => {
        global.initData = undefined;
        this.setState({
          initData: undefined,
          error: 'Error procesando la solicitud'
        });
      });
  }

  render() {
    if (this.state.initData == undefined) return null;
    return (
      <PaperProvider>
        <View
          keyboardShouldPersistTaps="always"
          style={{ height: '100%', width: '100%' }}>
          <StatusBar backgroundColor={'white'} barStyle="dark-content" />
          <RootStack ref={(ref) => { global.navigator = ref; }} />
        </View>
      </PaperProvider>
    );
  }
}
