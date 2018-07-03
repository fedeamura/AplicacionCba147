import React from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";
import {
  Text,
} from "native-base";
import {
  Dialog,
  Button as ButtonPeper,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paragraph,
  TouchableRipple,
  Checkbox
} from "react-native-paper";
import WebImage from 'react-native-web-image';
import MiItemDetalle from '@Utils/MiItemDetalle';
import MiCardDetalle from '@Utils/MiCardDetalle';

//Mis componentes
import App from "@UI/App";

//Rukes
import Rules_Ajustes from "@Rules/Rules_Ajustes";
import Rules_Usuario from "@Rules/Rules_Usuario";

export default class PaginaAjustes extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dialogoCambiosVisible: false,
      dialogoCerrarSesionVisible: false,
      contadorAjustesDesarroladorClick: 0
    };
  }

  componentWillMount() {

  }

  cerrarSesion = () => {
    this.setState({
      dialogoCerrarSesionVisible: false,
      cargando: true
    }, () => {
      Rules_Usuario.cerrarSesion()
        .then(() => {
          this.setState({ cargando: false }, () => {
            App.replace('Login');
          });
        })
        .catch((error) => {
          this.setState({ cargando: false }, () => {
            alert.alert('', error);
          });
        });;
    });
  }

  verIntroduccion = () => {
    App.navegar('Introduccion');
  }

  onClickVersion = () => {
    this.setState({ contadorAjustesDesarroladorClick: this.state.contadorAjustesDesarroladorClick + 1 });
  }

  abrirAjustesDesarrolladores = () => {
    App.navegar('AjustesDesarrolladores');
  }

  render() {
    const initData = global.initData;

    const urlFoto = initData.url_placeholder_user_male;

    return (
      <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>

        <ScrollView contentContainerStyle={{ padding: 16 }}>

          {/* Sesion Activa */}
          <MiCardDetalle
            padding={false}
            titulo='Sesión activa'
            botones={[
              { texto: 'Cerrar sesión', onPress: () => { this.setState({ dialogoCerrarSesionVisible: true }); } }
            ]}>
            <TouchableRipple onPress={() => { }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 16 }}>

                <WebImage
                  resizeMode="cover"
                  source={{ uri: urlFoto }}
                  style={{
                    width: 48,
                    height: 48
                  }} />

                <Text style={{ marginLeft: 8, fontSize: 20 }}>Federico Amura</Text>
              </View>
            </TouchableRipple>

          </MiCardDetalle>

          {/* General  */}
          <MiCardDetalle padding={false} titulo='General'>

            {/* Intro */}
            <MiItemDetalle
              style={{ padding: 16 }}
              onPress={this.verIntroduccion}
              titulo="Introduccion"
              subtitulo='Haga click aquí para volver a ver la introducción' />


            {/* <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <MiItemDetalle
                style={{ padding: 16, flex: 1 }}
                onPress={this.onBetaTesterClick}
                titulo="Beta test"
                subtitulo={this.state.betaTester ? 'Haga click aquí para dejar de ser beta tester' : 'Haga click aquí para ser beta tester'} />

              <View style={{ minWidth: 48, minHeight: 48, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                <Checkbox
                  checked={this.state.betaTester}
                  color="green"
                  onPress={() => { }}
                />
              </View>

              <View style={{ width: 16 }} />
            </View> */}

            {/* Ajustes debug */}
            {this.state.contadorAjustesDesarroladorClick >= 5 && (

              <View>

                <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', height: 1 }} />

                <MiItemDetalle
                  style={{ padding: 16 }}
                  onPress={this.abrirAjustesDesarrolladores}
                  titulo="Ajustes para Desarrolladores"
                  subtitulo='Haga click aquí para ir a los ajustes para desarrolladores' />
              </View>

            )}

          </MiCardDetalle>

          {/* Acerca de... */}
          <MiCardDetalle padding={false} titulo='Sobre nosotros'>
            <MiItemDetalle
              style={{ padding: 16 }}
              titulo="Desarrollo de aplicacion"
              subtitulo='Esta aplicación fue desarrollada por la Municipalidad de Cordoba, en la Direccion de Informatica' />

          </MiCardDetalle>

          {/* Especificaciones tecnicas */}
          <MiCardDetalle padding={false} titulo='Especificaciones tecnicas'>
            <MiItemDetalle
              icono='react'
              style={{ padding: 16 }}
              onPress={() => { }}
              titulo='Lenguaje de programación'
              subtitulo='React Native' />

            <View style={{ width: '100%', height: 1, backgroundColor: 'black', opacity: 0.1 }}></View>

            <MiItemDetalle
              icono='github-circle'
              style={{ padding: 16 }}
              onPress={() => { }}
              titulo='Codigo fuente'
              subtitulo='htts://github.com/asas' />
            <View style={{ width: '100%', height: 1, backgroundColor: 'black', opacity: 0.1 }}></View>

            <MiItemDetalle
              icono='code-braces'
              style={{ padding: 16 }}
              onPress={() => { }}
              titulo='Licencias de codigo libre'
              subtitulo='Haga click para ver' />
          </MiCardDetalle>

          <TouchableWithoutFeedback onPress={this.onClickVersion}>
            <Text style={{ alignSelf: 'center', marginTop: 16, marginBottom: 16 }}>Vesion 1.5</Text>
          </TouchableWithoutFeedback>

          {/* <Button onPress={() => { App.navegar('PickerUbicacion') }}><Text>Ubicacion</Text></Button> */}
        </ScrollView>


        {/* Dialogo cerrar sesion */}
        {this.renderDialogoCerrarSesion()}

      </View >
    );
  }

  renderDialogoCerrarSesion() {
    return <Dialog
      style={{ borderRadius: 16 }}
      visible={this.state.dialogoCerrarSesionVisible}
      onDismiss={() => {
        this.setState({ dialogoCerrarSesionVisible: false });
      }}
    >
      <DialogContent>
        <Paragraph>¿Esta seguro que desea cerrar sesión?</Paragraph>
      </DialogContent>
      <DialogActions>
        <ButtonPeper onPress={() => {
          this.setState({ dialogoCerrarSesionVisible: false });
        }}>No</ButtonPeper>
        <ButtonPeper onPress={this.cerrarSesion}>Si</ButtonPeper>
      </DialogActions>
    </Dialog>;
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