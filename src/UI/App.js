import React from "react";
import {
  View,
  Easing,
  Animated,
  Linking,
  Alert,
  StatusBar
} from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import { Provider as PaperProvider } from "react-native-paper";

// Mis Componentes
import Introduccion from '@UI/Introduccion/Index';
import Login from '@UI/Login/Index';
import Inicio from '@UI/Inicio/Index';
import RequerimientoNuevo from '@UI/RequerimientoNuevo/Index';
import RequerimientoDetalle from '@UI/RequerimientoDetalle/Index';
import MiPicker from "@Utils/MiPicker";
import MiPickerUbicacion from "@Utils/MiPickerUbicacion";
import AjustesDesarrolladores from "@UI/AjustesDesarrolladores/Index";
import UsuarioNuevo from "@UI/UsuarioNuevo/Index";
import UsuarioRecuperarPassword from "@UI/UsuarioRecuperarPassword/Index";
import UsuarioValidarDatosRenaper from "@UI/UsuarioValidarDatosRenaper/Index";
import UsuarioEditarDatosContacto from "@UI/UsuarioEditarDatosContacto/Index";

import AppCargando from "./AppCargando";
import AppError from "./AppError";
import AppMantenimiento from "./AppMantenimiento";

//Rules
import Rules_Init from "@Rules/Rules_Init";

const transitionConfig = function () {
  return {
    transitionSpec: {
      duration: 500,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: function (sceneProps) {
      const { layout, position, scene } = sceneProps;

      const thisSceneIndex = scene.index;

      const width = layout.initWidth;

      // const opacity = position.interpolate({
      //   inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1,],
      //   outputRange: [0, 0, 1]
      // });

      // const translateY = position.interpolate({
      //   inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      //   outputRange: [height, 0, 0]
      // })

      // const scale = position.interpolate({
      //   inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      //   outputRange: [1, 1, 0.9]
      // })

      return {
        transform: [
          {
            translateX: position.interpolate({
              inputRange: [
                thisSceneIndex - 1,
                thisSceneIndex,
                thisSceneIndex + 1
              ],
              outputRange: [width, 0, 0]
            })
          }
        ]
      };
    }.bind(this)
  };
};

// Defino el Stack de la App
const RootStack = StackNavigator(
  {
    Introduccion: {
      screen: Introduccion,
    },
    Login: {
      screen: Login,
    },
    UsuarioNuevo: {
      screen: UsuarioNuevo,
    },
    RecuperarCuenta: {
      screen: UsuarioRecuperarPassword,
    },
    Inicio: {
      screen: Inicio,
    },
    RequerimientoNuevo: {
      screen: RequerimientoNuevo,
    },
    RequerimientoDetalle: {
      screen: RequerimientoDetalle,
    },
    PickerUbicacion: {
      screen: MiPickerUbicacion,
    },
    PickerListado: {
      screen: MiPicker,
    },
    UsuarioValidarDatosRenaper: {
      screen: UsuarioValidarDatosRenaper,
    },
    UsuarioEditarDatosContacto: {
      screen: UsuarioEditarDatosContacto,
    },
    AjustesDesarrolladores: {
      screen: AjustesDesarrolladores,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Login',
    transitionConfig,
    cardStyle: {
      shadowOpacity: 1,
    },
  },
);

// Init data por default nada
global.initData = undefined;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;

    this.state = {
      cargando: true,
      initData: undefined,
      error: undefined,
    };
  }


  componentDidMount() {
    Linking.addEventListener("url", this._handleOpenURL);

    this.init();
  }

  componentWillUnmount() {
    Linking.removeEventListener("url", this._handleOpenURL);

    // this.notificationListener();
    // this.notificationOpenedListener();
  }

  _handleOpenURL() {

  }

  init = () => {
    this.setState({
      error: undefined,
      cargando: true,
      initData: undefined
    }, () => {
      Rules_Init.actualizarApp()
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
              this.informarError(error);
            });
        })
        .catch((error) => {
          this.informarError(error);
        });
    });
  }

  informarError = (error) => {
    global.initData = undefined;
    this.setState({
      cargando: false,
      initData: undefined,
      error: error || "Error procesando la solicitud"
    });
  }

  onPanelErrorBotonPress = () => {
    this.init();
  }

  static Navigation;

  static replace = (pagina) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: pagina })]
    });
    global.navigator._navigation.dispatch(resetAction);
  }

  static goBack = () => {
    const { goBack } = global.navigator._navigation;
    goBack(null);
  }

  static navegar = (pagina, params) => {
    App.getNavigator().navigate(pagina, params);
  }

  static getNavigator = () => {
    return global.navigator._navigation;
  }

  // static animar = (callback) => {
  //   if (Platform.OS != "android") {
  //     LayoutAnimation.configureNext(LayoutAnimation.Presets.spring, callback);
  //   } else {
  //     if (callback != undefined) {
  //       callback();
  //     }
  //   }
  // }

  render() {
    const cargandoVisible = this.state.cargando == true;
    const errorVisible = this.state.error != undefined;
    const mantenimientoVisible =
      this.state.initData != undefined &&
      this.state.initData.mantenimiento == true;
    const contenidoVisible =
      cargandoVisible == false &&
      errorVisible == false &&
      mantenimientoVisible == false;

    return (
      <PaperProvider>
        {contenidoVisible == true && (
          <View
            keyboardShouldPersistTaps="handled"
            style={{ height: "100%", width: "100%", backgroundColor: "white" }}
          >
            <StatusBar backgroundColor="white" barStyle="dark-content" />

            <RootStack
              ref={function (ref) {
                global.navigator = ref;
              }.bind(this)}
            />
          </View>
        )}

        <AppCargando visible={this.state.cargando} />

        <AppError
          visible={errorVisible == true}
          error={this.state.error}
          mostrarBoton={true}
          botonTexto="Reintentar"
          onBotonPress={this.onPanelErrorBotonPress}
        />

        <AppMantenimiento visible={mantenimientoVisible == true} />
      </PaperProvider>
    );
  }
}
