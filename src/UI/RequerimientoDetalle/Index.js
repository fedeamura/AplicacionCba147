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
import { Card } from "react-native-paper";
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WebImage from "react-native-web-image";
import openMap from 'react-native-open-maps';

//Mis componentes
import App from "@UI/App";
import MiStatusBar from "@Utils/MiStatusBar";
import MiToolbar from "@Utils/MiToolbar";

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
      error: undefined
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

  abrirImagen = (identificador) => {
    App.navegar('VisorFoto', { url: 'https://maps.googleapis.com/maps/api/staticmap?center=cordoba+argentina&zoom=13&scale=2&size=600x600&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7Ccordoba+argentina' });
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

                <View style={{ padding: 16 }}>

                  <Button
                    bordered
                    small
                    style={{
                      borderColor: 'green'
                    }}>
                    <Text style={{ color: 'green' }}>Cancelar requerimiento</Text>
                  </Button>
                </View>

                {/* Basicos */}
                <Text style={{ fontSize: 24, left: 24 }}></Text>
                <Card style={[style.card]}>

                  <View style={{ padding: 16 }}>

                    <Text style={{ fontWeight: 'bold' }}>Servicio</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Text>Alumbrado público</Text>
                    </View>

                    <Text style={{ marginTop: 16, fontWeight: 'bold' }}>Motivo</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Text>Foco roto</Text>
                    </View>

                    <Text style={{ marginTop: 16, fontWeight: 'bold' }}>Descripción</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Text>Test de la descripcion del requerimiento. Aca iria todo el texto que ingreso el vecino</Text>
                    </View>

                  </View>
                </Card>

                {/* Estado */}
                <Text style={{ fontSize: 24, left: 24, marginTop: 32 }}>Estado actual</Text>
                <Card style={[style.card]}>

                  <View style={{ padding: 16 }}>

                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ width: 16, height: 16, borderRadius: 16, backgroundColor: 'red', marginRight: 8 }}></View>
                      <Text style={{ fontSize: 20 }}>Nuevo</Text>
                    </View>

                    <Text style={{ fontWeight: 'bold', marginTop: 16 }}>Fecha de cambio de estado</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Text>10/10/2017 10:00</Text>
                    </View>

                    <Text style={{ fontWeight: 'bold', marginTop: 16 }}>Motivo</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Text>Motivo del estado actual</Text>
                    </View>

                  </View>
                </Card>


                {/* Ubicacion */}
                <Text style={{ fontSize: 24, left: 24, marginTop: 32 }}>Ubicación</Text>
                <Card style={[style.card]}>

                  <View style={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    <Text style={{ fontSize: 16 }}>Independencia 710, Cordoba Cordoba</Text>
                  </View>
                  <View style={{ padding: 16, display: 'flex', flexDirection: 'row' }}>

                    <View style={{ flex: 1 }}>

                      <Text style={{ fontWeight: 'bold' }}>CPC</Text>
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Nº 10 - Central</Text>
                      </View>

                      <Text style={{ fontWeight: 'bold', marginTop: 16 }}>Barrio</Text>
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Nueva Córdoba</Text>
                      </View>
                    </View>

                    <WebImage
                      resizeMode="cover"
                      style={{ width: 104, height: 104, borderRadius: 16 }}
                      source={{ uri: urlMapa }}
                    />
                  </View>

                  <View style={{ width: '100%', height: 1, backgroundColor: 'black', opacity: 0.2, marginTop: 16 }}></View>
                  <View style={{ padding: 16 }}>
                    <Button
                      bordered
                      small
                      onPress={this.abrirMapa}
                      style={{
                        borderColor: 'green',
                        alignSelf: 'flex-end'
                      }}
                    ><Text style={{ color: 'green' }}>Abrir mapa</Text></Button>
                  </View>

                </Card>

                {/* Imagenes */}
                <Text style={{ fontSize: 24, left: 24, marginTop: 32 }}>Imágenes</Text>
                <Card style={[style.card]}>

                  <View style={{ padding: 16 }}>

                    <View style={{ width: 104, height: 104, borderRadius: 16, overflow: 'hidden' }}>
                      <TouchableOpacity onPress={() => this.abrirImagen()}>
                        <WebImage
                          resizeMode="cover"
                          style={{ width: '100%', height: '100%' }}
                          source={{ uri: urlMapa }}
                        />
                      </TouchableOpacity>

                    </View>
                  </View>
                </Card>

                {/* Informacion organica */}
                <Text style={{ fontSize: 24, left: 24, marginTop: 32 }}>Area encargada</Text>
                <Card style={[style.card]}>
                  <View style={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    <Text style={{ fontSize: 16 }}>Alumbrado público</Text>
                  </View>

                  <View style={{ padding: 16 }}>

                    <Text style={{ fontWeight: 'bold' }}>Responsable</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="account" style={{ fontSize: 18, marginRight: 4 }} />
                      <Text>Federico Gabriel Amura</Text>
                    </View>

                    <Text style={{ marginTop: 16, fontWeight: 'bold' }}>Teléfono</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="phone" style={{ fontSize: 18, marginRight: 4 }} />
                      <Text>3517449132</Text>
                    </View>
                  </View>
                </Card>


                {/* Informacion adicional */}
                <Text style={{ fontSize: 24, left: 24, marginTop: 32 }}>Información adicional</Text>
                <Card style={[style.card]}>

                  <View style={{ padding: 16 }}>

                    <Text style={{ fontWeight: 'bold' }}>Fecha de Creación</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="account" style={{ fontSize: 18, marginRight: 4 }} />
                      <Text>10/10/2017 10:00</Text>
                    </View>

                  </View>
                </Card>

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
      </View >
    );
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

