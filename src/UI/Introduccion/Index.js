import React from "react";
import {
  StyleSheet,
  View,
  Animated,
} from "react-native";
import {
  Button,
  Text
} from "native-base";
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import backAndroid, {
  hardwareBackPress,
  exitApp
} from 'react-native-back-android'

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

  handleHardwareBackPress = () => {
    const { params } = this.props.navigation.state;
    if (params != undefined && params.callback != undefined) {
      return true;
    }
    return false;
  };

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

    let paso = this.state.paso + 1;
    this.setState({ paso: paso }, () => {
      this.viewPager.setPage(paso);
    });
  }

  render() {
    return (
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <IndicatorViewPager
          ref={(ref) => { this.viewPager = ref }}
          style={{ height: '100%' }}

          onPageSelected={(paso) => {
            this.setState({ paso: paso.position })
          }}
          indicator={this._renderDotIndicator()}
        >
          {this.renderPagina1()}
          {this.renderPagina2()}
          {this.renderPagina3()}
          {this.renderPagina4()}
        </IndicatorViewPager>
      </View>
    );
  }


  _renderDotIndicator() {
    return <PagerDotIndicator pageCount={4} />;
  }

  renderPagina1() {
    return <View
      key={1}
      style={[styles.pagina1, { backgroundColor: '#0c935e' }]}>

      <View style={{
        marginTop: 32,
        borderRadius: 400,
        overflow: 'hidden',
        height: 250,
        width: 250,
        alignSelf: 'center'
      }}>
        <WebImage
          style={{ height: '100%', width: '100%' }}
          resizeMode='contain'
          source={require("@Resources/cba147_logo.png")} />
      </View>


      <View style={styles.content}>
        <Text style={{ fontSize: 32, marginTop: 16, color: 'white', alignSelf: 'center' }}>¿Que es #CBA147?</Text>
        <Text style={{ fontSize: 20, marginTop: 16, color: 'white', alignSelf: 'center', textAlign: 'center' }}>Es una plataforma de atención al vecino que nos permite mejorar la ciudad de manera colaborativa.</Text>
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

      <View style={{
        marginTop: 32,
        borderRadius: 400,
        overflow: 'hidden',
        height: 250,
        width: 250,
        alignSelf: 'center',
        backgroundColor: 'white'
      }}>
        <WebImage
          style={{ height: '100%', width: '100%' }}
          resizeMode='contain'
          source={{ uri: 'https://assets.pcmag.com/media/images/535420-the-best-call-center-features-for-small-and-midsize-businesses.jpg?thumb=y&width=810&height=456' }} />
      </View>

      <View style={styles.content}>
        <Text style={{ fontSize: 32, marginTop: 16, color: 'white', alignSelf: 'center' }}>La muni te escucha</Text>
        <Text style={{ fontSize: 20, marginTop: 16, color: 'white', alignSelf: 'center', textAlign: 'center', }}>Es un sistema sistema sistema sistema sistema sistema sistema sistema sistema sistema sistema sistema </Text>
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

      <View style={{
        marginTop: 32,
        borderRadius: 400,
        overflow: 'hidden',
        height: 250,
        width: 250,
        alignSelf: 'center',
        backgroundColor: 'white'
      }}>
        <WebImage
          style={{ height: '100%', width: '100%' }}
          resizeMode='contain'
          source={{ uri: 'https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX17558788.jpg' }} />
      </View>

      <View style={styles.content}>
        <Text style={{ fontSize: 32, marginTop: 16, color: 'white', alignSelf: 'center' }}>La muni trabaja</Text>
        <Text style={{ fontSize: 20, marginTop: 16, color: 'white', alignSelf: 'center', textAlign: 'center' }}>Es un sistema sistema sistema sistema sistema sistema sistema sistema sistema sistema sistema sistema </Text>
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

      <View style={{
        marginTop: 32,
        borderRadius: 400,
        overflow: 'hidden',
        height: 250,
        width: 250,
        alignSelf: 'center',
        backgroundColor: 'white'
      }}>
        <WebImage
          style={{ height: '100%', width: '100%' }}
          resizeMode='contain'
          source={{ uri: 'https://thumbs.dreamstime.com/b/online-communication-flat-illustration-icons-eps-42144829.jpg' }} />
      </View>


      <View style={styles.content}>
        <Text style={{ fontSize: 32, marginTop: 16, color: 'white', alignSelf: 'center' }}>La muni responde</Text>
        <Text style={{ fontSize: 20, marginTop: 16, color: 'white', alignSelf: 'center', textAlign: 'center' }}>Enterate del avance de tus requerimientos a traves de nuestra Web y App</Text>
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
    paddingBottom: 32
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
    alignSelf: 'center'
  }
});

const texto_Titulo = 'Introducción';
