import { Spinner } from "native-base";
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  LayoutAnimation,
  UIManager,
  Text,
  Alert,
  ScrollView,
  TextInput,
  Image
} from "react-native";
import {
  Card,
  CardContent,
  Headline,
  Title,
  Button
} from "react-native-paper";

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mios
import App from "@UI/App";

//Rules
import Rules_Servicio from "Cordoba/src/Rules/Rules_Servicio";
import Rules_Motivo from "Cordoba/src/Rules/Rules_Motivo";
import Rules_Domicilio from "Cordoba/src/Rules/Rules_Domicilio";

export default class Paso2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitud: undefined,
      longitud: undefined,
      completado: App.Variables.TodoCompletadoEnNuevo || false,
      buscandoDomicilio: false,
      domicilio: undefined,
      descripcion: undefined,
      descripcionSugerida: undefined
    };

    props.onCompletadoChange(this.state.completado);
    this.keyStaticMap = "AIzaSyC9ouT0yZHzPVxoD3FmfAOnLaM4mfnHrr0";
  }

  componentDidMount() { }

  isCompletado() {
    return this.state.domicilio != undefined && this.state.descripcion != undefined && this.state.descripcion.trim() != "";
  }

  handleCompletado() {
    App.animar();
    this.setState(
      {
        completado: this.isCompletado()
      },
      () => {
        this.props.onCompletadoChange(this.state.completado);
      }
    );
  }

  buscarDomicilio(marcador, descripcionSugerida) {
    App.animar();
    this.setState(
      {
        buscandoDomicilio: true
      },
      () => {
        Rules_Domicilio.validarDomicilio(marcador.latitude, marcador.longitude,
          (domicilio) => {
            App.animar();
            this.setState({
              latitud: marcador.latitude,
              longitud: marcador.longitude,
              descripcionSugerida: descripcionSugerida,
              descripcion: descripcionSugerida != undefined && descripcionSugerida.trim() != "" ? descripcionSugerida : undefined,
              buscandoDomicilio: false,
              domicilio: domicilio
            }, () => {
              this.handleCompletado();
            });

            if (descripcionSugerida == undefined || descripcionSugerida.trim() == "") {
              Alert.alert("", "Por favor ingrese una descripcion de su domicilio");
            }
          },
          (error) => {
            App.animar();
            this.setState({
              buscandoDomicilio: false,
              latitud: undefined,
              longitud: undefined,
              domicilio: undefined,
              descripcion: undefined,
              descripcionSugerida: undefined
            }, () => {
              this.handleCompletado();
              Alert.alert(error);
            });
          });
      }
    );
  }

  cancelarDomicilio() {
    App.animar();
    this.setState({
      latitud: undefined,
      longitud: undefined,
      cargandoDomicilio: false,
      domicilio: undefined,
      descripcion: undefined
    }, () => {
      this.handleCompletado();
    });
  }

  onChangeDescripcion(text) {
    App.animar();
    this.setState({ descripcion: text }, () => {
      this.handleCompletado();
    })
  }

  render() {
    let urlMapa = "";
    if (this.state.latitud != undefined && this.state.longitud != undefined) {
      urlMapa = "https://maps.googleapis.com/maps/api/staticmap?&zoom=18&size=600x600&maptype=roadmap&markers=color:red%7Clabel:S%7C" + this.state.latitud + "," + this.state.longitud + "&key=" + this.keyStaticMap;
    }
    let conDescripcion = this.state.descripcion !== undefined && this.state.descripcion.trim() !== "";
    let conDomicilio = this.state.domicilio != undefined;

    return (
      <View style={styles.contenedor}>
        <ScrollView>
          {(this.state.domicilio != undefined && (this.state.descripcionSugerida == undefined || this.state.descripcionSugerida.trim() == "")) && (
            <Card
              style={[
                {
                  borderBottomColor: AppTheme.colorAccent,
                  borderBottomWidth: conDescripcion ? 4 : 0
                }
              ]}
            >
              <CardContent>
                <Title>Descripción de la ubicacion</Title>

                <TextInput
                  style={styles.input}
                  label="Descripcion"
                  ref={(ref) => { this.inputDescripcion = ref }}
                  value={this.state.descripcion}
                  multiline={true}
                  underlineColor="transparent"
                  placeholder="Describa la ubicación"
                  onChangeText={text => { this.onChangeDescripcion(text) }}
                />
              </CardContent>
            </Card>
          )}

          <Card
            style={[
              {
                borderBottomColor: AppTheme.colorAccent,
                borderBottomWidth: conDomicilio ? 4 : 0
              }
            ]}
            onPress={() => {
              if (this.state.domicilio != undefined) return;
              const { navigate } = App.getNavigator();
              navigate("MiPickerUbicacion", {
                onUbicacionSeleccionada: (marcador) => {
                  this.buscarDomicilio(marcador);
                }
              });
            }}
          >
            <CardContent style={styles.cardContent}>
              <View style={styles.contenedorEncabezado}>
                <Title>{this.state.latitud != undefined && this.state.longitud != undefined ? "Ubicación seleccionada" : "Ubicación"}</Title>
              </View>

              {this.state.buscandoDomicilio ? (
                <Spinner color="black" style={styles.spinner} />
              ) : (
                  <View>
                    {this.state.domicilio == undefined ? (
                      <View>
                        <Text>Haga click aquí para seleccionar</Text>
                      </View>
                    ) : (
                        <View>

                          <Image
                            style={styles.imagenMapa}
                            source={{ uri: urlMapa }}
                          />

                          {this.state.domicilio != undefined && (
                            <View>

                              <View style={styles.contenedorUbicacion}>

                                <View style={styles.contenedorTextosUbicacion}>
                                  <View style={styles.contenedorBarrio}>
                                    <Text style={styles.textoSubtitulo}>Barrio</Text>
                                    <Text>{this.state.domicilio.Barrio.Nombre}</Text>
                                  </View>
                                  <View style={styles.contenedorCpc}>
                                    <Text style={styles.textoSubtitulo}>CPC</Text>
                                    <Text>Nº {this.state.domicilio.Cpc.Numero} - {this.state.domicilio.Cpc.Nombre}</Text>
                                  </View>
                                </View>
                              </View>

                              <Button raised style={styles.btnCancelar} icon="clear" onPress={() => { this.cancelarDomicilio() }}>Cancelar domicilio</Button>
                            </View>

                          )}
                        </View>

                      )}
                  </View>
                )}
            </CardContent>
          </Card>

        </ScrollView>

      </View >
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: "transparent",
    height: "100%",
    width: "100%",
    padding: 16
  },
  map: {
    width: 100,
    height: 100
  },
  imagenMapa: {
    width: '100%',
    height: 200,
    marginTop: 16,
    marginBottom: 16
  },
  contenedorUbicacion: {
    display: 'flex',
    flexDirection: 'row'
  },
  contenedorTextosUbicacion: {
    display: 'flex',
    flex: 1
  },
  btnCancelar: {
    marginTop: 32,
    alignSelf: 'center'
  },
  textoSubtitulo: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 16
  }
});