import { Picker, Spinner } from "native-base";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  LayoutAnimation,
  UIManager,
  Text,
  Alert,
  TextInput
} from "react-native";
import {
  Card,
  CardContent,
  Headline,
  Title
} from "react-native-paper";

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mios
import App from "@UI/App";
import AppTheme from "@UI/AppTheme";
import IndicadorCargando from "@Utils/IndicadorCargando";
import MiPicker from "@Utils/MiPicker";

//Rules
import Rules_Servicio from "Cordoba/src/Rules/Rules_Servicio";
import Rules_Motivo from "Cordoba/src/Rules/Rules_Motivo";

export default class Paso1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      idServicio: -1,
      idMotivo: -1,
      completado: App.Variables.TodoCompletadoEnNuevo || false,
      servicios: [],
      motivos: [],
      cargandoServicios: false,
      cargandoMotivos: false,
      errorConsultandoServicios: false,
      errorConsultandoMotivos: false,
      descripcion: undefined
    };

    props.onCompletadoChange(this.state.completado);
  }

  componentDidMount() {
    setTimeout(() => {
      this.buscarServicios();
    }, 500);
  }

  isCompletado() {
    let tieneServicio = this.state.idServicio !== -1;
    let tieneMotivo = this.state.idMotivo !== -1;
    let tieneDescripcion = this.state.descripcion != undefined && this.state.descripcion.trim() != "";
    let completado = tieneServicio && tieneMotivo && tieneDescripcion;
    return completado;
  }

  handleCompletado() {
    this.setState(
      {
        completado: this.isCompletado()
      },
      () => {
        this.props.onCompletadoChange(this.state.completado);
      }
    );
  }

  componentWillReceiveProps(nextProps) {

  }

  buscarServicios() {
    App.animar();
    this.setState({
      cargandoServicios: true
    }, () => {
      Rules_Servicio.get(
        data => {
          if (data == undefined) return;
          App.animar();
          this.setState({
            cargandoServicios: false,
            servicios: data.map((element) => {
              element.Nombre = this.toTitleCase(element.Nombre);
              return element;
            })
          });
        },
        () => {
          App.animar();
          this.setState({
            cargandoServicios: false,
            servicios: undefined,
            errorConsultandoServicios: true
          });

          Alert.alert('Error consultando los servicios. Por favor intente nuevamente');
        }
      );
    });
  }

  buscarMotivos() {
    App.animar();
    this.setState({
      cargandoMotivos: true
    }, () => {
      Rules_Motivo.get(
        this.state.idServicio,
        data => {
          App.animar();
          this.setState({
            cargandoMotivos: false,
            motivos: data.map((element) => {
              element.Nombre = this.toTitleCase(element.Nombre);
              return element;
            })
          });
        },
        error => {
          App.animar();
          this.setState({
            cargandoMotivos: false,
            motivos: undefined,
            errorConsultandoServicios: true
          });

          Alert.alert('Error consultando los motivos. Por favor intente nuevamente');
        }
      );
    });
  }

  toTitleCase(str) {
    str = str.toLowerCase();
    return str.replace(/(?:^|\s)\w/g, function (match) {
      return match.toUpperCase();
    });
  }

  onPressServicio() {
    if (this.state.cargandoServicios) {
      Alert.alert("Cargando servicios. Por favor espere");
      return;
    }

    if (
      this.state.servicios === undefined ||
      this.state.servicios.length === 0
    ) {
      Alert.alert("No hay ningun servicio disponible");
      return;
    }

    const { navigate } = App.getNavigator();
    navigate("MiPicker", {
      busqueda: true,
      cumpleBusqueda: (element, filtro) => {
        return element.Nombre.toLowerCase().indexOf(filtro.toLowerCase()) != -1;
      },
      placeholderBusqueda: 'Buscar...',
      data: this.state.servicios,
      keyExtractor: item => {
        return item.Id.toString();
      },
      title: item => {
        return item.Nombre;
      },
      onPress: item => {
        App.animar();
        this.setState({
          idServicio: item.Id,
          cargandoMotivos: false,
          motivos: [],
          idMotivo: -1
        }, () => {
          this.buscarMotivos();
          this.handleCompletado();
        });
      }
    });
  }

  onPressMotivo() {
    if (this.state.cargandoMotivos) {
      Alert.alert("Cargando motivos. Por favor espere");
      return;
    }

    if (this.state.idServicio === -1) {
      Alert.alert("Debe seleccionar el servicio");
      return;
    }

    if (
      this.state.motivos === undefined ||
      this.state.motivos.length === 0
    ) {
      Alert.alert("No hay ningun motivo disponible");
      return;
    }

    const { navigate } = App.getNavigator();
    navigate("MiPicker", {
      busqueda: true,
      cumpleBusqueda: (element, filtro) => {
        return element.Nombre.toLowerCase().indexOf(filtro.toLowerCase()) != -1;
      },
      placeholderBusqueda: 'Buscar...',
      data: this.state.motivos,
      keyExtractor: item => {
        return item.Id.toString();
      },
      title: item => {
        return item.Nombre;
      },
      onPress: item => {
        App.animar();
        this.setState({
          idMotivo: item.Id
        }, () => {
          this.handleCompletado();
        });
      }
    });
  }

  onChangeDescripcion(text) {
    App.animar();
    this.setState({ descripcion: text }, () => {
      this.handleCompletado();
    });
  }


  render() {
    let itemsServicios = [];
    itemsServicios.push(
      <Picker.Item key={"-1"} label="Seleccione..." value={-1} />
    );

    let itemsMotivos = [];
    itemsMotivos.push(
      <Picker.Item key={"-1"} label="Seleccione..." value={-1} />
    );

    if (!this.state.cargandoServicios && this.state.servicios != undefined) {
      let items = this.state.servicios.map(item => {
        return (
          <Picker.Item
            key={item.Id.toString()}
            label={item.Nombre}
            value={item.Id}
          />
        );
      });

      itemsServicios = itemsServicios.concat(items);
    }

    if (!this.state.cargandoMotivos) {
      let items = this.state.motivos.map(item => {
        return (
          <Picker.Item
            key={item.Id.toString()}
            label={item.Nombre}
            value={item.Id}
          />
        );
      });

      itemsMotivos = itemsMotivos.concat(items);
    }

    let textoServicio;
    if (this.state.idServicio !== -1) {
      textoServicio = _.find(this.state.servicios, { Id: this.state.idServicio });
    } else {
      if (this.state.errorConsultandoServicios) {
        textoServicio = 'Error obteniendo los servisos. Click para reintentar';
      } else {
        textoServicio = 'Click para seleccionar';
      }
    }

    let motivo;
    if (this.state.idMotivo !== -1) {
      motivo = _.find(this.state.motivos, { Id: this.state.idMotivo });
    }

    let conServicio = this.state.idServicio !== -1;
    let conMotivo = this.state.idMotivo !== -1;
    let conDescripcion = this.state.descripcion !== undefined && this.state.descripcion.trim() !== "";

    return (
      <View style={styles.contenedor}>
        <Card
          style={[
            {
              borderBottomColor: conServicio ? AppTheme.colorAccent : "transparent",
              borderBottomWidth: conServicio ? 4 : 0
            }
          ]}
          onPress={() => {
            if (this.state.errorConsultandoServicios) {
              this.buscarServicios();
            } else {
              this.onPressServicio();
            }
          }}
        >
          <CardContent>
            <View style={styles.contenedorCard}>
              <View style={styles.contenidoCard}>
                <Title>Servicio</Title>
                <Text>
                  {textoServicio}
                </Text>
              </View>
              {this.state.cargandoServicios && (
                <Spinner color="black" style={styles.spinner} />
              )}
              {this.state.idServicio !== -1 && (
                <Icon name="check" style={styles.check} />
              )}
            </View>
          </CardContent>
        </Card>

        <Card
          style={[
            {
              borderBottomColor: conMotivo ? AppTheme.colorAccent : "transparent",
              borderBottomWidth: conMotivo ? 4 : 0
            }
          ]}
          onPress={() => {
            if (this.state.errorConsultandoMotivos) {
              this.buscarMotivos();
            } else {
              this.onPressMotivo();
            }
          }}
        >
          <CardContent>
            <View style={styles.contenedorCard}>
              <View style={styles.contenidoCard}>
                <Title>Motivo</Title>
                <Text>
                  {motivo !== undefined
                    ? motivo.Nombre
                    : "Click para seleccionar"}
                </Text>
              </View>
              {this.state.cargandoMotivos && (
                <Spinner color="black" style={styles.spinner} />
              )}

              {this.state.idMotivo !== -1 && (
                <Icon name="check" style={styles.check} />
              )}
            </View>
          </CardContent>
        </Card>
        <Card
          style={[
            {
              borderBottomColor: AppTheme.colorAccent,
              borderBottomWidth: conDescripcion ? 4 : 0
            }
          ]}
        >
          <CardContent style={styles.cardContent}>
            <Title>Descripcion del requerimiento</Title>
            <TextInput
              label="Descripcion"
              value={this.state.descripcion}
              multiline={true}
              underlineColor="transparent"
              placeholder="Ingrese una descripción de su requerimiento"
              onChangeText={text => { this.onChangeDescripcion(text); }}
            />
          </CardContent>
        </Card>
      </View>
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
  contenedorCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  contenidoCard: {
    display: "flex",
    flex: 1,
    flexDirection: "column"
  },
  spinner: {
    width: 32,
    height: 32
  },
  check: {
    width: 32,
    height: 32,
    fontSize: 32,
    color: "green"
  }
});
