import React from "react";
import {
  View,
  StyleSheet,
  ScrollView
} from "react-native";
import {
  Text,
  Button
} from "native-base";
import {
  Card,
  Dialog,
  Button as ButtonPeper,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paragraph,
  TouchableRipple
} from "react-native-paper";
import WebImage from 'react-native-web-image';
import ItemDetalle from './ItemDetalle';
import CardDetalle from './CardDetalle';

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
      dialogoCerrarSesionVisible: false
    };
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

  render() {
    const initData = global.initData;

    const urlFoto = initData.url_placeholder_user_male;

    return (
      <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>

        <ScrollView contentContainerStyle={{ padding: 16 }}>

          {/* Sesion Activa */}
          <CardDetalle
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

          </CardDetalle>

          {/* General  */}
          <CardDetalle padding={false} titulo='General'>
            <ItemDetalle
              style={{ padding: 16 }}
              onPress={this.verIntroduccion}
              titulo="Introduccion"
              subtitulo='Haga click aquí para volver a ver la introducción' />

          </CardDetalle>

          {/* Acerca de... */}
          <CardDetalle padding={false} titulo='Sobre nosotros'>
            <ItemDetalle
              style={{ padding: 16 }}
              titulo="Desarrollo de aplicacion"
              subtitulo='Esta aplicación fue desarrollada por la Municipalidad de Cordoba, en la Direccion de Informatica' />

          </CardDetalle>

          {/* Especificaciones tecnicas */}
          <CardDetalle padding={false} titulo='Especificaciones tecnicas'>
            <ItemDetalle
              icono='react'
              style={{ padding: 16 }}
              onPress={() => { }}
              titulo='Lenguaje de programación'
              subtitulo='React Native' />

            <View style={{ width: '100%', height: 1, backgroundColor: 'black', opacity: 0.1 }}></View>

            <ItemDetalle
              icono='github-circle'
              style={{ padding: 16 }}
              onPress={() => { }}
              titulo='Codigo fuente'
              subtitulo='htts://github.com/asas' />
            <View style={{ width: '100%', height: 1, backgroundColor: 'black', opacity: 0.1 }}></View>

            <ItemDetalle
              icono='code-braces'
              style={{ padding: 16 }}
              onPress={() => { }}
              titulo='Licencias de codigo libre'
              subtitulo='Haga click para ver' />
          </CardDetalle>

          <Text style={{ alignSelf: 'center', marginTop: 16, marginBottom: 16 }}>Vesion 1.5</Text>
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
        <ButtonPeper onPress={() => {
          this.setState({ dialogoCerrarSesionVisible: false });
        }}>Si</ButtonPeper>
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