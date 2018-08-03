import React from "react";
import {
  Platform,
  View,
  Alert,
  Easing,
  Animated,
  Linking,
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
import firebase from 'react-native-firebase';

//Mis Componentes
import Introduccion from "@UI/Introduccion/Index";
import Login from "@UI/Login/Index";
import Inicio from "@UI/Inicio/Index";
import RequerimientoNuevo from "@UI/RequerimientoNuevo/Index";
import RequerimientoDetalle from "@UI/RequerimientoDetalle/Index";
import MiPicker from "@Utils/MiPicker";
import MiPickerUbicacion from "@Utils/MiPickerUbicacion";
import AjustesDesarrolladores from "@UI/AjustesDesarrolladores/Index";
import UsuarioNuevo from "@UI/UsuarioNuevo/Index";
import UsuarioRecuperarPassword from "@UI/UsuarioRecuperarPassword/Index";
import UsuarioValidarDatosRenaper from '@UI/UsuarioValidarDatosRenaper/Index';
import UsuarioEditarDatosContacto from '@UI/UsuarioEditarDatosContacto/Index';

import AppCargando from "./AppCargando";
import AppError from "./AppError";
import AppMantenimiento from "./AppMantenimiento";

//Rules
import Rules_Init from "@Rules/Rules_Init";
import Rules_Ajustes from "../Rules/Rules_Ajustes";
import Rules_Notificaciones from "@Rules/Rules_Notificaciones";

const transitionConfig = function() {
  return {
    transitionSpec: {
      duration: 500,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: function (sceneProps) {
      const { layout, position, scene } = sceneProps

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
              inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
              outputRange: [width, 0, 0]
            })
          }
        ]
      }
    }.bind(this),
  }
}

//Defino el Stack de la App
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
      screen: UsuarioRecuperarPassword
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
    UsuarioValidarDatosRenaper: {
      screen: UsuarioValidarDatosRenaper
    },
    UsuarioEditarDatosContacto: {
      screen: UsuarioEditarDatosContacto
    },
    AjustesDesarrolladores: {
      screen: AjustesDesarrolladores
    }
  },
  {
    headerMode: "none",
    initialRouteName: "Login",
    transitionConfig,
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

    this.onToken = this.onToken.bind(this);
    this.informarError = this.informarError.bind(this);
  }

  _handleOpenURL(event) {
    console.log(event.url);
  }

  componentDidMount() {
    Linking.addEventListener('url', this._handleOpenURL);

    Rules_Init.actualizarApp()
      .then(function () {
        //Busco la data inicial
        Rules_Init.getInitData()
          .then(function (initData) {

            global.initData = initData;

            this.setState({
              cargando: false,
              initData: initData,
              error: undefined
            });
          }.bind(this))
          .catch(function (error) {
            this.informarError(error);
          }.bind(this));
      }.bind(this))
      .catch(function (error) {
        this.informarError(error);
      }.bind(this));

    firebase.messaging().getToken().then(function (fcmToken) {
      this.onToken(fcmToken);
    }.bind(this));

    firebase.messaging().onTokenRefresh(function (fcmToken) {
      this.onToken(fcmToken);
    }.bind(this));

    firebase.messaging().hasPermission()
      .then(function (enabled) {
        if (enabled == false) {
          firebase.messaging().requestPermission()
            .then(function () {
              // User has authorised  
            }.bind(this))
            .catch(function (error) {
              Alert.alert('', 'Para recibir notificaciones debe conceder el permiso en Ajustes');
            }.bind(this));
        }
      }.bind(this));

    //App abierta desde notificacion
    firebase.notifications().getInitialNotification().then(function (notificationOpen) {
      if (!notificationOpen) return;

      const notification = notificationOpen.notification;

      //Transformo
      let data = Rules_Notificaciones.transformarNotificacion(notification);

      //Guardo en global... para que el componente de Inicio (Mis requerimiento) maneje lo que hay que hacer
      //Lo mando para despues porque hay que validar el usuario logeado y esperar que acceda.
      global.notificacionInicial = data;

    }.bind(this));

    const channel = new firebase.notifications.Android.Channel('channelId', '#CBA147', firebase.notifications.Android.Importance.Max).setDescription('#CBA147');
    firebase.notifications().android.createChannel(channel);

    //Al aparecer una notificacion (En foreground)
    this.notificationListener = firebase.notifications().onNotification(function (notification) {

      //Transformo y mando a notificar
      let data = Rules_Notificaciones.transformarNotificacion(notification);
      if (data == undefined) return;

      Rules_Notificaciones.notificar(data);
    }.bind(this));

    //Al hacer click en una notificacion
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(function (notificationOpen) {
      const notification = notificationOpen.notification;
      Rules_Notificaciones.manejar(notification.data);
    }.bind(this));
  }



  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);

    this.notificationListener();
    this.notificationOpenedListener();
  }

  onToken(token) {
    if (token == undefined) {
      global.notificationToken = undefined;
      return;
    }

    global.notificationToken = token;
  }

  informarError(error) {
    global.initData = undefined;
    this.setState({
      cargando: false,
      initData: undefined,
      error: error || 'Error procesando la solicitud'
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
          style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>

          <StatusBar backgroundColor="white" barStyle="dark-content" />

          <RootStack ref={function (ref) { global.navigator = ref; }.bind(this)} />
        </View>
      </PaperProvider>
    );
  }
}
