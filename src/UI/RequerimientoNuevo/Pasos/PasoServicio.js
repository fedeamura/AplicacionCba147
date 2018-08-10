import React from "react";
import { View, Alert, TouchableOpacity, Keyboard } from "react-native";
import { Text, Textarea } from "native-base";
import _ from "lodash";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

//Mis componentes
import App from "@UI/App";
import MiView from "@Utils/MiView";
import CardCirculo from "@Utils/CardCirculo";
import MiItemDetalle from "@Utils/MiItemDetalle";
import MiBoton from "@Utils/MiBoton";
import { toTitleCase, quitarAcentos } from "@Utils/Helpers";

//Rules
import Rules_Motivo from "@Rules/Rules_Motivo";

export default class RequerimientoNuevo_PasoServicio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      servicios: props.servicios,
      motivos: undefined,
      cargando: false,
      error: undefined,
      anims: undefined,
      servicioNombre: undefined,
      motivoNombre: undefined,
      motivoId: undefined,
      descripcion: undefined,
      mostrarServicio: true,
      mostrarMotivo: false,
      mostrarResultado: false,
      height: 0
    };
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    servicios: [],
    onCargando: function () { }
  };

  componentWillUpdate(prevProps, prevState) {
    if (this.state.cargando != prevState.cargando) {
      this.props.onCargando(prevState.cargando);
    }
  }

  seleccionarServicio = (servicio) => {
    this.setState({
      cargando: true
    }, () => {
      Rules_Motivo.get(servicio.id)
        .then((data) => {
          data = _.orderBy(data, "nombre");
          this.setState({
            servicioNombre: servicio.nombre,
            motivos: data,
            mostrarServicio: false
          }, () => {
            setTimeout(() => {
              this.setState({
                cargando: false,
                mostrarMotivo: true
              });
            }, 300);
          });
        })
        .catch((error) => {
          this.setState({
            cargando: false
          });
          Alert.alert("", error || "Error procesando la solicitud");
        });
    });
  }

  cancelarServicio = () => {
    this.setState({
      mostrarMotivo: false
    }, () => {
      setTimeout(() => {
        this.setState({
          servicioNombre: undefined,
          motivos: undefined,
          mostrarServicio: true
        });
      }, 300);
    });
  }

  seleccionarMotivo = (motivo) => {
    this.setState({
      motivoNombre: motivo.nombre,
      motivoId: motivo.id,
      mostrarMotivo: false
    }, () => {
      this.informar();
      setTimeout(() => {
        this.setState({
          mostrarResultado: true
        });
      }, 300);
    });
  }

  seleccionarServicioMotivo = (entity) => {
    this.setState({
      servicioNombre: entity.servicioNombre,
      motivoNombre: entity.motivoNombre,
      motivoId: entity.motivoId,
      mostrarMotivo: false,
      mostrarServicio: false
    }, () => {
      this.informar();

      setTimeout(() => {
        this.setState({
          mostrarResultado: true
        });
      });
    });
  }

  cancelarMotivo = () => {
    this.setState({
      mostrarResultado: false,
      mostrarMotivo: false
    }, () => {
      setTimeout(() => {
        this.setState(
          {
            motivoNombre: undefined,
            servicioNombre: undefined,
            motivoId: undefined,
            mostrarServicio: true
          }, () => {
            this.informar();
          }
        );
      }, 300);
    });
  }

  verTodosLosServicios = () => {
    App.navegar("PickerListado", {
      busqueda: true,
      backgroundColor: initData.backgroundColor,
      placeholderBusqueda: "Buscar servicio...",
      textoEmpty: "Servicio no encontrado",
      cumpleBusqueda: this.cumpleFiltroTodosLosServicios,
      keyExtractor: this.keyExtractorTodosLosServicios,
      data: this.state.servicios,
      title: this.titleTodosLosServicios,
      onPress: this.seleccionarServicio
    });
  }

  keyExtractorTodosLosServicios = (data) => {
    return data.id;
  }

  titleTodosLosServicios = (item) => {
    return toTitleCase(item.nombre);
  }

  cumpleFiltroTodosLosServicios = (item, texto) => {
    let campo = quitarAcentos(item.nombre.trim()).toLowerCase();
    let filtro = quitarAcentos(texto.trim()).toLowerCase();
    return campo.indexOf(filtro) != -1;
  }

  verTodosLosMotivos = () => {
    App.navegar("PickerListado", {
      busqueda: true,
      backgroundColor: initData.backgroundColor,
      placeholderBusqueda: "Buscar motivo...",
      textoEmpty: "Motivo no encontrado",
      keyExtractor: this.keyExtractorTodosLosMotivos,
      cumpleBusqueda: this.cumpleBusquedaTodosLosMotivos,
      data: this.state.motivos,
      title: this.titleTodosLosMotivos,
      onPress: this.seleccionarMotivo
    });
  }

  keyExtractorTodosLosMotivos = (data) => {
    return data.id;
  }

  titleTodosLosMotivos = (item) => {
    return toTitleCase(item.nombre).trim();
  }

  cumpleBusquedaTodosLosMotivos = (item, texto) => {
    let campoNombre = quitarAcentos(item.nombre.trim()).toLowerCase();
    let campoKeywords = quitarAcentos(item.keywords || "")
      .trim()
      .toLowerCase()
      .split(" ");
    let filtro = quitarAcentos(texto.trim()).toLowerCase();

    let cumpleNombre = campoNombre.indexOf(filtro) != -1;
    let cumpleKeyword = false;
    for (let i = 0; i < campoKeywords.length; i++) {
      let cumple = campoKeywords[i].indexOf(filtro) != -1;
      if (cumple) {
        cumpleKeyword = true;
      }
    }

    return cumpleNombre == true || cumpleKeyword == true;
  }

  buscar = () => {
    if (global.motivosParaBusqueda != undefined) {
      this.onMotivosParaBusquedaReady(global.motivosParaBusqueda);
      return;
    }

    this.setState({ cargando: true }, () => {
      Rules_Motivo.getParaBuscar()
        .then((data) => {
          this.setState({
            cargando: false
          });
          this.onMotivosParaBusquedaReady(data);
        });
    });
  }

  onMotivosParaBusquedaReady = (data) => {
    global.motivosParaBusqueda = data;

    data = _.orderBy(data, "motivoNombre");
    App.navegar("PickerListado", {
      busqueda: true,
      backgroundColor: initData.backgroundColor,
      placeholderBusqueda: "Buscar motivo...",
      cumpleBusqueda: this.cumpleBusquedaMotivoBusqueda,
      data: data,
      keyExtractor: this.keyExtractorBusquedaMotivo,
      renderItem: this.renderItemMotivoBusqueda,
      onPress: this.seleccionarServicioMotivo
    });
  }

  cumpleBusquedaMotivoBusqueda = (item, texto) => {
    let campoNombre = quitarAcentos(item.motivoNombre.toLowerCase().trim());
    let campoServicio = quitarAcentos(item.servicioNombre.toLowerCase().trim());
    let campoKeywords = quitarAcentos(item.motivoKeywords || "")
      .trim()
      .toLowerCase()
      .split(" ");

    let filtro = quitarAcentos(texto.toLowerCase().trim());

    let cumpleNombre = campoNombre.indexOf(filtro) != -1;
    let cumpleServicio = campoServicio.indexOf(filtro) != -1;
    let cumpleKeyword = false;
    for (let i = 0; i < campoKeywords.length; i++) {
      let cumple = campoKeywords[i].indexOf(filtro) != -1;
      if (cumple) {
        cumpleKeyword = true;
      }
    }

    return cumpleNombre == true || cumpleKeyword == true || cumpleServicio == true;
  }

  keyExtractorBusquedaMotivo = (data) => {
    return data.motivoId;
  }

  renderItemMotivoBusqueda = (item) => {
    return (
      <View key={item.motivoId} style={{ width: "100%" }}>
        <Text style={{ flex: 1, alignSelf: "flex-start", fontSize: 20 }}>{toTitleCase(item.motivoNombre).trim()}</Text>
        <Text style={{ flex: 1, alignSelf: "flex-start", fontSize: 16, opacity: 0.9 }}>
          Servicio: {toTitleCase(item.servicioNombre).trim()}
        </Text>
      </View>
    );
  }

  informar = () => {
    if (this.props.onMotivo == undefined) return;

    let descripcion = this.state.descripcion;
    if (descripcion != undefined) {
      descripcion = descripcion.trim();
    }

    this.props.onMotivo({
      servicioNombre: this.state.servicioNombre,
      motivoNombre: this.state.motivoNombre,
      motivoId: this.state.motivoId,
      descripcion: descripcion
    });
  }

  informarReady = () => {
    if (this.props.onReady == undefined) return;
    this.props.onReady({
      servicioNombre: this.state.servicioNombre,
      motivoNombre: this.state.motivoNombre,
      motivoId: this.state.motivoId,
      descripcion: this.state.descripcion
    });
  }

  onLayout = (event) => {
    var { width, height } = event.nativeEvent.layout;
    this.setState({ height: height, width: width - 32 });
  }

  onServicioPrincipalPress = (servicio) => {
    this.seleccionarServicio(servicio);
  }

  onDescripcionChange = (val) => {
    this.setState({ descripcion: val }, () => {
      this.informar();
    });
  }

  onBotonSiguientePress = () => {
    if (this.state.descripcion == undefined || this.state.descripcion.length < 20) {
      Alert.alert('', 'Ingrese una descripción de al menos 20 caracteres');
      return;
    }

    this.informarReady();
  }


  render() {
    if (this.state.servicios == undefined) return null;

    return (
      <View style={{ minHeight: 100, opacity: this.state.height == 0 ? 0 : 1 }}>
        {this.renderViewServiciosPrincipales()}
        {this.renderViewSeleccionarMotivo()}
        {this.renderViewMotivoSeleccionado()}
      </View>
    );
  }

  renderViewServiciosPrincipales() {
    const wCirculo = ((this.state.width || 0) * 0.8) / 2;
    const iconoFontSize = 24;
    const textoFontSize = 14;
    const cardColorFondo = "rgba(230,230,230,1)";
    const iconoColor = "white";

    const serviciosPrincipales = [];
    for (let i = 0; i < this.state.servicios.length; i++) {
      let servicio = this.state.servicios[i];
      if (servicio.principal == true && serviciosPrincipales.length <= 5) {
        serviciosPrincipales.push(servicio);
      }
    }

    //Creo las view principales
    const viewPrincipales = serviciosPrincipales.map(servicio => {
      let backgroundColor = servicio.color || cardColorFondo;
      let iconColor = iconoColor;

      return (
        <View style={{ width: wCirculo }} key={servicio.id}>
          <CardCirculo
            key={servicio.id}
            data={servicio}
            onPress={this.onServicioPrincipalPress}
            icono={servicio.icono || "flash"}
            urlIcono={servicio.urlIcono || ""}
            texto={toTitleCase(servicio.nombre || "Sin datos")}
            textoLines={2}
            iconoStyle={{ fontSize: iconoFontSize, color: iconColor }}
            cardColor={backgroundColor}
            cardStyle={{ width: wCirculo * 0.6, height: wCirculo * 0.6, marginBottom: 8, borderRadius: 200 }}
            textoStyle={{ fontSize: textoFontSize, maxWidth: wCirculo * 0.8, minWidth: wCirculo * 0.8 }}
          />
        </View>
      );
    });

    return (
      <MiView visible={this.state.mostrarServicio}>
        <View style={{ padding: 16, paddingTop: 0 }} onLayout={this.onLayout}>
          {/* Buscar */}
          {this.renderBotonBuscar()}

          <View style={{ height: 16 }} />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              marginBottom: 16,
              justifyContent: "center",
              flexWrap: "wrap"
            }}
          >
            {viewPrincipales}
          </View>

          {/* Boton ver todas  */}
          <MiBoton
            centro
            verde
            sombra
            rounded
            small
            onPress={this.verTodosLosServicios}
            texto={texto_BotonTodosLosServicios} />
        </View>
      </MiView>
    );
  }

  renderBotonBuscar() {
    let w = 48;
    const initData = global.initData;
    return (
      // <TouchableOpacity>
      //   <View style={{
      //     display: 'flex',
      //     justifyContent: 'center',
      //     alignItems: 'center',
      //     alignSelf: 'flex-end',
      //     padding: 8, borderRadius: w, minWidth: w, minHeight: w, maxWidth: w, maxHeight: w
      //   }}>
      //     <Icon name="magnify" style={{ fontSize: 20, color: color }} />

      //   </View>
      // </TouchableOpacity>

      <MiBoton
        padding={16}
        transparent
        texto={texto_BotonBuscar}
        icono="magnify"
        iconoDerecha
        small
        onPress={this.buscar}
        derecha />
    );
  }

  renderViewSeleccionarMotivo() {
    const nombreServicio = this.state.servicioNombre == undefined ? "" : toTitleCase(this.state.servicioNombre);
    // const motivos = [];
    // if (this.state.motivos != undefined) {
    //   for (var i = 0; i < this.state.motivos.length; i++) {
    //     let motivo = this.state.motivos[i];
    //     if (motivo && motivo.principal == true) {
    //       motivos.push(motivo);
    //     }
    //   }
    // }

    return (
      <MiView visible={this.state.mostrarMotivo}>
        <View style={{ padding: 16 }}>
          {/* Buscar */}
          {/* {this.renderBotonBuscar()} */}

          {/* Servicio seleccionada */}
          <View style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <MiItemDetalle titulo={texto_ServicioSeleccionado} subtitulo={nombreServicio} />

            <MiBoton
              link
              onPress={this.cancelarServicio}
              texto={texto_BotonCancelarServicio}
              rojo />
          </View>

          {/* Listado de motivos principales */}
          {/* <View style={{ height: 32 }} />
          <Text style={{ fontWeight: "bold" }}>{texto_SeleccioneMotivo}</Text>
          <View style={{ height: 8 }} />
          {motivos.map(item => {
            return (
              <ListItem onPress={this.seleccionarMotivo.bind(this, item)} style={{ marginLeft: 0 }}>
                <Text>{toTitleCase(item.nombre).trim()}</Text>
              </ListItem>
            );
          })} */}
          <View style={{ height: 32 }} />

          {/* Boton ver todos los motivos */}
          <MiBoton
            rounded
            small
            sombra
            centro
            verde
            onPress={this.verTodosLosMotivos}
            texto={texto_BotonTodosLosMotivos}
          />
        </View>
      </MiView>
    );
  }

  ocultarTeclado = () => {
    Keyboard.dismiss();
  }

  renderViewMotivoSeleccionado() {

    const initData = global.initData;

    const nombreServicio = toTitleCase(this.state.servicioNombre || "Sin datos").trim();
    const nombreMotivo = toTitleCase(this.state.motivoNombre || "Sin datos").trim();

    return (
      <MiView padding={false} visible={this.state.mostrarResultado}>
        <View style={{ display: "flex", flexDirection: "column", minHeight: 350 }}>
          <View style={{ padding: 16, flex: 1 }}>
            <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
              <View style={{ flex: 1 }}>
                <MiItemDetalle titulo={texto_ServicioSeleccionado} subtitulo={nombreServicio} />
                <View style={{ height: 8 }} />

                <MiItemDetalle titulo={texto_MotivoSeleccionado} subtitulo={nombreMotivo} />
                <View style={{ height: 8 }} />
              </View>
            </View>

            <MiBoton
              link
              small
              onPress={this.cancelarMotivo}
              texto={texto_BotonCancelarSeleccion}
              rojo />



          </View>

          <Text style={{ fontWeight: 'bold', marginLeft: 16 }}>Descripción</Text>
          <View style={{ height: 8 }} />
          <Textarea
            onChangeText={this.onDescripcionChange}
            style={{ marginLeft: 4 }}
            value={this.state.descripcion}
            rowSpan={3}
            onSubmitEditing={this.ocultarTeclado}
            placeholderTextColor="rgba(150,150,150,1)"
            placeholder={texto_Hint}
          />

          <View style={{ height: 16 }} />
          <View style={{ height: 1, width: "100%", backgroundColor: "rgba(0,0,0,0.1)" }} />

          {/* Boton siguiente  */}
          <MiBoton
            verde
            sombra
            small
            rounded
            color={this.state.descripcion == undefined || this.state.descripcion.length < 20 ? 'rgba(130,130,130,1)' : initData.colorVerde}
            colorTexto='white'
            onPress={this.onBotonSiguientePress}
            texto={texto_botonSiguiente}
            padding={16}
            derecha />
          {/* <View style={{ padding: 16 }}>
            <Button
              small
              onPress={this.informarReady}
              rounded
              style={{
                alignSelf: "flex-end",
                backgroundColor: initData.colorExito
              }}
            >
              <Text
                style={{
                  color: "white"
                }}
              >
                {texto_botonSiguiente}
              </Text>
            </Button>
          </View> */}
        </View>
      </MiView>
    );
  }
}

const colorCancelar = "#E53935";
const texto_BotonTodosLosServicios = "Ver más servicios";
const texto_BotonBuscar = "Buscar por motivo";
const texto_BotonCancelarServicio = "Cancelar servicio";
const texto_SeleccioneMotivo = "Ahora seleccione un motivo:";
const texto_ServicioSeleccionado = "Servicio seleccionado";
const texto_BotonTodosLosMotivos = "Seleccionar motivo";
const texto_MotivoSeleccionado = "Motivo seleccionado";
const texto_BotonCancelarSeleccion = "Cancelar selección";
const texto_botonSiguiente = "Siguiente";

const texto_Hint = "Indique de la forma más detallada posible toda la información asociada al requerimiento...";
