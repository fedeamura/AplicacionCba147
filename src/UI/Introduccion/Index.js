import React from "react";
import {
  StyleSheet,
  View,
  Alert,
  Animated,
  ScrollView,
} from "react-native";
import {
  Button,
  Text
} from "native-base";
import {
  Card,
  CardContent,
} from 'react-native-paper';

//Mis componentes
import App from "Cordoba/src/UI/App";
import MiStatusBar from '@Utils/MiStatusBar';
import WebImage from "react-native-web-image";

//Rules
import Rules_Ajustes from '@Rules/Rules_Ajustes';

export default class Introduccion extends React.Component {
  static navigationOptions = {
    title: texto_Titulo,
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      paso: 0,
      animando: false
    };

    this.anim = new Animated.Value(1);
  }


  verSiguientePagina = () => {
    if (this.state.paso == 3) {
      Rules_Ajustes.setIntroVista();
      const { params } = this.props.navigation.state;
      if (params != undefined && params.callback != undefined) {
        params.callback();
      }

      App.goBack();
      return;
    }

    this.setState({ animando: true }, () => {
      Animated.timing(this.anim, { toValue: 0, duration: 500 }).start(() => {
        this.setState({ paso: this.state.paso + 1 }, () => {
          Animated.timing(this.anim, { toValue: 1, duration: 500 }).start(() => {
            this.setState({ animando: false });
          });
        });
      });
    });
  }

  render() {
    const initData = global.initData;

    let view = undefined;
    switch (this.state.paso) {
      case 0: {
        view = this.renderPagina1();
      } break;
      case 1: {
        view = this.renderPagina2();
      } break;
      case 2: {
        view = this.renderPagina3();
      } break;
      case 3: {
        view = this.renderPagina4();
      } break;
    }


    return (
      <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]} >

        {/* StatusBar */}
        <MiStatusBar />

        {/* Contenido */}
        <Animated.View style={{ opacity: this.anim }}>
          {view}
        </Animated.View>

      </View>
    );
  }

  renderPagina1() {
    return <View
      key={1}
      style={[styles.pagina1, { backgroundColor: '#0c935e' }]}>

      <WebImage
        style={{ height: 300, width: '100%', position: 'absolute', left: 0, right: 0, top: 0 }}
        resizeMode='cover'
        source={{ uri: 'https://i2.wp.com/www.cordoba.gob.ar/wp-content/uploads/2016/07/Palacio-Municipal-6-de-Julio.jpg?resize=1000%2C662&ssl=1' }} />


      <View style={styles.content}>
        <Text style={{ fontSize: 32, marginTop: 300, color: 'white' }}>¿Que es #CBA147?</Text>
        <Text style={{ fontSize: 20, marginTop: 16, color: 'white' }}>Es una plataforma de atención al vecino que nos permite mejorar la ciudad de manera colaborativa.</Text>
      </View>
      <View style={styles.footer}>
        <Button
          bordered
          disabled={this.state.animando}
          onPress={this.verSiguientePagina}
          style={[styles.btnSiguiente, { borderColor: 'white' }]}>
          <Text style={{ color: 'white' }}>Siguiente</Text></Button>
      </View>
    </View>
  }

  renderPagina2() {
    return <View
      key={2}
      style={[styles.pagina1, { backgroundColor: '#6d868b' }]}>

      <WebImage
        style={{ height: 300, width: '100%', position: 'absolute', left: 0, right: 0, top: 0 }}
        resizeMode='cover'
        source={{ uri: 'https://assets.pcmag.com/media/images/535420-the-best-call-center-features-for-small-and-midsize-businesses.jpg?thumb=y&width=810&height=456' }} />

      <View style={styles.content}>
        <Text style={{ fontSize: 32, marginTop: 300, color: 'white' }}>La muni te escucha</Text>
        <Text style={{ fontSize: 20, marginTop: 16, color: 'white' }}>Es un sistema sistema sistema sistema sistema sistema sistema sistema sistema sistema sistema sistema </Text>
      </View>
      <View style={styles.footer}>
        <Button
          bordered
          disabled={this.state.animando}
          onPress={this.verSiguientePagina}
          style={[styles.btnSiguiente, { borderColor: 'white' }]}>
          <Text style={{ color: 'white' }}>Siguiente</Text></Button>
      </View>
    </View>
  }



  renderPagina3() {
    return <View
      key={3}
      style={[styles.pagina1, { backgroundColor: '#e68f2a' }]}>

      <WebImage
        style={{ height: 300, width: '100%', position: 'absolute', left: 0, right: 0, top: 0 }}
        resizeMode='cover'
        source={{ uri: 'https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX17558788.jpg' }} />


      <View style={styles.content}>
        <Text style={{ fontSize: 32, marginTop: 300, color: 'white' }}>La muni trabaja</Text>
        <Text style={{ fontSize: 20, marginTop: 16, color: 'white' }}>Es un sistema sistema sistema sistema sistema sistema sistema sistema sistema sistema sistema sistema </Text>
      </View>
      <View style={styles.footer}>
        <Button
          bordered
          disabled={this.state.animando}
          onPress={this.verSiguientePagina}
          style={[styles.btnSiguiente, { borderColor: 'white' }]}>
          <Text style={{ color: 'white' }}>Siguiente</Text></Button>
      </View>
    </View>
  }

  renderPagina4() {
    return <View
      key={4}
      style={[styles.pagina1, { backgroundColor: '#56beea' }]}>

      <WebImage
        style={{ height: 300, width: '100%', position: 'absolute', left: 0, right: 0, top: 0 }}
        resizeMode='cover'
        source={{ uri: 'https://thumbs.dreamstime.com/b/online-communication-flat-illustration-icons-eps-42144829.jpg' }} />


      <View style={styles.content}>
        <Text style={{ fontSize: 32, marginTop: 300, color: 'white' }}>La muni responde</Text>
        <Text style={{ fontSize: 20, marginTop: 16, color: 'white' }}>Enterate del avance de tus requerimientos a traves de nuestra Web y App</Text>
      </View>
      <View style={styles.footer}>
        <Button
          bordered
          disabled={this.state.animando}
          onPress={this.verSiguientePagina}
          style={[styles.btnSiguiente, { borderColor: 'white' }]}>
          <Text style={{ color: 'white' }}>Entendido, Ir a #CBA147</Text></Button>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  contenedor: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  pagina1: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 32,
    display: 'flex',
    flex: 1
  },
  footer: {
    padding: 16
  },
  btnSiguiente: {
    alignSelf: 'flex-end'
  }
});

const texto_Titulo = 'Introducción';
