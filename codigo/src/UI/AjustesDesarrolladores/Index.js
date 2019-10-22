import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  NativeModules,
  Clipboard
} from "react-native";
import {
  Text,
  Button
} from "native-base";
import {
  Checkbox
} from "react-native-paper";

//Mis componentes
import App from "@UI/App";
import MiStatusBar from '@Utils/MiStatusBar';
import MiToolbar from '@Utils/MiToolbar';
import MiToolbarSombra from '@Utils/MiToolbarSombra';
import MiItemDetalle from '@Utils/MiItemDetalle';
import MiCardDetalle from '@Utils/MiCardDetalle';

//Rules
import Rules_Ajustes from "@Rules/Rules_Ajustes";
import Rules_Notificaciones from "@Rules/Rules_Notificaciones";

export default class AjustesDesarrolladores extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      betaTester: false
    };
  }

  static defaultProps = {
    ...React.Component.defaultProps
  }

  componentWillMount() {
    Rules_Ajustes.isBetaTester().then((betaTester) => {
      this.setState({ betaTester: betaTester });
    });
  }

  onBetaTesterClick = () => {
    Rules_Ajustes.setBetaTester(!this.state.betaTester).then(() => {
      this.setState({ betaTester: !this.state.betaTester });
    });
  }

  verIntroduccion = () => {
    App.navegar('Introduccion');
  }

  onRecargarAppClick = () => {
    NativeModules.DevMenu.reload();
  }

  onTestNotificacionLocalClick = () => {
    Rules_Notificaciones.autoEnviarNotificacion()
      .then(() => {

      })
      .catch(() => {
        Alert.alert('', error || 'Error procesando la solicitud');
      });
  }

  cerrar = () => {
    App.goBack();
  }

  onBotonCancelarAjustesParaDesarrolladorClick = () => {
    Rules_Ajustes.setAjustesParaDesarrolladorVisible(false);

    const { params } = this.props.navigation.state;
    if (params != undefined && 'onAjustesParaDesarrolladorNoMasVisible' in params && params.onAjustesParaDesarrolladorNoMasVisible != undefined) {
      params.onAjustesParaDesarrolladorNoMasVisible();
    }

    App.goBack();
  }

  render() {
    const initData = global.initData;

    return (
      <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>

        {/* StatusBar */}
        <MiStatusBar />

        {/* Toolbar */}
        <MiToolbar titulo='Ajustes para desarrolladores' onBackPress={this.cerrar} />

        <View style={{ flex: 1 }}>

          <ScrollView contentContainerStyle={{ padding: 16 }}>


            {/* General */}
            <MiCardDetalle titulo="General" padding={false}>
              <MiItemDetalle
                titulo="Recargar App"
                subtitulo="Haga click aquí para volver a cargar el JS de la App"
                style={{ padding: 16 }}
                onPress={this.onRecargarAppClick} />

              <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />

              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <MiItemDetalle
                  style={{ padding: 16, flex: 1 }}
                  onPress={this.onBetaTesterClick}
                  titulo="Beta test"
                  subtitulo={this.state.betaTester ? 'Haga click aquí para dejar de ser beta tester' : 'Haga click aquí para ser beta tester'} />

                <View style={{ minWidth: 48, minHeight: 48, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                  <Checkbox
                    checked={this.state.betaTester}
                    color="green"
                    onPress={this.onBetaTesterClick}
                  />
                </View>

                <View style={{ width: 16 }} />
              </View>

              <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />

              {/* Intro */}
              <MiItemDetalle
                style={{ padding: 16 }}
                onPress={this.verIntroduccion}
                titulo="Ver intro"
                subtitulo='Haga click aquí para volver a ver la introducción' />

            </MiCardDetalle>



            {/* Notificaciones */}
            <MiCardDetalle titulo="Notificaciones" padding={false}>

              <MiItemDetalle
                titulo="Token actual"
                style={{ padding: 16 }}
                onPress={() => {
                  Clipboard.setString(global.notificationToken);
                }}
                subtitulo={global.notificationToken || 'Sin definir'} />

              <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />

              <MiItemDetalle
                style={{ padding: 16 }}
                titulo="Test notificación"
                subtitulo="Auto-enviar una notificación"
                onPress={this.onTestNotificacionLocalClick} />

            </MiCardDetalle>

            {/* Ajustes debug */}
            <View style={{ height: 32 }} />
            <Button
              rounded
              style={{
                alignSelf: 'center',
                shadowOpacity: 0.4,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 4 },
                backgroundColor: initData.colorVerde,
                textAlign: 'center',
                shadowColor: initData.colorVerde,
                backgroundColor: initData.colorVerde
              }}
              onPress={this.onBotonCancelarAjustesParaDesarrolladorClick}>
              <Text style={{
                color: initData.colorVerdeTexto,
                shadowColor: initData.colorVerde
              }}>Ocultar ajustes para desarrolladores</Text></Button>
            <View style={{ height: 32 }} />

          </ScrollView>
          {/* Sombra del toolbar */}
          <MiToolbarSombra />
        </View>
      </View >
    );
  }

}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%',
  },
  contenido: {
    flex: 1
  },
  card: {
    borderRadius: 16,
    margin: 8
  }
})