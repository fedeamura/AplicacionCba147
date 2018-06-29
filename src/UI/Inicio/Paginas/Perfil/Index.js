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
import { FAB } from 'react-native-paper';
import WebImage from 'react-native-web-image'

//Mis componentes
import App from "@UI/App";
import MiCardDetalle from '@Utils/MiCardDetalle';
import MiItemDetalle from '@Utils/MiItemDetalle';

//Rules
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
      if (validado == false) {
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
    Animated.timing(this.animAlertaUsuarioNoValidado, { toValue: 0, duration: 500 }).start();
  }

  abrirEditar = () => {

  }

  abrirValidarRenaper = () => {
    App.navegar('UsuarioValidarDatosRenaper', {
      callback: () => {
        this.buscarDatos();
      }
    });
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

            <MiCardDetalle titulo={texto_Titulo_DatosPersonales}>
              <MiItemDetalle
                icono='account-card-details'
                titulo={texto_Titulo_Nombre} subtitulo={this.state.datos.Nombre + ' ' + this.state.datos.Apellido} />
              <View style={{ height: 16 }} />
              <MiItemDetalle
                icono='account-card-details'
                titulo={texto_Titulo_Dni} subtitulo={this.state.datos.Dni} />
              <View style={{ height: 16 }} />
              <MiItemDetalle
                icono='account-card-details'
                titulo={texto_Titulo_Cuil} subtitulo={this.state.datos.Cuil} />
              <View style={{ height: 16 }} />
              <MiItemDetalle
                icono='calendar'
                titulo={texto_Titulo_FechaNacimiento} subtitulo={this.state.datos.FechaNacimiento} />
              <View style={{ height: 16 }} />
              <MiItemDetalle
                icono='gender-male'
                titulo={texto_Titulo_Sexo} subtitulo={this.state.datos.SexoMasculino ? texto_Titulo_SexoMasculino : texto_Titulo_SexoFemenino} />
              <View style={{ height: 16 }} />
              <MiItemDetalle
                icono='map'
                titulo={texto_Titulo_DomicilioLegal} subtitulo={this.state.datos.DomicilioLegal} />
            </MiCardDetalle>


            <MiCardDetalle titulo={texto_Titulo_DatosContacto}>
              <MiItemDetalle
                icono='email'
                titulo={texto_Titulo_Email} subtitulo={this.state.datos.Email} />
              <View style={{ height: 16 }} />
              <MiItemDetalle
                icono='phone'
                titulo={texto_Titulo_TelefonoCelular} subtitulo={this.state.datos.TelefonoCelular} />
              <View style={{ height: 16 }} />
              <MiItemDetalle
                icono='phone'
                titulo={texto_Titulo_TelefonoFijo} subtitulo={this.state.datos.TelefonoFijo} />
            </MiCardDetalle>
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
const texto_Titulo_Nombre = 'Nombre';
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


