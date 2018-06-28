import React from "react";
import {
  View,
  StyleSheet,
  ScrollView
} from "react-native";
import {
  Text,
  Item,
  Picker,
  Button
} from "native-base";
import {
  Card,
  CardContent,
  Dialog,
  Button as ButtonPeper,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paragraph
} from "react-native-paper";
import WebImage from 'react-native-web-image';

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

  mostrarDialogoCambios = () => {
    this.setState({ dialogoCambiosVisible: true });
  }

  ocultarDialogoCambios = () => {
    this.setState({ dialogoCambiosVisible: false });
  }

  mostrarDialogoCerrarSesion = () => {
    this.setState({ dialogoCerrarSesionVisible: true });
  }

  ocultarDialogoCerrarSesion = () => {
    this.setState({ dialogoCerrarSesionVisible: false });
  }

  render() {
    const initData = global.initData;

    const urlFoto = initData.url_placeholder_user_male;

    return (
      <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>

        <ScrollView contentContainerStyle={{ padding: 16 }}>

          {/* Sesion */}
          <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>Sesión activa</Text>
          <Card style={styles.card}>
            <CardContent >
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                <WebImage
                  resizeMode="cover"
                  source={{ uri: urlFoto }}
                  style={{
                    width: 48,
                    height: 48
                  }} />

                <Text style={{ marginLeft: 8, fontSize: 20 }}>Federico Amura</Text>
              </View>

              <View style={{ width: '100%', height: 1, backgroundColor: 'black', opacity: 0.2, marginTop: 16 }}></View>
              <Button
                bordered
                small
                onPress={this.mostrarDialogoCerrarSesion}
                style={{
                  borderColor: 'green', marginTop: 16,
                  alignSelf: 'flex-end'
                }}
              ><Text style={{ color: 'green' }}>Cerrar sesión</Text></Button>
            </CardContent>
          </Card>


          {/* Acerca de... */}
          <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>Versión</Text>
          <Card style={styles.card}>
            <CardContent >
              <Text>Version 1.5.0</Text>
              <View style={{ width: '100%', height: 1, backgroundColor: 'black', opacity: 0.2, marginTop: 16 }}></View>
              <Button
                bordered
                small
                onPress={this.mostrarDialogoCambios}
                style={{
                  borderColor: 'green', marginTop: 16,
                  alignSelf: 'flex-end'
                }}
              ><Text style={{ color: 'green' }}>Ver informe de cambios</Text></Button>
            </CardContent>
          </Card>

          {/* Acerca de... */}
          <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>Acerca de nosotros</Text>
          <Card style={styles.card}>
            <CardContent >
              <WebImage
                resizeMode="contain"
                source={require('@Resources/logo_muni.png')}
                style={{
                  width: '100%',
                  height: 250
                }} />
              <View style={{ width: '100%', height: 1, backgroundColor: 'black', opacity: 0.2, marginBottom: 16 }}></View>

              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Aplicación desarrollada por la Municipalidad de Córdoba</Text>

            </CardContent>
          </Card>

          {/* <Button onPress={() => { App.navegar('PickerUbicacion') }}><Text>Ubicacion</Text></Button> */}
        </ScrollView>


        {/* Dialogo cerrar sesion */}
        <Dialog
          style={{ borderRadius: 16 }}
          visible={this.state.dialogoCerrarSesionVisible}
          onDismiss={this.ocultarDialogoCerrarSesion}
        >
          <DialogContent>
            <Paragraph>¿Esta seguro que desea cerrar sesión?</Paragraph>
          </DialogContent>
          <DialogActions>
            <ButtonPeper onPress={this.ocultarDialogoCerrarSesion}>No</ButtonPeper>
            <ButtonPeper onPress={this.cerrarSesion}>Si</ButtonPeper>
          </DialogActions>
        </Dialog>


        {/* Dialogo cambios version */}
        <Dialog
          style={{ borderRadius: 16 }}
          visible={this.state.dialogoCambiosVisible}
          onDismiss={this.ocultarDialogoCambios}
        >
          <DialogTitle>Informe de cambios</DialogTitle>
          <DialogContent>
            <ScrollView style={{ maxHeight: 300 }}>

              <Paragraph style={{ marginTop: 16, fontWeight: 'bold' }}>Versión 1.5.0</Paragraph>
              <Paragraph>Interfaz totalmente nueva</Paragraph>
              <Paragraph>Mejoras en la selección de ubicación de un requerimiento</Paragraph>
              <Paragraph>Ahora se podés ver el area encargada de solucionar tu requerimiento</Paragraph>

              <Paragraph style={{ marginTop: 16, fontWeight: 'bold' }}>Versión 1.0.0</Paragraph>
              <Paragraph>Versión inicial</Paragraph>

            </ScrollView>

          </DialogContent>
          <DialogActions>
            <ButtonPeper onPress={this.ocultarDialogoCambios}>Aceptar</ButtonPeper>
          </DialogActions>
        </Dialog>
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