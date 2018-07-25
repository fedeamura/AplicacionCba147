import React from "react";
import {
  View,
  Animated,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity
} from "react-native";
import { Text, Spinner, Button } from 'native-base'
import LinearGradient from 'react-native-linear-gradient';
import WebImage from "react-native-web-image";
import openMap from 'react-native-open-maps';

//Mis componentes
import App from "@UI/App";
import MiStatusBar from "@Utils/MiStatusBar";
import MiToolbar from "@Utils/MiToolbar";
import MiCardDetalle from '@Utils/MiCardDetalle';
import MiItemDetalle from '@Utils/MiItemDetalle';
import MiGaleria from '@Utils/MiGaleria';

//Rules
import Rules_Requerimiento from '@Rules/Rules_Requerimiento';

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
      error: undefined,
      imagenes: [
        "https://i1.wp.com/www.roshfrans.com/wp-content/uploads/2015/08/Bache3.png?zoom=2&resize=1277%2C547",
        "https://lasillarota.blob.core.windows.net.optimalcdn.com/images/2017/01/22/98710_bache13_focus_0_0_480_345.jpg",
        "https://lucidezheterogenea.files.wordpress.com/2016/06/bache.jpg?w=496&h=299&crop=1",
        "https://lasillarota.blob.core.windows.net.optimalcdn.com/images/2017/01/22/98710_bache13_focus_0_0_480_345.jpg",
        "https://lasillarota.blob.core.windows.net.optimalcdn.com/images/2017/01/22/98710_bache13_focus_0_0_480_345.jpg",
        "https://lasillarota.blob.core.windows.net.optimalcdn.com/images/2017/01/22/98710_bache13_focus_0_0_480_345.jpg",
        "https://lasillarota.blob.core.windows.net.optimalcdn.com/images/2017/01/22/98710_bache13_focus_0_0_480_345.jpg",
        "https://lasillarota.blob.core.windows.net.optimalcdn.com/images/2017/01/22/98710_bache13_focus_0_0_480_345.jpg",
      ]

    };

    this.animContenido = new Animated.Value(0);
    this.keyboardHeight = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  componentDidMount() {
    this.buscarDatos();
  }

  buscarDatos = () => {

    this.setState({ cargando: true }, () => {
      Animated.timing(this.animContenido, { toValue: 0, duration: 300 }).start(() => {

        Rules_Requerimiento.getDetalle(this.state.id)
          .then((data) => {
            this.setState({ cargando: false, datos: data }, () => {
              Animated.timing(this.animContenido, { toValue: 1, duration: 300 }).start();
            });
          })
          .catch((error) => {
            this.setState({ cargando: false, datos: undefined, error: error }, () => {
              Animated.timing(this.animContenido, { toValue: 1, duration: 300 }).start();
            });
          });
      });
    });
  }

  keyboardWillShow = (event) => {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
    }).start();
  }

  keyboardWillHide = (event) => {
    this.teclado = false;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start();
  }

  abrirImagen = (identificador, index) => {
    this.setState({ visorImagenesVisible: true, indexImagenVisible: index });
  }

  abrirMapa = () => {
    openMap({ latitude: -31.414965, longitude: -64.190731, query: 'Ubicación de su requerimiento' });
  }

  render() {
    const initData = global.initData;

    const urlMapa = 'https://maps.googleapis.com/maps/api/staticmap?center=cordoba+argentina&zoom=13&scale=2&size=600x600&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7Ccordoba+argentina';

    return (
      <View style={style.contenedor} >

        <MiStatusBar />

        <MiToolbar
          titulo={texto_Titulo}
          onBackPress={() => { App.goBack(); }}
        />

        {/* Contenido */}
        < View style={[style.contenido, { backgroundColor: initData.backgroundColor }]} >

          <ScrollView
            contentContainerStyle={{}}>

            <View style={{ padding: 16 }}>

              <Animated.View style={{
                position: 'absolute',
                margin: 16,
                left: 0,
                right: 0,
                top: 0,
                opacity: this.animContenido.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0]
                })
              }}>
                <Spinner color="green" />
              </Animated.View>

              <Animated.View style={{ opacity: this.animContenido }} >

                {/* Encabezado */}
                <View style={{ marginLeft: 24, marginTop: 32 }}>
                  <Text style={{ fontSize: 32 }}>QAZWSX/2018</Text>
                </View>


                {/* Basicos */}
                <MiCardDetalle>
                  <MiItemDetalle titulo='Servicio' subtitulo='Alumbrado público' />
                  <View style={{ height: 16 }} />
                  <MiItemDetalle titulo='Motivo' subtitulo='Foco roto' />
                  <View style={{ height: 16 }} />
                  <MiItemDetalle titulo='Descripción' subtitulo='Test de la descripcion del requerimiento. Aca iria todo el texto que ingreso el vecino' />
                </MiCardDetalle>

                {/* Estado */}
                <MiCardDetalle titulo='Estado actual'>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 16, height: 16, borderRadius: 16, backgroundColor: 'red', marginRight: 8 }}></View>
                    <Text style={{ fontSize: 20 }}>Nuevo</Text>
                  </View>
                  <View style={{ height: 16 }} />
                  <MiItemDetalle titulo='Fecha' subtitulo='10/10/2018 10:00' />
                  <View style={{ height: 16 }} />
                  <MiItemDetalle titulo='Motivo' subtitulo='Motivo del cambio de estado al actual' />
                </MiCardDetalle>

                {/* Ubicacion */}
                <MiCardDetalle titulo='Ubicación' botones={[
                  { texto: 'Abrir mapa', onPress: () => { this.abrirMapa(); } }
                ]}>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                      <MiItemDetalle titulo='Direccion' subtitulo='Independencia 710 4f' />
                      <View style={{ height: 16 }} />
                      <MiItemDetalle titulo='Observaciones' subtitulo='13b arriba de la perla' />
                      <View style={{ height: 16 }} />
                      <MiItemDetalle titulo='CPC' subtitulo='Nº 10 - Central' />
                      <View style={{ height: 16 }} />
                      <MiItemDetalle titulo='Barrio' subtitulo='Centro' />
                    </View>
                    <WebImage
                      resizeMode="cover"
                      style={{ width: 104, height: 104, borderRadius: 16 }}
                      source={{ uri: urlMapa }}
                    />
                  </View>

                </MiCardDetalle>

                {/* Imagenes */}
                {this.renderImagenes()}

                {/* Informacion organica */}
                <MiCardDetalle titulo='Area encargada'>
                  <MiItemDetalle titulo='Area' subtitulo='Alumbrado publico' />
                  <View style={{ height: 16 }} />
                  <MiItemDetalle titulo='Responsable' subtitulo='Federico Amura' />
                  <View style={{ height: 16 }} />
                  <MiItemDetalle titulo='Dirección' subtitulo='Municipalidad de Cordoba. Oficina 3' />
                  <View style={{ height: 16 }} />
                  <MiItemDetalle titulo='Teléfono' subtitulo='3517449132' />
                </MiCardDetalle>


                {/* Informacion adicional */}
                <MiCardDetalle titulo='Información adicional'>
                  <MiItemDetalle titulo='Fecha de creación' subtitulo='10/10/2018 10:00' />
                </MiCardDetalle>

                <View style={{
                  padding: 16,
                  marginTop: 32,
                  width: '100%'
                }}>

                  <Button
                    bordered
                    small
                    style={{
                      borderColor: '#D32F2F',
                      alignSelf: 'center'
                    }}>
                    <Text style={{ color: '#D32F2F', }}>Cancelar requerimiento</Text>
                  </Button>
                </View>

              </Animated.View>

            </View>

          </ScrollView>

          {/* Sombra del toolbar */}
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
            backgroundColor="transparent"
            style={{ left: 0, top: 0, right: 0, height: 16, position: 'absolute' }}
            pointerEvents="none" />
        </View >

        {/* Keyboard */}
        < Animated.View style={[{ height: '100%' }, { maxHeight: this.keyboardHeight }]} ></Animated.View >

        {/* Galeria de imagenes */}
        <MiGaleria
          urls={this.state.imagenes}
          visible={this.state.visorImagenesVisible == true}
          onClose={() => { this.setState({ visorImagenesVisible: false }) }}
          index={this.state.indexImagenVisible} />

      </View >
    );
  }

  renderImagenes() {

    return <MiCardDetalle titulo='Imágenes' padding={false}>

      <ScrollView horizontal={true}>

        <View style={{ display: 'flex', flexDirection: 'row', padding: 8 }}>
          {
            this.state.imagenes.map((url, index) => {

              return (
                <TouchableOpacity
                  onPress={() => this.abrirImagen(url, index)}
                  style={{ width: 104, height: 104, borderRadius: 16, overflow: 'hidden', margin: 8 }}>
                  <View style={{ width: 104, height: 104, borderRadius: 16, overflow: 'hidden', backgroundColor: '#ccc' }}>
                    <WebImage
                      resizeMode="cover"
                      style={{ width: '100%', height: '100%' }}
                      source={{ uri: url }}
                    />
                  </View>
                </TouchableOpacity>)

            })
          }

        </View>
      </ScrollView>

    </MiCardDetalle>

  }
}


const style = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%'
  },
  contenido: {
    flex: 1
  },
  card: {
    margin: 8,
    borderRadius: 16
  }
});

const texto_Titulo = 'Detalle de requerimiento';

