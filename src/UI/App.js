import React from "react";
import {
  Platform,
  View,
  Alert,
  LayoutAnimation,
  StatusBar
} from "react-native";
import {
  StackNavigator,
  NavigationActions
} from "react-navigation";
import {
  Provider as PaperProvider
} from "react-native-paper";
import codePush from "react-native-code-push";

//Mis Componentes
import Introduccion from "@UI/Introduccion/Index";
import Login from "@UI/Login/Index";
import UsuarioNuevo from "@UI/UsuarioNuevo/Index";
import RecuperarCuenta from "@UI/RecuperarCuenta/Index";
import Inicio from "@UI/Inicio/Index";
import RequerimientoNuevo from "@UI/RequerimientoNuevo/Index";
import RequerimientoDetalle from "@UI/RequerimientoDetalle/Index";
import MiPicker from "@Utils/MiPicker";
import MiPickerUbicacion from "@Utils/MiPickerUbicacion";
import VisorFoto from "@UI/VisorFoto/Index";
import AjustesDesarrolladores from "@UI/AjustesDesarrolladores/Index";
import UsuarioValidarDatosRenaper from '@UI/UsuarioValidarDatosRenaper/Index';

import AppCargando from "./AppCargando";
import AppError from "./AppError";
import AppMantenimiento from "./AppMantenimiento";

//Rules
import Rules_Init from "@Rules/Rules_Init";
import Rules_Ajustes from "../Rules/Rules_Ajustes";

//Defino el las screens de la app
const RootStack = StackNavigator(
  {
    Introduccion: {
      screen: Introduccion
    },
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
    },
    AjustesDesarrolladores: {
      screen: AjustesDesarrolladores
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

  constructor(props) {
    super(props);
    console.disableYellowBox = true;

    this.state = {
      descargando: false,
      progresoDescarga: 0,
      cargando: true,
      initData: undefined,
      error: undefined
    };
  }

  componentDidMount() {
    Rules_Ajustes.isBetaTester().then((test) => {
      this.actualizarApp(test)
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
    });
  }

  actualizarApp(test) {
    //Keys iOS
    const key_ios = 'PfHTHuI72bZjyvJHN7-1mPEBLFxsrkFMKlHdf';
    const key_ios_test = 'onBKUESFsmHzCJxKPyXArfjMnG_W46fa5311-742e-48ec-9cca-e112c82a5ff2';

    //Key Android
    const key_android = 'yRjO-uUfAoarYJSJWHdTV1P5LYXmHyiWzMHdf';
    const key_android_test = 'EyHcx3BBhsiNHBOQWHtWhTLdlaUr46fa5311-742e-48ec-9cca-e112c82a5ff2';

    //Key actual
    const key = Platform.OS == 'ios' ? (test ? key_ios_test : key_ios) : (test ? key_android_test : key_android);

    return new Promise((callback, callbackError) => {
      codePush.sync(
        {
          deploymentKey: key,
          installMode: codePush.InstallMode.IMMEDIATE
        },
        //Status change
        (syncStatus) => {
          switch (syncStatus) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
              break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
              break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
              break;
            case codePush.SyncStatus.UP_TO_DATE:
              callback();
              break;
            case codePush.SyncStatus.UPDATE_IGNORED:
              callback();
              break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
              callback();
              break;
            case codePush.SyncStatus.UNKNOWN_ERROR:
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
      return <AppCargando descargando={this.state.descargando} progresoDescarga={this.state.progresoDescarga} />;
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
