import React from "react";
import { View, StyleSheet, Alert, ScrollView, TouchableWithoutFeedback, Animated } from "react-native";
import { Text, Button, Spinner } from "native-base";
import {
  Dialog,
  Button as ButtonPeper,
  DialogActions,
  DialogContent,
  Paragraph
} from "react-native-paper";
import WebImage from "react-native-web-image";
import openMap from "react-native-open-maps";
import email from 'react-native-email'
import call from 'react-native-phone-call'

//Mis componentes
import App from "@UI/App";
import MiItemDetalle from "@Utils/MiItemDetalle";
import MiCardDetalle from "@Utils/MiCardDetalle";

//Rukes
import Rules_Ajustes from "@Rules/Rules_Ajustes";
import Rules_Usuario from "@Rules/Rules_Usuario";

const cantidadTapsParaVerAjustesDesarrollador = 7;

export default class PaginaAjustes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datosUsuario: undefined,
      cargandoCerrarSesion: false,
      dialogoCambiosVisible: false,
      dialogoCerrarSesionVisible: false,
      contadorAjustesDesarroladorClick: 0,
      ajustesParaDesarrolladorVisible: false
    };

    this.animDatosUsuario = new Animated.Value(0);
  }

  componentWillMount() { }

  componentDidMount() {
    Rules_Ajustes.esAjustesParaDesarrolladorVisible()
      .then(visible => {
        this.setState({ ajustesParaDesarrolladorVisible: visible });
      });

    Rules_Usuario.getDatos()
      .then((datos) => {
        this.setState({ datosUsuario: datos });
        Animated.timing(this.animDatosUsuario, { toValue: 1, duration: 300 }).start();
      })
      .catch((error) => {
        this.setState({ datosUsuario: undefined });
      });
  }

  onBotonCerrarSesionPress = () => {
    if (this.state.cargandoCerrarSesion == true) return;
    this.setState({ dialogoCerrarSesionVisible: true });
  }

  cerrarSesion = () => {
    this.setState({
      dialogoCerrarSesionVisible: false,
      cargandoCerrarSesion: true
    }, () => {
      Rules_Usuario.cerrarSesion()
        .then(() => {
          Rules_Ajustes.setAjustesParaDesarrolladorVisible(false);
          App.replace("Login");
        })
        .catch(error => {
          this.setState({
            dialogoCerrarSesionVisible: false
          }, () => {
            Alert.alert("", error);
          });
        });
    }
    );
  }

  onClickVersion = () => {
    if (this.state.contadorAjustesDesarroladorClick == cantidadTapsParaVerAjustesDesarrollador) return;

    let cantidad = this.state.contadorAjustesDesarroladorClick + 1;
    this.setState({
      contadorAjustesDesarroladorClick: cantidad,
      ajustesParaDesarrolladorVisible: cantidad == cantidadTapsParaVerAjustesDesarrollador
    }, () => {
      //Si cumpli la cantidad de clicks...
      if (this.state.contadorAjustesDesarroladorClick === cantidadTapsParaVerAjustesDesarrollador) {
        //Guardo
        Rules_Ajustes.setAjustesParaDesarrolladorVisible(true);
      }
    });
  };

  abrirAjustesDesarrolladores = () => {
    App.navegar("AjustesDesarrolladores", {
      onAjustesParaDesarrolladorNoMasVisible: () => {
        this.setState({ contadorAjustesDesarroladorClick: 0, ajustesParaDesarrolladorVisible: false });
      }
    });
  };

  onBotonAcercaDeDomicilioPress = () => {
    try {
      const initData = global.initData;
      const latitud = initData.acercaDe_domicilioLatitud;
      const longitud = initData.acercaDe_domicilioLongitud;

      if (latitud == undefined || longitud == undefined || latitud == "" || longitud == "") return;

      openMap({ latitude: latitud, longitude: longitud, query: "Municipalidad de Córdoba" });
    } catch (ex) {

    }
  }

  onBotonAcercaDeEmailPress = () => {
    try {
      const initData = global.initData;
      const direccionEmail = initData.acercaDe_email;
      if (direccionEmail == undefined || direccionEmail == "") return;

      const to = [direccionEmail]
      email(to, {
        subject: 'Contacto desde App #CBA147'
      }).catch((error) => {
        Alert.alert('Error enviando email', ('' + error));
      });
    } catch (ex) {

    }

  }

  onBotonAcercaDeTelefonoPress = () => {

    try {
      const initData = global.initData;
      const numeroTelefono = initData.acercaDe_telefonoDato;
      if (numeroTelefono == undefined || numeroTelefono == "") {
        Alert.alert('Error', "Sin numero de telefono");
        return;
      }

      const args = {
        number: numeroTelefono,
        prompt: true
      }

      call(args).catch((error) => {
        Alert.alert('Error', ('' + error));

      });
    } catch (ex) {

    }
  }

  render() {
    const initData = global.initData;

    return (
      <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>

          {/* Session activa  */}
          {this.renderSesionActiva()}

          {/* Acerca de... */}
          {this.renderAcercaDe()}

          {/* Especificaciones tecnicas */}
          {this.renderEspecificacionesTecnicas()}

          {/* Version */}
          {this.renderVersion()}

          {/* Ajustes debug */}
          {this.state.ajustesParaDesarrolladorVisible == true && (
            <View style={{ marginTop: 32, marginBottom: 32 }}>
              <Button
                rounded
                style={{
                  alignSelf: "center",
                  shadowColor: initData.colorVerde,
                  shadowOpacity: 0.4,
                  shadowRadius: 5,
                  shadowOffset: { width: 0, height: 4 },
                  backgroundColor: initData.colorVerde
                }}
                onPress={this.abrirAjustesDesarrolladores}
              >
                <Text style={{ color: "white" }}>Abrir ajustes para desarrolladores</Text>
              </Button>
            </View>
          )}

          {/* <Button onPress={() => { App.navegar('PickerUbicacion') }}><Text>Ubicacion</Text></Button> */}
        </ScrollView>

        {/* Dialogo cerrar sesion */}
        {this.renderDialogoCerrarSesion()}
      </View>
    );
  }

  renderSesionActiva() {
    const initData = global.initData;

    let texto_NombreUsuario = '';
    let urlFoto = '';

    if (this.state.datosUsuario != undefined) {
      texto_NombreUsuario = this.state.datosUsuario.nombre + ' ' + this.state.datosUsuario.apellido;
      urlFoto = initData.urlCordobaFiles + '/' + this.state.datosUsuario.identificadorFotoPersonal + '/3';
    }

    return <View>
      {/* Sesion Activa */}
      <MiCardDetalle
        padding={false}
        titulo={texto_TituloSesionActiva}
      >

        <Spinner color={initData.colorVerde} style={{ position: 'absolute', left: 20 }} />

        <Animated.View style={{
          display: "flex",
          flexDirection: "row",
          opacity: this.animDatosUsuario,
          alignItems: "center",
          padding: 16
        }}>
          <WebImage
            resizeMode="cover"
            source={{ uri: urlFoto }}
            style={{
              borderRadius: 24,
              width: 48,
              height: 48
            }}
          />

          <Text style={{ marginLeft: 8, fontSize: 20 }}>{texto_NombreUsuario}</Text>

        </Animated.View>
      </MiCardDetalle>

      <Button
        small
        transparent
        onPress={this.onBotonCerrarSesionPress}
        style={{ alignSelf: 'center' }}>
        <Text
          style={{
            textDecorationLine: 'underline',
            color: initData.colorError
          }}>
          {texto_BotonCerrarSesion}
        </Text>
      </Button>
    </View>;
  }

  renderAcercaDe() {
    return <MiCardDetalle padding={false} titulo={texto_TituloAcercaDe}>

      <View style={{ padding: 32 }}>


        <WebImage
          resizeMode="contain"
          source={{ uri: initData.urlLogoMuni }}
          style={{
            alignSelf: 'center',
            margin: 16,
            width: 130,
            height: 130
          }}
        />


        <Text
          style={{
            textAlign: 'center',
            fontSize: 26,
            alignSelf: 'center',
            marginBottom: 8
          }}>
          {texto_AcercaDe_Muni}
        </Text>

        <Text
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: 16,
            marginBottom: 8,
            opacity: 0.9

          }}>
          {initData.acercaDe_secretaria}
        </Text>

        <Text
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: 14,
            opacity: 0.9
          }}>
          {initData.acercaDe_direccion}
        </Text>
      </View>


      {/* Domicilio */}
      {initData.acercaDe_domicilio != undefined && initData.acercaDe_domicilio != "" && (
        <View>
          <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />
          <MiItemDetalle
            onPress={this.onBotonAcercaDeDomicilioPress}
            titulo={texto_TituloAcercaDeDomicilio}
            icono="map"
            style={{ padding: 16 }}
            subtitulo={initData.acercaDe_domicilio} />
        </View>
      )}

      {/* Telefono */}
      {initData.acercaDe_telefono != undefined && initData.acercaDe_telefono != "" && (

        <View>
          <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />

          <MiItemDetalle
            onPress={this.onBotonAcercaDeTelefonoPress}
            titulo={texto_TituloAcercaDeTelefono}
            icono="phone"
            style={{ padding: 16 }}
            subtitulo={initData.acercaDe_telefono} />
        </View>
      )}

      {/* Email */}
      {initData.acercaDe_email != undefined && initData.acercaDe_email != "" && (

        <View>
          <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />
          <MiItemDetalle
            onPress={this.onBotonAcercaDeEmailPress}
            titulo={texto_TituloAcercaDeEmail}
            icono="email"
            style={{ padding: 16 }}
            subtitulo={initData.acercaDe_email} />
        </View>
      )}


    </MiCardDetalle>
  }

  renderEspecificacionesTecnicas() {
    return null;

    return (
      <MiCardDetalle padding={false} titulo="Especificaciones tecnicas">
        <MiItemDetalle
          icono="react"
          style={{ padding: 16 }}
          titulo="Lenguaje de programación"
          subtitulo="React Native"
        />

        <View style={{ width: "100%", height: 1, backgroundColor: "black", opacity: 0.1 }} />

        <MiItemDetalle
          icono="github-circle"
          style={{ padding: 16 }}
          titulo="Codigo fuente"
          subtitulo="htts://github.com/asas"
        />
        <View style={{ width: "100%", height: 1, backgroundColor: "black", opacity: 0.1 }} />

        <MiItemDetalle
          icono="code-braces"
          style={{ padding: 16 }}
          titulo="Licencias de codigo libre"
          subtitulo="Haga click para ver"
        />
      </MiCardDetalle>
    );
  }

  renderVersion() {
    const initData = global.initData;

    return <TouchableWithoutFeedback onPress={this.onClickVersion}>
      <View>
        <Text style={{ alignSelf: "center", marginTop: 16 }}>Vesion {initData.version}</Text>
        <Text style={{ alignSelf: "center", opacity: 0.8, fontSize: 14, marginBottom: 16 }}>
          {initData.versionFecha}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  }

  onDialogoCerarSesionBotonCancelarPress = () => {
    this.setState({ dialogoCerrarSesionVisible: false });
  }

  renderDialogoCerrarSesion() {
    return (
      <Dialog
        style={{ borderRadius: 16 }}
        visible={this.state.dialogoCerrarSesionVisible}
        onDismiss={this.onDialogoCerarSesionBotonCancelarPress}
      >
        <DialogContent>
          <Paragraph>¿Esta seguro que desea cerrar sesión?</Paragraph>
        </DialogContent>
        <DialogActions>
          <ButtonPeper
            onPress={this.onDialogoCerarSesionBotonCancelarPress}
          >
            No
          </ButtonPeper>
          <ButtonPeper onPress={this.cerrarSesion}>Si</ButtonPeper>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    width: "100%",
    height: "100%"
  },
  contenido: {
    flex: 1
  },
  card: {
    borderRadius: 16,
    margin: 8
  },
  botonRedSocial: {
    width: 36,
    backgroundColor: 'red',
    height: 36,
    borderRadius: 36,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  botonRedSocialIcono: {
    fontSize: 20
  }
});

const texto_TituloSesionActiva = "Sesión activa";
const texto_BotonCerrarSesion = "Cerrar sesión";

const texto_TituloAcercaDe = "Acerca de";
const texto_TituloAcercaDeTelefono = 'Teléfono';
const texto_TituloAcercaDeEmail = 'E-Mail';
const texto_TituloAcercaDeDomicilio = 'Domicilio';

const texto_AcercaDe_Muni = 'Municipalidad de Córdoba';