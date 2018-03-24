import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Animated,
  LayoutAnimation,
  NativeModules,
  UIManager,
  Image,
  ScrollView,
  StatusBar
} from "react-native";
import {
  Button
} from 'native-base';

import {
  Paper,
  TouchableRipple,
  Card,
  CardContent,
  ToolbarContent
} from "react-native-paper";
import WebImage from 'react-native-web-image'

//Anims
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis Compontentes
import App from "Cordoba/src/UI/App";
import AppStyles from "Cordoba/src/UI/Styles/default";
import IndicadorCargando from "Cordoba/src/UI/Utils/IndicadorCargando";
import MiToolbar from "Cordoba/src/UI/Utils/MiToolbar";

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

export default class Home extends React.Component {
  static navigationOptions = {
    title: "Ajustes",
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      CargandoUsuario: true
    };
  }

  componentWillMount() {
    setTimeout(() => {
      App.animar();
      this.setState({
        CargandoUsuario: true
      }, () => {
        Rules_Usuario.getDatosUsuario()
          .then((result) => {

            this.setState({
              CargandoUsuario: false,
              Usuario: result
            });
          });
      });
    }, 500);
  }

  render() {
    const imageUri = 'https://www.communitylandtrust.ca/wp-content/uploads/2015/10/placeholder.png'
    const nombreUsuario = this.state.Usuario != undefined ? this.state.Usuario.Nombre + ' ' + this.state.Usuario.Apellido : 'Cargando...';
    const nivelUsuario = this.state.Usuario != undefined ? this.state.Usuario.NivelAcceso.Nombre : '';

    return (


      <View style={styles.contenedor}>

        <MiToolbar
          left={{
            icon: "arrow-back",
            onClick: () => {
              App.goBack();
            }
          }}
        >
          <ToolbarContent title="Ajustes" />
        </MiToolbar>

        <ScrollView style={styles.content}>
          <Card
            style={[styles.contenedor_CardUsuario]}
            onPress={() => {
            }}>
            <CardContent>
              {this.state.CargandoUsuario ? (
                <Text>Cargando datos del usuario...</Text>
              ) : (
                  <View style={styles.contenedor_CardUsuario_Contenido}>
                    <WebImage
                      style={styles.contenedor_CardUsuario_Contenido_ImagenUsuario}
                      source={{ uri: imageUri }} />
                    <View style={styles.contenedor_CardUsuario_Contenido_Textos}>
                      <Text style={styles.contenedor_CardUsuario_Contenido_TextoUsuario}>{nombreUsuario}</Text>
                      <Text style={styles.contenedor_CardUsuario_Contenido_TextoNivel}>{nivelUsuario}</Text>
                    </View>
                  </View>
                )}
            </CardContent>
          </Card>

          <Button
            style={styles.btnCerrarSesion}
            rounded
            onPress={() => {
              Rules_Usuario.cerrarSesion()
                .then(() => {
                  App.replace("Login");
                }).catch(() => {

                });
            }}          >
            <Text>Cerrar Sesión</Text>
          </Button>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    display: "flex",
    height: "100%",
    flexDirection: "column"
  },
  btnCerrarSesion: {
    display: 'flex',
    margin: 8,
    paddingLeft: 16,
    paddingRight: 16,
    alignSelf: 'center',
    backgroundColor: '#CCC',
    justifyContent: 'center'
  },
  content: {
    display: "flex",
    height: "100%",
    flex: 1,
    width: '100%'
  },
  contenedor_CardUsuario: {
    margin: 16
  },
  contenedor_CardUsuario_Contenido: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  contenedor_CardUsuario_Contenido_ImagenUsuario: {
    width: 48,
    height: 48
  },
  contenedor_CardUsuario_Contenido_Textos: {
    display: 'flex',
    marginLeft: 8
  },
  contenedor_CardUsuario_Contenido_TextoUsuario: {
    fontSize: 18
  },
  contenedor_CardUsuario_Contenido_TextoNivel: {
    fontSize: 14,
  }
});
