import React from "react";
import {
  View,
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import {
  Text, Spinner,
} from "native-base";
import { Card, CardContent, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WebImage from 'react-native-web-image'

import Rules_Usuario from '@Rules/Rules_Usuario';

export default class PaginaPerfil extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      alertaUsuarioNoValidadoVisible: false,
      cargando: true,
      datos: undefined,
      error: undefined
    };

    this.animBoton = new Animated.Value(0);
    this.animAlertaUsuarioNoValidado = new Animated.Value(0);
  }

  componentDidMount() {
    this.buscarDatos();
  }

  buscarDatos = () => {
    Animated.timing(this.animBoton, { toValue: 0, duration: 300 }).start();
    this.setState({ cargando: true },
      () => {
        Rules_Usuario.getDatos()
          .then((datos) => {
            this.setState({ cargando: false, datos: datos });
            this.consultarUsuarioValidadoRenaper();
          })
          .catch((error) => {
            this.setState({ cargando: false, error: error });
          });;
      });
  }

  consultarUsuarioValidadoRenaper = () => {
    Rules_Usuario.esUsuarioValidadoRenaper().then((validado) => {
      if (!validado) {
        Animated.timing(this.animBoton, { toValue: 0, duration: 300 }).start();
        this.mostrarAlertaUsuarioNoValidadoRenaper();
      } else {
        Animated.timing(this.animBoton, { toValue: 1, duration: 300 }).start();
        this.ocultarAlertaUsuarioNoValidadoRenaper();
      }
    }).catch((error) => {
      this.ocultarAlertaUsuarioNoValidadoRenaper();
    });
  }

  mostrarAlertaUsuarioNoValidadoRenaper = () => {
    this.setState({ alertaUsuarioNoValidadoVisible: true });
    Animated.timing(this.animAlertaUsuarioNoValidado, { toValue: 1, duration: 500 }).start();
  }

  ocultarAlertaUsuarioNoValidadoRenaper = () => {
    this.setState({ alertaUsuarioNoValidadoVisible: false });
    Animated.timin(this.animAlertaUsuarioNoValidado, { toValue: 0, duration: 500 }).start();
  }

  abrirEditar = () => {

  }

  abrirValidarRenaper = () => {

  }

  render() {

    const initData = global.initData;

    if (this.state.cargando == true) {
      return (<View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>
        <Spinner color="green" />
      </View >);
    }

    if (this.state.datos == undefined) return null;

    const urlFoto = this.state.datos.SexoMasculino ? initData.url_placeholder_user_male : initData.url_placeholder_user_female;

    return (
      <View
        style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]} >


        {/* ALerta usuario no validado */}
        <TouchableOpacity onPress={this.abrirValidarRenaper}>
          <Animated.View style={{
            overflow: 'hidden',
            backgroundColor: '#E53935',
            opacity: this.animAlertaUsuarioNoValidado,
            maxHeight: this.animAlertaUsuarioNoValidado.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 100]
            })
          }}>
            <View style={{
              padding: 16,
              display: 'flex',
              flexDirection: 'row',
              paddingLeft: 27,
              paddingRight: 27
            }}>
              <View>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Su usuario no se encuentra validado por el registro nacional de las personas.</Text>
                <Text style={{ color: 'white', fontSize: 16 }}>Haga click aquí para validarlo</Text>
              </View>

            </View>

          </Animated.View>
        </TouchableOpacity>


        <ScrollView>



          <View style={styles.scrollView}>
            <View style={styles.imagen}>
              <WebImage
                resizeMode="cover"
                source={{ uri: urlFoto }}
                style={{
                  width: '100%',
                  height: '100%'
                }} />
            </View>

            <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>{texto_Titulo_DatosPersonales}</Text>
            <Card style={styles.card}>
              <CardContent>
                <Text style={{ fontSize: 24 }}>{this.state.datos.Nombre} {this.state.datos.Apellido}</Text>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name="account-card-details" type="MaterialCommunityIcons" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_Dni}</Text>
                    <Text>{this.state.datos.Dni}</Text>
                  </View>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name="account-card-details" type="MaterialCommunityIcons" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_Cuil}</Text>
                    <Text>{this.state.datos.Cuil}</Text>
                  </View>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name="calendar" type="MaterialCommunityIcons" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_FechaNacimiento}</Text>
                    <Text>{this.state.datos.FechaNacimiento}</Text>
                  </View>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name={"gender-male"} type="MaterialCommunityIcons" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_Sexo}</Text>
                    <Text>{this.state.datos.SexoMasculino ? texto_Titulo_SexoMasculino : texto_Titulo_SexoFemenino}</Text>
                  </View>
                </View>


                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name="map" type="MaterialCommunityIcons" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_DomicilioLegal}</Text>
                    <Text>{this.state.datos.DomicilioLegal}</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>{texto_Titulo_DatosContacto}</Text>
            <Card style={[styles.card]}>

              <CardContent>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name="email" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_Email}</Text>
                    <Text>{this.state.datos.Email}</Text>
                  </View>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name="phone" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_TelefonoCelular}</Text>
                    <Text>{this.state.datos.TelefonoCelular}</Text>
                  </View>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name="phone" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_TelefonoFijo}</Text>
                    <Text>{this.state.datos.TelefonoFijo}</Text>
                  </View>
                </View>

              </CardContent>
            </Card>
          </View>

        </ScrollView>

        {/* Boton nuevo requerimiento */}
        <Animated.View
          pointerEvents={this.state.cargando == true || this.state.error != undefined || this.state.requerimientos == undefined || this.state.requerimientos.length == 0 ? 'none' : 'auto'}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            padding: 24,
            opacity: this.animBoton.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            }),
            transform: [
              {
                scale: this.animBoton
              }
            ]
          }}
        >

          <FAB
            icon="edit"
            style={{ backgroundColor: 'green' }}
            color="white"
            onPress={this.abrirEditar} />



        </Animated.View>

      </View >
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%'
  },
  imagen: {
    width: 156,
    overflow: 'hidden',
    height: 156,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: (200 / 2),
    margin: 16,
    marginTop: 32,
    alignSelf: 'center'
  },
  scrollView: {
    width: '100%',
    padding: 16,
    paddingBottom: 104
  },
  card: {
    borderRadius: 16,
    margin: 8
  }
});

const texto_Titulo_DatosPersonales = 'Datos personales';
const texto_Titulo_Dni = 'Nº de Documento';
const texto_Titulo_Cuil = 'CUIL';
const texto_Titulo_FechaNacimiento = 'Fecha de nacimiento';
const texto_Titulo_Sexo = 'Sexo';
const texto_Titulo_SexoMasculino = 'Masculino';
const texto_Titulo_SexoFemenino = 'Femenino';
const texto_Titulo_DomicilioLegal = 'Domicilio legal'

const texto_Titulo_DatosContacto = 'Datos de contacto';
const texto_Titulo_Email = 'E-Mail';
const texto_Titulo_TelefonoFijo = 'Teléfono fijo';
const texto_Titulo_TelefonoCelular = 'Teléfono Celular';


