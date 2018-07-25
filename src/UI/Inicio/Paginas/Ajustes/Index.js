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
  Button
} from "native-base";
import {
  Dialog,
  Button as ButtonPeper,
  DialogActions,
  DialogContent,
  Paragraph,
  TouchableRipple,
} from "react-native-paper";
import WebImage from 'react-native-web-image';
import Snackbar from 'react-native-snackbar';

//Mis componentes
import App from "@UI/App";
import MiItemDetalle from '@Utils/MiItemDetalle';
import MiCardDetalle from '@Utils/MiCardDetalle';

//Rukes
import Rules_Ajustes from "@Rules/Rules_Ajustes";
import Rules_Usuario from "@Rules/Rules_Usuario";

const cantidadTapsParaVerAjustesDesarrollador = 7;
export default class PaginaAjustes extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dialogoCambiosVisible: false,
      dialogoCerrarSesionVisible: false,
      contadorAjustesDesarroladorClick: 0,
      ajustesParaDesarrolladorVisible: false
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    Rules_Ajustes.esAjustesParaDesarrolladorVisible().then((visible) => {
      this.setState({ ajustesParaDesarrolladorVisible: visible });
    });
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


  onClickVersion = () => {
    if (this.state.contadorAjustesDesarroladorClick == cantidadTapsParaVerAjustesDesarrollador) return;

    let cantidad = this.state.contadorAjustesDesarroladorClick + 1
    this.setState({
      contadorAjustesDesarroladorClick: cantidad,
      ajustesParaDesarrolladorVisible: cantidad == cantidadTapsParaVerAjustesDesarrollador
    }, () => {

      //Si cumpli la cantidad de clicks...
      if (this.state.contadorAjustesDesarroladorClick === cantidadTapsParaVerAjustesDesarrollador) {

        //Guardo
        Rules_Ajustes.setAjustesParaDesarrolladorVisible(true);

        //Informo
        Snackbar.show({
          title: 'Los ajustes para desarrollador son ahora visibles',
          action: {
            title: 'Deshabilitar',
            color: 'green',
            onPress: () => {
              this.setState({ contadorAjustesDesarroladorClick: 0, ajustesParaDesarrolladorVisible: false });
            },
          },
        });
      }
    });
  }

  abrirAjustesDesarrolladores = () => {
    App.navegar('AjustesDesarrolladores', {
      onAjustesParaDesarrolladorNoMasVisible: () => {
        this.setState({ contadorAjustesDesarroladorClick: 0, ajustesParaDesarrolladorVisible: false });
      }
    });
  }

  render() {
    const initData = global.initData;

    const urlFoto = initData.url_placeholder_user_male;

    return (
      <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>

        <ScrollView contentContainerStyle={{ padding: 16}}>

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

         
          {/* Acerca de... */}
          <MiCardDetalle padding={false} titulo='Sobre nosotros'>
            <MiItemDetalle
              style={{ padding: 16 }}
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

          {/* Ajustes debug */}
          {this.state.ajustesParaDesarrolladorVisible == true && (
            <View style={{ marginTop: 32, marginBottom: 72 }}>

              <Button
                bordered
                rounded
                style={{ alignSelf: 'center', borderColor: 'green' }}
                onPress={this.abrirAjustesDesarrolladores}><Text style={{ color: 'green' }}>Abrir ajustes para desarrolladores</Text></Button>
            </View>

          )}

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