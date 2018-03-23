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
  DefaultTheme,
  Provider as PaperProvider,
  Button
} from "react-native-paper";

//Mis Componentes
import AppStyles from "Cordoba/src/UI/Styles/default";
import Login from "Cordoba/src/UI/Login/Index";
import Home from "Cordoba/src/UI/Home/Index";
import Nuevo from "Cordoba/src/UI/Nuevo/Index";
import Ajustes from "Cordoba/src/UI/Ajustes/Index";
import Detalle from "Cordoba/src/UI/Detalle/Index";
import MiPicker from "Cordoba/src/UI/Utils/MiPicker";
import MiPickerUbicacion from "Cordoba/src/UI/Utils/MiPickerUbicacion";

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: global.styles.colorPrimary,
    primaryDark: global.styles.colorPrimaryDark,
    accent: global.styles.colorAccent
  }
};

const RootStack = StackNavigator(
  {
    Login: {
      screen: Login
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
    initialRouteName: "Login",
    cardStyle: {
      shadowOpacity: 1
    }
  }
);

export default class App extends React.Component {
  static Variables = {
    Debug: true,
    TodoCompletadoEnNuevo: false,
    Token: undefined,
    KeyGoogleMaps: "AIzaSyDNZ3qqO-CJVnLrC8YJcNF6iOXFooAiW3M"
  };

  constructor(props) {
    super(props);
    console.disableYellowBox = true;
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

  }

  render() {
    return (
      <PaperProvider theme={theme}>
        <View
          //keyboardShouldPersistTaps={'always'}
          style={{ height: '100%', width: '100%' }}>
          <StatusBar backgroundColor={global.styles.colorPrimaryDark} barStyle="dark-content" />
          <RootStack ref={(ref) => { global.Navigator = ref; }} />
        </View>
      </PaperProvider>
    );
  }
}
