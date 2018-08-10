import React from "react";
import { StyleSheet, View, Alert, Animated, ScrollView, Keyboard } from "react-native";
import { Text } from "native-base";
import { Card, CardContent } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";

//Mis componentes
import App from "Cordoba/src/UI/App";
import MiStatusBar from "@Utils/MiStatusBar";
import MiToolbar from "@Utils/MiToolbar";
import FormDatosPersonales from "./FormDatosPersonales";
import FormDatosExtra from "./FormDatosExtra";
import Resultado from "./Resultado";
import { stringDateToString, toTitleCase } from "@Utils/Helpers";

//Rules
import Rules_Usuario from "Cordoba/src/Rules/Rules_Usuario";

export default class Login extends React.Component {
  static navigationOptions = {
    title: texto_Titulo,
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      algoInsertadoEnDatosPersonales: false,
      datosPersonales: undefined,
      datosExtra: undefined,
      //Resultado
      mostrarPanelResultado: false,
      registrando: false,
      error: undefined
    };

    this.keyboardHeight = new Animated.Value(0);
    this.animDatosPersonales = new Animated.Value(1);
    this.animDatosExtra = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener("keyboardWillShow", this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener("keyboardWillHide", this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height
    }).start();
  }

  keyboardWillHide = (event) => {
    this.teclado = false;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0
    }).start();
  }

  registrar = (data) => {
    Keyboard.dismiss();

    //Armo el comando
    let comando = {
      Nombre: this.state.datosPersonales.nombre,
      Apellido: this.state.datosPersonales.apellido,
      Dni: this.state.datosPersonales.dni,
      FechaNacimiento: stringDateToString(this.state.datosPersonales.fechaNacimiento),
      SexoMasculino: this.state.datosPersonales.sexoMasculino,
      Username: data.username,
      Password: data.password,
      Email: data.email,
      TelefonoFijo: data.telefonoFijo,
      TelefonoCelular: data.telefonoCelular
    };

    //Muestro el panel y empiezo a animar el cargando
    this.setState({
      datosExtra: data,
      mostrarPanelResultado: true,
      registrando: true
    }, () => {
      //Mando a registrar
      Rules_Usuario.crearUsuario(comando)
        .then(() => {
          this.setState({
            registrando: false
          });
        })
        .catch((error) => {
          Alert.alert("", error);
          this.setState({
            mostrarPanelResultado: false,
            registrando: false
          });
        });
    });
  }

  cerrar = () => {
    Keyboard.dismiss();

    if (this.state.registrando == true) return;

    let preguntarCerrar = false;
    if (this.state.datosPersonales == undefined && this.state.algoInsertadoEnDatosPersonales == true) {
      preguntarCerrar = true;
    }

    if (this.state.datosPersonales != undefined) {
      preguntarCerrar = true;
    }

    if (preguntarCerrar == true) {
      Alert.alert("", texto_DialogoCancelarFormulario,
        [
          {
            text: texto_DialogoCancelarFormulario_No
          },
          {
            text: texto_DialogoCancelarFormulario_Si,
            onPress: function () {
              App.goBack();
            }.bind(this)
          }
        ], { cancelable: true }
      );
      return;
    }

    App.goBack();
  }

  onButtonResultadoClick = () => {
    App.goBack();
  }

  onFormularioDatosPersonalesAlgoInsertado = (algoInsertado) => {
    this.setState({ algoInsertadoEnDatosPersonales: algoInsertado });
  }

  onDatosPersonalesReady = (datos) => {
    Animated.timing(this.animDatosPersonales, {
      toValue: 0,
      duration: 500
    }).start(() => {
      this.setState({
        datosPersonales: datos
      }, () => {
        if (this.scrollView != undefined) {
          this.scrollView.scrollTo(0);
        }

        Animated.timing(this.animDatosExtra, {
          toValue: 1,
          duration: 500
        }).start();
      });
    });
  }

  onScrollViewRef = (ref) => {
    this.scrollView = ref;
  }

  render() {
    const initData = global.initData;

    return (
      <View style={styles.contenedor}>
        {/* StatusBar */}
        <MiStatusBar />

        {/* Toolbar */}
        <MiToolbar titulo={texto_Titulo} onBackPress={this.cerrar} />

        {/* Contenido */}
        <View style={[styles.contenedor_Formulario, { backgroundColor: initData.backgroundColor }]}>
          <ScrollView ref={this.onScrollViewRef} keyboardShouldPersistTaps="always">
            <View style={styles.scrollViewContent}>
              {/* Datos de acceso */}
              {this.state.datosPersonales == undefined && (
                <Animated.View style={{ opacity: this.animDatosPersonales }}>
                  <FormDatosPersonales
                    onAlgoInsertado={this.onFormularioDatosPersonalesAlgoInsertado}
                    onReady={this.onDatosPersonalesReady}
                  />
                </Animated.View>
              )}

              {this.state.datosPersonales != undefined && (
                <Animated.View style={{ opacity: this.animDatosExtra }}>
                  {/* Info */}
                  <Card style={[styles.card, { backgroundColor: initData.colorNaranja, marginTop: 32 }]}>
                    <CardContent style={{ display: "flex", flexDirection: "row" }}>
                      <Icon style={{ fontSize: 36, marginRight: 16, color: "white" }} name="information-outline" />
                      <Text style={{ fontSize: 16, flex: 1, color: "white", fontWeight: "bold" }}>
                        {texto_InfoDatosValidados}
                      </Text>
                    </CardContent>
                  </Card>

                  {/* Datos de acceso */}
                  <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>{texto_TituloDatosPersonales}</Text>

                  {/* Card datos del usuario */}
                  <Card style={styles.card}>
                    <CardContent>
                      <Text style={{ fontSize: 24 }}>
                        {toTitleCase(this.state.datosPersonales.nombre + " " + this.state.datosPersonales.apellido)}
                      </Text>

                      <View style={{ display: "flex", flexDirection: "row", marginTop: 8 }}>
                        <Icon
                          name="account-card-details"
                          type="MaterialCommunityIcons"
                          style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}
                        />
                        <View style={{ marginLeft: 16, flex: 1 }}>
                          <Text style={{ fontWeight: "bold" }}>{texto_TituloDni}</Text>
                          <Text>{this.state.datosPersonales.dni || "Sin datos"}</Text>
                        </View>
                      </View>

                      <View style={{ display: "flex", flexDirection: "row", marginTop: 8 }}>
                        <Icon
                          name="account-card-details"
                          type="MaterialCommunityIcons"
                          style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}
                        />
                        <View style={{ marginLeft: 16, flex: 1 }}>
                          <Text style={{ fontWeight: "bold" }}>{texto_TituloCuil}</Text>
                          <Text>{this.state.datosPersonales.cuil || "Sin datos"}</Text>
                        </View>
                      </View>

                      <View style={{ display: "flex", flexDirection: "row", marginTop: 8 }}>
                        <Icon
                          name="calendar"
                          type="MaterialCommunityIcons"
                          style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}
                        />
                        <View style={{ marginLeft: 16, flex: 1 }}>
                          <Text style={{ fontWeight: "bold" }}>{texto_TituloFechaNacimiento}</Text>
                          <Text>{stringDateToString(this.state.datosPersonales.fechaNacimiento)}</Text>
                        </View>
                      </View>

                      <View style={{ display: "flex", flexDirection: "row", marginTop: 8 }}>
                        <Icon
                          name={this.state.datosPersonales.sexoMasculino == true ? "gender-male" : "gender-female"}
                          type="MaterialCommunityIcons"
                          style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}
                        />
                        <View style={{ marginLeft: 16, flex: 1 }}>
                          <Text style={{ fontWeight: "bold" }}>{texto_TituloSexo}</Text>
                          <Text>
                            {this.state.datosPersonales.sexoMasculino == true
                              ? texto_TituloSexoMasculino
                              : texto_TituloSexoFemenino}
                          </Text>
                        </View>
                      </View>

                      <View style={{ display: "flex", flexDirection: "row", marginTop: 8 }}>
                        <Icon
                          name="map"
                          type="MaterialCommunityIcons"
                          style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}
                        />
                        <View style={{ marginLeft: 16, flex: 1 }}>
                          <Text style={{ fontWeight: "bold" }}>{texto_TituloDomicilioLegal}</Text>
                          <Text>{toTitleCase(this.state.datosPersonales.domicilioLegal)}</Text>
                        </View>
                      </View>
                    </CardContent>
                  </Card>

                  {/* Datos de Extra */}
                  <FormDatosExtra onReady={this.registrar} />
                </Animated.View>
              )}
            </View>
          </ScrollView>

          {/* Sombra del toolbar */}
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
            backgroundColor="transparent"
            style={{ left: 0, top: 0, right: 0, height: 16, position: "absolute" }}
            pointerEvents="none"
          />
        </View>

        <Animated.View style={[{ height: "100%" }, { maxHeight: this.keyboardHeight }]} />

        {this.renderResultado()}
      </View>
    );
  }

  renderResultado() {
    let username = "";
    if (this.state.datosPersonales != undefined) {
      username = this.state.datosPersonales.cuil;
    }
    if (this.state.datos != undefined && this.state.datos.username != undefined) {
      username = this.state.datos.username;
    }

    let email = "";
    if (this.state.datosExtra != undefined) {
      email = this.state.datosExtra.email;
    }

    return (
      <Resultado
        visible={this.state.mostrarPanelResultado}
        cargando={this.state.registrando}
        username={username}
        onButtonPress={this.onButtonResultadoClick}
        email={email}
      />
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  contenedor_Formulario: {
    flex: 1
  },
  inputIconoError: {
    color: "red",
    fontSize: 32
  },
  scrollViewContent: {
    paddingBottom: 106,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16
  },
  textoTitulo: {
    fontSize: 32,
    marginLeft: 16
  },
  card: {
    borderRadius: 16,
    margin: 8
  }
});

const texto_InfoDatosValidados = "Su datos personales fueron validados correctamente. A continuacion encontrará otros formularios con mas información necesaria para completar su perfil.";

const texto_Titulo = "Nuevo Usuario";
const texto_DialogoCancelarFormulario = "¿Desea cancelar el registro de nuevo usuario?";
const texto_DialogoCancelarFormulario_Si = "Si";
const texto_DialogoCancelarFormulario_No = "No";

const texto_TituloDatosPersonales = "Datos personales";
const texto_TituloDni = "Nº de Documento";
const texto_TituloCuil = "CUIL";
const texto_TituloFechaNacimiento = "Fecha de nacimiento";
const texto_TituloSexo = "Sexo";
const texto_TituloSexoMasculino = "Masculino";
const texto_TituloSexoFemenino = "Femenino";
const texto_TituloDomicilioLegal = "Domicilio legal";
