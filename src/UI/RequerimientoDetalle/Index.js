import React from "react";
import { View, Animated, StyleSheet, ScrollView, Keyboard, Alert } from "react-native";
import { Text, Spinner } from "native-base";
import WebImage from "react-native-web-image";
import openMap from "react-native-open-maps";

//Mis componentes
import App from "@UI/App";
import MiStatusBar from "@Utils/MiStatusBar";
import MiToolbar from "@Utils/MiToolbar";
import MiToolbarSombra from "@Utils/MiToolbarSombra";
import MiCardDetalle from "@Utils/MiCardDetalle";
import MiItemDetalle from "@Utils/MiItemDetalle";
import MiGaleria from "@Utils/MiGaleria";
import ItemFoto from "@UI/RequerimientoDetalle/ItemFoto";
import MiBoton from "@Utils/MiBoton";

import { toTitleCase, stringDateToString } from "@Utils/Helpers";

//Rules
import Rules_Requerimiento from "@Rules/Rules_Requerimiento";

export default class RequerimientoDetalle extends React.Component {
  static navigationOptions = {
    title: "Detalle de requerimiento",
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;

    this.state = {
      id: params.id,
      cargando: true,
      datos: undefined,
      error: undefined
    };

    this.animContenido = new Animated.Value(0);
    this.keyboardHeight = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener("keyboardWillShow", this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener("keyboardWillHide", this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  componentDidMount() {
    this.buscarDatos();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.cargando != this.state.cargando) {
      Animated.timing(this.animContenido, { toValue: nextState.cargando == true ? 0 : 1, duration: 300 }).start();
    }
  }

  buscarDatos = () => {
    this.setState({
      cargando: true
    }, () => {
      Rules_Requerimiento.getDetalle(this.state.id)
        .then((data) => {
          this.setState({
            cargando: false,
            datos: data
          });
        })
        .catch((error) => {
          this.setState({
            cargando: false,
            datos: undefined,
            error: error
          });
        });
    });
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

  onFotoPress = (identificador, index) => {
    this.setState({
      visorFotosVisible: true,
      indexFotoVisible: index
    });
  }

  cerrarVisorFotos = () => {
    this.setState({
      visorFotosVisible: false
    });
  }

  abrirMapa = () => {
    try {
      if (this.state.datos == undefined) return;
      if (this.state.datos.domicilioLatitud == undefined || this.state.datos.domicilioLongitud == undefined) return;
      let lat = parseFloat(this.state.datos.domicilioLatitud.replace(",", "."));
      let lng = parseFloat(this.state.datos.domicilioLongitud.replace(",", "."));
      openMap({ latitude: lat, longitude: lng, query: "Ubicación de su requerimiento" });
    } catch (ex) {

    }
  }

  onBotonCancelarPress = () => {
    Alert.alert("", texto_Cancelar, [
      {
        text: "Cancelar",
        onPress: () => { }
      },
      {
        text: "Si",
        onPress: this.cancelarRequerimiento
      }
    ]);
  }

  cancelarRequerimiento = () => {
    this.setState({
      cargando: true
    }, () => {
      Rules_Requerimiento.cancelar(this.state.id)
        .then(() => {
          App.goBack();
          const { params } = this.props.navigation.state;
          if (params != undefined && "callback" in params && params.callback != undefined) {
            params.callback();
          }
        })
        .catch((error) => {
          this.setState({
            cargando: false
          });
          Alert.alert("", error || "Error procesando la solicitud");
        });
    });
  }

  goBack = () => {
    App.goBack();
  }

  onBotonEnviarComprobantePress = () => {
    this.setState({ cargando: true }, () => {
      Rules_Requerimiento.enviarComprobante(this.state.id)
        .then(() => {
          this.setState({ cargando: false });
          Alert.alert('', 'Se ha enviado a su e-mail el comprobante del requerimiento');
        })
        .catch((error) => {
          this.setState({ cargando: false });
          Alert.alert('', error || 'Error procesando la solicitud');
        })

    });
  }

  render() {
    const initData = global.initData;

    return (
      <View style={style.contenedor}>
        <MiStatusBar />

        <MiToolbar
          titulo={texto_Titulo}
          onBackPress={this.goBack}
        />

        <View style={[style.contenido, { backgroundColor: initData.backgroundColor }]}>
          {/* Contenido */}
          {this.renderContent()}
          {/* Cargando */}
          {this.renderCargando()}
          {/* Sombra del toolbar */}
          <MiToolbarSombra />
        </View>

        {/* Keyboard */}
        <Animated.View style={[{ height: "100%" }, { maxHeight: this.keyboardHeight }]} />

        {/* Galeria de fotos */}
        {this.renderVisorFotos()}
      </View>
    );
  }

  renderContent() {
    const initData = global.initData;
    const urlMapa =
      "https://maps.googleapis.com/maps/api/staticmap?center=cordoba+argentina&zoom=13&scale=2&size=600x600&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7Ccordoba+argentina";

    let numero = "Sin datos";
    let servicioNombre = "Sin datos";
    let motivoNombre = "Sin datos";
    let descripcion = "Sin datos";
    let fechaAlta = "Sin datos";

    let estadoColor = "";
    let estadoNombre = "Sin datos";
    let estadoFecha = "Sin datos";
    let estadoObservaciones = "Sin datos";

    let domicilioDireccion = "Sin datos";
    let domicilioObservaciones = "Sin datos";
    let domicilioCpc = "Sin datos";
    let domicilioBarrio = "Sin datos";

    let infoOrganicaSecretaria = "Sin datos";
    let infoOrganicaDireccion = "Sin datos";
    let infoOrganicaArea = "Sin datos";
    let infoOrganicaDomilicio = "Sin datos";

    let mostrarBotonCancelar = false;

    if (this.state.datos != undefined) {
      numero = this.state.datos.numero + "/" + this.state.datos.año;
      servicioNombre = toTitleCase(this.state.datos.servicioNombre);
      motivoNombre = toTitleCase(this.state.datos.motivoNombre);
      descripcion = this.state.datos.descripcion;
      // fechaAlta = this.state.datos.fechaAlta;

      estadoColor = "#" + (this.state.datos.estadoPublicoColor || this.state.datos.estadoColor);
      estadoNombre = toTitleCase(this.state.datos.estadoPublicoNombre || this.state.datos.estadoNombre);
      estadoFecha = stringDateToString(this.state.datos.estadoFecha);
      estadoObservaciones = this.state.datos.estadoObservaciones;

      domicilioDireccion = toTitleCase(this.state.datos.domicilioDireccion);
      domicilioObservaciones = this.state.datos.domicilioObservaciones;
      domicilioCpc =
        "Nº " + this.state.datos.domicilioCpcNumero + " · " + toTitleCase(this.state.datos.domicilioCpcNombre);
      domicilioBarrio = toTitleCase(this.state.datos.domicilioBarrioNombre);

      infoOrganicaSecretaria = toTitleCase(this.state.datos.informacionOrganicaSecretariaNombre);
      infoOrganicaDireccion = toTitleCase(this.state.datos.informacionOrganicaDireccionNombre);
      infoOrganicaArea = toTitleCase(this.state.datos.informacionOrganicaAreaNombre);
      infoOrganicaDomilicio = this.state.datos.informacionOrganicaDomicilio;

      mostrarBotonCancelar = this.state.datos.estadoKeyValue == 1;
    }

    return (
      <ScrollView contentContainerStyle={{}}>
        <View style={{ padding: 16 }}>
          <Animated.View style={{ opacity: this.animContenido }}>
            {/* Basicos */}
            <MiCardDetalle titulo={texto_TituloDatos}>
              <Text style={{ fontSize: 28, marginBottom: 16 }}>Nº {numero}</Text>
              <MiItemDetalle titulo={texto_Servicio} subtitulo={servicioNombre} />
              <View style={{ height: 8 }} />
              <MiItemDetalle titulo={texto_Motivo} subtitulo={motivoNombre} />
              <View style={{ height: 8 }} />
              <MiItemDetalle titulo={texto_Descripcion} subtitulo={descripcion} />
              {/* <View style={{ height: 8 }} />
              <MiItemDetalle titulo={texto_FechaAlta} subtitulo={fechaAlta} /> */}
            </MiCardDetalle>

            {/* Estado */}
            <MiCardDetalle titulo={texto_Estado}>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 16,
                    shadowColor: estadoColor,
                    shadowOpacity: 0.4,
                    shadowRadius: 5,
                    shadowOffset: { width: 0, height: 4 },
                    backgroundColor: estadoColor,
                    marginRight: 8
                  }}
                />
                <Text style={{ fontSize: 20 }}>{estadoNombre}</Text>
              </View>
              <View style={{ height: 16 }} />
              <MiItemDetalle titulo={texto_FechaEstado} subtitulo={estadoFecha} />
              <View style={{ height: 8 }} />
              <MiItemDetalle titulo={texto_EstadoObservaciones} subtitulo={estadoObservaciones} />

              {/* <View style={{ height: 16 }} />
              <MiItemDetalle titulo="Motivo" subtitulo="Motivo del cambio de estado al actual" /> */}
            </MiCardDetalle>

            {/* Ubicacion */}
            <MiCardDetalle
              titulo={texto_TituloUbicacion}
              botones={[
                {
                  texto: texto_BotonAbrirMapa,
                  onPress: this.abrirMapa
                }
              ]}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <MiItemDetalle titulo={texto_Direccion} subtitulo={domicilioDireccion} />
                  <View style={{ height: 16 }} />
                  <MiItemDetalle titulo={texto_Observaciones} subtitulo={domicilioObservaciones} />
                  <View style={{ height: 16 }} />
                  <MiItemDetalle titulo={texto_Cpc} subtitulo={domicilioCpc} />
                  <View style={{ height: 16 }} />
                  <MiItemDetalle titulo={texto_Barrio} subtitulo={domicilioBarrio} />
                </View>
                <WebImage
                  resizeMode="cover"
                  style={{ width: 104, height: 104, borderRadius: 16 }}
                  source={{ uri: urlMapa }}
                />
              </View>
            </MiCardDetalle>

            {/* Imagenes */}
            {this.renderFotos()}

            {/* Informacion organica */}
            <MiCardDetalle titulo={texto_TituloInfoOrganica}>
              <MiItemDetalle titulo={texto_InfoOrganicaSecretaria} subtitulo={infoOrganicaSecretaria} />
              <View style={{ height: 16 }} />
              <MiItemDetalle titulo={texto_InfoOrganicaDireccion} subtitulo={infoOrganicaDireccion} />
              <View style={{ height: 16 }} />
              <MiItemDetalle titulo={texto_InfoOrganicaArea} subtitulo={infoOrganicaArea} />
              <View style={{ height: 16 }} />
              <MiItemDetalle titulo={texto_InfoOrganicaDomicilio} subtitulo={infoOrganicaDomilicio} />
            </MiCardDetalle>

            <View style={{ height: 32 }} />

            <MiBoton
              padding={16}
              link
              centro
              verde
              small
              texto={texto_BotonEnviarComprobante}
              onPress={this.onBotonEnviarComprobantePress}
            />

            {mostrarBotonCancelar && (
              <MiBoton
                padding={16}
                link
                centro
                rojo
                small
                texto={texto_BotonCancelar}
                onPress={this.onBotonCancelarPress}
              />
            )}
          </Animated.View>
        </View>
      </ScrollView>
    );
  }

  renderCargando() {
    const initData = global.initData;
    return (
      <Animated.View
        style={{
          position: "absolute",
          margin: 16,
          left: 0,
          right: 0,
          top: 0,
          opacity: this.animContenido.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          })
        }}
      >
        <Spinner color={initData.colorVerde} />
      </Animated.View>
    );
  }

  renderFotos() {

    let fotos = [];
    if (this.state.datos != undefined && this.state.datos.fotos != undefined) {
      fotos = this.state.datos.fotos;
    }

    if (fotos == undefined || fotos.length == 0) return null;

    return (
      <MiCardDetalle titulo={texto_TituloImagenes} padding={false}>
        <ScrollView horizontal={true}>
          <View style={{ display: "flex", flexDirection: "row", padding: 8 }}>
            {fotos.map((url, index) => {
              return <ItemFoto identificador={url} index={index} onPress={this.onFotoPress} />;
            })}
          </View>
        </ScrollView>
      </MiCardDetalle>
    );
  }

  renderVisorFotos() {
    if (this.state.datos == undefined) return null;
    const fotos = this.state.datos.fotos || [];
    const urls = [];

    for (let i = 0; i < fotos.length; i++) {
      urls.push(initData.urlCordobaFiles + "/" + fotos[i]);
    }

    return (
      <MiGaleria urls={urls} visible={this.state.visorFotosVisible == true} onClose={this.cerrarVisorFotos} index={0} />
    );
  }
}

const style = StyleSheet.create({
  contenedor: {
    width: "100%",
    height: "100%"
  },
  contenido: {
    flex: 1
  },
  card: {
    margin: 8,
    borderRadius: 16
  }
});

const texto_Titulo = "Detalle de requerimiento";
const texto_TituloDatos = "Datos básicos";
const texto_Servicio = "Servicio";
const texto_Motivo = "Motivo";
const texto_Descripcion = "Descripción";

const texto_Estado = "Último estado";
const texto_FechaEstado = "Fecha";
const texto_FechaAlta = "Fecha de creación";
const texto_EstadoObservaciones = "Observaciones del estado";

const texto_TituloUbicacion = "Ubicación";
const texto_Direccion = "Dirección";
const texto_Observaciones = "Observaciones del domicilio";
const texto_Cpc = "CPC";
const texto_Barrio = "Barrio";

const texto_BotonAbrirMapa = "Abrir mapa";

const texto_TituloImagenes = "Imágenes";

const texto_TituloInfoOrganica = "Área encargada";
const texto_InfoOrganicaArea = "Área";
const texto_InfoOrganicaDireccion = "Dirección";
const texto_InfoOrganicaSecretaria = "Secretaría";
const texto_InfoOrganicaDomicilio = "Domicilio";

const texto_BotonCancelar = "Cancelar requerimiento";
const texto_Cancelar = "¿Esta seguro de querer cancelar su requerimiento? Esta acción no se puede deshacer";

const texto_BotonEnviarComprobante = "Reenviar comprobante por e-mail";
