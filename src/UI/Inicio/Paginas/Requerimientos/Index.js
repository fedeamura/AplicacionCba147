import React from "react";
import { View, Animated, StyleSheet, Alert } from "react-native";
import { FAB } from "react-native-paper";
import firebase from "react-native-firebase";

//Mis componentes
import App from "@UI/App";
import MiListado from "@Utils/MiListado";
import ItemRequerimiento from "./CardItem";
import MiPanelError from "@Utils/MiPanelError";

//Rules
import Rules_Requerimiento from "@Rules/Rules_Requerimiento";
import Rules_Notificaciones from "@Rules/Rules_Notificaciones";

export default class PaginaInicio_Requerimientos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: true,
      error: undefined,
      requerimientos: []
    };

    this.animBoton = new Animated.Value(0);
  }

  componentDidMount() {
    this.initNotificaciones();
  }

  initNotificaciones = () => {

    //Pido el token
    firebase
      .messaging()
      .getToken()
      .then((fcmToken) => {
        this.onToken(fcmToken);
      });

    //Escucho cambios en el token
    firebase
      .messaging()
      .onTokenRefresh((fcmToken) => {
        this.onToken(fcmToken);
      });

    //Valido el permiso a las notificaciones
    if (global.initData.notificar == true) {
      firebase
        .messaging()
        .hasPermission()
        .then((enabled) => {

          //Si no tiene permiso, se lo solicito
          if (enabled == false) {
            firebase
              .messaging()
              .requestPermission()
              .then(() => {
                // User has authorised
              })
              .catch(() => {
                Alert.alert(
                  "",
                  "Para recibir notificaciones debe conceder el permiso en la seccion de ajustes de su teléfono"
                );
              });
          }
        });
    }

    //App abierta desde notificacion
    firebase
      .notifications()
      .getInitialNotification()
      .then(
        function (notificationOpen) {
          if (!notificationOpen) return;

          //Si no quiero notificaciones, corto aca
          if (global.initData.notificar == false) return;

          //Transformo
          const notification = notificationOpen.notification;
          let data = Rules_Notificaciones.transformarNotificacion(notification);

          //Manejo la notif
          Rules_Notificaciones.manejar(data);
        }.bind(this)
      );

    const channel = new firebase.notifications.Android.Channel(
      "channelId",
      "#CBA147",
      firebase.notifications.Android.Importance.Max
    ).setDescription("#CBA147");
    firebase.notifications().android.createChannel(channel);

    //Al aparecer una notificacion (En foreground)
    this.notificationListener = firebase.notifications().onNotification(
      function (notification) {
        //Si no quiero notificaciones, corto aca
        if (global.initData.notificar == false) return;

        //Transformo y mando a notificar
        let data = Rules_Notificaciones.transformarNotificacion(notification);
        if (data == undefined) return;

        Rules_Notificaciones.notificar(data);
      }.bind(this)
    );

    //Al hacer click en una notificacion
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(
        function (notificationOpen) {
          //Si no quiero notificaciones, corto aca
          if (global.initData.notificar == false) return;

          const notification = notificationOpen.notification;
          Rules_Notificaciones.manejar(notification.data);
        }.bind(this)
      );
  }

  onToken = (token) => {
    if (token == undefined) {
      global.notificationToken = undefined;
      return;
    }

    global.notificationToken = token;
    Rules_Notificaciones.guardarFcmToken(token)
      .then(() => {

      })
      .catch(() => {

      })
  }

  mostrarBotonNuevo = () => {
    Animated.spring(this.animBoton, {
      toValue: 1
    }).start();
  }

  ocultarBotonNuevo = () => {
    Animated.spring(this.animBoton, {
      toValue: 0
    }).start();
  }

  buscarRequerimientos = () => {
    this.setState({
      cargando: true
    }, () => {
      this.ocultarBotonNuevo();

      Rules_Requerimiento.get()
        .then((requerimientos) => {
          this.setState({
            cargando: false,
            error: undefined,
            requerimientos: requerimientos
          }, () => {
            if (requerimientos.length == 0) {
              this.ocultarBotonNuevo();

              if (global.primeraVezMandeRegistrar != true) {
                this.abrirNuevoRequerimiento();
                global.primeraVezMandeRegistrar = true;
              }
            } else {
              setTimeout(() => {
                this.mostrarBotonNuevo();
              }, 300);
            }
          });
        })
        .catch((error) => {
          this.setState(
            {
              cargando: false,
              requerimientos: [],
              error: error
            }, () => {
              this.ocultarBotonNuevo();
            });
        });
    });
  }

  abrirNuevoRequerimiento = () => {
    App.navegar("RequerimientoNuevo", {
      callback: () => {
        this.buscarRequerimientos();
      },
      verDetalleRequerimiento: (id) => {
        this.buscarRequerimientos();
        this.verDetalleRequerimiento(id);
      }
    });
  }

  verDetalleRequerimiento = (item) => {
    App.navegar("RequerimientoDetalle", {
      id: item.id,
      callback: () => {
        this.buscarRequerimientos();
      }
    });
  }

  keyExtractor(item) {
    return item.id;
  }

  renderItem = (item) => {
    return <ItemRequerimiento onPress={this.verDetalleRequerimiento} data={item.item} />;
  }

  renderEmpty = () => {
    return (
      <MiPanelError
        mostrarImagen={true}
        titulo={texto_Empty}
        mostrarBoton={true}
        urlImagen="https://res.cloudinary.com/dtwwgntjc/image/upload/v1526679157/0_plpdmd.png"
        textoBoton={texto_Boton_Empty}
        onBotonPress={this.abrirNuevoRequerimiento}
      />
    );
  }

  renderError = () => {
    return (
      <MiPanelError
        mostrarImagen={true}
        titulo={texto_Error_Consultado}
        detalle={this.state.error}
        mostrarBoton={true}
        icono="alert-circle-outline"
        textoBoton={texto_Boton_Reintentar}
        onBotonPress={this.buscarRequerimientos}
      />
    );
  }

  render() {
    const initData = global.initData;

    return (
      <View onLayout={this.buscarRequerimientos} style={[styles.contenedor]}>

        <MiListado
          backgroundColor={initData.backgroundColor}
          style={[styles.listado]}
          keyExtractor={this.keyExtractor}
          onRefresh={this.buscarRequerimientos}
          refreshing={this.state.cargando}
          error={this.state.cargando == false && this.state.error != undefined}
          data={this.state.requerimientos}
          renderItem={this.renderItem}
          renderEmpty={this.renderEmpty}
          renderError={this.renderError}
        />

        {/* Boton nuevo requerimiento */}
        <Animated.View
          pointerEvents={
            this.state.cargando == true ||
              this.state.error != undefined ||
              this.state.requerimientos == undefined ||
              this.state.requerimientos.length == 0
              ? "none"
              : "auto"
          }
          style={
            [
              styles.contenedorFab,
              {
                opacity: this.animBoton,
                transform: [
                  {
                    scale: this.animBoton
                  }
                ]
              }
            ]}
        >
          <FAB
            icon="add"
            style={{ backgroundColor: initData.colorVerde }}
            color="white"
            onPress={this.abrirNuevoRequerimiento}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    width: "100%",
    height: "100%"
  },
  listado: {
    padding: 16,
    paddingBottom: 104
  },
  contenedorFab: {
    position: "absolute",
    right: 0,
    padding: 24,
    bottom: 0,
  }
});

//TExtos
const texto_Error_Consultado = "Oops... Algo salió mal al consultar sus requerimientos";
const texto_Boton_Reintentar = "Reintentar";
const texto_Empty = "No posee ningún requerimiento para mostrar...";
const texto_Boton_Empty = "Aregar requerimiento";
