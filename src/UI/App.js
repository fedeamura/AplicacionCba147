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
  StatusBar,
  Alert
} from "react-native";
import {
  StackNavigator,
  NavigationActions
} from "react-navigation";
import color from "color";
import {
  Provider as PaperProvider,
  Button
} from "react-native-paper";
import codePush from "react-native-code-push";

//Mis Componentes
import Login from "@UI/Login/Index";
import UsuarioNuevo from "@UI/UsuarioNuevo/Index";
import RecuperarCuenta from "@UI/RecuperarCuenta/Index";
import Inicio from "@UI/Inicio/Index";
import RequerimientoNuevo from "@UI/RequerimientoNuevo/Index";
import RequerimientoDetalle from "@UI/RequerimientoDetalle/Index";
import MiPicker from "@Utils/MiPicker";
import MiPickerUbicacion from "@Utils/MiPickerUbicacion";
import VisorFoto from "@UI/VisorFoto/Index";
import UsuarioValidarDatosRenaper from '@UI/UsuarioValidarDatosRenaper/Index';

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_Init from "@Rules/Rules_Init";

import AppCargando from "./AppCargando";
import AppMantenimiento from "./AppMantenimiento";

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
    RequerimientoNuevo: {
      screen: RequerimientoNuevo
    },
    RequerimientoDetalle: {
      screen: RequerimientoDetalle
    },
    PickerUbicacion: {
      screen: MiPickerUbicacion
    },
    PickerListado: {
      screen: MiPicker
    },
    VisorFoto: {
      screen: VisorFoto
    },
    UsuarioValidarDatosRenaper: {
      screen: UsuarioValidarDatosRenaper
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
      cargando: true,
      initData: undefined,
      error: undefined
    };

  }

  componentDidMount() {
    this.actualizarApp()
      .then(() => {

        //Busco la data inicial
        Rules_Init.getInitData()
          .then((initData) => {
            global.initData = initData;
            this.setState({
              cargando: false,
              initData: initData,
              error: undefined
            });
          })
          .catch((error) => {
            global.initData = undefined;
            this.setState({
              cargando: false,
              initData: undefined,
              error: 'Error procesando la solicitud'
            });
          });

      }).catch((error) => {
        global.initData = undefined;
        this.setState({
          cargando: false,
          initData: undefined,
          error: 'Error procesando la solicitud'
        });
      });
  }

  actualizarApp() {
    return new Promise((callback, callbackError) => {
      // Alert.alert('', 'Codepush');
      codePush.sync(
        {
          deploymentKey: Platform.OS == 'ios' ? 'PfHTHuI72bZjyvJHN7-1mPEBLFxsrkFMKlHdf' : 'yRjO-uUfAoarYJSJWHdTV1P5LYXmHyiWzMHdf',
          installMode: codePush.InstallMode.IMMEDIATE
        },
        //Status change
        (syncStatus) => {
          switch (syncStatus) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
              // Alert.alert('', 'Checking update');
              break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
              // Alert.alert('', 'Bajando');
              break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
              // Alert.alert('', 'Instalando');
              break;
            case codePush.SyncStatus.UP_TO_DATE:
              // Alert.alert('', 'Actualizado');
              callback();
              break;
            case codePush.SyncStatus.UPDATE_IGNORED:
              // Alert.alert('', 'Ignorada');
              callback();
              break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
              // Alert.alert('', 'Instalada');
              callback();
              break;
            case codePush.SyncStatus.UNKNOWN_ERROR:
              // Alert.alert('', 'Error');
              callbackError('Error procesando la solicitud');
              break;
          }
        },
        (progress) => { }
      );
    });
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

  static navegar(pagina, params) {
    App.getNavigator().navigate(pagina, params);
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


  render() {
    //Cargando
    if (this.state.cargando == true) {
      return <AppCargando />;
    }

    //Error
    if (this.state.initData == undefined || this.state.error != undefined) {
      return <AppError error={this.state.error || 'Error procesando la solicitud'} />
    }

    //Mantenimiento
    if (this.state.initData.mantenimiento == true) {
      return <AppMantenimiento />;
    }

    return (
      <PaperProvider>
        <View
          keyboardShouldPersistTaps="handled"
          style={{ height: '100%', width: '100%' }}>
          <StatusBar backgroundColor={'white'} barStyle="dark-content" />
          <RootStack ref={(ref) => { global.navigator = ref; }} />
        </View>
      </PaperProvider>
    );
  }
}
